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
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { shortenString } from "utils/usedapp-external";

interface OnboardingConfirmEmailProps {
  email: string;
  linking?: boolean;
  onSave: () => void;
  onBack: () => void;
}

export const OnboardingConfirmEmail: React.FC<OnboardingConfirmEmailProps> = ({
  email,
  linking,
  onSave,
  onBack,
}) => {
  const [token, setToken] = useState("");
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);
  const { onError } = useErrorHandler();
  const trackEvent = useTrack();
  const { user } = useLoggedInUser();

  const { onSuccess: onResendSuccess, onError: onResendError } =
    useTxNotifications(
      !linking
        ? "We've sent you an email confirmation code."
        : "We've sent you a wallet linking confirmation code.",
      !linking
        ? "Couldn't send an email confirmation code. Try later!"
        : "Couldn't send a wallet linking confirmation code. Try later!",
    );

  const form = useForm<EmailConfirmationValidationSchema>({
    resolver: zodResolver(emailConfirmationValidationSchema),
    defaultValues: {
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
    const trackingAction = !linking ? "confirmEmail" : "confirmLinkWallet";

    setSaving(true);

    trackEvent({
      category: "account",
      action: trackingAction,
      label: "attempt",
    });

    mutation.mutate(values, {
      onSuccess: () => {
        if (!linking) {
          onSave();
        } else {
          setCompleted(true);
        }
        setSaving(false);

        trackEvent({
          category: "account",
          action: trackingAction,
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
          action: trackingAction,
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
        heading={
          !linking
            ? "You're almost done! Verify your email."
            : completed
              ? "Wallet linked"
              : "Linking Wallets"
        }
        description={
          !completed ? (
            <>
              We&apos;ve sent a 6 letter confirmation code to{" "}
              <strong>{email}</strong>. Copy the code and paste it below.
            </>
          ) : (
            <>
              We&apos;ve linked{" "}
              <strong>{shortenString(user?.address ?? "")}</strong> wallet to{" "}
              <strong>{email}</strong> thirdweb account.
            </>
          )
        }
      />

      {completed && (
        <Button
          w="full"
          size="lg"
          fontSize="md"
          onClick={onSave}
          colorScheme="blue"
        >
          Continue to Dashboard
        </Button>
      )}

      {!completed && (
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
                  isDisabled={saving}
                  borderColor={
                    form.getFieldState("confirmationToken", form.formState)
                      .error
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
                colorScheme="blue"
                type="submit"
                onClick={handleSubmit}
                isLoading={saving}
                isDisabled={saving}
              >
                Verify
              </Button>
              <Button
                w="full"
                size="lg"
                fontSize="md"
                variant="outline"
                onClick={onBack}
                isDisabled={saving}
              >
                {!linking ? "Update email" : "Use another email"}
              </Button>
              <Button
                size="lg"
                fontSize="sm"
                variant="link"
                onClick={handleResend}
                colorScheme="blue"
                isDisabled={saving}
              >
                <Text color="blue.500">Resend verification code</Text>
              </Button>
            </Flex>
          </Flex>
        </form>
      )}
    </>
  );
};
