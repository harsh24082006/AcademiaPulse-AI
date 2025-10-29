
import React, { useMemo } from 'react';
import { AttendanceRecord, AttendanceStatus } from '../types';

interface DashboardProps {
  attendance: AttendanceRecord;
  totalStudents: number;
}

const Dashboard: React.FC<DashboardProps> = ({ attendance, totalStudents }) => {
  const stats = useMemo(() => {
    const present = Object.values(attendance).filter(status => status === AttendanceStatus.Present).length;
    const absent = Object.values(attendance).filter(status => status === AttendanceStatus.Absent).length;
    const unmarked = totalStudents - present - absent;
    const percentage = totalStudents > 0 ? (present / totalStudents) * 100 : 0;
    return { present, absent, unmarked, percentage };
  }, [attendance, totalStudents]);

  const getProgressBarColor = (percentage: number) => {
    if (percentage >= 75) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-100">Attendance Summary</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-lg">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Students</p>
          <p className="text-2xl font-bold">{totalStudents}</p>
        </div>
        <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-lg">
          <p className="text-sm text-green-600 dark:text-green-400">Present</p>
          <p className="text-2xl font-bold text-green-800 dark:text-green-300">{stats.present}</p>
        </div>
        <div className="bg-red-100 dark:bg-red-900/50 p-3 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">Absent</p>
          <p className="text-2xl font-bold text-red-800 dark:text-red-300">{stats.absent}</p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Unmarked</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-gray-300">{stats.unmarked}</p>
        </div>
      </div>
      <div className="mt-6">
        <div className="flex justify-between mb-1">
          <span className="text-base font-medium text-slate-700 dark:text-slate-300">Overall Attendance</span>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{stats.percentage.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full transition-all duration-500 ${getProgressBarColor(stats.percentage)}`}
            style={{ width: `${stats.percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;