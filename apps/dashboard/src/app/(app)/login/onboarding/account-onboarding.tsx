"use client";

import { useActiveWallet, useDisconnect } from "thirdweb/react";
import {
  resendEmailClient,
  updateAccountClient,
  verifyEmailClient,
} from "@/hooks/useApi";
import { doLogout } from "../auth-actions";
import { AccountOnboardingUI } from "./account-onboarding-ui";

function AccountOnboarding(props: {
  onComplete: () => void;
  onLogout: () => void;
  accountAddress: string;
}) {
  const activeWallet = useActiveWallet();
  const { disconnect } = useDisconnect();
  return (
    <AccountOnboardingUI
      accountAddress={props.accountAddress}
      loginOrSignup={async (params) => {
        await updateAccountClient(params);
      }}
      logout={async () => {
        if (activeWallet) {
          disconnect(activeWallet);
        }
        await doLogout();
        props.onLogout();
      }}
      onComplete={props.onComplete}
      requestLinkWallet={async (email) => {
        await updateAccountClient({
          email,
          linkWallet: true,
        });
      }}
      resendEmailConfirmation={async () => {
        await resendEmailClient();
      }}
      verifyEmail={verifyEmailClient}
    />
  );
}

export default AccountOnboarding;
