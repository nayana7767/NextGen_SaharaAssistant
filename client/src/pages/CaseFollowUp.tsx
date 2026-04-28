import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Trash2, Mic, Square, ArrowLeft } from "lucide-react";
import { Streamdown } from "streamdown";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function CaseFollowUp() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Welcome to your case follow-up. I'm here to help track your case and provide next steps. What would you like to know about your case?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const sendMessageMutation = trpc.caseFollowUp.sendMessage.useMutation();

  // Load messages from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("caseFollowUpMessages");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMessages(parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      } catch (error) {
        console.error("Failed to load messages", error);
      }
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("caseFollowUpMessages", JSON.stringify(messages));
  }, [messages]);

  if (authLoading) {
    return <div className="container max-w-2xl py-6">Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="container max-w-2xl py-6 text-center">
        <h1 className="text-3xl font-bold text-primary mb-4">Case Follow-Up</h1>
        <p className="text-muted-foreground mb-6">Please log in to track your case</p>
        <Button onClick={() => setLocation("/")}>Go Home</Button>
      </div>
    );
  }

  const initializeSpeechRecognition = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Speech Recognition is not supported in your browser.");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = "en-IN";

    recognitionRef.current.onstart = () => {
      setIsListening(true);
    };

    recognitionRef.current.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          setInput((prev) => prev + transcript);
        }
      }
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };
  };

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      initializeSpeechRecognition();
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const result = await sendMessageMutation.mutateAsync({ message: input });
      const assistantMessage: Message = {
        role: "assistant",
        content: result.message,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "Oh sorry, do you heard that? Here are the solution for it\n\nI apologize, but I encountered an error processing your request. Please try again later.",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear all messages?")) {
      setMessages([
        {
          role: "assistant",
          content: "Welcome to your case follow-up. I'm here to help track your case and provide next steps. What would you like to know about your case?",
          timestamp: new Date()
        }
      ]);
      localStorage.removeItem("caseFollowUpMessages");
    }
  };

  return (
    <div className="container max-w-2xl py-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLocation("/")}
        className="mb-4 gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Case Follow-Up</h1>
          <p className="text-muted-foreground">Track your case and get guided next steps</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearHistory}
          className="gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Clear History
        </Button>
      </div>

      <div className="bg-card rounded-lg border border-border shadow-sm p-4 h-[500px] overflow-y-auto mb-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-xs lg:max-w-md p-3 rounded-lg ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
              <div className={msg.role === "assistant" ? "" : ""}>
                {msg.role === "assistant" ? (
                  <Streamdown>{msg.content}</Streamdown>
                ) : (
                  msg.content
                )}
              </div>
              <p className={`text-xs mt-2 ${msg.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted p-3 rounded-lg">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Ask about your case..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          disabled={isLoading}
        />
        <Button
          size="icon"
          variant={isListening ? "destructive" : "outline"}
          onClick={handleVoiceInput}
          title={isListening ? "Stop recording" : "Start voice input"}
          className={isListening ? "animate-pulse" : ""}
        >
          {isListening ? <Square className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </Button>
        <Button size="icon" onClick={handleSend} disabled={isLoading || !input.trim()}>
          <Send className="w-5 h-5" />
        </Button>
      </div>

      {isListening && (
        <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
            Listening... Speak now
          </p>
        </div>
      )}
    </div>
  );
}
