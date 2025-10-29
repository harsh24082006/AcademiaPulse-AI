export enum AttendanceStatus {
  Present = 'PRESENT',
  Absent = 'ABSENT',
  Unmarked = 'UNMARKED',
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
}

// Attendance for a single course on a single day: { [studentId]: status }
export type AttendanceRecord = Record<string, AttendanceStatus>;

// Attendance for a course: { [courseId]: AttendanceRecord }
export type CourseAttendance = Record<string, AttendanceRecord>;

// All attendance data: { [dateString]: CourseAttendance }
export type AttendanceData = Record<string, CourseAttendance>;

export type Page = 'attendance' | 'data' | 'reports' | 'settings';

export interface CollegeInfo {
  name: string;
  address: string;
  pincode: string;
  university: string;
  isAutonomous: boolean;
  logoBase64?: string;
}

export interface DepartmentInfo {
  name: string;
  studentYear: string;
  academicYear: string;
}