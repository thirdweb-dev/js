"use client";

import type React from "react";
import { useId, useState } from "react";
import { defineChain } from "thirdweb/chains";
import { SingleNetworkSelector } from "@/components/blocks/NetworkSelectors";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TokenSelector } from "@/components/ui/TokenSelector";
import { THIRDWEB_CLIENT } from "@/lib/client";
import type { TokenMetadata } from "@/lib/types";
import type { X402PlaygroundOptions } from "./types";

export function X402LeftSection(props: {
  options: X402PlaygroundOptions;
  setOptions: React.Dispatch<React.SetStateAction<X402PlaygroundOptions>>;
}) {
  const { options, setOptions } = props;

  // Local state for chain and token selection
  const [selectedChain, setSelectedChain] = useState<number | undefined>(() => {
    return options.chain?.id;
  });

  const [selectedToken, setSelectedToken] = useState<
    { chainId: number; address: string } | undefined
  >(() => {
    if (options.tokenAddress && options.chain?.id) {
      return {
        address: options.tokenAddress,
        chainId: options.chain.id,
      };
    }
    return undefined;
  });

  const chainId = useId();
  const tokenId = useId();
  const amountId = useId();
  const waitUntilId = useId();
  const payToId = useId();
  const schemeId = useId();
  const minAmountId = useId();

  const handleChainChange = (chainId: number) => {
    setSelectedChain(chainId);
    // Clear token selection when chain changes
    setSelectedToken(undefined);

    setOptions((v) => ({
      ...v,
      chain: defineChain(chainId),
      tokenAddress: "0x0000000000000000000000000000000000000000" as const,
      tokenSymbol: "",
      tokenDecimals: 18,
    }));
  };

  const handleTokenChange = (token: TokenMetadata) => {
    setSelectedToken({
      address: token.address,
      // biome-ignore lint/style/noNonNullAssertion: ok
      chainId: selectedChain!,
    });

    setOptions((v) => ({
      ...v,
      tokenAddress: token.address as `0x${string}`,
      tokenSymbol: token.symbol ?? "",
      tokenDecimals: token.decimals ?? 18,
    }));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOptions((v) => ({
      ...v,
      amount: e.target.value,
    }));
  };

  const handlePayToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOptions((v) => ({
      ...v,
      payTo: e.target.value as `0x${string}`,
    }));
  };

  const handleWaitUntilChange = (
    value: "simulated" | "submitted" | "confirmed",
  ) => {
    setOptions((v) => ({
      ...v,
      waitUntil: value,
    }));
  };

  const handleSchemeChange = (value: "exact" | "upto") => {
    setOptions((v) => ({
      ...v,
      scheme: value,
    }));
  };

  const handleMinAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOptions((v) => ({
      ...v,
      minAmount: e.target.value,
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-4 text-xl font-semibold">Configuration</h2>
        <div className="space-y-4">
          {/* Chain selection */}
          <div className="flex flex-col gap-2">
            <Label htmlFor={chainId}>Chain</Label>
            <SingleNetworkSelector
              chainId={selectedChain}
              onChange={handleChainChange}
              placeholder="Select a chain"
              className="bg-card"
            />
          </div>

          {/* Token selection - only show if chain is selected */}
          {selectedChain && (
            <div className="flex flex-col gap-2">
              <Label htmlFor={tokenId}>Token</Label>
              <TokenSelector
                includeNativeToken={false}
                chainId={selectedChain}
                client={THIRDWEB_CLIENT}
                enabled={true}
                onChange={handleTokenChange}
                placeholder="Select a token"
                selectedToken={selectedToken}
                className="bg-card"
              />
            </div>
          )}

          {/* Amount input */}
          <div className="flex flex-col gap-2">
            <Label htmlFor={amountId}>Amount</Label>
            <Input
              id={amountId}
              type="text"
              placeholder="0.01"
              value={options.amount}
              onChange={handleAmountChange}
              className="bg-card"
            />
            {options.tokenSymbol && (
              <p className="text-sm text-muted-foreground">
                Amount in {options.tokenSymbol}
              </p>
            )}
          </div>

          {/* Pay To input */}
          <div className="flex flex-col gap-2">
            <Label htmlFor={payToId}>Pay To Address</Label>
            <Input
              id={payToId}
              type="text"
              placeholder="0x..."
              value={options.payTo}
              onChange={handlePayToChange}
              className="bg-card"
            />
            <p className="text-sm text-muted-foreground">
              The wallet address that will receive the payment
            </p>
          </div>

          {/* Wait Until selection */}
          <div className="flex flex-col gap-2">
            <Label htmlFor={waitUntilId}>Wait Until</Label>
            <Select
              value={options.waitUntil}
              onValueChange={handleWaitUntilChange}
            >
              <SelectTrigger className="bg-card">
                <SelectValue placeholder="Select wait condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="simulated">Simulated</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              When to consider the payment settled: simulated (fastest),
              submitted (medium), or confirmed (most secure)
            </p>
          </div>

          {/* Scheme selection */}
          <div className="flex flex-col gap-2">
            <Label htmlFor={schemeId}>Payment Scheme</Label>
            <Select value={options.scheme} onValueChange={handleSchemeChange}>
              <SelectTrigger className="bg-card">
                <SelectValue placeholder="Select payment scheme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="exact">Exact</SelectItem>
                <SelectItem value="upto">Up To</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              {options.scheme === "exact"
                ? "Exact: Payment must match the specified amount exactly"
                : "Up To: Payment can be any amount between the minimum and maximum"}
            </p>
          </div>

          {/* Min Amount input - only show when scheme is 'upto' */}
          {options.scheme === "upto" && (
            <div className="flex flex-col gap-2">
              <Label htmlFor={minAmountId}>Minimum Amount</Label>
              <Input
                id={minAmountId}
                type="text"
                placeholder="0.001"
                value={options.minAmount}
                onChange={handleMinAmountChange}
                className="bg-card"
              />
              {options.tokenSymbol && (
                <p className="text-sm text-muted-foreground">
                  Minimum amount in {options.tokenSymbol} (must be less than or
                  equal to Amount)
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
