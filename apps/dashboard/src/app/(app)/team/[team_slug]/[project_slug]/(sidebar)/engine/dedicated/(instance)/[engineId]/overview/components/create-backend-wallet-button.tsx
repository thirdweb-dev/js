import { Dialog } from "@radix-ui/react-dialog";
import { CircleAlertIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import invariant from "tiny-invariant";
import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  EngineBackendWalletOptions,
  type EngineBackendWalletType,
} from "@/constants/engine";
import {
  type CreateBackendWalletInput,
  type EngineInstance,
  useEngineCreateBackendWallet,
  useHasEngineFeature,
  type WalletConfigResponse,
} from "@/hooks/useEngine";

interface CreateBackendWalletButtonProps {
  instance: EngineInstance;
  walletConfig: WalletConfigResponse;
  teamSlug: string;
  projectSlug: string;
  authToken: string;
}

export const CreateBackendWalletButton: React.FC<
  CreateBackendWalletButtonProps
> = ({ instance, walletConfig, teamSlug, projectSlug, authToken }) => {
  const { isSupported: supportsMultipleWalletTypes } = useHasEngineFeature(
    instance.url,
    "HETEROGENEOUS_WALLET_TYPES",
  );
  const { isSupported: supportsSmartBackendWallets } = useHasEngineFeature(
    instance.url,
    "SMART_BACKEND_WALLETS",
  );

  const [isOpen, setIsOpen] = useState(false);
  const createWallet = useEngineCreateBackendWallet({
    authToken,
    instanceUrl: instance.url,
  });

  const form = useForm<CreateBackendWalletInput>({
    defaultValues: { type: walletConfig.type },
  });

  const onSubmit = async (data: CreateBackendWalletInput) => {
    const promise = createWallet.mutateAsync(data, {
      onError: (error) => {
        console.error(error);
      },
      onSuccess: () => {
        setIsOpen(false);
      },
    });

    toast.promise(promise, {
      error: "Failed to create wallet",
      success: "Wallet created successfully",
    });
  };

  const walletType = form.watch("type");
  const selectedOption = EngineBackendWalletOptions.find(
    (opt) => opt.key === walletType,
  );
  invariant(selectedOption, "Selected a valid backend wallet type.");

  const isCircleWallet =
    walletType === "circle" || walletType === "smart:circle";

  // List all wallet types only if Engine is updated to support it.
  let walletTypeOptions = [selectedOption];
  if (supportsSmartBackendWallets) {
    walletTypeOptions = EngineBackendWalletOptions;
  } else if (supportsMultipleWalletTypes) {
    walletTypeOptions = EngineBackendWalletOptions.filter(
      ({ key }) => !key.startsWith("smart:"),
    );
  }

  const isNotConfigured =
    (["aws-kms", "smart:aws-kms"].includes(walletType) &&
      !walletConfig.awsAccessKeyId) ||
    (["gcp-kms", "smart:gcp-kms"].includes(walletType) &&
      !walletConfig.gcpKmsKeyRingId);

  const walletLabelId = useId();
  const credentialIdId = useId();
  const isTestnetId = useId();

  return (
    <>
      <Button className="gap-2" onClick={() => setIsOpen(true)} size="sm">
        <PlusIcon className="size-4" />
        Create
      </Button>
      <Dialog onOpenChange={setIsOpen} open={isOpen}>
        <DialogContent className="overflow-hidden p-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="p-6">
                <DialogHeader className="mb-4">
                  <DialogTitle className="font-semibold text-2xl tracking-tight">
                    Create Wallet
                  </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-3">
                  {/* Wallet type */}
                  <FormFieldSetup
                    errorMessage={
                      form.getFieldState("type", form.formState).error?.message
                    }
                    htmlFor="wallet-label"
                    isRequired
                    label="Wallet Type"
                    tooltip={null}
                  >
                    <Select
                      onValueChange={(value) =>
                        form.setValue("type", value as EngineBackendWalletType)
                      }
                      value={form.watch("type")}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {walletTypeOptions.map((option) => (
                            <SelectItem key={option.key} value={option.key}>
                              {option.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    <FormDescription className="py-2">
                      Learn more about{" "}
                      <Link
                        className="text-link-foreground hover:text-foreground"
                        href="https://portal.thirdweb.com/engine/features/backend-wallets"
                      >
                        backend wallet types
                      </Link>
                      .
                    </FormDescription>
                  </FormFieldSetup>

                  {isNotConfigured ? (
                    // Warning if not configured
                    <Alert variant="warning">
                      <CircleAlertIcon className="size-5" />
                      <AlertTitle>
                        {selectedOption?.name} is not yet configured
                      </AlertTitle>
                      <AlertDescription>
                        Provide your credentials on the{" "}
                        <Link
                          className="text-link-foreground hover:text-foreground"
                          href={`/team/${teamSlug}/${projectSlug}/engine/dedicated/${instance.id}/configuration`}
                        >
                          Configuration
                        </Link>{" "}
                        tab to enable backend wallets stored on{" "}
                        {selectedOption?.name}.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <>
                      {/* Label */}
                      <FormFieldSetup
                        errorMessage={
                          form.getFieldState("label", form.formState).error
                            ?.message
                        }
                        htmlFor={walletLabelId}
                        isRequired
                        key="label"
                        label="Label"
                        tooltip={null}
                      >
                        <Input
                          id={walletLabelId}
                          placeholder="A description to identify this backend wallet"
                          type="text"
                          {...form.register("label", { required: true })}
                        />
                      </FormFieldSetup>

                      {/* Credential ID for Circle wallets */}
                      {isCircleWallet && (
                        <>
                          <FormFieldSetup
                            errorMessage={
                              form.getFieldState("credentialId", form.formState)
                                .error?.message
                            }
                            htmlFor={credentialIdId}
                            isRequired
                            key="credentialId"
                            label="Credential ID"
                            tooltip={null}
                          >
                            <Input
                              id={credentialIdId}
                              placeholder="Enter the Circle credential ID"
                              type="text"
                              {...form.register("credentialId", {
                                required: isCircleWallet,
                              })}
                            />
                            <FormDescription className="py-2">
                              The ID of the Circle credential to use for this
                              wallet. You can find this in the{" "}
                              <Link
                                className="text-link-foreground hover:text-foreground"
                                href={`/team/${teamSlug}/${projectSlug}/engine/dedicated/${instance.id}/wallet-credentials`}
                              >
                                Wallet Credentials
                              </Link>{" "}
                              section.
                            </FormDescription>
                          </FormFieldSetup>

                          <FormFieldSetup
                            errorMessage={
                              form.getFieldState("isTestnet", form.formState)
                                .error?.message
                            }
                            htmlFor={isTestnetId}
                            isRequired={false}
                            key="isTestnet"
                            label="Testnet"
                            tooltip={null}
                          >
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  checked={form.watch("isTestnet")}
                                  id={isTestnetId}
                                  onCheckedChange={(checked) =>
                                    form.setValue("isTestnet", !!checked)
                                  }
                                />
                                <label
                                  className="text-sm leading-none opacity-70 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  htmlFor="is-testnet"
                                >
                                  Use testnet mode for creating backend wallet
                                </label>
                              </div>
                              <FormDescription className="py-2">
                                If your engine is configured with a testnet API
                                Key for Circle, you can only create testnet
                                wallets. A production API Key cannot be used for
                                testnet transactions, and vice versa.{" "}
                                <Link
                                  className="text-link-foreground hover:text-foreground"
                                  href="https://developers.circle.com/w3s/sandbox-vs-production"
                                  rel="noopener noreferrer"
                                  target="_blank"
                                >
                                  Learn more
                                </Link>
                              </FormDescription>
                            </div>
                          </FormFieldSetup>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>

              <DialogFooter className="mt-4 gap-4 border-border border-t bg-card p-6 lg:gap-2 ">
                <Button onClick={() => setIsOpen(false)} variant="outline">
                  Cancel
                </Button>
                <Button
                  className="min-w-28 gap-2"
                  disabled={
                    !form.formState.isValid ||
                    isNotConfigured ||
                    createWallet.isPending
                  }
                  type="submit"
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
