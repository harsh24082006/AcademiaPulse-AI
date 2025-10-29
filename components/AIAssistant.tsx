import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { Student, AttendanceRecord, Course, AttendanceStatus } from '../types';
import SendIcon from './icons/SendIcon';
import SparklesIcon from './icons/SparklesIcon';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface AIAssistantProps {
  students: Student[];
  attendanceRecord: AttendanceRecord;
  course: Course;
  date: string;
}

function formatAttendanceDataForPrompt(students: Student[], attendanceRecord: AttendanceRecord, course: Course, date: string): string {
  const presentStudents = students.filter(s => attendanceRecord[s.id] === AttendanceStatus.Present).map(s => `- ${s.name} (${s.rollNumber})`);
  const absentStudents = students.filter(s => attendanceRecord[s.id] === AttendanceStatus.Absent).map(s => `- ${s.name} (${s.rollNumber})`);
  const unmarkedStudents = students.filter(s => !attendanceRecord[s.id] || attendanceRecord[s.id] === AttendanceStatus.Unmarked).map(s => `- ${s.name} (${s.rollNumber})`);

  const attendanceSummary = `
Present Students (${presentStudents.length}):
${presentStudents.length > 0 ? presentStudents.join('\n') : '- None'}

Absent Students (${absentStudents.length}):
${absentStudents.length > 0 ? absentStudents.join('\n') : '- None'}

Unmarked Students (${unmarkedStudents.length}):
${unmarkedStudents.length > 0 ? unmarkedStudents.join('\n') : '- None'}
`;

  return `You are a helpful AI assistant for a college professor. Your goal is to answer questions about student attendance based on the data provided below. Be concise, professional, and helpful.

Current Context:
- Course: ${course.name} (${course.code})
- Date: ${date}
- Total Students: ${students.length}

Current Attendance Data:
${attendanceSummary}
`;
}


const AIAssistant: React.FC<AIAssistantProps> = ({ students, attendanceRecord, course, date }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatRef = useRef<Chat | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const createSystemPrompt = useCallback(() => {
    return formatAttendanceDataForPrompt(students, attendanceRecord, course, date);
  }, [students, attendanceRecord, course, date]);

  useEffect(() => {
    // FIX: Per guidelines, removed explicit API key check to assume it is pre-configured.
    // The assistant will now show an error only after a failed API call.
    setError(null);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    chatRef.current = ai.chats.create({
      model: 'gemini-flash-lite-latest',
      config: {
        systemInstruction: createSystemPrompt(),
      }
    });
    setMessages([{ role: 'model', text: `Hello! I'm your AI assistant for ${course.name}. How can I help you with today's attendance?` }]);
  }, [createSystemPrompt, course.name]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chatRef.current || isLoading) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);
    setError(null); // Clear previous errors

    try {
      const stream = await chatRef.current.sendMessageStream({ message: currentInput });
      
      let modelResponse = '';
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      for await (const chunk of stream) {
        modelResponse += chunk.text;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text = modelResponse;
          return newMessages;
        });
      }

    } catch (e: any) {
        console.error(e);
        // FIX: Improved error message handling to be more user-friendly and disable input on critical API key errors.
        let errorMessage = e.message || "An unexpected error occurred.";
        if (errorMessage.toLowerCase().includes('api key')) {
            errorMessage = "The AI Assistant is unavailable due to an API key error. Please check your configuration."
        }
        setError(errorMessage);
        setMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            // Update the streaming placeholder with an error message
            if(lastMessage.role === 'model' && lastMessage.text === '') {
                lastMessage.text = 'Sorry, I couldn\'t process that request due to an error.';
            } else {
                newMessages.push({role: 'model', text: 'Sorry, I couldn\'t process that request due to an error.'})
            }
            return newMessages;
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md flex flex-col">
      <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-100">AI Assistant</h2>
      
      {error && <p className="text-sm text-center text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/50 p-2 rounded-md mb-2">{error}</p>}

      <div ref={chatContainerRef} className="flex-1 h-80 overflow-y-auto pr-2 space-y-4 mb-4 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
              msg.role === 'user' 
                ? 'bg-indigo-500 text-white' 
                : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-start gap-2'
            }`}>
              {msg.role === 'model' && <SparklesIcon className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />}
              <span>{msg.text}{isLoading && msg.role === 'model' && index === messages.length -1 && '...' }</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
          placeholder="Ask about attendance..."
          // FIX: Updated disabled logic to handle critical API key errors gracefully.
          disabled={isLoading || (!!error && error.toLowerCase().includes('api key'))}
          className="flex-1 w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 disabled:opacity-50"
          aria-label="Chat input"
        />
        <button
          onClick={handleSend}
          // FIX: Updated disabled logic to handle critical API key errors gracefully.
          disabled={isLoading || !input.trim() || (!!error && error.toLowerCase().includes('api key'))}
          className="p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 dark:disabled:bg-indigo-800 disabled:cursor-not-allowed transition-colors"
          aria-label="Send message"
        >
          {isLoading ? 
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg> :
            <SendIcon className="w-5 h-5"/>
          }
        </button>
      </div>
    </div>
  );
};

export default AIAssistant;