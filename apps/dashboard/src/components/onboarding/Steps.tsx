import { CustomConnectWallet } from "@3rdweb-sdk/react/components/connect-wallet";
import {
  AccountStatus,
  useAccount,
  useAccountCredits,
  useApiKeys,
} from "@3rdweb-sdk/react/hooks/useApi";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { Flex, HStack, VStack, useBreakpointValue } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { useTrack } from "hooks/analytics/useTrack";
import { useLocalStorage } from "hooks/useLocalStorage";
import { useTheme } from "next-themes";
import type { StaticImageData } from "next/image";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import { useActiveWalletChain } from "thirdweb/react";
import { Button, Card, Heading, Link, LinkButton, Text } from "tw-components";
import { OPSponsoredChains } from "../../constants/chains";

enum Step {
  Keys = "keys",
  Docs = "docs",
  OptimismCredits = "optimismCredits",
  Payment = "payment",
}

type StepData = {
  key: Step;
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
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isLoggedIn } = useLoggedInUser();
  const meQuery = useAccount();
  const apiKeysQuery = useApiKeys();
  const router = useRouter();
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
    return meQuery?.data?.status === AccountStatus.ValidPayment;
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

  const currentStep = useMemo(() => {
    if (onlyOptimism && (!hasAppliedForOpGrant || !opCredit)) {
      return Step.OptimismCredits;
    }

    if (!isLoggedIn) {
      return null;
    }

    if (isSponsoredChain && (!hasAppliedForOpGrant || !opCredit)) {
      return Step.OptimismCredits;
    }
    if (!onboardingKeys && !hasApiKeys) {
      return Step.Keys;
    }
    if (!hasValidPayment && !onboardingPaymentMethod) {
      return Step.Payment;
    }
    if (!onboardingDocs) {
      return Step.Docs;
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
    step: Step;
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

    if (step === Step.Keys) {
      setOnboardingKeys(true);
    }

    if (step === Step.Docs) {
      setOnboardingDocs(true);
    }

    if (step === Step.Payment) {
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
        key: Step.Keys,
        title: "Create an API Key",
        description:
          "An API key is required to use thirdweb's services through the SDK and CLI.",
        cta: "Create key",
        href: "/dashboard/settings/api-keys",
        canSkip: true,
      },
      {
        key: Step.Payment,
        title: "Add Payment Method",
        description:
          "Add your payment method to ensure no disruption to thirdweb services when you exceed free monthly limits.",
        cta: "Add payment",
        href: "/dashboard/settings/billing",
        canSkip: true,
      },
      {
        key: Step.OptimismCredits,
        title: "Apply to join the Optimism Superchain App Accelerator!",
        description: (
          <Flex flexDir="column" gap={4}>
            <Text>
              Successful applicants will receive gas grants which can be used
              across all supported{" "}
              <Link
                href="https://blog.thirdweb.com/accelerating-the-superchain-with-optimism"
                isExternal
                color="blue.500"
              >
                Optimism Superchain networks
              </Link>
              . These can be used with our Account Abstraction tools to sponsor
              gas fees for any on-chain activity.
            </Text>
          </Flex>
        ),
        cta: "Apply now",
        onClick: () => {
          trackEvent({
            category: "onboardingChecklist",
            action: "clicked",
            data: { step: Step.OptimismCredits },
          });
        },
        href: "/dashboard/settings/gas-credits",
        learnMore:
          "https://blog.thirdweb.com/accelerating-the-superchain-with-optimism",
        rightImageDark: require("../../../public/assets/dashboard/optimism-credits-dark.png"),
        rightImageLight: require("../../../public/assets/dashboard/optimism-credits-light.png"),
      },
      {
        key: Step.Docs,
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
    <Card
      w="full"
      as={Flex}
      p={0}
      gap={8}
      justifyContent="space-between"
      overflow="hidden"
    >
      <VStack
        gap={2}
        alignItems="flex-start"
        p={6}
        w={rightImageDark && !isMobile ? "60%" : "100%"}
      >
        <Heading size="title.sm">{title}</Heading>
        <Text>{description}</Text>
        <HStack mt={4} alignItems="center">
          {isLoggedIn ? (
            <Button
              size="sm"
              colorScheme="primary"
              onClick={() => handleStep({ step: currentStep, href, onClick })}
            >
              {cta}
            </Button>
          ) : (
            <CustomConnectWallet />
          )}
          {learnMore && (
            <LinkButton isExternal href={learnMore} size="sm" variant="outline">
              Learn more
            </LinkButton>
          )}
          {canSkip && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleStep({ isSkip: true, step: currentStep })}
            >
              Skip
            </Button>
          )}
        </HStack>
      </VStack>
      {rightImageDark && !isMobile && theme === "dark" && (
        <ChakraNextImage src={rightImageDark} alt={""} w="50%" priority />
      )}
      {rightImageLight && !isMobile && theme === "light" && (
        <ChakraNextImage src={rightImageLight} alt={""} w="50%" priority />
      )}
    </Card>
  );
};
