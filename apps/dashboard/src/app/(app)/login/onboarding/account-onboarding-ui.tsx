"use client";

import type { Team } from "@/api/team";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import type { TrackingParams } from "hooks/analytics/useTrack";
import { useState } from "react";
import { LinkWalletPrompt } from "./LinkWalletPrompt/LinkWalletPrompt";
import { LoginOrSignup } from "./LoginOrSignup/LoginOrSignup";
import {
  LinkWalletVerifyEmail,
  SignupVerifyEmail,
} from "./VerifyEmail/VerifyEmail";
import { AccountOnboardingLayout } from "./onboarding-layout";

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
  onComplete: (param: {
    team: Team;
    account: Account;
  }) => void;
  accountAddress: string;
  trackEvent: (params: TrackingParams) => void;
  verifyEmail: (params: {
    confirmationToken: string;
  }) => Promise<{
    team: Team;
    account: Account;
  }>;
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
      logout={props.logout}
      currentStep={
        screen.id === "login-or-signup" || screen.id === "link-wallet" ? 1 : 2
      }
    >
      {screen.id === "login-or-signup" && (
        <LoginOrSignup
          loginOrSignup={props.loginOrSignup}
          trackEvent={props.trackEvent}
          onRequestSent={(params) => {
            if (params.isExistingEmail) {
              setScreen({
                id: "link-wallet",
                email: params.email,
                backScreen: screen,
              });
            } else {
              setScreen({
                id: "signup-verify-email",
                email: params.email,
                backScreen: screen,
              });
            }
          }}
        />
      )}

      {screen.id === "link-wallet" && (
        <LinkWalletPrompt
          accountAddress={props.accountAddress}
          requestLinkWallet={props.requestLinkWallet}
          trackEvent={props.trackEvent}
          onLinkWalletRequestSent={() => {
            setScreen({
              id: "link-wallet-verify-email",
              email: screen.email,
              backScreen: screen,
            });
          }}
          onBack={() => setScreen(screen.backScreen)}
          email={screen.email}
        />
      )}

      {screen.id === "signup-verify-email" && (
        <SignupVerifyEmail
          accountAddress={props.accountAddress}
          verifyEmail={props.verifyEmail}
          resendConfirmationEmail={props.resendEmailConfirmation}
          trackEvent={props.trackEvent}
          onEmailConfirmed={(data) => {
            props.onComplete({
              team: data.team,
              account: data.account,
            });
          }}
          onBack={() => setScreen(screen.backScreen)}
          email={screen.email}
        />
      )}

      {screen.id === "link-wallet-verify-email" && (
        <LinkWalletVerifyEmail
          accountAddress={props.accountAddress}
          verifyEmail={props.verifyEmail}
          resendConfirmationEmail={props.resendEmailConfirmation}
          trackEvent={props.trackEvent}
          onEmailConfirmed={props.onComplete}
          onBack={() => setScreen(screen.backScreen)}
          email={screen.email}
        />
      )}
    </AccountOnboardingLayout>
  );
}
