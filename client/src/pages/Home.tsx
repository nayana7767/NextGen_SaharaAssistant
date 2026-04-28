import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { MessageCircle, FileText, MapPin, MessageSquare, AlertCircle, Users, Heart, Shield, Zap } from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, logout: handleLogout } = useAuth();

  const features = [
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Know Your Rights",
      description: "Chat with our AI assistant to understand your legal rights under Indian law",
      path: "/rights",
      requiresAuth: true
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Generate Complaint",
      description: "Create formal complaints with legal guidance and PDF export",
      path: "/complaint",
      requiresAuth: true
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Select a Lawyer",
      description: "Browse and select qualified legal professionals for your case",
      path: "/lawyers",
      requiresAuth: true
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Find Legal Aid",
      description: "Locate nearest NALSA centers, courts, and legal aid services",
      path: "/legal-aid",
      requiresAuth: true
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Case Follow-Up",
      description: "Track your case progress and get updates on next steps",
      path: "/follow-up",
      requiresAuth: true
    },
    {
      icon: <AlertCircle className="w-8 h-8" />,
      title: "Emergency SOS",
      description: "Quick access to emergency contacts and safety resources",
      path: "/emergency-sos",
      requiresAuth: false
    }
  ];

  const benefits = [
    {
      icon: <Heart className="w-6 h-6 text-red-500" />,
      title: "Empathetic Support",
      description: "Compassionate AI assistance designed for your needs"
    },
    {
      icon: <Shield className="w-6 h-6 text-blue-500" />,
      title: "Legal Protection",
      description: "Guidance based on Indian laws and constitutional rights"
    },
    {
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      title: "Quick Access",
      description: "Instant help 24/7 without waiting for appointments"
    }
  ];

  const handleFeatureClick = (path: string, requiresAuth: boolean) => {
    if (requiresAuth && !isAuthenticated) {
      window.location.href = getLoginUrl(path);
    } else {
      setLocation(path);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-background">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-16 z-30">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
              S
            </div>
            <h1 className="text-xl font-bold text-primary">Sahara</h1>
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-muted-foreground">{user?.name}</span>
              <Button size="sm" variant="outline" onClick={() => handleLogout()}>
                Logout
              </Button>
              </>
            ) : (
              <Button size="sm" onClick={() => window.location.href = getLoginUrl()}>
                Login
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="container py-12 md:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Your Legal Rights, Simplified
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Access free legal guidance, connect with lawyers, and understand your rights under Indian law. Empathetic, accessible, and always available.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              size="lg"
              onClick={() => handleFeatureClick("/rights", true)}
              className="gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Start Chat
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => handleFeatureClick("/emergency-sos", false)}
              className="gap-2"
            >
              <AlertCircle className="w-5 h-5" />
              Emergency Help
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container py-12">
        <h3 className="text-2xl font-bold text-center mb-8">Why Choose Sahara?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map((benefit, idx) => (
            <Card key={idx} className="p-6 text-center">
              <div className="flex justify-center mb-4">{benefit.icon}</div>
              <h4 className="font-bold mb-2">{benefit.title}</h4>
              <p className="text-sm text-muted-foreground">{benefit.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-12">
        <h3 className="text-2xl font-bold text-center mb-8">Our Services</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <Card
              key={idx}
              className="p-6 cursor-pointer hover:shadow-lg transition-all hover:border-primary"
              onClick={() => handleFeatureClick(feature.path, feature.requiresAuth)}
            >
              <div className="text-primary mb-4">{feature.icon}</div>
              <h4 className="font-bold mb-2">{feature.title}</h4>
              <p className="text-sm text-muted-foreground mb-4">{feature.description}</p>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                Learn More →
              </Button>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-12">
        <Card className="p-8 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Get Legal Help?</h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of Indians who have accessed free legal guidance through Sahara. Your rights matter.
            </p>
            {!isAuthenticated ? (
              <Button
                size="lg"
                onClick={() => window.location.href = getLoginUrl()}
              >
                Get Started Now
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={() => setLocation("/rights")}
              >
                Start Using Sahara
              </Button>
            )}
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-12 py-8">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">About</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">About Us</a></li>
                <li><a href="#" className="hover:text-primary">Our Mission</a></li>
                <li><a href="#" className="hover:text-primary">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Legal Chat</a></li>
                <li><a href="#" className="hover:text-primary">Find Lawyers</a></li>
                <li><a href="#" className="hover:text-primary">Emergency Help</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary">Disclaimer</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Help Center</a></li>
                <li><a href="#" className="hover:text-primary">FAQ</a></li>
                <li><a href="#" className="hover:text-primary">Feedback</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2026 NextGen Sahara Assistant. All rights reserved.</p>
            <p className="mt-2">Empowering Indians with accessible legal guidance.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
