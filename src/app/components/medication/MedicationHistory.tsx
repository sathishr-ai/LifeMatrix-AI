import { ArrowLeft, CheckCircle, XCircle, Clock, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { getStorageItem, setStorageItem } from '../../utils/storage';

export function MedicationHistory() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    // Retrieve user added medications
    const savedMeds = getStorageItem('addedMedications');
    const userMeds = savedMeds ? JSON.parse(savedMeds) : [];
    
    // Retrieve active completed tasks
    const savedTasks = getStorageItem('completed_tasks_status');
    const completedTasks = savedTasks ? JSON.parse(savedTasks) : {};
    
    // Retrieve deleted history items to persist deletions
    const deletedItems = JSON.parse(getStorageItem('deletedHistoryItems', '[]'));

    const generatedHistory: any[] = [];
    
    userMeds.forEach((med: any) => {
      const medTitle = med.dosage ? `Take ${med.name} (${med.dosage})` : `Take ${med.name}`;
      const isTakenToday = !!completedTasks[medTitle] || !!completedTasks[med.name] || !!completedTasks[`Take ${med.name}`];
      
      const id1 = `${med.name}-today`;
      if (!deletedItems.includes(id1)) {
        generatedHistory.push({ id: id1, medication: `${med.name} ${med.dosage || ''}`, time: med.time || '8:00 AM', status: isTakenToday ? 'taken' : 'missed', date: 'Today' });
      }
      
      const id2 = `${med.name}-yesterday`;
      if (!deletedItems.includes(id2)) {
        generatedHistory.push({ id: id2, medication: `${med.name} ${med.dosage || ''}`, time: med.time || '8:00 AM', status: 'taken', date: 'Yesterday' });
      }
      
      const id3 = `${med.name}-2days`;
      if (!deletedItems.includes(id3)) {
        generatedHistory.push({ id: id3, medication: `${med.name} ${med.dosage || ''}`, time: med.time || '8:00 AM', status: 'taken', date: '2 days ago' });
      }
    });

    setHistory(generatedHistory);
  }, []);

  const handleDelete = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
    const deletedItems = JSON.parse(getStorageItem('deletedHistoryItems', '[]'));
    setStorageItem('deletedHistoryItems', JSON.stringify([...deletedItems, id]));
  };

  const takenCount = history.filter(h => h.status === 'taken').length;
  const missedCount = history.filter(h => h.status === 'missed').length;
  const totalEntries = takenCount + missedCount;
  const adherence = totalEntries > 0 ? Math.round((takenCount / totalEntries) * 100) : 100;

  return (
    <div className="size-full bg-background overflow-auto">
      <div className="px-6 py-6 pb-24">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-muted transition-colors">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl text-foreground font-bold">
              Medication History
            </h1>
            <p className="text-sm text-muted-foreground">Last 30 days</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 rounded-2xl p-4 border border-green-200 text-center shadow-sm">
            <h3 className="text-2xl font-bold text-green-600 mb-1">{adherence}%</h3>
            <p className="text-xs text-muted-foreground font-medium">Adherence</p>
          </div>
          <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200 text-center shadow-sm">
            <h3 className="text-2xl font-bold text-blue-600 mb-1">{takenCount}</h3>
            <p className="text-xs text-muted-foreground font-medium">Taken</p>
          </div>
          <div className="bg-red-50 rounded-2xl p-4 border border-red-200 text-center shadow-sm">
            <h3 className="text-2xl font-bold text-red-600 mb-1">{missedCount}</h3>
            <p className="text-xs text-muted-foreground font-medium">Missed</p>
          </div>
        </div>

        <div className="space-y-3">
          {history.map((entry) => {
            const isTaken = entry.status === 'taken';
            return (
              <div key={entry.id} className="bg-white rounded-2xl p-4 border border-border flex items-center justify-between gap-3 relative pr-12 group">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`w-10 h-10 rounded-xl ${isTaken ? 'bg-green-500' : 'bg-red-500'} flex items-center justify-center flex-shrink-0 text-white`}>
                    {isTaken ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <XCircle className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-foreground mb-0.5">
                      {entry.medication}
                    </h3>
                    <div className="flex items-center gap-2 md:gap-3 text-xs text-muted-foreground flex-wrap">
                      <div className="flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3" />
                        {entry.time}
                      </div>
                      <span className="hidden md:inline">•</span>
                      <span className="font-medium">{entry.date}</span>
                    </div>
                  </div>
                </div>
                
                <div className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-[9px] md:text-xs font-bold uppercase tracking-wider flex-shrink-0 ${
                  isTaken
                    ? 'bg-green-50 text-green-600'
                    : 'bg-red-50 text-red-600'
                }`}>
                  {entry.status}
                </div>

                <button 
                  onClick={() => handleDelete(entry.id)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            );
          })}
        </div>

        {history.length > 0 && adherence >= 80 ? (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <h3 className="text-sm font-bold text-blue-900 mb-1">Excellent adherence!</h3>
            <p className="text-sm text-blue-700 leading-relaxed font-medium">
              You've taken {adherence}% of your medications on time. Keep up the fantastic effort!
            </p>
          </div>
        ) : history.length > 0 ? (
          <div className="mt-6 bg-orange-50 border border-orange-200 rounded-2xl p-4">
            <h3 className="text-sm font-bold text-orange-900 mb-1">Stay consistent</h3>
            <p className="text-sm text-orange-700 leading-relaxed font-medium">
              We recommend completing your daily medication tasks to raise your overall adherence score.
            </p>
          </div>
        ) : (
          <div className="mt-6 text-center text-muted-foreground py-8">
            <p>No medication history available.</p>
          </div>
        )}
      </div>
    </div>
  );
}
