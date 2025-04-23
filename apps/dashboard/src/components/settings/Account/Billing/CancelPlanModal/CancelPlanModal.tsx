"use client";

import { getPlanCancelUrl } from "@/actions/billing";
import type { Team } from "@/api/team";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { useMutation } from "@tanstack/react-query";
import { CircleXIcon, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useStripeRedirectEvent } from "../../../../../app/(app)/stripe-redirect/stripeRedirectChannel";
import { PRO_CONTACT_US_URL } from "../../../../../constants/pro";
import { pollWithTimeout } from "../../../../../utils/pollWithTimeout";
import { tryCatch } from "../../../../../utils/try-catch";

export function CancelPlanButton(props: {
  teamId: string;
  teamSlug: string;
  currentPlan: Team["billingPlan"];
  billingStatus: Team["billingStatus"];
  getTeam: () => Promise<Team>;
}) {
  // shortcut the sheet in case the user is in the default state
  if (props.billingStatus !== "invalidPayment" && props.currentPlan !== "pro") {
    return (
      <ImmediateCancelPlanButton
        teamId={props.teamId}
        getTeam={props.getTeam}
      />
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-background">
          <CircleXIcon className="size-4 text-muted-foreground" />
          Cancel Plan
        </Button>
      </SheetTrigger>
      <SheetContent className="!max-w-lg w-full overflow-auto">
        <SheetHeader className="sr-only">
          <SheetTitle className="text-left text-2xl tracking-tight">
            Cancel Plan
          </SheetTitle>
        </SheetHeader>

        {props.billingStatus === "invalidPayment" ? (
          <UnpaidInvoicesWarning teamSlug={props.teamSlug} />
        ) : props.currentPlan === "pro" ? (
          <ProPlanCancelPlanSheetContent />
        ) : // this should never happen
        null}
      </SheetContent>
    </Sheet>
  );
}

function UnpaidInvoicesWarning({ teamSlug }: { teamSlug: string }) {
  return (
    <div>
      <h2 className="mb-1 font-semibold text-2xl tracking-tight">
        Cancel Plan
      </h2>
      <p className="mb-5 text-muted-foreground text-sm">
        You have unpaid invoices. Please pay them before cancelling your plan.
      </p>

      <Button variant="outline" asChild className="w-full gap-2 bg-card">
        <Link
          href={`/team/${teamSlug}/~/settings/invoices?status=open`}
          target="_blank"
        >
          See Invoices
        </Link>
      </Button>
    </div>
  );
}

function ProPlanCancelPlanSheetContent() {
  return (
    <div>
      <h2 className="mb-1 font-semibold text-2xl tracking-tight">
        Cancel Plan
      </h2>
      <p className="mb-5 text-muted-foreground text-sm">
        Please contact us to cancel your Pro plan
      </p>

      <Button variant="outline" asChild className="w-full gap-2 bg-card">
        <Link href={PRO_CONTACT_US_URL} target="_blank">
          Contact Us <ExternalLinkIcon className="size-4" />
        </Link>
      </Button>
    </div>
  );
}

function ImmediateCancelPlanButton(props: {
  teamId: string;
  getTeam: () => Promise<Team>;
}) {
  const router = useDashboardRouter();
  const [isRoutePending, startTransition] = useTransition();
  const [isPollingTeam, setIsPollingTeam] = useState(false);

  useStripeRedirectEvent(async () => {
    setIsPollingTeam(true);
    const verifyResult = await tryCatch(
      pollWithTimeout({
        shouldStop: async () => {
          const team = await props.getTeam();
          const isCancelled =
            team.billingPlan === "free" || team.planCancellationDate !== null;
          return isCancelled;
        },
        timeoutMs: 5000,
      }),
    );

    if (verifyResult.error) {
      return;
    }

    setIsPollingTeam(false);
    toast.success("Plan cancelled successfully");
    startTransition(() => {
      router.refresh();
    });
  });

  const cancelPlan = useMutation({
    mutationFn: async (opts: { teamId: string }) => {
      const { url, status } = await getPlanCancelUrl({
        teamId: opts.teamId,
        redirectUrl: getAbsoluteUrl("/stripe-redirect"),
      });

      if (!url) {
        throw new Error("Failed to get cancel plan url");
      }

      if (status !== 200) {
        throw new Error("Failed to get cancel plan url");
      }

      const tab = window.open(url, "_blank");
      if (!tab) {
        throw new Error("Failed to open cancel plan url");
      }
    },
  });

  async function handleCancelPlan() {
    cancelPlan.mutate({
      teamId: props.teamId,
    });
  }

  const showPlanSpinner =
    isPollingTeam || isRoutePending || cancelPlan.isPending;

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2 bg-background"
      disabled={showPlanSpinner}
      onClick={handleCancelPlan}
    >
      {showPlanSpinner ? (
        <Spinner className="size-4 text-muted-foreground" />
      ) : (
        <CircleXIcon className="size-4 text-muted-foreground" />
      )}
      Cancel Plan
    </Button>
  );
}

function getAbsoluteUrl(path: string) {
  const url = new URL(window.location.origin);
  url.pathname = path;
  return url.toString();
}
