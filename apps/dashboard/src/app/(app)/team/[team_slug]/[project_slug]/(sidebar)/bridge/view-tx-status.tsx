"use client";
import { Button } from "@workspace/ui/components/button";
import { ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import { SingleNetworkSelector } from "@/components/blocks/NetworkSelectors";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ViewTxStatus(props: { client: ThirdwebClient }) {
  const [txHash, setTxHash] = useState("");
  const [chainId, setChainId] = useState<number>(1);

  const isValidTxHash = txHash.length === 66 && txHash.startsWith("0x");
  const isEnabled = !!txHash && !!chainId && isValidTxHash;

  return (
    <div className="bg-card rounded-xl border">
      <div className="p-4 lg:p-6 mb-3">
        <h3 className="font-semibold text-xl tracking-tight mb-1">
          View transaction status
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Select chain and enter the transaction hash to view the transaction
          status.
        </p>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 max-w-3xl">
          <div className="space-y-2">
            <Label>Chain</Label>
            <SingleNetworkSelector
              chainId={chainId}
              onChange={setChainId}
              client={props.client}
              disableChainId
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="view-tx-hash">Transaction Hash</Label>
            <Input
              id="view-tx-hash"
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
              placeholder="0x.."
            />
            {txHash && !isValidTxHash && (
              <p className="text-sm text-destructive-text">
                Invalid transaction hash
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-6 py-4 border-t border-dashed justify-end items-center flex">
        <Button
          asChild
          disabled={!isEnabled}
          size="sm"
          variant={isEnabled ? "default" : "outline"}
          className="gap-1.5 rounded-full"
        >
          <Link href={`/${chainId.toString()}/tx/${txHash}`} target="_blank">
            View Transaction Status <ArrowUpRightIcon className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
