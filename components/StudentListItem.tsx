import React from 'react';
import { Student, AttendanceStatus } from '../types';
import CheckIcon from './icons/CheckIcon';
import XIcon from './icons/XIcon';
import TrashIcon from './icons/TrashIcon';

interface StudentListItemProps {
  student: Student;
  status: AttendanceStatus;
  onStatusChange: (status: AttendanceStatus) => void;
  onRemove: () => void;
}

const StudentListItem: React.FC<StudentListItemProps> = ({ student, status, onStatusChange, onRemove }) => {
  const isPresent = status === AttendanceStatus.Present;
  const isAbsent = status === AttendanceStatus.Absent;

  return (
    <div className="p-4 flex flex-col sm:flex-row items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
      <div className="mb-2 sm:mb-0 text-center sm:text-left flex-grow">
        <p className="font-medium text-slate-900 dark:text-slate-100">{student.name}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{student.rollNumber}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onStatusChange(AttendanceStatus.Present)}
          className={`w-24 flex items-center justify-center p-2 rounded-md text-sm font-semibold transition-all duration-150 ${
            isPresent
              ? 'bg-green-500 text-white shadow-md'
              : 'bg-slate-200 text-slate-600 hover:bg-green-200 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-green-500/50'
          }`}
        >
          <CheckIcon className="w-5 h-5 mr-1"/>
          Present
        </button>
        <button
          onClick={() => onStatusChange(AttendanceStatus.Absent)}
          className={`w-24 flex items-center justify-center p-2 rounded-md text-sm font-semibold transition-all duration-150 ${
            isAbsent
              ? 'bg-red-500 text-white shadow-md'
              : 'bg-slate-200 text-slate-600 hover:bg-red-200 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-red-500/50'
          }`}
        >
          <XIcon className="w-5 h-5 mr-1"/>
          Absent
        </button>
        <button
          onClick={onRemove}
          aria-label={`Remove student ${student.name}`}
          className="p-2 rounded-md text-slate-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50 dark:hover:text-red-400 transition-colors"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default StudentListItem;