import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormControl } from "@/components/ui/form";
import { Form, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
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
  type EngineInstance,
  type ImportBackendWalletInput,
  type WalletConfigResponse,
  useEngineImportBackendWallet,
  useHasEngineFeature,
} from "@3rdweb-sdk/react/hooks/useEngine";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import {
  EngineBackendWalletOptions,
  type EngineBackendWalletType,
} from "lib/engine";
import { CircleAlertIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import invariant from "tiny-invariant";

interface ImportBackendWalletButtonProps {
  instance: EngineInstance;
  walletConfig: WalletConfigResponse;
  teamSlug: string;
  authToken: string;
}

export const ImportBackendWalletButton: React.FC<
  ImportBackendWalletButtonProps
> = ({ instance, walletConfig, teamSlug, authToken }) => {
  const { isSupported: supportsMultipleWalletTypes } = useHasEngineFeature(
    instance.url,
    "HETEROGENEOUS_WALLET_TYPES",
  );
  const { mutate: importBackendWallet, isPending } =
    useEngineImportBackendWallet({
      instanceUrl: instance.url,
      authToken,
    });

  const { onSuccess, onError } = useTxNotifications(
    "Wallet imported successfully.",
    "Failed to import wallet.",
  );
  const trackEvent = useTrack();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [walletType, setWalletType] = useState<EngineBackendWalletType>(
    walletConfig.type,
  );
  const form = useForm<ImportBackendWalletInput>();

  const onSubmit = (raw: ImportBackendWalletInput) => {
    // Submit only relevant fields.
    const data: ImportBackendWalletInput = {
      label: raw.label,
    };
    if (walletType === "local") {
      data.privateKey = raw.privateKey;
    } else if (walletType === "aws-kms") {
      data.awsKmsArn = raw.awsKmsArn;
    } else if (walletType === "gcp-kms") {
      data.gcpKmsKeyId = raw.gcpKmsKeyId;
      data.gcpKmsKeyVersionId = raw.gcpKmsKeyVersionId;
    }

    importBackendWallet(data, {
      onSuccess: () => {
        onSuccess();
        setIsModalOpen(false);
        form.reset();
        trackEvent({
          category: "engine",
          action: "import-backend-wallet",
          label: "success",
          type: walletConfig?.type,
          instance: instance.url,
        });
      },
      onError: (error) => {
        onError(error);
        trackEvent({
          category: "engine",
          action: "import-backend-wallet",
          label: "error",
          type: walletConfig?.type,
          instance: instance.url,
          error,
        });
      },
    });
  };

  const selectedOption = EngineBackendWalletOptions.find(
    (opt) => opt.key === walletType,
  );
  invariant(selectedOption, "Selected a valid backend wallet type.");

  // List all wallet types only if Engine is updated to support it.
  // Disallow importing smart backend wallets.
  const walletTypeOptions = supportsMultipleWalletTypes
    ? EngineBackendWalletOptions.filter(({ key }) => !key.startsWith("smart:"))
    : [selectedOption];

  const isAwsKmsConfigured = !!walletConfig.awsAccessKeyId;
  const isGcpKmsConfigured = !!walletConfig.gcpKmsKeyRingId;

  // Custom validation logic because required fields depend on the wallet type.
  const values = form.getValues();
  const isFormValid =
    (walletType === "local" && values.privateKey) ||
    (walletType === "aws-kms" && values.awsKmsArn) ||
    (walletType === "gcp-kms" &&
      values.gcpKmsKeyId &&
      values.gcpKmsKeyVersionId);

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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="p-6">
                <DialogHeader className="mb-4">
                  <DialogTitle className="font-semibold text-2xl tracking-tight">
                    Import wallet
                  </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-5">
                  {/* Wallet type */}
                  <FormItem>
                    <FormLabel>Wallet Type</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          form.reset();
                          setWalletType(value as EngineBackendWalletType);
                        }}
                        value={walletType}
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
                    </FormControl>
                    <FormMessage />
                  </FormItem>

                  {(walletType === "aws-kms" && !isAwsKmsConfigured) ||
                  (walletType === "gcp-kms" && !isGcpKmsConfigured) ? (
                    <Alert variant="warning">
                      <CircleAlertIcon className="size-5" />
                      <AlertTitle>
                        {selectedOption?.name} is not yet configured
                      </AlertTitle>
                      <AlertDescription>
                        Provide your credentials on the{" "}
                        <Link
                          href={`/team/${teamSlug}/~/engine/${instance.id}/configuration`}
                          className="text-link-foreground hover:text-foreground"
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

                      {/* Local */}
                      {walletType === "local" ? (
                        <FormFieldSetup
                          key="privateKey"
                          htmlFor="privateKey"
                          label="Private key"
                          errorMessage={
                            form.getFieldState("privateKey", form.formState)
                              .error?.message
                          }
                          isRequired
                          tooltip={null}
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
                      ) : walletType === "aws-kms" ? (
                        <FormFieldSetup
                          key="awsKmsArn"
                          label="AWS KMS ARN"
                          errorMessage={
                            form.getFieldState("awsKmsArn", form.formState)
                              .error?.message
                          }
                          htmlFor="awsKmsArn"
                          isRequired
                          tooltip={null}
                        >
                          <Input
                            id="awsKmsArn"
                            placeholder="arn:aws:kms:us-west-2:123456789012:key/2b7d8e0c-..."
                            autoComplete="off"
                            type="text"
                            {...form.register("awsKmsArn", { required: true })}
                          />
                        </FormFieldSetup>
                      ) : walletType === "gcp-kms" ? (
                        <>
                          <FormFieldSetup
                            key="gcpKmsKeyId"
                            htmlFor="gcpKmsKeyId"
                            errorMessage={
                              form.getFieldState("gcpKmsKeyId", form.formState)
                                .error?.message
                            }
                            label="GCP KMS Key ID"
                            isRequired
                            tooltip={null}
                          >
                            <Input
                              id="gcpKmsKeyId"
                              placeholder="projects/my-project/locations/us-central1/keyRings/my-key-ring/cryptoKeys/my-key"
                              autoComplete="off"
                              type="text"
                              {...form.register("gcpKmsKeyId", {
                                required: true,
                              })}
                            />
                          </FormFieldSetup>

                          <FormFieldSetup
                            key="gcpKmsKeyVersionId"
                            label="GCP KMS Version ID"
                            errorMessage={
                              form.getFieldState(
                                "gcpKmsKeyVersionId",
                                form.formState,
                              ).error?.message
                            }
                            htmlFor="gcpKmsKeyVersionId"
                            isRequired
                            tooltip={null}
                          >
                            <Input
                              id="gcpKmsKeyVersionId"
                              placeholder="1"
                              autoComplete="off"
                              type="text"
                              {...form.register("gcpKmsKeyVersionId", {
                                required: true,
                              })}
                            />
                          </FormFieldSetup>
                        </>
                      ) : null}
                    </>
                  )}
                </div>
              </div>

              <DialogFooter className="mt-4 gap-4 border-border border-t bg-card p-6 lg:gap-2 ">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="min-w-28 gap-2"
                  disabled={!isFormValid || isPending}
                >
                  {isPending && <Spinner className="size-4" />}
                  Import
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};
