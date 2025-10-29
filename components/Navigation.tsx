
import React from 'react';
import { Page } from '../types';
import HomeIcon from './icons/HomeIcon';
import DatabaseIcon from './icons/DatabaseIcon';
import DocumentReportIcon from './icons/DocumentReportIcon';
import CogIcon from './icons/CogIcon';

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navItems: { page: Page; label: string; icon: React.ReactNode }[] = [
  { page: 'attendance', label: 'Attendance', icon: <HomeIcon className="w-5 h-5" /> },
  { page: 'data', label: 'Data Management', icon: <DatabaseIcon className="w-5 h-5" /> },
  { page: 'reports', label: 'AI Reports & Tools', icon: <DocumentReportIcon className="w-5 h-5" /> },
  { page: 'settings', label: 'Settings & Export', icon: <CogIcon className="w-5 h-5" /> },
];

const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate }) => {
  return (
    <nav className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-md">
      <ul className="space-y-2">
        {navItems.map((item) => (
          <li key={item.page}>
            <button
              onClick={() => onNavigate(item.page)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                currentPage === item.page
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;