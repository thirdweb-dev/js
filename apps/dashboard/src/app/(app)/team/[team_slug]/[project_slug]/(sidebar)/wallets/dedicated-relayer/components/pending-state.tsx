"use client";

import { ClockIcon, Loader2Icon } from "lucide-react";
import { useV5DashboardChain } from "@/hooks/chains/v5-adapter";
import type { Fleet } from "../types";

type DedicatedRelayerPendingStateProps = {
  fleet: Fleet;
  hasTransactions?: boolean;
};

/**
 * Pending state shown when fleet is purchased but executors are not yet set up.
 * Shows the requested chain IDs and a "setting up" status.
 */
export function DedicatedRelayerPendingState(
  props: DedicatedRelayerPendingStateProps,
) {
  const { fleet, hasTransactions } = props;
  const hasExecutors = fleet.executors.length > 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Status Banner */}
      <div className="flex items-center gap-3 rounded-lg border border-warning/50 bg-warning/10 px-4 py-3">
        <Loader2Icon className="size-5 animate-spin text-warning" />
        <div>
          <p className="font-medium text-warning">
            {hasExecutors
              ? "Waiting for first transaction"
              : "Setting up your dedicated relayer"}
          </p>
          <p className="text-muted-foreground text-sm">
            {hasExecutors
              ? "Your dedicated relayer is ready. Waiting for the first transaction to appear."
              : "Your relayer is being provisioned. This usually takes a few minutes."}
          </p>
        </div>
      </div>

      {/* Fleet Details Preview */}
      <div className="rounded-lg border bg-card">
        <div className="border-b px-4 py-4 lg:px-6">
          <h2 className="font-semibold text-xl tracking-tight">
            Fleet Configuration
          </h2>
        </div>

        <div className="p-4 lg:p-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Requested Chains */}
            <div>
              <h3 className="mb-3 font-medium text-muted-foreground text-sm">
                Requested Chains
              </h3>
              <div className="flex flex-wrap gap-2">
                {fleet.chainIds.map((chainId) => (
                  <ChainBadge key={chainId} chainId={chainId} />
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <h3 className="mb-3 font-medium text-muted-foreground text-sm">
                Status
              </h3>
              <div className="flex items-center gap-2 text-muted-foreground">
                <ClockIcon className="size-4" />
                <span>
                  {hasExecutors
                    ? "Active, waiting for transactions"
                    : "Awaiting executor deployment"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What to Expect */}
      <div className="rounded-lg border bg-card">
        <div className="border-b px-4 py-4 lg:px-6">
          <h2 className="font-semibold text-xl tracking-tight">
            What to Expect
          </h2>
        </div>

        <div className="p-4 lg:p-6">
          <ol className="flex flex-col gap-4">
            <SetupStep
              completed={true}
              number={1}
              title="Subscription activated"
            />
            <SetupStep
              completed={hasExecutors}
              inProgress={!hasExecutors}
              number={2}
              title="Executor wallets deployed"
            />
            <SetupStep
              completed={!!hasTransactions}
              inProgress={hasExecutors && !hasTransactions}
              number={3}
              title="Waiting for first transaction"
            />
          </ol>
        </div>
      </div>
    </div>
  );
}

function ChainBadge(props: { chainId: number }) {
  const chain = useV5DashboardChain(props.chainId);
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-sm">
      {chain.name || `Chain ${props.chainId}`}
    </span>
  );
}

function SetupStep(props: {
  number: number;
  title: string;
  completed: boolean;
  inProgress?: boolean;
}) {
  return (
    <li className="flex items-center gap-3">
      <div
        className={`flex size-6 items-center justify-center rounded-full text-xs font-medium ${
          props.completed
            ? "bg-success text-success-foreground"
            : props.inProgress
              ? "bg-warning text-warning-foreground"
              : "bg-muted text-muted-foreground"
        }`}
      >
        {props.inProgress ? (
          <Loader2Icon className="size-3 animate-spin" />
        ) : (
          props.number
        )}
      </div>
      <span
        className={
          props.completed
            ? "text-success"
            : props.inProgress
              ? "text-warning"
              : "text-muted-foreground"
        }
      >
        {props.title}
      </span>
    </li>
  );
}
