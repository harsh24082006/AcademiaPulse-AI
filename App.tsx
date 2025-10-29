import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import AttendanceControls from './components/AttendanceControls';
import Dashboard from './components/Dashboard';
import StudentList from './components/StudentList';
import ReportGenerator from './components/ReportGenerator';
import DataManagement from './components/DataManagement';
import CollegeInfoManager from './components/CollegeInfoManager';
import DataExporter from './components/ExportToSheet';
import AdvancedExporter from './components/AdvancedExporter';
import DepartmentInfoManager from './components/DepartmentInfoManager';
import AIAssistant from './components/AIAssistant';
import AITools from './components/AITools';
import { Student, Course, AttendanceData, AttendanceStatus, Page, CollegeInfo, DepartmentInfo, AttendanceRecord } from './types';
import { INITIAL_STUDENTS, INITIAL_COURSES, getTodayDateString, INITIAL_COLLEGE_INFO, INITIAL_DEPARTMENT_INFO } from './constants';
import { parseBulkAddData } from './services/geminiService';

const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

const App: React.FC = () => {
  const [students, setStudents] = useLocalStorage<Student[]>('students', INITIAL_STUDENTS);
  const [courses, setCourses] = useLocalStorage<Course[]>('courses', INITIAL_COURSES);
  const [attendanceData, setAttendanceData] = useLocalStorage<AttendanceData>('attendanceData', {});
  const [collegeInfo, setCollegeInfo] = useLocalStorage<CollegeInfo>('collegeInfo', INITIAL_COLLEGE_INFO);
  const [departmentInfo, setDepartmentInfo] = useLocalStorage<DepartmentInfo>('departmentInfo', INITIAL_DEPARTMENT_INFO);

  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(courses[0] || null);
  const [currentPage, setCurrentPage] = useState<Page>('attendance');
  
  useEffect(() => {
    if (!selectedCourse && courses.length > 0) {
      setSelectedCourse(courses[0]);
    }
    if(selectedCourse && !courses.find(c => c.id === selectedCourse.id)) {
        setSelectedCourse(courses[0] || null);
    }
  }, [courses, selectedCourse]);

  const currentAttendance = useMemo<AttendanceRecord>(() => {
    if (!selectedCourse || !selectedDate) return {};
    return attendanceData[selectedDate]?.[selectedCourse.id] || {};
  }, [attendanceData, selectedDate, selectedCourse]);

  const handleAttendanceChange = (studentId: string, status: AttendanceStatus) => {
    if (!selectedCourse || !selectedDate) return;
    setAttendanceData(prev => ({
      ...prev,
      [selectedDate]: {
        ...prev[selectedDate],
        [selectedCourse.id]: {
          ...prev[selectedDate]?.[selectedCourse.id],
          [studentId]: status,
        }
      }
    }));
  };

  const handleMarkAll = (status: AttendanceStatus) => {
    if (!selectedCourse || !selectedDate) return;
    const newRecord: AttendanceRecord = {};
    students.forEach(student => {
      newRecord[student.id] = status;
    });
    setAttendanceData(prev => ({
      ...prev,
      [selectedDate]: {
        ...prev[selectedDate],
        [selectedCourse.id]: newRecord,
      }
    }));
  };

  const handleAddStudent = (name: string, rollNumber: string) => {
    const newStudent: Student = { id: `s${Date.now()}`, name, rollNumber };
    setStudents(prev => [...prev, newStudent]);
  };
  
  const handleAddCourse = (name: string, code: string) => {
    const newCourse: Course = { id: `c${Date.now()}`, name, code };
    setCourses(prev => [...prev, newCourse]);
    if (!selectedCourse) {
        setSelectedCourse(newCourse);
    }
  };

  const handleRemoveStudent = (studentId: string) => {
      if(window.confirm("Are you sure you want to remove this student? This action cannot be undone.")){
          setStudents(prev => prev.filter(s => s.id !== studentId));
          // Optionally, also clean up attendance data for this student
      }
  };

  const handleRemoveCourse = (courseId: string) => {
      if(window.confirm("Are you sure you want to remove this subject? This action will remove all associated attendance data and cannot be undone.")){
          setCourses(prev => prev.filter(c => c.id !== courseId));
          // Clean up attendance data for this course
          const newAttendanceData = { ...attendanceData };
          Object.keys(newAttendanceData).forEach(date => {
              if (newAttendanceData[date]?.[courseId]) {
                  delete newAttendanceData[date][courseId];
              }
          });
          setAttendanceData(newAttendanceData);
      }
  };

  const handleBulkAdd = useCallback(async (text: string) => {
    const { students: newStudents, courses: newCourses } = await parseBulkAddData(text);
    if (newStudents.length > 0) {
      const studentsToAdd = newStudents.map(s => ({...s, id: `s${Date.now()}${Math.random()}`}));
      setStudents(prev => [...prev, ...studentsToAdd]);
    }
    if (newCourses.length > 0) {
      const coursesToAdd = newCourses.map(c => ({...c, id: `c${Date.now()}${Math.random()}`}));
      setCourses(prev => [...prev, ...coursesToAdd]);
    }
  }, [setStudents, setCourses]);


  const renderPage = () => {
    if (!selectedCourse && currentPage !== 'data' && currentPage !== 'settings') {
      return (
        <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Welcome to AcademiaPulse AI</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Please add a subject from the 'Data Management' tab to begin taking attendance.</p>
        </div>
      );
    }

    switch (currentPage) {
      case 'attendance':
        return (
          selectedCourse && <div className="space-y-6">
            <AttendanceControls courses={courses} selectedCourse={selectedCourse} onCourseChange={setSelectedCourse} selectedDate={selectedDate} onDateChange={setSelectedDate} />
            <Dashboard attendance={currentAttendance} totalStudents={students.length} />
            <StudentList students={students} attendance={currentAttendance} onAttendanceChange={handleAttendanceChange} onMarkAll={handleMarkAll} onRemoveStudent={handleRemoveStudent}/>
          </div>
        );
      case 'data':
        return <DataManagement courses={courses} onAddStudent={handleAddStudent} onAddCourse={handleAddCourse} onBulkAdd={handleBulkAdd} onRemoveCourse={handleRemoveCourse} />;
      case 'reports':
        return (
            selectedCourse && <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ReportGenerator students={students} attendanceData={attendanceData} course={selectedCourse} date={selectedDate} />
                <AIAssistant students={students} attendanceRecord={currentAttendance} course={selectedCourse} date={selectedDate} />
                <div className="lg:col-span-2">
                    <AITools students={students} attendanceRecord={currentAttendance} course={selectedCourse} date={selectedDate} />
                </div>
            </div>
        );
      case 'settings':
         return (
            <div className="space-y-6">
                <DataExporter students={students} course={selectedCourse!} attendanceRecord={currentAttendance} date={selectedDate} collegeInfo={collegeInfo} departmentInfo={departmentInfo} />
                <AdvancedExporter students={students} courses={courses} attendanceData={attendanceData} collegeInfo={collegeInfo} departmentInfo={departmentInfo} />
                <CollegeInfoManager collegeInfo={collegeInfo} onInfoChange={setCollegeInfo} />
                <DepartmentInfoManager departmentInfo={departmentInfo} onInfoChange={setDepartmentInfo} />
            </div>
         );
      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-100 dark:bg-slate-900 min-h-screen text-slate-900 dark:text-slate-100">
      <Header />
      <main className="container mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          <div className="lg:col-span-1">
            <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
          </div>
          <div className="lg:col-span-3">
            {renderPage()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;