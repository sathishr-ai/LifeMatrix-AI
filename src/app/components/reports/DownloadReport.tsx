import { ArrowLeft, Download, Share2, Mail, FileText } from 'lucide-react';
import { useNavigate } from 'react-router';

export function DownloadReport() {
  const navigate = useNavigate();

  return (
    <div className="size-full bg-background overflow-auto">
      <div className="px-6 py-6 pb-24">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-muted transition-colors">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl text-foreground">
              Export Report
            </h1>
            <p className="text-sm text-muted-foreground">Download or share your report</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary to-secondary rounded-3xl p-6 mb-6 text-white shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl">Weekly Health Report</h2>
              <p className="text-white/80 text-sm">April 27 - May 3, 2026</p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            <p className="text-white/90 text-sm">
              Comprehensive analysis of your health metrics, activities, and recommendations for the week.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-border mb-4">
          <h3 className="text-sm text-foreground mb-4">Report Contents</h3>
          <div className="space-y-3">
            {[
              'Health Score Summary',
              'Risk Analysis & Trends',
              'Daily Activity Logs',
              'Medication Adherence',
              'Sleep & Nutrition Metrics',
              'AI Recommendations',
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
                <span className="text-sm text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-border mb-4">
          <h3 className="text-sm text-foreground mb-4">Export Format</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { format: 'PDF', size: '2.4 MB', recommended: true },
              { format: 'Excel', size: '1.8 MB', recommended: false },
            ].map((option, index) => (
              <button
                key={index}
                className={`p-4 rounded-xl border-2 transition-all ${
                  option.recommended
                    ? 'border-secondary bg-secondary/10'
                    : 'border-border hover:border-secondary/50'
                }`}
              >
                <h4 className="text-sm text-foreground mb-1">{option.format}</h4>
                <p className="text-xs text-muted-foreground">{option.size}</p>
                {option.recommended && (
                  <span className="text-xs text-secondary mt-2 block">Recommended</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center gap-2 shadow-lg">
            <Download className="w-5 h-5" />
            Download Report
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button className="py-4 rounded-2xl bg-white text-foreground border border-border flex items-center justify-center gap-2">
              <Share2 className="w-5 h-5" />
              Share
            </button>
            <button className="py-4 rounded-2xl bg-white text-foreground border border-border flex items-center justify-center gap-2">
              <Mail className="w-5 h-5" />
              Email
            </button>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <p className="text-sm text-blue-900 mb-1">Privacy Notice</p>
          <p className="text-sm text-blue-700 leading-relaxed">
            Your health data is encrypted and protected. Reports are generated securely and can only be accessed by you.
          </p>
        </div>
      </div>
    </div>
  );
}
