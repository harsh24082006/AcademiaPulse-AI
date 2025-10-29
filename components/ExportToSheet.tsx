import React from 'react';
import { Student, Course, AttendanceStatus, CollegeInfo, DepartmentInfo, AttendanceRecord } from '../types';
import DocumentTextIcon from './icons/DocumentTextIcon';
import SheetIcon from './icons/SheetIcon';
import { LOGO_BASE64 as APP_LOGO_BASE64 } from './icons/Logo';

interface DataExporterProps {
  students: Student[];
  course: Course;
  attendanceRecord: AttendanceRecord;
  date: string;
  collegeInfo: CollegeInfo;
  departmentInfo: DepartmentInfo;
}

const DataExporter: React.FC<DataExporterProps> = ({ students, course, attendanceRecord, date, collegeInfo, departmentInfo }) => {

  const hasData = students.length > 0 && course;

  const getStatusText = (status: AttendanceStatus | undefined) => {
    if (status === AttendanceStatus.Present) return 'Present';
    if (status === AttendanceStatus.Absent) return 'Absent';
    return 'Unmarked';
  }

  const exportToCSV = () => {
    if (!hasData) return alert("No data to export.");

    let csvContent = "";
    
    csvContent += `College,"${collegeInfo.name}"\n`;
    csvContent += `Address,"${collegeInfo.address}, ${collegeInfo.pincode}"\n`;
    csvContent += `Affiliated University,"${collegeInfo.university}"\n`;
    csvContent += `Autonomy,"${collegeInfo.isAutonomous ? 'Autonomous' : 'Non-Autonomous'}"\n`;
    csvContent += `Department,"${departmentInfo.name}"\n`;
    csvContent += `Class,"${departmentInfo.studentYear}"\n`;
    csvContent += `Academic Year,"${departmentInfo.academicYear}"\n\n`;
    csvContent += `Course,"${course.name} (${course.code})"\n`;
    csvContent += `Date,"${date}"\n\n`;

    const headers = ["Roll Number", "Student Name", "Status"];
    csvContent += headers.map(h => `"${h}"`).join(",") + "\n";

    students.forEach(student => {
      const status = getStatusText(attendanceRecord[student.id]);
      const row = [`"${student.rollNumber}"`, `"${student.name}"`, `"${status}"`];
      csvContent += row.join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    const timestamp = new Date().toISOString().split('T')[0];
    link.setAttribute("download", `attendance-report-${course.code}-${timestamp}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const exportToWord = () => {
    if (!hasData) return alert("No data to export.");

    const instituteLogoHtml = collegeInfo.logoBase64
      ? `<img src="${collegeInfo.logoBase64}" alt="Institute Logo" style="width: 70px; height: auto; max-height: 70px; object-fit: contain;">`
      : `<div style="width: 70px; height: 70px; border: 1px solid #ccc; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #888;">No Logo</div>`;

    const headerHtml = `
      <div style="font-family: Arial, sans-serif; margin-bottom: 20px;">
        <table style="width: 100%; border: 0;">
          <tr>
            <td style="width: 80px; text-align: left;">${instituteLogoHtml}</td>
            <td style="text-align: center;">
              <h1 style="font-size: 20px; margin: 0; color: #1E293B;">${collegeInfo.name}</h1>
              <p style="font-size: 12px; margin: 2px 0; color: #475569;">${collegeInfo.address}, ${collegeInfo.pincode}</p>
              <p style="font-size: 12px; margin: 2px 0; color: #475569;">Affiliated to ${collegeInfo.university}</p>
            </td>
            <td style="width: 80px; text-align: right;"><img src="${APP_LOGO_BASE64}" alt="App Logo" style="width: 50px; height: 50px;" /></td>
          </tr>
        </table>
      </div>
      <h2 style="font-family: Arial, sans-serif; text-align: center; font-size: 16px; color: #1E293B;">Student Attendance Report</h2>
      <div style="font-family: Arial, sans-serif; font-size: 11px; margin-bottom: 20px; border-top: 1px solid #E2E8F0; padding-top: 10px;">
        <p><strong>Department:</strong> ${departmentInfo.name}</p>
        <p><strong>Class:</strong> ${departmentInfo.studentYear}</p>
        <p><strong>Academic Year:</strong> ${departmentInfo.academicYear}</p>
        <p><strong>Course:</strong> ${course.name} (${course.code})</p>
        <p><strong>Date:</strong> ${date}</p>
      </div>
    `;

    const tableHeader = `
      <tr style="background-color: #4338CA; color: #FFFFFF;">
        <th style="padding: 8px; border: 1px solid #CBD5E1; text-align: left;">Roll Number</th>
        <th style="padding: 8px; border: 1px solid #CBD5E1; text-align: left;">Student Name</th>
        <th style="padding: 8px; border: 1px solid #CBD5E1; text-align: left;">Status</th>
      </tr>
    `;

    const tableRows = students.map((student, index) => `
      <tr style="background-color: ${index % 2 === 0 ? '#F8FAFC' : '#FFFFFF'};">
        <td style="padding: 8px; border: 1px solid #CBD5E1;">${student.rollNumber}</td>
        <td style="padding: 8px; border: 1px solid #CBD5E1;">${student.name}</td>
        <td style="padding: 8px; border: 1px solid #CBD5E1;">${getStatusText(attendanceRecord[student.id])}</td>
      </tr>
    `).join('');

    const tableHtml = `
      <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 12px; color: #334155;">
        <thead>${tableHeader}</thead>
        <tbody>${tableRows}</tbody>
      </table>
    `;

    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Attendance Report</title>
        </head>
        <body>
          ${headerHtml}
          ${tableHtml}
        </body>
      </html>
    `;
    
    const url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(fullHtml);
    const link = document.createElement("a");
    link.href = url;
    const timestamp = new Date().toISOString().split('T')[0];
    link.download = `attendance-report-${course.code}-${timestamp}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <DocumentTextIcon className="w-6 h-6 text-indigo-500" />
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Daily Export</h2>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        Download the daily attendance report for the selected course and date.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={exportToCSV}
          disabled={!hasData}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
        >
          <SheetIcon className="w-5 h-5" />
          Export to CSV
        </button>
        <button
          onClick={exportToWord}
          disabled={!hasData}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:bg-sky-300 disabled:cursor-not-allowed"
        >
          <DocumentTextIcon className="w-5 h-5" />
          Export to Word
        </button>
      </div>
       {!hasData && <p className="text-xs text-center mt-2 text-slate-500 dark:text-slate-400">Please select a course to enable exports.</p>}
    </div>
  );
};

export default DataExporter;