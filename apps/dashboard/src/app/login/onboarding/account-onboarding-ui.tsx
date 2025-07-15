"use client";

import { useState } from "react";
import type { Account } from "@/hooks/useApi";
import { LinkWalletPrompt } from "./LinkWalletPrompt/LinkWalletPrompt";
import { LoginOrSignup } from "./LoginOrSignup/LoginOrSignup";
import { AccountOnboardingLayout } from "./onboarding-layout";
import {
  LinkWalletVerifyEmail,
  SignupVerifyEmail,
} from "./VerifyEmail/VerifyEmail";

type AccountOnboardingScreen =
  | { id: "login-or-signup" }
  | { id: "link-wallet"; email: string; backScreen: AccountOnboardingScreen }
  | {
      id: "signup-verify-email";
      email: string;
      backScreen: AccountOnboardingScreen;
    }
  | {
      id: "link-wallet-verify-email";
      email: string;
      backScreen: AccountOnboardingScreen;
    };

type AccountOnboardingProps = {
  onComplete: (param: { account: Account }) => void;
  accountAddress: string;
  verifyEmail: (params: {
    confirmationToken: string;
  }) => Promise<{ account: Account }>;
  resendEmailConfirmation: () => Promise<void>;
  loginOrSignup: (input: {
    email: string;
    subscribeToUpdates?: true;
    name?: string;
  }) => Promise<void>;
  requestLinkWallet: (email: string) => Promise<void>;
  logout: () => Promise<void>;
};

export function AccountOnboardingUI(props: AccountOnboardingProps) {
  const [screen, setScreen] = useState<AccountOnboardingScreen>({
    id: "login-or-signup",
  });

  return (
    <AccountOnboardingLayout
      currentStep={
        screen.id === "login-or-signup" || screen.id === "link-wallet" ? 1 : 2
      }
      logout={props.logout}
    >
      {screen.id === "login-or-signup" && (
        <LoginOrSignup
          loginOrSignup={props.loginOrSignup}
          onRequestSent={(params) => {
            if (params.isExistingEmail) {
              setScreen({
                backScreen: screen,
                email: params.email,
                id: "link-wallet",
              });
            } else {
              setScreen({
                backScreen: screen,
                email: params.email,
                id: "signup-verify-email",
              });
            }
          }}
        />
      )}

      {screen.id === "link-wallet" && (
        <LinkWalletPrompt
          accountAddress={props.accountAddress}
          email={screen.email}
          onBack={() => setScreen(screen.backScreen)}
          onLinkWalletRequestSent={() => {
            setScreen({
              backScreen: screen,
              email: screen.email,
              id: "link-wallet-verify-email",
            });
          }}
          requestLinkWallet={props.requestLinkWallet}
        />
      )}

      {screen.id === "signup-verify-email" && (
        <SignupVerifyEmail
          accountAddress={props.accountAddress}
          email={screen.email}
          onBack={() => setScreen(screen.backScreen)}
          onEmailConfirmed={props.onComplete}
          resendConfirmationEmail={props.resendEmailConfirmation}
          verifyEmail={props.verifyEmail}
        />
      )}

      {screen.id === "link-wallet-verify-email" && (
        <LinkWalletVerifyEmail
          accountAddress={props.accountAddress}
          email={screen.email}
          onBack={() => setScreen(screen.backScreen)}
          onEmailConfirmed={props.onComplete}
          resendConfirmationEmail={props.resendEmailConfirmation}
          verifyEmail={props.verifyEmail}
        />
      )}
    </AccountOnboardingLayout>
  );
}
