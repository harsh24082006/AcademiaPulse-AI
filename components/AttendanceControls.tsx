
import React from 'react';
import { Course } from '../types';

interface AttendanceControlsProps {
  courses: Course[];
  selectedCourse: Course;
  onCourseChange: (course: Course) => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
}

const AttendanceControls: React.FC<AttendanceControlsProps> = ({
  courses,
  selectedCourse,
  onCourseChange,
  selectedDate,
  onDateChange,
}) => {
  const handleCourseSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const course = courses.find(c => c.id === event.target.value);
    if (course) {
        onCourseChange(course);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md flex flex-col sm:flex-row gap-4 items-center">
      <div className="w-full sm:w-1/2">
        <label htmlFor="course-select" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Course
        </label>
        <select
          id="course-select"
          value={selectedCourse.id}
          onChange={handleCourseSelect}
          className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
        >
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.code} - {course.name}
            </option>
          ))}
        </select>
      </div>
      <div className="w-full sm:w-1/2">
        <label htmlFor="date-picker" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Date
        </label>
        <input
          type="date"
          id="date-picker"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
        />
      </div>
    </div>
  );
};

export default AttendanceControls;