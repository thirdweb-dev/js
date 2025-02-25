"use client";

import type { BillingBillingPortalAction } from "@/actions/billing";
import { BillingPortalButton } from "@/components/billing";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { cn } from "@/lib/utils";
import { useState } from "react";

function BillingAlertBanner(props: {
  title: string;
  description: React.ReactNode;
  teamSlug: string;
  variant: "error" | "warning";
  ctaLabel: string;
  redirectToBillingPortal: BillingBillingPortalAction;
}) {
  const [isRouteLoading, setIsRouteLoading] = useState(false);

  return (
    <div
      className={cn(
        "flex flex-col border-b bg-card px-4 py-6 lg:items-center lg:text-center",
        props.variant === "warning" &&
          "border-yellow-600 bg-yellow-50 text-yellow-800 dark:border-yellow-700 dark:bg-yellow-950 dark:text-yellow-100",
        props.variant === "error" &&
          "border-red-600 bg-red-50 text-red-800 dark:border-red-700 dark:bg-red-950 dark:text-red-100",
      )}
    >
      <h3 className="font-semibold text-xl tracking-tight">{props.title}</h3>
      <p className="mt-1 mb-4 text-sm">{props.description}</p>
      <BillingPortalButton
        className={cn(
          "gap-2",
          props.variant === "warning" &&
            "border border-yellow-600 bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:border-yellow-700 dark:bg-yellow-900 dark:text-yellow-100 dark:hover:bg-yellow-800",
          props.variant === "error" &&
            "border border-red-600 bg-red-100 text-red-800 hover:bg-red-200 dark:border-red-700 dark:bg-red-900 dark:text-red-100 dark:hover:bg-red-800",
        )}
        size="sm"
        teamSlug={props.teamSlug}
        redirectPath={`/team/${props.teamSlug}`}
        redirectToBillingPortal={props.redirectToBillingPortal}
        onClick={() => {
          setIsRouteLoading(true);
        }}
      >
        {props.ctaLabel}
        {isRouteLoading ? <Spinner className="size-4" /> : null}
      </BillingPortalButton>
    </div>
  );
}

export function PastDueBannerUI(props: {
  teamSlug: string;
  redirectToBillingPortal: BillingBillingPortalAction;
}) {
  return (
    <BillingAlertBanner
      ctaLabel="View Invoices"
      variant="warning"
      title="Unpaid Invoices"
      redirectToBillingPortal={props.redirectToBillingPortal}
      description={
        <>
          You have unpaid invoices. Service may be suspended if not paid
          promptly.
        </>
      }
      teamSlug={props.teamSlug}
    />
  );
}

export function ServiceCutOffBannerUI(props: {
  teamSlug: string;
  redirectToBillingPortal: BillingBillingPortalAction;
}) {
  return (
    <BillingAlertBanner
      ctaLabel="Pay Now"
      variant="error"
      title="Service Suspended"
      redirectToBillingPortal={props.redirectToBillingPortal}
      description={
        <>
          Your service has been suspended due to unpaid invoices. Pay now to
          resume service.
        </>
      }
      teamSlug={props.teamSlug}
    />
  );
}
