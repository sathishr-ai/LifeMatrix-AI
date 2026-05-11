import { ArrowLeft, Search, MessageSquare, Mail, Globe, ChevronDown, ChevronUp, LifeBuoy, ExternalLink, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { toast } from 'sonner';

export function HelpSupport() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const allFaqs = [
    {
      q: "How does the AI symptom checker work?",
      a: "Our AI analysis uses advanced medical processing models to compare your inputs against thousands of clinical data points to provide accurate initial risk assessments."
    },
    {
      q: "Is my health data shared with third parties?",
      a: "No. Your health data is strictly encrypted and only stored on your local device or secure, private cloud. We never sell your data to advertisers."
    },
    {
      q: "Can I connect my wearable devices?",
      a: "Currently, we support manual input of vitals. Support for Apple Health and Google Fit integration is coming in Version 2.0."
    },
    {
      q: "How do I update my medications?",
      a: "Navigate to the 'Home' tab and tap 'Today's Tasks' or 'Add Medicine' to update your current prescriptions and schedules."
    },
    {
      q: "What should I do in an emergency?",
      a: "If you are experiencing a life-threatening emergency, please call 911 or your local emergency services immediately. LifeMatrix is not for emergency use."
    }
  ];

  const filteredFaqs = allFaqs.filter(faq => 
    faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLiveChat = () => {
    navigate('/app/ai-chat');
  };

  const handleEmailSupport = () => {
    window.location.href = `mailto:support@lifematrix.ai?subject=Support Request - ${new Date().toLocaleDateString()}`;
    toast.success('Mail Client Opened', {
      description: 'You can now compose your message to our support team.'
    });
  };

  return (
    <div className="size-full bg-background overflow-auto">
      <div className="px-6 py-6 pb-24">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-muted transition-colors">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl text-foreground font-bold tracking-tight">
              Help & Support
            </h1>
            <p className="text-sm text-muted-foreground font-medium">How can we assist you?</p>
          </div>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search help articles..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-border focus:border-secondary focus:ring-4 focus:ring-secondary/10 focus:outline-none shadow-sm font-medium text-sm transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <button 
            onClick={handleLiveChat}
            className="p-5 rounded-3xl bg-white border border-border shadow-sm flex flex-col items-center gap-3 hover:shadow-md transition-all active:scale-95 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <MessageSquare className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-foreground">Live Chat</span>
          </button>
          <button 
            onClick={handleEmailSupport}
            className="p-5 rounded-3xl bg-white border border-border shadow-sm flex flex-col items-center gap-3 hover:shadow-md transition-all active:scale-95 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
              <Mail className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-foreground">Email Support</span>
          </button>
        </div>

        <div className="space-y-6">
          <section>
            <div className="flex items-center justify-between mb-4 ml-1">
              <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Frequently Asked Questions</h3>
              <span className="text-[10px] font-bold text-secondary uppercase">{filteredFaqs.length} Articles</span>
            </div>
            <div className="space-y-3">
              {filteredFaqs.length > 0 ? filteredFaqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm hover:border-secondary/30 transition-colors">
                  <button 
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full p-4 flex items-center justify-between text-left"
                  >
                    <span className="text-sm font-bold text-foreground leading-tight pr-4">{faq.q}</span>
                    {openFaq === index ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                  </button>
                  {openFaq === index && (
                    <div className="px-4 pb-4 animate-fade-in">
                      <p className="text-xs text-muted-foreground leading-relaxed font-medium">{faq.a}</p>
                    </div>
                  )}
                </div>
              )) : (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <HelpCircle className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-bold text-foreground">No matches found</p>
                  <p className="text-xs text-muted-foreground mt-1">Try different keywords or contact support.</p>
                </div>
              )}
            </div>
          </section>

          <section>
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 ml-1">Other Resources</h3>
            <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-sm">
              <button 
                onClick={() => toast.info('Community Forum', { description: 'Opening the LifeMatrix community portal...' })}
                className="w-full p-5 flex items-center justify-between border-b border-border/50 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Community Forum</p>
                    <p className="text-[10px] text-muted-foreground font-medium">Talk to other users</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </button>
              <button 
                onClick={() => toast.success('System Operational', { description: 'All AI processing nodes and database clusters are running optimally.' })}
                className="w-full p-5 flex items-center justify-between hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <LifeBuoy className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">System Status</p>
                    <p className="text-[10px] text-muted-foreground font-medium">All systems operational</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[8px] font-bold text-emerald-600 uppercase tracking-tighter">Healthy</span>
                </div>
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
