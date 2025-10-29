import { Student, Course, CollegeInfo, DepartmentInfo } from './types';

export const INITIAL_STUDENTS: Student[] = [
  { id: 's1', name: 'Alice Johnson', rollNumber: 'CSE001' },
  { id: 's2', name: 'Bob Williams', rollNumber: 'CSE002' },
  { id: 's3', name: 'Charlie Brown', rollNumber: 'CSE003' },
  { id: 's4', name: 'Diana Miller', rollNumber: 'ECE001' },
  { id: 's5', name: 'Ethan Davis', rollNumber: 'ECE002' },
];

export const INITIAL_COURSES: Course[] = [
  { id: 'c1', name: 'Data Structures', code: 'CS201' },
  { id: 'c2', name: 'Digital Logic Design', code: 'EC201' },
  { id: 'c3', name: 'Calculus III', code: 'MA201' },
];

export const INITIAL_COLLEGE_INFO: CollegeInfo = {
  name: "Global Institute of Technology",
  address: "123 Innovation Drive, Tech City",
  pincode: "12345",
  university: "State Technological University",
  isAutonomous: true,
  logoBase64: '',
};

export const INITIAL_DEPARTMENT_INFO: DepartmentInfo = {
    name: "Computer Science & Engineering",
    studentYear: "B.Tech Second Year",
    academicYear: "2024-2025"
};

export const getTodayDateString = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};