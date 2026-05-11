import { useNavigate } from 'react-router';
import { useState } from 'react';
import { BookOpen, Play, Award, TrendingUp, Search, Clock, Sparkles, ChevronRight, Zap, Brain, Dumbbell, HeartPulse, Moon, Pill, Salad, BrainCircuit } from 'lucide-react';
import { getStorageItem, setStorageItem } from '../../utils/storage';

export function LearningDashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const allArticles = [
    { title: 'Macronutrient Synthesis Guide', category: 'Nutrition', difficulty: 'Intermediate', duration: '5 min read' },
    { title: 'Glycemic Index & Insulin Response', category: 'Nutrition', difficulty: 'Beginner', duration: '4 min read' },
    { title: 'Optimal Hydration Dynamics', category: 'Nutrition', difficulty: 'Beginner', duration: '3 min read' },
    { title: 'Zone 2 Cardio Protocols', category: 'Exercise', difficulty: 'Beginner', duration: '6 min read' },
    { title: 'Circadian Rhythm Synchronization', category: 'Sleep', difficulty: 'Beginner', duration: '5 min read' },
    { title: 'Understanding Arterial Hypertension', category: 'Pathology', difficulty: 'Beginner', duration: '6 min read' },
    { title: 'Metformin Mechanisms & Longevity', category: 'Pharmacology', difficulty: 'Intermediate', duration: '7 min read' },
  ];

  const filteredArticles = allArticles.filter(art => 
    art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    art.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Load diagnostic history to derive learning metrics
  const history = JSON.parse(getStorageItem('symptomHistory', '[]'));
  
  const completedArticles = JSON.parse(getStorageItem('completedArticles', '[]'));
  const completedQuizzes = JSON.parse(getStorageItem('completedQuizzes', '[]'));

  // Real consecutive-day login streak tracking algorithm
  const updateAndGetStreak = () => {
    const todayStr = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
    const lastLogin = getStorageItem('lastLoginDate', '');
    const currentStreakStr = getStorageItem('loginStreak', '0');
    let currentStreak = parseInt(currentStreakStr) || 0;

    if (!lastLogin) {
      currentStreak = 1;
      setStorageItem('lastLoginDate', todayStr);
      setStorageItem('loginStreak', '1');
    } else if (lastLogin === todayStr) {
      if (currentStreak === 0) {
        currentStreak = 1;
        setStorageItem('loginStreak', '1');
      }
    } else {
      const todayDate = new Date(todayStr);
      const lastLoginDate = new Date(lastLogin);
      const diffTime = Math.abs(todayDate.getTime() - lastLoginDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentStreak += 1;
        setStorageItem('lastLoginDate', todayStr);
        setStorageItem('loginStreak', currentStreak.toString());
      } else {
        currentStreak = 1;
        setStorageItem('lastLoginDate', todayStr);
        setStorageItem('loginStreak', '1');
      }
    }
    return currentStreak;
  };

  const streak = updateAndGetStreak();
  const articlesCount = 12 + completedArticles.length;
  const quizzesCount = 4 + completedQuizzes.length;

  const getCategoryProgress = (categoryTitle: string) => {
    const articleToCategory: Record<string, string> = {
      'Macronutrient Synthesis Guide': 'Nutrition',
      'Glycemic Index & Insulin Response': 'Nutrition',
      'Optimal Hydration Dynamics': 'Nutrition',
      'Zone 2 Cardio Protocols': 'Exercise',
      'Circadian Rhythm Synchronization': 'Sleep',
      'Understanding Arterial Hypertension': 'Pathology',
      'Metformin Mechanisms & Longevity': 'Pharmacology'
    };

    const articlesInCat = completedArticles.filter((title: string) => articleToCategory[title] === categoryTitle).length;
    const quizzesInCat = completedQuizzes.includes(categoryTitle) ? 1 : 0;

    const totalProgress = 10 + (articlesInCat * 25) + (quizzesInCat * 35);
    return Math.min(totalProgress, 100);
  };

  const categories = [
    { title: 'Nutrition', icon: Salad, articles: 24, color: 'text-emerald-500', bg: 'bg-emerald-50/50', border: 'border-emerald-100', progress: getCategoryProgress('Nutrition') },
    { title: 'Exercise', icon: Dumbbell, articles: 18, color: 'text-blue-500', bg: 'bg-blue-50/50', border: 'border-blue-100', progress: getCategoryProgress('Exercise') },
    { title: 'Mental Health', icon: Brain, articles: 15, color: 'text-purple-500', bg: 'bg-purple-50/50', border: 'border-purple-100', progress: getCategoryProgress('Mental Health') },
    { title: 'Sleep', icon: Moon, articles: 12, color: 'text-indigo-500', bg: 'bg-indigo-50/50', border: 'border-indigo-100', progress: getCategoryProgress('Sleep') },
    { title: 'Pathology', icon: HeartPulse, articles: 20, color: 'text-rose-500', bg: 'bg-rose-50/50', border: 'border-rose-100', progress: getCategoryProgress('Pathology') },
    { title: 'Pharmacology', icon: Pill, articles: 10, color: 'text-amber-500', bg: 'bg-amber-50/50', border: 'border-amber-100', progress: getCategoryProgress('Pharmacology') },
  ];

  return (
    <div className="size-full bg-slate-50 overflow-auto selection:bg-secondary/20 relative">
      {/* Background Blurs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-100/40 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="px-5 py-6 pb-12 relative z-10 md:px-12 md:py-10 max-w-[1600px] mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-violet-50 border border-violet-100/50 flex items-center justify-center text-violet-600 shadow-sm shrink-0">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-indigo-950 tracking-tight mb-1 leading-none">
                Health <span className="text-secondary">Library</span>
              </h1>
              <div className="flex items-center gap-2 mt-1">
                 <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></div>
                 <p className="text-[8px] md:text-[10px] text-muted-foreground font-black uppercase tracking-widest leading-none">Curated Medical Intelligence</p>
              </div>
            </div>
          </div>
          
          {/* SEARCH INPUT */}
          <div className="relative w-full md:max-w-xs">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search articles or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-xs md:text-sm font-bold text-indigo-950 placeholder-slate-400 focus:outline-none focus:border-indigo-400 hover:border-slate-200 transition-all shadow-sm"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 font-bold text-xs bg-slate-100 border-none cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* DYNAMIC SEARCH RESULTS FLOATING CARD */}
            {searchQuery && (
              <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-100 shadow-xl max-h-60 overflow-auto z-50 divide-y divide-slate-50">
                {filteredArticles.length > 0 ? (
                  filteredArticles.map((art, idx) => (
                    <button
                      key={idx}
                      onClick={() => navigate('/app/article-view', { state: { title: art.title, category: art.category, difficulty: art.difficulty, duration: art.duration } })}
                      className="w-full text-left p-4 hover:bg-slate-50 transition-colors cursor-pointer flex justify-between items-center border-none"
                    >
                      <div>
                        <p className="text-xs font-black text-indigo-950 mb-0.5">{art.title}</p>
                        <span className="text-[8px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-50 px-1.5 py-0.5 rounded-md">{art.category}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs font-semibold text-slate-400">
                    No clinical articles found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* HERO PROGRESS CARD - DYNAMIC CLINICAL LEARNING */}
        <div className="bg-indigo-950 rounded-[28px] p-5 mb-6 text-white relative overflow-hidden shadow-2xl md:rounded-[48px] md:p-10 md:mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-8">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none hidden md:block">
             <Sparkles className="w-48 h-48" />
          </div>
          
          <div className="relative z-10">
            <p className="text-[7px] md:text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-1">Learning Velocity</p>
            <h2 className="text-xl md:text-4xl font-black tracking-tight leading-none">{streak} Day <span className="text-indigo-400">Streak</span></h2>
          </div>
          
          <div className="flex items-center gap-4 md:gap-8 relative z-10">
            <div className="flex gap-2 md:gap-4">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-2 md:rounded-2xl md:px-6 md:py-4">
                <p className="text-indigo-300 text-[6px] md:text-[9px] font-black uppercase tracking-widest mb-0.5">Articles</p>
                <p className="text-sm md:text-xl font-black">{articlesCount}</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-2 md:rounded-2xl md:px-6 md:py-4">
                <p className="text-indigo-300 text-[6px] md:text-[9px] font-black uppercase tracking-widest mb-0.5">Quizzes</p>
                <p className="text-sm md:text-xl font-black">{quizzesCount < 10 ? `0${quizzesCount}` : quizzesCount}</p>
              </div>
            </div>
            <div className="w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner shrink-0">
              <Award className="w-5 h-5 md:w-7 md:h-7 text-indigo-300" />
            </div>
          </div>
        </div>

        {/* SUBJECT SPECIALTIES */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center gap-2 mb-5 px-1">
             <Zap className="w-4 h-4 text-secondary" />
             <h3 className="text-[9px] md:text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em]">Subject Specialties</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {categories.map((cat, index) => (
              <button
                key={index}
                onClick={() => navigate('/app/topics', { state: { category: cat.title } })}
                className={`group ${cat.bg} rounded-[28px] p-4 border ${cat.border} hover:bg-white hover:shadow-xl transition-all text-left relative overflow-hidden md:rounded-[32px] md:p-6`}
              >
                <div className={`w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center mb-3 md:w-12 md:h-12 md:rounded-xl md:mb-4 transition-transform group-hover:scale-110 ${cat.color}`}>
                   <cat.icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                
                <h4 className="text-[13px] md:text-[15px] font-black text-indigo-950 tracking-tight mb-1">{cat.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                   <span className="text-[9px] md:text-[11px] font-bold text-muted-foreground">{cat.articles} Units</span>
                   <div className="flex-1 h-1.5 bg-white/50 rounded-full overflow-hidden">
                      <div className={`h-full ${cat.color.replace('text-', 'bg-')} rounded-full shadow-[0_0_8px_rgba(var(--tw-shadow-color),0.5)]`} style={{ width: `${cat.progress}%` }}></div>
                   </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* RECOMMENDED FEED */}
        <div>
          <div className="flex items-center justify-between mb-5 px-1">
            <div className="flex items-center gap-2">
               <TrendingUp className="w-4 h-4 text-indigo-600" />
               <h3 className="text-[9px] md:text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em]">Recommended Study</h3>
            </div>
            <button className="text-[9px] md:text-[11px] font-black text-secondary uppercase tracking-widest hover:underline">View All</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {[
              { title: 'Vascular Pressure Dynamics', duration: '5m Read', type: 'Article', icon: BookOpen, color: 'text-blue-600' },
              { title: 'Circadian Rhythm Optimization', duration: '8m Visual', type: 'Video', icon: Play, color: 'text-purple-600' },
              { title: 'Macronutrient Synthesis Quiz', duration: '12 Quests', type: 'Evaluation', icon: Award, color: 'text-emerald-600' },
            ].map((item, index) => (
              <button
                key={index}
                onClick={() => navigate(item.type === 'Evaluation' ? '/app/quiz/1' : '/app/article/1', { state: { title: item.title, category: item.type === 'Evaluation' ? 'Nutrition' : 'Sleep' } })}
                className="w-full bg-white rounded-[24px] p-4 border border-border/50 flex items-center gap-5 hover:shadow-xl hover:border-secondary/20 transition-all group active:scale-98 md:rounded-[28px] md:p-6"
              >
                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-slate-50 flex items-center justify-center transition-colors group-hover:bg-white ${item.color}`}>
                  <item.icon className="w-5.5 h-5.5 md:w-7 md:h-7" />
                </div>
                <div className="flex-1 text-left">
                  <span className="text-[8px] md:text-[10px] font-black text-muted-foreground uppercase tracking-widest block mb-1 leading-none">{item.type}</span>
                  <h4 className="text-[13px] md:text-[16px] font-black text-indigo-950 tracking-tight group-hover:text-secondary transition-colors leading-tight">{item.title}</h4>
                  <div className="flex items-center gap-1.5 mt-2">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[9px] md:text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{item.duration}</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
