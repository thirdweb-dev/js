import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { ScrollShadow } from "@/components/ui/ScrollShadow/ScrollShadow";
import { useMemo } from "react";

export function UnexpectedValueErrorMessage(props: {
  value: unknown;
  title: string;
  description: string;
  className?: string;
}) {
  const stringifiedValue = useMemo(() => {
    try {
      return JSON.stringify(props.value, null, 2);
    } catch {
      return undefined;
    }
  }, [props.value]);

  return (
    <div className={props.className}>
      <p className="text-base text-destructive-text"> {props.title} </p>
      <p className="text-foreground text-sm">{props.description}</p>
      {stringifiedValue && (
        <div className="mt-3">
          <p className="mb-0.5 text-muted-foreground text-sm">Value Received</p>
          <ScrollShadow className="rounded-lg bg-card">
            <code className="block whitespace-pre p-4 font-mono text-xs">
              {stringifiedValue}
            </code>
          </ScrollShadow>

          <CopyTextButton
            copyIconPosition="left"
            textToShow="Copy value"
            textToCopy={stringifiedValue}
            tooltip="Copy value"
            className="-translate-x-2 mt-1 text-muted-foreground"
            variant="ghost"
          />
        </div>
      )}
    </div>
  );
}
