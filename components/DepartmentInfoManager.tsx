import React, { useState, useEffect } from 'react';
import { DepartmentInfo } from '../types';
import BookOpenIcon from './icons/BookOpenIcon';

interface DepartmentInfoManagerProps {
  departmentInfo: DepartmentInfo;
  onInfoChange: (info: DepartmentInfo) => void;
}

const DepartmentInfoManager: React.FC<DepartmentInfoManagerProps> = ({ departmentInfo, onInfoChange }) => {
  const [formData, setFormData] = useState<DepartmentInfo>(departmentInfo);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setFormData(departmentInfo);
  }, [departmentInfo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setIsSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onInfoChange(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <BookOpenIcon className="w-6 h-6 text-indigo-500" />
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Department Configuration</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Department Name</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="mt-1 w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label htmlFor="studentYear" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Student Year / Class</label>
          <input type="text" id="studentYear" name="studentYear" value={formData.studentYear} onChange={handleChange} required placeholder="e.g., B.Tech Second Year" className="mt-1 w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label htmlFor="academicYear" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Academic Year</label>
          <input type="text" id="academicYear" name="academicYear" value={formData.academicYear} onChange={handleChange} required placeholder="e.g., 2024-2025" className="mt-1 w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400">
          {isSaved ? 'Saved!' : 'Save Department Info'}
        </button>
      </form>
    </div>
  );
};

export default DepartmentInfoManager;