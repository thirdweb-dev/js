import { Card } from "@/components/ui/card";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { InfoIcon } from "lucide-react";
import type { JSX, MouseEventHandler } from "react";

interface SelectOptionProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  description?: string;
  isActive?: boolean;
  onClick: MouseEventHandler<HTMLDivElement>;
  disabled?: boolean;
  disabledText?: string;
  infoText?: string | JSX.Element;
  className?: string;
}

export const SelectOption: React.FC<SelectOptionProps> = ({
  name,
  description,
  isActive = true,
  onClick,
  disabled,
  disabledText,
  infoText,
  className,
  ...divProps
}) => {
  return (
    <ToolTipLabel
      label={
        disabled ? (
          <Card className="bg-muted p-3">
            <p className="text-sm">{disabledText}</p>
          </Card>
        ) : undefined
      }
    >
      <Card
        className={cn(
          "flex flex-col gap-2 rounded-md p-5 md:w-[350px]",
          disabled
            ? "pointer-events-none cursor-not-allowed bg-muted"
            : "cursor-pointer",
          isActive && "border-primary",
          className,
        )}
        onClick={onClick}
        {...divProps}
      >
        <div className="flex flex-row justify-between">
          <div className="flex flex-row items-start">
            <div className="mt-0.5 mr-2.5 flex h-4 w-4 items-center justify-center rounded-full border border-inverted text-inverted">
              {isActive && <div className="h-2 w-2 rounded-full bg-inverted" />}
            </div>
            <div className="ml-4 flex flex-col gap-2 self-start">
              <h4
                className={cn(
                  "font-semibold text-sm",
                  disabled && "text-gray-600",
                )}
              >
                {name}
              </h4>
              {description && <p className="mt-1 text-sm">{description}</p>}
            </div>
          </div>
          {infoText && (
            <ToolTipLabel
              label={
                <Card className="bg-muted p-3">
                  <p className="text-sm">{infoText}</p>
                </Card>
              }
            >
              <div className="flex items-center">
                <InfoIcon className="size-4" />
              </div>
            </ToolTipLabel>
          )}
        </div>
      </Card>
    </ToolTipLabel>
  );
};
