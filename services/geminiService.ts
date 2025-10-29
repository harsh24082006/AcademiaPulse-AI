import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { Student, AttendanceData, Course, AttendanceStatus, AttendanceRecord } from '../types';

// FIX: Removed explicit API key check per guidelines to assume it is pre-configured.

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const handleGeminiError = (error: any, context: string): never => {
    console.error(`Error in ${context}:`, error);
    let message = `An unexpected error occurred in ${context}.`;
    if (error.message) {
        if (error.message.includes('API key not valid')) {
            message = `AI Error in ${context}: The provided API key is not valid. Please check your configuration.`;
        } else if (error.message.includes('response was blocked')) {
             message = `AI Error in ${context}: The model's response was blocked. This may be due to the prompt content or safety settings.`;
        } else {
            message = `AI Error in ${context}: ${error.message}`;
        }
    }
    throw new Error(message);
}

const formatDailyAttendance = (students: Student[], dailyRecord: AttendanceRecord): string => {
  const present = students.filter(s => dailyRecord[s.id] === AttendanceStatus.Present).map(s => s.name);
  const absent = students.filter(s => dailyRecord[s.id] === AttendanceStatus.Absent).map(s => s.name);
  return `Present (${present.length}): ${present.join(', ') || 'None'}. Absent (${absent.length}): ${absent.join(', ') || 'None'}.`;
};

export const generateEnhancedAttendanceReport = async (
  students: Student[],
  attendanceData: AttendanceData,
  course: Course,
  date: string
): Promise<string> => {
  try {
      const dailyRecord = attendanceData[date]?.[course.id] || {};
      const attendanceSummary = formatDailyAttendance(students, dailyRecord);
      
      const sevenDaysAgo = new Date(date);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
      
      const trendData: string[] = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(sevenDaysAgo);
        d.setDate(d.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];
        const record = attendanceData[dateStr]?.[course.id] || {};
        const presentCount = Object.values(record).filter(s => s === AttendanceStatus.Present).length;
        trendData.push(`${dateStr}: ${presentCount}/${students.length} present`);
      }

      const prompt = `
    Analyze the following attendance data for the course "${course.name} (${course.code})". Produce the output in clean Markdown format.

    **Today's Attendance (${date}):**
    - Total Students: ${students.length}
    - ${attendanceSummary}

    **Last 7-Day Attendance Trend:**
    ${trendData.map(line => `- ${line}`).join('\n')}

    Based on this data, provide a concise report covering:
    1.  **Daily Summary:** A brief summary of today's attendance.
    2.  **Weekly Trend Analysis:** An observation on the 7-day trend (e.g., is attendance improving, declining, or stable?).
    3.  **Students of Note:** Identify any students who have been consistently absent if the data suggests it.

    Keep the report professional, brief, and insightful for a professor. Use headings for each section.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
            thinkingConfig: { thinkingBudget: 32768 }
        }
    });
    return response.text;
  } catch (error) {
    handleGeminiError(error, "generating enhanced report");
  }
};


export const parseBulkAddData = async (text: string): Promise<{ students: { name: string, rollNumber: string }[], courses: { name: string, code: string }[] }> => {
 try {
    const prompt = `
    Parse the following text to extract student names with their PRN/roll numbers, and subject names with their codes. The user might use words like 'student', 'subject', 'course', 'add', 'register', 'PRN', 'roll number', 'code'.

    Input text: "${text}"

    Respond with a JSON object.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
            students: {
                type: Type.ARRAY,
                items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    rollNumber: { type: Type.STRING },
                },
                required: ["name", "rollNumber"],
                },
            },
            courses: {
                type: Type.ARRAY,
                items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    code: { type: Type.STRING },
                },
                required: ["name", "code"],
                },
            },
            },
        },
        },
    });

    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr);
 } catch (error) {
     handleGeminiError(error, "parsing bulk data");
 }
};

export const generateStudentGroups = async (students: Student[], groupCount: number): Promise<{ name: string; rollNumber: string; }[][]> => {
 try {
    const studentList = students.map(s => `${s.name} (${s.rollNumber})`).join(', ');
    const prompt = `
    From the following list of students, create ${groupCount} balanced groups for a project. Try to distribute them evenly.

    Student list: ${studentList}

    Return the result as a JSON array of arrays, where each inner array represents a group of students. Each student should be an object with "name" and "rollNumber".
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.ARRAY,
            items: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                name: { type: Type.STRING },
                rollNumber: { type: Type.STRING },
                },
                required: ["name", "rollNumber"],
            },
            },
        },
        thinkingConfig: { thinkingBudget: 32768 }
        }
    });
    
    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr);
 } catch (error) {
     handleGeminiError(error, "generating student groups");
 }
};

export const generateFollowUpEmail = async (students: Student[], attendanceRecord: Record<string, AttendanceStatus>, course: Course, date: string): Promise<string> => {
    try {
        const absentStudents = students
            .filter(s => attendanceRecord[s.id] === AttendanceStatus.Absent)
            .map(s => s.name);
        
        if (absentStudents.length === 0) {
            return "No students were marked absent. No email needed.";
        }

        const prompt = `
        Draft a professional and supportive follow-up email to a group of students who were absent from a class.

        Context:
        - Course: ${course.name} (${course.code})
        - Date of Absence: ${date}
        - Absent Students: ${absentStudents.join(', ')}

        The email should:
        - Be addressed to the students.
        - Mention the course and date of absence.
        - Express concern and offer support.
        - Briefly mention that they missed the topic of [mention a placeholder topic, e.g., "Introduction to Linked Lists"].
        - Encourage them to catch up and reach out if they need help.
        - Be signed off by "The Professor".

        Generate only the body of the email. Do not include a subject line.
        `;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });

        return response.text;
    } catch(error) {
        handleGeminiError(error, "drafting follow-up email");
    }
};