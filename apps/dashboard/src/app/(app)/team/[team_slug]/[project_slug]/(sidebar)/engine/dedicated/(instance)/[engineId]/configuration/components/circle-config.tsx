import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
import {
  type EngineInstance,
  type SetWalletConfigInput,
  useEngineSetWalletConfig,
} from "@3rdweb-sdk/react/hooks/useEngine";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface CircleConfigProps {
  instance: EngineInstance;
  authToken: string;
}

export const CircleConfig: React.FC<CircleConfigProps> = ({
  instance,
  authToken,
}) => {
  const { mutate: setCircleConfig, isPending } = useEngineSetWalletConfig({
    instanceUrl: instance.url,
    authToken,
  });

  const defaultValues: SetWalletConfigInput = {
    type: "circle" as const,
    circleApiKey: "",
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
    setCircleConfig(data, {
      onSuccess: () => {
        toast.success("Configuration set successfully");
      },
      onError: (error) => {
        toast.error("Failed to set configuration", {
          description: error.message,
        });
      },
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground">
          Circle wallets require an API Key from your Circle account with
          sufficient permissions. Created wallets are stored in your AWS
          account. Configure your Circle API Key to use Circle wallets. Learn
          more about{" "}
          <TrackedLinkTW
            href="https://portal.thirdweb.com/engine/features/backend-wallets#circle-wallet"
            target="_blank"
            label="learn-more"
            category="engine"
            className="text-link-foreground hover:text-foreground"
          >
            how to get an API Key
          </TrackedLinkTW>
          .
        </p>
      </div>

      <Form {...form}>
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormFieldSetup
            label="Circle API Key"
            errorMessage={
              form.getFieldState("circleApiKey", form.formState).error?.message
            }
            htmlFor="circle-api-key"
            isRequired
            tooltip={null}
          >
            <Input
              id="circle-api-key"
              placeholder="TEST_API_KEY:..."
              autoComplete="off"
              type="password"
              {...form.register("circleApiKey")}
            />
          </FormFieldSetup>

          <div className="flex items-center justify-end gap-4">
            <Button
              type="submit"
              className="min-w-28 gap-2"
              disabled={isPending}
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
