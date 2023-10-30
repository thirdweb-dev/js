import { useAccount, useApiKeys } from "@3rdweb-sdk/react/hooks/useApi";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { HStack, VStack } from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { useLocalStorage } from "hooks/useLocalStorage";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Card, Heading, Text } from "tw-components";

enum Step {
  Keys = "keys",
  Docs = "docs",
  Payment = "payment",
}

const STEPS = [
  {
    key: Step.Keys,
    title: "Create an API Key",
    description:
      "An API key is required to use thirdweb's services through the SDK and CLI.",
    cta: "Create key",
    href: "/dashboard/settings/api-keys",
    external: false,
  },
  {
    key: Step.Payment,
    title: "Add Payment Method",
    description:
      "Add your payment method to ensure no disruption to thirdweb services when you exceed free monthly limits.",
    cta: "Add payment",
    href: "/dashboard/settings/billing",
    external: false,
  },
  {
    key: Step.Docs,
    title: "Explore Docs",
    description:
      "Read our documentation to learn what you can build with contracts, payments, wallets, and infrastructure.",
    cta: "Read docs",
    href: "https://portal.thirdweb.com",
    external: true,
  },
];

type CompletedStep = {
  [T in Step]: boolean;
};

export const OnboardingSteps: React.FC = () => {
  const { isLoggedIn } = useLoggedInUser();
  const meQuery = useAccount();
  const apiKeysQuery = useApiKeys();
  const router = useRouter();
  const trackEvent = useTrack();

  const [completedStep, setCompletedStep] = useLocalStorage<
    CompletedStep | undefined
  >(`onboarding-step-${meQuery?.data?.id}`, undefined, {
    [Step.Keys]: false,
    [Step.Docs]: false,
    [Step.Payment]: false,
  });

  const [currentStep, setCurrentStep] = useState<Step | null>(null);
  const [completedAction, setCompletedAction] = useState(false);

  useEffect(() => {
    if (
      completedAction ||
      !isLoggedIn ||
      meQuery.isLoading ||
      apiKeysQuery.isLoading
    ) {
      return;
    }

    const savedStep = completedStep || {};

    if (!(Step.Keys in savedStep) && apiKeysQuery.data?.length === 0) {
      setCurrentStep(Step.Keys);
    } else if (!(Step.Docs in savedStep)) {
      setCurrentStep(Step.Docs);
    } else if (
      !(Step.Payment in savedStep) &&
      meQuery?.data?.status !== "validPayment"
    ) {
      setCurrentStep(Step.Payment);
    } else {
      setCurrentStep(null);
    }
  }, [isLoggedIn, meQuery, apiKeysQuery, completedStep, completedAction]);

  const handleAction = () => {
    if (!href || !currentStep) {
      return null;
    }

    if (!external) {
      router.push(href);
    } else {
      window.open(href, "_blank");
    }

    if (![Step.Keys, Step.Payment].includes(currentStep)) {
      if (!external) {
        // avoid switching step when navigating
        setCompletedAction(true);
      }
      setCompletedStep({
        ...(completedStep as CompletedStep),
        [currentStep]: true,
      });
    }

    trackEvent({
      category: "onboardingChecklist",
      action: "completed",
      data: {
        step: currentStep,
        href,
      },
    });
  };

  const handleSkip = () => {
    if (!currentStep) {
      return null;
    }

    setCompletedStep({
      ...(completedStep as CompletedStep),
      [currentStep]: true,
    });

    trackEvent({
      category: "onboardingChecklist",
      action: "skipped",
      data: {
        step: currentStep,
      },
    });
  };

  if (!currentStep) {
    return null;
  }

  const { title, description, cta, href, external } =
    STEPS.find((s) => s.key === currentStep) || {};

  return (
    <Card w="full" p={6}>
      <VStack gap={2} alignItems="flex-start">
        <Heading size="title.sm">{title}</Heading>
        <Text>{description}</Text>

        <HStack mt={4} alignItems="center">
          <Button size="sm" colorScheme="primary" onClick={handleAction}>
            {cta}
          </Button>

          <Button variant="ghost" size="sm" onClick={handleSkip}>
            Skip
          </Button>
        </HStack>
      </VStack>
    </Card>
  );
};
