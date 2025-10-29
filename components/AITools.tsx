import React, { useState, useCallback } from 'react';
import { Student, AttendanceRecord, Course, AttendanceStatus } from '../types';
import { generateStudentGroups, generateFollowUpEmail } from '../services/geminiService';
import SparklesIcon from './icons/SparklesIcon';
import UsersIcon from './icons/UsersIcon';
import EnvelopeIcon from './icons/EnvelopeIcon';

interface AIToolsProps {
  students: Student[];
  attendanceRecord: AttendanceRecord;
  course: Course;
  date: string;
}

type GeneratedGroup = { name: string; rollNumber: string };

const AITools: React.FC<AIToolsProps> = ({ students, attendanceRecord, course, date }) => {
  const [isGroupsLoading, setIsGroupsLoading] = useState(false);
  const [groupsError, setGroupsError] = useState<string | null>(null);
  const [groupCount, setGroupCount] = useState<number>(3);
  const [generatedGroups, setGeneratedGroups] = useState<GeneratedGroup[][]>([]);

  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [generatedEmail, setGeneratedEmail] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);
  
  const absentStudentCount = Object.values(attendanceRecord).filter(s => s === AttendanceStatus.Absent).length;

  const handleGenerateGroups = useCallback(async () => {
    setIsGroupsLoading(true);
    setGroupsError(null);
    setGeneratedGroups([]);
    try {
      if (groupCount > students.length) {
        throw new Error("Number of groups cannot be greater than the number of students.");
      }
      const result = await generateStudentGroups(students, groupCount);
      setGeneratedGroups(result);
    } catch (e: any) {
      setGroupsError(e.message || 'Failed to generate groups.');
      console.error(e);
    } finally {
      setIsGroupsLoading(false);
    }
  }, [students, groupCount]);

  const handleGenerateEmail = useCallback(async () => {
    setIsEmailLoading(true);
    setEmailError(null);
    setGeneratedEmail('');
    try {
      const result = await generateFollowUpEmail(students, attendanceRecord, course, date);
      setGeneratedEmail(result);
    } catch (e: any) {
      setEmailError(e.message || 'Failed to draft email.');
      console.error(e);
    } finally {
      setIsEmailLoading(false);
    }
  }, [students, attendanceRecord, course, date]);
  
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedEmail);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };


  const renderSpinner = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md space-y-6">
      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-3">AI Toolkit</h2>
      
      {/* Group Generator */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
            <UsersIcon className="w-6 h-6 text-indigo-500"/>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Group Generator</h3>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">Create balanced project groups from the full student list.</p>
        <div className="flex items-center gap-3">
            <label htmlFor="group-count" className="text-sm font-medium text-slate-700 dark:text-slate-300">Groups:</label>
            <input 
                type="number" 
                id="group-count"
                value={groupCount}
                onChange={(e) => setGroupCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-20 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                min="1"
                max={students.length}
            />
        </div>
        <button
            onClick={handleGenerateGroups}
            disabled={isGroupsLoading || students.length === 0}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:bg-indigo-300 disabled:cursor-not-allowed dark:disabled:bg-indigo-800 transition-colors"
        >
            {isGroupsLoading ? <>{renderSpinner()} Generating...</> : <><SparklesIcon className="w-5 h-5"/> Generate Groups</>}
        </button>
        {groupsError && <p className="text-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50 p-2 rounded-md">{groupsError}</p>}
        {generatedGroups.length > 0 && (
            <div className="mt-4 space-y-3 max-h-60 overflow-y-auto pr-2">
                {generatedGroups.map((group, index) => (
                    <div key={index} className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-md">
                        <p className="font-semibold text-sm text-slate-800 dark:text-slate-200 mb-2">Group {index + 1}</p>
                        <ul className="list-disc list-inside space-y-1">
                            {group.map((student) => (
                                <li key={student.rollNumber} className="text-xs text-slate-600 dark:text-slate-400">{student.name}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        )}
      </div>

      {/* Email Drafter */}
      <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
            <EnvelopeIcon className="w-6 h-6 text-indigo-500"/>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Follow-up Email Drafter</h3>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">Draft an email for the {absentStudentCount} absent student(s).</p>
        <button
            onClick={handleGenerateEmail}
            disabled={isEmailLoading || absentStudentCount === 0}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:bg-indigo-300 disabled:cursor-not-allowed dark:disabled:bg-indigo-800 transition-colors"
        >
            {isEmailLoading ? <>{renderSpinner()} Drafting...</> : <><SparklesIcon className="w-5 h-5"/> Draft Email</>}
        </button>
        {emailError && <p className="text-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50 p-2 rounded-md">{emailError}</p>}
        {generatedEmail && (
            <div className="mt-4 space-y-2">
                <textarea
                    readOnly
                    value={generatedEmail}
                    className="w-full h-40 p-2 text-sm font-mono bg-slate-50 dark:bg-slate-900/50 rounded-md border border-slate-300 dark:border-slate-700 focus:outline-none"
                    aria-label="Generated Email Draft"
                />
                <button
                    onClick={handleCopyToClipboard}
                    className="w-full text-sm py-1.5 px-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium rounded-md transition-colors"
                >
                    {isCopied ? 'Copied!' : 'Copy to Clipboard'}
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default AITools;