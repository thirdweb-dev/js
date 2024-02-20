import {
  Account,
  AccountStatus,
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
import { OnboardingChoosePlan } from "./ChoosePlan";
import { OnboardingLinkWallet } from "./LinkWallet";
import { useLocalStorage } from "hooks/useLocalStorage";

const skipBilling = (account: Account) => {
  return (
    [AccountStatus.ValidPayment, AccountStatus.PaymentVerification].includes(
      account.status,
    ) || account.onboardSkipped
  );
};

type OnboardingState =
  | "onboarding"
  | "linking"
  | "confirming"
  | "confirmLinking"
  | "plan"
  | "billing"
  | "skipped"
  | undefined;

export const Onboarding: React.FC = () => {
  const meQuery = useAccount();
  const router = useRouter();
  const { isLoggedIn } = useLoggedInUser();
  const trackEvent = useTrack();
  const wallet = useWallet();
  const ewsConfirmMutation = useConfirmEmbeddedWallet();
  const [claimGrowth] = useLocalStorage("startup-program", false, true);

  const [state, setState] = useState<OnboardingState>();
  const [account, setAccount] = useState<Account>();
  const [updatedEmail, setUpdatedEmail] = useState<string | undefined>();

  const isEmbeddedWallet = wallet?.walletId === walletIds.embeddedWallet;

  const handleSave = (email?: string) => {
    // if account is not ready yet we cannot do anything here
    if (!account) {
      return;
    }

    let nextStep: OnboardingState = undefined;

    switch (state) {
      case "onboarding":
        nextStep = "confirming";
        break;
      case "linking":
        nextStep = "confirmLinking";
        break;
      case "confirming":
        nextStep = skipBilling(account) || claimGrowth ? "skipped" : "plan";
        break;
      case "confirmLinking":
        nextStep = "skipped";
        break;
      case "plan":
        nextStep = "billing";
        break;
      case "billing":
        nextStep = "skipped";
        break;
      default:
      // ignore, already undefined
    }

    trackEvent({
      category: "account",
      action: "onboardingStep",
      label: "next",
      data: {
        email: email || account.unconfirmedEmail || updatedEmail,
        currentStep: state,
        nextStep,
      },
    });

    setState(nextStep);
  };

  const handleDuplicateEmail = (email: string) => {
    // if account is not ready yet we cannot do anything here
    if (!account) {
      return;
    }

    trackEvent({
      category: "account",
      action: "onboardingStep",
      label: "next",
      data: {
        email,
        currentStep: state,
        nextStep: "linking",
      },
    });

    setState("linking");
  };

  const handleEmbeddedWalletConfirmation = () => {
    const ewsJwt = (window as any)[GLOBAL_EWS_AUTH_TOKEN_KEY];

    if (ewsJwt) {
      ewsConfirmMutation.mutate(
        { ewsJwt },
        {
          onSuccess: (data) => {
            if (!skipBilling(data as Account)) {
              setState(claimGrowth ? "skipped" : "plan");
            }
            (window as any)[GLOBAL_EWS_AUTH_TOKEN_KEY] = undefined;
          },
        },
      );
    }
  };

  useEffect(() => {
    if (!isLoggedIn || meQuery.isLoading) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, meQuery]);

  useEffect(() => {
    if (!account || state || !wallet) {
      return;
    }
    // user hasn't confirmed email
    if (!account.emailConfirmedAt && !account.unconfirmedEmail) {
      // if its an embedded wallet, try to auto-confirm it
      if (isEmbeddedWallet) {
        handleEmbeddedWalletConfirmation();
      } else {
        setState("onboarding");
      }
    }
    // user has changed email and needs to confirm
    else if (account.unconfirmedEmail) {
      setState(
        account.emailConfirmationWalletAddress
          ? "confirmLinking"
          : "confirming",
      );
    }
    // skip when going thru claiming trial growth
    else if (claimGrowth) {
      setState("skipped");
    }
    // user hasn't skipped onboarding, has valid email and no valid payment yet
    else if (!skipBilling(account)) {
      setState("plan");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, router, state, wallet]);

  if (!isLoggedIn || !account || state === "skipped" || !state) {
    return null;
  }

  if (state === "billing" && !process.env.NEXT_PUBLIC_STRIPE_KEY) {
    // can't do billing without stripe key
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

  if (state === "billing" && skipBilling(account)) {
    console.error("Billing state is invalid, skipping rendering");
    trackEvent({
      category: "account",
      action: "onboardingStateInvalid",
      label: "billing",
      data: { state, skipBilling },
    });
    return null;
  }

  return (
    <OnboardingModal
      isOpen={!!state}
      onClose={() => setState("skipped")}
      wide={state === "plan"}
    >
      {state === "onboarding" && (
        <OnboardingGeneral
          account={account}
          onSave={(email) => {
            setUpdatedEmail(email);
            handleSave(email);
          }}
          onDuplicate={(email) => {
            setUpdatedEmail(email);
            handleDuplicateEmail(email);
          }}
        />
      )}
      {state === "linking" && (
        <OnboardingLinkWallet
          onSave={handleSave}
          onBack={() => {
            setUpdatedEmail(undefined);
            setState("onboarding");
          }}
          email={updatedEmail as string}
        />
      )}
      {(state === "confirming" || state === "confirmLinking") && (
        <OnboardingConfirmEmail
          linking={state === "confirmLinking"}
          onSave={handleSave}
          onBack={() => setState("onboarding")}
          email={(account.unconfirmedEmail || updatedEmail) as string}
        />
      )}
      {state === "plan" && <OnboardingChoosePlan onSave={handleSave} />}
      {state === "billing" && (
        <OnboardingBilling
          onSave={handleSave}
          onCancel={() => setState("skipped")}
        />
      )}
    </OnboardingModal>
  );
};
