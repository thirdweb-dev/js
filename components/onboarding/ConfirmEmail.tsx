import { useConfirmEmail } from "@3rdweb-sdk/react/hooks/useApi";
import { Button } from "tw-components";
import OtpInput from "react-otp-input";
import { useState, ClipboardEvent } from "react";
import { Input, Flex } from "@chakra-ui/react";
import { OnboardingTitle } from "./Title";
import { useForm } from "react-hook-form";
import {
  EmailConfirmationValidationSchema,
  emailConfirmationValidationSchema,
} from "components/settings/Account/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useErrorHandler } from "contexts/error-handler";
import { useTrack } from "hooks/analytics/useTrack";

interface OnboardingConfirmEmailProps {
  email: string;
  onSave: () => void;
  onBack: () => void;
}

export const OnboardingConfirmEmail: React.FC<OnboardingConfirmEmailProps> = ({
  email,
  onSave,
  onBack,
}) => {
  const [token, setToken] = useState("");
  const [saving, setSaving] = useState(false);
  const { onError } = useErrorHandler();
  const trackEvent = useTrack();

  const form = useForm<EmailConfirmationValidationSchema>({
    resolver: zodResolver(emailConfirmationValidationSchema),
    values: {
      confirmationToken: "",
    },
  });

  const mutation = useConfirmEmail();

  const handleChange = (value: string) => {
    setToken(value.toUpperCase());
    form.setValue("confirmationToken", value);
  };

  const handleSubmit = form.handleSubmit((values) => {
    setSaving(true);

    trackEvent({
      category: "account",
      action: "confirmEmail",
      label: "attempt",
    });

    mutation.mutate(values, {
      onSuccess: () => {
        onSave();
        setSaving(false);

        trackEvent({
          category: "account",
          action: "confirmEmail",
          label: "success",
        });
      },
      onError: (error: any) => {
        const message =
          "message" in error
            ? error.message
            : "Couldn't verify your email address. Try later!";

        onError(message);
        form.reset();
        setToken("");
        setSaving(false);

        trackEvent({
          category: "account",
          action: "confirmEmail",
          label: "error",
          error: message,
        });
      },
    });
  });

  const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
    const data = e.clipboardData.getData("text");
    if (data?.match(/^[A-Z]{6}$/)) {
      form.setValue("confirmationToken", data);
      handleSubmit();
    }
  };

  return (
    <>
      <OnboardingTitle
        heading="You're almost done! Verify your email."
        description={
          <>
            We&apos;ve sent a 6 letter confirmation code to{" "}
            <strong>{email}</strong>. Copy the code and paste it below.
          </>
        }
      />

      <form onSubmit={handleSubmit}>
        <Flex gap={8} flexDir="column" w="full">
          <OtpInput
            shouldAutoFocus
            value={token}
            onChange={handleChange}
            onPaste={handlePaste}
            skipDefaultStyles
            numInputs={6}
            containerStyle={{
              display: "flex",
              flexDirection: "row",
              gap: "12px",
            }}
            renderInput={(props) => (
              <Input
                {...props}
                w={20}
                h={16}
                rounded="md"
                textAlign="center"
                fontSize="larger"
                borderColor={
                  form.getFieldState("confirmationToken", form.formState).error
                    ? "red.500"
                    : "borderColor"
                }
              />
            )}
          />

          <Flex flexDir="column" gap={3}>
            <Button
              w="full"
              size="lg"
              fontSize="md"
              variant="inverted"
              type="submit"
              onClick={handleSubmit}
              isLoading={saving}
              isDisabled={saving}
            >
              Confirm
            </Button>
            <Button
              w="full"
              size="lg"
              fontSize="md"
              variant="outline"
              onClick={onBack}
              isDisabled={saving}
            >
              Update email
            </Button>
          </Flex>
        </Flex>
      </form>
    </>
  );
};
