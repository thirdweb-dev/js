"use client";

import {
  resendEmailClient,
  updateAccountClient,
  verifyEmailClient,
} from "@3rdweb-sdk/react/hooks/useApi";
import { useActiveWallet } from "thirdweb/react";
import { useDisconnect } from "thirdweb/react";
import { useTrack } from "../../../hooks/analytics/useTrack";
import { doLogout } from "../auth-actions";
import { AccountOnboardingUI } from "./account-onboarding-ui";

function AccountOnboarding(props: {
  onComplete: () => void;
  onLogout: () => void;
  accountAddress: string;
}) {
  const trackEvent = useTrack();
  const activeWallet = useActiveWallet();
  const { disconnect } = useDisconnect();
  return (
    <AccountOnboardingUI
      onComplete={props.onComplete}
      logout={async () => {
        if (activeWallet) {
          disconnect(activeWallet);
        }
        await doLogout();
        props.onLogout();
      }}
      accountAddress={props.accountAddress}
      loginOrSignup={async (params) => {
        await updateAccountClient(params);
      }}
      verifyEmail={verifyEmailClient}
      resendEmailConfirmation={async () => {
        await resendEmailClient();
      }}
      trackEvent={trackEvent}
      requestLinkWallet={async (email) => {
        await updateAccountClient({
          email,
          linkWallet: true,
        });
      }}
    />
  );
}

export default AccountOnboarding;
