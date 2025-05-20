"use client";

import { useMutation } from "@tanstack/react-query";
import { ExternalLinkIcon, EyeIcon, InfoIcon } from "lucide-react";
import { useState } from "react";
import { Badge } from "../../../../components/ui/badge";
import {
  useEngineTxStatus,
  useOptimisticallyUpdateEngineTxStatus,
} from "../../_hooks/useEngineTxStatus";
import { airdrop_tokens_with_engine } from "../../actions";
import { airdropExample } from "../constants";
import { EngineAirdropCard } from "./airdrop-card";

export function EngineAirdropPreview() {
  const [queueId, setQueueId] = useState<string | undefined>(undefined);
  const engineTxStatusQuery = useEngineTxStatus(queueId);
  const updateEngineTxStatus = useOptimisticallyUpdateEngineTxStatus();
  const airdropMutation = useMutation({
    mutationFn: async () => {
      const response = await airdrop_tokens_with_engine({
        contractAddress: airdropExample.contractAddress,
        chainId: airdropExample.chainId,
        receivers: airdropExample.receivers,
      });

      return response;
    },
  });

  const handleSubmit = async () => {
    const res = await airdropMutation.mutateAsync();
    updateEngineTxStatus({
      chainId: airdropExample.chainId,
      queueId: res,
    });

    setQueueId(res);
  };

  return (
    <div>
      <h2 className="mb-1 font-semibold text-2xl tracking-tight">Example</h2>
      <p className="mb-4 text-muted-foreground">
        Airdrop tokens to multiple addresses in a single transaction using
        thirdweb Engine
      </p>

      <div className="rounded-lg border bg-card">
        <div className="grid md:grid-cols-2">
          <div className="flex flex-col overflow-hidden">
            <TabName name="Details" icon={InfoIcon} />
            <AirdropConfig />
          </div>
          <div className="flex flex-col border-t lg:border-t-0 lg:border-l ">
            <TabName name="Preview" icon={EyeIcon} />
            <div className="flex grow items-center justify-center px-4 py-10">
              <EngineAirdropCard
                txStatus={engineTxStatusQuery.data}
                isAirdropping={airdropMutation.isPending}
                onStartAirdrop={handleSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabName(props: {
  name: string;
  icon: React.FC<{ className: string }>;
}) {
  return (
    <div className="flex items-center gap-2 border-b p-4 text-muted-foreground text-sm">
      <props.icon className="size-4" />
      {props.name}
    </div>
  );
}

function AirdropConfig() {
  return (
    <div className="w-full space-y-6 overflow-hidden p-4 lg:p-6">
      <div>
        <h3 className="mb-2 font-medium">Network</h3>
        <a
          href="https://thirdweb.com/base-sepolia-testnet/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Badge variant="secondary">Base Sepolia</Badge>
        </a>
      </div>

      <div>
        <h3 className="mb-2 font-medium">Token Contract</h3>
        <a
          href="https://thirdweb.com/base-sepolia-testnet/0xcB30dB8FB977e8b27ae34c86aF16C4F5E428c0bE"
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-between rounded bg-muted/50 px-3 py-2 font-mono text-sm transition-colors hover:bg-muted"
        >
          <span className="truncate">{airdropExample.contractAddress}</span>
          <ExternalLinkIcon className="size-3" />
        </a>
      </div>

      <div>
        <h3 className="mb-2 font-medium">
          Recipients ({airdropExample.receivers.length})
        </h3>
        <ul className="space-y-2">
          {airdropExample.receivers.map((recipient) => (
            <li
              key={recipient.toAddress}
              className="flex-1 truncate rounded bg-muted/50 px-3 py-2 font-mono text-sm"
            >
              {recipient.toAddress}
            </li>
          ))}
        </ul>
        <p className="mt-2 text-muted-foreground text-sm">
          Each address will receive 1 token
        </p>
      </div>
    </div>
  );
}
