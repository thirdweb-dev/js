"use client";

import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { Spinner } from "@/components/ui/Spinner/Spinner";
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
  type ImportBackendWalletInput,
  useEngineImportBackendWallet,
  useEngineWalletConfig,
} from "@3rdweb-sdk/react/hooks/useEngine";
import { useTrack } from "hooks/analytics/useTrack";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function ImportBackendWalletButton(props: {
  instanceUrl: string;
}) {
  const { instanceUrl } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: walletConfig } = useEngineWalletConfig(instanceUrl);
  const importWallet = useEngineImportBackendWallet(instanceUrl);
  const trackEvent = useTrack();
  const form = useForm<ImportBackendWalletInput>();

  const walletType =
    walletConfig?.type === "aws-kms"
      ? "AWS KMS"
      : walletConfig?.type === "gcp-kms"
        ? "GCP KMS"
        : "local";

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)} variant="outline">
        Import
      </Button>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent
          className="z-[10001] p-0"
          dialogOverlayClassName="z-[10000]"
        >
          <form
            onSubmit={form.handleSubmit((data) => {
              const promise = importWallet.mutateAsync(data, {
                onSuccess: () => {
                  setIsModalOpen(false);
                  trackEvent({
                    category: "engine",
                    action: "import-backend-wallet",
                    label: "success",
                    type: walletConfig?.type,
                    instance: instanceUrl,
                  });
                },
                onError: (error) => {
                  trackEvent({
                    category: "engine",
                    action: "import-backend-wallet",
                    label: "error",
                    type: walletConfig?.type,
                    instance: instanceUrl,
                    error,
                  });
                },
              });

              toast.promise(promise, {
                success: "Wallet imported successfully",
                error: "Failed to import wallet",
              });
            })}
          >
            <div className="p-6">
              <DialogHeader className="mb-5">
                <DialogTitle className="font-semibold text-2xl tracking-tight">
                  Import {walletType} wallet
                </DialogTitle>
              </DialogHeader>

              {walletConfig?.type === "local" && (
                <FormFieldSetup
                  htmlFor="privateKey"
                  label="Private key"
                  errorMessage={
                    form.getFieldState("privateKey", form.formState).error
                      ?.message
                  }
                  isRequired
                >
                  <Input
                    id="privateKey"
                    placeholder="Your wallet private key"
                    autoComplete="off"
                    type="text"
                    {...form.register("privateKey", {
                      required: true,
                      // TODO: add private key validation here
                    })}
                  />
                </FormFieldSetup>
              )}

              {walletConfig?.type === "aws-kms" && (
                <div className="flex flex-col gap-4">
                  <FormFieldSetup
                    label="AWS KMS Key ID"
                    isRequired
                    errorMessage={
                      form.getFieldState("awsKmsKeyId", form.formState).error
                        ?.message
                    }
                    htmlFor="awsKmsKeyId"
                  >
                    <Input
                      id="awsKmsKeyId"
                      placeholder=""
                      autoComplete="off"
                      type="text"
                      {...form.register("awsKmsKeyId", { required: true })}
                    />
                  </FormFieldSetup>

                  <FormFieldSetup
                    isRequired
                    label="AWS KMS ARN"
                    errorMessage={
                      form.getFieldState("awsKmsArn", form.formState).error
                        ?.message
                    }
                    htmlFor="awsKmsArn"
                  >
                    <Input
                      id="awsKmsArn"
                      placeholder=""
                      autoComplete="off"
                      type="text"
                      {...form.register("awsKmsArn", { required: true })}
                    />
                  </FormFieldSetup>
                </div>
              )}

              {walletConfig?.type === "gcp-kms" && (
                <div className="flex flex-col gap-4">
                  <FormFieldSetup
                    htmlFor="gcpKmsKeyId"
                    errorMessage={
                      form.getFieldState("gcpKmsKeyId", form.formState).error
                        ?.message
                    }
                    label="GCP KMS Key ID"
                    isRequired
                  >
                    <Input
                      id="gcpKmsKeyId"
                      placeholder=""
                      autoComplete="off"
                      type="text"
                      {...form.register("gcpKmsKeyId", { required: true })}
                    />
                  </FormFieldSetup>

                  <FormFieldSetup
                    label="GCP KMS Version ID"
                    errorMessage={
                      form.getFieldState("gcpKmsKeyVersionId", form.formState)
                        .error?.message
                    }
                    htmlFor="gcpKmsKeyVersionId"
                    isRequired
                  >
                    <Input
                      id="gcpKmsKeyVersionId"
                      placeholder=""
                      autoComplete="off"
                      type="text"
                      {...form.register("gcpKmsKeyVersionId", {
                        required: true,
                      })}
                    />
                  </FormFieldSetup>
                </div>
              )}
            </div>

            <DialogFooter className="!flex-row !justify-end mt-4 gap-3 border-border border-t bg-muted/50 p-6">
              <Button
                type="button"
                onClick={() => setIsModalOpen(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button type="submit" className="min-w-28 gap-2">
                {importWallet.isPending && <Spinner className="size-4" />}
                Import
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
