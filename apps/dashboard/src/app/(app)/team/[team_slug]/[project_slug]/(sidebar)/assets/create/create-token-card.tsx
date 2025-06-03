import { Button } from "@/components/ui/button";
import { useTrack } from "hooks/analytics/useTrack";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { getStepCardTrackingData } from "./tracking";

export function StepCard(props: {
  title: string;
  page: "info" | "distribution" | "launch";
  prevButton:
    | undefined
    | {
        onClick: () => void;
      };
  nextButton:
    | undefined
    | {
        type: "submit";
        disabled?: boolean;
      }
    | {
        type: "custom";
        custom: React.ReactNode;
      };
  children: React.ReactNode;
}) {
  const trackEvent = useTrack();
  return (
    <div className="rounded-lg border bg-card">
      <h2 className="border-b px-4 py-5 font-semibold text-xl tracking-tight md:px-6">
        {props.title}
      </h2>

      {props.children}

      <div className="flex justify-end gap-3 border-t p-6">
        {props.prevButton && (
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => {
              props.prevButton?.onClick();
              trackEvent(
                getStepCardTrackingData({
                  step: props.page,
                  click: "prev",
                }),
              );
            }}
          >
            <ArrowLeftIcon className="size-4" />
            Back
          </Button>
        )}

        {props.nextButton && props.nextButton.type === "submit" && (
          <Button
            variant="default"
            className="gap-2"
            type="submit"
            disabled={props.nextButton.disabled}
            onClick={() => {
              trackEvent(
                getStepCardTrackingData({
                  step: props.page,
                  click: "next",
                }),
              );
            }}
          >
            Next
            <ArrowRightIcon className="size-4" />
          </Button>
        )}

        {props.nextButton &&
          props.nextButton.type === "custom" &&
          props.nextButton.custom}
      </div>
    </div>
  );
}
