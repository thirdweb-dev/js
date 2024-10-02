import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import {
  useConfirmEmail,
  useResendEmailConfirmation,
} from "@3rdweb-sdk/react/hooks/useApi";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { Flex } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type EmailConfirmationValidationSchema,
  emailConfirmationValidationSchema,
} from "components/settings/Account/validations";
import { useErrorHandler } from "contexts/error-handler";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Text } from "tw-components";
import { shortenString } from "utils/usedapp-external";
import { TitleAndDescription } from "./Title";

interface OnboardingConfirmEmailProps {
  email: string;
  linking?: boolean;
  onSave: () => void;
  onBack: () => void;
}

const OnboardingConfirmEmail: React.FC<OnboardingConfirmEmailProps> = ({
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
      // biome-ignore lint/suspicious/noExplicitAny: FIXME
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

  return (
    <>
      <TitleAndDescription
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
            <InputOTP
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
              value={token}
              onChange={handleChange}
              disabled={saving}
            >
              <InputOTPGroup className="w-full">
                {new Array(6).fill(0).map((_, idx) => (
                  <InputOTPSlot
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    key={idx}
                    index={idx}
                    className={cn("h-12 grow text-lg", {
                      "border-red-500": form.getFieldState(
                        "confirmationToken",
                        form.formState,
                      ).error,
                    })}
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>

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

export default OnboardingConfirmEmail;
