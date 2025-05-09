"use client";

import { SingleNetworkSelector } from "@/components/blocks/NetworkSelectors";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useThirdwebClient } from "@/constants/thirdweb.client";
import { CreditCardIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { defineChain, getContract } from "thirdweb";
import { getCurrencyMetadata } from "thirdweb/extensions/erc20";
import { checksumAddress } from "thirdweb/utils";

export function CheckoutLinkForm() {
  const client = useThirdwebClient();
  const [chainId, setChainId] = useState<number>();
  const [recipientAddress, setRecipientAddress] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    setIsLoading(true);

    try {
      if (!chainId || !recipientAddress || !tokenAddress || !amount) {
        throw new Error("All fields are required");
      }

      // Validate addresses
      if (!checksumAddress(recipientAddress)) {
        throw new Error("Invalid recipient address");
      }
      if (!checksumAddress(tokenAddress)) {
        throw new Error("Invalid token address");
      }

      // Get token decimals
      const tokenContract = getContract({
        client,
        // eslint-disable-next-line no-restricted-syntax
        chain: defineChain(chainId),
        address: tokenAddress,
      });
      const { decimals } = await getCurrencyMetadata({
        contract: tokenContract,
      });

      // Convert amount to wei
      const amountInWei = BigInt(Number.parseFloat(amount) * 10 ** decimals);

      // Build checkout URL
      const params = new URLSearchParams({
        chainId: chainId.toString(),
        recipientAddress,
        tokenAddress,
        amount: amountInWei.toString(),
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
            <label htmlFor="network" className="font-medium text-sm">
              Network
            </label>
            <SingleNetworkSelector
              chainId={chainId}
              onChange={setChainId}
              client={client}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="recipient" className="font-medium text-sm">
              Recipient Address
            </label>
            <Input
              id="recipient"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              placeholder="0x..."
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="token" className="font-medium text-sm">
              Token Address
            </label>
            <Input
              id="token"
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
              placeholder="0x..."
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="amount" className="font-medium text-sm">
              Amount
            </label>
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
              onClick={() => {
                if (!chainId || !recipientAddress || !tokenAddress || !amount) {
                  toast.error("Please fill in all fields first");
                  return;
                }
                const params = new URLSearchParams({
                  chainId: chainId.toString(),
                  recipientAddress,
                  tokenAddress,
                  amount,
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
