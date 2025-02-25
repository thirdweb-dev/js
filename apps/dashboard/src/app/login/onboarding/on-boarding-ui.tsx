"use client";

import type { RedirectBillingCheckoutAction } from "@/actions/billing";
import type { Team } from "@/api/team";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { useState } from "react";
import type { TrackingParams } from "../../../hooks/analytics/useTrack";
import { OnboardingChoosePlan } from "./ChoosePlan";
import { EmailExists } from "./LinkWalletPrompt/EmailExists";
import { LoginOrSignup } from "./LoginOrSignup/LoginOrSignup";
import { TeamInfoOnboarding, type TeamOnboardingData } from "./TeamOnboarding";
import {
  LinkWalletVerifyEmail,
  SignupVerifyEmail,
} from "./VerifyEmail/VerifyEmail";

type EmailOnboardingScreen =
  | { id: "login-or-signup" }
  | { id: "email-exists"; email: string; backScreen: EmailOnboardingScreen }
  | {
      id: "signup-verify-email";
      email: string;
      backScreen: EmailOnboardingScreen;
    }
  | {
      id: "link-wallet-verify-email";
      email: string;
      backScreen: EmailOnboardingScreen;
    };

type EmailOnboardingProps = {
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
};

function EmailOnboarding(props: EmailOnboardingProps) {
  const [screen, setScreen] = useState<EmailOnboardingScreen>({
    id: "login-or-signup",
  });

  return (
    <div>
      {screen.id === "login-or-signup" && (
        <LoginOrSignup
          loginOrSignup={props.loginOrSignup}
          trackEvent={props.trackEvent}
          onRequestSent={(params) => {
            if (params.isExistingEmail) {
              setScreen({
                id: "email-exists",
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

      {screen.id === "email-exists" && (
        <EmailExists
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
    </div>
  );
}

type OnboardingProps = EmailOnboardingProps & {
  redirectPath: string;
  redirectToCheckout: RedirectBillingCheckoutAction;
  skipOnboarding: () => void;
  shouldSkipEmailOnboarding: boolean;
  sendTeamOnboardingData: (data: TeamOnboardingData) => Promise<void>;
};

type OnboardingScreen =
  | {
      id: "email-onboarding";
    }
  | {
      id: "show-plans";
      team: Team;
      account: Account;
    }
  | {
      id: "get-team-info";
    };

function Onboarding(props: OnboardingProps) {
  const [screen, setScreen] = useState<OnboardingScreen>({
    id: props.shouldSkipEmailOnboarding ? "get-team-info" : "email-onboarding",
  });

  return (
    <div>
      {/* 1.  */}
      {screen.id === "email-onboarding" && (
        <EmailOnboarding
          accountAddress={props.accountAddress}
          trackEvent={props.trackEvent}
          verifyEmail={props.verifyEmail}
          resendEmailConfirmation={props.resendEmailConfirmation}
          loginOrSignup={props.loginOrSignup}
          requestLinkWallet={props.requestLinkWallet}
          onComplete={() => {
            setScreen({
              id: "get-team-info",
            });
          }}
        />
      )}

      {/* 2.  */}
      {screen.id === "get-team-info" && (
        <TeamInfoOnboarding
          sendTeamOnboardingData={props.sendTeamOnboardingData}
          onComplete={(params) => {
            setScreen({
              id: "show-plans",
              team: params.team,
              account: params.account,
            });
          }}
        />
      )}

      {/* 3. */}
      {screen.id === "show-plans" && (
        <OnboardingChoosePlan
          redirectPath={props.redirectPath}
          teamSlug={screen.team.slug}
          skipPlan={async () => {
            props.skipOnboarding();
            props.onComplete({
              team: screen.team,
              account: screen.account,
            });
          }}
          redirectToCheckout={props.redirectToCheckout}
        />
      )}
    </div>
  );
}

export default Onboarding;
