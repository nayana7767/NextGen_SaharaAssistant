import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import RightsEngine from "./pages/RightsEngine";
import ComplaintGenerator from "./pages/ComplaintGenerator";
import LegalAidLocator from "./pages/LegalAidLocator";
import CaseFollowUp from "./pages/CaseFollowUp";
import EmergencySOS from "./pages/EmergencySOS";
import LawyerSelection from "./pages/LawyerSelection";
import BottomNavigation from "./components/BottomNavigation";
import LanguageSelector from "./components/LanguageSelector";

function Router() {
  const [location] = useLocation();
  const isEmergencySOS = location === "/emergency-sos";

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header with Language Selector */}
      <header className="sticky top-0 z-40 bg-background border-b border-border shadow-sm">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm">
              S
            </div>
            <h1 className="text-lg font-bold text-primary hidden sm:inline">
              Sahara
            </h1>
          </div>
          <LanguageSelector />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-20 md:pb-0">
        <Switch>
          <Route path={"/"} component={Home} />
          <Route path={"/rights"} component={RightsEngine} />
          <Route path={"/complaint"} component={ComplaintGenerator} />
          <Route path={"/lawyers"} component={LawyerSelection} />
          <Route path={"/legal-aid"} component={LegalAidLocator} />
          <Route path={"/follow-up"} component={CaseFollowUp} />
          <Route path={"/emergency-sos"} component={EmergencySOS} />
          <Route path={"/404"} component={NotFound} />
          {/* Final fallback route */}
          <Route component={NotFound} />
        </Switch>
      </main>

      {/* Bottom Navigation - Mobile Only */}
      {!isEmergencySOS && <BottomNavigation />}
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
