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

interface KmsAwsConfigProps {
  instance: EngineInstance;
  authToken: string;
}

export const KmsAwsConfig: React.FC<KmsAwsConfigProps> = ({
  instance,
  authToken,
}) => {
  const { mutate: setAwsKmsConfig, isPending } = useEngineSetWalletConfig({
    authToken,
    instanceUrl: instance.url,
  });
  const { data: awsConfig } = useEngineWalletConfig({
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
    awsAccessKeyId: awsConfig?.awsAccessKeyId ?? "",
    awsRegion: awsConfig?.awsRegion ?? "",
    awsSecretAccessKey: "",
    type: "aws-kms" as const,
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
    setAwsKmsConfig(data, {
      onError: (error) => {
        onError(error);
      },
      onSuccess: () => {
        onSuccess();
      },
    });
  };

  const awsRegionId = useId();
  const awsAccessKeyId = useId();
  const awsSecretKeyId = useId();

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <p className="text-muted-foreground">
          AWS KMS wallets require credentials from your Amazon Web Services
          account with sufficient permissions to manage KMS keys. Wallets are
          stored in KMS keys on your AWS account.
        </p>
        <p className="text-muted-foreground">
          For help and more advanced use cases,{" "}
          <Link
            className="text-link-foreground hover:text-foreground"
            href="https://portal.thirdweb.com/infrastructure/engine/features/backend-wallets"
            rel="noopener noreferrer"
            target="_blank"
          >
            learn more about using AWS KMS wallets
          </Link>
          .
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <FormFieldSetup
            errorMessage={
              form.getFieldState("awsRegion", form.formState).error?.message
            }
            htmlFor="aws-region"
            isRequired
            label="Region"
            tooltip={null}
          >
            <Input
              autoComplete="off"
              id={awsRegionId}
              placeholder="us-west-2"
              type="text"
              {...form.register("awsRegion")}
            />
          </FormFieldSetup>

          <FormFieldSetup
            errorMessage={
              form.getFieldState("awsAccessKeyId", form.formState).error
                ?.message
            }
            htmlFor={awsAccessKeyId}
            isRequired
            label="Access Key"
            tooltip={null}
          >
            <Input
              autoComplete="off"
              id={awsAccessKeyId}
              placeholder="AKIA..."
              type="text"
              {...form.register("awsAccessKeyId")}
            />
          </FormFieldSetup>

          <FormFieldSetup
            errorMessage={
              form.getFieldState("awsSecretAccessKey", form.formState).error
                ?.message
            }
            htmlFor={awsSecretKeyId}
            isRequired
            label="Secret Key"
            tooltip={null}
          >
            <Input
              autoComplete="off"
              id={awsSecretKeyId}
              placeholder="UW7A..."
              type="text"
              {...form.register("awsSecretAccessKey")}
            />
            <FormDescription className="pt-2">
              This will not be shown again.
            </FormDescription>
          </FormFieldSetup>
        </div>

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
