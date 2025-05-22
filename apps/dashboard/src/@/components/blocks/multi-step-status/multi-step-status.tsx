"use client";

import { Button } from "@/components/ui/button";
import {
  AlertCircleIcon,
  CircleCheckIcon,
  CircleIcon,
  RefreshCwIcon,
} from "lucide-react";
import { DynamicHeight } from "../../ui/DynamicHeight";
import { Spinner } from "../../ui/Spinner/Spinner";

export type MultiStepState = {
  status: "idle" | "pending" | "completed" | "error";
  retryLabel: string;
  label: string;
  execute: () => Promise<void>;
};

export function MultiStepStatus(props: {
  steps: MultiStepState[];
}) {
  return (
    <DynamicHeight>
      <div className="space-y-4">
        {props.steps.map((step) => (
          <div key={step.label} className="flex items-start space-x-3 ">
            {step.status === "completed" ? (
              <CircleCheckIcon className="mt-0.5 size-5 flex-shrink-0 text-green-500" />
            ) : step.status === "pending" ? (
              <Spinner className="mt-0.5 size-5 flex-shrink-0 text-foreground" />
            ) : step.status === "error" ? (
              <AlertCircleIcon className="mt-0.5 size-5 flex-shrink-0 text-red-500" />
            ) : (
              <CircleIcon className="mt-0.5 size-5 flex-shrink-0 text-muted-foreground/70" />
            )}
            <div className="flex-1">
              <p
                className={`font-medium ${
                  step.status === "pending"
                    ? "text-foreground"
                    : step.status === "completed"
                      ? "text-green-500"
                      : step.status === "error"
                        ? "text-red-500"
                        : "text-muted-foreground/70"
                }`}
              >
                {step.label}
              </p>

              {step.status === "error" && (
                <div className="mt-1 space-y-2">
                  <p className="mb-1 text-red-500 text-sm">{step.retryLabel}</p>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="gap-2"
                    onClick={() => step.execute()}
                  >
                    <RefreshCwIcon className="size-4" />
                    Retry
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </DynamicHeight>
  );
}
