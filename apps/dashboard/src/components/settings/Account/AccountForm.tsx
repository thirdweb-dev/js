import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import { Checkbox, CheckboxWithLabel } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { type Account, useUpdateAccount } from "@3rdweb-sdk/react/hooks/useApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTrack } from "hooks/analytics/useTrack";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  type AccountValidationSchema,
  accountValidationSchema,
} from "./validations";

interface AccountFormProps {
  account: Account;
  horizontal?: boolean;
  showSubscription?: boolean;
  hideName?: boolean;
  buttonText?: string;
  padded?: boolean;
  trackingCategory?: string;
  disableUnchanged?: boolean;
  onSave?: (email: string) => void;
  onDuplicateError?: (email: string) => void;
}

export const AccountForm: React.FC<AccountFormProps> = ({
  account,
  onSave,
  onDuplicateError,
  buttonText = "Save",
  hideName = false,
  showSubscription = false,
  disableUnchanged = false,
}) => {
  const [isSubscribing, setIsSubscribing] = useState(true);
  const trackEvent = useTrack();
  const form = useForm<AccountValidationSchema>({
    resolver: zodResolver(accountValidationSchema),
    defaultValues: {
      name: account.name || "",
      email: account.unconfirmedEmail || account.email || "",
    },
    values: {
      name: account.name || "",
      email: account.unconfirmedEmail || account.email || "",
    },
  });

  const updateMutation = useUpdateAccount();

  const handleSubmit = form.handleSubmit((values) => {
    const formData = {
      ...values,
      ...(showSubscription
        ? {
            subscribeToUpdates: isSubscribing,
          }
        : {}),
    };

    trackEvent({
      category: "account",
      action: "update",
      label: "attempt",
      data: formData,
    });

    updateMutation.mutate(formData, {
      onSuccess: (data) => {
        if (onSave) {
          onSave(values.email);
        }

        trackEvent({
          category: "account",
          action: "update",
          label: "success",
          data,
        });
      },
      onError: (err) => {
        const error = err as Error;

        if (
          onDuplicateError &&
          error?.message.match(/email address already exists/)
        ) {
          onDuplicateError(values.email);
        }
        trackEvent({
          category: "account",
          action: "update",
          label: "error",
          error,
          fromOnboarding: !!onDuplicateError,
        });
      },
    });
  });

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex w-full flex-col items-start gap-8 rounded-xl">
        <div className="flex w-full flex-col gap-4">
          <FormFieldSetup
            isRequired
            htmlFor="email"
            errorMessage={
              form.getFieldState("email", form.formState).error?.message
            }
            label="Email"
          >
            <Input
              placeholder="you@company.com"
              type="email"
              {...form.register("email")}
              id="email"
            />
          </FormFieldSetup>

          {!hideName && (
            <FormFieldSetup
              errorMessage={
                form.getFieldState("name", form.formState).error?.message
              }
              label="Name"
              htmlFor="name"
              isRequired={false}
            >
              <Input
                placeholder="Company Inc."
                type="text"
                {...form.register("name")}
                id="name"
              />
            </FormFieldSetup>
          )}

          {showSubscription && (
            <CheckboxWithLabel>
              <Checkbox
                checked={isSubscribing}
                onCheckedChange={(v) => setIsSubscribing(!!v)}
              />
              Subscribe to new features and key product updates
            </CheckboxWithLabel>
          )}
        </div>

        <Button
          type="button"
          onClick={handleSubmit}
          disabled={
            updateMutation.isPending ||
            (disableUnchanged && !form.formState.isDirty)
          }
          className="w-full gap-2"
        >
          {updateMutation.isPending && <Spinner className="size-4" />}
          {buttonText}
        </Button>
      </div>
    </form>
  );
};
