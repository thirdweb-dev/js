import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

export function StepCard(props: {
  title: string;
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
      }
    | {
        type: "click";
        disabled?: boolean;
        onClick: () => void;
      };
  children: React.ReactNode;
}) {
  const nextButton = props.nextButton;
  return (
    <div className="rounded-lg border bg-card">
      <h2 className="border-b px-4 py-5 font-semibold text-xl tracking-tight md:px-6">
        {props.title}
      </h2>

      {props.children}

      {(props.prevButton || props.nextButton) && (
        <div className="flex justify-end gap-3 border-t p-6">
          {props.prevButton && (
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => {
                props.prevButton?.onClick();
              }}
            >
              <ArrowLeftIcon className="size-4" />
              Back
            </Button>
          )}

          {nextButton && nextButton.type !== "custom" && (
            <Button
              variant="default"
              className="gap-2"
              type="submit"
              disabled={nextButton.disabled}
              onClick={() => {
                if (nextButton.type === "click") {
                  nextButton.onClick();
                }
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
      )}
    </div>
  );
}
