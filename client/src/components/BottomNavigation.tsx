import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Home,
  MessageCircle,
  FileText,
  MapPin,
  MessageSquare,
  AlertCircle
} from "lucide-react";

const navigationItems = [
  { label: "Home", path: "/", icon: Home },
  { label: "Rights", path: "/rights", icon: MessageCircle },
  { label: "Complaint", path: "/complaint", icon: FileText },
  { label: "Legal Aid", path: "/legal-aid", icon: MapPin },
  { label: "Follow-Up", path: "/follow-up", icon: MessageSquare },
  { label: "SOS", path: "/emergency-sos", icon: AlertCircle }
];

export default function BottomNavigation() {
  const [location, setLocation] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-background border-t border-border">
      <div className="flex items-center justify-around h-16">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;

          return (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              onClick={() => setLocation(item.path)}
              className={`flex flex-col items-center gap-1 h-full rounded-none border-t-2 ${
                isActive ? "border-primary text-primary" : "border-transparent"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
