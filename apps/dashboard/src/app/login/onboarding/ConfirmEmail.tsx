"use client";

import type { Team } from "@/api/team";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import {
  type Account,
  useConfirmEmail,
  useResendEmailConfirmation,
} from "@3rdweb-sdk/react/hooks/useApi";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { shortenString } from "utils/usedapp-external";
import { TitleAndDescription } from "./Title";
import {
  type EmailConfirmationValidationSchema,
  emailConfirmationValidationSchema,
} from "./validations";

interface OnboardingConfirmEmailProps {
  email: string;
  linking?: boolean;
  onEmailConfirm: (params: {
    team: Team;
    account: Account;
  }) => void;
  onComplete: () => void;
  onBack: () => void;
}

// TODO - separate out "linking" and "confirmLinking" states into separate components

export const OnboardingConfirmEmail: React.FC<OnboardingConfirmEmailProps> = ({
  email,
  linking,
  onEmailConfirm,
  onBack,
  onComplete,
}) => {
  const [token, setToken] = useState("");
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);
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

  const confirmEmail = useConfirmEmail();
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

    confirmEmail.mutate(values, {
      onSuccess: (response) => {
        if (!linking) {
          onEmailConfirm(response);
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

        toast.error(message);
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
            ? "Verify your email"
            : completed
              ? "Wallet linked"
              : "Linking Wallets"
        }
        description={
          !completed ? (
            <>
              Enter the 6 letter confirmation code sent to{" "}
              <span className="text-medium">{email}</span>
            </>
          ) : (
            <>
              We've linked{" "}
              <span className="font-mono">
                {shortenString(user?.address ?? "")}
              </span>{" "}
              wallet to <span className="font-medium">{email}</span> thirdweb
              account.
            </>
          )
        }
      />

      <div className="h-5" />

      {completed && (
        <Button onClick={onComplete} className="w-full">
          Continue to Dashboard
        </Button>
      )}

      {!completed && (
        <form onSubmit={handleSubmit}>
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

          <div className="h-6" />

          <div className="flex flex-col gap-4">
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={saving}
              className="gap-2"
            >
              {saving && <Spinner className="size-4" />}
              Verify
            </Button>

            <Button onClick={onBack} disabled={saving} variant="outline">
              {!linking ? "Update email" : "Use another email"}
            </Button>

            <Button
              variant="link"
              onClick={handleResend}
              disabled={saving}
              className="text-link-foreground hover:text-foreground"
            >
              Resend Verification Code
            </Button>
          </div>
        </form>
      )}
    </>
  );
};
