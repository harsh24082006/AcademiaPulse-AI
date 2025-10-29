import React, { useState, useEffect } from 'react';
import { CollegeInfo } from '../types';
import BuildingOfficeIcon from './icons/BuildingOfficeIcon';

interface CollegeInfoManagerProps {
  collegeInfo: CollegeInfo;
  onInfoChange: (info: CollegeInfo) => void;
}

const CollegeInfoManager: React.FC<CollegeInfoManagerProps> = ({ collegeInfo, onInfoChange }) => {
  const [formData, setFormData] = useState<CollegeInfo>(collegeInfo);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setFormData(collegeInfo);
  }, [collegeInfo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'isAutonomous') {
        setFormData(prev => ({...prev, isAutonomous: value === 'true'}));
    } else {
         setFormData(prev => ({ ...prev, [name]: value }));
    }
    setIsSaved(false);
  };
  
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logoBase64: reader.result as string }));
        setIsSaved(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onInfoChange(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <BuildingOfficeIcon className="w-6 h-6 text-indigo-500" />
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">College Configuration</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="logo" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Institute Logo</label>
          <div className="mt-1 flex items-center gap-4">
            {formData.logoBase64 ? (
              <img src={formData.logoBase64} alt="Logo Preview" className="h-16 w-16 object-contain bg-slate-100 dark:bg-slate-700 rounded-md p-1" />
            ) : (
              <div className="h-16 w-16 bg-slate-100 dark:bg-slate-700 rounded-md flex items-center justify-center text-xs text-slate-400">Preview</div>
            )}
            <input type="file" id="logo" name="logo" onChange={handleLogoChange} accept="image/png, image/jpeg" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900/50 dark:file:text-indigo-300 dark:hover:file:bg-indigo-900"/>
          </div>
        </div>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">College Name</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="mt-1 w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Address</label>
          <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} required className="mt-1 w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label htmlFor="pincode" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Pincode</label>
          <input type="text" id="pincode" name="pincode" value={formData.pincode} onChange={handleChange} required className="mt-1 w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label htmlFor="university" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Affiliated University</label>
          <input type="text" id="university" name="university" value={formData.university} onChange={handleChange} required className="mt-1 w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
         <div>
          <label htmlFor="isAutonomous" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Autonomy Status</label>
          <select id="isAutonomous" name="isAutonomous" value={String(formData.isAutonomous)} onChange={handleChange} required className="mt-1 w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="true">Autonomous</option>
            <option value="false">Non-Autonomous</option>
          </select>
        </div>
        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400">
          {isSaved ? 'Saved!' : 'Save College Info'}
        </button>
      </form>
    </div>
  );
};

export default CollegeInfoManager;