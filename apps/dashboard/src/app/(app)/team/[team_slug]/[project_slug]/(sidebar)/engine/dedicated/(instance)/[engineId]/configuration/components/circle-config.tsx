import {
  type EngineInstance,
  type SetWalletConfigInput,
  useEngineSetWalletConfig,
} from "@3rdweb-sdk/react/hooks/useEngine";
import Link from "next/link";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/Spinner/Spinner";

interface CircleConfigProps {
  instance: EngineInstance;
  authToken: string;
}

export const CircleConfig: React.FC<CircleConfigProps> = ({
  instance,
  authToken,
}) => {
  const { mutate: setCircleConfig, isPending } = useEngineSetWalletConfig({
    authToken,
    instanceUrl: instance.url,
  });

  const defaultValues: SetWalletConfigInput = {
    circleApiKey: "",
    type: "circle" as const,
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
    setCircleConfig(data, {
      onError: (error) => {
        toast.error("Failed to set configuration", {
          description: error.message,
        });
        console.error(error);
      },
      onSuccess: () => {
        toast.success("Configuration set successfully");
      },
    });
  };

  const circleApiKeyId = useId();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground">
          Circle wallets require an API Key from your Circle account with
          sufficient permissions. Created wallets are stored in your AWS
          account. Configure your Circle API Key to use Circle wallets. Learn
          more about{" "}
          <Link
            className="text-link-foreground hover:text-foreground"
            href="https://portal.thirdweb.com/engine/features/backend-wallets#circle-wallet"
            rel="noopener noreferrer"
            target="_blank"
          >
            how to get an API Key
          </Link>
          .
        </p>
      </div>

      <Form {...form}>
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormFieldSetup
            errorMessage={
              form.getFieldState("circleApiKey", form.formState).error?.message
            }
            htmlFor={circleApiKeyId}
            isRequired
            label="Circle API Key"
            tooltip={null}
          >
            <Input
              autoComplete="off"
              id={circleApiKeyId}
              placeholder="TEST_API_KEY:..."
              type="password"
              {...form.register("circleApiKey")}
            />
          </FormFieldSetup>

          <div className="flex items-center justify-end gap-4">
            <Button
              className="min-w-28 gap-2"
              disabled={isPending}
              type="submit"
            >
              {isPending && <Spinner className="size-4" />}
              Save
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
