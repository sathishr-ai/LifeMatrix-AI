import { ArrowLeft, FileText, Download, Share2, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router';

export function ReportSummary() {
  const navigate = useNavigate();

  const reports = [
    {
      title: 'Weekly Health Report',
      period: 'April 27 - May 3, 2026',
      type: 'Weekly',
      status: 'Ready',
      color: 'bg-blue-500',
    },
    {
      title: 'Monthly Summary',
      period: 'April 2026',
      type: 'Monthly',
      status: 'Ready',
      color: 'bg-purple-500',
    },
    {
      title: 'Risk Assessment Report',
      period: 'Q2 2026',
      type: 'Quarterly',
      status: 'Ready',
      color: 'bg-orange-500',
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
              Health Reports
            </h1>
            <p className="text-sm text-muted-foreground">View and download reports</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary to-secondary rounded-3xl p-6 mb-6 text-white shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl">Latest Report</h2>
              <p className="text-white/80 text-sm">April 27 - May 3, 2026</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/app/download-report')}
            className="w-full py-3 rounded-xl bg-white/20 backdrop-blur text-white flex items-center justify-center gap-2 hover:bg-white/30 transition-colors"
          >
            <Download className="w-5 h-5" />
            Download PDF
          </button>
        </div>

        <div className="space-y-3 mb-6">
          {reports.map((report, index) => (
            <div key={index} className="bg-white rounded-2xl p-5 border border-border">
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-xl ${report.color} bg-opacity-10 flex items-center justify-center flex-shrink-0`}>
                  <FileText className={`w-6 h-6 ${report.color.replace('bg-', 'text-')}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm text-foreground mb-1">{report.title}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{report.period}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-600">
                      {report.status}
                    </span>
                    <span className="text-xs text-muted-foreground">• {report.type}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                    <Share2 className="w-5 h-5 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => navigate('/app/download-report')}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <Download className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate('/app/analytics')}
          className="w-full py-4 rounded-2xl bg-white text-foreground border border-border flex items-center justify-center gap-2"
        >
          <Calendar className="w-5 h-5" />
          View Analytics Dashboard
        </button>
      </div>
    </div>
  );
}
