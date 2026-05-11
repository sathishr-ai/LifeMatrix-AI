import { ArrowLeft, Send, Mic, Sparkles, Trash2, Brain, Activity, Zap, Salad, Dumbbell, TrendingUp, Copy, Check, ThumbsUp, ThumbsDown, Bot } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';

export function AIChat() {
  const navigate = useNavigate();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [message, setMessage] = useState('');
  const [apiKey] = useState(
    import.meta.env.VITE_OPENROUTER_API_KEY || localStorage.getItem('openrouter_api_key') || ''
  );
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<Record<number, 'like' | 'dislike' | null>>({});

  const handleCopyResponse = (text: string, index: number) => {
    const cleanText = text.replace(/\*\*/g, '').replace(/###\s+/g, '').replace(/##\s+/g, '').replace(/#\s+/g, '');
    
    // Method 1: Modern Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(cleanText)
        .then(() => {
          setCopiedIndex(index);
          setTimeout(() => setCopiedIndex(null), 2000);
          toast.success('Response Copied', {
            description: 'The AI insight has been copied to your clipboard.',
            duration: 3000
          });
        })
        .catch(() => {
          fallbackCopy(cleanText, index);
        });
    } else {
      // Method 2: Classic Textarea Fallback for Mobile WebViews / Restricted environments
      fallbackCopy(cleanText, index);
    }
  };

  const fallbackCopy = (text: string, index: number) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      
      // Avoid scrolling to bottom on focus
      textArea.style.top = '0';
      textArea.style.left = '0';
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
        toast.success('Response Copied', {
          description: 'The AI insight has been copied to your clipboard.',
          duration: 3000
        });
      } else {
        throw new Error('Fallback copy command failed');
      }
    } catch (err) {
      console.error('Fallback copy failed:', err);
      toast.error('Copy Failed', {
        description: 'Your mobile device restricts automatic clipboard access. Please manually select and copy the text.',
        duration: 5000
      });
    }
  };

  const handleToggleLike = (index: number) => {
    setFeedback(prev => {
      const isCurrentlyLiked = prev[index] === 'like';
      const nextFeedback = isCurrentlyLiked ? null : 'like';
      if (nextFeedback === 'like') {
        toast.success('Feedback Captured', {
          description: 'Thank you! Marked as helpful analysis.',
          duration: 3000
        });
      }
      return { ...prev, [index]: nextFeedback };
    });
  };

  const handleToggleDislike = (index: number) => {
    setFeedback(prev => {
      const isCurrentlyDisliked = prev[index] === 'dislike';
      const nextFeedback = isCurrentlyDisliked ? null : 'dislike';
      if (nextFeedback === 'dislike') {
        toast.info('Feedback Captured', {
          description: 'Thank you! We will refine future clinical responses.',
          duration: 3000
        });
      }
      return { ...prev, [index]: nextFeedback };
    });
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const isWebView = /wv|WebView|Expo|CoreHTML|iPhone|iPad|Android/i.test(navigator.userAgent) && !/Safari|Chrome/i.test(navigator.userAgent);

    const startSimulator = () => {
      setIsListening(true);
      toast.info('Starting Speech Simulator', { description: 'Simulating speech input...' });
      
      setTimeout(() => {
        const phrases = [
          'What is my stability rating based on my heart rate today?',
          'Analyze my current hydration and sleep patterns.',
          'When is my next medication dose scheduled?'
        ];
        const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
        setMessage(randomPhrase);
        setIsListening(false);
        toast.success('Voice Sync Successful', {
          description: 'Simulated clinical query captured and parsed.',
          duration: 3000
        });
      }, 2000);
    };

    if (!SpeechRecognition || isWebView) {
      startSimulator();
      return;
    }

    try {
      if (isListening) return;

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        toast.info('Voice Capture Active', {
          description: 'Listening to clinical queries... Speak now.',
          duration: 3000,
          icon: <Mic className="w-4 h-4 text-rose-500 animate-pulse" />
        });
      };

      recognition.onerror = (err: any) => {
        console.error('Speech Recognition Error:', err);
        setIsListening(false);
        // Fall back to simulator on error
        toast.warning('Microphone Restricted', { description: 'Microphone blocked or not supported inside WebView. Running simulator...' });
        startSimulator();
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (event: any) => {
        if (event.results && event.results[0] && event.results[0][0]) {
          const speechToText = event.results[0][0].transcript;
          setMessage(speechToText);
          toast.success('Voice Sync Successful', {
            description: 'Clinical query captured and parsed.',
            duration: 3000
          });
        }
      };

      recognition.start();
    } catch (err: any) {
      console.error('Speech Recognition Catch Error:', err);
      startSimulator();
    }
  };

  const activeUser = localStorage.getItem('userName') || 'Sathish';

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(`ai_chat_messages_${activeUser}`);
    return saved ? JSON.parse(saved) : [
      {
        type: 'ai',
        text: "Hello! I'm your LifeMatrix AI health assistant. I can analyze your symptoms, provide dietary guidance, and explain your risk factors. How can I assist you today?",
        time: 'Now',
      },
    ];
  });

  const isInitialMount = useRef(true);

  useEffect(() => {
    localStorage.setItem(`ai_chat_messages_${activeUser}`, JSON.stringify(messages));
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeUser]);

  const handleClearChat = () => {
    const initial = [
      {
        type: 'ai',
        text: "Chat history cleared. I'm ready for your next health inquiry.",
        time: 'Now',
      },
    ];
    setMessages(initial);
    localStorage.setItem(`ai_chat_messages_${activeUser}`, JSON.stringify(initial));
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    const userText = message;
    setMessage('');

    const userMsg = {
      type: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev: any[]) => [...prev, userMsg]);

    if (!apiKey) {
      setMessages((prev: any[]) => [
        ...prev,
        {
          type: 'ai',
          text: '**System Notice:** API configuration missing. Please link your OpenRouter key to enable deep clinical intelligence.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      return;
    }

    setIsTyping(true);

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'LifeMatrix AI'
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          max_tokens: 1000,
          messages: [
            {
              role: 'system',
              content: 'You are the LifeMatrix AI Health Assistant. Provide high-end, professional, and clinical-sounding wellness advice. Use markdown for bolding and lists.'
            },
            ...messages.map((m: any) => ({
              role: m.type === 'user' ? 'user' : 'assistant',
              content: m.text
            })),
            { role: 'user', content: userText }
          ]
        })
      });

      const data = await response.json();
      let aiReply = '';
      if (data?.choices?.[0]?.message?.content) {
        aiReply = data.choices[0].message.content;
      } else {
        aiReply = "I encountered a synchronization issue with the medical cloud. Please try again.";
      }

      setMessages((prev: any[]) => [
        ...prev,
        {
          type: 'ai',
          text: aiReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      setMessages((prev: any[]) => [
        ...prev,
        {
          type: 'ai',
          text: 'Biological sync failed. Please check your connectivity.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderMarkdown = (text: string) => {
    if (!text) return '';
    let parsed = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    
    // 1. Headers (####, ###, ##, #)
    parsed = parsed.replace(/^####\s+(.*)/gm, '<h5 class="text-[11px] font-black mt-3 mb-1 text-indigo-950 uppercase tracking-widest">$1</h5>');
    parsed = parsed.replace(/^###\s+(.*)/gm, '<h4 class="text-[13px] font-black mt-3 mb-1 text-indigo-950">$1</h4>');
    parsed = parsed.replace(/^##\s+(.*)/gm, '<h3 class="text-[14px] font-black mt-4 mb-1.5 text-indigo-950">$1</h3>');
    parsed = parsed.replace(/^#\s+(.*)/gm, '<h2 class="text-base font-black mt-5 mb-2 text-indigo-950">$1</h2>');

    // 2. Bold (**text**)
    parsed = parsed.replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-indigo-950">$1</strong>');
    
    // 3. Bullet points (*, -, •)
    parsed = parsed.replace(/^\s*[-*•]\s+(.*)/gm, '<div class="flex items-start gap-1.5 my-1 ml-1"><span class="text-secondary font-black">•</span><span class="flex-1">$1</span></div>');

    // 4. Numbered Lists (1., 2.)
    parsed = parsed.replace(/^\s*(\d+)\.\s+(.*)/gm, '<div class="flex items-start gap-1.5 my-1 ml-1"><span class="text-indigo-950 font-black">$1.</span><span class="flex-1">$2</span></div>');

    // 5. Linebreaks
    parsed = parsed.replace(/\n/g, '<br />');

    // Clean up consecutive brs around block-level div elements
    parsed = parsed.replace(/(<\/div>)<br\s*\/?>/gi, '$1');
    parsed = parsed.replace(/<br\s*\/?>(<div)/gi, '$1');
    
    return <span dangerouslySetInnerHTML={{ __html: parsed }} />;
  };

  return (
    <div className="size-full bg-slate-50 flex flex-col relative overflow-hidden">
      {/* Performance Optimized Background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-20 left-0 w-64 h-64 bg-purple-50/50 rounded-full blur-3xl pointer-events-none"></div>

      {/* CLEAR TRANSPARENT HEADER */}
      <div className="px-6 py-5 bg-transparent sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-violet-50 border border-violet-100/50 flex items-center justify-center flex-shrink-0 text-violet-600">
            <Bot className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-black text-indigo-950 tracking-tight">AI Health <span className="text-secondary">Assistant</span></h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 rounded-full border border-emerald-100">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">Live</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleClearChat}
            className="group relative w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-white to-slate-50 border border-white shadow-[0_8px_25px_rgba(244,63,94,0.08)] hover:shadow-[0_12px_30px_rgba(244,63,94,0.15)] hover:-translate-y-0.5 transition-all active:scale-90"
            title="Clear Neural History"
          >
            {/* High-Impact Atmospheric Glow */}
            <div className="absolute inset-0 bg-rose-500/0 group-hover:bg-rose-500/10 rounded-full blur-xl transition-all duration-500"></div>
            
            <div className="relative z-10 w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center group-hover:bg-rose-100 transition-colors">
              <Trash2 className="w-4.5 h-4.5 md:w-5 md:h-5 text-rose-500 group-hover:text-rose-600 transition-transform group-hover:scale-110" />
            </div>

            {/* Subtle premium accent */}
            <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-200 group-hover:bg-rose-400 transition-colors"></div>
          </button>
        </div>
      </div>

      {/* CHAT INTERFACE - OPTIMIZED WIDTH & SPACING */}
      <div className="flex-1 overflow-auto px-3.5 py-4 md:px-8 md:py-6 pb-4 relative z-10 max-w-5xl mx-auto w-full">
        <div className="space-y-5 md:space-y-8 mb-8">
          {messages.map((msg: any, index: number) => (
            <div
              key={index}
              className={`flex items-start gap-2.5 md:gap-4 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-9 h-9 md:w-10 md:h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md border border-white/50 ${msg.type === 'user' ? 'bg-gradient-to-br from-indigo-600 to-purple-600' : 'bg-white'
                }`}>
                {msg.type === 'user' ? <Zap className="w-4 h-4 md:w-5 md:h-5 text-white" /> : <Brain className="w-4 h-4 md:w-5 md:h-5 text-secondary" />}
              </div>

              <div className={`max-w-[85%] md:max-w-[75%] ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
                <div
                  className={`rounded-[24px] px-4 py-3 md:px-6 md:py-4 shadow-md ${msg.type === 'user'
                    ? 'bg-indigo-950 text-white border border-indigo-900 rounded-tr-none text-left'
                    : 'bg-white border border-slate-100 text-indigo-950 rounded-tl-none'
                    }`}
                >
                  <p className="text-[13px] leading-relaxed font-medium">{renderMarkdown(msg.text)}</p>
                </div>
                <div className="flex items-center justify-between gap-4 mt-1.5 px-1 min-w-[150px]">
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none">
                    {msg.time} • {msg.type === 'user' ? 'Verified Input' : 'AI Analysis'}
                  </p>
                  
                  {msg.type === 'ai' && (
                    <div className="flex items-center gap-1">
                      {/* Copy Action */}
                      <button
                        onClick={() => handleCopyResponse(msg.text, index)}
                        className="p-1 rounded-md text-muted-foreground hover:text-indigo-950 hover:bg-slate-200/50 transition-colors"
                        title="Copy Response"
                      >
                        {copiedIndex === index ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      
                      {/* Like Action */}
                      <button
                        onClick={() => handleToggleLike(index)}
                        className={`p-1 rounded-md transition-all ${
                          feedback[index] === 'like'
                            ? 'text-emerald-500 bg-emerald-50/80 scale-105 shadow-[0_2px_8px_rgba(16,185,129,0.15)]'
                            : 'text-muted-foreground hover:text-emerald-500 hover:bg-slate-200/50'
                        }`}
                        title="Helpful Response"
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${feedback[index] === 'like' ? 'fill-emerald-500' : ''}`} />
                      </button>
                      
                      {/* Dislike Action */}
                      <button
                        onClick={() => handleToggleDislike(index)}
                        className={`p-1 rounded-md transition-all ${
                          feedback[index] === 'dislike'
                            ? 'text-rose-500 bg-rose-50/80 scale-105 shadow-[0_2px_8px_rgba(244,63,94,0.15)]'
                            : 'text-muted-foreground hover:text-rose-500 hover:bg-slate-200/50'
                        }`}
                        title="Unhelpful Response"
                      >
                        <ThumbsDown className={`w-3.5 h-3.5 ${feedback[index] === 'dislike' ? 'fill-rose-500' : ''}`} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-start gap-2.5 md:gap-4">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-2xl bg-white flex items-center justify-center flex-shrink-0 shadow-md border border-white/50">
                <Brain className="w-4 h-4 md:w-5 md:h-5 text-secondary animate-pulse" />
              </div>
              <div className="bg-white/80 backdrop-blur-md border border-slate-100 rounded-[24px] rounded-tl-none px-4 py-3 md:px-6 md:py-4 shadow-md">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* PREMIUM QUICK SUGGESTIONS - BOTTOM POSITIONED EMPTY STATE ONLY */}
        {!isTyping && !messages.some(m => m.type === 'user') && (
          <div className="pb-4 animate-fade-in">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4 ml-1">Suggested Queries</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
              {[
                { text: 'Risk Factors', sub: 'ANALYZE LATEST', icon: Activity, color: 'text-rose-600', bg: 'bg-rose-50/50' },
                { text: 'Dietary Plan', sub: 'PREVENTATIVE', icon: Salad, color: 'text-emerald-600', bg: 'bg-emerald-50/50' },
                { text: 'Trajectory', sub: 'EXPLAIN CURRENT', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50/50' },
                { text: 'Exercise', sub: 'BIO-OPTIMIZED', icon: Dumbbell, color: 'text-purple-600', bg: 'bg-purple-50/50' },
              ].map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const fullQueries: Record<string, string> = {
                      'Risk Factors': 'Analyze my latest risk factors',
                      'Dietary Plan': 'Suggest a preventative dietary plan',
                      'Trajectory': 'Explain my current health trajectory',
                      'Exercise': 'Recommend bio-optimized exercises'
                    };
                    setMessage(fullQueries[item.text]);
                  }}
                  className="group relative bg-white rounded-2xl p-4 border border-slate-100 shadow-sm transition-all hover:bg-slate-50 hover:-translate-y-0.5 active:scale-95 text-left flex flex-col gap-2.5 overflow-hidden"
                >
                  <div className={`w-10 h-10 rounded-2xl ${item.bg} flex items-center justify-center ${item.color} shadow-sm group-hover:scale-110 transition-transform relative z-10`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="relative z-10">
                    <p className={`text-[7px] font-black ${item.color} opacity-70 uppercase tracking-[0.15em] mb-1 leading-none`}>{item.sub}</p>
                    <h4 className="text-[12px] font-black text-indigo-950 tracking-tight leading-tight group-hover:text-secondary transition-colors">{item.text}</h4>
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-gradient-to-br from-transparent to-indigo-50/30 rounded-full blur-xl"></div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ULTRA-MODERN INTEGRATED PILL INPUT - SOLID FLEX ATTACHMENT */}
      <div className="w-full px-6 pb-6 pt-4 bg-slate-50 z-20">
        <div className="max-w-4xl mx-auto relative group">
          <div className="relative flex items-center bg-white border border-slate-200 rounded-[40px] p-1.5 pr-2 shadow-[0_10px_30px_rgba(0,0,0,0.04)] focus-within:border-secondary/40 focus-within:shadow-[0_15px_40px_rgba(0,0,0,0.08)] transition-all">
            <button 
              onClick={handleVoiceInput}
              type="button"
              className={`p-3.5 rounded-full transition-all active:scale-90 relative ${
                isListening 
                  ? 'text-rose-500 bg-rose-50' 
                  : 'text-muted-foreground hover:text-secondary hover:bg-secondary/5'
              }`}
              title="Speak Clinical Query"
            >
              {isListening && (
                <span className="absolute inset-0 rounded-full bg-rose-400/20 animate-ping"></span>
              )}
              <Mic className={`w-5 h-5 ${isListening ? 'animate-pulse text-rose-500' : ''}`} />
            </button>
            
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Query the LifeMatrix AI..."
              className="flex-1 bg-transparent border-none focus:outline-none px-2 text-sm font-medium placeholder:text-muted-foreground/50"
            />
            
            <button
              onClick={handleSend}
              disabled={!message.trim() || isTyping}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-lg ${message.trim() && !isTyping
                ? 'bg-indigo-950 text-white shadow-indigo-200 hover:scale-105'
                : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const ChevronRight = ({ className }: { className?: string }) => {
  return (
    <svg 
      className={className} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
};
