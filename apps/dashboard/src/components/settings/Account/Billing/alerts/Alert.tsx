import {
  AccountStatus,
  useAccount,
  useAccountUsage,
} from "@3rdweb-sdk/react/hooks/useApi";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Flex,
  IconButton,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { OnboardingModal } from "components/onboarding/Modal";
import { format } from "date-fns";
import { useTrack } from "hooks/analytics/useTrack";
import { useLocalStorage } from "hooks/useLocalStorage";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";
import { FiX } from "react-icons/fi";
import { Heading, Text, TrackedLinkButton } from "tw-components";
import { LazyOnboardingBilling } from "../../../../onboarding/LazyOnboardingBilling";
import { ManageBillingButton } from "../ManageButton";
import { RecurringPaymentFailureAlert } from "./RecurringPaymentFailureAlert";

type AlertConditionType = {
  shouldShowAlert: boolean;
  key: string;
  title: string;
  description: string;
  status: "error" | "warning";
  componentType:
    | "serviceCutoff"
    | "recurringPayment"
    | "paymentVerification"
    | "usage";
};

export const BillingAlerts = () => {
  const { isLoggedIn } = useLoggedInUser();
  const usageQuery = useAccountUsage();
  const meQuery = useAccount({
    refetchInterval: (account) =>
      [
        AccountStatus.InvalidPayment,
        AccountStatus.InvalidPaymentMethod,
        AccountStatus.PaymentVerification,
      ].includes(account?.status as AccountStatus)
        ? 1000
        : false,
  });
  const { data: account } = meQuery;
  const router = useRouter();
  const trackEvent = useTrack();

  const [dismissedAlerts, setDismissedAlerts] = useLocalStorage<
    Record<string, number> | undefined
  >(`dismissed-billing-alert-${account?.id}`, undefined, {});

  const handleDismiss = useCallback(
    (key: string) => {
      const currentDismissedAlerts = dismissedAlerts || {};

      const updatedAlerts = {
        ...currentDismissedAlerts,
        [key]: Date.now(),
      };

      setDismissedAlerts(updatedAlerts);

      trackEvent({
        category: "billing",
        action: "dismiss_alert",
        label: key,
      });
    },
    [dismissedAlerts, setDismissedAlerts, trackEvent],
  );

  // Alert shouldShowAlerts based on the possible states of the account
  const alertConditions = useMemo<AlertConditionType[]>(() => {
    const hasUsageData = !!usageQuery.data;
    const { usage, limits, rateLimitedAt } = usageQuery.data || {};

    // Define alert shouldShowAlerts including the directly computed ones
    const paymentFailureAlerts: AlertConditionType[] = [
      {
        shouldShowAlert: account?.status === AccountStatus.PaymentVerification,
        key: "verifyPaymentAlert",
        title: "Your payment method requires verification",
        description:
          "Please verify your payment method to continue using our services without interruption.",
        status: "error",
        componentType: "paymentVerification",
      },
      {
        shouldShowAlert: account?.status === AccountStatus.InvalidPaymentMethod,
        key: "invalidPaymentMethodAlert",
        title: "Your payment method is invalid",
        description:
          "Your current payment method is invalid. Please update your payment method to continue using our services.",
        status: "error",
        componentType: "paymentVerification",
      },
      ...(account?.recurringPaymentFailures?.map((failure) => {
        const serviceCutoffDate = failure.serviceCutoffDate
          ? format(new Date(failure.serviceCutoffDate), "MMMM d, yyyy")
          : null;

        const isPassedCutoff = new Date(failure.serviceCutoffDate) < new Date();
        return {
          shouldShowAlert: true,
          key: failure.paymentFailureCode,
          title: isPassedCutoff
            ? "Some of your services have been cancelled due to outstanding payments"
            : "Your payment method failed",
          description: failure.subscriptionDescription
            ? `${failure.subscriptionDescription} ${serviceCutoffDate ? `(due by ${serviceCutoffDate})` : ""}`
            : "",
          status: "error",
          componentType: isPassedCutoff ? "serviceCutoff" : "recurringPayment",
        } satisfies AlertConditionType;
      }) ?? []),
    ];

    // Directly compute usage and rate limit shouldShowAlerts within useMemo
    const exceededUsage_50 =
      hasUsageData &&
      usage &&
      limits &&
      (usage.embeddedWallets.countWalletAddresses >=
        limits.embeddedWallets / 2 ||
        usage.storage.sumFileSizeBytes >= limits.storage / 2);

    const exceededUsage_100 =
      hasUsageData &&
      usage &&
      limits &&
      (usage.embeddedWallets.countWalletAddresses >= limits.embeddedWallets ||
        usage.storage.sumFileSizeBytes >= limits.storage);

    const hasHardLimits = account?.status !== AccountStatus.ValidPayment;
    const isFreePlan = account?.plan === "free";
    const isGrowthPlan = account?.plan === "growth";
    const usageAlerts: AlertConditionType[] = [
      {
        // Show alert if user has exceeded 50% of their usage limit and has not yet exceeded 100% of their usage limit and has hard limits
        shouldShowAlert:
          !!(exceededUsage_50 && !exceededUsage_100) && hasHardLimits,
        key: "usage_50_alert",
        title: "You are approaching your free monthly credits",
        description:
          "You are approaching your free monthly credits. Consider monitoring your usage to avoid service interruptions.",
        status: "warning",
        componentType: "usage",
      },
      {
        // if the user has exceeded 100% of their usage limit and is has hard limits enforced
        shouldShowAlert: !!exceededUsage_100 && hasHardLimits,
        key: "usage_100_alert",
        title: "You have used all of your free monthly credits",
        description:
          "You have exceeded your free monthly credits limit. Please upgrade your plan to continue using services without interruption.",
        status: "error",
        componentType: "usage",
      },
      {
        // if its NOT a free plan and the user has exceeded 100% of their usage limit
        shouldShowAlert: !!exceededUsage_100 && !hasHardLimits,
        key: "usage_100_alert",
        title: "You have used your included monthly credits",
        // if free or growth plan, included the upgrade plan message
        description: `You have exceeded your included monthly credits limit and are being charged for overages.${isFreePlan || (isGrowthPlan && " Consider upgrading your plan.")}`,
        status: "warning",
        componentType: "usage",
      },
      {
        // only show RPC warning if the user has exceeded their RPC rate limit and has hard limits
        shouldShowAlert: hasUsageData && !!rateLimitedAt?.rpc && hasHardLimits,
        key: "rate_rpc_alert",
        title: "You have exceeded your RPC rate limit",
        description:
          "You have exceeded your RPC rate limit. Please consider upgrading your plan to avoid service interruptions.",
        status: "warning",
        componentType: "usage",
      },
      {
        // only show Storage warning if the user has exceeded their Storage rate limit and has hard limits
        shouldShowAlert:
          hasUsageData && !!rateLimitedAt?.storage && hasHardLimits,
        key: "rate_storage_alert",
        title: "You have exceeded your Storage Gateway rate limit",
        description:
          "You have exceeded your Storage Gateway rate limit. Please consider upgrading your plan to avoid service interruptions.",
        status: "warning",
        componentType: "usage",
      },
    ];

    return [...paymentFailureAlerts, ...usageAlerts];
  }, [account, usageQuery.data]);

  if (
    !isLoggedIn ||
    meQuery.isLoading ||
    !account ||
    usageQuery.isLoading ||
    !usageQuery.data ||
    router.pathname.includes("/support") ||
    alertConditions.length === 0
  ) {
    return null;
  }

  const alerts = alertConditions
    .map((alert, index) => {
      const shouldShowAlert = alert.shouldShowAlert;
      const isDismissed = alert.key in (dismissedAlerts ?? {});
      const isDismissedMoreThanAWeekAgo =
        (dismissedAlerts?.[alert.key] ?? 0) <
        Date.now() - 1000 * 60 * 60 * 24 * 7;
      if (shouldShowAlert && (!isDismissed || isDismissedMoreThanAWeekAgo)) {
        switch (alert.componentType) {
          case "recurringPayment": {
            return (
              <RecurringPaymentFailureAlert
                // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
                key={index}
                affectedServices={[alert.description].filter((v) => v)}
                paymentFailureCode={alert.key}
              />
            );
          }
          case "serviceCutoff": {
            return (
              <RecurringPaymentFailureAlert
                isServiceCutoff={true}
                // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
                key={index}
                affectedServices={[alert.description].filter((v) => v)}
                paymentFailureCode={alert.key}
              />
            );
          }
          case "paymentVerification": {
            return (
              <BillingAlertNotification
                // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
                key={index}
                status={alert.status}
                title={alert.title}
                description={alert.description}
                ctaText="Verify payment method"
                ctaHref="/dashboard/settings/billing"
                label="verifyPaymentAlert"
              />
            );
          }
          case "usage": {
            return (
              <BillingAlertNotification
                // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
                key={index}
                status={alert.status}
                onDismiss={() => handleDismiss(alert.key)}
                title={alert.title}
                description={alert.description}
                ctaText="Upgrade your plan"
                ctaHref="/dashboard/settings/billing"
                label="upgradePlanAlert"
              />
            );
          }
        }
      }
      return null;
    })
    .filter((v) => !!v);

  if (alerts.length === 0) {
    return null;
  }
  return <Stack mb={12}>{alerts}</Stack>;
};

type BillingAlertNotificationProps = {
  status: "error" | "warning";
  onDismiss?: () => void;
  title: string;
  description?: string;
  showCTAs?: boolean;
  ctaText?: string;
  ctaHref?: string;
  label?: string;
};

export const BillingAlertNotification: React.FC<
  BillingAlertNotificationProps
> = ({
  status,
  onDismiss,
  title,
  description = "To ensure there are no future interruptions to your services, please add your payment method.",
  ctaText = "Add a payment method",
  ctaHref = "/dashboard/settings/billing",
  label = "addPaymentAlert",
  showCTAs = true,
}) => {
  // TODO: We should find a way to move this deeper into the
  // TODO: ManageBillingButton component and set an optional field to override
  const [paymentMethodSaving, setPaymentMethodSaving] = useState(false);
  const meQuery = useAccount();
  const { data: account } = meQuery;

  const {
    onOpen: onPaymentMethodOpen,
    onClose: onPaymentMethodClose,
    isOpen: isPaymentMethodOpen,
  } = useDisclosure();

  const handlePaymentAdded = () => {
    setPaymentMethodSaving(true);
    onPaymentMethodClose();
  };

  const isBilling = ctaHref === "/dashboard/settings/billing";

  return (
    <Alert
      status={status}
      borderRadius="md"
      as={Flex}
      alignItems="start"
      justifyContent="space-between"
      variant="left-accent"
      bg="backgroundCardHighlight"
    >
      <>
        <OnboardingModal
          isOpen={isPaymentMethodOpen}
          onClose={onPaymentMethodClose}
        >
          <LazyOnboardingBilling
            onSave={handlePaymentAdded}
            onCancel={onPaymentMethodClose}
          />
        </OnboardingModal>
      </>

      <Flex>
        <AlertIcon boxSize={4} mt={1} ml={1} />
        <Flex flexDir="column" pl={1}>
          <AlertTitle>
            <Heading as="span" size="subtitle.sm">
              {title}
            </Heading>
          </AlertTitle>
          <AlertDescription mb={2} as={Flex} direction="column">
            <Text mb={showCTAs ? "4" : "0"}>{description}</Text>
            {showCTAs && (
              <Flex>
                {isBilling && account ? (
                  <ManageBillingButton
                    account={account}
                    loading={paymentMethodSaving}
                    loadingText="Verifying payment method"
                    buttonProps={{ colorScheme: "primary" }}
                    onClick={onPaymentMethodOpen}
                  />
                ) : (
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
                )}
                <TrackedLinkButton
                  ml="4"
                  variant="outline"
                  href="/support"
                  category="billing"
                  label="support"
                  color="blue.500"
                  fontSize="small"
                  isExternal
                >
                  Contact Support
                </TrackedLinkButton>
              </Flex>
            )}
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
