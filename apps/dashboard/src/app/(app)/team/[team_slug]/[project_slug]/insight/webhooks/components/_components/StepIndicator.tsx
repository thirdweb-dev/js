"use client";

import { cn } from "@/lib/utils";
import {
  type WebhookFormStep,
  WebhookFormSteps,
} from "../_utils/webhook-types";

interface StepIndicatorProps {
  currentStep: WebhookFormStep;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps = [
    { id: WebhookFormSteps.BasicInfo, label: "Basic Info" },
    { id: WebhookFormSteps.FilterDetails, label: "Configure Filters" },
    { id: WebhookFormSteps.Review, label: "Review" },
  ];

  return (
    <div className="mb-6 flex w-full items-center justify-center">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div
            className={cn(
              "flex",
              "h-10",
              "w-10",
              "items-center",
              "justify-center",
              "rounded-full",
              "font-medium",
              "shrink-0",
              currentStep === step.id
                ? "bg-primary text-primary-foreground"
                : index < steps.findIndex((s) => s.id === currentStep)
                  ? "bg-primary/80 text-primary-foreground"
                  : "bg-muted text-muted-foreground",
            )}
          >
            {index + 1}
          </div>

          {index < steps.length - 1 && (
            <div className="mx-1 h-1 w-16 bg-muted">
              <div
                className={cn(
                  "h-full",
                  "bg-primary",
                  "transition-all duration-300",
                  steps.findIndex((s) => s.id === currentStep) > index
                    ? "w-full"
                    : "w-0",
                )}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
