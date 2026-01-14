import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProcurementStepperProps {
  currentStep: number;
}

const steps = [
  "Requirement submission",
  "Searching for vendors",
  "Emailing vendors",
  "Scoring proposals and advice",
];

export function ProcurementStepper({ currentStep }: ProcurementStepperProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="relative flex items-center justify-between w-full">
        {/* Connection Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-muted -z-10"></div>
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-primary -z-10 transition-all duration-300 ease-in-out"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        ></div>

        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div key={step} className="flex flex-col items-center gap-2 bg-background px-2">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors duration-300",
                  isCompleted || isCurrent
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground bg-background text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="text-sm font-medium">{stepNumber}</span>
                )}
              </div>
              <span
                className={cn(
                  "absolute top-10 text-xs font-medium w-32 text-center transition-colors duration-300",
                  isCompleted || isCurrent ? "text-primary" : "text-muted-foreground"
                )}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
      {/* Spacer for the absolute positioned text */}
      <div className="h-8"></div>
    </div>
  );
}
