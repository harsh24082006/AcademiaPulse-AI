import React, { useState } from 'react';
import UserPlusIcon from './icons/UserPlusIcon';
import BookOpenIcon from './icons/BookOpenIcon';
import SparklesIcon from './icons/SparklesIcon';
import TrashIcon from './icons/TrashIcon';
import { Course } from '../types';

type Tab = 'student' | 'course' | 'ai' | 'manage';

interface DataManagementProps {
  courses: Course[];
  onAddStudent: (name: string, rollNumber: string) => void;
  onAddCourse: (name: string, code: string) => void;
  onBulkAdd: (text: string) => Promise<void>;
  onRemoveCourse: (courseId: string) => void;
}

const DataManagement: React.FC<DataManagementProps> = ({ courses, onAddStudent, onAddCourse, onBulkAdd, onRemoveCourse }) => {
  const [activeTab, setActiveTab] = useState<Tab>('student');
  
  const [studentName, setStudentName] = useState('');
  const [studentPrn, setStudentPrn] = useState('');
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [bulkText, setBulkText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [bulkError, setBulkError] = useState<string | null>(null);

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentName.trim() && studentPrn.trim()) {
      onAddStudent(studentName.trim(), studentPrn.trim());
      setStudentName('');
      setStudentPrn('');
    }
  };

  const handleCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (courseName.trim() && courseCode.trim()) {
      onAddCourse(courseName.trim(), courseCode.trim());
      setCourseName('');
      setCourseCode('');
    }
  };

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkText.trim()) return;
    setIsProcessing(true);
    setBulkError(null);
    try {
      await onBulkAdd(bulkText.trim());
      setBulkText('');
    } catch (error: any) {
      setBulkError(error.message || 'An unexpected error occurred while processing your request.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const TabButton = ({ tab, icon, label }: { tab: Tab, icon: React.ReactNode, label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex-1 flex items-center justify-center gap-2 p-2 text-sm font-medium rounded-t-lg transition-colors ${
        activeTab === tab 
          ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500' 
          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md">
      <div className="flex bg-slate-50 dark:bg-slate-800/50 rounded-t-lg border-b border-slate-200 dark:border-slate-700">
        <TabButton tab="student" icon={<UserPlusIcon className="w-5 h-5"/>} label="Add Student" />
        <TabButton tab="course" icon={<BookOpenIcon className="w-5 h-5"/>} label="Add Subject" />
        <TabButton tab="ai" icon={<SparklesIcon className="w-5 h-5"/>} label="AI Bulk Add" />
        <TabButton tab="manage" icon={<TrashIcon className="w-5 h-5"/>} label="Manage" />
      </div>
      <div className="p-4">
        {activeTab === 'student' && (
          <form onSubmit={handleStudentSubmit} className="space-y-4">
            {/* Add Student Form */}
            <div>
              <label htmlFor="student-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Student Name</label>
              <input type="text" id="student-name" value={studentName} onChange={e => setStudentName(e.target.value)} required className="mt-1 w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g., John Doe" />
            </div>
            <div>
              <label htmlFor="student-prn" className="block text-sm font-medium text-slate-700 dark:text-slate-300">PRN Number</label>
              <input type="text" id="student-prn" value={studentPrn} onChange={e => setStudentPrn(e.target.value)} required className="mt-1 w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g., CSE123" />
            </div>
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Add Student
            </button>
          </form>
        )}
        {activeTab === 'course' && (
           <form onSubmit={handleCourseSubmit} className="space-y-4">
           {/* Add Course Form */}
            <div>
              <label htmlFor="course-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Subject Name</label>
              <input type="text" id="course-name" value={courseName} onChange={e => setCourseName(e.target.value)} required className="mt-1 w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g., Advanced Physics"/>
            </div>
            <div>
              <label htmlFor="course-code" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Subject Code</label>
              <input type="text" id="course-code" value={courseCode} onChange={e => setCourseCode(e.target.value)} required className="mt-1 w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g., PHY201" />
            </div>
             <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Add Subject
            </button>
          </form>
        )}
        {activeTab === 'ai' && (
           <form onSubmit={handleBulkSubmit} className="space-y-4">
            {/* AI Bulk Add Form */}
            <div>
              <label htmlFor="bulk-text" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Bulk Add Students & Subjects</label>
              <textarea id="bulk-text" value={bulkText} onChange={e => setBulkText(e.target.value)} rows={5} required className="mt-1 w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g., Add student Jane Smith with PRN ECE010. Also add subject 'Digital Logic' code DL101." />
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Enter students and subjects in plain text. The AI will parse and add them.</p>
            </div>
             {bulkError && <p className="text-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50 p-3 rounded-md">{bulkError}</p>}
             <button type="submit" disabled={isProcessing} className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400">
              {isProcessing ? 'Processing...' : <><SparklesIcon className="w-5 h-5"/> Process with AI</>}
            </button>
          </form>
        )}
        {activeTab === 'manage' && (
            <div className="space-y-3">
                <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">Manage Subjects</h3>
                {courses.length > 0 ? (
                    <div className="max-h-60 overflow-y-auto pr-2 space-y-2">
                        {courses.map(course => (
                            <div key={course.id} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700/50 rounded-md">
                                <div>
                                    <p className="font-medium text-sm text-slate-800 dark:text-slate-200">{course.name}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{course.code}</p>
                                </div>
                                <button
                                    onClick={() => onRemoveCourse(course.id)}
                                    aria-label={`Remove subject ${course.name}`}
                                    className="p-1.5 rounded-md text-slate-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50 dark:hover:text-red-400 transition-colors"
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">No subjects to manage.</p>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default DataManagement;