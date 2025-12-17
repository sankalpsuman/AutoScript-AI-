import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Sparkles, Loader2, X } from 'lucide-react';
import { analyzeImage } from '../services/geminiService';
import LinkedInShare from './LinkedInShare';

const VisionInterface: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [prompt, setPrompt] = useState('Describe this image in detail.');
  const [result, setResult] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setSelectedImage(base64String);
        setMimeType(file.type);
        setResult(''); 
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setResult('');
    setMimeType('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAnalyze = async () => {
    if (!selectedImage || !prompt) return;

    setIsAnalyzing(true);
    setResult('');

    try {
      // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = selectedImage.split(',')[1];
      const analysisText = await analyzeImage(base64Data, mimeType, prompt);
      setResult(analysisText);
    } catch (error) {
      console.error(error);
      setResult("Failed to analyze image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-950 overflow-y-auto">
      <header className="p-4 md:p-6 border-b border-gray-800 bg-gray-900/50 backdrop-blur sticky top-0 z-10 flex justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2 text-white">
            <ImageIcon className="w-5 h-5 text-indigo-400" />
            Vision Analysis
          </h2>
          <p className="text-sm text-gray-400">Upload an image and ask Gemini to analyze it.</p>
        </div>
        <LinkedInShare featureContext="I just built a Computer Vision tool that can analyze complex images and generate detailed descriptions using the Gemini 2.5 Multimodal API." />
      </header>

      <div className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div 
              className={`relative border-2 border-dashed rounded-2xl transition-all aspect-video flex flex-col items-center justify-center overflow-hidden
              ${selectedImage ? 'border-indigo-500/50 bg-gray-900' : 'border-gray-700 bg-gray-800/50 hover:bg-gray-800 hover:border-gray-600'}`}
            >
              {!selectedImage ? (
                <div className="text-center p-6 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="w-12 h-12 mx-auto text-gray-500 mb-4" />
                  <p className="text-gray-300 font-medium">Click to upload image</p>
                  <p className="text-sm text-gray-500 mt-2">JPEG or PNG supported</p>
                </div>
              ) : (
                <div className="relative w-full h-full group">
                  <img src={selectedImage} alt="Preview" className="w-full h-full object-contain" />
                  <button 
                    onClick={clearImage}
                    className="absolute top-2 right-2 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileSelect}
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-400">Your Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full h-32 bg-gray-800 text-white border border-gray-700 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                placeholder="What should Gemini look for in this image?"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!selectedImage || isAnalyzing || !prompt.trim()}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 disabled:text-gray-500 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Analyze Image
                </>
              )}
            </button>
          </div>

          {/* Result Section */}
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 min-h-[400px]">
             <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
               Analysis Result
             </h3>
             {result ? (
               <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-wrap leading-relaxed">
                 {result}
               </div>
             ) : (
               <div className="h-full flex flex-col items-center justify-center text-gray-600 space-y-3">
                 {isAnalyzing ? (
                    <div className="flex flex-col items-center animate-pulse">
                      <div className="w-12 h-12 bg-gray-800 rounded-full mb-3"></div>
                      <div className="h-4 w-32 bg-gray-800 rounded"></div>
                    </div>
                 ) : (
                   <>
                    <Sparkles className="w-10 h-10 opacity-20" />
                    <p>Analysis will appear here</p>
                   </>
                 )}
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisionInterface;