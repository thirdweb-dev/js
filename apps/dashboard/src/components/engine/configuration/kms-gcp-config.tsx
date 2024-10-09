import { Button } from "@/components/ui/button";
import { Form, FormItem, RequiredFormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
import {
  type EngineInstance,
  type SetWalletConfigInput,
  useEngineSetWalletConfig,
  useEngineWalletConfig,
} from "@3rdweb-sdk/react/hooks/useEngine";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useForm } from "react-hook-form";

interface KmsGcpConfigProps {
  instance: EngineInstance;
}

export const KmsGcpConfig: React.FC<KmsGcpConfigProps> = ({ instance }) => {
  const { mutate: setGcpKmsConfig } = useEngineSetWalletConfig(instance.url);
  const { data: gcpConfig } = useEngineWalletConfig(instance.url);
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
        <p className="text-sm">
          GCP KMS wallets require credentials from your Google Cloud Platform
          account with sufficient permissions to manage KMS keys. Wallets are
          stored in KMS keys on your GCP account.
        </p>
        <p className="text-sm">
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
          <FormItem>
            <RequiredFormLabel>Location ID</RequiredFormLabel>
            <Input
              placeholder="us-west2"
              type="text"
              {...form.register("gcpKmsLocationId", {
                required: true,
              })}
            />
          </FormItem>
          <FormItem>
            <RequiredFormLabel>Key Ring ID</RequiredFormLabel>
            <Input
              placeholder="my-key-ring"
              autoComplete="off"
              type="text"
              {...form.register("gcpKmsKeyRingId", {
                required: true,
              })}
            />
          </FormItem>
          <FormItem>
            <RequiredFormLabel>Project ID</RequiredFormLabel>
            <Input
              placeholder="my-gcp-project-id-123"
              autoComplete="off"
              type="text"
              {...form.register("gcpApplicationProjectId", { required: true })}
            />
          </FormItem>
          <FormItem>
            <RequiredFormLabel>Credential Email</RequiredFormLabel>
            <Input
              placeholder="service-account@my-gcp-project.iam.gserviceaccount.com"
              autoComplete="off"
              type="text"
              {...form.register("gcpApplicationCredentialEmail", {
                required: true,
              })}
            />
          </FormItem>
        </div>

        <FormItem>
          <RequiredFormLabel>Private Key</RequiredFormLabel>
          <Textarea
            placeholder={
              "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
            }
            autoComplete="off"
            {...form.register("gcpApplicationCredentialPrivateKey", {
              required: true,
            })}
          />
        </FormItem>

        <div className="flex items-center justify-end gap-4">
          <Button disabled={!form.formState.isDirty} type="submit">
            {form.formState.isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
