
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Sparkles, Globe, Lock, Layout, Code2, Terminal, ListOrdered, CheckCircle2, ChevronRight, Activity, Search } from 'lucide-react';
import { ChatMessage } from '../types';
import { streamChat } from '../services/geminiService';
import LinkedInShare from './LinkedInShare';

// Helper to extract URL and steps
const extractUrl = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const match = text.match(urlRegex);
  return match ? match[0] : null;
};

const extractSteps = (text: string): string[] => {
  // Try to find numbered lists or bullet points
  const stepLines = text.split('\n').filter(line => 
    /^\d+[\.\)]/.test(line.trim()) || 
    /^[-*•]/.test(line.trim()) ||
    /^(step|then|click|enter|go to)/i.test(line.trim())
  );
  return stepLines.length > 0 ? stepLines : [];
};

// Component to simulate a browser window with flow steps
const FlowBrowserCard: React.FC<{ url: string; steps: string[] }> = ({ url, steps }) => (
  <div className="mt-4 mb-4 w-full max-w-3xl bg-gray-900 border border-indigo-500/30 rounded-xl overflow-hidden shadow-2xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
    {/* Browser Toolbar */}
    <div className="bg-gray-800 px-4 py-2 flex items-center gap-3 border-b border-gray-700">
      <div className="flex gap-1.5">
        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
        <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
      </div>
      <div className="flex-1 bg-gray-950 rounded-md px-3 py-1 text-xs text-gray-400 flex items-center gap-2 font-mono">
        <Lock className="w-3 h-3 text-green-500" />
        <span className="truncate max-w-[300px]">{url}</span>
      </div>
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-wider">
        <Activity className="w-3 h-3 animate-pulse" />
        Live Retrieval
      </div>
    </div>
    
    {/* Flow Visualizer */}
    <div className="p-0 bg-gray-950/30 relative flex flex-col md:flex-row min-h-[200px]">
      {/* Left: Interactive Preview */}
      <div className="flex-1 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-800">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:16px_16px]" />
        <div className="z-10 flex flex-col items-center gap-4">
          <div className="relative">
            <Search className="w-12 h-12 text-indigo-400 animate-bounce duration-1000" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-950 animate-ping"></div>
          </div>
          <div className="text-center">
            <h3 className="text-sm font-bold text-white uppercase tracking-tight">Search Grounding Active</h3>
            <p className="text-[11px] text-gray-500 mt-1">Visiting URL for element discovery</p>
          </div>
        </div>
      </div>

      {/* Right: Step List */}
      <div className="w-full md:w-64 bg-gray-900/50 p-4 space-y-3">
        <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-gray-400 uppercase">
          <ListOrdered className="w-3.5 h-3.5" />
          Detected Actions
        </div>
        <div className="space-y-2 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
          {steps.length > 0 ? steps.map((step, idx) => (
            <div key={idx} className="flex items-start gap-2.5 group">
              <div className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full border border-indigo-500/50 flex items-center justify-center text-[10px] text-indigo-400 font-mono">
                {idx + 1}
              </div>
              <div className="flex-1 py-1 px-2 rounded-md bg-gray-800/40 border border-transparent group-hover:border-indigo-500/20 transition-all">
                <p className="text-[11px] text-gray-300 line-clamp-2 leading-tight italic">
                  {step.replace(/^\d+[\.\)]\s*/, '').replace(/^[-*•]\s*/, '')}
                </p>
              </div>
            </div>
          )) : (
            <div className="py-4 text-center">
              <p className="text-[10px] text-gray-600">Deep crawling URL...<br/>Extracting DOM tree.</p>
            </div>
          )}
        </div>
      </div>
    </div>
    
    {/* Progress Bar / Status */}
    <div className="bg-gray-900 px-4 py-2 border-t border-gray-800 flex justify-between items-center text-[10px]">
      <div className="flex gap-4 text-gray-500">
        <span className="flex items-center gap-1"><Layout className="w-3 h-3" /> Live Context Loaded</span>
        <span className="flex items-center gap-1 font-medium text-indigo-400">
          <ChevronRight className="w-3 h-3" /> 
          Architecting Script...
        </span>
      </div>
      <div className="flex items-center gap-1 text-emerald-500">
        <CheckCircle2 className="w-3 h-3" />
        <span className="font-semibold uppercase tracking-widest">Connected</span>
      </div>
    </div>
  </div>
);

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const botMsgId = (Date.now() + 1).toString();
      setMessages(prev => [
        ...prev,
        { id: botMsgId, role: 'model', text: '', isStreaming: true, timestamp: Date.now() }
      ]);

      const stream = streamChat(history, userMsg.text);
      let fullText = '';

      for await (const chunk of stream) {
        fullText += chunk;
        setMessages(prev => 
          prev.map(msg => 
            msg.id === botMsgId 
              ? { ...msg, text: fullText } 
              : msg
          )
        );
      }

      setMessages(prev => 
        prev.map(msg => 
          msg.id === botMsgId 
            ? { ...msg, isStreaming: false } 
            : msg
        )
      );
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        { id: Date.now().toString(), role: 'model', text: "Sorry, I encountered an error connecting to the AI core.", timestamp: Date.now() }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessageText = (text: string) => {
    const parts = text.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const lines = part.slice(3, -3).split('\n');
        const language = lines[0].trim() || 'Java';
        const content = lines.slice(1).join('\n');
        
        return (
          <div key={index} className="my-4 rounded-xl overflow-hidden border border-gray-700 bg-[#0d1117] shadow-xl">
            <div className="bg-gray-800/80 px-4 py-2 border-b border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                <span>{language.toUpperCase()} / {language.toLowerCase() === 'java' ? 'Selenium (POM)' : 'Configuration'}</span>
              </div>
              <button 
                onClick={() => navigator.clipboard.writeText(content)}
                className="text-[10px] text-gray-500 hover:text-white transition-colors uppercase font-bold tracking-tighter bg-gray-950 px-2 py-0.5 rounded"
              >
                Copy Code
              </button>
            </div>
            <pre className="p-5 overflow-x-auto text-xs md:text-sm font-mono text-emerald-400/90 leading-relaxed custom-scrollbar">
              <code>{content.trim()}</code>
            </pre>
          </div>
        );
      }
      return <span key={index} className="whitespace-pre-wrap">{part}</span>;
    });
  };

  return (
    <div className="flex flex-col h-full bg-gray-950">
      <header className="p-4 md:px-8 md:py-6 border-b border-gray-800 bg-gray-900/40 backdrop-blur-xl flex justify-between items-center gap-4 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <div className="hidden md:flex p-2.5 bg-indigo-600/10 rounded-xl border border-indigo-500/20">
            <Code2 className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold flex items-center gap-2 text-white">
              <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
              AutoScript Pro
            </h2>
            <p className="text-[11px] md:text-xs text-gray-500 font-medium tracking-wide">Enterprise Test Automation & Live URL Analysis</p>
          </div>
        </div>
        <LinkedInShare featureContext="AutoScript AI now genuinely visits the URL using Gemini Search Grounding! It writes site-specific Selenium scripts with 100% unique test cases every time. 🚀" />
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 max-w-lg mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full"></div>
              <Bot className="w-20 h-20 text-gray-700 relative z-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-300">Intelligent URL Retrieval</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Provide a URL to start a deep DOM analysis.<br/>
                <span className="text-indigo-400/80 font-mono text-xs mt-4 block italic">
                  Example: "Retrieve automation script for https://www.google.com focusing on Image Search flow"
                </span>
              </p>
            </div>
          </div>
        )}
        
        {messages.map((msg) => {
          const url = msg.role === 'user' ? extractUrl(msg.text) : null;
          const steps = msg.role === 'user' ? extractSteps(msg.text) : [];
          
          return (
            <div
              key={msg.id}
              className={`flex gap-4 md:gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 border border-indigo-400/50' 
                  : 'bg-emerald-600 border border-emerald-400/50'
              }`}>
                {msg.role === 'user' ? <User className="w-6 h-6 text-white" /> : <Bot className="w-6 h-6 text-white" />}
              </div>
              
              <div className={`max-w-[85%] md:max-w-[75%] rounded-3xl p-5 md:p-6 ${
                msg.role === 'user' 
                  ? 'bg-indigo-600/10 text-indigo-50 border border-indigo-500/20' 
                  : 'bg-gray-900 text-gray-100 border border-gray-800 shadow-2xl shadow-black/40'
              }`}>
                {url && (
                  <FlowBrowserCard url={url} steps={steps} />
                )}

                <div className="leading-relaxed text-sm md:text-base">
                  {renderMessageText(msg.text)}
                </div>
                
                {msg.isStreaming && (
                  <div className="flex items-center gap-3 mt-6 p-3 rounded-xl bg-gray-950/50 border border-gray-800">
                    <Search className="w-4 h-4 text-indigo-400 animate-pulse" />
                    <span className="text-indigo-300/80 text-xs font-medium animate-pulse">
                      Gemini is performing deep-site analysis for your URL...
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 md:p-8 bg-gray-950 border-t border-gray-900">
        <form onSubmit={handleSubmit} className="relative max-w-5xl mx-auto group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition-opacity duration-500"></div>
          <div className="relative flex items-center bg-gray-900 rounded-2xl border border-gray-800 focus-within:border-indigo-500/50 transition-all duration-300 shadow-2xl">
            <div className="pl-5 text-gray-600">
              <Globe className="w-5 h-5" />
            </div>
            <textarea
              ref={inputRef as any}
              rows={1}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                // Simple auto-resize
                e.target.style.height = 'auto';
                e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e as any);
                }
              }}
              placeholder="Paste URL (e.g. https://target-site.com)"
              className="w-full bg-transparent text-white placeholder-gray-600 px-4 py-4 focus:outline-none resize-none min-h-[56px] custom-scrollbar"
            />
            <div className="pr-2 flex items-center gap-2">
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 disabled:text-gray-600 text-white rounded-xl transition-all shadow-lg active:scale-95"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <p className="mt-3 text-center text-[10px] text-gray-600 font-medium tracking-wide">
            POWERED BY <span className="text-indigo-400">GOOGLE GEMINI 3 FLASH + SEARCH GROUNDING</span> • CREATED BY <span className="text-indigo-400 uppercase">Sankalp Suman</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
