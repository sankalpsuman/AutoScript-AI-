import React from 'react';
import { MessageSquare, Box } from 'lucide-react';
import { AppMode } from '../types';

interface NavigationProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentMode, onModeChange }) => {
  const navItems = [
    { mode: AppMode.CHAT, icon: MessageSquare, label: 'AutoScript Chat' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-gray-900 border-t border-gray-800 md:relative md:w-64 md:h-screen md:border-t-0 md:border-r md:flex md:flex-col z-50">
      <div className="hidden md:flex items-center gap-3 p-6 border-b border-gray-800">
        <div className="p-2 bg-indigo-600 rounded-lg">
          <Box className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            AutoScript AI
          </h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">By Sankalp Suman</p>
        </div>
      </div>

      <div className="flex md:flex-col justify-around md:justify-start p-2 md:p-4 gap-1 md:gap-2">
        {navItems.map((item) => (
          <button
            key={item.mode}
            onClick={() => onModeChange(item.mode)}
            className={`flex flex-col md:flex-row items-center md:gap-3 p-2 md:px-4 md:py-3 rounded-xl transition-all duration-200 ${
              currentMode === item.mode
                ? 'bg-indigo-600/20 text-indigo-400'
                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
            }`}
          >
            <item.icon className={`w-6 h-6 md:w-5 md:h-5 ${currentMode === item.mode ? 'stroke-[2.5px]' : ''}`} />
            <span className={`text-xs md:text-sm font-medium mt-1 md:mt-0`}>{item.label}</span>
          </button>
        ))}
      </div>

      <div className="hidden md:flex flex-col mt-auto p-6 border-t border-gray-800 space-y-1">
        <p className="text-xs text-indigo-400 font-semibold">AutoScript AI</p>
        <p className="text-[10px] text-gray-400">Owner: Sankalp Suman</p>
        <p className="text-[10px] text-gray-500">Powered by Google Gemini</p>
      </div>
    </nav>
  );
};

export default Navigation;