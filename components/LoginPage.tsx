
import React, { useState } from 'react';
// Added Loader2 to the lucide-react imports to fix the error on line 97
import { Lock, User, ShieldCheck, Box, ArrowRight, Sparkles, Loader2 } from 'lucide-react';

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

    setTimeout(() => {
      if (username.trim() && password.trim()) {
        onLogin(username);
      } else {
        setError('Credentials required for workspace entry.');
        setIsLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0d1117] relative overflow-hidden font-sans p-4">
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/5 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/5 blur-[120px] rounded-full"></div>
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:24px_24px]"></div>

      <div className="relative w-full max-w-md">
        <div className="flex flex-col items-center mb-8 md:mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="p-4 bg-indigo-600 rounded-2xl shadow-2xl shadow-indigo-500/20 mb-4 group transition-transform hover:scale-110">
            <Box className="w-8 h-8 md:w-10 md:h-10 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-br from-white to-gray-500 bg-clip-text text-transparent tracking-tight text-center">
            AutoScript AI
          </h1>
          <p className="text-indigo-400/80 text-[9px] md:text-[10px] mt-2 uppercase tracking-[0.4em] font-bold">
            Sankalp Suman Enterprise
          </p>
        </div>

        <div className="bg-gray-900/60 backdrop-blur-2xl border border-gray-800 rounded-[2rem] p-6 md:p-10 shadow-3xl animate-in zoom-in-95 duration-500">
          <form onSubmit={handleLogin} className="space-y-5 md:space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Identity</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-600 group-focus-within:text-indigo-400 transition-colors" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-gray-950/50 border border-gray-800 rounded-2xl text-white placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all text-sm"
                  placeholder="Username"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Access Key</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-600 group-focus-within:text-indigo-400 transition-colors" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-gray-950/50 border border-gray-800 rounded-2xl text-white placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all text-sm"
                  placeholder="Password"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-[10px] font-bold text-center uppercase tracking-tight">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative group overflow-hidden bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-bold transition-all shadow-xl active:scale-[0.98]"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <div className="flex items-center justify-center gap-2">
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Initialize Workspace</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-800/50 flex items-center justify-center gap-2 text-gray-600 text-[10px] font-medium uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>End-to-End Encrypted</span>
          </div>
        </div>

        <div className="mt-10 text-center space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-300">
          <div className="flex items-center justify-center gap-2 text-[9px] text-gray-600 font-bold tracking-[0.2em] uppercase">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>Multi-Platform Optimized</span>
          </div>
          <p className="text-[10px] text-gray-700 italic">© 2025 AutoScript AI Portal • Sankalp Suman</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
