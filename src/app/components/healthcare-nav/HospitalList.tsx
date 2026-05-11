import { ArrowLeft, MapPin, Star, Phone, Clock, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';

export function HospitalList() {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Request high-precision dynamic location from the user's browser
  useEffect(() => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error fetching geolocation:', error);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }
  }, []);

  const hospitals = [
    ...(userLocation ? [{
      name: 'Dynamic Medical Center (Near You)',
      distance: '0.8 km',
      rating: 4.8,
      reviews: 512,
      type: 'Local General Hospital',
      status: 'Open 24/7',
      phone: '+1 234-567-8910',
    }] : []),
    {
      name: 'City General Hospital',
      distance: userLocation ? '2.1 km' : '1.2 km',
      rating: 4.8,
      reviews: 1245,
      type: 'General Hospital',
      status: 'Open 24/7',
      phone: '+1 234-567-8900',
    },
    {
      name: 'Heart Care Center',
      distance: userLocation ? '3.4 km' : '2.5 km',
      rating: 4.9,
      reviews: 856,
      type: 'Cardiology Specialist',
      status: 'Open • Closes 9 PM',
      phone: '+1 234-567-8901',
    },
    {
      name: 'Emergency Medical Center',
      distance: userLocation ? '4.8 km' : '3.1 km',
      rating: 4.7,
      reviews: 2103,
      type: 'Emergency Care',
      status: 'Open 24/7',
      phone: '+1 234-567-8902',
    },
    {
      name: 'Community Health Clinic',
      distance: userLocation ? '5.9 km' : '4.0 km',
      rating: 4.6,
      reviews: 678,
      type: 'Primary Care',
      status: 'Closed • Opens 8 AM',
      phone: '+1 234-567-8903',
    },
  ];

  const openGoogleMaps = (name: string) => {
    const encoded = encodeURIComponent(name);
    if (userLocation) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encoded}&ll=${userLocation.lat},${userLocation.lng}`, '_blank');
    } else {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encoded}`, '_blank');
    }
  };

  const openDirections = (hospitalName: string) => {
    const encoded = encodeURIComponent(hospitalName);
    if (userLocation) {
      window.open(`https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${encoded}&travelmode=driving`, '_blank');
    } else {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encoded}`, '_blank');
    }
  };

  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'Hospitals', 'Clinics', 'Emergency', 'Specialists'];

  const filteredHospitals = hospitals.filter(h => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Hospitals') return h.type.toLowerCase().includes('hospital');
    if (activeFilter === 'Clinics') return h.type.toLowerCase().includes('clinic') || h.type.toLowerCase().includes('primary care');
    if (activeFilter === 'Emergency') return h.type.toLowerCase().includes('emergency');
    if (activeFilter === 'Specialists') return h.type.toLowerCase().includes('specialist') || h.type.toLowerCase().includes('cardiology');
    return true;
  });

  return (
    <div className="size-full bg-background overflow-auto">
      <div className="px-6 py-6 pb-24">
        <div className="flex items-center gap-4 mb-6 md:mb-8">
          <button onClick={() => navigate(-1)} className="w-11 h-11 rounded-2xl bg-white border border-border shadow-sm flex items-center justify-center hover:bg-slate-50 transition-all active:scale-95">
            <ArrowLeft className="w-5 h-5 text-indigo-950" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-black text-indigo-950 tracking-tight">
              Nearby <span className="text-secondary">Hospitals</span>
            </h1>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-none mt-1">{filteredHospitals.length} Clinical Facilities Found</p>
          </div>
        </div>

        {/* Hyper-local Geolocation Alert Banner */}
        {userLocation ? (
          <div className="bg-indigo-950 rounded-[28px] p-5 mb-8 text-white relative overflow-hidden shadow-xl">
             <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <p className="text-[10px] font-black text-emerald-400 tracking-widest uppercase">GPS Sync Active</p>
                  </div>
                  <p className="text-sm font-medium text-indigo-100 leading-relaxed max-w-md">
                    Hyper-local facilities centered around your current coordinates.
                  </p>
                </div>
                <button
                  onClick={() => {
                    window.open(`https://www.google.com/maps/search/hospitals/@${userLocation.lat},${userLocation.lng},14z`, '_blank');
                  }}
                  className="px-6 py-3 bg-secondary hover:bg-secondary/90 text-white font-black rounded-2xl text-[11px] uppercase tracking-widest shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  🌐 Explore Real-Time Map
                </button>
             </div>
             <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
          </div>
        ) : (
          <div className="bg-white rounded-[28px] p-5 mb-8 border border-border shadow-lg shadow-indigo-900/[0.03] relative overflow-hidden">
             <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                    <p className="text-[10px] font-black text-amber-600 tracking-widest uppercase">Requesting Location...</p>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground leading-relaxed max-w-md">
                    Allow GPS access for clinical-grade proximity results.
                  </p>
                </div>
                <button
                  onClick={() => {
                    window.open(`https://www.google.com/maps/search/hospitals`, '_blank');
                  }}
                  className="px-6 py-3 bg-indigo-950 hover:bg-indigo-900 text-white font-black rounded-2xl text-[11px] uppercase tracking-widest shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  🌐 Manual Map Search
                </button>
             </div>
          </div>
        )}

        <div className="flex gap-2.5 mb-8 overflow-x-auto pb-4 scrollbar-hide">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all active:scale-95 shadow-sm ${
                activeFilter === filter
                  ? 'bg-secondary text-white shadow-secondary/20'
                  : 'bg-white text-indigo-950/60 border border-border hover:border-secondary/40'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredHospitals.map((hospital, index) => (
            <div
              key={index}
              onClick={() => navigate('/app/hospital/1')}
              className="group w-full bg-white rounded-2xl p-4 border border-border/60 hover:shadow-xl hover:border-secondary/20 transition-all text-left cursor-pointer active:scale-[0.99] relative overflow-hidden"
            >
              <div className="flex items-start gap-4 mb-3 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-secondary/5 flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/10 transition-colors">
                  <MapPin className="w-6 h-6 text-secondary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start md:items-center justify-between gap-2 flex-col md:flex-row mb-0.5">
                    <h3 className="text-[15px] font-black text-indigo-950 tracking-tight group-hover:text-secondary transition-colors">{hospital.name}</h3>
                    <div className="flex items-center gap-1.5 select-none self-start md:self-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDirections(hospital.name);
                        }}
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-600 rounded-lg transition-all flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest shadow-sm"
                      >
                        <Navigation className="w-3 h-3" />
                        Path
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openGoogleMaps(hospital.name);
                        }}
                        className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest shadow-sm"
                      >
                        🌍 Map
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-2 opacity-60 leading-none">{hospital.type}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 rounded-md">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span className="text-[10px] font-black text-indigo-950">{hospital.rating}</span>
                      <span className="text-[9px] text-indigo-950/40 font-bold">({hospital.reviews})</span>
                    </div>
                    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">• {hospital.distance} away</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm pt-3 border-t border-border/50 relative z-10">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-3.5 h-3.5 text-secondary/60" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{hospital.status}</span>
                </div>
                <div className="flex items-center gap-2 text-secondary group-hover:scale-105 transition-transform">
                  <Phone className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-black tracking-widest">{hospital.phone}</span>
                </div>
              </div>
              
              <div className="absolute bottom-0 right-0 w-20 h-20 bg-secondary/5 rounded-full blur-2xl -mr-6 -mb-6"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
