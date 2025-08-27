"use client";

import { useMutation } from "@tanstack/react-query";
import { RefreshCwIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { reSubscribePlan } from "@/actions/billing";
import type { Team } from "@/api/team/get-team";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/Spinner";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { pollWithTimeout } from "@/utils/pollWithTimeout";
import { tryCatch } from "@/utils/try-catch";

export function RenewSubscriptionButton(props: {
  teamId: string;
  getTeam: () => Promise<Team>;
  disabled?: boolean;
}) {
  const router = useDashboardRouter();
  const [isRoutePending, setTransition] = useTransition();
  const [isPollingTeam, setIsPollingTeam] = useState(false);

  const reSubscribePlanMutation = useMutation({
    mutationFn: async () => {
      const res = await reSubscribePlan({ teamId: props.teamId });
      if (res.status !== 200) {
        throw new Error("Failed to renew subscription");
      }
    },
  });

  const showSpinner =
    isPollingTeam || isRoutePending || reSubscribePlanMutation.isPending;

  async function handleRenewSubscription() {
    const renewResult = await tryCatch(reSubscribePlanMutation.mutateAsync());

    if (renewResult.error) {
      toast.error("Failed to renew subscription");
      return;
    }

    toast.success("Subscription renewed successfully");

    setIsPollingTeam(true);

    const verifyResult = await tryCatch(
      pollWithTimeout({
        shouldStop: async () => {
          const team = await props.getTeam();
          return team.planCancellationDate === null;
        },
        timeoutMs: 5000,
      }),
    );

    setIsPollingTeam(false);

    if (verifyResult.error) {
      return;
    }

    setTransition(() => {
      router.refresh();
    });
  }

  return (
    <Button
      className="gap-2"
      disabled={showSpinner || props.disabled}
      onClick={handleRenewSubscription}
      size="sm"
      variant="default"
    >
      {showSpinner ? (
        <Spinner className="size-4" />
      ) : (
        <RefreshCwIcon className="size-4" />
      )}
      Renew Subscription
    </Button>
  );
}
