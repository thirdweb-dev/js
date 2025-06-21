import {
  type EngineInstance,
  type ImportBackendWalletInput,
  useEngineImportBackendWallet,
  useHasEngineFeature,
  type WalletConfigResponse,
} from "@3rdweb-sdk/react/hooks/useEngine";
import { useTxNotifications } from "hooks/useTxNotifications";
import {
  EngineBackendWalletOptions,
  type EngineBackendWalletType,
} from "lib/engine";
import { CircleAlertIcon, CloudDownloadIcon } from "lucide-react";
import Link from "next/link";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import invariant from "tiny-invariant";
import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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

interface ImportBackendWalletButtonProps {
  instance: EngineInstance;
  walletConfig: WalletConfigResponse;
  teamSlug: string;
  projectSlug: string;
  authToken: string;
}

export const ImportBackendWalletButton: React.FC<
  ImportBackendWalletButtonProps
> = ({ instance, walletConfig, teamSlug, projectSlug, authToken }) => {
  const { isSupported: supportsMultipleWalletTypes } = useHasEngineFeature(
    instance.url,
    "HETEROGENEOUS_WALLET_TYPES",
  );
  const { mutate: importBackendWallet, isPending } =
    useEngineImportBackendWallet({
      authToken,
      instanceUrl: instance.url,
    });

  const { onSuccess, onError } = useTxNotifications(
    "Wallet imported successfully.",
    "Failed to import wallet.",
  );

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
      onError: (error) => {
        onError(error);
        console.error(error);
      },
      onSuccess: () => {
        onSuccess();
        setIsModalOpen(false);
        form.reset();
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

  const walletLabelId = useId();
  const privateKeyId = useId();
  const awsKmsArnId = useId();
  const gcpKmsKeyIdId = useId();
  const gcpKmsKeyVersionIdId = useId();

  return (
    <>
      <Button
        className="gap-2"
        onClick={() => setIsModalOpen(true)}
        size="sm"
        variant="outline"
      >
        <CloudDownloadIcon className="size-4" />
        Import
      </Button>

      <Dialog onOpenChange={setIsModalOpen} open={isModalOpen}>
        <DialogContent className="p-0">
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
                        isRequired={false}
                        key="label"
                        label="Label"
                        tooltip={null}
                      >
                        <Input
                          id={walletLabelId}
                          placeholder="A description to identify this backend wallet"
                          type="text"
                          {...form.register("label")}
                        />
                      </FormFieldSetup>

                      {/* Local */}
                      {walletType === "local" ? (
                        <FormFieldSetup
                          errorMessage={
                            form.getFieldState("privateKey", form.formState)
                              .error?.message
                          }
                          htmlFor={privateKeyId}
                          isRequired
                          key="privateKey"
                          label="Private key"
                          tooltip={null}
                        >
                          <Input
                            autoComplete="off"
                            id={privateKeyId}
                            placeholder="Your wallet private key"
                            type="text"
                            {...form.register("privateKey", {
                              required: true,
                              // TODO: add private key validation here
                            })}
                          />
                        </FormFieldSetup>
                      ) : walletType === "aws-kms" ? (
                        <FormFieldSetup
                          errorMessage={
                            form.getFieldState("awsKmsArn", form.formState)
                              .error?.message
                          }
                          htmlFor={awsKmsArnId}
                          isRequired
                          key="awsKmsArn"
                          label="AWS KMS ARN"
                          tooltip={null}
                        >
                          <Input
                            autoComplete="off"
                            id={awsKmsArnId}
                            placeholder="arn:aws:kms:us-west-2:123456789012:key/2b7d8e0c-..."
                            type="text"
                            {...form.register("awsKmsArn", { required: true })}
                          />
                        </FormFieldSetup>
                      ) : walletType === "gcp-kms" ? (
                        <>
                          <FormFieldSetup
                            errorMessage={
                              form.getFieldState("gcpKmsKeyId", form.formState)
                                .error?.message
                            }
                            htmlFor={gcpKmsKeyIdId}
                            isRequired
                            key="gcpKmsKeyId"
                            label="GCP KMS Key ID"
                            tooltip={null}
                          >
                            <Input
                              autoComplete="off"
                              id={gcpKmsKeyIdId}
                              placeholder="projects/my-project/locations/us-central1/keyRings/my-key-ring/cryptoKeys/my-key"
                              type="text"
                              {...form.register("gcpKmsKeyId", {
                                required: true,
                              })}
                            />
                          </FormFieldSetup>

                          <FormFieldSetup
                            errorMessage={
                              form.getFieldState(
                                "gcpKmsKeyVersionId",
                                form.formState,
                              ).error?.message
                            }
                            htmlFor={gcpKmsKeyVersionIdId}
                            isRequired
                            key="gcpKmsKeyVersionId"
                            label="GCP KMS Version ID"
                            tooltip={null}
                          >
                            <Input
                              autoComplete="off"
                              id={gcpKmsKeyVersionIdId}
                              placeholder="1"
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
                <Button onClick={() => setIsModalOpen(false)} variant="outline">
                  Cancel
                </Button>
                <Button
                  className="min-w-28 gap-2"
                  disabled={!isFormValid || isPending}
                  type="submit"
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
