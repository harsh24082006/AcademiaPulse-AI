import React, { useState } from 'react';
import { Student, Course, AttendanceData, CollegeInfo, DepartmentInfo, AttendanceStatus } from '../types';
import DocumentTextIcon from './icons/DocumentTextIcon';
import SheetIcon from './icons/SheetIcon';
import { LOGO_BASE64 as APP_LOGO_BASE64 } from './icons/Logo';

interface AdvancedExporterProps {
  students: Student[];
  courses: Course[];
  attendanceData: AttendanceData;
  collegeInfo: CollegeInfo;
  departmentInfo: DepartmentInfo;
}

const getISODateString = (date: Date) => date.toISOString().split('T')[0];

const AdvancedExporter: React.FC<AdvancedExporterProps> = ({ students, courses, attendanceData, collegeInfo, departmentInfo }) => {
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return getISODateString(date);
  });
  const [endDate, setEndDate] = useState(getISODateString(new Date()));
  const [error, setError] = useState<string | null>(null);

  const hasData = students.length > 0 && courses.length > 0;
  
  const handleDateChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      setError(null);
  }
  
  const generateReportData = () => {
      if (new Date(startDate) > new Date(endDate)) {
        setError('Start date cannot be after the end date.');
        return null;
      }
      
      const dateRange: string[] = [];
      let currentDate = new Date(startDate);
      const lastDate = new Date(endDate);
      while (currentDate <= lastDate) {
        dateRange.push(getISODateString(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return dateRange;
  }

  const exportToCSV = () => {
    const dateRange = generateReportData();
    if (!dateRange || !hasData) return;

    let csvContent = `Student Name,Roll Number,`;
    csvContent += courses.map(c => `"${c.name} (${c.code})"`).join(',') + '\n';

    students.forEach(student => {
        let row = `"${student.name}","${student.rollNumber}",`;
        courses.forEach(course => {
            let presentCount = 0;
            dateRange.forEach(date => {
                const status = attendanceData[date]?.[course.id]?.[student.id];
                if (status === AttendanceStatus.Present) {
                    presentCount++;
                }
            });
            row += `${presentCount},`;
        });
        csvContent += row.slice(0, -1) + '\n';
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `attendance-report-${startDate}-to-${endDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const exportToWord = () => {
    const dateRange = generateReportData();
    if (!dateRange || !hasData) return;

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
      <h2 style="font-family: Arial, sans-serif; text-align: center; font-size: 16px; color: #1E293B;">Consolidated Attendance Report</h2>
      <div style="font-family: Arial, sans-serif; font-size: 11px; margin-bottom: 20px; border-top: 1px solid #E2E8F0; padding-top: 10px;">
        <p><strong>Department:</strong> ${departmentInfo.name}</p>
        <p><strong>Class:</strong> ${departmentInfo.studentYear}</p>
        <p><strong>Academic Year:</strong> ${departmentInfo.academicYear}</p>
        <p><strong>Date Range:</strong> ${startDate} to ${endDate}</p>
      </div>
    `;

    const tableHeader = `
      <tr style="background-color: #4338CA; color: #FFFFFF; font-size: 10px;">
        <th style="padding: 6px; border: 1px solid #CBD5E1; text-align: left;">Student Name</th>
        <th style="padding: 6px; border: 1px solid #CBD5E1; text-align: left;">Roll No.</th>
        ${courses.map(c => `<th style="padding: 6px; border: 1px solid #CBD5E1;">${c.code}</th>`).join('')}
      </tr>
    `;
    
    const tableRows = students.map((student, index) => {
        let rowHtml = `<tr style="background-color: ${index % 2 === 0 ? '#F8FAFC' : '#FFFFFF'}; font-size: 10px;">
            <td style="padding: 6px; border: 1px solid #CBD5E1;">${student.name}</td>
            <td style="padding: 6px; border: 1px solid #CBD5E1;">${student.rollNumber}</td>`;
        courses.forEach(course => {
            let presentCount = 0;
            dateRange.forEach(date => {
                const status = attendanceData[date]?.[course.id]?.[student.id];
                if (status === AttendanceStatus.Present) {
                    presentCount++;
                }
            });
            rowHtml += `<td style="padding: 6px; border: 1px solid #CBD5E1; text-align: center;">${presentCount}</td>`;
        });
        rowHtml += `</tr>`;
        return rowHtml;
    }).join('');

    const tableHtml = `
      <p style="font-family: Arial, sans-serif; font-size: 10px; color: #475569; margin-bottom: 10px;">The table body shows the total number of present days for each student in each course within the selected date range.</p>
      <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 12px; color: #334155;">
        <thead>${tableHeader}</thead>
        <tbody>${tableRows}</tbody>
      </table>
    `;

    const fullHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Consolidated Report</title></head><body>${headerHtml}${tableHtml}</body></html>`;
    
    const url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(fullHtml);
    const link = document.createElement("a");
    link.href = url;
    link.download = `consolidated-report-${startDate}-to-${endDate}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <DocumentTextIcon className="w-6 h-6 text-indigo-500" />
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Advanced Exporter</h2>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        Export a consolidated attendance report for a specific date range.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="w-full sm:w-1/2">
          <label htmlFor="start-date-adv" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Date</label>
          <input
            type="date"
            id="start-date-adv"
            value={startDate}
            onChange={handleDateChange(setStartDate)}
            className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="w-full sm:w-1/2">
          <label htmlFor="end-date-adv" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">End Date</label>
          <input
            type="date"
            id="end-date-adv"
            value={endDate}
            onChange={handleDateChange(setEndDate)}
            className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

       {error && <p className="mb-4 text-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50 p-3 rounded-md">{error}</p>}
      
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

      {!hasData && <p className="text-xs text-center mt-2 text-slate-500 dark:text-slate-400">Add students and courses to enable exports.</p>}
    </div>
  );
};

export default AdvancedExporter;