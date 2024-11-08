import type { UsageBillableByService } from "@3rdweb-sdk/react/hooks/useApi";
import { useMemo } from "react";
import { toNumber, toPercent, toSize } from "utils/number";
import { UsageCard } from "./UsageCard";

interface UsageProps {
  usage: UsageBillableByService;
}

export const Usage: React.FC<UsageProps> = ({ usage: usageData }) => {
  const bundlerMetrics = useMemo(() => {
    const metric = {
      title: "Total sponsored fees",
      total: 0,
    };

    if (!usageData) {
      return metric;
    }

    return {
      title: metric.title,
      total: usageData.billableUsd.bundler,
    };
  }, [usageData]);

  const storageMetrics = useMemo(() => {
    if (!usageData) {
      return {};
    }

    const consumedBytes = usageData.usage.storage.sumFileSizeBytes;
    const limitBytes = usageData.limits.storage;
    const percent = toPercent(consumedBytes, limitBytes);

    return {
      total: `${toSize(consumedBytes, "MB")} / ${toSize(
        limitBytes,
      )} (${percent}%)`,
      progress: percent,
      ...(usageData.billableUsd.storage > 0
        ? {
            overage: usageData.billableUsd.storage,
          }
        : {}),
    };
  }, [usageData]);

  const walletsMetrics = useMemo(() => {
    if (!usageData) {
      return {};
    }

    const numOfWallets = usageData.usage.embeddedWallets.countWalletAddresses;
    const limitWallets = usageData.limits.embeddedWallets;
    const percent = toPercent(numOfWallets, limitWallets);

    return {
      total: `${toNumber(numOfWallets)} / ${toNumber(
        limitWallets,
      )} (${percent}%)`,
      progress: percent,
      ...(usageData.billableUsd.embeddedWallets > 0
        ? {
            overage: usageData.billableUsd.embeddedWallets,
          }
        : {}),
    };
  }, [usageData]);

  const rpcMetrics = useMemo(() => {
    if (!usageData) {
      return {};
    }

    return {
      title: "Unlimited requests",
      total: (
        <span className="text-muted-foreground">
          {usageData.rateLimits.rpc} Requests Per Second
        </span>
      ),
    };
  }, [usageData]);

  const gatewayMetrics = useMemo(() => {
    if (!usageData) {
      return {};
    }

    return {
      title: "Unlimited requests",
      total: (
        <span className="text-muted-foreground">
          {usageData.rateLimits.storage} Requests Per Second
        </span>
      ),
    };
  }, [usageData]);

  return (
    <div className="flex grow flex-col gap-12">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        <UsageCard
          {...rpcMetrics}
          name="RPC"
          tooltip="RPC usage is calculated by requests per second."
        />
        <UsageCard
          {...gatewayMetrics}
          name="Storage Gateway"
          tooltip="Storage gateway usage is calculated by GB per file size."
        />
        <UsageCard
          {...storageMetrics}
          name="Storage Pinning"
          tooltip="Storage pinning usage is calculated by GB per file size."
        />
        <UsageCard
          {...walletsMetrics}
          name="Email Wallets"
          tooltip="Email wallet (with managed recovery code) usage is calculated by monthly active wallets (i.e. active as defined by at least 1 user log-in via email or social within the billing period month)."
        />
        <UsageCard
          {...bundlerMetrics}
          name="Account Abstraction"
          tooltip="(Gasless, Paymaster, Bundler) usage is calculated by sponsored network fees."
        />
      </div>
    </div>
  );
};
