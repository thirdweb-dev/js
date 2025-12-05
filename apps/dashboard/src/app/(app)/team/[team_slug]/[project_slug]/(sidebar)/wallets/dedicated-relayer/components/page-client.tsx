"use client";

import { useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import type { Fleet, FleetStatus } from "../types";
import { DedicatedRelayerActiveState } from "./active-state";
import { DedicatedRelayerEmptyState } from "./empty-state";
import { DedicatedRelayerPendingState } from "./pending-state";
import type { RelayerTier } from "./tier-selection";

type DedicatedRelayerPageClientProps = {
  teamId: string;
  projectId: string;
  teamSlug: string;
  projectSlug: string;
  client: ThirdwebClient;
  fleetId: string;
  from: string;
  to: string;
  initialFleet: Fleet | null;
};

export function DedicatedRelayerPageClient(
  props: DedicatedRelayerPageClientProps,
) {
  const [fleet, setFleet] = useState<Fleet | null>(props.initialFleet);
  const [fleetStatus, setFleetStatus] = useState<FleetStatus>(() =>
    getInitialStatus(props.initialFleet),
  );

  // TODO-FLEET: Implement purchase flow
  // 1. Call Stripe checkout API to create a checkout session for the selected tier
  // 2. Redirect user to Stripe checkout
  // 3. On success callback, call API server to provision fleet
  // 4. API server should:
  //    - Create fleet record in DB
  //    - Call bundler service to provision executor wallets
  //    - Update ProjectBundlerService with fleet config
  // 5. Refetch fleet status and update UI
  const handlePurchaseTier = async (_tier: RelayerTier) => {
    // TODO-FLEET: Replace with actual Stripe + API server integration
    // For now, simulate purchase by transitioning to pending-setup
    const mockFleet: Fleet = {
      id: props.fleetId,
      chainIds: [],
      executors: [],
    };
    setFleet(mockFleet);
    setFleetStatus("pending-setup");
  };

  // TODO-FLEET: This is a dev helper to skip purchase - remove in production
  const handleSkipSetup = () => {
    // TODO-FLEET: Replace with actual setup completion flow
    // For now, simulate setup completion by transitioning to active with mock executors
    if (fleet) {
      setFleet({
        ...fleet,
        executors: ["0x1234567890123456789012345678901234567890"],
        chainIds: [1, 137],
      });
      setFleetStatus("active");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {fleetStatus === "not-purchased" && (
        <DedicatedRelayerEmptyState
          projectSlug={props.projectSlug}
          teamSlug={props.teamSlug}
          onPurchaseTier={handlePurchaseTier}
        />
      )}

      {fleetStatus === "pending-setup" && fleet && (
        <DedicatedRelayerPendingState
          fleet={fleet}
          onSkipSetup={handleSkipSetup}
        />
      )}

      {fleetStatus === "active" && fleet && (
        <DedicatedRelayerActiveState
          fleet={fleet}
          teamId={props.teamId}
          fleetId={props.fleetId}
          client={props.client}
          from={props.from}
          to={props.to}
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
