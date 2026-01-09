
import React from 'react';
import { MessageSquare, Box, LogOut } from 'lucide-react';
import { AppMode } from '../types';

interface NavigationProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
  onLogout?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentMode, onModeChange, onLogout }) => {
  const navItems = [
    { mode: AppMode.CHAT, icon: MessageSquare, label: 'AutoScript Chat' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-gray-900/90 backdrop-blur-xl border-t border-gray-800 md:relative md:w-20 lg:w-64 md:h-screen md:border-t-0 md:border-r md:flex md:flex-col z-50 transition-all duration-300">
      {/* Top Header - Desktop Only */}
      <div className="hidden md:flex items-center gap-3 p-4 lg:p-6 border-b border-gray-800">
        <div className="p-2 bg-indigo-600 rounded-lg shrink-0">
          <Box className="w-6 h-6 text-white" />
        </div>
        <div className="hidden lg:block overflow-hidden">
          <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent truncate">
            AutoScript AI
          </h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider truncate">By Sankalp Suman</p>
        </div>
      </div>

      {/* Nav Links */}
      <div className="flex md:flex-col justify-around md:justify-start p-2 md:p-4 gap-1 md:gap-2">
        {navItems.map((item) => (
          <button
            key={item.mode}
            onClick={() => onModeChange(item.mode)}
            className={`flex flex-col md:flex-row items-center lg:gap-3 p-2 md:px-3 lg:px-4 md:py-3 rounded-xl transition-all duration-200 group ${
              currentMode === item.mode
                ? 'bg-indigo-600/20 text-indigo-400'
                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
            }`}
          >
            <item.icon className={`w-5 h-5 lg:w-5 lg:h-5 ${currentMode === item.mode ? 'stroke-[2.5px]' : ''}`} />
            <span className="text-[10px] md:hidden lg:block lg:text-sm font-medium mt-1 lg:mt-0">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Bottom Footer - Desktop Only */}
      <div className="hidden md:flex flex-col mt-auto p-4 lg:p-6 border-t border-gray-800 space-y-4">
        <div className="hidden lg:block space-y-1">
          <p className="text-xs text-indigo-400 font-semibold">AutoScript AI</p>
          <p className="text-[10px] text-gray-400">Owner: Sankalp Suman</p>
          <p className="text-[10px] text-gray-500">Powered by Gemini Core</p>
        </div>
        {onLogout && (
          <button 
            onClick={onLogout}
            className="flex items-center justify-center lg:justify-start gap-3 p-2 text-gray-500 hover:text-red-400 transition-colors w-full"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden lg:block text-sm font-medium">Logout</span>
          </button>
        )}
      </div>
      
      {/* Safety padding for mobile browsers with bars */}
      <div className="md:hidden h-[env(safe-area-inset-bottom)] bg-gray-900" />
    </nav>
  );
};

export default Navigation;
