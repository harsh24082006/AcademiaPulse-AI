import React, { useState, useCallback } from 'react';
import { Student, AttendanceData, Course, AttendanceStatus } from '../types';
import { generateEnhancedAttendanceReport } from '../services/geminiService';
import SparklesIcon from './icons/SparklesIcon';

interface ReportGeneratorProps {
  students: Student[];
  attendanceData: AttendanceData;
  course: Course;
  date: string;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ students, attendanceData, course, date }) => {
  const [report, setReport] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateReport = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setReport('');
    try {
      const generatedReport = await generateEnhancedAttendanceReport(students, attendanceData, course, date);
      setReport(generatedReport);
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred while generating the report.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [students, attendanceData, course, date]);

  const hasAttendanceData = Object.keys(attendanceData[date]?.[course.id] || {}).length > 0;

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-100">Enhanced AI Report</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        Get a daily summary and a 7-day attendance trend analysis for this course.
      </p>
      <button
        onClick={handleGenerateReport}
        disabled={isLoading || !hasAttendanceData}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:bg-indigo-300 disabled:cursor-not-allowed dark:disabled:bg-indigo-800 transition-colors"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing...
          </>
        ) : (
          <>
            <SparklesIcon className="w-5 h-5"/>
            Generate Enhanced Report
          </>
        )}
      </button>
      {!hasAttendanceData && <p className="text-sm text-center mt-2 text-slate-500 dark:text-slate-400">Mark some attendance on the selected date to generate a report.</p>}
      
      {error && <p className="mt-4 text-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50 p-3 rounded-md">{error}</p>}

      {report && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-slate-100">Generated Report:</h3>
          <div className="prose prose-sm dark:prose-invert max-w-none p-4 bg-slate-50 dark:bg-slate-900/50 rounded-md whitespace-pre-wrap font-sans">
            {report}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportGenerator;