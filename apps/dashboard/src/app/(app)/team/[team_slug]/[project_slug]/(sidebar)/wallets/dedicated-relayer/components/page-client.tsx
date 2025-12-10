"use client";

import { subDays } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import type { Range } from "@/components/analytics/date-range-selector";
import type { DedicatedRelayerSKU } from "@/types/billing";
import { getAbsoluteUrl } from "@/utils/vercel";
import { useFleetStatus, useFleetTransactionsSummary } from "../lib/hooks";
import type { Fleet, FleetStatus } from "../types";
import { DedicatedRelayerActiveState } from "./active-state";
import { DedicatedRelayerEmptyState } from "./empty-state";
import { DedicatedRelayerPendingState } from "./pending-state";

type DedicatedRelayerPageClientProps = {
  teamId: string;
  projectId: string;
  teamSlug: string;
  projectSlug: string;
  client: ThirdwebClient;
  fleetId: string;
  from: string;
  to: string;
  rangeType: Range["type"];
  initialFleet: Fleet | null;
};

export function DedicatedRelayerPageClient(
  props: DedicatedRelayerPageClientProps,
) {
  const [fleet, _setFleet] = useState<Fleet | null>(props.initialFleet);
  const [fleetStatus, _setFleetStatus] = useState<FleetStatus>(() =>
    getInitialStatus(props.initialFleet),
  );

  const [dateRange, setDateRange] = useState<Range>({
    from: new Date(props.from),
    to: new Date(props.to),
    type: props.rangeType,
  });

  // Poll for fleet status when not purchased or pending setup
  const fleetStatusQuery = useFleetStatus(
    props.teamSlug,
    props.projectSlug,
    fleetStatus === "not-purchased" || fleetStatus === "pending-setup",
  );

  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (fleetStatusQuery.data) {
      _setFleet(fleetStatusQuery.data);
      _setFleetStatus(getInitialStatus(fleetStatusQuery.data));
    }
  }, [fleetStatusQuery.data]);

  const activityWindowDates = useMemo(() => {
    const now = new Date();
    return {
      from: subDays(now, 120).toISOString(),
      to: now.toISOString(),
    };
  }, []);

  // Check for any activity in the last 120 days to determine if we should show the dashboard
  // This prevents switching back to "pending" state if the user selects a date range with no transactions
  const hasActivityQuery = useFleetTransactionsSummary({
    teamId: props.teamId,
    fleetId: props.fleetId,
    from: activityWindowDates.from,
    to: activityWindowDates.to,
    enabled: fleetStatus === "active",
    refetchInterval: 5000,
  });

  const totalTransactions = hasActivityQuery.data?.data.totalTransactions ?? 0;
  const hasTransactions = totalTransactions > 0;

  // TODO-FLEET: Implement purchase flow
  // 1. Call Stripe checkout API to create a checkout session for the selected tier
  // 2. Redirect user to Stripe checkout
  // 3. On success callback, call API server to provision fleet
  // 4. API server should:
  //    - Create fleet record in DB
  //    - Call bundler service to provision executor wallets
  //    - Update ProjectBundlerService with fleet config
  // 5. Refetch fleet status and update UI
  const handlePurchaseTier = async (
    sku: DedicatedRelayerSKU,
    chainIds: number[],
  ) => {
    const search = new URLSearchParams();
    search.set("project_id", props.projectId);
    for (const chainId of chainIds) {
      search.append("chain_id", chainId.toString());
    }

    // Redirect to Stripe checkout
    window.open(
      `${getAbsoluteUrl()}/checkout/${props.teamSlug}/${sku}?${search.toString()}`,
      "_blank",
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {fleetStatus === "not-purchased" && (
        <DedicatedRelayerEmptyState
          projectSlug={props.projectSlug}
          teamSlug={props.teamSlug}
          onPurchaseTier={handlePurchaseTier}
          client={props.client}
        />
      )}

      {fleetStatus === "pending-setup" && fleet && (
        <DedicatedRelayerPendingState fleet={fleet} />
      )}

      {fleetStatus === "active" && fleet && !hasTransactions && (
        <DedicatedRelayerPendingState
          fleet={fleet}
          hasTransactions={hasTransactions}
        />
      )}

      {fleetStatus === "active" && fleet && hasTransactions && (
        <DedicatedRelayerActiveState
          fleet={fleet}
          teamId={props.teamId}
          fleetId={props.fleetId}
          client={props.client}
          range={dateRange}
          setRange={setDateRange}
        />
      )}
    </div>
  );
}

function getInitialStatus(fleet: Fleet | null): FleetStatus {
  if (!fleet) {
    return "not-purchased";
  }
  if (fleet.executors.length === 0) {
    return "pending-setup";
  }
  return "active";
}
