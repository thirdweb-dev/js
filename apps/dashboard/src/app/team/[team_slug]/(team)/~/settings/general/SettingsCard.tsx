import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import { cn } from "../../../../../../../@/lib/utils";

export function SettingsCard(props: {
  bottomText: string;
  header?: {
    description: string | undefined;
    title: string;
  };
  children: React.ReactNode;
  errorText: string | undefined;
  noPermissionText: string | undefined;
  saveButton?: {
    onClick: () => void;
    disabled: boolean;
    isLoading: boolean;
  };
}) {
  return (
    <div className="border rounded-lg bg-muted/50 relative">
      <div
        className={cn(
          "border-b px-4 lg:px-6 py-6 relative",
          props.noPermissionText && "cursor-not-allowed",
        )}
      >
        {props.header && (
          <>
            <h3 className="text-xl font-semibold tracking-tight">
              {props.header.title}
            </h3>
            {props.header.description && (
              <p className="text-foreground text-sm mt-1.5 mb-4">
                {props.header.description}
              </p>
            )}
          </>
        )}

        {props.children}
      </div>

      <div className="px-4 lg:px-6 py-3 flex items-center justify-between gap-2 min-h-[60px]">
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
            className="gap-2"
            onClick={props.saveButton.onClick}
            disabled={props.saveButton.disabled || props.saveButton.isLoading}
            variant="outline"
          >
            {props.saveButton.isLoading && <Spinner className="size-3" />}
            {props.saveButton.isLoading ? "Saving" : "Save"}
          </Button>
        )}
      </div>
    </div>
  );
}
