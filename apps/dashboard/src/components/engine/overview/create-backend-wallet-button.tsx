import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type CreateBackendWalletInput,
  type EngineInstance,
  type WalletConfigResponse,
  useEngineCreateBackendWallet,
  useHasEngineFeature,
} from "@3rdweb-sdk/react/hooks/useEngine";
import { Dialog } from "@radix-ui/react-dialog";
import { useTrack } from "hooks/analytics/useTrack";
import {
  EngineBackendWalletOptions,
  type EngineBackendWalletType,
} from "lib/engine";
import { CircleAlertIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import invariant from "tiny-invariant";

interface CreateBackendWalletButtonProps {
  instance: EngineInstance;
  walletConfig: WalletConfigResponse;
}

export const CreateBackendWalletButton: React.FC<
  CreateBackendWalletButtonProps
> = ({ instance, walletConfig }) => {
  const { isSupported: supportsMultipleWalletTypes } = useHasEngineFeature(
    instance.url,
    "HETEROGENEOUS_WALLET_TYPES",
  );
  const [isOpen, setIsOpen] = useState(false);
  const createWallet = useEngineCreateBackendWallet(instance.url);
  const trackEvent = useTrack();

  const form = useForm<CreateBackendWalletInput>({
    defaultValues: { type: walletConfig.type },
  });

  const onSubmit = async (data: CreateBackendWalletInput) => {
    const promise = createWallet.mutateAsync(data, {
      onSuccess: () => {
        setIsOpen(false);
        trackEvent({
          category: "engine",
          action: "create-backend-wallet",
          label: "success",
          instance: instance.url,
        });
      },
      onError: (error) => {
        trackEvent({
          category: "engine",
          action: "create-backend-wallet",
          label: "error",
          instance: instance.url,
          error,
        });
      },
    });

    toast.promise(promise, {
      success: "Wallet created successfully",
      error: "Failed to create wallet",
    });
  };

  const walletType = form.watch("type");
  const selectedOption = EngineBackendWalletOptions.find(
    (opt) => opt.key === walletType,
  );
  invariant(selectedOption, "Selected a valid backend wallet type.");

  // List all wallet types only if Engine is updated to support it.
  const walletTypeOptions = supportsMultipleWalletTypes
    ? EngineBackendWalletOptions
    : [selectedOption];

  const isAwsKmsConfigured = !!walletConfig.awsAccessKeyId;
  const isGcpKmsConfigured = !!walletConfig.gcpKmsKeyRingId;

  const isFormValid =
    walletType === "local" ||
    (walletType === "aws-kms" && isAwsKmsConfigured) ||
    (walletType === "gcp-kms" && isGcpKmsConfigured);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Create</Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="z-[10001] p-0"
          dialogOverlayClassName="z-[10000]"
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="p-6">
                <DialogHeader className="mb-4">
                  <DialogTitle className="font-semibold text-2xl tracking-tight">
                    Create Wallet
                  </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-5">
                  {/* Wallet type */}
                  <FormFieldSetup
                    label="Wallet Type"
                    errorMessage={
                      form.getFieldState("type", form.formState).error?.message
                    }
                    htmlFor="wallet-label"
                    isRequired
                    tooltip={null}
                  >
                    <Select
                      onValueChange={(value) => {
                        form.reset();
                        form.setValue("type", value as EngineBackendWalletType);
                      }}
                      value={form.watch("type")}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="z-[10001]">
                        <SelectGroup>
                          {walletTypeOptions.map((option) => (
                            <SelectItem key={option.key} value={option.key}>
                              {option.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormFieldSetup>

                  {(walletType === "aws-kms" && !isAwsKmsConfigured) ||
                  (walletType === "gcp-kms" && !isGcpKmsConfigured) ? (
                    // Warning if not configured
                    <Alert variant="warning">
                      <CircleAlertIcon className="size-5" />
                      <AlertTitle>
                        {selectedOption?.name} is not yet configured
                      </AlertTitle>
                      <AlertDescription>
                        Provide your credentials on the{" "}
                        <Link
                          href={`/dashboard/engine/${instance.id}/configuration`}
                          className="text-link-foreground hover:text-foreground"
                        >
                          Configuration
                        </Link>{" "}
                        tab to enable backend wallets stored on{" "}
                        {selectedOption?.name}.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    // Label
                    <FormFieldSetup
                      key="label"
                      label="Label"
                      errorMessage={
                        form.getFieldState("label", form.formState).error
                          ?.message
                      }
                      htmlFor="wallet-label"
                      isRequired={false}
                      tooltip={null}
                    >
                      <Input
                        id="wallet-label"
                        type="text"
                        placeholder="A description to identify this backend wallet"
                        {...form.register("label")}
                      />
                    </FormFieldSetup>
                  )}
                </div>
              </div>

              <DialogFooter className="mt-4 gap-4 border-border border-t bg-muted/50 p-6 lg:gap-2 ">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="min-w-28 gap-2"
                  disabled={!isFormValid || createWallet.isPending}
                >
                  {createWallet.isPending && <Spinner className="size-4" />}
                  Create
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};
