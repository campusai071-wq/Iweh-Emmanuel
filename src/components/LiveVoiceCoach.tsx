import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Mic, MicOff, Volume2, VolumeX, Sparkles, X, Minimize2, Maximize2, 
  Radio, Play, Square, MessageSquare, RefreshCw, Zap, Send, Eye, HelpCircle
} from 'lucide-react';

export interface PageContextData {
  path: string;
  title: string;
  details?: any;
}

interface LiveVoiceCoachProps {
  isOpen?: boolean;
  onClose?: () => void;
  user?: any;
  initialTopic?: string;
  isFloating?: boolean;
  pageContext?: PageContextData;
}

export const LiveVoiceCoach: React.FC<LiveVoiceCoachProps> = ({
  isOpen = true,
  onClose,
  user,
  initialTopic,
  pageContext
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Initializing microphone...');
  const [selectedVoice, setSelectedVoice] = useState('Zephyr');
  const [transcriptHistory, setTranscriptHistory] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: "Hello! Welcome to CampusAI. I am your voice academic coach. I can hear your microphone and see your active page. What would you like to review?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [currentUserSpeech, setCurrentUserSpeech] = useState('');
  const [currentAiSpeech, setCurrentAiSpeech] = useState("Hello! Welcome to CampusAI. I am your voice academic coach. What would you like to review?");
  const [textInput, setTextInput] = useState('');
  const [micVolume, setMicVolume] = useState(0);

  // Refs
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const volumeIntervalRef = useRef<any>(null);
  const currentAudioElementRef = useRef<HTMLAudioElement | null>(null);
  const silenceTimeoutRef = useRef<any>(null);
  const isMountedRef = useRef(true);

  const QUICK_PROMPTS = [
    "Hello! How does this work?",
    "Explain what I'm looking at right now",
    "What are the JAMB cut-off marks for Medicine?",
    "Give me a quick 3-question drill on Physics",
    "How do I calculate UNILAG aggregate score?"
  ];

  // Stop currently playing audio
  const stopAudio = useCallback(() => {
    if (currentAudioElementRef.current) {
      currentAudioElementRef.current.pause();
      currentAudioElementRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsAiSpeaking(false);
  }, []);

  // Browser speech synthesis fallback
  const fallbackSpeechSynthesis = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      const cleanText = text.replace(/[*_#`]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsAiSpeaking(true);
      utterance.onend = () => setIsAiSpeaking(false);
      utterance.onerror = () => setIsAiSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsAiSpeaking(false);
    }
  }, []);

  // Play audio response with fallback
  const speakResponse = useCallback((text: string, base64Audio?: string | null) => {
    stopAudio();
    setIsAiSpeaking(true);

    if (base64Audio) {
      try {
        const audio = new Audio(`data:audio/wav;base64,${base64Audio}`);
        currentAudioElementRef.current = audio;
        audio.onended = () => setIsAiSpeaking(false);
        audio.onerror = () => fallbackSpeechSynthesis(text);
        audio.play().catch(() => fallbackSpeechSynthesis(text));
        return;
      } catch {
        fallbackSpeechSynthesis(text);
        return;
      }
    }

    fallbackSpeechSynthesis(text);
  }, [fallbackSpeechSynthesis, stopAudio]);

  // Send message to voice dialogue API
  const handleSendMessage = useCallback(async (msgToSend: string) => {
    if (!msgToSend.trim()) return;
    const cleanMsg = msgToSend.trim();
    setTextInput('');
    setCurrentUserSpeech(cleanMsg);
    setStatusMessage('Thinking & replying...');
    setIsAiSpeaking(true);

    setTranscriptHistory(prev => [
      ...prev,
      { sender: 'user', text: cleanMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);

    try {
      const res = await fetch('/api/ai/voice-dialogue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: cleanMsg,
          voice: selectedVoice,
          pageContext: pageContext || {
            path: window.location.pathname,
            title: document.title,
            details: 'Active on CampusAI'
          }
        })
      });

      const data = await res.json();
      const reply = data.text || "I heard you! What subject or university topic would you like to explore?";
      setCurrentAiSpeech(reply);
      setStatusMessage('Speaking reply...');

      setTranscriptHistory(prev => [
        ...prev,
        { sender: 'ai', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);

      speakResponse(reply, data.audio);
    } catch (e: any) {
      console.warn('[Voice API Error]:', e);
      const fallbackReply = "I heard you! I am your CampusAI academic coach. What topic would you like to review?";
      setCurrentAiSpeech(fallbackReply);
      speakResponse(fallbackReply);
    } finally {
      setTimeout(() => {
        if (isMountedRef.current) setStatusMessage('Listening for your voice...');
      }, 3000);
    }
  }, [pageContext, selectedVoice, speakResponse]);

  // Start continuous Web Speech Recognition with 1.2s silence auto-send
  const startSpeechRecognition = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setStatusMessage('Speech recognition not supported in this browser; use text input or buttons');
      return;
    }

    try {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setStatusMessage('Listening... Speak now!');
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        const candidate = (final || interim).trim();
        if (candidate) {
          setCurrentUserSpeech(candidate);

          // Clear any pending silence timer
          if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);

          // If final transcript is detected, send immediately
          if (final.trim()) {
            handleSendMessage(final.trim());
          } else {
            // Silence timer: if user stops speaking for 1.3 seconds, automatically send the interim text!
            silenceTimeoutRef.current = setTimeout(() => {
              if (candidate && candidate.length > 1) {
                handleSendMessage(candidate);
              }
            }, 1300);
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('[Speech Recognition Event]:', event.error);
        if (event.error === 'not-allowed') {
          setIsListening(false);
          setStatusMessage('Microphone permission denied. Click mic to enable or type below.');
        }
      };

      recognition.onend = () => {
        if (isMountedRef.current && isOpen && !isMuted) {
          try {
            recognition.start();
          } catch {}
        } else {
          setIsListening(false);
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (err) {
      console.warn('[Speech Recognition Setup Failed]:', err);
    }
  }, [handleSendMessage, isMuted, isOpen]);

  // Audio level meter
  const startMicMetering = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      volumeIntervalRef.current = setInterval(() => {
        if (!analyserRef.current || isMuted) {
          setMicVolume(0);
          return;
        }
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        const normalized = Math.min(100, Math.round((avg / 128) * 100 * 1.6));
        setMicVolume(normalized);
      }, 50);

      startSpeechRecognition();
    } catch (micErr) {
      console.warn('[Microphone initialization warning]:', micErr);
      setStatusMessage('Microphone access unavailable. You can type or tap prompt buttons.');
    }
  }, [isMuted, startSpeechRecognition]);

  useEffect(() => {
    isMountedRef.current = true;
    if (isOpen) {
      startMicMetering();
      // Unlock audio and speak initial warm greeting
      setTimeout(() => {
        speakResponse("Hello! I am your CampusAI academic voice coach. I can hear you and see your screen. Ask me anything!");
      }, 600);
    }

    return () => {
      isMountedRef.current = false;
      if (volumeIntervalRef.current) clearInterval(volumeIntervalRef.current);
      if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
      }
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach(t => t.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
      stopAudio();
    };
  }, [isOpen, speakResponse, startMicMetering, stopAudio]);

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      startSpeechRecognition();
    } else {
      setIsMuted(true);
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      setMicVolume(0);
      setStatusMessage('Microphone muted.');
    }
  };

  if (!isOpen) return null;

  // =========================================================================
  // MINIMIZED FLOATING ORB (Permits freely browsing any part of site)
  // =========================================================================
  if (isMinimized) {
    return (
      <div className="fixed bottom-24 right-4 sm:bottom-8 sm:right-8 z-[160] flex items-end space-x-3 pointer-events-auto">
        <div className="hidden sm:flex flex-col bg-gray-900/95 border border-emerald-500/30 rounded-2xl p-3 shadow-2xl max-w-xs text-xs backdrop-blur-md">
          <div className="flex items-center justify-between space-x-2 pb-1.5 border-b border-gray-800">
            <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold text-[11px]">
              <Radio className="w-3 h-3 animate-pulse" />
              <span>Voice Coach Active</span>
            </div>
            <div className="flex items-center space-x-1 text-[10px] text-gray-400 truncate max-w-[140px]">
              <Eye className="w-3 h-3 text-cyan-400 shrink-0" />
              <span className="truncate">{pageContext?.title || 'CampusAI'}</span>
            </div>
          </div>
          <p className="text-gray-200 text-xs mt-1.5 line-clamp-2">
            {isAiSpeaking ? (currentAiSpeech || "Speaking...") : currentUserSpeech ? `You: "${currentUserSpeech}"` : "Listening... Say 'Hello' anytime!"}
          </p>
        </div>

        <div className="relative group">
          {isAiSpeaking && (
            <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full blur animate-pulse opacity-75" />
          )}

          <div className="relative flex items-center space-x-1 bg-gray-900 border border-emerald-500/50 rounded-full p-1.5 shadow-2xl">
            <button
              onClick={toggleMute}
              className={`p-3 rounded-full flex items-center justify-center transition ${
                isMuted
                  ? 'bg-red-500/20 text-red-400'
                  : micVolume > 15
                  ? 'bg-emerald-500 text-white shadow-lg animate-pulse'
                  : 'bg-emerald-600 text-white hover:bg-emerald-500'
              }`}
              title={isMuted ? 'Unmute Mic' : 'Microphone Active'}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsMinimized(false)}
              className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition"
              title="Expand Voice Assistant"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-red-400 rounded-full hover:bg-gray-800 transition"
                title="End Voice Call"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // FULL EXPANDED DIALOGUE HUD
  // =========================================================================
  return (
    <div className="fixed inset-0 z-[170] flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm pointer-events-auto">
      <div className="relative w-full max-w-2xl bg-gray-950 border border-gray-800 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800/80 bg-gray-900/60">
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-cyan-600 text-white shadow-lg">
              <Radio className="w-5 h-5 animate-pulse" />
              {isAiSpeaking && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm sm:text-base font-bold text-white">CampusAI Live Voice Coach</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {isListening ? 'Listening Live' : 'Active'}
                </span>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-gray-400 mt-0.5">
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                <span className="truncate max-w-[280px]">
                  Viewing: <span className="text-cyan-300 font-medium">{pageContext?.title || document.title || 'CampusAI'}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setIsMinimized(true)}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 text-xs font-medium flex items-center space-x-1 border border-gray-800 transition"
              title="Minimize & Speak in Background while browsing"
            >
              <Minimize2 className="w-4 h-4" />
              <span className="hidden sm:inline">Browse in Background</span>
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition"
                title="Close Voice Coach"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Live Audio Visualizer & Mic Level Display */}
        <div className="bg-gradient-to-b from-gray-900/50 to-gray-950 px-5 py-3 border-b border-gray-800/80 flex flex-col items-center justify-center">
          <div className="flex items-center space-x-1.5 h-8">
            {[0.4, 0.7, 1.0, 0.8, 1.2, 0.6, 0.9, 0.5].map((multiplier, idx) => {
              const height = isMuted ? 4 : Math.max(4, Math.min(32, (micVolume * multiplier) / 2));
              return (
                <div
                  key={idx}
                  style={{ height: `${height}px` }}
                  className={`w-1.5 rounded-full transition-all duration-75 ${
                    isMuted
                      ? 'bg-gray-700'
                      : micVolume > 12
                      ? 'bg-gradient-to-t from-emerald-500 to-cyan-400 shadow-sm shadow-emerald-400'
                      : 'bg-gray-700'
                  }`}
                />
              );
            })}
          </div>
          <div className="text-[11px] font-medium text-gray-400 mt-1 flex items-center space-x-2">
            {isMuted ? (
              <span className="text-red-400 flex items-center space-x-1">
                <MicOff className="w-3 h-3" />
                <span>Microphone Muted</span>
              </span>
            ) : micVolume > 10 ? (
              <span className="text-emerald-400 flex items-center space-x-1">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Hearing your voice loud & clear ({micVolume}%)</span>
              </span>
            ) : (
              <span>{statusMessage}</span>
            )}
          </div>
        </div>

        {/* Transcript Conversation History */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 scrollbar-thin scrollbar-thumb-gray-800">
          {transcriptHistory.map((item, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${item.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center space-x-1.5 mb-1 px-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  {item.sender === 'user' ? 'You' : 'Academic Coach'}
                </span>
                <span className="text-[10px] text-gray-600">{item.time}</span>
              </div>
              <div
                className={`max-w-[85%] rounded-2xl p-3 text-xs sm:text-sm leading-relaxed ${
                  item.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-none shadow-md'
                    : 'bg-gray-900 border border-gray-800 text-gray-200 rounded-bl-none shadow-sm'
                }`}
              >
                {item.text}
              </div>
            </div>
          ))}

          {/* Real-time Interim User Speech */}
          {currentUserSpeech && (
            <div className="flex flex-col items-end opacity-90 animate-pulse">
              <span className="text-[10px] font-semibold text-emerald-400 mb-0.5">Live Hearing:</span>
              <div className="bg-emerald-700/80 text-white rounded-2xl rounded-br-none p-3 text-xs italic">
                "{currentUserSpeech}"
              </div>
            </div>
          )}
        </div>

        {/* Quick Say Hello / Test Buttons */}
        <div className="px-4 py-2 bg-gray-900/40 border-t border-gray-800/60 overflow-x-auto flex items-center space-x-2 scrollbar-none">
          <span className="text-[11px] font-medium text-gray-500 shrink-0">Try saying:</span>
          {QUICK_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="px-2.5 py-1 rounded-lg bg-gray-900 border border-gray-800 hover:border-emerald-500/50 text-[11px] text-gray-300 hover:text-white shrink-0 transition"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Bottom Voice & Text Input Dock */}
        <div className="p-3 sm:p-4 bg-gray-900 border-t border-gray-800 flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={toggleMute}
            className={`p-3 rounded-2xl flex items-center justify-center transition border ${
              isMuted
                ? 'bg-red-500/20 border-red-500/40 text-red-400'
                : 'bg-emerald-600 border-emerald-500 text-white shadow-lg hover:bg-emerald-500'
            }`}
            title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Quick "Say Hello" Test Voice Button */}
          <button
            onClick={() => handleSendMessage("Hello! I can hear you.")}
            className="px-3 py-2 bg-emerald-700/60 hover:bg-emerald-600 border border-emerald-500/50 text-white rounded-xl text-xs font-bold shrink-0 transition"
          >
            Say "Hello"
          </button>

          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(textInput)}
            placeholder="Speak into microphone or type here..."
            className="flex-1 bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition"
          />

          <button
            onClick={() => handleSendMessage(textInput)}
            disabled={!textInput.trim()}
            className="p-2.5 sm:p-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:hover:bg-cyan-600 text-white transition cursor-pointer"
            title="Send"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveVoiceCoach;
