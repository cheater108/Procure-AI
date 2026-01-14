import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { ProcurementStepper } from "@/components/ProcurementStepper";
import api from "@/api";
import { useNavigate } from "react-router";

export default function Demo() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);

    try {
      await api.post("/rfps", {
        query: query
      });

      setQuery("");
      setCurrentStep(2);

      navigate("/rfps");
    } catch (error) {
      console.error("Failed to create RFP:", error);
      setIsLoading(false);
    }
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

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <Textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type your procurement query here..."
          className="min-h-30 resize-none"
          disabled={isLoading}
          rows={5}
        />
        <Button type="submit" size="icon" className="w-45" disabled={isLoading}>
          <div className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            <p>Create Procurement</p>
            <span className="sr-only">Send</span>
          </div>
        </Button>
      </form>
    </div>
  );
}
