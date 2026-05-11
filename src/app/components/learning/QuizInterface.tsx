import { useState } from 'react';
import { ArrowLeft, Check, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { toast } from 'sonner';

export function QuizInterface() {
  const navigate = useNavigate();
  const location = useLocation();

  const category = location.state?.category || 'Nutrition';

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);

  // 1. Dynamic Category-Specific Medical Quizzes - Super Simplified for Normal Users
  const quizMap: Record<string, { question: string; options: string[]; correct: number }[]> = {
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
      }
    ]
  };

  const defaultQuiz = [
    {
      question: 'What is a normal blood pressure reading for a healthy adult?',
      options: [
        '120/80 mmHg or less', 
        '140/90 mmHg', 
        '160/100 mmHg', 
        '180/110 mmHg'
      ],
      correct: 0,
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
    }
  ];

  const questions = quizMap[category] || defaultQuiz;
  const question = questions[currentQuestion];

  const handleNext = () => {
    if (selectedAnswer !== null) {
      const nextAnswers = [...answers, selectedAnswer];
      setAnswers(nextAnswers);
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        let score = 0;
        nextAnswers.forEach((ans, idx) => {
          if (ans === questions[idx].correct) score += 1;
        });
        const finalScore = Math.round((score / questions.length) * 100);
        
        toast.success('Evaluation Completed!', {
          description: `You scored ${finalScore}% in the ${category} Specialty Assessment.`
        });
        
        navigate('/app/quiz-results', { state: { score: finalScore, category, userAnswers: nextAnswers } });
      }
    }
  };

  return (
    <div className="size-full bg-slate-50 overflow-auto selection:bg-secondary/20">
      <div className="px-5 py-6 pb-28 md:px-12 md:py-10 max-w-2xl mx-auto">
        
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center hover:shadow-md transition-all active:scale-90"
          >
            <ArrowLeft className="w-5 h-5 text-indigo-950" />
          </button>
          <div className="flex-1">
            <h1 className="text-base md:text-lg font-black text-indigo-950 tracking-tight">
              {category} Assessment
            </h1>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-none mt-1">
              Unit {currentQuestion + 1} of {questions.length}
            </p>
          </div>
        </div>

        {/* PROGRESS INDICATOR */}
        <div className="flex gap-1.5 mb-6">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                index < currentQuestion
                  ? 'bg-emerald-500'
                  : index === currentQuestion
                  ? 'bg-indigo-600'
                  : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        {/* QUESTION CONTAINER CARD */}
        <div className="bg-white rounded-[32px] p-6 mb-6 border border-slate-100 shadow-sm">
          <h2 className="text-sm md:text-base font-black text-indigo-950 leading-relaxed mb-6">
            {question.question}
          </h2>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedAnswer(index)}
                className={`w-full p-4 rounded-2xl border-2 text-left transition-all active:scale-[0.99] cursor-pointer ${
                  selectedAnswer === index
                    ? 'border-indigo-600 bg-indigo-50/50'
                    : 'border-slate-100 bg-slate-50/50 hover:border-indigo-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5.5 h-5.5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      selectedAnswer === index
                        ? 'border-indigo-600 bg-indigo-600'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {selectedAnswer === index && (
                      <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />
                    )}
                  </div>
                  <span className="text-xs md:text-sm text-slate-700 font-bold leading-tight">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* NAVIGATION CONTROL BAR */}
        <div className="mt-8">
          <button
            onClick={handleNext}
            disabled={selectedAnswer === null}
            className={`w-full py-4 rounded-2xl flex items-center justify-center font-black text-xs uppercase tracking-widest transition-all ${
              selectedAnswer === null
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed border-none'
                : 'bg-indigo-950 hover:bg-black text-white hover:shadow-lg active:scale-98 cursor-pointer border-none'
            }`}
          >
            {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Evaluation'}
          </button>
        </div>
      </div>
    </div>
  );
}
