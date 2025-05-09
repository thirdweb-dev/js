"use client";

import { SingleNetworkSelector } from "@/components/blocks/NetworkSelectors";
import { TokenSelector } from "@/components/blocks/TokenSelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useThirdwebClient } from "@/constants/thirdweb.client";
import { ChevronDownIcon, CreditCardIcon } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  type ThirdwebClient,
  defineChain,
  getContract,
  toUnits,
} from "thirdweb";
import { getCurrencyMetadata } from "thirdweb/extensions/erc20";
import { resolveScheme, upload } from "thirdweb/storage";
import { FileInput } from "../../../../components/shared/FileInput";
import { resolveEns } from "../../../../lib/ens";

export function CheckoutLinkForm() {
  const client = useThirdwebClient();
  const [chainId, setChainId] = useState<number>();
  const [recipientAddress, setRecipientAddress] = useState("");
  const [tokenAddressWithChain, setTokenAddressWithChain] = useState("");
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imageUri, setImageUri] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const isFormComplete = useMemo(() => {
    return chainId && recipientAddress && tokenAddressWithChain && amount;
  }, [chainId, recipientAddress, tokenAddressWithChain, amount]);

  const handleImageUpload = useCallback(
    async (file: File) => {
      try {
        setImage(file);
        setUploadingImage(true);

        const uri = await upload({
          client,
          files: [file],
        });

        // eslint-disable-next-line no-restricted-syntax
        const resolvedUrl = resolveScheme({
          uri,
          client,
        });

        setImageUri(resolvedUrl);
        toast.success("Image uploaded successfully");
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Failed to upload image");
        setImage(null);
      } finally {
        setUploadingImage(false);
      }
    },
    [client],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(undefined);
      setIsLoading(true);

      try {
        if (
          !chainId ||
          !recipientAddress ||
          !tokenAddressWithChain ||
          !amount
        ) {
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

        // Add title as name parameter if provided
        if (title) {
          params.set("name", title);
        }

        // Add image URI if available
        if (imageUri) {
          params.set("image", imageUri);
        }

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
    },
    [
      amount,
      chainId,
      client,
      imageUri,
      recipientAddress,
      title,
      tokenAddressWithChain,
    ],
  );

  const handlePreview = useCallback(async () => {
    if (!chainId || !recipientAddress || !tokenAddressWithChain || !amount) {
      toast.error("Please fill in all fields first");
      return;
    }

    try {
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

      // Add title as name parameter if provided
      if (title) {
        params.set("name", title);
      }

      // Add image URI if available
      if (imageUri) {
        params.set("image", imageUri);
      }

      window.open(`/checkout?${params.toString()}`, "_blank");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An error occurred");
    }
  }, [
    amount,
    chainId,
    client,
    imageUri,
    recipientAddress,
    title,
    tokenAddressWithChain,
  ]);

  return (
    <Card className="mx-auto w-full max-w-[500px]">
      <CardHeader>
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-2">
          <div className="rounded-lg border border-muted p-1.5 sm:p-2">
            <CreditCardIcon className="size-5 sm:size-6" />
          </div>
          <CardTitle className="text-center sm:text-left">
            Create a Payment Link
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

          <div className="space-y-4">
            <Button
              type="button"
              variant="ghost"
              className="flex w-full items-center justify-between px-0 text-muted-foreground hover:bg-transparent"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <span>Advanced Options</span>
              <ChevronDownIcon
                className={`size-4 transition-transform duration-200 ease-in-out ${
                  showAdvanced ? "rotate-180" : ""
                }`}
              />
            </Button>

            <div
              className={`grid transition-all duration-200 ease-in-out ${
                showAdvanced
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="space-y-6 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="font-medium text-sm">
                      Title
                    </Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Checkout for..."
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image" className="font-medium text-sm">
                      Image
                    </Label>
                    <div className="w-full px-1 pb-1">
                      <FileInput
                        accept={{ "image/*": [] }}
                        setValue={handleImageUpload}
                        value={image || imageUri}
                        className="!rounded-md aspect-square h-24 w-full"
                        isDisabled={uploadingImage}
                        isDisabledText="Uploading..."
                        selectOrUpload="Upload"
                        helperText="image"
                        fileUrl={imageUri}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              disabled={isLoading || !isFormComplete}
              onClick={handlePreview}
            >
              Preview
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isLoading || !isFormComplete}
            >
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

  const amountInWei = toUnits(decimalAmount, currencyMetadata.decimals);

  return {
    chainId,
    tokenAddress,
    recipientAddress: ens.address,
    amount: amountInWei,
  };
}
