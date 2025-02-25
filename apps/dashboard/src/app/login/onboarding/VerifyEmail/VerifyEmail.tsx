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
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type { TrackingParams } from "hooks/analytics/useTrack";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { ArrowLeftIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { TitleAndDescription } from "../Title";
import {
  type EmailConfirmationValidationSchema,
  emailConfirmationValidationSchema,
} from "../validations";

type VerifyEmailProps = {
  email: string;
  onEmailConfirmed: (params: {
    team: Team;
    account: Account;
  }) => void;
  onBack: () => void;
  verifyEmail: (params: {
    confirmationToken: string;
  }) => Promise<{
    team: Team;
    account: Account;
  }>;
  resendConfirmationEmail: () => Promise<void>;
  trackEvent: (params: TrackingParams) => void;
  accountAddress: string;
  title: string;
  trackingAction: string;
};

export function VerifyEmail(props: VerifyEmailProps) {
  const form = useForm<EmailConfirmationValidationSchema>({
    resolver: zodResolver(emailConfirmationValidationSchema),
    values: {
      confirmationToken: "",
    },
  });

  const verifyEmail = useMutation({
    mutationFn: props.verifyEmail,
  });

  const resendConfirmationEmail = useMutation({
    mutationFn: props.resendConfirmationEmail,
  });

  const handleSubmit = form.handleSubmit((values) => {
    props.trackEvent({
      category: "account",
      action: props.trackingAction,
      label: "attempt",
    });

    verifyEmail.mutate(values, {
      onSuccess: (response) => {
        props.onEmailConfirmed(response);
        props.trackEvent({
          category: "account",
          action: props.trackingAction,
          label: "success",
        });
      },
      onError: (error) => {
        console.error(error);
        toast.error("Invalid confirmation code");
        props.trackEvent({
          category: "account",
          action: props.trackingAction,
          label: "error",
          error: error.message,
        });
      },
    });
  });

  function handleResend() {
    form.setValue("confirmationToken", "");
    verifyEmail.reset();

    props.trackEvent({
      category: "account",
      action: "resendEmailConfirmation",
      label: "attempt",
    });

    resendConfirmationEmail.mutate(undefined, {
      onSuccess: () => {
        toast.success("Verification code sent");
        props.trackEvent({
          category: "account",
          action: "resendEmailConfirmation",
          label: "success",
        });
      },
      onError: (error) => {
        toast.error("Failed to send verification code");
        props.trackEvent({
          category: "account",
          action: "resendEmailConfirmation",
          label: "error",
          error,
        });
      },
    });
  }

  return (
    <div>
      <TitleAndDescription
        heading={props.title}
        description={
          <>
            Enter the 6 letter confirmation code sent to{" "}
            <span className="text-medium">{props.email}</span>
          </>
        }
      />

      <div className="h-5" />

      <form onSubmit={handleSubmit}>
        <InputOTP
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
          inputMode="text"
          value={form.watch("confirmationToken")}
          onChange={(otp) => {
            form.setValue("confirmationToken", otp);
          }}
          disabled={verifyEmail.isPending}
        >
          <InputOTPGroup className="w-full bg-card">
            {new Array(6).fill(0).map((_, idx) => (
              <InputOTPSlot
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                key={idx}
                index={idx}
                className={cn("h-12 grow text-xl", {
                  "border-red-500":
                    form.getFieldState("confirmationToken", form.formState)
                      .error || verifyEmail.isError,
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
            disabled={verifyEmail.isPending}
            className="gap-2"
          >
            {verifyEmail.isPending && <Spinner className="size-4" />}
            Verify
          </Button>

          <Button
            onClick={props.onBack}
            variant="outline"
            className="gap-2 bg-card"
          >
            <ArrowLeftIcon className="size-4" />
            Use another email
          </Button>

          <div className="flex justify-center">
            <Button
              variant="link"
              onClick={handleResend}
              disabled={resendConfirmationEmail.isPending}
              className="gap-2 text-link-foreground hover:text-foreground disabled:opacity-100"
            >
              {resendConfirmationEmail.isPending && (
                <Spinner className="size-3" />
              )}
              Resend Verification Code
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export function LinkWalletVerifyEmail(
  props: Omit<VerifyEmailProps, "title" | "trackingAction">,
) {
  return (
    <VerifyEmail
      {...props}
      title="Link Wallet"
      trackingAction="confirmLinkWallet"
    />
  );
}

export function SignupVerifyEmail(
  props: Omit<VerifyEmailProps, "title" | "trackingAction">,
) {
  return (
    <VerifyEmail
      {...props}
      title="Verify Email"
      trackingAction="confirmEmail"
    />
  );
}
