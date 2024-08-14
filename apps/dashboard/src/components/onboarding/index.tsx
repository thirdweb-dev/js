import {
  type Account,
  AccountStatus,
  useAccount,
} from "@3rdweb-sdk/react/hooks/useApi";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { Suspense, lazy, useEffect, useState } from "react";
import { useActiveWallet } from "thirdweb/react";
import { Spinner } from "../../@/components/ui/Spinner/Spinner";
import { useTrack } from "../../hooks/analytics/useTrack";
import { LazyOnboardingBilling } from "./LazyOnboardingBilling";
import { OnboardingModal } from "./Modal";

const OnboardingConfirmEmail = lazy(() => import("./ConfirmEmail"));
const OnboardingLinkWallet = lazy(() => import("./LinkWallet"));
const OnboardingGeneral = lazy(() => import("./General"));
const OnboardingChoosePlan = lazy(() => import("./ChoosePlan"));

function Loading() {
  return (
    <div className="justify-center items-center flex h-[200px]">
      <Spinner className="size-5" />
    </div>
  );
}

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

  const { isLoggedIn } = useLoggedInUser();
  const trackEvent = useTrack();
  const wallet = useActiveWallet();

  const [state, setState] = useState<OnboardingState>();
  const [account, setAccount] = useState<Account>();
  const [updatedEmail, setUpdatedEmail] = useState<string | undefined>();

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
        nextStep =
          skipBilling(account) || account?.trialPeriodEndedAt
            ? "skipped"
            : "plan";
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

  // FIXME: this entire flow needs reworked - re-vist as part of FTUX improvements
  // eslint-disable-next-line no-restricted-syntax
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
    // user has changed email and needs to confirm
    else if (account.unconfirmedEmail) {
      setState(
        account.emailConfirmationWalletAddress
          ? "confirmLinking"
          : "confirming",
      );
    }
    // skip when going thru claiming trial growth
    else if (account?.trialPeriodEndedAt) {
      setState("skipped");
    }
    // user hasn't skipped onboarding, has valid email and no valid payment yet
    else if (!skipBilling(account)) {
      setState("plan");
    }
  }, [account, state, wallet]);

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
        <Suspense fallback={<Loading />}>
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
        </Suspense>
      )}

      {state === "linking" && (
        <Suspense fallback={<Loading />}>
          <OnboardingLinkWallet
            onSave={handleSave}
            onBack={() => {
              setUpdatedEmail(undefined);
              setState("onboarding");
            }}
            email={updatedEmail as string}
          />
        </Suspense>
      )}

      {(state === "confirming" || state === "confirmLinking") && (
        <Suspense fallback={<Loading />}>
          <OnboardingConfirmEmail
            linking={state === "confirmLinking"}
            onSave={handleSave}
            onBack={() => setState("onboarding")}
            email={(account.unconfirmedEmail || updatedEmail) as string}
          />
        </Suspense>
      )}

      {state === "plan" && (
        <Suspense fallback={<Loading />}>
          <OnboardingChoosePlan onSave={handleSave} />
        </Suspense>
      )}

      {state === "billing" && (
        <LazyOnboardingBilling
          onSave={handleSave}
          onCancel={() => setState("skipped")}
        />
      )}
    </OnboardingModal>
  );
};
