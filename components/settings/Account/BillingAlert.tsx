import { useAccount, useAccountUsage } from "@3rdweb-sdk/react/hooks/useApi";
import {
  Alert,
  AlertIcon,
  AlertDescription,
  AlertTitle,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import { useTrack } from "hooks/analytics/useTrack";
import { useLocalStorage } from "hooks/useLocalStorage";
import { useRouter } from "next/router";
import React, { useCallback, useMemo } from "react";
import { FiX } from "react-icons/fi";

import { TrackedLink, Text } from "tw-components";

enum DismissedStorageType {
  Usage_50 = "usage_50",
  Usage_100 = "usage_100",
  RateRpc = "rate_rpc",
  RateStorage = "rate_storage",
}

type DismissedStorage = {
  [T in DismissedStorageType]?: number;
};
export const BillingAlert = () => {
  const trackEvent = useTrack();
  const [dismissedAlert, setDismissedAlert] = useLocalStorage<
    DismissedStorage | undefined
  >("dismissed-billing-alert", undefined, {
    [DismissedStorageType.Usage_50]: 0,
    [DismissedStorageType.Usage_100]: 0,
    [DismissedStorageType.RateRpc]: 0,
    [DismissedStorageType.RateStorage]: 0,
  });

  const address = useAddress();
  const usageQuery = useAccountUsage();
  const meQuery = useAccount();

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

  const exceededRateRpc = useMemo(() => {
    if (!usageQuery?.data) {
      return false;
    }

    return !!usageQuery.data.rateLimitedAt?.rpc;
  }, [usageQuery?.data]);

  const exceededRateStorage = useMemo(() => {
    if (!usageQuery?.data) {
      return false;
    }

    return !!usageQuery.data.rateLimitedAt?.storage;
  }, [usageQuery?.data]);

  const dismissedForThePeriod = useCallback(
    (type: DismissedStorageType) => {
      if (!meQuery?.data) {
        return true;
      }

      if (!dismissedAlert) {
        return false;
      }

      const startDate = new Date(meQuery.data.currentBillingPeriodStartsAt);

      // backwards compatibility when dismissedAlert stored a single number value
      if (typeof dismissedAlert === "number") {
        return dismissedAlert > Math.floor(startDate.getTime());
      }

      return (dismissedAlert?.[type] || 0) > Math.floor(startDate.getTime());
    },
    [meQuery?.data, dismissedAlert],
  );

  const handleDismiss = (type: DismissedStorageType) => {
    setDismissedAlert({
      ...dismissedAlert,
      [type]: Math.floor(Date.now()),
    });

    trackEvent({
      category: "billing",
      action: "dismiss_limit_alert",
      type,
    });
  };

  if (
    !address ||
    meQuery.isLoading ||
    !meQuery.data ||
    usageQuery.isLoading ||
    !usageQuery.data
  ) {
    return null;
  }

  const { status, stripePaymentActionUrl } = meQuery.data;

  if (status === "paymentVerification") {
    const message = !stripePaymentActionUrl?.startsWith(
      "https://payments.stripe.com/microdeposit",
    )
      ? "To verify your bank account, we've deposited $0.01 and it should arrive within 1-2 working days. Once you receive it"
      : "Your card requires further verification. To proceed";

    return (
      <BillingTypeAlert
        title="Your payment method is not verified"
        description={message}
        status="warning"
        ctaText="verify your payment method"
      />
    );
  }

  if (status === "invalidPayment") {
    return (
      <BillingTypeAlert
        title="Your payment method was declined"
        description="You have an overdue invoice. To continue using thirdweb services without interruption, please"
        status="error"
      />
    );
  }

  if (
    status !== "validPayment" &&
    exceededUsage_50 &&
    !dismissedForThePeriod(DismissedStorageType.Usage_50)
  ) {
    return (
      <BillingTypeAlert
        title="You are approaching your free monthly limits"
        status="warning"
        onDismiss={() => handleDismiss(DismissedStorageType.Usage_50)}
      />
    );
  }

  if (
    status !== "validPayment" &&
    exceededUsage_100 &&
    !dismissedForThePeriod(DismissedStorageType.Usage_100)
  ) {
    return (
      <BillingTypeAlert
        title="You have used all of your free monthly limits"
        status="error"
        onDismiss={() => handleDismiss(DismissedStorageType.Usage_100)}
      />
    );
  }

  if (exceededRateRpc && !dismissedForThePeriod(DismissedStorageType.RateRpc)) {
    return (
      <BillingTypeAlert
        title="You have exceeded your RPC rate limit"
        description={`You have exceeded your RPC rate limit at ${usageQuery.data.rateLimits.rpc} requests per second. Please add your payment method and upgrade your plan in the next 3 days to continue using thirdweb services without interruption. You can upgrade to thirdweb Pro by`}
        ctaText="contacting sales team"
        ctaHref="/contact-us"
        status="warning"
        onDismiss={() => handleDismiss(DismissedStorageType.RateRpc)}
      />
    );
  }

  if (
    exceededRateStorage &&
    !dismissedForThePeriod(DismissedStorageType.RateStorage)
  ) {
    return (
      <BillingTypeAlert
        title="You have exceeded your Storage Gateway rate limit"
        description={`You have exceeded your Storage Gateway rate limit at ${usageQuery.data.rateLimits.storage} requests per second. Please add your payment method and upgrade your plan in the next 3 days to continue using thirdweb services without interruption. You can upgrade to thirdweb Pro by`}
        ctaText="contacting sales team"
        ctaHref="/contact-us"
        status="warning"
        onDismiss={() => handleDismiss(DismissedStorageType.RateStorage)}
      />
    );
  }

  return null;
};

type BillingTypeAlertProps = {
  status: "error" | "warning";
  onDismiss?: () => void;
  title: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
};

const BillingTypeAlert: React.FC<BillingTypeAlertProps> = ({
  status,
  onDismiss,
  title,
  description = "To ensure there are no future interruptions to your services",
  ctaText = "add a payment method",
  ctaHref = "/dashboard/settings/billing",
}) => {
  const router = useRouter();

  return (
    <Alert
      status={status}
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
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>
            <Text size="body.md" as="span" pr={1}>
              {description},
            </Text>
            {router.pathname.startsWith(ctaHref) ? (
              <Text as="span">{ctaText}</Text>
            ) : (
              <TrackedLink
                href={ctaHref}
                category="billing"
                label="limit_exceeded"
                fontWeight="medium"
                color="blue.500"
              >
                <Text as="span" color="blue.500">
                  {ctaText}
                </Text>
              </TrackedLink>
            )}
            .
          </AlertDescription>
        </Flex>
      </Flex>

      {onDismiss && (
        <IconButton
          size="xs"
          aria-label="Close announcement"
          icon={<FiX />}
          color="bgBlack"
          variant="ghost"
          opacity={0.6}
          _hover={{ opacity: 1 }}
          onClick={onDismiss}
        />
      )}
    </Alert>
  );
};
