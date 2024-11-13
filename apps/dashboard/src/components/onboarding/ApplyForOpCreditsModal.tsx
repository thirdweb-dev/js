import { Badge } from "@/components/ui/badge";
import {
  type AccountPlan,
  accountPlan,
  accountStatus,
  useAccount,
} from "@3rdweb-sdk/react/hooks/useApi";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Flex,
  SimpleGrid,
  useDisclosure,
} from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { useLocalStorage } from "hooks/useLocalStorage";
import { useEffect, useMemo, useState } from "react";
import { Button, Card, Heading, Text } from "tw-components";
import { ApplyForOpCreditsForm } from "./ApplyForOpCreditsForm";
import { LazyOnboardingBilling } from "./LazyOnboardingBilling";
import { OnboardingModal } from "./Modal";
import { PlanCard } from "./PlanCard";

export type CreditsRecord = {
  title: string;
  upTo?: true;
  credits: string;
  color: string;
  features?: string[];
  ctaTitle?: string;
  ctaHref?: string;
};

export const PlanToCreditsRecord: Record<AccountPlan, CreditsRecord> = {
  [accountPlan.free]: {
    title: "Starter",
    upTo: true,
    credits: "$250",
    color: "#3b394b",
  },
  [accountPlan.growth]: {
    title: "Growth",
    upTo: true,
    credits: "$2,500",
    color: "#28622A",
    features: [
      "10k monthly active wallets",
      "User analytics",
      "Custom Auth",
      "Custom Branding",
    ],
    ctaTitle: "Upgrade for $99",
    ctaHref: "/team/~/~/settings/billing",
  },
  [accountPlan.pro]: {
    title: "Pro",
    credits: "$3,000+",
    color: "#282B6F",
    features: [
      "Custom rate limits for APIs & Infra",
      "Enterprise grade SLAs",
      "Dedicated support",
    ],
    ctaTitle: "Contact Us",
    ctaHref: "https://meetings.hubspot.com/sales-thirdweb/thirdweb-pro",
  },
  [accountPlan.enterprise]: {
    title: "Enterprise",
    credits: "Custom",
    color: "#000000",
  },
};

export const ApplyForOpCreditsModal: React.FC = () => {
  const paymentMethodModalState = useDisclosure();
  const [page, setPage] = useState<"eligible" | "form">("eligible");
  const [hasAddedPaymentMethod, setHasAddedPaymentMethod] = useState(false);
  const account = useAccount();
  const [hasAppliedForOpGrant] = useLocalStorage(
    `appliedForOpGrant-${account?.data?.id || ""}`,
    false,
  );
  const trackEvent = useTrack();

  // TODO: find better way to track impressions
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    trackEvent({
      category: "op-sponsorship",
      action: "modal",
      label: "view-modal",
    });
  }, [trackEvent]);

  const hasValidPayment = useMemo(() => {
    return (
      !!(account?.data?.status === accountStatus.validPayment) ||
      hasAddedPaymentMethod
    );
  }, [account?.data?.status, hasAddedPaymentMethod]);

  const isFreePlan = account.data?.plan === accountPlan.free;
  const isProPlan = account.data?.plan === accountPlan.pro;

  const creditsRecord =
    PlanToCreditsRecord[account.data?.plan || accountPlan.free];

  return (
    <>
      {page === "eligible" ? (
        <>
          <Flex flexDir="column" gap={4}>
            <Card position="relative">
              <Box position="absolute">
                <Badge
                  className="rounded-full px-3 font-bold text-white capitalize"
                  style={{
                    backgroundColor: creditsRecord.color,
                  }}
                >
                  {creditsRecord.title}
                </Badge>
              </Box>
              <Flex alignItems="center" gap={2} flexDir="column">
                <Text textAlign="center" color="faded">
                  {creditsRecord.upTo && "Up to"}
                </Text>
                <Heading color="bgBlack" size="title.lg" fontWeight="extrabold">
                  {creditsRecord.credits}
                </Heading>
                <Text letterSpacing="wider" fontWeight="bold" color="faded">
                  GAS CREDITS
                </Text>
              </Flex>
            </Card>
            <Flex gap={4} flexDir="column">
              {!hasValidPayment && (
                <Alert
                  status="info"
                  borderRadius="lg"
                  backgroundColor="backgroundBody"
                  borderLeftColor="blue.500"
                  borderLeftWidth={4}
                  as={Flex}
                  gap={1}
                >
                  <AlertIcon />
                  <Flex flexDir="column">
                    <AlertDescription as={Text}>
                      You need to add a payment method to be able to claim
                      credits. This is to prevent abuse, you will not be
                      charged.{" "}
                      <Text
                        as="span"
                        onClick={() => {
                          paymentMethodModalState.onOpen();
                          trackEvent({
                            category: "op-sponsorship",
                            action: "add-payment-method",
                            label: "open",
                          });
                        }}
                        color="blue.500"
                        cursor="pointer"
                      >
                        Add a payment method
                      </Text>
                      .
                    </AlertDescription>
                  </Flex>
                </Alert>
              )}
              <Button
                colorScheme="primary"
                onClick={() => setPage("form")}
                w="full"
                isDisabled={!hasValidPayment || hasAppliedForOpGrant}
              >
                {hasAppliedForOpGrant ? "Already applied" : "Apply Now"}
              </Button>
            </Flex>
            {!isProPlan && (
              <>
                <Text textAlign="center" fontWeight="bold" letterSpacing="wide">
                  Or upgrade and get access to more credits:
                </Text>
                <SimpleGrid
                  columns={{ base: 1, md: isFreePlan ? 2 : 1 }}
                  gap={4}
                >
                  {isFreePlan && (
                    <PlanCard
                      creditsRecord={PlanToCreditsRecord[accountPlan.growth]}
                    />
                  )}
                  <PlanCard
                    creditsRecord={PlanToCreditsRecord[accountPlan.pro]}
                  />
                </SimpleGrid>
              </>
            )}
          </Flex>
          <Text mt={6} textAlign="center" color="faded">
            We are open to distributing more than the upper limit for each tier
            if you make a strong case about how it will be utilized.
          </Text>
        </>
      ) : (
        <ApplyForOpCreditsForm
          onClose={() => {
            setPage("eligible");
          }}
        />
      )}
      {/* // Add Payment Method Modal */}
      <OnboardingModal isOpen={paymentMethodModalState.isOpen}>
        <LazyOnboardingBilling
          onSave={() => {
            setHasAddedPaymentMethod(true);
            paymentMethodModalState.onClose();
            trackEvent({
              category: "op-sponsorship",
              action: "add-payment-method",
              label: "success",
            });
          }}
          onCancel={() => {
            paymentMethodModalState.onClose();
            trackEvent({
              category: "op-sponsorship",
              action: "add-payment-method",
              label: "cancel",
            });
          }}
        />
      </OnboardingModal>
    </>
  );
};
