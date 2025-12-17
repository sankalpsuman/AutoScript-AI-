import React, { useState } from 'react';
import Navigation from './components/Navigation';
import ChatInterface from './components/ChatInterface';
import { AppMode } from './types';

function App() {
  const [currentMode, setCurrentMode] = useState<AppMode>(AppMode.CHAT);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-950 text-white">
      <Navigation currentMode={currentMode} onModeChange={setCurrentMode} />
      <main className="flex-1 relative w-full h-full pb-16 md:pb-0">
        <ChatInterface />
      </main>
    </div>
  );
}

export default App;