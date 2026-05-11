import { ArrowLeft, MapPin, Star, Phone, Clock, Navigation, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router';

export function HospitalDetail() {
  const navigate = useNavigate();

  return (
    <div className="size-full bg-background overflow-auto">
      <div className="px-6 py-6 pb-24">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-muted transition-colors">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-xl text-foreground">
            Hospital Details
          </h1>
        </div>

        <div className="bg-gradient-to-br from-primary to-secondary rounded-3xl p-6 mb-6 text-white shadow-xl">
          <h2 className="text-2xl mb-2">City General Hospital</h2>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="text-lg">4.8</span>
              <span className="text-white/80 text-sm">(1,245 reviews)</span>
            </div>
          </div>
          <p className="text-white/90 text-sm">
            General Hospital • 1.2 km away
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <button className="py-4 rounded-2xl bg-secondary text-white flex items-center justify-center gap-2">
            <Phone className="w-5 h-5" />
            Call
          </button>
          <button className="py-4 rounded-2xl bg-white text-foreground border border-border flex items-center justify-center gap-2">
            <Navigation className="w-5 h-5" />
            Directions
          </button>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-border mb-4">
          <h3 className="text-sm text-foreground mb-3">Information</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-foreground">123 Healthcare Avenue</p>
                <p className="text-sm text-muted-foreground">New York, NY 10001</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-foreground">+1 234-567-8900</p>
                <p className="text-sm text-muted-foreground">Emergency hotline</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-foreground">Open 24/7</p>
                <p className="text-sm text-muted-foreground">Emergency services available</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-border mb-4">
          <h3 className="text-sm text-foreground mb-3">Departments</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              'Emergency',
              'Cardiology',
              'Surgery',
              'Pediatrics',
              'Radiology',
              'Laboratory',
            ].map((dept, index) => (
              <div key={index} className="bg-muted/50 rounded-xl p-3 text-center">
                <p className="text-sm text-foreground">{dept}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-border">
          <h3 className="text-sm text-foreground mb-3">Facilities</h3>
          <div className="space-y-2">
            {[
              'Emergency Room',
              'ICU',
              'Operating Theaters',
              'CT & MRI Scanners',
              'Pharmacy',
              'Parking Available',
            ].map((facility, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                <span className="text-sm text-muted-foreground">{facility}</span>
              </div>
            ))}
          </div>
        </div>

        <button className="w-full mt-6 py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center gap-2">
          <Calendar className="w-5 h-5" />
          Book Appointment
        </button>
      </div>
    </div>
  );
}
