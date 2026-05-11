import { ArrowLeft, Plus, Bell, Clock, Pill, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { getStorageItem, setStorageItem } from '../../utils/storage';

export function ReminderList() {
  const navigate = useNavigate();
  const [reminders, setReminders] = useState<any[]>([]);

  useEffect(() => {
    const localMeds = JSON.parse(getStorageItem('addedMedications', '[]'));

    const allReminders = localMeds.map((med: any) => ({
      id: med.id,
      medication: med.name,
      dosage: med.dosage,
      time: med.time,
      frequency: med.frequency,
      active: med.active !== false, // default to true unless explicitly disabled
      color: 'bg-emerald-500', // clinical green theme
    }));

    setReminders(allReminders);
  }, []);

  const handleDelete = (id: any) => {
    const updated = reminders.filter((r) => r.id !== id);
    setReminders(updated);

    const localMeds = JSON.parse(getStorageItem('addedMedications', '[]'));
    const filteredMeds = localMeds.filter((m: any) => m.id !== id);
    setStorageItem('addedMedications', JSON.stringify(filteredMeds));
  };

  const handleToggle = (id: any) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
    );
  };

  return (
    <div className="size-full bg-background overflow-auto">
      <div className="px-6 py-6 pb-24">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-muted transition-colors">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl text-foreground">
              Medication Reminders
            </h1>
            <p className="text-sm text-muted-foreground">{reminders.filter(r => r.active).length} active reminders</p>
          </div>
          <button
            onClick={() => navigate('/app/add-medicine')}
            className="p-2 rounded-xl bg-secondary text-white"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        <div className="bg-gradient-to-br from-primary to-secondary rounded-3xl p-6 mb-6 text-white shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl">Next Reminder</h2>
              <p className="text-white/80 text-sm">Upcoming schedule</p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-3">
            <p className="text-white text-sm">
              {reminders.find(r => r.active)?.medication || 'No active reminders'} at {reminders.find(r => r.active)?.time || '--:--'}
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {reminders.map((reminder) => (
            <div key={reminder.id} className="bg-white rounded-2xl p-4 border border-border flex items-center justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className={`w-12 h-12 rounded-xl ${reminder.color} bg-opacity-10 flex items-center justify-center flex-shrink-0`}>
                  <Pill className={`w-6 h-6 ${reminder.color.replace('bg-', 'text-')}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm text-foreground mb-0.5">
                    {reminder.medication} {reminder.dosage}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {reminder.time}
                    </div>
                    <span>•</span>
                    <span>{reminder.frequency}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDelete(reminder.id)}
                  className="p-2 rounded-xl hover:bg-red-50 text-red-500 transition-colors"
                  title="Delete medication"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={reminder.active}
                    onChange={() => handleToggle(reminder.id)}
                  />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                </label>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate('/app/medication-history')}
          className="w-full py-4 rounded-2xl bg-white text-foreground border border-border flex items-center justify-center gap-2"
        >
          View Medication History
        </button>
      </div>
    </div>
  );
}
