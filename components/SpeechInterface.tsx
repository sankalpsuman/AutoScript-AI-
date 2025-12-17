import React, { useState, useRef, useEffect } from 'react';
import { Mic, Play, Square, AlertCircle, Volume2, Wand2 } from 'lucide-react';
import { VoiceName, AudioState } from '../types';
import { generateSpeech } from '../services/geminiService';
import { decodeBase64, decodeAudioData } from '../services/audioUtils';
import LinkedInShare from './LinkedInShare';

const SpeechInterface: React.FC = () => {
  const [text, setText] = useState('Welcome to Sankalp Chat AI. I can convert this text into lifelike speech instantly.');
  const [selectedVoice, setSelectedVoice] = useState<VoiceName>(VoiceName.Kore);
  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    isLoading: false,
    error: null,
  });

  // Audio refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (sourceNodeRef.current) {
        sourceNodeRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const handleGenerateAndPlay = async () => {
    if (!text.trim()) return;

    // Stop current playback if any
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      sourceNodeRef.current = null;
    }

    setAudioState({ isPlaying: false, isLoading: true, error: null });

    try {
      const base64Audio = await generateSpeech(text, selectedVoice);

      if (!base64Audio) {
        throw new Error("No audio data received");
      }

      // Initialize AudioContext if needed
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      } else if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      // Decode audio
      const rawBytes = decodeBase64(base64Audio);
      const audioBuffer = await decodeAudioData(rawBytes, audioContextRef.current, 24000);

      // Play
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      
      source.onended = () => {
        setAudioState(prev => ({ ...prev, isPlaying: false }));
      };

      source.start(0);
      sourceNodeRef.current = source;
      
      setAudioState({ isPlaying: true, isLoading: false, error: null });

    } catch (err: any) {
      console.error(err);
      setAudioState({ 
        isPlaying: false, 
        isLoading: false, 
        error: err.message || "Failed to generate speech" 
      });
    }
  };

  const handleStop = () => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      sourceNodeRef.current = null;
    }
    setAudioState(prev => ({ ...prev, isPlaying: false }));
  };

  return (
    <div className="flex flex-col h-full bg-gray-950 overflow-y-auto">
      <header className="p-4 md:p-6 border-b border-gray-800 bg-gray-900/50 backdrop-blur sticky top-0 z-10 flex justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2 text-white">
            <Mic className="w-5 h-5 text-indigo-400" />
            Text to Speech
          </h2>
          <p className="text-sm text-gray-400">Synthesize lifelike speech from text using Gemini.</p>
        </div>
        <LinkedInShare featureContext="I just implemented a next-gen Text-to-Speech engine using Gemini 2.5 Flash, capable of generating lifelike voices like 'Kore' and 'Fenrir'." />
      </header>

      <div className="flex-1 p-4 md:p-12 max-w-4xl mx-auto w-full flex flex-col justify-center">
        <div className="bg-gray-900 rounded-2xl border border-gray-800 shadow-xl overflow-hidden">
          
          {/* Controls Bar */}
          <div className="p-4 border-b border-gray-800 flex flex-wrap gap-4 items-center justify-between bg-gray-800/50">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-400">Voice:</label>
              <select 
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value as VoiceName)}
                className="bg-gray-900 border border-gray-700 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-32 p-2.5"
              >
                {Object.values(VoiceName).map(voice => (
                  <option key={voice} value={voice}>{voice}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
               {audioState.error && (
                 <div className="flex items-center gap-1 text-red-400 text-sm mr-4">
                   <AlertCircle className="w-4 h-4" />
                   <span>Error generating audio</span>
                 </div>
               )}
            </div>
          </div>

          {/* Text Area */}
          <div className="p-6">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-48 bg-transparent text-xl md:text-2xl text-white placeholder-gray-600 resize-none focus:outline-none font-light leading-relaxed"
              placeholder="Enter text to speak..."
            />
          </div>

          {/* Action Footer */}
          <div className="p-6 bg-gray-900 border-t border-gray-800 flex justify-between items-center">
             <div className="flex items-center gap-2 text-gray-500 text-sm">
               <Volume2 className="w-4 h-4" />
               <span>Gemini TTS Preview</span>
             </div>

             <div className="flex gap-3">
                {audioState.isPlaying ? (
                   <button 
                    onClick={handleStop}
                    className="flex items-center gap-2 px-6 py-3 bg-red-500/10 text-red-400 border border-red-500/50 hover:bg-red-500/20 rounded-xl font-medium transition-all"
                  >
                    <Square className="w-5 h-5 fill-current" />
                    Stop
                  </button>
                ) : (
                  <button 
                    onClick={handleGenerateAndPlay}
                    disabled={audioState.isLoading || !text.trim()}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-indigo-900/20"
                  >
                    {audioState.isLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Generating...
                      </span>
                    ) : (
                      <>
                        <Play className="w-5 h-5 fill-current" />
                        Speak
                      </>
                    )}
                  </button>
                )}
             </div>
          </div>
        </div>

        <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
               <Wand2 className="w-4 h-4" />
               Try voices like 'Kore' or 'Fenrir' for different tones.
            </p>
        </div>
      </div>
    </div>
  );
};

export default SpeechInterface;