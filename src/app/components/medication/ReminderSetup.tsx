import { ArrowLeft, Clock, Bell, Repeat } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';

export function ReminderSetup() {
  const navigate = useNavigate();
  const [reminderData, setReminderData] = useState({
    medication: 'Aspirin 100mg',
    times: ['08:00'],
    frequency: 'Daily',
    startDate: '2026-05-03',
    endDate: '',
  });

  const addTime = () => {
    setReminderData({ ...reminderData, times: [...reminderData.times, '12:00'] });
  };

  return (
    <div className="size-full bg-background overflow-auto">
      <div className="px-6 py-6 pb-24">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-muted transition-colors">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl text-foreground">
              Setup Reminders
            </h1>
            <p className="text-sm text-muted-foreground">Never miss a dose</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-6 mb-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl">{reminderData.medication}</h2>
              <p className="text-white/80 text-sm">Medication Reminder</p>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-2xl p-5 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-5 h-5 text-secondary" />
              <h3 className="text-sm text-foreground">Reminder Times</h3>
            </div>
            <div className="space-y-3">
              {reminderData.times.map((time, index) => (
                <input
                  key={index}
                  type="time"
                  value={time}
                  onChange={(e) => {
                    const newTimes = [...reminderData.times];
                    newTimes[index] = e.target.value;
                    setReminderData({ ...reminderData, times: newTimes });
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:border-secondary focus:outline-none"
                />
              ))}
              <button
                onClick={addTime}
                className="w-full py-3 rounded-xl border-2 border-dashed border-border text-secondary hover:bg-secondary/10 transition-colors"
              >
                + Add Another Time
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <Repeat className="w-5 h-5 text-secondary" />
              <h3 className="text-sm text-foreground">Frequency</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {['Daily', 'Weekly', 'As needed'].map((freq) => (
                <button
                  key={freq}
                  onClick={() => setReminderData({ ...reminderData, frequency: freq })}
                  className={`py-3 rounded-xl border-2 transition-all ${
                    reminderData.frequency === freq
                      ? 'border-secondary bg-secondary/10 text-secondary'
                      : 'border-border bg-background text-foreground'
                  }`}
                >
                  {freq}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-border">
            <label className="block text-sm text-foreground/80 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={reminderData.startDate}
              onChange={(e) => setReminderData({ ...reminderData, startDate: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:border-secondary focus:outline-none"
            />
          </div>

          <div className="bg-white rounded-2xl p-5 border border-border">
            <label className="block text-sm text-foreground/80 mb-2">
              End Date (Optional)
            </label>
            <input
              type="date"
              value={reminderData.endDate}
              onChange={(e) => setReminderData({ ...reminderData, endDate: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:border-secondary focus:outline-none"
            />
          </div>
        </div>

        <div className="fixed bottom-20 left-0 right-0 px-6 py-4 bg-background/80 backdrop-blur">
          <button
            onClick={() => navigate('/app/reminders')}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
          >
            Set Reminders
          </button>
        </div>
      </div>
    </div>
  );
}
