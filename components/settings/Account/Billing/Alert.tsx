import {
  AccountStatus,
  useAccount,
  useAccountUsage,
} from "@3rdweb-sdk/react/hooks/useApi";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import {
  Alert,
  AlertIcon,
  AlertDescription,
  AlertTitle,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { useLocalStorage } from "hooks/useLocalStorage";
import React, { useCallback, useMemo } from "react";
import { FiX } from "react-icons/fi";
import { useRouter } from "next/router";

import { Heading, Text, TrackedLinkButton } from "tw-components";

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
  const { isLoggedIn } = useLoggedInUser();
  const usageQuery = useAccountUsage();
  const meQuery = useAccount();
  const router = useRouter();

  const [dismissedAlert, setDismissedAlert] = useLocalStorage<
    DismissedStorage | undefined
  >(`dismissed-billing-alert-${meQuery?.data?.id}`, undefined, {
    [DismissedStorageType.Usage_50]: 0,
    [DismissedStorageType.Usage_100]: 0,
    [DismissedStorageType.RateRpc]: 0,
    [DismissedStorageType.RateStorage]: 0,
  });

  const trackEvent = useTrack();

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
    !isLoggedIn ||
    meQuery.isLoading ||
    !meQuery.data ||
    usageQuery.isLoading ||
    !usageQuery.data ||
    router.pathname.includes("support")
  ) {
    return null;
  }

  const { status, stripePaymentActionUrl } = meQuery.data;

  if (status === "paymentVerification") {
    const message = stripePaymentActionUrl?.startsWith(
      "https://payments.stripe.com/microdeposit",
    )
      ? "To verify your bank account, we've deposited $0.01 and it should arrive within 1-2 working days."
      : "Your card requires further verification.";

    return (
      <BillingTypeAlert
        title="Your payment method is not verified"
        description={message}
        status="warning"
        label="verifyPaymentAlert"
        ctaHref={stripePaymentActionUrl}
        ctaText="Verify your payment method"
      />
    );
  }

  if (status === AccountStatus.InvalidPayment) {
    return (
      <BillingTypeAlert
        title="Your payment method was declined"
        description="You have an overdue invoice. To continue using thirdweb services without interruption, please add your payment method."
        status="error"
      />
    );
  }

  if (
    status !== AccountStatus.ValidPayment &&
    exceededUsage_50 &&
    !exceededUsage_100 &&
    !dismissedForThePeriod(DismissedStorageType.Usage_50)
  ) {
    return (
      <BillingTypeAlert
        title="You are approaching your free monthly credits"
        status="warning"
        onDismiss={() => handleDismiss(DismissedStorageType.Usage_50)}
      />
    );
  }

  if (
    status !== AccountStatus.ValidPayment &&
    exceededUsage_100 &&
    !dismissedForThePeriod(DismissedStorageType.Usage_100)
  ) {
    return (
      <BillingTypeAlert
        title="You have used all of your free monthly credits"
        status="error"
        onDismiss={() => handleDismiss(DismissedStorageType.Usage_100)}
      />
    );
  }

  if (exceededRateRpc && !dismissedForThePeriod(DismissedStorageType.RateRpc)) {
    return (
      <BillingTypeAlert
        title="You have exceeded your RPC rate limit"
        description={`You have exceeded your RPC rate limit (${usageQuery.data.rateLimits.rpc} requests per second). Please add your payment method and upgrade your plan to continue using thirdweb services without interruption. You can upgrade to thirdweb Growth by visiting your Billing settings.`}
        ctaText="Go to Billing"
        status="warning"
        label="exceededRpcLimitAlert"
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
        description={`You have exceeded your Storage Gateway rate limit (${usageQuery.data.rateLimits.storage} requests per second). Please add your payment method and upgrade your plan to continue using thirdweb services without interruption. You can upgrade to thirdweb Growth by visiting your Billing settings.`}
        ctaText="Go to Billing"
        status="warning"
        label="exceededGatewayLimitAlert"
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
  label?: string;
};

const BillingTypeAlert: React.FC<BillingTypeAlertProps> = ({
  status,
  onDismiss,
  title,
  description = "To ensure there are no future interruptions to your services, please add your payment method.",
  ctaText = "Add a payment method",
  ctaHref = "/dashboard/settings/billing",
  label = "addPaymentAlert",
}) => {
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
          <AlertTitle>
            <Heading as="span" size="subtitle.sm">
              {title}.{"  "}
            </Heading>
            <Text as="span">{description}</Text>
          </AlertTitle>
          <AlertDescription my={2}>
            <TrackedLinkButton
              href={ctaHref}
              category="billing"
              label={label}
              fontWeight="medium"
              colorScheme="blue"
              size="sm"
            >
              {ctaText}
            </TrackedLinkButton>
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
