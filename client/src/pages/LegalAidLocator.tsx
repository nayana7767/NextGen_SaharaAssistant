import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Phone, Clock, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";

interface LegalAidCenter {
  id: string;
  name: string;
  type: "legal-aid" | "court" | "police" | "ngo";
  address: string;
  phone: string;
  distance: number;
  hours: string;
}

const mockCenters: LegalAidCenter[] = [
  {
    id: "1",
    name: "Delhi Legal Aid Center",
    type: "legal-aid",
    address: "123 Legal Street, New Delhi - 110001",
    phone: "+91-11-2345-6789",
    distance: 2.5,
    hours: "9:00 AM - 5:00 PM"
  },
  {
    id: "2",
    name: "Delhi High Court",
    type: "court",
    address: "Kasturba Nagar, New Delhi - 110003",
    phone: "+91-11-2370-6789",
    distance: 5.2,
    hours: "10:00 AM - 4:00 PM"
  },
  {
    id: "3",
    name: "Delhi Police Station",
    type: "police",
    address: "456 Police Road, New Delhi - 110002",
    phone: "100 (Emergency)",
    distance: 1.8,
    hours: "24/7"
  },
  {
    id: "4",
    name: "Women's Rights NGO",
    type: "ngo",
    address: "789 Support Avenue, New Delhi - 110004",
    phone: "+91-11-5678-9012",
    distance: 3.5,
    hours: "10:00 AM - 6:00 PM"
  }
];

const typeColors: Record<string, { bg: string; text: string }> = {
  "legal-aid": { bg: "bg-blue-100", text: "text-blue-700" },
  "court": { bg: "bg-purple-100", text: "text-purple-700" },
  "police": { bg: "bg-red-100", text: "text-red-700" },
  "ngo": { bg: "bg-green-100", text: "text-green-700" }
};

const typeLabels: Record<string, string> = {
  "legal-aid": "Legal Aid",
  "court": "Court",
  "police": "Police",
  "ngo": "NGO"
};

export default function LegalAidLocator() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [selectedCenter, setSelectedCenter] = useState<LegalAidCenter | null>(mockCenters[0]);

  if (authLoading) {
    return <div className="container max-w-4xl py-6">Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="container max-w-2xl py-6 text-center">
        <h1 className="text-3xl font-bold text-primary mb-4">Find Legal Aid</h1>
        <p className="text-muted-foreground mb-6">Please log in to find legal aid centers</p>
        <Button onClick={() => setLocation("/")}>Go Home</Button>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLocation("/")}
        className="mb-4 gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>

      <h1 className="text-3xl font-bold text-primary mb-2">Find Legal Aid</h1>
      <p className="text-muted-foreground mb-6">Locate nearest NALSA centers, courts, police stations, and NGOs</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Placeholder */}
        <div className="lg:col-span-2">
          <Card className="p-6 h-96 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 font-medium">Map View</p>
              <p className="text-sm text-slate-500">Select a center to view on map</p>
            </div>
          </Card>
        </div>

        {/* Centers List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {mockCenters.map((center) => (
            <Card
              key={center.id}
              className={`p-4 cursor-pointer transition-all ${
                selectedCenter?.id === center.id
                  ? "border-primary bg-primary/5"
                  : "hover:border-primary/50"
              }`}
              onClick={() => setSelectedCenter(center)}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-sm">{center.name}</h3>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    typeColors[center.type].bg
                  } ${typeColors[center.type].text}`}
                >
                  {typeLabels[center.type]}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{center.distance} km away</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Selected Center Details */}
      {selectedCenter && (
        <Card className="mt-6 p-6">
          <h2 className="text-2xl font-bold mb-4">{selectedCenter.name}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex gap-3">
              <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{selectedCenter.address}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{selectedCenter.phone}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm text-muted-foreground">Hours</p>
                <p className="font-medium">{selectedCenter.hours}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm text-muted-foreground">Distance</p>
                <p className="font-medium">{selectedCenter.distance} km away</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button className="flex-1">Get Directions</Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => window.location.href = `tel:${selectedCenter.phone}`}
            >
              <Phone className="w-4 h-4 mr-2" />
              Call Now
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
