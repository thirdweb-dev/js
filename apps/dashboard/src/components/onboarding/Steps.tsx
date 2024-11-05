"use client";

import { Button } from "@/components/ui/button";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { CustomConnectWallet } from "@3rdweb-sdk/react/components/connect-wallet";
import {
  accountStatus,
  useAccount,
  useAccountCredits,
  useApiKeys,
} from "@3rdweb-sdk/react/hooks/useApi";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { OPSponsoredChains } from "constants/chains";
import { useTrack } from "hooks/analytics/useTrack";
import { useLocalStorage } from "hooks/useLocalStorage";
import { ExternalLinkIcon } from "lucide-react";
import { useTheme } from "next-themes";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import Link from "next/link";
import { type JSX, useEffect, useMemo } from "react";
import { useActiveWalletChain } from "thirdweb/react";

const Step = {
  keys: "keys",
  docs: "docs",
  optimismCredits: "optimismCredits",
  payment: "payment",
} as const;

type StepId = keyof typeof Step;

type StepData = {
  key: StepId;
  title: string;
  description: string | JSX.Element;
  cta: string;
  learnMore?: string;
  onClick?: () => void;
  href?: string;
  canSkip?: true;
  rightImageLight?: StaticImageData;
  rightImageDark?: StaticImageData;
};

interface OnboardingStepsProps {
  onlyOptimism?: boolean;
}

export const OnboardingSteps: React.FC<OnboardingStepsProps> = ({
  onlyOptimism,
}) => {
  const { isLoggedIn } = useLoggedInUser();
  const meQuery = useAccount();
  const apiKeysQuery = useApiKeys();
  const router = useDashboardRouter();
  const trackEvent = useTrack();
  const { theme } = useTheme();
  const { data: credits } = useAccountCredits();
  const opCredit = credits?.find((crd) => crd.name.startsWith("OP -"));
  const [onboardingPaymentMethod, setOnboardingPaymentMethod] = useLocalStorage(
    `onboardingPaymentMethod-${meQuery?.data?.id}`,
    false,
  );
  const [onboardingKeys, setOnboardingKeys] = useLocalStorage(
    `onboardingKeys-${meQuery?.data?.id}`,
    false,
  );
  const [onboardingDocs, setOnboardingDocs] = useLocalStorage(
    `onboardingDocs-${meQuery?.data?.id}`,
    false,
  );
  const [hasAppliedForOpGrant] = useLocalStorage(
    `appliedForOpGrant-${meQuery?.data?.id}`,
    false,
  );

  const hasValidPayment = useMemo(() => {
    return meQuery?.data?.status === accountStatus.validPayment;
  }, [meQuery?.data?.status]);

  const hasApiKeys = useMemo(() => {
    return apiKeysQuery?.data && apiKeysQuery?.data?.length > 0;
  }, [apiKeysQuery?.data]);

  const chainId = useActiveWalletChain()?.id;

  const isSponsoredChain = useMemo(() => {
    if (chainId) {
      return OPSponsoredChains.includes(chainId);
    }
  }, [chainId]);

  const currentStep: StepId | null = useMemo(() => {
    if (onlyOptimism && (!hasAppliedForOpGrant || !opCredit)) {
      return Step.optimismCredits;
    }

    if (!isLoggedIn) {
      return null;
    }

    if (isSponsoredChain && (!hasAppliedForOpGrant || !opCredit)) {
      return Step.optimismCredits;
    }
    if (!onboardingKeys && !hasApiKeys) {
      return Step.keys;
    }
    if (!hasValidPayment && !onboardingPaymentMethod) {
      return Step.payment;
    }
    if (!onboardingDocs) {
      return Step.docs;
    }
    return null;
  }, [
    isLoggedIn,
    hasApiKeys,
    hasValidPayment,
    onboardingDocs,
    onboardingKeys,
    onboardingPaymentMethod,
    hasAppliedForOpGrant,
    onlyOptimism,
    isSponsoredChain,
    opCredit,
  ]);

  const handleStep = ({
    isSkip,
    step,
    href,
    onClick,
  }: {
    isSkip?: true;
    step: StepId;
    href?: string;
    onClick?: () => void;
  }) => {
    if (!step) {
      return;
    }

    if (!isSkip && href) {
      if (!href.startsWith("http")) {
        router.push(href);
      } else {
        window.open(href, "_blank");
      }
    }

    if (!isSkip && onClick) {
      onClick();
    }

    if (step === Step.keys) {
      setOnboardingKeys(true);
    }

    if (step === Step.docs) {
      setOnboardingDocs(true);
    }

    if (step === Step.payment) {
      setOnboardingPaymentMethod(true);
    }

    trackEvent({
      category: "onboardingChecklist",
      action: isSkip ? "skipped" : "completed",
      data: { step, href },
    });
  };

  // TODO: find better way to track impressions
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (currentStep) {
      trackEvent({
        category: "onboardingChecklist",
        action: "viewed",
        data: { step: currentStep },
      });
    }
  }, [currentStep, trackEvent]);

  const STEPS: StepData[] = useMemo(
    () => [
      {
        key: Step.keys,
        title: "Create an API Key",
        description:
          "An API key is required to use thirdweb's services through the SDK and CLI.",
        cta: "Create key",
        href: "/dashboard/settings/api-keys",
        canSkip: true,
      },
      {
        key: Step.payment,
        title: "Add Payment Method",
        description:
          "Add your payment method to ensure no disruption to thirdweb services when you exceed free monthly limits.",
        cta: "Add payment",
        href: "/dashboard/settings/billing",
        canSkip: true,
      },
      {
        key: Step.optimismCredits,
        title: "Apply to join the Optimism Superchain App Accelerator!",
        description: (
          <p>
            Successful applicants will receive gas grants which can be used
            across all supported{" "}
            <Link
              href="https://blog.thirdweb.com/accelerating-the-superchain-with-optimism"
              target="_blank"
              className="text-link-foreground hover:text-foreground"
            >
              Optimism Superchain networks
            </Link>
            . These can be used with our Account Abstraction tools to sponsor
            gas fees for any on-chain activity.
          </p>
        ),
        cta: "Apply now",
        onClick: () => {
          trackEvent({
            category: "onboardingChecklist",
            action: "clicked",
            data: { step: Step.optimismCredits },
          });
        },
        href: "/dashboard/settings/gas-credits",
        learnMore:
          "https://blog.thirdweb.com/accelerating-the-superchain-with-optimism",
        rightImageDark: require("../../../public/assets/dashboard/optimism-credits-dark.png"),
        rightImageLight: require("../../../public/assets/dashboard/optimism-credits-light.png"),
      },
      {
        key: Step.docs,
        title: "Explore Docs",
        description:
          "Read our documentation to learn what you can build with contracts, payments, wallets, and infrastructure.",
        cta: "Read docs",
        href: "https://portal.thirdweb.com",
        canSkip: true,
      },
    ],
    [trackEvent],
  );

  if (!currentStep) {
    return null;
  }

  const {
    title,
    description,
    cta,
    href,
    learnMore,
    onClick,
    canSkip,
    rightImageDark,
    rightImageLight,
  } = STEPS.find((s) => s.key === currentStep) as StepData;

  return (
    <div className="flex w-full justify-between gap-8 overflow-hidden rounded-xl border border-border bg-muted/50">
      <div className="flex flex-col p-4 lg:p-6">
        <h4 className="mb-1.5 font-semibold text-xl tracking-tight">{title}</h4>
        <p className="text-muted-foreground">{description}</p>
        <div className="h-6" />

        <div className="mt-auto flex flex-row items-center gap-3">
          {isLoggedIn ? (
            <Button
              onClick={() => handleStep({ step: currentStep, href, onClick })}
            >
              {cta}
            </Button>
          ) : (
            <CustomConnectWallet />
          )}

          {learnMore && (
            <Button variant="outline" asChild>
              <Link
                target="_blank"
                href={learnMore}
                className="gap-2 bg-background"
              >
                Learn more
                <ExternalLinkIcon className="size-3" />
              </Link>
            </Button>
          )}

          {canSkip && (
            <Button
              variant="outline"
              onClick={() => handleStep({ isSkip: true, step: currentStep })}
            >
              Skip
            </Button>
          )}
        </div>
      </div>

      {rightImageDark && theme === "dark" && (
        <Image
          src={rightImageDark}
          alt=""
          priority
          className="w-1/3 max-sm:hidden"
        />
      )}

      {rightImageLight && theme === "light" && (
        <Image
          src={rightImageLight}
          alt=""
          priority
          className="w-1/3 max-sm:hidden"
        />
      )}
    </div>
  );
};
