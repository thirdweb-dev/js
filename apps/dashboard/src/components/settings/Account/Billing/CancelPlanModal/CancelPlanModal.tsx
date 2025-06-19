"use client";
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
import { CircleXIcon, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useStripeRedirectEvent } from "../../../../../app/(app)/(stripe)/stripe-redirect/stripeRedirectChannel";
import { buildCancelPlanUrl } from "../../../../../app/(app)/(stripe)/utils/build-url";
import { PRO_CONTACT_US_URL } from "../../../../../constants/pro";
import { pollWithTimeout } from "../../../../../utils/pollWithTimeout";
import { tryCatch } from "../../../../../utils/try-catch";

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
        teamId={props.teamId}
        getTeam={props.getTeam}
        disabled={props.disabled}
      />
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 bg-background"
          disabled={props.disabled}
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

      <Button variant="outline" asChild className="w-full gap-2 bg-card">
        <Link
          href={`/team/${teamSlug}/~/settings/invoices?status=open`}
          target="_blank"
          rel="noopener noreferrer"
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
      variant="outline"
      size="sm"
      className="gap-2 bg-background"
      disabled={showPlanSpinner || props.disabled}
      asChild
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
