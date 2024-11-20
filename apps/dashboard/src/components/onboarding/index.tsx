"use client";

import { type Account, useAccount } from "@3rdweb-sdk/react/hooks/useApi";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import {
  type Dispatch,
  type SetStateAction,
  Suspense,
  lazy,
  useEffect,
  useState,
} from "react";
import { useActiveWallet } from "thirdweb/react";
import { useTrack } from "../../hooks/analytics/useTrack";
import type { OnboardingState } from "./types";

const LazyOnboardingUI = lazy(() => import("./on-boarding-ui.client"));

export const Onboarding: React.FC<{
  // Pass this props to make the modal closable (it will enable backdrop + the "x" icon)
  onOpenChange?: Dispatch<SetStateAction<boolean>>;
}> = ({ onOpenChange }) => {
  const meQuery = useAccount();

  const { isLoggedIn } = useLoggedInUser();
  const trackEvent = useTrack();
  const wallet = useActiveWallet();

  const [state, setState] = useState<OnboardingState>();
  const [account, setAccount] = useState<Account>();

  // FIXME: this entire flow needs reworked - re-vist as part of FTUX improvements
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (!isLoggedIn || meQuery.isPending) {
      return;
    }
    const loadedAccount = meQuery.data;

    if (
      account?.id &&
      loadedAccount?.id !== account?.id &&
      state === "skipped"
    ) {
      setState(undefined);
    }
    setAccount(loadedAccount);
  }, [isLoggedIn, meQuery, account?.id, state]);

  // FIXME: this entire flow needs reworked - re-vist as part of FTUX improvements
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (!account || state || !wallet) {
      return;
    }
    // user hasn't confirmed email
    if (!account.emailConfirmedAt && !account.unconfirmedEmail) {
      // if its an embedded wallet, try to auto-confirm it
      setState("onboarding");
    }
    // user has no confirmed email and they tried confirming an email earlier
    else if (!account.emailConfirmedAt && account.unconfirmedEmail) {
      setState(
        account.emailConfirmationWalletAddress
          ? "confirmLinking"
          : "confirming",
      );
    }
    // skip when going thru claiming trial growth
    else if (account?.onboardSkipped) {
      setState("skipped");
    }
    // user hasn't skipped onboarding, has valid email and no valid payment yet
    else if (!account.onboardSkipped) {
      setState("plan");
    }
  }, [account, state, wallet]);

  if (!isLoggedIn || !account || state === "skipped" || !state) {
    return null;
  }

  // if we somehow get into this state, do not render anything
  if (state === "onboarding" && account.emailConfirmedAt) {
    console.error("Onboarding state is invalid, skipping rendering");
    trackEvent({
      category: "account",
      action: "onboardingStateInvalid",
      label: "onboarding",
      data: { state },
    });
    return null;
  }

  return (
    <Suspense fallback={null}>
      <LazyOnboardingUI
        account={account}
        onOpenChange={onOpenChange}
        setState={setState}
        state={state}
      />
    </Suspense>
  );
};
