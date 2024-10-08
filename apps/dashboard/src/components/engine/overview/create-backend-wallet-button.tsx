"use client";

import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  type CreateBackendWalletInput,
  useEngineCreateBackendWallet,
  useEngineWalletConfig,
} from "@3rdweb-sdk/react/hooks/useEngine";
import { useTrack } from "hooks/analytics/useTrack";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function CreateBackendWalletButton(props: {
  instanceUrl: string;
}) {
  const { instanceUrl } = props;
  const [isOpen, setIsOpen] = useState(false);
  const { data: walletConfig } = useEngineWalletConfig(instanceUrl);
  const createWallet = useEngineCreateBackendWallet(instanceUrl);
  const trackEvent = useTrack();
  const form = useForm<CreateBackendWalletInput>();

  const onSubmit = async (data: CreateBackendWalletInput) => {
    const promise = createWallet.mutateAsync(data, {
      onSuccess: () => {
        setIsOpen(false);
        trackEvent({
          category: "engine",
          action: "create-backend-wallet",
          label: "success",
          instance: instanceUrl,
        });
      },
      onError: (error) => {
        trackEvent({
          category: "engine",
          action: "create-backend-wallet",
          label: "error",
          instance: instanceUrl,
          error,
        });
      },
    });

    toast.promise(promise, {
      success: "Wallet created successfully",
      error: "Failed to create wallet",
    });
  };

  const walletType =
    walletConfig?.type === "aws-kms"
      ? "AWS KMS"
      : walletConfig?.type === "gcp-kms"
        ? "GCP KMS"
        : "local";

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Create</Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="z-[10001] p-0"
          dialogOverlayClassName="z-[10000]"
        >
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="p-6">
              <DialogHeader className="mb-4">
                <DialogTitle className="font-semibold text-2xl tracking-tight">
                  Create {walletType} wallet
                </DialogTitle>
              </DialogHeader>

              <div className="flex flex-col gap-4">
                <div>
                  <p className="mb-1 text-sm">Wallet Type</p>
                  <Badge className="text-sm" variant="outline">
                    {walletType}
                  </Badge>
                </div>

                <FormFieldSetup
                  label="Label"
                  errorMessage={
                    form.getFieldState("label", form.formState).error?.message
                  }
                  htmlFor="wallet-label"
                  isRequired={false}
                >
                  <Input
                    id="wallet-label"
                    type="text"
                    placeholder="Enter a descriptive label"
                    {...form.register("label")}
                  />
                </FormFieldSetup>
              </div>
            </div>

            <DialogFooter className="!flex-row !justify-end mt-4 gap-3 border-border border-t bg-muted/50 p-6">
              <Button onClick={() => setIsOpen(false)} variant="outline">
                Cancel
              </Button>
              <Button type="submit" className="min-w-28 gap-2">
                {createWallet.isPending && <Spinner className="size-4" />}
                Create
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
