import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { Button } from "@/components/ui/button";
import { Form, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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

interface KmsAwsConfigProps {
  instance: EngineInstance;
}

export const KmsAwsConfig: React.FC<KmsAwsConfigProps> = ({ instance }) => {
  const { mutate: setAwsKmsConfig } = useEngineSetWalletConfig(instance.url);
  const { data: awsConfig } = useEngineWalletConfig(instance.url);
  const trackEvent = useTrack();
  const { onSuccess, onError } = useTxNotifications(
    "Configuration set successfully.",
    "Failed to set configuration.",
  );

  const defaultValues: SetWalletConfigInput = {
    type: "aws-kms" as const,
    awsAccessKeyId: awsConfig?.awsAccessKeyId ?? "",
    awsSecretAccessKey: "",
    awsRegion: awsConfig?.awsRegion ?? "",
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
    setAwsKmsConfig(data, {
      onSuccess: () => {
        onSuccess();
        trackEvent({
          category: "engine",
          action: "set-wallet-config",
          type: "aws-kms",
          label: "success",
        });
      },
      onError: (error) => {
        onError(error);
        trackEvent({
          category: "engine",
          action: "set-wallet-config",
          type: "aws-kms",
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
          AWS KMS wallets require credentials from your Amazon Web Services
          account with sufficient permissions to manage KMS keys. Wallets are
          stored in KMS keys on your AWS account.
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
            learn more about using AWS KMS wallets
          </TrackedLinkTW>
          .
        </p>

        <div className="grid gap-4 md:grid-cols-3">
          <FormFieldSetup
            label="Access Key"
            errorMessage={
              form.getFieldState("awsAccessKeyId", form.formState).error
                ?.message
            }
            htmlFor="aws-access-key"
            isRequired={false}
            tooltip={null}
          >
            <Input
              id="aws-access-key"
              placeholder="AKIA..."
              autoComplete="off"
              type="text"
              {...form.register("awsAccessKeyId")}
            />
          </FormFieldSetup>

          <FormFieldSetup
            label="Secret Key"
            errorMessage={
              form.getFieldState("awsSecretAccessKey", form.formState).error
                ?.message
            }
            htmlFor="aws-secret-key"
            isRequired={false}
            tooltip={null}
          >
            <Input
              id="aws-secret-key"
              placeholder="UW7A..."
              autoComplete="off"
              type="text"
              {...form.register("awsSecretAccessKey")}
            />
            <FormDescription className="pt-2">
              This will not be shown again.
            </FormDescription>
          </FormFieldSetup>

          <FormFieldSetup
            label="Region"
            errorMessage={
              form.getFieldState("awsRegion", form.formState).error?.message
            }
            htmlFor="aws-region"
            isRequired={false}
            tooltip={null}
          >
            <Input
              id="aws-region"
              placeholder="AKIA..."
              autoComplete="off"
              type="text"
              {...form.register("awsRegion")}
            />
          </FormFieldSetup>
        </div>

        <div className="flex items-center justify-end gap-4">
          <Button disabled={!form.formState.isDirty} type="submit">
            {form.formState.isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
