
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-slate-800 shadow-md">
      <div className="container mx-auto px-4 md:px-6 py-4">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
          AcademiaPulse AI
        </h1>
        <p className="text-sm md:text-md text-slate-500 dark:text-slate-400">
          Your Intelligent Attendance Management System
        </p>
      </div>
    </header>
  );
};

export default Header;