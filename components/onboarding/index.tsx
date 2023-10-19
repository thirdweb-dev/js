import { Account, useAccount } from "@3rdweb-sdk/react/hooks/useApi";
import { useEffect, useState } from "react";
import { OnboardingModal } from "./Modal";
import { OnboardingGeneral } from "./General";
import { OnboardingConfirmEmail } from "./ConfirmEmail";
import { useRouter } from "next/router";
import { OnboardingBilling } from "./Billing";
import { useTrack } from "hooks/analytics/useTrack";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";

export const Onboarding: React.FC = () => {
  const meQuery = useAccount();
  const router = useRouter();
  const { isLoggedIn } = useLoggedInUser();
  const trackEvent = useTrack();

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
        currentStep: "onboarding",
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
          nextStep: "confirming",
        },
      });
    } else if (state === "confirming") {
      const newState = ["validPayment", "paymentVerification"].includes(
        account.status,
      )
        ? "skipped"
        : "billing";
      setState(newState);

      trackEvent({
        ...tracking,
        data: {
          ...tracking.data,
          nextStep: newState,
        },
      });
    } else if (state === "billing") {
      setState("skipped");

      trackEvent({
        ...tracking,
        data: {
          ...tracking.data,
          nextStep: "skipped",
        },
      });
    }
  };

  useEffect(() => {
    if (!isLoggedIn || !account || state) {
      return;
    }

    // user hasn't confirmed email
    if (!account.emailConfirmedAt) {
      setState("onboarding");
    }
    // user has changed email and needs to confirm
    else if (account.unconfirmedEmail) {
      setState("confirming");
    }
    // user hasn't skipped onboarding, has valid email and no valid payment yet
    else if (
      account.email &&
      !account.onboardSkipped &&
      !["validPayment", "paymentVerification"].includes(account.status)
    ) {
      setState("billing");
    }
  }, [isLoggedIn, account, router, state]);

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
