import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import { Form, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
import {
  type EngineInstance,
  type SetWalletConfigInput,
  useEngineSetWalletConfig,
  useEngineWalletConfig,
  useHasEngineFeature,
} from "@3rdweb-sdk/react/hooks/useEngine";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useForm } from "react-hook-form";

interface KmsGcpConfigProps {
  instance: EngineInstance;
  authToken: string;
}

export const KmsGcpConfig: React.FC<KmsGcpConfigProps> = ({
  instance,
  authToken,
}) => {
  const { mutate: setGcpKmsConfig, isPending } = useEngineSetWalletConfig({
    instanceUrl: instance.url,
    authToken,
  });
  const { data: gcpConfig } = useEngineWalletConfig({
    instanceUrl: instance.url,
    authToken,
  });
  const { isSupported: supportsMultipleWalletTypes } = useHasEngineFeature(
    instance.url,
    "HETEROGENEOUS_WALLET_TYPES",
  );
  const trackEvent = useTrack();
  const { onSuccess, onError } = useTxNotifications(
    "Configuration set successfully.",
    "Failed to set configuration.",
  );

  const defaultValues: SetWalletConfigInput = {
    type: "gcp-kms" as const,
    gcpApplicationProjectId: gcpConfig?.gcpApplicationProjectId ?? "",
    gcpKmsLocationId: gcpConfig?.gcpKmsLocationId ?? "",
    gcpKmsKeyRingId: gcpConfig?.gcpKmsKeyRingId ?? "",
    gcpApplicationCredentialEmail:
      gcpConfig?.gcpApplicationCredentialEmail ?? "",
    gcpApplicationCredentialPrivateKey: "",
  };

  const form = useForm<SetWalletConfigInput>({
    defaultValues,
    values: defaultValues,
    resetOptions: {
      keepDirty: true,
      keepDirtyValues: true,
    },
  });

  const onSubmit = (data: SetWalletConfigInput) => {
    setGcpKmsConfig(data, {
      onSuccess: () => {
        onSuccess();
        trackEvent({
          category: "engine",
          action: "set-wallet-config",
          type: "gcp-kms",
          label: "success",
        });
      },
      onError: (error) => {
        onError(error);
        trackEvent({
          category: "engine",
          action: "set-wallet-config",
          type: "gcp-kms",
          label: "error",
          error,
        });
      },
    });
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <p className="text-muted-foreground">
          GCP KMS wallets require credentials from your Google Cloud Platform
          account with sufficient permissions to manage KMS keys. Wallets are
          stored in KMS keys on your GCP account.
        </p>
        <p className="text-muted-foreground">
          For help and more advanced use cases,{" "}
          <TrackedLinkTW
            target="_blank"
            href="https://portal.thirdweb.com/infrastructure/engine/features/backend-wallets"
            label="learn-more"
            category="engine"
            className="text-link-foreground hover:text-foreground"
          >
            learn more about using Google Cloud KMS wallets
          </TrackedLinkTW>
          .
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <FormFieldSetup
            label="Location ID"
            errorMessage={
              form.getFieldState("gcpKmsLocationId", form.formState).error
                ?.message
            }
            htmlFor="gcp-location-id"
            isRequired
            tooltip={null}
          >
            <Input
              id="gcp-location-id"
              placeholder="us-west2"
              type="text"
              {...form.register("gcpKmsLocationId")}
            />
          </FormFieldSetup>

          <FormFieldSetup
            label="Key Ring ID"
            errorMessage={
              form.getFieldState("gcpKmsKeyRingId", form.formState).error
                ?.message
            }
            htmlFor="gcp-key-ring-id"
            isRequired
            tooltip={null}
          >
            <Input
              id="gcp-key-ring-id"
              placeholder="my-key-ring"
              autoComplete="off"
              type="text"
              {...form.register("gcpKmsKeyRingId")}
            />
          </FormFieldSetup>

          <FormFieldSetup
            label="Project ID"
            errorMessage={
              form.getFieldState("gcpApplicationProjectId", form.formState)
                .error?.message
            }
            htmlFor="gcp-project-id"
            isRequired
            tooltip={null}
          >
            <Input
              id="gcp-project-id"
              type="text"
              placeholder="my-gcp-project-id-123"
              autoComplete="off"
              {...form.register("gcpApplicationProjectId")}
            />
          </FormFieldSetup>

          <FormFieldSetup
            label="Credential Email"
            errorMessage={
              form.getFieldState(
                "gcpApplicationCredentialEmail",
                form.formState,
              ).error?.message
            }
            htmlFor="gcp-credential-email"
            isRequired
            tooltip={null}
          >
            <Input
              id="gcp-credential-email"
              type="text"
              placeholder="service-account@my-gcp-project.iam.gserviceaccount.com"
              autoComplete="off"
              {...form.register("gcpApplicationCredentialEmail")}
            />
          </FormFieldSetup>
        </div>

        <FormFieldSetup
          label="Private Key"
          errorMessage={
            form.getFieldState(
              "gcpApplicationCredentialPrivateKey",
              form.formState,
            ).error?.message
          }
          htmlFor="gcp-private-key"
          isRequired
          tooltip={null}
        >
          <Textarea
            id="gcp-private-key"
            placeholder={
              "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
            }
            autoComplete="off"
            {...form.register("gcpApplicationCredentialPrivateKey")}
          />
          <FormDescription className="pt-2">
            This will not be shown again.
          </FormDescription>
        </FormFieldSetup>

        <div className="flex items-center justify-end gap-4">
          {!supportsMultipleWalletTypes && (
            <p className="text-destructive-text text-sm">
              This will clear other credentials.
            </p>
          )}
          <Button type="submit" className="min-w-28 gap-2" disabled={isPending}>
            {isPending && <Spinner className="size-4" />}
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};
