
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Sparkles, Globe, Lock, Layout, Code2, Terminal, ListOrdered, CheckCircle2, ChevronRight, Activity, Search, RefreshCw } from 'lucide-react';
import { ChatMessage } from '../types';
import { streamChat } from '../services/geminiService';
import LinkedInShare from './LinkedInShare';

const extractUrl = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const match = text.match(urlRegex);
  return match ? match[0] : null;
};

const extractSteps = (text: string): string[] => {
  const stepLines = text.split('\n').filter(line => 
    /^\d+[\.\)]/.test(line.trim()) || 
    /^[-*•]/.test(line.trim()) ||
    /^(step|then|click|enter|go to)/i.test(line.trim())
  );
  return stepLines.length > 0 ? stepLines : [];
};

const FlowBrowserCard: React.FC<{ url: string; steps: string[] }> = ({ url, steps }) => (
  <div className="mt-4 mb-4 w-full bg-gray-900 border border-indigo-500/30 rounded-xl overflow-hidden shadow-2xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
    <div className="bg-gray-800 px-3 py-2 flex items-center gap-2 md:gap-3 border-b border-gray-700">
      <div className="flex gap-1">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
      </div>
      <div className="flex-1 bg-gray-950 rounded px-2 py-1 text-[10px] md:text-xs text-gray-400 flex items-center gap-2 font-mono overflow-hidden">
        <Lock className="w-3 h-3 text-green-500 shrink-0" />
        <span className="truncate">{url}</span>
      </div>
      <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 text-[9px] md:text-[10px] font-bold uppercase tracking-wider shrink-0">
        <Activity className="w-3 h-3 animate-pulse" />
        <span className="hidden xs:inline">Retrieval</span>
      </div>
    </div>
    
    <div className="p-0 bg-gray-950/30 flex flex-col sm:flex-row min-h-[160px]">
      <div className="flex-1 p-4 md:p-6 flex flex-col items-center justify-center border-b sm:border-b-0 sm:border-r border-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:16px_16px]" />
        <div className="z-10 flex flex-col items-center gap-3">
          <div className="relative">
            <Search className="w-8 h-8 md:w-12 md:h-12 text-indigo-400 animate-bounce" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-950"></div>
          </div>
          <div className="text-center">
            <h3 className="text-xs font-bold text-white uppercase tracking-tight">Search Active</h3>
            <p className="text-[9px] md:text-[11px] text-gray-500 mt-0.5">Visiting Target URL</p>
          </div>
        </div>
      </div>

      <div className="w-full sm:w-56 md:w-64 bg-gray-900/50 p-3 md:p-4 space-y-2 md:space-y-3">
        <div className="flex items-center gap-2 mb-1 text-[10px] font-semibold text-gray-400 uppercase">
          <ListOrdered className="w-3 h-3" />
          Flow Logic
        </div>
        <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1 custom-scrollbar">
          {steps.length > 0 ? steps.map((step, idx) => (
            <div key={idx} className="flex items-start gap-2 group">
              <div className="mt-0.5 flex-shrink-0 w-3.5 h-3.5 rounded-full border border-indigo-500/50 flex items-center justify-center text-[9px] text-indigo-400 font-mono">
                {idx + 1}
              </div>
              <p className="text-[10px] md:text-[11px] text-gray-300 line-clamp-2 leading-tight italic bg-gray-800/40 p-1 px-2 rounded-md border border-transparent group-hover:border-indigo-500/10 transition-colors">
                {step.replace(/^\d+[\.\)]\s*/, '').replace(/^[-*•]\s*/, '')}
              </p>
            </div>
          )) : (
            <div className="py-4 text-center">
              <p className="text-[10px] text-gray-600 animate-pulse">Scanning DOM...</p>
            </div>
          )}
        </div>
      </div>
    </div>
    
    <div className="bg-gray-900 px-3 py-1.5 border-t border-gray-800 flex justify-between items-center text-[9px] md:text-[10px]">
      <div className="flex gap-3 text-gray-500">
        <span className="flex items-center gap-1 truncate max-w-[120px] sm:max-w-none"><Layout className="w-3 h-3" /> Live Context</span>
        <span className="flex items-center gap-1 font-medium text-indigo-400 animate-pulse">
          <RefreshCw className="w-2.5 h-2.5" /> 
          Unique Test Design
        </span>
      </div>
      <div className="flex items-center gap-1 text-emerald-500 shrink-0 ml-2">
        <CheckCircle2 className="w-3 h-3" />
        <span className="font-semibold uppercase tracking-widest hidden xs:inline">Active</span>
      </div>
    </div>
  </div>
);

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
          prev.map(msg => msg.id === botMsgId ? { ...msg, text: fullText } : msg)
        );
      }

      setMessages(prev => 
        prev.map(msg => msg.id === botMsgId ? { ...msg, isStreaming: false } : msg)
      );
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        { id: Date.now().toString(), role: 'model', text: "Error: Retrieval failed. Please check the URL and try again.", timestamp: Date.now() }
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
        const language = lines[0].trim() || 'Code';
        const content = lines.slice(1).join('\n');
        return (
          <div key={index} className="my-4 rounded-xl overflow-hidden border border-gray-700 bg-gray-950 shadow-2xl">
            <div className="bg-gray-800/80 px-4 py-2 border-b border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] md:text-xs text-gray-400 font-medium">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                <span>{language.toUpperCase()} Output</span>
              </div>
              <button 
                onClick={() => navigator.clipboard.writeText(content)}
                className="text-[9px] md:text-[10px] text-gray-500 hover:text-white transition-colors uppercase font-bold tracking-widest bg-gray-900 px-2 py-0.5 rounded"
              >
                Copy
              </button>
            </div>
            <div className="relative">
              <pre className="p-4 md:p-5 overflow-x-auto text-[11px] md:text-sm font-mono text-emerald-400/90 leading-relaxed custom-scrollbar bg-[#0d1117]">
                <code>{content.trim()}</code>
              </pre>
            </div>
          </div>
        );
      }
      return <span key={index} className="whitespace-pre-wrap break-words">{part}</span>;
    });
  };

  return (
    <div className="flex flex-col h-full bg-gray-950 relative">
      <header className="p-4 md:px-8 border-b border-gray-800 bg-gray-900/60 backdrop-blur-xl flex justify-between items-center gap-4 sticky top-0 z-20">
        <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
          <div className="p-2 bg-indigo-600/10 rounded-lg border border-indigo-500/20 shrink-0">
            <Code2 className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="overflow-hidden">
            <h2 className="text-base md:text-lg font-bold text-white flex items-center gap-2 truncate">
              AutoScript Pro
              <Sparkles className="w-4 h-4 text-yellow-400 shrink-0" />
            </h2>
            <p className="text-[9px] md:text-xs text-gray-500 font-medium tracking-wide truncate">Live Contextual Analysis</p>
          </div>
        </div>
        <LinkedInShare featureContext="AutoScript AI uses Gemini Search Grounding to genuinely visit any URL and build site-specific automation scripts. Zero boilerplate, 100% unique logic! 🚀" />
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-8 custom-scrollbar pb-safe">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 max-w-lg mx-auto py-12">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full"></div>
              <Bot className="w-16 h-16 md:w-20 md:h-20 text-gray-700 relative z-10" />
            </div>
            <div className="space-y-2 px-4">
              <h3 className="text-lg md:text-xl font-bold text-gray-300">Start Deep Site Analysis</h3>
              <p className="text-xs md:text-sm text-gray-500 leading-relaxed">
                Provide a URL to retrieve unique automation scripts.<br/>
                <span className="text-indigo-400/80 font-mono text-[10px] md:text-xs mt-4 block italic">
                  "Build automation for https://www.amazon.com/ search and cart flow"
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
              className={`flex gap-3 md:gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                msg.role === 'user' ? 'bg-indigo-600' : 'bg-emerald-600'
              }`}>
                {msg.role === 'user' ? <User className="w-5 h-5 md:w-6 md:h-6 text-white" /> : <Bot className="w-5 h-5 md:w-6 md:h-6 text-white" />}
              </div>
              
              <div className={`max-w-[90%] sm:max-w-[85%] md:max-w-[75%] rounded-2xl md:rounded-3xl p-4 md:p-6 ${
                msg.role === 'user' 
                  ? 'bg-indigo-600/10 text-indigo-50 border border-indigo-500/20' 
                  : 'bg-gray-900 text-gray-100 border border-gray-800 shadow-xl'
              }`}>
                {url && <FlowBrowserCard url={url} steps={steps} />}
                <div className="text-[13px] md:text-base leading-relaxed overflow-x-hidden">
                  {renderMessageText(msg.text)}
                </div>
                {msg.isStreaming && (
                  <div className="flex items-center gap-2 mt-4 text-[10px] md:text-xs text-indigo-300/80 animate-pulse bg-indigo-500/5 p-2 rounded-lg border border-indigo-500/10">
                    <Search className="w-3.5 h-3.5" />
                    <span>Gemini is researching the live URL structure...</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      <div className="p-4 md:p-6 bg-gray-900/40 backdrop-blur-xl border-t border-gray-800 sticky bottom-0 md:relative">
        <form onSubmit={handleSubmit} className="relative max-w-5xl mx-auto group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-2xl blur group-focus-within:opacity-100 opacity-0 transition-opacity duration-500"></div>
          <div className="relative flex items-center bg-gray-950 rounded-xl md:rounded-2xl border border-gray-800 focus-within:border-indigo-500/50 transition-all shadow-2xl">
            <div className="hidden xs:flex pl-4 text-gray-600">
              <Globe className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e as any);
                }
              }}
              placeholder="Enter URL to analyze..."
              className="w-full bg-transparent text-white placeholder-gray-600 px-4 py-4 text-sm md:text-base focus:outline-none resize-none min-h-[56px] custom-scrollbar"
            />
            <div className="pr-2 flex items-center shrink-0">
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2 md:p-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 disabled:text-gray-600 text-white rounded-lg md:rounded-xl transition-all shadow-lg active:scale-95"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div className="mt-2 text-center text-[8px] md:text-[10px] text-gray-600 font-medium tracking-tight md:tracking-wide">
            GEMINI SEARCH GROUNDING ACTIVE • <span className="text-indigo-400">SANKALP SUMAN</span> PRO EDITION
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
