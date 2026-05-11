import { useState } from 'react';
import { ArrowLeft, Plus, X, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router';

export function MedicalHistory() {
  const navigate = useNavigate();
  const [conditions, setConditions] = useState(['Asthma', 'Hypertension']);
  const [allergies, setAllergies] = useState(['Penicillin', 'Peanuts']);
  const [showAddCondition, setShowAddCondition] = useState(false);
  const [showAddAllergy, setShowAddAllergy] = useState(false);

  return (
    <div className="size-full bg-background overflow-auto">
      <div className="px-6 py-6 pb-24">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-muted transition-colors">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl text-foreground">
              Medical History
            </h1>
            <p className="text-sm text-muted-foreground">Manage your health records</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-foreground">Existing Conditions</h3>
            <button
              onClick={() => setShowAddCondition(!showAddCondition)}
              className="p-2 rounded-xl bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {showAddCondition && (
            <div className="bg-white rounded-2xl p-4 border border-border mb-3">
              <input
                type="text"
                placeholder="Enter condition name..."
                className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:border-secondary focus:outline-none"
              />
              <div className="flex gap-2 mt-3">
                <button className="flex-1 py-2 rounded-xl bg-secondary text-white">
                  Add
                </button>
                <button
                  onClick={() => setShowAddCondition(false)}
                  className="px-4 py-2 rounded-xl bg-muted text-foreground"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {conditions.map((condition, index) => (
              <div key={index} className="bg-white rounded-2xl p-4 border border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  </div>
                  <span className="text-sm text-foreground">{condition}</span>
                </div>
                <button
                  onClick={() => setConditions(conditions.filter((_, i) => i !== index))}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-foreground">Allergies</h3>
            <button
              onClick={() => setShowAddAllergy(!showAddAllergy)}
              className="p-2 rounded-xl bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {showAddAllergy && (
            <div className="bg-white rounded-2xl p-4 border border-border mb-3">
              <input
                type="text"
                placeholder="Enter allergy..."
                className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:border-secondary focus:outline-none"
              />
              <div className="flex gap-2 mt-3">
                <button className="flex-1 py-2 rounded-xl bg-orange-500 text-white">
                  Add
                </button>
                <button
                  onClick={() => setShowAddAllergy(false)}
                  className="px-4 py-2 rounded-xl bg-muted text-foreground"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {allergies.map((allergy, index) => (
              <div key={index} className="bg-white rounded-2xl p-4 border border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                  </div>
                  <span className="text-sm text-foreground">{allergy}</span>
                </div>
                <button
                  onClick={() => setAllergies(allergies.filter((_, i) => i !== index))}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <p className="text-sm text-blue-900">
            Keep your medical history up to date for more accurate AI health assessments and recommendations.
          </p>
        </div>
      </div>
    </div>
  );
}
