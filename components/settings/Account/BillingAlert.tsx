import { useAccount, useAccountUsage } from "@3rdweb-sdk/react/hooks/useApi";
import {
  Alert,
  AlertIcon,
  AlertDescription,
  AlertTitle,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { useLocalStorage } from "hooks/useLocalStorage";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { FiX } from "react-icons/fi";

import { TrackedLink, Text } from "tw-components";

export const BillingAlert = () => {
  const [dismissedAlertSec, setDismissedAlertSec] = useLocalStorage<
    number | undefined
  >("dismissed-billing-alert", undefined, 0);

  const usageQuery = useAccountUsage();
  const meQuery = useAccount();
  const router = useRouter();

  const exceededUsage_50 = useMemo(() => {
    if (!usageQuery?.data) {
      return false;
    }

    const { usage, limits } = usageQuery.data;
    return (
      usage.embeddedWallets.countWalletAddresses >=
        limits.embeddedWallets / 2 ||
      usage.storage.sumFileSizeBytes >= limits.storage / 2
    );
  }, [usageQuery?.data]);

  const exceededUsage_100 = useMemo(() => {
    if (!usageQuery?.data) {
      return false;
    }

    const { usage, limits } = usageQuery.data;
    return (
      usage.embeddedWallets.countWalletAddresses >= limits.embeddedWallets ||
      usage.storage.sumFileSizeBytes >= limits.storage
    );
  }, [usageQuery?.data]);

  const dismissedForThePeriod = useMemo(() => {
    if (!meQuery?.data) {
      return true;
    }

    if (!dismissedAlertSec) {
      return false;
    }

    const startDate = new Date(meQuery.data.currentBillingPeriodStartsAt);

    return dismissedAlertSec > Math.floor(startDate.getTime());
  }, [meQuery?.data, dismissedAlertSec]);

  if (
    meQuery.isLoading ||
    !meQuery.data ||
    usageQuery.isLoading ||
    !usageQuery.data
  ) {
    return null;
  }

  const { status } = meQuery.data;

  if (status === "validPayment") {
    return null;
  }

  if (!exceededUsage_50 && !exceededUsage_100) {
    return null;
  }

  if (dismissedForThePeriod) {
    return null;
  }

  return (
    <Alert
      status={exceededUsage_100 ? "error" : "warning"}
      borderRadius="md"
      as={Flex}
      alignItems="start"
      justifyContent="space-between"
      mb={12}
      variant="left-accent"
      bg="backgroundCardHighlight"
    >
      <Flex>
        <AlertIcon boxSize={4} mt={1} ml={1} />
        <Flex flexDir="column" gap={1} pl={1}>
          <AlertTitle>
            {exceededUsage_100
              ? "You have used all of your free monthly limits"
              : "You are approaching your free monthly limits"}
          </AlertTitle>
          <AlertDescription>
            <Text size="body.md" as="span" pr={1}>
              To ensure there are no future interruptions to your services,
            </Text>
            {router.pathname.startsWith("/dashboard/settings/billing") ? (
              <Text as="span">add a payment method</Text>
            ) : (
              <TrackedLink
                href="/dashboard/settings/billing"
                category="billing"
                label="rate_limit_exceeded"
                fontWeight="medium"
                color="blue.500"
              >
                <Text as="span" color="blue.500">
                  add a payment method
                </Text>
              </TrackedLink>
            )}
            .
          </AlertDescription>
        </Flex>
      </Flex>

      <IconButton
        size="xs"
        aria-label="Close announcement"
        icon={<FiX />}
        colorScheme="blackAlpha"
        color="white"
        variant="ghost"
        opacity={0.6}
        _hover={{ opacity: 1 }}
        onClick={() => setDismissedAlertSec(Math.floor(Date.now()))}
      />
    </Alert>
  );
};
