import { cn } from "@/lib/utils";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";

export function Callout(props: {
  children: React.ReactNode;
  variant: "danger" | "warning" | "info";
  disableIcon?: boolean;
  title?: string;
}) {
  return (
    <div
      role="alert"
      className={cn("my-5 flex flex-col gap-1 rounded-lg border bg-card p-4")}
    >
      {/* Icon + title */}
      {props.title && (
        <div
          className={cn(
            "flex items-center gap-2",
            props.variant === "danger" && "text-destructive-text",
            props.variant === "warning" && "text-warning-text",
            props.variant === "info" && "text-link-foreground",
          )}
        >
          {!props.disableIcon && (
            <>
              {props.variant === "danger" && (
                <AlertTriangle className="size-5 shrink-0" />
              )}

              {props.variant === "warning" && (
                <AlertCircle className="size-5 shrink-0 " />
              )}

              {props.variant === "info" && <Info className="size-5 shrink-0" />}
            </>
          )}

          <h3 className="font-semibold text-base">{props.title}</h3>
        </div>
      )}

      <div className="gap-2 pl-7 [&_*:first-child]:mt-0 [&_*:last-child]:mb-0">
        {props.children}
      </div>
    </div>
  );
}
