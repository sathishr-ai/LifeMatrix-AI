import { ArrowLeft, Clock, BookOpen, Share2, Bookmark, ShieldCheck, HelpCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { getStorageItem, setStorageItem } from '../../utils/storage';

export function ArticleView() {
  const navigate = useNavigate();
  const location = useLocation();

  // Load state keys
  const title = location.state?.title || "Understanding Blood Pressure: A Complete Guide";
  const category = location.state?.category || "Pathology";
  const difficulty = location.state?.difficulty || "Beginner";
  const duration = location.state?.duration || "6 min read";

  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const readList = JSON.parse(getStorageItem('completedArticles', '[]'));
    if (!readList.includes(title)) {
      readList.push(title);
      setStorageItem('completedArticles', JSON.stringify(readList));
    }
  }, [title]);

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? 'Removed from Bookmarks' : 'Article Saved', {
      description: isSaved ? 'This article has been removed from your saved list.' : 'Access this clinical unit offline anytime from your library.',
      duration: 3000
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: `Check out this LifeMatrix health unit: ${title}`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link Copied', {
        description: 'Shareable article link copied to clipboard.',
        duration: 3000
      });
    }
  };

  // High-fidelity Simplified & Professional Clinical Article Content Library
  const articlesContent: Record<string, { sections: { subtitle: string; text: string }[]; highlight: { title: string; text: string }; tips: string[] }> = {
    'Macronutrient Synthesis Guide': {
      sections: [
        { subtitle: 'What are Macronutrients?', text: 'Macronutrients are the main nutrients your body needs to survive: proteins, carbohydrates, and healthy fats. Your body breaks them down daily and turns them into immediate energy to power your brain, muscles, and organs.' },
        { subtitle: 'The Building Blocks of Health', text: 'Proteins act as your body\'s primary building blocks, repairing muscles and skin. Carbohydrates supply clean fuel for daily activities, while healthy fats protect your cells and support balanced hormone production.' }
      ],
      highlight: { title: 'Optimal Daily Ratio', text: 'A balanced daily plate generally consists of about 40% clean carbohydrates (like whole grains), 30% lean proteins, and 30% healthy fats.' },
      tips: ['Choose lean proteins like eggs, chicken, fish, or tofu to repair tissues.', 'Swap simple sugars for complex carbs like oats, brown rice, and quinoa.', 'Enjoy healthy fats like olive oil and avocados to protect your cellular walls.']
    },
    'Glycemic Index & Insulin Response': {
      sections: [
        { subtitle: 'What is the Glycemic Index (GI)?', text: 'The Glycemic Index is a simple ranking (from 0 to 100) of how quickly foods raise your blood sugar. High-GI foods (like white bread) cause sudden sugar spikes and energy crashes, while low-GI foods (like beans and oats) provide steady, long-lasting energy.' },
        { subtitle: 'How Insulin Works', text: 'When you eat, your pancreas releases a hormone called insulin. Insulin acts like a physical key that opens your body cells to let sugar in for energy. If you eat too much sugar consistently, your cells can get tired of the sugar and stop responding well.' }
      ],
      highlight: { title: 'Glycemic Balance Key', text: 'Focusing on low-glycemic meals keeps your blood sugar stable, protects your energy levels, and helps prevent pre-diabetes.' },
      tips: ['Eat high-fiber foods to slow down sugar absorption in your body.', 'Always pair carbohydrates with a protein or healthy fat to smooth out sugar spikes.', 'Avoid sugary drinks and processed sweets to keep your cell receptors healthy.']
    },
    'Optimal Hydration Dynamics': {
      sections: [
        { subtitle: 'How Water Powers Your Cells', text: 'Water is the lifeblood of your body. Every single cell and chemical reaction relies on water to function properly. Staying hydrated keeps your blood volume healthy, makes it easier for your heart to pump, and helps your kidneys flush out waste.' },
        { subtitle: 'Balancing Water and Minerals', text: 'True hydration isn\'t just about drinking water—it\'s also about maintaining essential minerals like sodium and potassium. These minerals help guide water into your cells where it is needed most.' }
      ],
      highlight: { title: 'Daily Hydration Goal', text: 'Aim for 8 to 12 glasses (about 2 to 2.5 liters) of water daily to maintain stable blood pressure and support peak physical energy.' },
      tips: ['Sip water consistently throughout the day rather than drinking a large amount at once.', 'Drink an extra glass of water after workouts or when spending time outdoors.', 'Look for a pale, straw-yellow urine color as a reliable sign of proper hydration.']
    },
    'Zone 2 Cardio Protocols': {
      sections: [
        { subtitle: 'What is Zone 2 Cardio?', text: 'Zone 2 cardio is low-intensity, steady exercise—like a brisk walk, slow jog, or easy cycling—where you can still carry on a comfortable conversation. It is a highly effective training intensity for building long-term aerobic stamina.' },
        { subtitle: 'How It Helps Your Body', text: 'This level of effort teaches your cells to burn fat as fuel efficiently, lowers your resting heart rate over time, and increases the overall health and density of your blood capillaries.' }
      ],
      highlight: { title: 'Finding Your Zone 2', text: 'Your Zone 2 is typically between 60% and 70% of your maximum heart rate. You should feel slightly warm and be breathing a bit faster, but still able to talk easily.' },
      tips: ['Aim for 150 minutes of steady, low-intensity exercise every week.', 'Keep your sessions continuous—aim for at least 30 to 45 minutes at a time.', 'Do not push into a heavy sprint during Zone 2; keep your effort smooth and steady.']
    },
    'Circadian Rhythm Synchronization': {
      sections: [
        { subtitle: 'Your Body\'s Internal Clock', text: 'Your circadian rhythm is your body\'s natural 24-hour internal clock. It is run by a small master control center in your brain that regulates when you feel wide awake, when you get hungry, and when you feel ready for sleep.' },
        { subtitle: 'Light and the Sleep Hormone', text: 'Natural morning light signals your brain to stop making melatonin (the sleep hormone) and start waking you up. In the evening, darkness prompts your brain to release melatonin, helping you fall asleep easily.' }
      ],
      highlight: { title: 'The Wake-Up Secret', text: 'Getting 10 to 15 minutes of outdoor morning sunlight resets your internal clock, boosting daytime energy and improving sleep at night.' },
      tips: ['Step outside into natural light within 30 minutes of waking up.', 'Avoid blue screen light from phones and televisions for 60 minutes before bed.', 'Maintain a consistent sleep and wake schedule, even on weekends.']
    },
    'Understanding Arterial Hypertension': {
      sections: [
        { subtitle: 'What is High Blood Pressure?', text: 'Hypertension is the medical term for high blood pressure. Think of your blood vessels as water pipes. When the pressure inside is consistently too high, it puts extra strain on your heart and can damage the pipe walls over time.' },
        { subtitle: 'Understanding the Two Numbers', text: 'Your blood pressure has two numbers. The top number (systolic) measures the pressure when your heart contracts to pump blood. The bottom number (diastolic) measures the resting pressure between beats.' }
      ],
      highlight: { title: 'Normal Pressure Target', text: 'A healthy blood pressure level is less than 120/80 mmHg. Consistent readings above 130/80 indicate that your heart is working extra hard.' },
      tips: ['Keep your daily salt (sodium) intake under 2,000 mg (about 1 teaspoon).', 'Eat potassium-rich foods like bananas, avocados, and spinach to relax blood vessels.', 'Practice deep-breathing exercises daily to calm your nervous system and lower pressure.']
    },
    'Metformin Mechanisms & Longevity': {
      sections: [
        { subtitle: 'How Metformin Works', text: 'Metformin is a widely studied medication that helps manage blood sugar levels. It works by reducing the amount of sugar your liver releases into your blood and making your body\'s cells more responsive to insulin.' },
        { subtitle: 'Supporting Long-Term Health', text: 'By keeping blood sugar levels stable, Metformin reduces daily stress on your blood vessels and encourages cells to clean out old, damaged proteins, supporting overall cellular health.' }
      ],
      highlight: { title: 'Professional Guidance', text: 'Always use medications under clinical supervision and combine them with healthy nutrition and active daily exercise.' },
      tips: ['Take your medication with meals to avoid mild stomach irritation.', 'Get your Vitamin B12 levels checked regularly, as long-term use can lower absorption.', 'Incorporate a fiber-rich diet to support healthy digestion and glycemic control.']
    }
  };

  const defaultArticle = {
    sections: [
      { subtitle: 'Managing Daily Biometrics', text: 'Understanding your body\'s daily metrics is the first step toward living a long, vibrant life. By tracking simple things like your heart rate, sleep quality, and daily water intake, you can make informed choices to protect your energy.' },
      { subtitle: 'The Power of Prevention', text: 'Preventive health is all about taking care of your body today before problems arise. Making minor adjustments to your nutrition, exercise, and sleep habits today is the easiest way to protect your heart and cells for tomorrow.' }
    ],
    highlight: { title: 'Healthy Lifestyle Key', text: 'Consistent daily actions are the primary secret to physical wellness. Focus on eating whole foods, moving daily, and securing deep sleep.' },
    tips: ['Engage in 30 minutes of daily physical movement.', 'Aim for 7.5 to 8.5 hours of restorative sleep every night.', 'Log your daily vitals to see positive trends over time.']
  };

  const content = articlesContent[title] || defaultArticle;

  const handleQuizRedirect = () => {
    navigate('/app/quiz/1', { state: { category } });
  };

  return (
    <div className="size-full bg-slate-50 overflow-auto selection:bg-secondary/20">
      <div className="px-5 py-6 pb-28 md:px-12 md:py-10 max-w-3xl mx-auto">
        
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center hover:shadow-md transition-all active:scale-90"
          >
            <ArrowLeft className="w-5 h-5 text-indigo-950" />
          </button>
          <div>
            <span className="text-[8px] font-black uppercase text-indigo-500 tracking-widest bg-indigo-50 px-2 py-0.5 rounded-md">
              {category} Unit
            </span>
          </div>
        </div>

        {/* HERO BANNER CARD */}
        <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 rounded-[32px] p-6 mb-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-5 h-5 text-indigo-300 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest text-indigo-200">Clinical Library</span>
          </div>
          <h1 className="text-lg md:text-2xl font-black tracking-tight leading-tight mb-4">
            {title}
          </h1>
          <div className="flex items-center gap-4 text-[10px] md:text-xs font-bold text-indigo-200">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-indigo-300" />
              <span>{duration}</span>
            </div>
            <span>•</span>
            <span className="uppercase tracking-wider">{difficulty}</span>
          </div>
        </div>

        {/* ACTION BAR */}
        <div className="flex gap-3 mb-6">
          <button 
            onClick={handleSave}
            className={`flex-1 py-3.5 rounded-2xl border flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer ${
              isSaved 
                ? 'bg-rose-50 border-rose-100 text-rose-600 font-bold' 
                : 'bg-white border-slate-100 text-slate-700 hover:shadow-md'
            }`}
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span className="text-xs font-black uppercase tracking-wider">{isSaved ? 'Saved' : 'Save Unit'}</span>
          </button>
          <button 
            onClick={handleShare}
            className="flex-1 py-3.5 rounded-2xl bg-white border border-slate-100 flex items-center justify-center gap-2 hover:shadow-md text-slate-700 transition-all active:scale-95 cursor-pointer"
          >
            <Share2 className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-wider">Share Link</span>
          </button>
        </div>

        {/* MAIN BODY CONTENT */}
        <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm space-y-6">
          {content.sections.map((sec, idx) => (
            <div key={idx}>
              <h2 className="text-sm md:text-base font-black text-indigo-950 tracking-tight mb-2.5">
                {sec.subtitle}
              </h2>
              <p className="text-xs md:text-sm text-slate-500 font-semibold leading-relaxed">
                {sec.text}
              </p>
            </div>
          ))}

          {/* DYNAMIC CARD HIGHLIGHT */}
          <div className="bg-indigo-50/50 border border-indigo-100/30 rounded-2xl p-5 my-4">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4.5 h-4.5 text-indigo-600 shrink-0" />
              <h3 className="text-xs font-black text-indigo-950 uppercase tracking-wider">{content.highlight.title}</h3>
            </div>
            <p className="text-xs text-indigo-900/80 font-bold leading-relaxed">
              {content.highlight.text}
            </p>
          </div>

          {/* CLINICAL TIPS */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <HelpCircle className="w-4.5 h-4.5 text-indigo-600 shrink-0" />
              <h2 className="text-sm font-black text-indigo-950 tracking-tight">Clinical Directives</h2>
            </div>
            <ul className="space-y-2 text-xs text-slate-500 font-semibold list-disc list-inside">
              {content.tips.map((tip, idx) => (
                <li key={idx} className="leading-relaxed">{tip}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* BOTTOM EVALUATION CARD */}
        <div className="mt-6 bg-emerald-50 border border-emerald-100/40 rounded-[28px] p-5 flex flex-col items-center text-center">
          <h3 className="text-xs font-black text-emerald-950 uppercase tracking-tight mb-1">Ready to verify your understanding?</h3>
          <p className="text-[10px] text-emerald-700/80 font-bold mb-4">Complete the associated clinical evaluation quiz to unlock extra score multipliers.</p>
          <button
            onClick={handleQuizRedirect}
            className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-widest transition-all active:scale-95 cursor-pointer border-none hover:shadow-lg"
          >
            Take the Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
