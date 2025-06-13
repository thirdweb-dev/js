"use client";
import {
  reportAccountEmailVerified,
  reportAccountWalletLinked,
} from "@/analytics/track";
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
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { ArrowLeftIcon, RotateCcwIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  type EmailConfirmationValidationSchema,
  emailConfirmationValidationSchema,
} from "../validations";

type VerifyEmailProps = {
  email: string;
  onEmailConfirmed: (params: { account: Account }) => void;
  onBack: () => void;
  verifyEmail: (params: {
    confirmationToken: string;
  }) => Promise<{ account: Account }>;
  resendConfirmationEmail: () => Promise<void>;
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
    verifyEmail.mutate(values, {
      onSuccess: (response) => {
        props.onEmailConfirmed(response);
        if (props.trackingAction === "confirmEmail") {
          reportAccountEmailVerified({ email: props.email });
        } else if (props.trackingAction === "confirmLinkWallet") {
          reportAccountWalletLinked();
        }
      },
      onError: () => {
        toast.error("Failed to send verification code");
      },
    });
  });

  function handleResend() {
    form.setValue("confirmationToken", "");
    verifyEmail.reset();

    resendConfirmationEmail.mutate(undefined, {
      onSuccess: () => {
        toast.success("Verification code sent");
      },
      onError: () => {
        toast.error("Failed to send verification code");
      },
    });
  }

  return (
    <div className="rounded-lg border bg-card">
      <form onSubmit={handleSubmit}>
        <div className="px-4 py-6 lg:px-6">
          <h3 className="mb-1 font-semibold text-foreground text-xl tracking-tight">
            {props.title}
          </h3>
          <p className="mb-6 text-muted-foreground text-sm">
            Enter the 6 letter confirmation code sent to{" "}
            <span className="text-medium">{props.email}</span>
          </p>

          <div className="md:flex md:justify-start">
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
              <InputOTPGroup className="w-full grow bg-background lg:w-[300px]">
                {new Array(6).fill(0).map((_, idx) => (
                  <InputOTPSlot
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    key={idx}
                    index={idx}
                    className={cn("h-12 grow border-foreground/25 text-lg", {
                      "border-red-500":
                        form.getFieldState("confirmationToken", form.formState)
                          .error || verifyEmail.isError,
                    })}
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
        </div>

        <div className="mt-4 flex flex-col-reverse gap-4 border-t px-4 py-6 lg:flex-row lg:justify-between lg:px-6">
          <Button
            onClick={props.onBack}
            variant="outline"
            className="gap-2 bg-card"
          >
            <ArrowLeftIcon className="size-4 text-muted-foreground" />
            Change Email
          </Button>

          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              className="gap-2 bg-background"
              onClick={handleResend}
              disabled={resendConfirmationEmail.isPending}
            >
              {resendConfirmationEmail.isPending ? (
                <Spinner className="size-4" />
              ) : (
                <RotateCcwIcon className="size-4 text-muted-foreground" />
              )}
              Resend Code
            </Button>

            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={verifyEmail.isPending}
              className="grow gap-2 px-6"
            >
              {verifyEmail.isPending && <Spinner className="size-4" />}
              Verify
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
