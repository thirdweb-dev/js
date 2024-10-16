import { Label } from "@/components/ui/label";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { AsteriskIcon, InfoIcon } from "lucide-react";

export function FormFieldSetup(props: {
  htmlFor: string;
  label: string;
  errorMessage: React.ReactNode | undefined;
  children: React.ReactNode;
  tooltip?: React.ReactNode;
  isRequired: boolean;
}) {
  return (
    <div>
      <div className="mb-2 inline-flex items-center gap-1">
        <Label htmlFor={props.htmlFor}>{props.label}</Label>

        {props.isRequired && (
          <AsteriskIcon className="size-3.5 text-destructive-text" />
        )}

        {props.tooltip && (
          <ToolTipLabel label={props.tooltip}>
            <InfoIcon className="size-3.5 text-muted-foreground" />
          </ToolTipLabel>
        )}
      </div>
      {props.children}
      {props.errorMessage && (
        <p className="mt-1 text-destructive-text text-sm">
          {props.errorMessage}
        </p>
      )}
    </div>
  );
}
