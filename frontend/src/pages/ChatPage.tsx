import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, Bot, User } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { ProcurementStepper } from "@/components/ProcurementStepper";

type Message = {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
};

export default function Demo() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // Demo state: Step 3
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your AI procurement assistant. How can I help you with your procurement needs today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: query,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuery("");
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `I've received your query about "${query}". This is a demo response. In a real implementation, I would analyze your procurement needs and provide specific recommendations.`,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">AI Procurement Assistant</h1>
        <p className="text-muted-foreground">
          Ask me anything about procurement, RFPs, or vendor management
        </p>
      </div>

      <ProcurementStepper currentStep={currentStep} />

      {/* <div className="bg-card rounded-lg border shadow-sm mb-6 h-[60vh] overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.isUser
                  ? "bg-primary text-primary-foreground rounded-br-none"
                  : "bg-muted rounded-bl-none"
              }`}
            >
              <div className="flex items-start gap-2">
                {!message.isUser && (
                  <div className="bg-primary text-primary-foreground p-1 rounded-md">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <p className="text-sm">{message.content}</p>
                {message.isUser && (
                  <div className="bg-primary-foreground/20 p-1 rounded-md">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
              <p className="text-xs mt-1 opacity-70 text-right">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center space-x-2 text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse delay-150"></div>
            <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse delay-300"></div>
          </div>
        )}
      </div> */}

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <Textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type your procurement query here..."
          className="min-h-30 resize-none"
          disabled={isLoading}
          rows={5}
        />
        <Button type="submit" size="icon" className="w-24" disabled={isLoading}>
          <div className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            <p>Send</p>
            <span className="sr-only">Send</span>
          </div>
        </Button>
      </form>
    </div>
  );
}
