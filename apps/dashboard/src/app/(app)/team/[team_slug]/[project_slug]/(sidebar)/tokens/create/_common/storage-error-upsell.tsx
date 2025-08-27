"use client";

import { ArrowRightIcon, RefreshCcwIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { apiServerProxy } from "@/actions/proxies";
import { reportUpsellClicked, reportUpsellShown } from "@/analytics/report";
import type { Team } from "@/api/team/get-team";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/Spinner";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { useStripeRedirectEvent } from "@/hooks/stripe/redirect-event";
import { pollWithTimeout } from "@/utils/pollWithTimeout";
import { tryCatch } from "@/utils/try-catch";

export function StorageErrorPlanUpsell(props: {
  teamSlug: string;
  trackingCampaign: "create-coin" | "create-nft";
  onRetry: () => void;
}) {
  const [isPlanUpdated, setIsPlanUpdated] = useState(false);
  const [isPollingTeam, setIsPollingTeam] = useState(false);

  useStripeRedirectEvent(async () => {
    setIsPollingTeam(true);
    await tryCatch(
      pollWithTimeout({
        shouldStop: async () => {
          const team = await getTeam(props.teamSlug);
          if (team.billingPlan !== "free") {
            setIsPlanUpdated(true);
            return true;
          }
          return false;
        },
        timeoutMs: 10000,
      }),
    );

    setIsPollingTeam(false);
  });

  const isEventSent = useRef(false);

  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (isEventSent.current) {
      return;
    }

    isEventSent.current = true;
    reportUpsellShown({
      campaign: props.trackingCampaign,
      content: "storage-limit",
      sku: "plan:starter",
    });
  }, [props.trackingCampaign]);

  return (
    <div className="mt-1">
      {isPlanUpdated ? (
        <div>
          <p className="text-sm text-foreground">Plan upgraded successfully</p>
          <div className="mt-2.5">
            <Button className="gap-2" onClick={props.onRetry} size="sm">
              <RefreshCcwIcon className="size-4" />
              Retry
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-sm text-red-500">
            You have reached the storage limit on the free plan
          </p>
          <p className="text-sm text-foreground mt-1">
            Upgrade now to unlock unlimited storage with any paid plan
          </p>

          <div className="flex gap-2 mt-2.5">
            <Button asChild className="gap-2" size="sm">
              <Link
                href={`/team/${props.teamSlug}/~/billing?showPlans=true&highlight=starter`}
                onClick={() => {
                  reportUpsellClicked({
                    campaign: props.trackingCampaign,
                    content: "storage-limit",
                    sku: "plan:starter",
                  });
                }}
                target="_blank"
              >
                Upgrade Plan{" "}
                {isPollingTeam ? (
                  <Spinner className="size-4" />
                ) : (
                  <ArrowRightIcon className="size-4" />
                )}
              </Link>
            </Button>

            <Button asChild className="bg-card" size="sm" variant="outline">
              <Link href="https://thirdweb.com/pricing" target="_blank">
                View Pricing
              </Link>
            </Button>

            <ToolTipLabel label="Retry">
              <Button
                aria-label="Retry"
                onClick={props.onRetry}
                size="sm"
                variant="outline"
              >
                <RefreshCcwIcon className="size-4 text-muted-foreground" />
              </Button>
            </ToolTipLabel>
          </div>
        </div>
      )}
    </div>
  );
}

async function getTeam(teamSlug: string) {
  const res = await apiServerProxy<{
    result: Team;
  }>({
    method: "GET",
    pathname: `/v1/teams/${teamSlug}`,
  });

  if (!res.ok) {
    throw new Error(res.error);
  }

  return res.data.result;
}
