import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type React from "react";

export function SettingsCard(
  props: React.PropsWithChildren<{
    bottomText: React.ReactNode;
    header?: {
      description: string | undefined;
      title: string;
    };
    errorText: string | undefined;
    noPermissionText: string | undefined;
    saveButton?: {
      onClick?: () => void;
      disabled: boolean;
      isPending: boolean;
      type?: "submit";
      variant?:
        | "ghost"
        | "default"
        | "primary"
        | "destructive"
        | "outline"
        | "secondary";
      className?: string;
      label?: string;
    };
  }>,
) {
  return (
    <div className="relative rounded-lg border border-border bg-card">
      <div
        className={cn(
          "relative border-border border-b px-4 py-6 lg:px-6",
          props.noPermissionText && "cursor-not-allowed",
        )}
      >
        {props.header && (
          <>
            <h3 className="font-semibold text-xl tracking-tight">
              {props.header.title}
            </h3>
            {props.header.description && (
              <p className="mt-1.5 mb-4 text-foreground text-sm">
                {props.header.description}
              </p>
            )}
          </>
        )}

        {props.children}
      </div>

      <div className="flex min-h-[60px] items-center justify-between gap-2 px-4 py-3 lg:px-6">
        {props.noPermissionText ? (
          <p className="text-muted-foreground text-sm">
            {props.noPermissionText}
          </p>
        ) : props.errorText ? (
          <p className="text-destructive-text text-sm">{props.errorText}</p>
        ) : (
          <p className="text-muted-foreground text-sm">{props.bottomText}</p>
        )}

        {props.saveButton && !props.noPermissionText && (
          <Button
            size="sm"
            className={cn("gap-2", props.saveButton.className)}
            onClick={props.saveButton.onClick}
            disabled={props.saveButton.disabled || props.saveButton.isPending}
            variant={props.saveButton.variant || "outline"}
            type={props.saveButton.type}
          >
            {props.saveButton.isPending && <Spinner className="size-3" />}
            {props.saveButton.label ||
              (props.saveButton.isPending ? "Saving" : "Save")}
          </Button>
        )}
      </div>
    </div>
  );
}
