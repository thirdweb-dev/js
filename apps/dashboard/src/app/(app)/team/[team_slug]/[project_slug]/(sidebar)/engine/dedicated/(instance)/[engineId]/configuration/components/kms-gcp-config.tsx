import {
  type EngineInstance,
  type SetWalletConfigInput,
  useEngineSetWalletConfig,
  useEngineWalletConfig,
  useHasEngineFeature,
} from "@3rdweb-sdk/react/hooks/useEngine";
import { useTxNotifications } from "hooks/useTxNotifications";
import Link from "next/link";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { Button } from "@/components/ui/button";
import { Form, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Textarea } from "@/components/ui/textarea";

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
          <Link
            className="text-link-foreground hover:text-foreground"
            href="https://portal.thirdweb.com/infrastructure/engine/features/backend-wallets"
            rel="noopener noreferrer"
            target="_blank"
          >
            learn more about using Google Cloud KMS wallets
          </Link>
          .
        </p>

        <div className="grid gap-4 md:grid-cols-2">
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
        </div>

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
            This will not be shown again.
          </FormDescription>
        </FormFieldSetup>

        <div className="flex items-center justify-end gap-4">
          {!supportsMultipleWalletTypes && (
            <p className="text-destructive-text text-sm">
              This will clear other credentials.
            </p>
          )}
          <Button className="min-w-28 gap-2" disabled={isPending} type="submit">
            {isPending && <Spinner className="size-4" />}
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};
