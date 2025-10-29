import React from 'react';
import { Student, AttendanceRecord, AttendanceStatus } from '../types';
import StudentListItem from './StudentListItem';

interface StudentListProps {
  students: Student[];
  attendance: AttendanceRecord;
  onAttendanceChange: (studentId: string, status: AttendanceStatus) => void;
  onMarkAll: (status: AttendanceStatus) => void;
  onRemoveStudent: (studentId: string) => void;
}

const StudentList: React.FC<StudentListProps> = ({ students, attendance, onAttendanceChange, onMarkAll, onRemoveStudent }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2 sm:mb-0">
          Student List
        </h2>
        <div className="flex gap-2">
            <button
                onClick={() => onMarkAll(AttendanceStatus.Present)}
                className="px-3 py-1 text-sm font-medium text-green-700 bg-green-100 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-900/80 rounded-md transition-colors"
            >
                Mark All Present
            </button>
            <button
                onClick={() => onMarkAll(AttendanceStatus.Absent)}
                className="px-3 py-1 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900/80 rounded-md transition-colors"
            >
                Mark All Absent
            </button>
        </div>
      </div>
      <div className="divide-y divide-slate-200 dark:divide-slate-700">
        {students.map((student) => (
          <StudentListItem
            key={student.id}
            student={student}
            status={attendance[student.id] || AttendanceStatus.Unmarked}
            onStatusChange={(status) => onAttendanceChange(student.id, status)}
            onRemove={() => onRemoveStudent(student.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default StudentList;