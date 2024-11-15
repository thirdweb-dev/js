"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { cn } from "@/lib/utils";
import {
  type Account,
  type UsageBillableByService,
  accountStatus,
  useAccount,
  useAccountUsage,
} from "@3rdweb-sdk/react/hooks/useApi";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import * as Sentry from "@sentry/nextjs";
import { format } from "date-fns";
import { useTrack } from "hooks/analytics/useTrack";
import { useLocalStorage } from "hooks/useLocalStorage";
import { ExternalLinkIcon, XIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
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

export const BillingAlerts = (props: {
  className?: string;
}) => {
  const pathname = usePathname();
  const { isLoggedIn } = useLoggedInUser();
  const usageQuery = useAccountUsage();
  const meQuery = useAccount({
    refetchInterval: (account) =>
      account.state.data?.status === accountStatus.invalidPayment ||
      account.state.data?.status === accountStatus.invalidPaymentMethod ||
      account.state.data?.status === accountStatus.paymentVerification
        ? 1000
        : false,
  });

  if (
    !isLoggedIn ||
    !meQuery.data ||
    !usageQuery.data ||
    pathname?.includes("/support")
  ) {
    return null;
  }

  return (
    <BillingAlertsUI
      usageData={usageQuery.data}
      dashboardAccount={meQuery.data}
      className={props.className}
    />
  );
};

export function BillingAlertsUI(props: {
  usageData: UsageBillableByService;
  dashboardAccount: Account;
  className?: string;
}) {
  const { usageData, dashboardAccount } = props;
  const trackEvent = useTrack();

  const [dismissedAlerts, setDismissedAlerts] = useLocalStorage<
    Record<string, number> | undefined
  >(`dismissed-billing-alert-${dashboardAccount.id}`, undefined, {});

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
    const { usage, limits, rateLimitedAt } = usageData;

    // Define alert shouldShowAlerts including the directly computed ones
    const paymentFailureAlerts: AlertConditionType[] = [
      {
        shouldShowAlert:
          dashboardAccount.status === accountStatus.paymentVerification,
        key: "verifyPaymentAlert",
        title: "Your payment method requires verification",
        description:
          "Please verify your payment method to continue using our services without interruption.",
        status: "error",
        componentType: "paymentVerification",
      },
      {
        shouldShowAlert:
          dashboardAccount.status === accountStatus.invalidPaymentMethod,
        key: "invalidPaymentMethodAlert",
        title: "Your payment method is invalid",
        description:
          "Your current payment method is invalid. Please update your payment method to continue using our services.",
        status: "error",
        componentType: "paymentVerification",
      },
      ...(dashboardAccount.recurringPaymentFailures?.map((failure) => {
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
      usage.embeddedWallets.countWalletAddresses >=
        limits.embeddedWallets / 2 ||
      usage.storage.sumFileSizeBytes >= limits.storage / 2;

    const exceededUsage_100 =
      usage.embeddedWallets.countWalletAddresses >= limits.embeddedWallets ||
      usage.storage.sumFileSizeBytes >= limits.storage;

    const hasHardLimits =
      dashboardAccount.status !== accountStatus.validPayment;
    const isFreePlan = dashboardAccount.plan === "free";
    const isGrowthPlan = dashboardAccount.plan === "growth";
    const usageAlerts: AlertConditionType[] = [
      {
        // Show alert if user has exceeded 50% of their usage limit and has not yet exceeded 100% of their usage limit and has hard limits
        shouldShowAlert:
          !!(exceededUsage_50 && !exceededUsage_100) && hasHardLimits,
        key: "usage_50_alert",
        title: "You are nearing your usage limit",
        description:
          "To prevent service interruptions, please add a valid payment method or upgrade your plan.",
        status: "warning",
        componentType: "usage",
      },
      {
        // if the user has exceeded 100% of their usage limit and is has hard limits enforced
        shouldShowAlert: !!exceededUsage_100 && hasHardLimits,
        key: "usage_100_alert",
        title: "You have exceeded your usage limit",
        description:
          "To continue using our services, add a valid payment method or upgrade your plan.",
        status: "error",
        componentType: "usage",
      },
      {
        // if its NOT a free plan and the user has exceeded 100% of their usage limit
        shouldShowAlert: !!exceededUsage_100 && !hasHardLimits,
        key: "usage_100_alert",
        title: "You have exceeded your usage limit",
        // if free or growth plan, included the upgrade plan message
        description: `Overages are now being charged.${isFreePlan || isGrowthPlan ? " Consider upgrading your plan to increase your included limits." : ""}`,
        status: "warning",
        componentType: "usage",
      },
      {
        // only show RPC warning if the user has exceeded their RPC rate limit and has hard limits
        shouldShowAlert: !!rateLimitedAt?.rpc && hasHardLimits,
        key: "rate_rpc_alert",
        title: "You have exceeded your RPC rate limit",
        description:
          "To prevent service interruptions, add a valid payment method or upgrade your plan.",
        status: "warning",
        componentType: "usage",
      },
      {
        // only show Storage warning if the user has exceeded their Storage rate limit and has hard limits
        shouldShowAlert: !!rateLimitedAt?.storage && hasHardLimits,
        key: "rate_storage_alert",
        title: "You have exceeded your Storage Gateway rate limit",
        description:
          "To prevent service interruptions, add a valid payment method or upgrade your plan.",
        status: "warning",
        componentType: "usage",
      },
    ];

    return [...paymentFailureAlerts, ...usageAlerts];
  }, [dashboardAccount, usageData]);

  if (alertConditions.length === 0) {
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
                dashboardAccount={dashboardAccount}
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
                dashboardAccount={dashboardAccount}
              />
            );
          }
          case "paymentVerification": {
            return (
              <AddPaymentNotification
                // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
                key={index}
                status={alert.status}
                title={alert.title}
                description={alert.description}
                ctaText="Verify payment method"
                ctaHref="/team/~/~/settings/billing"
                label="verifyPaymentAlert"
                dashboardAccount={dashboardAccount}
              />
            );
          }
          case "usage": {
            return (
              <AddPaymentNotification
                // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
                key={index}
                status={alert.status}
                onDismiss={() => handleDismiss(alert.key)}
                title={alert.title}
                description={alert.description}
                ctaText="Upgrade your plan"
                ctaHref="/team/~/~/settings/billing"
                label="upgradePlanAlert"
                dashboardAccount={dashboardAccount}
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

  return (
    <ErrorBoundary FallbackComponent={BillingAlertsErrorBoundary}>
      <div className={cn("flex flex-col gap-4", props.className)}>{alerts}</div>
    </ErrorBoundary>
  );
}

type AddPaymentNotificationProps = {
  status: "error" | "warning";
  onDismiss?: () => void;
  title: string;
  description?: string;
  showCTAs?: boolean;
  ctaText?: string;
  ctaHref?: string;
  label?: string;
  dashboardAccount: Account;
};

const AddPaymentNotification: React.FC<AddPaymentNotificationProps> = ({
  status,
  onDismiss,
  title,
  description = "To ensure there are no future interruptions to your services, please add your payment method.",
  ctaText = "Add a payment method",
  ctaHref = "/team/~/~/settings/billing",
  label = "addPaymentAlert",
  showCTAs = true,
  dashboardAccount,
}) => {
  const router = useDashboardRouter();
  const isBilling = ctaHref === "/team/~/~/settings/billing";

  return (
    <Alert
      variant={status === "error" ? "destructive" : "warning"}
      className="relative py-6"
    >
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>

      {showCTAs && (
        <div className="mt-4 flex flex-col gap-3 md:flex-row">
          {isBilling ? (
            <ManageBillingButton
              account={dashboardAccount}
              loadingText="Verifying payment method"
              onClick={() => {
                // TODO - get the team slug prop and redirect to that instead of the default team
                // and don't show this button if this is on the billing page already
                router.push("/team/~/~/settings/billing");
              }}
            />
          ) : (
            <Button variant="outline" asChild>
              <TrackedLinkTW
                href={ctaHref}
                category="billing"
                label={label}
                target="_blank"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                {ctaText}
              </TrackedLinkTW>
            </Button>
          )}

          <Button variant="outline" asChild>
            <TrackedLinkTW
              href="/support"
              category="billing"
              label="support"
              target="_blank"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              Contact Support
              <ExternalLinkIcon className="size-4" />
            </TrackedLinkTW>
          </Button>
        </div>
      )}

      {onDismiss && (
        <Button
          size="icon"
          aria-label="Close"
          variant="ghost"
          onClick={onDismiss}
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
        >
          <XIcon className="size-5" />
        </Button>
      )}
    </Alert>
  );
};

function BillingAlertsErrorBoundary(errorProps: FallbackProps) {
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    Sentry.withScope((scope) => {
      scope.setTag("component-crashed", "true");
      scope.setTag("component-crashed-boundary", "BillingAlertsErrorBoundary");
      scope.setLevel("fatal");
      Sentry.captureException(errorProps.error);
    });
  }, [errorProps.error]);

  return null;
}
