import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Sparkles, Globe, Lock, Layout, Code2, Terminal } from 'lucide-react';
import { ChatMessage } from '../types';
import { streamChat } from '../services/geminiService';
import LinkedInShare from './LinkedInShare';

// Helper to extract URL from text
const extractUrl = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const match = text.match(urlRegex);
  return match ? match[0] : null;
};

// Component to simulate a browser window analysis
const BrowserCard: React.FC<{ url: string }> = ({ url }) => (
  <div className="mt-4 mb-2 w-full max-w-2xl bg-gray-900 border border-gray-700 rounded-lg overflow-hidden shadow-2xl">
    {/* Browser Toolbar */}
    <div className="bg-gray-800 px-4 py-2 flex items-center gap-3 border-b border-gray-700">
      <div className="flex gap-1.5">
        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
        <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
      </div>
      <div className="flex-1 bg-gray-950 rounded-md px-3 py-1 text-xs text-gray-400 flex items-center gap-2 font-mono">
        <Lock className="w-3 h-3 text-green-500" />
        <span className="truncate max-w-[200px]">{url}</span>
      </div>
    </div>
    
    {/* Browser Content Simulation */}
    <div className="p-6 flex flex-col items-center justify-center min-h-[120px] bg-gray-950/50 relative">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:20px_20px]" />
      <div className="z-10 flex flex-col items-center gap-3 animate-pulse-slow">
        <Globe className="w-10 h-10 text-indigo-400" />
        <div className="text-center">
          <h3 className="text-sm font-medium text-indigo-300">Analyzing Page Structure...</h3>
          <p className="text-xs text-gray-500 mt-1">Identifying Buttons, Inputs & Actions</p>
        </div>
      </div>
    </div>
    
    {/* Analysis Footer */}
    <div className="bg-gray-900/80 px-4 py-2 border-t border-gray-800 flex justify-between items-center text-xs">
      <div className="flex gap-4 text-gray-400">
        <span className="flex items-center gap-1"><Layout className="w-3 h-3" /> DOM Tree Parsed</span>
        <span className="flex items-center gap-1"><Code2 className="w-3 h-3" /> Elements Located</span>
      </div>
      <span className="text-green-500 font-medium">Ready to Automate</span>
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

  // Maintain focus on input for keyboard-only usage
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
      // Check for URL to guide user expectations
      const url = extractUrl(userMsg.text);
      
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const botMsgId = (Date.now() + 1).toString();
      setMessages(prev => [
        ...prev,
        { id: botMsgId, role: 'model', text: '', isStreaming: true, timestamp: Date.now() }
      ]);

      // If URL detected, we implicitly ask for automation in the prompt context via system instructions
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
        { id: Date.now().toString(), role: 'model', text: "Sorry, I encountered an error.", timestamp: Date.now() }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to render text with code block support
  const renderMessageText = (text: string) => {
    // Simple split for code blocks
    const parts = text.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const content = part.slice(3, -3).replace(/^[a-zA-Z]+\n/, ''); // Strip language identifier
        return (
          <div key={index} className="my-3 rounded-lg overflow-hidden border border-gray-700 bg-[#0d1117]">
            <div className="bg-gray-800/50 px-4 py-1.5 border-b border-gray-700 flex items-center gap-2 text-xs text-gray-400">
              <Terminal className="w-3 h-3" />
              <span>Java / Selenium (POM)</span>
            </div>
            <pre className="p-4 overflow-x-auto text-sm font-mono text-green-400 leading-relaxed">
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
      <header className="p-4 md:p-6 border-b border-gray-800 bg-gray-900/50 backdrop-blur flex justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2 text-white">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            AutoScript Assistant
          </h2>
          <p className="text-sm text-gray-400">Paste any URL to generate Enterprise Selenium (Java/POM) scripts.</p>
        </div>
        <LinkedInShare featureContext="I just built AutoScript AI, a chat interface that generates enterprise-grade Java Selenium (POM) automation frameworks by analyzing URLs in real-time." />
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 opacity-50">
            <Bot className="w-16 h-16 mb-4" />
            <p>Paste a product URL to generate test scripts...</p>
          </div>
        )}
        
        {messages.map((msg) => {
          const url = msg.role === 'user' ? extractUrl(msg.text) : null;
          
          return (
            <div
              key={msg.id}
              className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' ? 'bg-indigo-600' : 'bg-emerald-600'
              }`}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              
              <div className={`max-w-[85%] rounded-2xl p-4 ${
                msg.role === 'user' 
                  ? 'bg-indigo-600/20 text-indigo-50 border border-indigo-500/30' 
                  : 'bg-gray-800 text-gray-100 border border-gray-700'
              }`}>
                {/* Render the "Browser" visualization if user posted a URL */}
                {url && (
                  <BrowserCard url={url} />
                )}

                <div className="leading-relaxed">
                  {renderMessageText(msg.text)}
                </div>
                
                {msg.isStreaming && (
                  <div className="flex items-center gap-1 mt-2 text-indigo-400 text-xs">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Analyzing DOM & writing scripts...</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 md:p-6 border-t border-gray-800 bg-gray-900">
        <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type message or paste URL to test..."
            autoFocus
            className="w-full bg-gray-800 text-white placeholder-gray-500 rounded-xl pl-4 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-700 transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-2 p-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 rounded-lg text-white transition-colors"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;