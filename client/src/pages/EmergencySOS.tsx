import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle, Phone, MapPin } from "lucide-react";

interface EmergencyContact {
  name: string;
  number: string;
  description: string;
  icon: React.ReactNode;
}

const emergencyContacts: EmergencyContact[] = [
  {
    name: "Women Helpline",
    number: "181",
    description: "24/7 support for women in distress",
    icon: <Phone className="w-6 h-6" />
  },
  {
    name: "Police",
    number: "100",
    description: "Emergency police assistance",
    icon: <AlertTriangle className="w-6 h-6" />
  },
  {
    name: "Ambulance",
    number: "102",
    description: "Medical emergency",
    icon: <Phone className="w-6 h-6" />
  }
];

export default function EmergencySOS() {
  const [sosActivated, setSOSActivated] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSOSClick = () => {
    setShowConfirm(true);
  };

  const confirmSOS = () => {
    setSOSActivated(true);
    setTimeout(() => {
      setSOSActivated(false);
      setShowConfirm(false);
    }, 3000);
  };

  if (sosActivated) {
    return (
      <div className="fixed inset-0 bg-red-600 flex items-center justify-center z-50">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">🚨</div>
          <h1 className="text-4xl font-bold mb-4">SOS ACTIVATED</h1>
          <p className="text-xl mb-8">Emergency contacts have been notified</p>
          <div className="space-y-2">
            <p>Location: Sending...</p>
            <p>Status: Alert Sent</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-background">
      <div className="container max-w-2xl py-6">
        <div className="text-center mb-12">
          <AlertTriangle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-red-600 mb-2">Emergency SOS</h1>
          <p className="text-muted-foreground">Quick access to emergency services and support</p>
        </div>

        {/* Main SOS Button */}
        <div className="mb-12">
          <button
            onClick={handleSOSClick}
            className="w-full h-48 bg-red-600 hover:bg-red-700 text-white rounded-2xl shadow-2xl flex flex-col items-center justify-center gap-4 transition-all transform hover:scale-105 active:scale-95"
          >
            <div className="text-7xl">🆘</div>
            <div className="text-3xl font-bold">SOS ALERT</div>
            <p className="text-sm">Tap to send emergency alert</p>
          </button>
        </div>

        {/* Confirmation Dialog */}
        {showConfirm && (
          <Card className="p-6 mb-8 border-2 border-red-600 bg-red-50">
            <h3 className="text-lg font-bold text-red-600 mb-4">Confirm Emergency Alert?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              This will send your location and alert emergency contacts immediately.
            </p>
            <div className="flex gap-2">
              <Button
                onClick={confirmSOS}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Yes, Send Alert
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowConfirm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </Card>
        )}

        {/* Emergency Contacts */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Quick Call</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {emergencyContacts.map((contact) => (
              <Card
                key={contact.number}
                className="p-4 text-center hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => window.location.href = `tel:${contact.number}`}
              >
                <div className="text-red-600 mb-2 flex justify-center">
                  {contact.icon}
                </div>
                <h3 className="font-bold mb-1">{contact.name}</h3>
                <p className="text-2xl font-bold text-red-600 mb-2">{contact.number}</p>
                <p className="text-xs text-muted-foreground">{contact.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Nearest Shelter */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Nearest Shelter</h2>
          <Card className="p-4">
            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-bold mb-2">Women's Shelter Home</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  123 Safe Street, Delhi - 2.5 km away
                </p>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">Get Directions</Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Safety Tips */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Safety Tips</h2>
          <Card className="p-4 space-y-3">
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 text-sm font-bold">1</div>
              <p className="text-sm">Take screenshots of threats and save them</p>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 text-sm font-bold">2</div>
              <p className="text-sm">Share your location with a trusted contact</p>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 text-sm font-bold">3</div>
              <p className="text-sm">Document all incidents with dates and times</p>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 text-sm font-bold">4</div>
              <p className="text-sm">Keep emergency numbers saved in your phone</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
