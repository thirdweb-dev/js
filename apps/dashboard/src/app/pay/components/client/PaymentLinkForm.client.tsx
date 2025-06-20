"use client";

import { payAppThirdwebClient } from "app/pay/constants";
import { ChevronDownIcon, CreditCardIcon } from "lucide-react";
import { useCallback, useId, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  createThirdwebClient,
  defineChain,
  getContract,
  type ThirdwebClient,
  toUnits,
} from "thirdweb";
import { getCurrencyMetadata } from "thirdweb/extensions/erc20";
import { resolveScheme, upload } from "thirdweb/storage";
import { SingleNetworkSelector } from "@/components/blocks/NetworkSelectors";
import { TokenSelector } from "@/components/blocks/TokenSelector";
import { Button } from "@/components/ui/button";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FileInput } from "../../../../components/shared/FileInput";
import { resolveEns } from "../../../../lib/ens";

export function PaymentLinkForm() {
  const [chainId, setChainId] = useState<number>();
  const [recipientAddress, setRecipientAddress] = useState("");
  // TODO - clean this up later
  const [tokenAddressWithChain, setTokenAddressWithChain] = useState("");
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imageUri, setImageUri] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string>("");

  const isFormComplete = useMemo(() => {
    return chainId && recipientAddress && tokenAddressWithChain && amount;
  }, [chainId, recipientAddress, tokenAddressWithChain, amount]);

  const handleImageUpload = useCallback(async (file: File) => {
    try {
      setImage(file);
      setUploadingImage(true);

      const uploadClient = createThirdwebClient({
        clientId: "7ae789153cf9ecde8f35649f2d8a4333",
      });
      const uri = await upload({
        client: uploadClient,
        files: [file],
      });

      // eslint-disable-next-line no-restricted-syntax
      const resolvedUrl = resolveScheme({
        client: uploadClient,
        uri,
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
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
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
          payAppThirdwebClient,
          chainId,
          tokenAddressWithChain,
          recipientAddress,
          amount,
        );

        // Build payment URL
        const params = new URLSearchParams({
          amount: inputs.amount.toString(),
          chainId: inputs.chainId.toString(),
          clientId: payAppThirdwebClient.clientId,
          recipientAddress: inputs.recipientAddress,
          tokenAddress: inputs.tokenAddress,
        });

        // Add title as name parameter if provided
        if (title) {
          params.set("name", title);
        }

        // Add image URI if available
        if (imageUri) {
          params.set("image", imageUri);
        }

        const url = `${window.location.origin}/pay?${params.toString()}`;
        setPaymentUrl(url);
        toast.success("Payment link created!");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    },
    [amount, chainId, imageUri, recipientAddress, title, tokenAddressWithChain],
  );

  const handlePreview = useCallback(async () => {
    if (!chainId || !recipientAddress || !tokenAddressWithChain || !amount) {
      toast.error("Please fill in all fields first");
      return;
    }

    try {
      const inputs = await parseInputs(
        payAppThirdwebClient,
        chainId,
        tokenAddressWithChain,
        recipientAddress,
        amount,
      );

      const params = new URLSearchParams({
        amount: inputs.amount.toString(),
        chainId: inputs.chainId.toString(),
        clientId: payAppThirdwebClient.clientId,
        recipientAddress: inputs.recipientAddress,
        tokenAddress: inputs.tokenAddress,
      });

      // Add title as name parameter if provided
      if (title) {
        params.set("name", title);
      }

      // Add image URI if available
      if (imageUri) {
        params.set("image", imageUri);
      }

      window.open(`/pay?${params.toString()}`, "_blank");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An error occurred");
    }
  }, [
    amount,
    chainId,
    imageUri,
    recipientAddress,
    title,
    tokenAddressWithChain,
  ]);

  const [selectedChainId, selectedTokenAddress] = tokenAddressWithChain
    ? tokenAddressWithChain.split(":")
    : [];

  const recipientId = useId();
  const amountId = useId();
  const titleId = useId();

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
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label className="font-medium text-sm">Network</Label>
            <SingleNetworkSelector
              chainId={chainId}
              className="w-full"
              client={payAppThirdwebClient}
              disableTestnets
              onChange={setChainId}
            />
          </div>

          <div className="space-y-2">
            <Label className="font-medium text-sm">Token</Label>
            <TokenSelector
              addNativeTokenIfMissing={false}
              chainId={chainId ?? undefined}
              className="w-full"
              client={payAppThirdwebClient}
              disabled={!chainId}
              enabled={!!chainId}
              onChange={(value) => {
                setTokenAddressWithChain(`${value.chainId}:${value.address}`);
              }}
              selectedToken={
                selectedChainId && selectedTokenAddress
                  ? {
                      address: selectedTokenAddress,
                      chainId: Number(selectedChainId),
                    }
                  : undefined
              }
              showCheck={false}
            />
          </div>

          <div className="space-y-2">
            <Label className="font-medium text-sm" htmlFor={recipientId}>
              Recipient Address
            </Label>
            <Input
              className="w-full"
              id={recipientId}
              onChange={(e) => setRecipientAddress(e.target.value)}
              placeholder="Address or ENS"
              required
              value={recipientAddress}
            />
          </div>

          <div className="space-y-2">
            <Label className="font-medium text-sm" htmlFor={amountId}>
              Amount
            </Label>
            <Input
              className="w-full"
              id={amountId}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              required
              step="any"
              type="number"
              value={amount}
            />
          </div>

          <div className="space-y-2">
            <Button
              className={cn(
                "flex w-full items-center justify-between px-0 text-muted-foreground hover:bg-transparent",
              )}
              onClick={() => setShowAdvanced(!showAdvanced)}
              type="button"
              variant="ghost"
            >
              <span>Advanced Options</span>
              <ChevronDownIcon
                className={`size-4 transition-transform duration-200 ease-in-out ${
                  showAdvanced ? "rotate-180" : ""
                }`}
              />
            </Button>

            <div
              className={cn(
                "grid transition-all duration-200 ease-in-out",
                showAdvanced
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className={cn(showAdvanced ? "" : "overflow-hidden")}>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="font-medium text-sm" htmlFor={titleId}>
                      Title
                    </Label>
                    <Input
                      className="w-full"
                      id={titleId}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Payment for..."
                      value={title}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="font-medium text-sm">Image</Label>
                    <div className="w-full">
                      <FileInput
                        accept={{ "image/*": [] }}
                        className="!rounded-md aspect-square h-24 w-full"
                        client={payAppThirdwebClient}
                        helperText="image"
                        isDisabled={uploadingImage}
                        isDisabledText="Uploading..."
                        selectOrUpload="Upload"
                        setValue={handleImageUpload}
                        value={image || imageUri}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            {paymentUrl && (
              <CopyTextButton
                className="w-full justify-between truncate bg-background px-3 py-2"
                copyIconPosition="right"
                textToCopy={paymentUrl}
                textToShow={paymentUrl}
                tooltip="Copy Payment Link"
              />
            )}

            <div className="flex gap-2">
              <Button
                className="flex-1"
                disabled={isLoading || !isFormComplete}
                onClick={handlePreview}
                type="button"
                variant="outline"
              >
                Preview
              </Button>
              <Button
                className="flex-1"
                disabled={isLoading || !isFormComplete}
                type="submit"
              >
                {isLoading ? "Creating..." : "Create"}
              </Button>
            </div>
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
      address: tokenAddress,
      // eslint-disable-next-line no-restricted-syntax
      chain: defineChain(chainId),
      client,
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
    amount: amountInWei,
    chainId,
    recipientAddress: ens.address,
    tokenAddress,
  };
}
