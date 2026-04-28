import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिन्दी" },
  { code: "kn", name: "ಕನ್ನಡ" },
  { code: "ta", name: "தமிழ்" },
  { code: "te", name: "తెలుగు" },
  { code: "ml", name: "മലയാളം" },
];

export default function LanguageSelector() {
  const [currentLanguage, setCurrentLanguage] = useState("en");

  // Load language from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("language") || "en";
    setCurrentLanguage(saved);
    document.documentElement.lang = saved;
  }, []);

  const handleLanguageChange = (code: string) => {
    setCurrentLanguage(code);
    localStorage.setItem("language", code);
    document.documentElement.lang = code;
    // Dispatch custom event for app-wide language change
    window.dispatchEvent(new CustomEvent("languageChange", { detail: { language: code } }));
  };

  const currentLangName = languages.find((l) => l.code === currentLanguage)?.name || "English";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">{currentLangName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={currentLanguage === lang.code ? "bg-accent" : ""}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
