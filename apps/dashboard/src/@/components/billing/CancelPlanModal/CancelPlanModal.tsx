"use client";
import { CircleXIcon, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import type { Team } from "@/api/team";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PRO_CONTACT_US_URL } from "@/constants/pro";
import { useStripeRedirectEvent } from "@/hooks/stripe/redirect-event";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { pollWithTimeout } from "@/utils/pollWithTimeout";
import { buildCancelPlanUrl } from "@/utils/stripe/build-url";
import { tryCatch } from "@/utils/try-catch";

export function CancelPlanButton(props: {
  teamId: string;
  teamSlug: string;
  currentPlan: Team["billingPlan"];
  billingStatus: Team["billingStatus"];
  getTeam: () => Promise<Team>;
  disabled?: boolean;
}) {
  // shortcut the sheet in case the user is in the default state
  if (props.billingStatus !== "invalidPayment" && props.currentPlan !== "pro") {
    return (
      <ImmediateCancelPlanButton
        disabled={props.disabled}
        getTeam={props.getTeam}
        teamId={props.teamId}
      />
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className="gap-2 bg-background"
          disabled={props.disabled}
          size="sm"
          variant="outline"
        >
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

      <Button asChild className="w-full gap-2 bg-card" variant="outline">
        <Link
          href={`/team/${teamSlug}/~/billing/invoices?status=open`}
          rel="noopener noreferrer"
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

      <Button asChild className="w-full gap-2 bg-card" variant="outline">
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
  disabled?: boolean;
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

  const showPlanSpinner = isPollingTeam || isRoutePending;

  return (
    <Button
      asChild
      className="gap-2 bg-background"
      disabled={showPlanSpinner || props.disabled}
      size="sm"
      variant="outline"
    >
      <Link href={buildCancelPlanUrl({ teamId: props.teamId })} target="_blank">
        {showPlanSpinner ? (
          <Spinner className="size-4 text-muted-foreground" />
        ) : (
          <CircleXIcon className="size-4 text-muted-foreground" />
        )}
        Cancel Plan
      </Link>
    </Button>
  );
}
