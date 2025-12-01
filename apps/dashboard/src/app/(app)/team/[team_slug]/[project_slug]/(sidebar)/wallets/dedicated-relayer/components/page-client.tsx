"use client";

import { useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import type { Project } from "@/api/project/projects";
import type { Fleet, FleetExecutor, FleetStatus } from "../types";
import { DedicatedRelayerActiveState } from "./active-state";
import { DedicatedRelayerEmptyState } from "./empty-state";
import { DedicatedRelayerPendingState } from "./pending-state";
import type { RelayerTier } from "./tier-selection";

// Mock executor address for demo
const MOCK_EXECUTOR_ADDRESS = "0xE0F28D9d95143858Be492BDf3abBCA746d0d2272";

// Chain IDs
const BASE_MAINNET = 8453;
const BASE_SEPOLIA = 84532;

type DedicatedRelayerPageClientProps = {
  project: Project;
  authToken: string;
  teamSlug: string;
  projectSlug: string;
  client: ThirdwebClient;
  initialFleet: Fleet | null;
};

export function DedicatedRelayerPageClient(
  props: DedicatedRelayerPageClientProps,
) {
  const [fleet, setFleet] = useState<Fleet | null>(props.initialFleet);
  const [fleetStatus, setFleetStatus] = useState<FleetStatus>(() =>
    getInitialStatus(props.initialFleet),
  );

  const handlePurchaseTier = async (tier: RelayerTier) => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Create mock fleet based on tier (pending state - no executors yet)
    const mockFleet: Fleet = {
      id: `fleet-${Date.now()}`,
      tier,
      chainIds: [BASE_MAINNET, BASE_SEPOLIA],
      executors: [], // Empty initially - pending setup
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setFleet(mockFleet);
    setFleetStatus("pending-setup");
  };

  const handleSkipSetup = () => {
    if (!fleet) return;

    const executorCount = fleet.tier === "starter" ? 1 : 10;
    const executors: FleetExecutor[] = [];

    for (let i = 0; i < executorCount; i++) {
      executors.push({
        address: MOCK_EXECUTOR_ADDRESS,
        chainId: BASE_MAINNET,
      });
      executors.push({
        address: MOCK_EXECUTOR_ADDRESS,
        chainId: BASE_SEPOLIA,
      });
    }

    setFleet((prev) =>
      prev
        ? {
            ...prev,
            executors,
            updatedAt: new Date().toISOString(),
          }
        : null,
    );
    setFleetStatus("active");
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
          authToken={props.authToken}
          client={props.client}
          fleet={fleet}
          project={props.project}
          teamSlug={props.teamSlug}
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
