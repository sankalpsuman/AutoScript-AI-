
import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import ChatInterface from './components/ChatInterface';
import LoginPage from './components/LoginPage';
import { AppMode, AuthUser } from './types';

function App() {
  const [currentMode, setCurrentMode] = useState<AppMode>(AppMode.CHAT);
  const [auth, setAuth] = useState<AuthUser>({
    username: '',
    isLoggedIn: false
  });

  const handleLogin = (username: string) => {
    setAuth({
      username,
      isLoggedIn: true
    });
  };

  if (!auth.isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-950 text-white animate-in fade-in duration-1000">
      <Navigation currentMode={currentMode} onModeChange={setCurrentMode} />
      <main className="flex-1 relative w-full h-full pb-16 md:pb-0">
        <ChatInterface />
      </main>
    </div>
  );
}

export default App;
