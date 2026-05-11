import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';

export function DetailedExplanation() {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<number[]>([0]);

  const toggleSection = (index: number) => {
    setExpandedSections(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const sections = [
    {
      title: 'Common Cold - 75% Match',
      content: 'Based on your symptoms (headache, fatigue, runny nose), you are experiencing typical signs of a common cold. This viral infection affects the upper respiratory tract and is usually self-limiting.',
      recommendations: [
        'Get plenty of rest (7-9 hours of sleep)',
        'Stay hydrated with water and warm fluids',
        'Use over-the-counter pain relievers if needed',
        'Monitor symptoms for 5-7 days',
      ],
    },
    {
      title: 'Viral Infection - 60% Match',
      content: 'Your symptom pattern suggests a possible viral infection. Viral infections can cause fatigue, body aches, and mild fever.',
      recommendations: [
        'Avoid strenuous physical activity',
        'Eat nutritious foods to support immune system',
        'Wash hands frequently',
        'Consult a doctor if symptoms worsen',
      ],
    },
    {
      title: 'Allergic Reaction - 45% Match',
      content: 'Some of your symptoms could indicate an allergic response, particularly the runny nose and headache.',
      recommendations: [
        'Identify and avoid potential allergens',
        'Consider antihistamine medication',
        'Keep windows closed during high pollen days',
        'See an allergist if symptoms persist',
      ],
    },
  ];

  return (
    <div className="size-full bg-background overflow-auto">
      <div className="px-6 py-6 pb-24">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-muted transition-colors">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl text-foreground">
              Detailed Explanation
            </h1>
            <p className="text-sm text-muted-foreground">Understanding your results</p>
          </div>
        </div>

        <div className="space-y-3">
          {sections.map((section, index) => (
            <div key={index} className="bg-white rounded-2xl border border-border overflow-hidden">
              <button
                onClick={() => toggleSection(index)}
                className="w-full p-5 flex items-center justify-between text-left hover:bg-muted/30 transition-colors"
              >
                <h3 className="text-sm text-foreground">
                  {section.title}
                </h3>
                {expandedSections.includes(index) ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </button>

              {expandedSections.includes(index) && (
                <div className="px-5 pb-5 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-4 mt-4 leading-relaxed">
                    {section.content}
                  </p>
                  <div className="bg-muted/50 rounded-xl p-4">
                    <h4 className="text-sm text-foreground mb-2">Recommendations</h4>
                    <ul className="space-y-1.5">
                      {section.recommendations.map((rec, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-secondary mt-1">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 bg-purple-50 border border-purple-200 rounded-2xl p-4">
          <p className="text-sm text-purple-900 mb-2">
            When to Seek Medical Attention
          </p>
          <ul className="space-y-1">
            <li className="text-sm text-purple-700">• Symptoms persist beyond 10 days</li>
            <li className="text-sm text-purple-700">• High fever (above 102°F/39°C)</li>
            <li className="text-sm text-purple-700">• Difficulty breathing</li>
            <li className="text-sm text-purple-700">• Severe or worsening symptoms</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
