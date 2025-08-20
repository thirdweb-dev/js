import { SaveIcon } from "lucide-react";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
import {
  type EngineInstance,
  type SetWalletConfigInput,
  useEngineSetWalletConfig,
} from "@/hooks/useEngine";

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
    <div className="bg-card rounded-lg border mb-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="p-4 lg:p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-1">Credentials</h2>

              <p className="text-muted-foreground text-sm">
                Circle wallets require an API Key from your Circle account with
                sufficient permissions. <br /> Created wallets are stored in
                your AWS account. Configure your Circle API Key to use Circle
                wallets. Learn more about{" "}
                <UnderlineLink
                  href="https://portal.thirdweb.com/engine/features/backend-wallets#circle-wallet"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  how to get an API Key
                </UnderlineLink>
                .
              </p>
            </div>

            <FormFieldSetup
              errorMessage={
                form.getFieldState("circleApiKey", form.formState).error
                  ?.message
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
          </div>

          <div className="flex items-center justify-end gap-4 border-t border-dashed px-4 py-4 lg:px-6">
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
