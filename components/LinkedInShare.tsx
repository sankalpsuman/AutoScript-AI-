import React, { useState } from 'react';
import { Linkedin, Copy, ExternalLink, Loader2, X, Sparkles } from 'lucide-react';
import { generateLinkedInPost } from '../services/geminiService';

interface LinkedInShareProps {
  featureContext: string;
}

const LinkedInShare: React.FC<LinkedInShareProps> = ({ featureContext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleOpen = async () => {
    setIsOpen(true);
    if (!postContent) {
      setIsLoading(true);
      try {
        const content = await generateLinkedInPost(featureContext);
        setPostContent(content);
      } catch (error) {
        console.error("Failed to generate post", error);
        setPostContent("Excited to share my new AI app, AutoScript AI! Built with Gemini 2.5 Flash. #TestAutomation #AI");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCopyAndPost = () => {
    navigator.clipboard.writeText(postContent);
    // Opens the LinkedIn feed where the user can paste the content to start a post
    window.open('https://www.linkedin.com/feed/', '_blank');
    setIsOpen(false);
  };

  return (
    <>
      <button 
        onClick={handleOpen}
        className="flex items-center gap-2 px-3 py-1.5 bg-[#0077b5]/10 hover:bg-[#0077b5]/20 text-[#0077b5] border border-[#0077b5]/50 rounded-lg text-xs md:text-sm font-medium transition-all group"
      >
        <Linkedin className="w-4 h-4 group-hover:scale-110 transition-transform" />
        <span className="hidden md:inline">Share Experience</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-gray-900 border border-gray-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-800/50">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <div className="p-1 bg-[#0077b5] rounded">
                    <Linkedin className="w-4 h-4 text-white" />
                </div>
                Draft Your First Post
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <div className="relative">
                    <Loader2 className="w-10 h-10 text-[#0077b5] animate-spin" />
                    <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
                  </div>
                  <p className="text-gray-300 text-sm font-medium">Crafting the perfect post with Gemini...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <Sparkles className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-200">
                      I've drafted this based on your app's features. Review it, then click below to copy and open LinkedIn!
                    </p>
                  </div>
                  
                  <textarea
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    className="w-full h-48 bg-gray-950 border border-gray-700 rounded-xl p-4 text-gray-300 focus:ring-2 focus:ring-[#0077b5] focus:border-transparent outline-none resize-none placeholder-gray-600 leading-relaxed"
                    placeholder="Your post content..."
                  />
                  
                  <button
                    onClick={handleCopyAndPost}
                    className="w-full py-3 bg-[#0077b5] hover:bg-[#006097] text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-900/20"
                  >
                    <Copy className="w-4 h-4" />
                    Copy & Go to LinkedIn
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LinkedInShare;