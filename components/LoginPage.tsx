
import React, { useState } from 'react';
import { Lock, User, ShieldCheck, Box, ArrowRight, Sparkles } from 'lucide-react';

interface LoginPageProps {
  onLogin: (username: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate a secure login delay
    setTimeout(() => {
      if (username.trim() && password.trim()) {
        onLogin(username);
      } else {
        setError('Please enter both username and password.');
        setIsLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0d1117] relative overflow-hidden font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full"></div>
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:32px_32px]"></div>

      <div className="relative w-full max-w-md p-8">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="p-4 bg-indigo-600 rounded-3xl shadow-2xl shadow-indigo-500/20 mb-4 group transition-transform hover:scale-105">
            <Box className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent tracking-tight">
            AutoScript AI
          </h1>
          <p className="text-gray-500 text-xs mt-2 uppercase tracking-[0.2em] font-semibold">
            Enterprise Automation Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-gray-900/40 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-500">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-600 group-focus-within:text-indigo-400 transition-colors" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-gray-950/50 border border-gray-800 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-600 group-focus-within:text-indigo-400 transition-colors" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-gray-950/50 border border-gray-800 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-xs font-medium text-center animate-pulse">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative group overflow-hidden bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-900/20 active:scale-[0.98]"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <div className="flex items-center justify-center gap-2">
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Enter Workspace</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-800/50 flex items-center justify-center gap-2 text-gray-600 text-xs">
            <ShieldCheck className="w-4 h-4" />
            <span>Secure 256-bit Encrypted Session</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-300">
          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.3em]">
            Developed by <span className="text-indigo-400">Sankalp Suman</span>
          </p>
          <div className="flex items-center justify-center gap-2 text-[10px] text-gray-700">
            <Sparkles className="w-3 h-3" />
            <span>Powered by Gemini 3 Flash Core</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
