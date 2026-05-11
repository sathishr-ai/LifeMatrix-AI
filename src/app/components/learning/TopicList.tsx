import { ArrowLeft, BookOpen, Play, Award, Clock, Sparkles } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { getStorageItem } from '../../utils/storage';

export function TopicList() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 1. Resolve Category with fallback
  const category = location.state?.category || 'Nutrition';

  // 2. Load daily logs to build personalized clinical advice
  const savedLogs = getStorageItem('dailyLogs');
  const dailyLogs = savedLogs ? JSON.parse(savedLogs) : { heartRate: '72', sleep: '8.0', water: '8' };

  const completedArticles = JSON.parse(getStorageItem('completedArticles', '[]'));
  const completedQuizzes = JSON.parse(getStorageItem('completedQuizzes', '[]'));
  
  // 3. Category-Specific High-Fidelity Medical Topics
  const topicsMap: Record<string, any[]> = {
    'Nutrition': [
      { title: 'Macronutrient Synthesis Guide', type: 'article', duration: '8 min read', difficulty: 'Beginner', icon: BookOpen, completed: true },
      { title: 'Glycemic Index & Insulin Response', type: 'article', duration: '10 min read', difficulty: 'Intermediate', icon: BookOpen, completed: false },
      { title: 'Dietary Soluble Fiber & Cholesterol Control', type: 'video', duration: '12 min watch', difficulty: 'Advanced', icon: Play, completed: false },
      { title: 'Optimal Hydration Dynamics', type: 'article', duration: '6 min read', difficulty: 'Beginner', icon: BookOpen, completed: true },
      { title: 'Nutrition & Glycemic Balance Quiz', type: 'quiz', duration: '10 questions', difficulty: 'Intermediate', icon: Award, completed: false }
    ],
    'Exercise': [
      { title: 'Zone 2 Cardio Protocols', type: 'article', duration: '10 min read', difficulty: 'Beginner', icon: BookOpen, completed: false },
      { title: 'Resistance Training & Metabolic Rate', type: 'video', duration: '15 min watch', difficulty: 'Intermediate', icon: Play, completed: false },
      { title: 'Vascular Health & Active Conditioning', type: 'article', duration: '12 min read', difficulty: 'Beginner', icon: BookOpen, completed: true },
      { title: 'Aerobic vs. Anaerobic Pathways', type: 'article', duration: '14 min read', difficulty: 'Advanced', icon: BookOpen, completed: false },
      { title: 'Metabolic Conditioning Quiz', type: 'quiz', duration: '8 questions', difficulty: 'Advanced', icon: Award, completed: false }
    ],
    'Mental Health': [
      { title: 'Managing Chronic Cortisol Levels', type: 'article', duration: '8 min read', difficulty: 'Beginner', icon: BookOpen, completed: false },
      { title: 'Mindfulness & Vagus Nerve Stimulation', type: 'video', duration: '15 min watch', difficulty: 'Intermediate', icon: Play, completed: true },
      { title: 'Neurotransmitters of Mood & Stress', type: 'article', duration: '12 min read', difficulty: 'Advanced', icon: BookOpen, completed: false },
      { title: 'Cognitive Fatigue Recovery Techniques', type: 'article', duration: '6 min read', difficulty: 'Beginner', icon: BookOpen, completed: false },
      { title: 'Neuro-Somatic Balance Quiz', type: 'quiz', duration: '10 questions', difficulty: 'Intermediate', icon: Award, completed: false }
    ],
    'Sleep': [
      { title: 'Circadian Rhythm Synchronization', type: 'article', duration: '10 min read', difficulty: 'Beginner', icon: BookOpen, completed: true },
      { title: 'Melatonin & Sleep Architecture', type: 'video', duration: '12 min watch', difficulty: 'Intermediate', icon: Play, completed: false },
      { title: 'Sleep Hygiene & Environment Design', type: 'article', duration: '6 min read', difficulty: 'Beginner', icon: BookOpen, completed: true },
      { title: 'Deep REM vs. Slow-Wave States', type: 'article', duration: '15 min read', difficulty: 'Advanced', icon: BookOpen, completed: false },
      { title: 'Sleep Optimization Quiz', type: 'quiz', duration: '10 questions', difficulty: 'Advanced', icon: Award, completed: false }
    ],
    'Pathology': [
      { title: 'Understanding Arterial Hypertension', type: 'article', duration: '12 min read', difficulty: 'Intermediate', icon: BookOpen, completed: false },
      { title: 'Atherosclerosis Risk Factors Explained', type: 'video', duration: '15 min watch', difficulty: 'Advanced', icon: Play, completed: false },
      { title: 'Biomarkers of Metabolic Dysfunction', type: 'article', duration: '10 min read', difficulty: 'Advanced', icon: BookOpen, completed: true },
      { title: 'Fasting Glucose Levels & Glycemic Stress', type: 'article', duration: '8 min read', difficulty: 'Beginner', icon: BookOpen, completed: false },
      { title: 'Cardiovascular Pathology Quiz', type: 'quiz', duration: '12 questions', difficulty: 'Advanced', icon: Award, completed: false }
    ],
    'Pharmacology': [
      { title: 'Metformin Mechanisms & Longevity', type: 'article', duration: '10 min read', difficulty: 'Advanced', icon: BookOpen, completed: false },
      { title: 'Statins & Lipid Reduction Pathways', type: 'article', duration: '12 min read', difficulty: 'Advanced', icon: BookOpen, completed: false },
      { title: 'Beta Blockers vs. ACE Inhibitors', type: 'video', duration: '15 min watch', difficulty: 'Advanced', icon: Play, completed: false },
      { title: 'Oral Antidiabetic Medication Profiles', type: 'article', duration: '8 min read', difficulty: 'Intermediate', icon: BookOpen, completed: true },
      { title: 'Clinical Pharmacology Quiz', type: 'quiz', duration: '10 questions', difficulty: 'Advanced', icon: Award, completed: false }
    ]
  };

  const topics = topicsMap[category] || topicsMap['Nutrition'];

  // 4. Compute Personalized Clinical Recommendations based on live user logs
  const getPersonalizedRecommendation = () => {
    const hr = parseInt(dailyLogs.heartRate) || 72;
    const water = parseInt(dailyLogs.water) || 8;
    const sleep = parseFloat(dailyLogs.sleep) || 8.0;

    if (category === 'Nutrition' && water < 8) {
      return {
        text: `Based on your low hydration (${water} glasses), we recommend prioritizing the "Optimal Hydration Dynamics" unit.`,
        unit: 'Optimal Hydration Dynamics'
      };
    }
    if (category === 'Sleep' && sleep < 7.5) {
      return {
        text: `Based on your short sleep duration (${sleep}h), we highly advise reading "Circadian Rhythm Synchronization".`,
        unit: 'Circadian Rhythm Synchronization'
      };
    }
    if (category === 'Pathology' && hr > 80) {
      return {
        text: `Your resting heart rate is elevated (${hr} bpm). We recommend reviewing "Understanding Arterial Hypertension".`,
        unit: 'Understanding Arterial Hypertension'
      };
    }
    return {
      text: `Maximize your clinical score by completing the units listed below!`,
      unit: null
    };
  };

  const advice = getPersonalizedRecommendation();

  return (
    <div className="size-full bg-slate-50 overflow-auto selection:bg-secondary/20">
      <div className="px-5 py-6 pb-28 md:px-12 md:py-10 max-w-4xl mx-auto">
        
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center hover:shadow-md transition-all active:scale-90"
          >
            <ArrowLeft className="w-5 h-5 text-indigo-950" />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-indigo-950 tracking-tight">
              {category} Specialty
            </h1>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-none mt-1">
              {topics.length} Dynamic Units Available
            </p>
          </div>
        </div>

        {/* PERSONALIZED CLINICAL ADVISORY */}
        <div className="bg-gradient-to-r from-indigo-900 to-indigo-950 rounded-2xl p-4 mb-6 border border-indigo-900 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Sparkles className="w-24 h-24" />
          </div>
          <div className="flex gap-3 items-start relative z-10">
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-indigo-300 shrink-0">
              <Sparkles className="w-4.5 h-4.5 animate-pulse" />
            </div>
            <div>
              <p className="text-[8px] font-black uppercase tracking-widest text-indigo-300 mb-0.5">LifeMatrix Advisory</p>
              <p className="text-[11px] font-bold text-indigo-100 leading-relaxed">{advice.text}</p>
            </div>
          </div>
        </div>

        {/* TOPIC LIST */}
        <div className="space-y-3">
          {topics.map((topic, index) => {
            const Icon = topic.icon;
            const isTarget = topic.title === advice.unit;

            // Determine checkmark dynamically based on actual user progress data
            const isCompleted =
              topic.type === 'article'
                ? completedArticles.includes(topic.title)
                : topic.type === 'quiz'
                ? completedQuizzes.includes(category)
                : completedArticles.includes(topic.title); // video or other
            
            const typeColor =
              topic.type === 'article'
                ? 'text-blue-500'
                : topic.type === 'video'
                ? 'text-purple-500'
                : 'text-emerald-500';
            const typeBg =
              topic.type === 'article'
                ? 'bg-blue-50'
                : topic.type === 'video'
                ? 'bg-purple-50'
                : 'bg-emerald-50';

            return (
              <button
                key={index}
                onClick={() =>
                  navigate(topic.type === 'quiz' ? '/app/quiz/1' : '/app/article/1', {
                    state: { title: topic.title, category, difficulty: topic.difficulty, duration: topic.duration }
                  })
                }
                className={`w-full bg-white rounded-2xl p-4 border transition-all text-left flex items-center gap-4 hover:shadow-lg active:scale-99 ${
                  isTarget ? 'border-indigo-500/50 ring-2 ring-indigo-500/5 shadow-md' : 'border-slate-100'
                }`}
              >
                <div className={`w-11 h-11 rounded-xl ${typeBg} flex items-center justify-center shrink-0 ${typeColor}`}>
                  <Icon className="w-5.5 h-5.5" />
                </div>
                
                <div className="flex-1 text-left min-w-0">
                  <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest block mb-0.5">{topic.type}</span>
                  <h3 className="text-xs md:text-sm font-black text-indigo-950 tracking-tight truncate leading-tight group-hover:text-secondary transition-colors">
                    {topic.title}
                  </h3>
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-semibold mt-1">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {topic.duration}
                    </div>
                    <span>•</span>
                    <span>{topic.difficulty}</span>
                  </div>
                </div>

                {isCompleted && (
                  <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                    <span className="text-emerald-600 text-xs font-black">✓</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
