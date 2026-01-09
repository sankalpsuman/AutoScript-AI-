
import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import ChatInterface from './components/ChatInterface';
import LoginPage from './components/LoginPage';
import { AppMode, AuthUser } from './types';

function App() {
  const [currentMode, setCurrentMode] = useState<AppMode>(AppMode.CHAT);
  const [auth, setAuth] = useState<AuthUser>(() => {
    // Persistent login for better UX on refresh
    const saved = localStorage.getItem('as_auth');
    return saved ? JSON.parse(saved) : { username: '', isLoggedIn: false };
  });

  useEffect(() => {
    localStorage.setItem('as_auth', JSON.stringify(auth));
  }, [auth]);

  const handleLogin = (username: string) => {
    setAuth({
      username,
      isLoggedIn: true
    });
  };

  const handleLogout = () => {
    setAuth({ username: '', isLoggedIn: false });
    localStorage.removeItem('as_auth');
  };

  if (!auth.isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-gray-950 text-white selection:bg-indigo-500/30">
      <Navigation currentMode={currentMode} onModeChange={setCurrentMode} onLogout={handleLogout} />
      <main className="flex-1 relative w-full h-full overflow-hidden">
        {currentMode === AppMode.CHAT && <ChatInterface />}
      </main>
    </div>
  );
}

export default App;
