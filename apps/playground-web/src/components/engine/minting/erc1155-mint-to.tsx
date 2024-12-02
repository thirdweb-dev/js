"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { THIRDWEB_CLIENT } from "@/lib/client";
import { useState } from "react";
import { baseSepolia } from "thirdweb/chains";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { upload } from "thirdweb/storage";
import { ClaimTransactionResults as ClaimTransactionResultsComponent } from "./TransactionResults";

interface ClaimTransactionResults {
  queueId: string;
  status: "Queued" | "Sent" | "Mined" | "error";
  transactionHash?: string;
  blockExplorerUrl?: string;
  errorMessage: "Error" | undefined;
  toAddress: string;
  amount: string;
  timestamp?: number;
  chainId: number;
  network: "Ethereum" | "Base Sep" | "OP Sep";
}
// Wasn't sure if this was needed, but added just in case.
const resolveIpfsUrl = (ipfsUrl: string) => {
  if (!ipfsUrl) return "";
  if (ipfsUrl.startsWith("ipfs://")) {
    return ipfsUrl.replace("ipfs://", "https://ipfs.io/ipfs/");
  }
  return ipfsUrl;
};

export function ERC1155MintTo() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<ClaimTransactionResults[]>([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [supply, setSupply] = useState("1");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const account = useActiveAccount();

  const pollTransactionStatus = async (queueId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(
          `/api/transaction-status?queueId=${queueId}`,
        );
        const status = await response.json();

        setResults((prevResults) =>
          prevResults.map((result) =>
            result.queueId === queueId
              ? {
                  ...result,
                  ...status,
                  status: status.status === "mined" ? "Mined" : status.status,
                }
              : result,
          ),
        );

        if (status.status === "Mined" || status.status === "error") {
          clearInterval(pollInterval);
        }
      } catch (error) {
        console.error("Error polling status:", error);
        clearInterval(pollInterval);
      }
    }, 2000);

    setTimeout(() => clearInterval(pollInterval), 5 * 60 * 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account || !name || !description || !image || !supply) {
      alert("Please fill in all fields.");
      return;
    }

    const supplyNum = Number.parseInt(supply);
    if (Number.isNaN(supplyNum) || supplyNum < 1) {
      alert("Supply must be a positive number.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/mintTo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiver: account.address,
          metadataWithSupply: {
            metadata: {
              name,
              description,
              image,
            },
            supply,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();

      // Add the initial queued transaction to results
      setResults((prevResults) => [...prevResults, result]);

      // Start polling for status updates
      pollTransactionStatus(result.queueId);
    } catch (error) {
      console.error("Error:", error);
      setResults([
        {
          queueId: "",
          status: "error",
          errorMessage: "Error",
          toAddress: "",
          amount: "",
          chainId: 84532,
          network: "Base Sep",
        },
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const uploadResult = await upload({
        client: THIRDWEB_CLIENT,
        files: [file],
      });
      setImage(uploadResult);
      setImageFile(file);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex w-full flex-col gap-8 md:flex-row">
        {/* Form Section */}
        <div className="flex flex-col items-center justify-center">
          <ConnectButton client={THIRDWEB_CLIENT} chain={baseSepolia} />
          {account && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>Address</Label>
                  <Input
                    id="address"
                    type="text"
                    value={account.address}
                    disabled
                    className="text-sm sm:text-base"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="NFT Name"
                      className="text-sm sm:text-base"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input
                      id="description"
                      placeholder="NFT Description"
                      className="text-sm sm:text-base"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Image Upload</Label>
                    <div className="flex flex-col gap-2">
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        className="text-sm sm:text-base"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                      />
                      {imageFile && (
                        <div className="text-muted-foreground text-sm">
                          Selected: {imageFile.name}
                        </div>
                      )}
                      {isUploading && (
                        <div className="text-muted-foreground text-sm">
                          Uploading...
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label>Supply</Label>
                    <Input
                      id="supply"
                      type="number"
                      min="1"
                      placeholder="1"
                      className="text-sm sm:text-base"
                      value={supply}
                      onChange={(e) => setSupply(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Minting..." : "Mint NFT"}
              </Button>
              <p className="max-w-[600px]">
                thirdweb Engine Playground{" "}
                <a
                  href="https://thirdweb.com/base-sepolia-testnet/0x8CD193648f5D4E8CD9fD0f8d3865052790A680f6/nfts"
                  target="_blank"
                  className="text-blue-500"
                  rel="noreferrer"
                >
                  Minting Contract
                </a>
              </p>
            </form>
          )}
        </div>

        {/* Image Preview Section */}
        {account && (
          <div className="mt-6 w-full max-w-[400px]">
            {image ? (
              <img
                src={resolveIpfsUrl(image)}
                alt="NFT Preview"
                className="h-[400px] w-full rounded-lg border border-border object-contain"
                onError={(e) => {
                  console.error("Error loading image:", image);
                  const target = e.target as HTMLImageElement;
                  target.src =
                    'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';
                }}
              />
            ) : (
              <div className="flex h-[400px] w-full items-center justify-center rounded-lg border border-border bg-muted">
                <p className="text-muted-foreground">
                  Upload an image to see preview
                </p>
              </div>
            )}
            {name && (
              <div className="mt-4 text-center">
                <h3 className="font-semibold text-lg">{name}</h3>
                {description && (
                  <p className="mt-1 text-muted-foreground text-sm">
                    {description}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <ClaimTransactionResultsComponent results={results} />
    </div>
  );
}
