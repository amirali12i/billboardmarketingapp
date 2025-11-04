import React, { useState } from 'react';
import { Project } from '../types';
import { LogoIcon, PlusIcon } from './icons';

interface ProjectManagerProps {
  projects: Project[];
  onCreate: (name: string) => void;
  onLoad: (id: string) => void;
}

const ProjectManager: React.FC<ProjectManagerProps> = ({ projects, onCreate, onLoad }) => {
  const [newProjectName, setNewProjectName] = useState('');

  const handleCreate = () => {
    if (newProjectName.trim()) {
      onCreate(newProjectName.trim());
      setNewProjectName('');
    }
  };

  const sortedProjects = [...projects].sort((a, b) => b.lastModified - a.lastModified);

  return (
    <div className="w-screen h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-8 text-gray-900 dark:text-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-slate-800">
      <div className="text-center mb-12">
        <LogoIcon className="w-16 h-16 mx-auto text-cyan-400 mb-4" />
        <h1 className="text-4xl font-bold tracking-wider">طراح بیلبورد هوشمند</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">پروژه‌های خود را مدیریت کنید یا یک پروژه جدید بسازید</p>
      </div>

      <div className="w-full max-w-4xl bg-white dark:bg-gray-800/50 rounded-lg shadow-soft-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-semibold mb-4">ایجاد پروژه جدید</h2>
        <div className="flex gap-4">
          <input
            type="text"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
            placeholder="نام پروژه (مثال: کمپین تابستانه)"
            className="flex-grow bg-gray-100 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-700 rounded-md p-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200"
          />
          <button
            onClick={handleCreate}
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-6 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-105"
          >
            <PlusIcon className="w-5 h-5 me-2" />
            ایجاد
          </button>
        </div>

        <div className="mt-8 border-t border-gray-200 dark:border-gray-700/50 pt-6">
          <h2 className="text-2xl font-semibold mb-4">پروژه‌های اخیر</h2>
          {sortedProjects.length > 0 ? (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {sortedProjects.map(project => (
                <div
                  key={project.id}
                  onClick={() => onLoad(project.id)}
                  className="bg-gray-100 dark:bg-gray-700/50 p-4 rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600/50 transition-colors ring-1 ring-transparent hover:ring-cyan-500"
                >
                  <div>
                    <p className="font-semibold text-lg">{project.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      آخرین ویرایش: {new Date(project.lastModified).toLocaleString('fa-IR')}
                    </p>
                  </div>
                  <span className="text-cyan-500 dark:text-cyan-400 font-semibold">باز کردن</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 dark:text-gray-500 text-center py-8">هیچ پروژه‌ای یافت نشد. اولین پروژه خود را بسازید!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectManager;