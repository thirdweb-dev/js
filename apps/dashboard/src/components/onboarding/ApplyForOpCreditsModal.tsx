import { Badge } from "@/components/ui/badge";
import { type Account, accountPlan } from "@3rdweb-sdk/react/hooks/useApi";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Flex,
  SimpleGrid,
} from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { useLocalStorage } from "hooks/useLocalStorage";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, Card, Heading, Text } from "tw-components";
import type { Team } from "../../@/api/team";
import { getValidTeamPlan } from "../../app/team/components/TeamHeader/getValidTeamPlan";
import { ApplyForOpCreditsForm } from "./ApplyForOpCreditsForm";
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

export const PlanToCreditsRecord: Record<Team["billingPlan"], CreditsRecord> = {
  free: {
    title: "Free",
    upTo: true,
    credits: "$250",
    color: "#3b394b",
  },
  starter: {
    title: "Starter",
    upTo: true,
    credits: "$250",
    color: "#3b394b",
  },
  growth: {
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
  pro: {
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
};

export function ApplyForOpCredits(props: {
  team: Team;
  account: Account;
}) {
  const { account, team } = props;
  const validTeamPlan = getValidTeamPlan(team);
  const hasValidPaymentMethod = validTeamPlan !== "free";

  const [page, setPage] = useState<"eligible" | "form">("eligible");

  const [hasAppliedForOpGrant] = useLocalStorage(
    `appliedForOpGrant-${team.id}`,
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

  const isStarterPlan = validTeamPlan === "starter";
  const isProPlan = validTeamPlan === "pro";
  const creditsRecord = PlanToCreditsRecord[validTeamPlan];

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
              {!hasValidPaymentMethod && (
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
                      <Link
                        className="text-link-foreground hover:text-foreground"
                        href={`/team/${props.team.slug}/~/settings/billing`}
                      >
                        Upgrade to Starter plan to get started
                      </Link>
                      .
                    </AlertDescription>
                  </Flex>
                </Alert>
              )}
              <Button
                colorScheme="primary"
                onClick={() => setPage("form")}
                w="full"
                isDisabled={!hasValidPaymentMethod || hasAppliedForOpGrant}
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
                  columns={{ base: 1, md: isStarterPlan ? 2 : 1 }}
                  gap={4}
                >
                  {isStarterPlan && (
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
          plan={validTeamPlan}
          account={account}
        />
      )}
    </>
  );
}
