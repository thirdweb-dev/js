"use client";

import { SingleNetworkSelector } from "@/components/blocks/NetworkSelectors";
import { TokenSelector } from "@/components/blocks/TokenSelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useThirdwebClient } from "@/constants/thirdweb.client";
import { CreditCardIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { type ThirdwebClient, defineChain, getContract } from "thirdweb";
import { getCurrencyMetadata } from "thirdweb/extensions/erc20";
import { resolveEns } from "../../../../lib/ens";

export function CheckoutLinkForm() {
  const client = useThirdwebClient();
  const [chainId, setChainId] = useState<number>();
  const [recipientAddress, setRecipientAddress] = useState("");
  const [tokenAddressWithChain, setTokenAddressWithChain] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    setIsLoading(true);

    try {
      if (!chainId || !recipientAddress || !tokenAddressWithChain || !amount) {
        throw new Error("All fields are required");
      }

      const inputs = await parseInputs(
        client,
        chainId,
        tokenAddressWithChain,
        recipientAddress,
        amount,
      );

      // Build checkout URL
      const params = new URLSearchParams({
        chainId: inputs.chainId.toString(),
        recipientAddress: inputs.recipientAddress,
        tokenAddress: inputs.tokenAddress,
        amount: inputs.amount.toString(),
      });

      const checkoutUrl = `${window.location.origin}/checkout?${params.toString()}`;

      // Copy to clipboard
      await navigator.clipboard.writeText(checkoutUrl);

      // Show success toast
      toast.success("Checkout link copied to clipboard.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-[500px]">
      <CardHeader>
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-2">
          <div className="rounded-lg border border-muted p-1.5 sm:p-2">
            <CreditCardIcon className="size-5 sm:size-6" />
          </div>
          <CardTitle className="text-center sm:text-left">
            Create a Checkout Link
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="network" className="font-medium text-sm">
              Network
            </Label>
            <SingleNetworkSelector
              chainId={chainId}
              onChange={setChainId}
              client={client}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="token" className="font-medium text-sm">
              Token
            </Label>
            <TokenSelector
              tokenAddress={tokenAddressWithChain}
              chainId={chainId ?? undefined}
              onChange={setTokenAddressWithChain}
              className="w-full"
              client={client}
              disabled={!chainId}
              enabled={!!chainId}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipient" className="font-medium text-sm">
              Recipient Address
            </Label>
            <Input
              id="recipient"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              placeholder="Address or ENS"
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="font-medium text-sm">
              Amount
            </Label>
            <Input
              id="amount"
              type="number"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              required
              className="w-full"
            />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={async () => {
                if (
                  !chainId ||
                  !recipientAddress ||
                  !tokenAddressWithChain ||
                  !amount
                ) {
                  toast.error("Please fill in all fields first");
                  return;
                }
                const inputs = await parseInputs(
                  client,
                  chainId,
                  tokenAddressWithChain,
                  recipientAddress,
                  amount,
                );
                const params = new URLSearchParams({
                  chainId: inputs.chainId.toString(),
                  recipientAddress: inputs.recipientAddress,
                  tokenAddress: inputs.tokenAddress,
                  amount: inputs.amount.toString(),
                });
                window.open(`/checkout?${params.toString()}`, "_blank");
              }}
            >
              Preview
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

async function parseInputs(
  client: ThirdwebClient,
  chainId: number,
  tokenAddressWithChain: string,
  recipientAddressOrEns: string,
  decimalAmount: string,
) {
  const [_chainId, tokenAddress] = tokenAddressWithChain.split(":");
  if (Number(_chainId) !== chainId) {
    throw new Error("Chain ID does not match token chain");
  }
  if (!tokenAddress) {
    throw new Error("Missing token address");
  }

  const ensPromise = resolveEns(recipientAddressOrEns, client);
  const currencyPromise = getCurrencyMetadata({
    contract: getContract({
      client,
      // eslint-disable-next-line no-restricted-syntax
      chain: defineChain(chainId),
      address: tokenAddress,
    }),
  });
  const [ens, currencyMetadata] = await Promise.all([
    ensPromise,
    currencyPromise,
  ]);
  if (!ens.address) {
    throw new Error("Invalid recipient address");
  }

  const amountInWei = BigInt(
    Number.parseFloat(decimalAmount) * 10 ** currencyMetadata.decimals,
  );

  return {
    chainId,
    tokenAddress,
    recipientAddress: ens.address,
    amount: amountInWei,
  };
}
