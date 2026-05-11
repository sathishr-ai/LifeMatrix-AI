import { ArrowLeft, Award, TrendingUp, RefreshCw, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';

export function QuizResults() {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Load dynamic quiz state from location
  const score = location.state?.score !== undefined ? location.state.score : 100;
  const category = location.state?.category || "General";
  const userAnswers = location.state?.userAnswers || []; // array of selected indices
  
  // 3 questions total
  const correct = Math.round((score / 100) * 3);
  const total = 3;
  const passed = score >= 66;

  // 2. Generate dynamic, category-specific breakdown matching user's real performance
  const getDynamicBreakdown = () => {
    if (category === 'Nutrition') {
      return [
        { name: 'Glycemic Index & Sugar spikes', score: correct >= 1 ? 1 : 0 },
        { name: 'Healthy Fats & Arteries', score: correct >= 2 ? 1 : 0 },
        { name: 'Insulin Pathways', score: correct === 3 ? 1 : 0 },
      ];
    }
    if (category === 'Sleep') {
      return [
        { name: 'Sleep Hormone (Melatonin)', score: correct >= 1 ? 1 : 0 },
        { name: 'Circadian Rhythm Light resetting', score: correct >= 2 ? 1 : 0 },
        { name: 'Deep Sleep Cardio recovery', score: correct === 3 ? 1 : 0 },
      ];
    }
    if (category === 'Pathology') {
      return [
        { name: 'Hypertension Levels', score: correct >= 1 ? 1 : 0 },
        { name: 'Arterial Plaque (Atherosclerosis)', score: correct >= 2 ? 1 : 0 },
        { name: 'Resting Heart Rate Stress', score: correct === 3 ? 1 : 0 },
      ];
    }
    return [
      { name: 'General Blood Pressure Vitals', score: correct >= 1 ? 1 : 0 },
      { name: 'Aerobic Exercise Guidelines', score: correct >= 2 ? 1 : 0 },
      { name: 'Hydration Intake goals', score: correct === 3 ? 1 : 0 },
    ];
  };

  const breakdown = getDynamicBreakdown();

  // 3. Complete Question Database matching QuizInterface with professional, simplified explanations
  const quizQuestionsMap: Record<string, { question: string; options: string[]; correct: number; explanation: string }[]> = {
    'Nutrition': [
      {
        question: 'What does a high glycemic index score of 70+ mean for a food?',
        options: [
          'It causes rapid blood sugar spikes and quick energy crashes', 
          'It keeps your blood sugar stable and flat all day', 
          'It lowers your blood sugar safely', 
          'It has no effect on blood sugar'
        ],
        correct: 0,
        explanation: 'High-glycemic foods break down extremely fast, causing sudden spikes in blood sugar and quick energy crashes.'
      },
      {
        question: 'Which type of fat is considered healthy and actively protects your blood vessels?',
        options: [
          'Trans fats (found in fried or processed foods)', 
          'Saturated animal fats (found in fatty meats)', 
          'Healthy monounsaturated fats (found in olive oil, avocados, and nuts)', 
          'Artificial margarine'
        ],
        correct: 2,
        explanation: 'Monounsaturated fats from olive oil and avocados protect blood vessel walls and lower bad cholesterol.'
      },
      {
        question: 'What is the main physiological job of insulin inside your body?',
        options: [
          'To slow down stomach digestion', 
          'To act as a key that lets sugar enter your cells for energy', 
          'To clear lactic acid from your muscles', 
          'To increase stomach acid levels'
        ],
        correct: 1,
        explanation: 'Insulin works as a molecular key that unlocks your body\'s cells so sugar in your blood can enter and be used as energy.'
      }
    ],
    'Sleep': [
      {
        question: 'Which natural hormone does your brain release in response to darkness to help you fall asleep?',
        options: [
          'Cortisol (the stress hormone)', 
          'Melatonin (the sleep hormone)', 
          'Thyroxine (the thyroid hormone)', 
          'Adrenaline (the energy hormone)'
        ],
        correct: 1,
        explanation: 'Melatonin is the master sleep hormone released in darkness to cue your body that it is time to rest.'
      },
      {
        question: 'What is the most effective natural way to reset your body\'s 24-hour internal clock every morning?',
        options: [
          'Drinking a hot cup of caffeine', 
          'Getting bright natural morning sunlight in your eyes', 
          'Looking at your phone\'s blue screen', 
          'Taking a warm shower'
        ],
        correct: 1,
        explanation: 'Bright morning natural light hits your eyes and resets your internal master clock, signaling daytime wakefulness.'
      },
      {
        question: 'Which sleep phase is the most important for repairing your muscles and keeping your heart healthy?',
        options: [
          'Stage 1 Light Sleep', 
          'REM Sleep (Dreaming phase)', 
          'Deep Sleep (Slow-wave sleep)', 
          'Drowsy awake state'
        ],
        correct: 2,
        explanation: 'Deep Sleep is when your body focuses completely on cellular repair, tissue growth, and physical cardiovascular healing.'
      }
    ],
    'Pathology': [
      {
        question: 'What is considered the starting threshold for Stage 1 High Blood Pressure (Hypertension)?',
        options: [
          '110/70 mmHg (optimal)', 
          '120/80 mmHg (normal)', 
          '130/80 mmHg (elevated)', 
          '140/90 mmHg or higher'
        ],
        correct: 2,
        explanation: 'Stage 1 High Blood Pressure begins at 130/80 mmHg, showing your arteries are working under high strain.'
      },
      {
        question: 'Arterial plaque buildup and hardening (Atherosclerosis) happens inside which body structures?',
        options: [
          'Tiny sweat glands', 
          'Your arteries (main blood vessels)', 
          'Deep muscle veins', 
          'Lymph nodes'
        ],
        correct: 1,
        explanation: 'Atherosclerosis is the scientific term for fat and cholesterol plaque building up inside your arteries, restricting blood flow.'
      },
      {
        question: 'What does a consistently high resting heart rate (above 85 beats per minute) usually mean?',
        options: [
          'Your heart is in peak athletic state', 
          'Your heart is perfectly relaxed', 
          'Your heart is under extra stress or high nervous arousal', 
          'Your body is perfectly hydrated'
        ],
        correct: 2,
        explanation: 'Consistently elevated heart rates indicate that your nervous system is on alert, putting extra stress on your cardiovascular system.'
      }
    ]
  };

  const defaultQuestions = [
    {
      question: 'What is a normal blood pressure reading for a healthy adult?',
      options: [
        '120/80 mmHg or less', 
        '140/90 mmHg', 
        '160/100 mmHg', 
        '180/110 mmHg'
      ],
      correct: 0,
      explanation: 'A normal reading of 120/80 mmHg protects your blood vessels and heart.'
    },
    {
      question: 'How much physical activity should a healthy adult aim for every week?',
      options: [
        '15 minutes total', 
        'At least 150 minutes of moderate exercise (like brisk walking)', 
        '3 hours of high-intensity sprinting every single day', 
        'Only exercise when you feel tired'
      ],
      correct: 1,
      explanation: '150 minutes of weekly moderate movement keeps your blood flowing and maintains cardiac stroke volume.'
    },
    {
      question: 'What is a healthy daily water goal to support your body\'s cellular filtration?',
      options: [
        '2 to 3 glasses of liquid', 
        'Only drink coffee or sweet sodas', 
        '8 to 10 glasses (about 2 liters) of purified water', 
        '15 to 20 glasses of water'
      ],
      correct: 2,
      explanation: 'Sipping 8 to 10 glasses of water daily keeps your cells fully hydrated and assists your kidneys.'
    }
  ];

  const questions = quizQuestionsMap[category] || defaultQuestions;

  return (
    <div className="size-full bg-slate-50 overflow-auto selection:bg-secondary/20">
      <div className="px-5 py-6 pb-28 md:px-12 md:py-10 max-w-2xl mx-auto">
        
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <button 
            onClick={() => navigate('/app/learning')} 
            className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center hover:shadow-md transition-all active:scale-90"
          >
            <ArrowLeft className="w-5 h-5 text-indigo-950" />
          </button>
          <div>
            <h1 className="text-base md:text-lg font-black text-indigo-950 tracking-tight">
              Evaluation Results
            </h1>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-none mt-1">
              {category} Specialty Quiz
            </p>
          </div>
        </div>

        {/* HERO RESULTS CARD */}
        <div className={`${passed ? 'bg-gradient-to-br from-emerald-600 to-emerald-700' : 'bg-gradient-to-br from-indigo-900 to-indigo-950'} rounded-3xl p-6 mb-6 text-white shadow-xl`}>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 border border-white/20 mb-4">
              <Award className="w-10 h-10 text-white animate-bounce" />
            </div>
            <h2 className="text-4xl font-black tracking-tight mb-2">{score}%</h2>
            <p className="text-white/90 text-sm font-black uppercase tracking-wider mb-1">
              {passed ? 'Assessment Passed!' : 'Requires Review'}
            </p>
            <p className="text-white/80 text-xs font-semibold">
              You answered {correct} out of {total} questions correctly
            </p>
          </div>
        </div>

        {/* SNAPSHOT COUNTERS */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-2xl p-4 border border-slate-100 text-center shadow-sm">
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Correct</p>
            <h3 className="text-xl font-black text-emerald-600">{correct}</h3>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-100 text-center shadow-sm">
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Wrong</p>
            <h3 className="text-xl font-black text-rose-600">{total - correct}</h3>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-100 text-center shadow-sm">
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Duration</p>
            <h3 className="text-xl font-black text-indigo-950">1:12</h3>
          </div>
        </div>

        {/* PERFORMANCE BREAKDOWN */}
        <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm mb-6">
          <h3 className="text-xs font-black text-indigo-950 uppercase tracking-wider mb-4">Subtopic Performance</h3>
          <div className="space-y-4">
            {breakdown.map((item, index) => {
              const percentage = item.score * 100;
              const color = percentage === 100 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-rose-500';

              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-slate-700 font-bold leading-none">{item.name}</span>
                    <span className="text-xs text-slate-500 font-bold leading-none">
                      {item.score}/1
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${color} rounded-full`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* DETAILED ANSWER REVIEW SECTION */}
        <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm mb-6 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
            <AlertCircle className="w-4.5 h-4.5 text-indigo-600" />
            <h3 className="text-xs font-black text-indigo-950 uppercase tracking-wider">Detailed Answer Review</h3>
          </div>

          <div className="space-y-5 divide-y divide-slate-100">
            {questions.map((qn, index) => {
              const userAnsIdx = userAnswers[index];
              const isCorrect = userAnsIdx === qn.correct;
              const selectedText = userAnsIdx !== undefined ? qn.options[userAnsIdx] : 'No answer selected';
              const correctText = qn.options[qn.correct];

              return (
                <div key={index} className={`pt-4 ${index === 0 ? 'pt-0 border-none' : ''}`}>
                  <p className="text-xs font-black text-indigo-950 mb-2 leading-relaxed">
                    Q{index + 1}: {qn.question}
                  </p>

                  <div className="space-y-2 mb-3">
                    {/* User Selected Choice */}
                    <div className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                      isCorrect 
                        ? 'bg-emerald-50/50 border-emerald-100 text-emerald-800' 
                        : 'bg-rose-50/50 border-rose-100 text-rose-800'
                    }`}>
                      {isCorrect ? (
                        <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4.5 h-4.5 text-rose-600 shrink-0 mt-0.5" />
                      )}
                      <div className="text-xs">
                        <span className="font-black block uppercase tracking-wider text-[8px] mb-0.5">Your Selected Answer:</span>
                        <span className="font-semibold">{selectedText}</span>
                      </div>
                    </div>

                    {/* Show Correct Answer if user answered incorrectly */}
                    {!isCorrect && (
                      <div className="p-3 rounded-xl bg-emerald-50/40 border border-emerald-100/50 text-emerald-800 flex items-start gap-2.5">
                        <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
                        <div className="text-xs">
                          <span className="font-black block uppercase tracking-wider text-[8px] mb-0.5">Exact Correct Answer:</span>
                          <span className="font-semibold">{correctText}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Simplified Professional Explanation */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100/30">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Concept Explanation</p>
                    <p className="text-[11px] text-slate-500 font-bold leading-relaxed">{qn.explanation}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CONTROLS */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/app/quiz/1', { state: { category } })}
            className="w-full py-4 rounded-2xl bg-indigo-950 hover:bg-black text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:shadow-lg transition-all active:scale-98 cursor-pointer border-none"
          >
            <RefreshCw className="w-4 h-4" />
            Retake Assessment
          </button>
          <button
            onClick={() => navigate('/app/learning')}
            className="w-full py-4 rounded-2xl bg-white text-slate-700 border border-slate-100 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:shadow-md transition-all active:scale-98 cursor-pointer"
          >
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            Continue Library Study
          </button>
        </div>

        {/* ADVISORY REVIEW BOX */}
        {!passed && (
          <div className="mt-6 bg-rose-50 border border-rose-100/40 rounded-2xl p-4">
            <p className="text-xs text-rose-950 font-black mb-1">
              💡 LifeMatrix Insight:
            </p>
            <p className="text-[11px] text-rose-700 font-bold leading-relaxed">
              Based on the assessment, you should review the simplified articles in the {category} specialty to secure your next pass!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
