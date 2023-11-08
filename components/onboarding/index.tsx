import {
  Account,
  useAccount,
  useConfirmEmbeddedWallet,
} from "@3rdweb-sdk/react/hooks/useApi";
import { useEffect, useState } from "react";
import { OnboardingModal } from "./Modal";
import { OnboardingGeneral } from "./General";
import { OnboardingConfirmEmail } from "./ConfirmEmail";
import { useRouter } from "next/router";
import { OnboardingBilling } from "./Billing";
import { useTrack } from "hooks/analytics/useTrack";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { useWallet } from "@thirdweb-dev/react";
import { GLOBAL_EWS_AUTH_TOKEN_KEY } from "constants/app";
import { walletIds } from "@thirdweb-dev/wallets";

const skipBilling = (account: Account) => {
  return (
    ["validPayment", "paymentVerification"].includes(account.status) ||
    account.onboardSkipped
  );
};

export const Onboarding: React.FC = () => {
  const meQuery = useAccount();
  const router = useRouter();
  const { isLoggedIn } = useLoggedInUser();
  const trackEvent = useTrack();
  const wallet = useWallet();
  const ewsConfirmMutation = useConfirmEmbeddedWallet();

  const [state, setState] = useState<
    "onboarding" | "confirming" | "billing" | "skipped" | undefined
  >();
  const [updatedEmail, setUpdatedEmail] = useState<string | undefined>();

  const account = meQuery.data as Account;

  const handleSave = (email?: string) => {
    const tracking = {
      category: "account",
      action: "onboardingStep",
      label: "next",
      data: {
        email: account.unconfirmedEmail || email || updatedEmail,
      },
    };

    if (state === "onboarding") {
      if (email) {
        setUpdatedEmail(email);
      }
      setState("confirming");

      trackEvent({
        ...tracking,
        data: {
          ...tracking.data,
          currentStep: "onboarding",
          nextStep: "confirming",
        },
      });
    } else if (state === "confirming") {
      const newState = skipBilling(account) ? "skipped" : "billing";
      setState(newState);

      trackEvent({
        ...tracking,
        data: {
          ...tracking.data,
          currentStep: "confirming",
          nextStep: newState,
        },
      });
    } else if (state === "billing") {
      setState("skipped");

      trackEvent({
        ...tracking,
        data: {
          ...tracking.data,
          currentStep: "billing",
          nextStep: "skipped",
        },
      });
    }
  };

  const handleEmbeddedWalletConfirmation = () => {
    const ewsJwt = (window as any)[GLOBAL_EWS_AUTH_TOKEN_KEY];

    if (ewsJwt) {
      ewsConfirmMutation.mutate(
        { ewsJwt },
        {
          onSuccess: (data) => {
            if (!skipBilling(data as Account)) {
              setState("billing");
            }
            (window as any)[GLOBAL_EWS_AUTH_TOKEN_KEY] = undefined;
          },
        },
      );
    }
  };

  useEffect(() => {
    if (!isLoggedIn || !account || state || !wallet) {
      return;
    }
    // user hasn't confirmed email
    if (!account.emailConfirmedAt && !account.unconfirmedEmail) {
      // if its an embedded wallet, try to auto-confirm it
      if (wallet.walletId === walletIds.embeddedWallet) {
        handleEmbeddedWalletConfirmation();
      } else {
        setState("onboarding");
      }
    }
    // user has changed email and needs to confirm
    else if (account.unconfirmedEmail) {
      setState("confirming");
    }
    // user hasn't skipped onboarding, has valid email and no valid payment yet
    else if (!skipBilling(account)) {
      setState("billing");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, account, router, state, wallet]);

  if (!isLoggedIn || !account || state === "skipped" || !state) {
    return null;
  }
  if (state === "billing" && !process.env.NEXT_PUBLIC_STRIPE_KEY) {
    // can't do billing without stripe key
    return null;
  }

  return (
    <OnboardingModal isOpen={!!state} onClose={() => setState("skipped")}>
      {state === "onboarding" && (
        <OnboardingGeneral account={account} onSave={handleSave} />
      )}
      {state === "confirming" && (
        <OnboardingConfirmEmail
          onSave={handleSave}
          onBack={() => setState("onboarding")}
          email={(account.unconfirmedEmail || updatedEmail) as string}
        />
      )}
      {state === "billing" && (
        <OnboardingBilling
          onSave={handleSave}
          onCancel={() => setState("skipped")}
        />
      )}
    </OnboardingModal>
  );
};
