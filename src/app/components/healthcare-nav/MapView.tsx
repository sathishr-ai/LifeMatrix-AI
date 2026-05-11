import { ArrowLeft, MapPin, Navigation, List } from 'lucide-react';
import { useNavigate } from 'react-router';

export function MapView() {
  const navigate = useNavigate();

  const nearbyHospitals = [
    { name: 'City General Hospital', distance: '1.2 km', type: 'General' },
    { name: 'Heart Care Center', distance: '2.5 km', type: 'Cardiology' },
    { name: 'Emergency Medical Center', distance: '3.1 km', type: 'Emergency' },
  ];

  return (
    <div className="size-full bg-background overflow-hidden flex flex-col">
      <div className="px-6 py-6 flex items-center gap-3 bg-white border-b border-border">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-muted transition-colors">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl text-foreground">
            Find Healthcare
          </h1>
          <p className="text-sm text-muted-foreground">Nearby hospitals and clinics</p>
        </div>
        <button
          onClick={() => navigate('/app/hospitals')}
          className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
        >
          <List className="w-6 h-6 text-foreground" />
        </button>
      </div>

      <div className="flex-1 relative bg-muted/30">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-8">
            <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Map view would display here</p>
            <p className="text-sm text-muted-foreground mt-2">
              Interactive map with hospital locations
            </p>
          </div>
        </div>

        <button className="absolute top-4 right-4 p-3 rounded-full bg-white shadow-lg border border-border">
          <Navigation className="w-6 h-6 text-secondary" />
        </button>
      </div>

      <div className="p-4 bg-white border-t border-border">
        <h3 className="text-sm text-foreground mb-3">Nearby Hospitals</h3>
        <div className="space-y-2">
          {nearbyHospitals.map((hospital, index) => (
            <button
              key={index}
              onClick={() => navigate('/app/hospital/1')}
              className="w-full bg-background rounded-xl p-3 border border-border hover:shadow-md transition-shadow flex items-center gap-3 text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-secondary" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm text-foreground">{hospital.name}</h4>
                <p className="text-xs text-muted-foreground">{hospital.distance} • {hospital.type}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
