import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Mic, Send, Square } from "lucide-react";
import { Streamdown } from "streamdown";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";

export default function RightsEngine() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([
    { role: "assistant", content: "Hello! I'm here to help you understand your legal rights. Please describe your situation, and I'll explain the relevant Indian laws." }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const sendMessageMutation = trpc.chat.sendMessage.useMutation();

  if (authLoading) {
    return <div className="container max-w-2xl py-6">Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="container max-w-2xl py-6 text-center">
        <h1 className="text-3xl font-bold text-primary mb-4">Know Your Rights</h1>
        <p className="text-muted-foreground mb-6">Please log in to access the AI legal assistant</p>
        <Button onClick={() => setLocation("/")}>Go Home</Button>
      </div>
    );
  }

  // Initialize Web Speech API
  const initializeSpeechRecognition = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Speech Recognition is not supported in your browser. Please use Chrome, Edge, or Safari.");
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
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          setInput((prev) => prev + transcript);
        } else {
          interimTranscript += transcript;
        }
      }
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      alert("Error: " + event.error);
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

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const result = await sendMessageMutation.mutateAsync({ message: input });
      const assistantMessage = {
        role: "assistant",
        content: result.message
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = {
        role: "assistant",
        content: "Oh sorry, do you heard that? Here are the solution for it\n\nI apologize, but I encountered an error processing your request. Please try again."
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl py-6">
      <h1 className="text-3xl font-bold text-primary mb-2">Know Your Rights</h1>
      <p className="text-muted-foreground mb-6">Describe your legal situation and I'll explain your rights under Indian law</p>

      <div className="bg-card rounded-lg border border-border shadow-sm p-4 h-[500px] overflow-y-auto mb-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-xs lg:max-w-md p-3 rounded-lg ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
              {msg.role === "assistant" ? <Streamdown>{msg.content}</Streamdown> : msg.content}
            </div>
          </div>
        ))}
        {isLoading && <div className="flex justify-start"><div className="bg-muted p-3 rounded-lg">Thinking...</div></div>}
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Describe your situation..."
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
