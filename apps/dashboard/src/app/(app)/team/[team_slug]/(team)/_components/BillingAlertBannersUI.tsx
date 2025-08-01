"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { useStripeRedirectEvent } from "@/hooks/stripe/redirect-event";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { cn } from "@/lib/utils";

function BillingAlertBanner(props: {
  title: string;
  description: React.ReactNode;
  teamSlug: string;
  variant: "error" | "warning";
  ctaLabel: string;
}) {
  const router = useDashboardRouter();
  const [isPending, startTransition] = useTransition();
  useStripeRedirectEvent(() => {
    setTimeout(() => {
      startTransition(() => {
        router.refresh();
      });
    }, 1000);
  });

  return (
    <div
      className={cn(
        "relative flex flex-col border-b bg-card px-4 py-6 lg:items-center lg:text-center",
        props.variant === "warning" &&
          "border-yellow-600 bg-yellow-50 text-yellow-800 dark:border-yellow-700 dark:bg-yellow-950 dark:text-yellow-100",
        props.variant === "error" &&
          "border-red-600 bg-red-50 text-red-800 dark:border-red-700 dark:bg-red-950 dark:text-red-100",
      )}
    >
      {isPending && (
        <div className="absolute top-4 right-4">
          <Spinner className="size-5" />
        </div>
      )}

      <h3 className="font-semibold text-xl tracking-tight">{props.title}</h3>
      <p className="mt-1 mb-4 text-sm">{props.description}</p>

      <Button
        asChild
        className={cn(
          "gap-2",
          props.variant === "warning" &&
            "border border-yellow-600 bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:border-yellow-700 dark:bg-yellow-900 dark:text-yellow-100 dark:hover:bg-yellow-800",
          props.variant === "error" &&
            "border border-red-600 bg-red-100 text-red-800 hover:bg-red-200 dark:border-red-700 dark:bg-red-900 dark:text-red-100 dark:hover:bg-red-800",
        )}
      >
        <Link href={`/team/${props.teamSlug}/~/billing/invoices`}>
          {props.ctaLabel}
        </Link>
      </Button>
    </div>
  );
}

export function PastDueBannerUI(props: { teamSlug: string }) {
  return (
    <BillingAlertBanner
      ctaLabel="View Invoices"
      description={
        <>
          You have unpaid invoices. Service may be suspended if not paid
          promptly.
        </>
      }
      teamSlug={props.teamSlug}
      title="Unpaid Invoices"
      variant="warning"
    />
  );
}

export function ServiceCutOffBannerUI(props: { teamSlug: string }) {
  return (
    <BillingAlertBanner
      ctaLabel="Pay Now"
      description={
        <>
          Your service has been suspended due to unpaid invoices. Pay now to
          resume service.
        </>
      }
      teamSlug={props.teamSlug}
      title="Service Suspended"
      variant="error"
    />
  );
}
