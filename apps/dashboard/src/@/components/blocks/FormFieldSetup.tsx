import { Label } from "@/components/ui/label";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { AsteriskIcon, InfoIcon } from "lucide-react";

export function FormFieldSetup(props: {
  htmlFor: string;
  label: string;
  errorMessage: React.ReactNode | undefined;
  children: React.ReactNode;
  tooltip: React.ReactNode | undefined;
  isRequired: boolean;
}) {
  return (
    <div>
      <div className="mb-2 inline-flex gap-1 items-center">
        <Label htmlFor={props.htmlFor}>{props.label}</Label>

        {props.isRequired && (
          <AsteriskIcon className="text-destructive-text size-3.5" />
        )}

        {props.tooltip && (
          <ToolTipLabel label={props.tooltip}>
            <InfoIcon className="text-muted-foreground size-3.5" />
          </ToolTipLabel>
        )}
      </div>
      {props.children}
      {props.errorMessage && (
        <p className="text-destructive-text text-sm mt-1">
          {props.errorMessage}
        </p>
      )}
    </div>
  );
}
