import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CircleAlertIcon, InfoIcon } from "lucide-react";
import Link from "next/link";
import { createContext, useCallback, useContext, useState } from "react";
import { toast } from "sonner";
import type { ComponentWithChildren } from "types/component-with-children";
import { useDebounce } from "use-debounce";
import { parseErrorToMessage } from "utils/errorParser";

interface ErrorContext {
  onError: (error: unknown, errorTitle?: string) => void;
  dismissError: () => void;
}

const ErrorContext = createContext<ErrorContext>({
  onError: () => undefined,
  dismissError: () => undefined,
});

// We have decided to not export this class from v5 because that area need to be reworked
// so this type is created as a workaround
// @internal
type TransactionError = {
  message: string;
  info?: {
    from: string;
    to: string;
    network?: {
      name: string;
      chainId: number;
    };
  };
  reason?: string;
};

type EnhancedTransactionError = TransactionError & {
  title: string;
};

export const ErrorProvider: ComponentWithChildren = ({ children }) => {
  const [currentErrorOriginal, setCurrentError] =
    useState<EnhancedTransactionError>();
  const dismissError = useCallback(() => setCurrentError(undefined), []);
  const onError = useCallback((err: unknown, title = "An error occurred") => {
    if (isTransactionError(err)) {
      // biome-ignore lint/suspicious/noExplicitAny: FIXME
      (err as any).title = title;
      setCurrentError(err as EnhancedTransactionError);
    } else {
      toast.error(parseErrorToMessage(err));
    }
  }, []);

  // to avoid glitch when currentError becomes undefined while the dialog is still closing
  const [currentErrorDebounced] = useDebounce(currentErrorOriginal, 1000);
  const currentError = currentErrorDebounced || currentErrorOriginal;

  return (
    <>
      <Dialog
        // Use the original for opening/closing modal
        open={!!currentErrorOriginal}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            dismissError();
          }
        }}
      >
        <DialogContent
          className="max-w-[480px] gap-0 p-0 z-[10001]"
          dialogOverlayClassName="z-[10000]"
        >
          {/* min-w-0 is actually required here  */}
          <div className="flex flex-col gap-6 p-6 min-w-0">
            {/* Header */}
            <DialogHeader>
              <div className="flex justify-start mb-1">
                <div className="p-2 bg-destructive text-destructive-text rounded-xl">
                  <CircleAlertIcon className="size-6" />
                </div>
              </div>

              <DialogTitle className="text-2xl font-semibold tracking-tight">
                Failed to send transaction
              </DialogTitle>
            </DialogHeader>

            {/* min-w-0 is actually required here  */}
            <div className="flex flex-col gap-5 min-w-0">
              {/* From */}
              {currentError?.info?.from && (
                <CopyAddressFormControl
                  address={currentError.info.from}
                  label="From"
                />
              )}

              {/* To */}
              {currentError?.info?.to && (
                <CopyAddressFormControl
                  address={currentError?.info?.to}
                  label="To"
                />
              )}

              {/* Chain */}
              <div className="flex flex-col gap-1.5">
                <p className="font-semibold text-sm">Chain</p>
                <p className="text-muted-foreground border border-border px-3 py-2 rounded-lg text-sm">
                  {currentError?.info?.network?.name} (
                  {currentError?.info?.network?.chainId})
                </p>
              </div>

              {/* Root Cause */}
              {currentError?.reason && (
                <div className="flex flex-col gap-1.5">
                  <p className="font-semibold text-sm">Root Cause</p>
                  <code className="font-medium max-h-[250px] overflow-auto font-mono p-3 whitespace-pre-wrap border border-border rounded-lg text-sm text-destructive-text">
                    {currentError.reason}
                  </code>
                </div>
              )}

              <div className="flex gap-2 text-muted-foreground text-sm">
                <InfoIcon className="size-4 shrink-0 mt-0.5" />
                Copying the error message will let you report this error with
                all its details to our team.
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-border flex justify-end p-6 gap-2">
            {currentError?.reason && (
              <CopyTextButton
                copyIconPosition="left"
                textToCopy={currentError.reason}
                textToShow="Copy Error"
                tooltip="Copy root cause of the error shown above"
                className="py-2 text-sm px-4"
              />
            )}

            <Button variant="primary" asChild className="py-2 text-sm">
              <Link href="/support" target="_blank">
                Visit support site
              </Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ErrorContext.Provider
        value={{
          onError,
          dismissError,
        }}
      >
        {children}
      </ErrorContext.Provider>
    </>
  );
};

function CopyAddressFormControl(props: { address: string; label: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="font-semibold text-sm">{props.label}</p>
      <CopyTextButton
        textToCopy={props.address}
        textToShow={props.address}
        copyIconPosition="left"
        iconClassName="size-3"
        tooltip="Copy Address"
        className="py-2 px-3 text-sm justify-start font-mono text-muted-foreground"
      />
    </div>
  );
}

export function useErrorHandler() {
  return useContext(ErrorContext);
}

function isTransactionError(error: unknown): error is TransactionError {
  return error instanceof Object && "reason" in error && "info" in error;
}
