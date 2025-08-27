import { SaveIcon } from "lucide-react";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { Button } from "@/components/ui/button";
import { Form, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/Spinner";
import { Textarea } from "@/components/ui/textarea";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
import {
  type EngineInstance,
  type SetWalletConfigInput,
  useEngineSetWalletConfig,
  useEngineWalletConfig,
  useHasEngineFeature,
} from "@/hooks/useEngine";
import { useTxNotifications } from "@/hooks/useTxNotifications";

interface KmsGcpConfigProps {
  instance: EngineInstance;
  authToken: string;
}

export const KmsGcpConfig: React.FC<KmsGcpConfigProps> = ({
  instance,
  authToken,
}) => {
  const { mutate: setGcpKmsConfig, isPending } = useEngineSetWalletConfig({
    authToken,
    instanceUrl: instance.url,
  });
  const { data: gcpConfig } = useEngineWalletConfig({
    authToken,
    instanceUrl: instance.url,
  });
  const { isSupported: supportsMultipleWalletTypes } = useHasEngineFeature(
    instance.url,
    "HETEROGENEOUS_WALLET_TYPES",
  );

  const { onSuccess, onError } = useTxNotifications(
    "Configuration set successfully.",
    "Failed to set configuration.",
  );

  const defaultValues: SetWalletConfigInput = {
    gcpApplicationCredentialEmail:
      gcpConfig?.gcpApplicationCredentialEmail ?? "",
    gcpApplicationCredentialPrivateKey: "",
    gcpApplicationProjectId: gcpConfig?.gcpApplicationProjectId ?? "",
    gcpKmsKeyRingId: gcpConfig?.gcpKmsKeyRingId ?? "",
    gcpKmsLocationId: gcpConfig?.gcpKmsLocationId ?? "",
    type: "gcp-kms" as const,
  };

  const form = useForm<SetWalletConfigInput>({
    defaultValues,
    resetOptions: {
      keepDirty: true,
      keepDirtyValues: true,
    },
    values: defaultValues,
  });

  const onSubmit = (data: SetWalletConfigInput) => {
    setGcpKmsConfig(data, {
      onError: (error) => {
        onError(error);
        console.error(error);
      },
      onSuccess: () => {
        onSuccess();
      },
    });
  };

  const gcpLocationId = useId();
  const gcpKeyRingId = useId();
  const gcpProjectId = useId();
  const gcpCredentialEmailId = useId();
  const gcpPrivateKeyId = useId();

  return (
    <div className="bg-card rounded-lg border mb-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="p-4 lg:p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-1">Credentials</h2>

              <p className="text-muted-foreground mb-1 text-sm">
                GCP KMS wallets require credentials from your Google Cloud
                Platform account with sufficient permissions to manage KMS keys.{" "}
                <br />
                Wallets are stored in KMS keys on your GCP account.
              </p>
              <p className="text-muted-foreground text-sm">
                For help and more advanced use cases,{" "}
                <UnderlineLink
                  href="https://portal.thirdweb.com/infrastructure/engine/features/backend-wallets"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  learn more about using Google Cloud KMS wallets
                </UnderlineLink>
                .
              </p>
            </div>

            <div className="space-y-4">
              <FormFieldSetup
                errorMessage={
                  form.getFieldState("gcpKmsLocationId", form.formState).error
                    ?.message
                }
                htmlFor={gcpLocationId}
                isRequired
                label="Location ID"
                tooltip={null}
              >
                <Input
                  id={gcpLocationId}
                  placeholder="us-west2"
                  type="text"
                  {...form.register("gcpKmsLocationId")}
                />
              </FormFieldSetup>

              <FormFieldSetup
                errorMessage={
                  form.getFieldState("gcpKmsKeyRingId", form.formState).error
                    ?.message
                }
                htmlFor={gcpKeyRingId}
                isRequired
                label="Key Ring ID"
                tooltip={null}
              >
                <Input
                  autoComplete="off"
                  id={gcpKeyRingId}
                  placeholder="my-key-ring"
                  type="text"
                  {...form.register("gcpKmsKeyRingId")}
                />
              </FormFieldSetup>

              <FormFieldSetup
                errorMessage={
                  form.getFieldState("gcpApplicationProjectId", form.formState)
                    .error?.message
                }
                htmlFor={gcpProjectId}
                isRequired
                label="Project ID"
                tooltip={null}
              >
                <Input
                  autoComplete="off"
                  id={gcpProjectId}
                  placeholder="my-gcp-project-id-123"
                  type="text"
                  {...form.register("gcpApplicationProjectId")}
                />
              </FormFieldSetup>

              <FormFieldSetup
                errorMessage={
                  form.getFieldState(
                    "gcpApplicationCredentialEmail",
                    form.formState,
                  ).error?.message
                }
                htmlFor={gcpCredentialEmailId}
                isRequired
                label="Credential Email"
                tooltip={null}
              >
                <Input
                  autoComplete="off"
                  id={gcpCredentialEmailId}
                  placeholder="service-account@my-gcp-project.iam.gserviceaccount.com"
                  type="text"
                  {...form.register("gcpApplicationCredentialEmail")}
                />
              </FormFieldSetup>

              <FormFieldSetup
                errorMessage={
                  form.getFieldState(
                    "gcpApplicationCredentialPrivateKey",
                    form.formState,
                  ).error?.message
                }
                htmlFor={gcpPrivateKeyId}
                isRequired
                label="Private Key"
                tooltip={null}
              >
                <Textarea
                  autoComplete="off"
                  id={gcpPrivateKeyId}
                  placeholder={
                    "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
                  }
                  {...form.register("gcpApplicationCredentialPrivateKey")}
                />
                <FormDescription className="pt-2">
                  Private key will not be shown again. Please save your private
                  key in a secure location
                </FormDescription>
              </FormFieldSetup>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 border-t border-dashed px-4 py-4 lg:px-6">
            {!supportsMultipleWalletTypes && (
              <p className="text-destructive-text text-sm">
                This will clear other credentials.
              </p>
            )}
            <Button
              className="gap-2"
              disabled={isPending || !form.formState.isDirty}
              size="sm"
              type="submit"
            >
              {isPending ? (
                <Spinner className="size-4" />
              ) : (
                <SaveIcon className="size-4" />
              )}
              Save
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
