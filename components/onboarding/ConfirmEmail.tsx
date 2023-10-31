import {
  useConfirmEmail,
  useResendEmailConfirmation,
} from "@3rdweb-sdk/react/hooks/useApi";
import { Flex, Input } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EmailConfirmationValidationSchema,
  emailConfirmationValidationSchema,
} from "components/settings/Account/validations";
import { useErrorHandler } from "contexts/error-handler";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { ClipboardEvent, useState } from "react";
import { useForm } from "react-hook-form";
import OtpInput from "react-otp-input";
import { Button, Text } from "tw-components";
import { OnboardingTitle } from "./Title";

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

  const { onSuccess: onResendSuccess, onError: onResendError } =
    useTxNotifications(
      "We've sent you a new email confirmation code.",
      "Couldn't send email confirmation. Try later!",
    );

  const form = useForm<EmailConfirmationValidationSchema>({
    resolver: zodResolver(emailConfirmationValidationSchema),
    values: {
      confirmationToken: "",
    },
  });

  const mutation = useConfirmEmail();
  const resendMutation = useResendEmailConfirmation();

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

  const handleResend = () => {
    setSaving(true);

    trackEvent({
      category: "account",
      action: "resendEmailConfirmation",
      label: "attempt",
    });

    resendMutation.mutate(undefined, {
      onSuccess: () => {
        setSaving(false);
        onResendSuccess();

        trackEvent({
          category: "account",
          action: "resendEmailConfirmation",
          label: "success",
        });
      },
      onError: (error) => {
        onResendError(error);
        form.reset();
        setToken("");
        setSaving(false);

        trackEvent({
          category: "account",
          action: "resendEmailConfirmation",
          label: "error",
          error,
        });
      },
    });
  };

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
          <Flex gap={3} flexDir="column" w="full">
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
                    form.getFieldState("confirmationToken", form.formState)
                      .error
                      ? "red.500"
                      : "borderColor"
                  }
                />
              )}
            />

            <Button
              size="lg"
              fontSize="sm"
              variant="link"
              onClick={handleResend}
              colorScheme="blue"
              isDisabled={saving}
            >
              <Text color="blue.500">Resend code</Text>
            </Button>
          </Flex>

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
