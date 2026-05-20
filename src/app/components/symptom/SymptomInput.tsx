import { useState } from 'react';
import { ArrowLeft, Search, X, User as UserIcon, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router';
import { setStorageItem } from '../../utils/storage';

const symptomsByRegion: Record<string, string[]> = {
  head: [
    'Headache', 'Dizziness', 'Fever', 'Sore Throat', 'Runny Nose', 'Ear Pain', 'Vision Blur',
    'Nasal Congestion', 'Tinnitus (Ringing)', 'Eye Redness', 'Toothache', 'Jaw Stiffness', 
    'Neck Stiffness', 'Loss of Taste/Smell', 'Dry Mouth', 'Face Swelling'
  ],
  chest: [
    'Chest Pain', 'Shortness of Breath', 'Cough', 'Heart Palpitations', 'Tightness',
    'Wheezing', 'Dry Cough', 'Wet Cough', 'Rapid Heartbeat', 'Shallow Breathing',
    'Deep Breathing Pain', 'Chest Pressure'
  ],
  abdomen: [
    'Stomach Pain', 'Nausea', 'Vomiting', 'Bloating', 'Indigestion',
    'Heartburn', 'Loss of Appetite', 'Diarrhea', 'Constipation', 'Acid Reflux',
    'Abdominal Cramps', 'Stomach Gas'
  ],
  limbs: [
    'Muscle Pain', 'Joint Pain', 'Numbness', 'Swelling', 'Weakness',
    'Muscle Cramps', 'Hand Tremors', 'Tingling Pins & Needles', 'Ankle Pain', 
    'Knee Stiffness', 'Back Pain', 'Shoulder Pain', 'Cold Extremities'
  ],
  general: [
    'Fatigue', 'Chills', 'Night Sweats', 'Weight Loss', 'Weight Gain',
    'Skin Rash', 'Itching / Pruritus', 'Hives', 'Confusion', 'Brain Fog',
    'Sneezing', 'Body Aches', 'Insomnia', 'Anxiety / Panic', 'Sweating'
  ],
};

const commonSymptoms = Array.from(new Set(Object.values(symptomsByRegion).flat()));

export function SymptomInput() {
  const navigate = useNavigate();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'search' | 'body'>('body');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const filteredSymptoms = commonSymptoms.filter(s =>
    s.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const regionSymptoms = selectedRegion ? symptomsByRegion[selectedRegion] : [];

  return (
    <div className="size-full bg-background overflow-auto">
      <div className="px-6 py-6 pb-32">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-muted transition-colors">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-black text-indigo-950 tracking-tight">
              Symptom <span className="text-secondary">Checker</span>
            </h1>
            <p className="text-sm text-muted-foreground font-medium">Pinpoint your concerns</p>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex p-1 bg-muted rounded-2xl mb-8 border border-border/50">
          <button 
            onClick={() => setViewMode('search')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${viewMode === 'search' ? 'bg-white text-secondary shadow-sm' : 'text-muted-foreground'}`}
          >
            <Search className="w-4 h-4" />
            Search
          </button>
          <button 
            onClick={() => setViewMode('body')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${viewMode === 'body' ? 'bg-white text-secondary shadow-sm' : 'text-muted-foreground'}`}
          >
            <UserIcon className="w-4 h-4" />
            Point on body
          </button>
        </div>

        {viewMode === 'search' ? (
          <div className="animate-fade-in">
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search symptoms..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-border focus:border-secondary focus:ring-4 focus:ring-secondary/10 focus:outline-none shadow-sm font-medium text-sm transition-all"
              />
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 ml-1">Suggestions</h3>
                <div className="flex flex-wrap gap-2">
                  {filteredSymptoms.map((symptom) => (
                    <button
                      key={symptom}
                      onClick={() => toggleSymptom(symptom)}
                      className={`px-4 py-2 rounded-full text-xs font-bold border-2 transition-all active:scale-95 ${
                        selectedSymptoms.includes(symptom)
                          ? 'bg-secondary/10 text-secondary border-secondary/30'
                          : 'bg-white text-foreground border-border hover:border-secondary/50'
                      }`}
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in flex flex-col items-center">
            <div className="relative w-64 h-96 bg-white/40 backdrop-blur rounded-[40px] border border-border shadow-inner p-8 mb-8">
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-muted-foreground animate-spin-slow" />
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter">Anatomical Model</span>
              </div>
              
              <svg viewBox="0 0 100 200" className="w-full h-full drop-shadow-2xl">
                {/* stylized body model */}
                {/* Head */}
                <path 
                  d="M40 15 C40 10, 60 10, 60 15 C60 25, 40 25, 40 15" 
                  className={`cursor-pointer transition-all ${selectedRegion === 'head' ? 'fill-secondary stroke-secondary stroke-2' : 'fill-muted hover:fill-muted/80 stroke-border'}`}
                  onClick={() => setSelectedRegion('head')}
                />
                {/* Chest/Torso */}
                <path 
                  d="M35 30 L65 30 L65 70 L35 70 Z" 
                  className={`cursor-pointer transition-all ${selectedRegion === 'chest' ? 'fill-secondary stroke-secondary stroke-2' : 'fill-muted hover:fill-muted/80 stroke-border'}`}
                  onClick={() => setSelectedRegion('chest')}
                />
                {/* Abdomen */}
                <path 
                  d="M35 75 L65 75 L62 100 L38 100 Z" 
                  className={`cursor-pointer transition-all ${selectedRegion === 'abdomen' ? 'fill-secondary stroke-secondary stroke-2' : 'fill-muted hover:fill-muted/80 stroke-border'}`}
                  onClick={() => setSelectedRegion('abdomen')}
                />
                {/* Arms */}
                <path 
                  d="M30 30 L20 80 L28 85 L32 35 Z" 
                  className={`cursor-pointer transition-all ${selectedRegion === 'limbs' ? 'fill-secondary stroke-secondary stroke-2' : 'fill-muted hover:fill-muted/80 stroke-border'}`}
                  onClick={() => setSelectedRegion('limbs')}
                />
                <path 
                  d="M70 30 L80 80 L72 85 L68 35 Z" 
                  className={`cursor-pointer transition-all ${selectedRegion === 'limbs' ? 'fill-secondary stroke-secondary stroke-2' : 'fill-muted hover:fill-muted/80 stroke-border'}`}
                  onClick={() => setSelectedRegion('limbs')}
                />
                {/* Legs */}
                <path 
                  d="M38 105 L30 180 L42 180 L45 105 Z" 
                  className={`cursor-pointer transition-all ${selectedRegion === 'limbs' ? 'fill-secondary stroke-secondary stroke-2' : 'fill-muted hover:fill-muted/80 stroke-border'}`}
                  onClick={() => setSelectedRegion('limbs')}
                />
                <path 
                  d="M62 105 L70 180 L58 180 L55 105 Z" 
                  className={`cursor-pointer transition-all ${selectedRegion === 'limbs' ? 'fill-secondary stroke-secondary stroke-2' : 'fill-muted hover:fill-muted/80 stroke-border'}`}
                  onClick={() => setSelectedRegion('limbs')}
                />
              </svg>

              {selectedRegion && (
                <button 
                  onClick={() => setSelectedRegion(null)}
                  className="absolute bottom-4 right-4 p-2 bg-white rounded-full border border-border shadow-sm text-muted-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="w-full">
              <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 ml-1">
                {selectedRegion ? `Symptoms: ${selectedRegion}` : 'Select a body region'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {(selectedRegion ? regionSymptoms : symptomsByRegion.general).map((symptom) => (
                  <button
                    key={symptom}
                    onClick={() => toggleSymptom(symptom)}
                    className={`px-5 py-2.5 rounded-2xl text-xs font-bold border transition-all active:scale-95 ${
                      selectedSymptoms.includes(symptom)
                        ? 'bg-secondary text-white border-secondary shadow-md'
                        : 'bg-white text-foreground border-border hover:border-secondary/30'
                    }`}
                  >
                    {symptom}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Floating Selection Badge */}
        {selectedSymptoms.length > 0 && (
          <div className="mt-8 animate-fade-in-up">
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 ml-1">Current Selection</h3>
            <div className="flex flex-wrap gap-2">
              {selectedSymptoms.map((symptom) => (
                <div
                  key={symptom}
                  className="bg-white/60 backdrop-blur text-foreground px-4 py-2 rounded-xl flex items-center gap-2 border border-border/50 shadow-sm"
                >
                  <span className="text-xs font-bold">{symptom}</span>
                  <button onClick={() => toggleSymptom(symptom)} className="text-red-400 hover:text-red-500">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="fixed bottom-0 left-0 right-0 px-6 py-6 bg-gradient-to-t from-background via-background/95 to-transparent backdrop-blur-sm z-50">
          <button
            onClick={() => {
              setStorageItem('selectedSymptoms', JSON.stringify(selectedSymptoms));
              navigate('/app/severity-selection');
            }}
            disabled={selectedSymptoms.length === 0}
            className={`w-full py-4 rounded-2xl shadow-xl transition-all font-bold tracking-tight active:scale-[0.98] ${
              selectedSymptoms.length === 0
                ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                : 'bg-gradient-to-r from-primary to-secondary text-white shadow-secondary/20'
            }`}
          >
            {selectedSymptoms.length === 0 ? 'Select Symptoms' : `Confirm Selection (${selectedSymptoms.length})`}
          </button>
        </div>
      </div>
    </div>
  );
}
