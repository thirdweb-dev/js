"use client";

import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { UnorderedList } from "@/components/ui/List/List";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { useThirdwebClient } from "@/constants/thirdweb.client";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Fieldset } from "components/contract-components/contract-deploy-form/common";
import { BasisPointsInput } from "components/inputs/BasisPointsInput";
import { NetworkSelectorButton } from "components/selects/NetworkSelectorButton";
import { FileInput } from "components/shared/FileInput";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import { useCsvUpload } from "hooks/useCsvUpload";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  ChevronUpIcon,
  CircleAlertIcon,
  Loader2,
  UploadIcon,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import type { Column } from "react-table";
import { toast } from "sonner";
import { sendTransaction, toWei, waitForReceipt } from "thirdweb";
import { ZERO_ADDRESS } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import {
  arbitrum,
  avalanche,
  base,
  ethereum,
  optimism,
  polygon,
} from "thirdweb/chains";
import { getContract } from "thirdweb/contract";
import { deployERC20Contract } from "thirdweb/deploys";
import {
  claimTo,
  setClaimConditions,
  transferBatch,
} from "thirdweb/extensions/erc20";
import {
  useActiveAccount,
  useActiveWalletChain,
  useSwitchActiveWalletChain,
} from "thirdweb/react";
import { upload } from "thirdweb/storage";
import * as z from "zod";

// Form schemas
const tokenInfoSchema = z.object({
  name: z.string().min(1, "Name is required"),
  symbol: z
    .string()
    .min(1, "Symbol is required")
    .max(10, "Symbol must be 10 characters or less"),
  chain: z.string().min(1, "Chain is required"),
  supply: z.string().min(1, "Supply is required"),
  description: z.string().optional(),
  image: z.any().optional(),
});

const advancedOptionsSchema = z.object({
  ownerSupply: z.string().default("100"),
  airdropSupply: z.string().default("0"),
  // Sale settings
  saleEnabled: z.boolean().default(false),
  saleSupply: z.string().default("0"),
  salePrice: z.string().default("0.1"),
  // Advanced settings
  primarySaleAddress: z.string().optional(),
  platformFeeBps: z.string().default("250"), // Using basis points (2.5% = 250 basis points)
  platformFeeRecipient: z.string().optional(),
  royaltyBps: z.string().default("0"),
  royaltyRecipient: z.string().optional(),
});

type TokenInfoValues = z.infer<typeof tokenInfoSchema>;
type AdvancedOptionsValues = z.infer<typeof advancedOptionsSchema>;

// Airdrop address input interface
export interface AirdropAddressInput {
  address: string;
  quantity: string;
  isValid?: boolean;
  resolvedAddress?: string;
}

// CSV parser for airdrop data
const csvParser = (items: AirdropAddressInput[]): AirdropAddressInput[] => {
  return items
    .map(({ address, quantity }) => ({
      address: (address || "").trim(),
      quantity: (quantity || "1").trim(),
    }))
    .filter(({ address }) => address !== "");
};

// Step indicator component
const StepIndicator = ({
  step,
  currentStep,
  label,
}: {
  step: number;
  currentStep: number;
  label: string;
}) => (
  <div className="flex flex-col items-center space-y-2">
    <div
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium",
        currentStep === step
          ? "bg-primary text-primary-foreground"
          : currentStep > step
            ? "bg-primary/20 text-primary"
            : "bg-muted text-muted-foreground"
      )}
    >
      {currentStep > step ? (
        <CheckIcon className="h-5 w-5" />
      ) : (
        <span>{step}</span>
      )}
    </div>
    <span className="text-xs font-medium">{label}</span>
  </div>
);

// CSV upload component for airdrops
interface AirdropUploadProps {
  setAirdrop: (airdrop: AirdropAddressInput[]) => void;
  onClose: () => void;
}

export const AirdropUpload: React.FC<AirdropUploadProps> = ({
  setAirdrop,
  onClose,
}) => {
  const {
    normalizeQuery,
    getInputProps,
    getRootProps,
    isDragActive,
    rawData,
    noCsv,
    reset,
    removeInvalid,
  } = useCsvUpload<AirdropAddressInput>({ csvParser });
  const paginationPortalRef = useRef<HTMLDivElement>(null);

  const normalizeData = normalizeQuery.data;

  const columns = useMemo(() => {
    return [
      {
        Header: "Address",
        accessor: ({ address, isValid }) => {
          if (isValid) {
            return address;
          }
          return (
            <ToolTipLabel
              label={
                address === ZERO_ADDRESS
                  ? "Cannot send tokens to ZERO_ADDRESS"
                  : address.startsWith("0x")
                    ? "Address is not valid"
                    : "Address couldn't be resolved"
              }
            >
              <div className="flex flex-row items-center gap-2">
                <CircleAlertIcon className="size-4 text-red-500" />
                <div className="cursor-default font-bold text-red-500">
                  {address}
                </div>
              </div>
            </ToolTipLabel>
          );
        },
      },
      {
        Header: "Quantity",
        accessor: ({ quantity }: { quantity: string }) => {
          return quantity || "1";
        },
      },
    ] as Column<AirdropAddressInput>[];
  }, []);

  if (!normalizeData) {
    return (
      <div className="flex min-h-[400px] w-full grow items-center justify-center rounded-lg border border-border">
        <Spinner className="size-10" />
      </div>
    );
  }

  const onSave = () => {
    setAirdrop(
      normalizeData.result.map((o) => ({
        address: o.resolvedAddress || o.address,
        quantity: o.quantity,
        isValid: o.isValid,
      }))
    );
    onClose();
  };

  return (
    <div className="flex w-full flex-col gap-6">
      {normalizeData.result.length && rawData.length > 0 ? (
        <>
          <div className="border rounded p-4 overflow-auto max-h-[400px]">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left p-2">Address</th>
                  <th className="text-left p-2">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {normalizeData.result.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">
                      {item.isValid ? (
                        item.address
                      ) : (
                        <div className="flex flex-row items-center gap-2">
                          <CircleAlertIcon className="size-4 text-red-500" />
                          <span className="font-bold text-red-500">
                            {item.address}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="p-2">{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-between">
            <div ref={paginationPortalRef} />
            <div className="mt-3 flex flex-row gap-2">
              <Button
                variant="outline"
                disabled={rawData.length === 0}
                onClick={() => {
                  reset();
                }}
              >
                Reset
              </Button>
              {normalizeQuery.data.invalidFound ? (
                <Button
                  disabled={rawData.length === 0}
                  onClick={() => {
                    removeInvalid();
                  }}
                >
                  Remove invalid
                </Button>
              ) : (
                <Button onClick={onSave} disabled={rawData.length === 0}>
                  Next
                </Button>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-8">
          <div className="relative aspect-[21/9] w-full">
            <div
              className={cn(
                "flex h-full cursor-pointer items-center justify-center rounded-md border border-border hover:border-primary",
                noCsv ? "bg-red-200" : "bg-background"
              )}
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col p-6">
                <UploadIcon
                  className={cn("mx-auto mb-2 size-4 text-gray-500", {
                    "text-red-500": noCsv,
                  })}
                />
                {isDragActive ? (
                  <p className="text-center text-sm font-medium">
                    Drop the files here
                  </p>
                ) : (
                  <p className="text-center text-sm font-medium">
                    {noCsv
                      ? `No valid CSV file found, make sure your CSV includes the "address" & "quantity" column.`
                      : "Drag & Drop a CSV file here"}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">Requirements</h3>
            <UnorderedList>
              <li>
                Files must contain one .csv file with an address and quantity
                column. If the quantity column is not provided, that record will
                default to 1 token.
              </li>
              <li>
                Repeated addresses will be removed and only the first found will
                be kept.
              </li>
            </UnorderedList>
          </div>
        </div>
      )}
    </div>
  );
};

export default function CreateTokenPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [tokenInfo, setTokenInfo] = useState<TokenInfoValues | null>(null);
  const [advancedOptions, setAdvancedOptions] =
    useState<AdvancedOptionsValues | null>(null);
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [lastUpdatedField, setLastUpdatedField] = useState<string | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  // Deployment status for button text
  const [deploymentStatus, setDeploymentStatus] = useState("Deploy Token");
  // Error states
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorStep, setErrorStep] = useState<string | null>(null);
  // Airdrop states
  const [showAirdropUpload, setShowAirdropUpload] = useState(false);
  const [airdropAddresses, setAirdropAddresses] = useState<
    AirdropAddressInput[]
  >([]);

  const router = useDashboardRouter();
  const activeAccount = useActiveAccount();
  const activeChain = useActiveWalletChain();
  const switchChain = useSwitchActiveWalletChain();
  const thirdwebClient = useThirdwebClient();
  const connectedAddress = activeAccount?.address;

  // Forms
  const tokenInfoForm = useForm<TokenInfoValues>({
    resolver: zodResolver(tokenInfoSchema),
    defaultValues: {
      name: "",
      symbol: "",
      chain: activeChain?.id ? activeChain.id.toString() : "Ethereum",
      supply: "1000000",
      description: "",
      image: undefined,
    },
  });

  const advancedOptionsForm = useForm<AdvancedOptionsValues>({
    resolver: zodResolver(advancedOptionsSchema),
    defaultValues: {
      ownerSupply: "100",
      airdropSupply: "0",
      saleEnabled: false,
      saleSupply: "0",
      salePrice: "0.1",
      primarySaleAddress: "",
      platformFeeBps: "250",
      platformFeeRecipient: "",
      royaltyBps: "0",
      royaltyRecipient: "",
    },
  });

  // Set the connected wallet address as the default recipient for all fields when available
  useEffect(() => {
    if (connectedAddress) {
      if (!advancedOptionsForm.getValues("primarySaleAddress")) {
        advancedOptionsForm.setValue("primarySaleAddress", connectedAddress);
      }
      if (!advancedOptionsForm.getValues("platformFeeRecipient")) {
        advancedOptionsForm.setValue("platformFeeRecipient", connectedAddress);
      }
      if (!advancedOptionsForm.getValues("royaltyRecipient")) {
        advancedOptionsForm.setValue("royaltyRecipient", connectedAddress);
      }
    }
  }, [connectedAddress, advancedOptionsForm]);

  // Set active chain as default when available
  useEffect(() => {
    if (activeChain?.id) {
      tokenInfoForm.setValue("chain", activeChain.id.toString());
    }
  }, [activeChain, tokenInfoForm]);

  // Watch for changes in percentage fields and ensure they sum to 100%
  useEffect(() => {
    if (!lastUpdatedField) return;

    const isSaleEnabled = advancedOptionsForm.getValues("saleEnabled");

    // Get current values
    let owner =
      Number.parseFloat(advancedOptionsForm.getValues("ownerSupply")) || 0;
    let airdrop =
      Number.parseFloat(advancedOptionsForm.getValues("airdropSupply")) || 0;
    let sale = isSaleEnabled
      ? Number.parseFloat(advancedOptionsForm.getValues("saleSupply")) || 0
      : 0;

    // Ensure the values are non-negative
    owner = Math.max(0, owner);
    airdrop = Math.max(0, airdrop);
    sale = Math.max(0, sale);

    // Calculate the total
    const total = owner + airdrop + sale;

    // If the total is already 100%, no adjustment needed
    if (Math.abs(total - 100) < 0.01) return;

    // Different adjustment strategies based on which field was last updated
    if (total > 100) {
      // If total exceeds 100%, reduce other fields proportionally
      if (lastUpdatedField === "ownerSupply") {
        // Reduce airdrop and sale proportionally
        if (airdrop + sale > 0) {
          const reduction = total - 100;
          const airdropRatio = airdrop / (airdrop + sale);
          const saleRatio = sale / (airdrop + sale);

          airdrop = Math.max(0, airdrop - reduction * airdropRatio);
          sale = Math.max(0, sale - reduction * saleRatio);
        } else {
          // If other fields are 0, cap owner at 100
          owner = 100;
        }
      } else if (lastUpdatedField === "airdropSupply") {
        // Reduce owner first, then sale if needed
        owner = Math.max(0, 100 - airdrop - sale);
        if (owner < 0) {
          // If owner would go negative, cap airdrop and adjust sale
          airdrop = isSaleEnabled ? Math.max(0, 100 - sale) : 100;
          owner = 0;
        }
      } else if (lastUpdatedField === "saleSupply") {
        // Reduce owner first, then airdrop if needed
        owner = Math.max(0, 100 - airdrop - sale);
        if (owner < 0) {
          // If owner would go negative, cap sale and adjust airdrop
          sale = Math.max(0, 100 - airdrop);
          owner = 0;
        }
      }
    } else if (total < 100) {
      // If total is less than 100%, increase owner to make up the difference
      owner = 100 - airdrop - sale;
    }

    // Update the form values with the adjusted percentages
    if (lastUpdatedField !== "ownerSupply") {
      advancedOptionsForm.setValue("ownerSupply", owner.toFixed(2));
    }
    if (lastUpdatedField !== "airdropSupply") {
      advancedOptionsForm.setValue("airdropSupply", airdrop.toFixed(2));
    }
    if (lastUpdatedField !== "saleSupply" && isSaleEnabled) {
      advancedOptionsForm.setValue("saleSupply", sale.toFixed(2));
    }

    // Reset the last updated field after processing
    setLastUpdatedField(null);
  }, [lastUpdatedField, advancedOptionsForm]);

  // Step handlers
  const onTokenInfoSubmit = (data: TokenInfoValues) => {
    setTokenInfo(data);
    setCurrentStep(2);
  };

  const onAdvancedOptionsSubmit = (data: AdvancedOptionsValues) => {
    // Ensure owner percentage is correctly calculated before submitting
    const airdrop = Number.parseFloat(data.airdropSupply) || 0;
    const sale = data.saleEnabled ? Number.parseFloat(data.saleSupply) || 0 : 0;
    const owner = Math.max(0, 100 - airdrop - sale);

    // Update the owner percentage to ensure total is 100%
    const finalData = {
      ...data,
      ownerSupply: owner.toFixed(2),
    };

    // Save the airdrop addresses for later use during deployment
    if (airdrop > 0 && airdropAddresses.length > 0) {
      console.log(`Saving ${airdropAddresses.length} addresses for airdrop`);
    }

    setAdvancedOptions(finalData);
    setCurrentStep(3);
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Allocation bar calculations
  const airdropPercentage =
    Number.parseFloat(advancedOptionsForm.watch("airdropSupply")) || 0;
  const salePercentage = advancedOptionsForm.watch("saleEnabled")
    ? Number.parseFloat(advancedOptionsForm.watch("saleSupply")) || 0
    : 0;

  // Ensure owner percentage makes the total exactly 100%
  const ownerPercentage = Math.max(0, 100 - airdropPercentage - salePercentage);

  // Handle CSV file upload
  const handleCsvUpload = (file: File | undefined) => {
    if (!file) {
      setCsvData([]);
      return;
    }

    // In a real implementation, you would parse the CSV here
    // For now, we'll just set a placeholder
    setCsvData([["Sample Address", "Sample Amount"]]);
    // File processing would happen here in a real implementation
  };

  const deployToken = async () => {
    if (!tokenInfo || !advancedOptions || !activeAccount || !thirdwebClient) {
      toast.error("Missing required information. Please check your inputs.");
      setErrorMessage(
        "Missing required information. Please check all form fields and try again."
      );
      setErrorStep("preparation");
      return;
    }

    setIsDeploying(true);
    setDeploymentStatus("Preparing Deployment...");
    // Reset error states when starting a new deployment
    setErrorMessage(null);
    setErrorStep(null);

    try {
      // Make sure we have the necessary URL parts
      const pathParts = window.location.pathname.split("/");
      const teamSlug = pathParts[2];
      const projectSlug = pathParts[3];

      if (!teamSlug || !projectSlug) {
        throw new Error("Invalid URL structure");
      }

      console.log("Token info:", tokenInfo);
      console.log("Advanced options:", advancedOptions);

      // Make sure we have all required token properties
      if (!tokenInfo.name || !tokenInfo.symbol || !tokenInfo.chain) {
        const missingFields = [
          !tokenInfo.name && "name",
          !tokenInfo.symbol && "symbol",
          !tokenInfo.chain && "chain",
        ]
          .filter(Boolean)
          .join(", ");

        const errorMsg = `Missing required token information: ${missingFields}`;
        setErrorMessage(errorMsg);
        setErrorStep("validation");
        throw new Error(errorMsg);
      }

      // Get the appropriate chain
      let chain;
      const chainName = tokenInfo.chain.toLowerCase();
      switch (chainName) {
        case "ethereum":
          chain = ethereum;
          break;
        case "polygon":
          chain = polygon;
          break;
        case "optimism":
          chain = optimism;
          break;
        case "arbitrum":
          chain = arbitrum;
          break;
        case "avalanche":
          chain = avalanche;
          break;
        case "base":
          chain = base;
          break;
        default:
          // Try to parse as a chain ID
          const chainId = Number.parseInt(tokenInfo.chain, 10);
          if (!isNaN(chainId)) {
            chain = defineChain(chainId);
          } else {
            const errorMsg = `Unsupported chain: ${tokenInfo.chain}`;
            setErrorMessage(errorMsg);
            setErrorStep("chain");
            throw new Error(errorMsg);
          }
      }

      console.log("Using chain:", chain);

      // Switch network if needed
      try {
        setDeploymentStatus("Switching Network...");
        await switchChain(chain);
      } catch (switchError) {
        const errorMsg = `Failed to switch network: ${switchError instanceof Error ? switchError.message : "Unknown error"}`;
        setErrorMessage(errorMsg);
        setErrorStep("network");
        throw new Error(errorMsg);
      }

      // Handle token image
      let imageUri = "";
      if (tokenInfo.image) {
        setDeploymentStatus("Uploading Token Image...");
        try {
          const imageFile = await fetch(
            typeof tokenInfo.image === "string"
              ? tokenInfo.image
              : URL.createObjectURL(tokenInfo.image as Blob)
          ).then((r) => r.blob());

          // Convert Blob to File with a name
          const file = new File([imageFile], "token-image.png", {
            type: imageFile.type || "image/png",
          });

          // Upload the image using the correct format
          const uploadResult = await upload({
            client: thirdwebClient,
            files: [file],
          });

          // Ensure imageUri is always a string
          if (uploadResult) {
            imageUri = Array.isArray(uploadResult)
              ? uploadResult[0]
              : uploadResult;
          }
        } catch (imageError) {
          console.error("Error uploading image:", imageError);
          // Continue without image, but log warning
          toast.warning("Failed to upload token image, proceeding without it");
        }
      }

      // Calculate the percentage allocations
      const totalSupply = tokenInfo.supply;
      const decimals = 18; // Standard for most tokens

      // Calculate claim conditions parameters
      const totalSupplyBigInt = BigInt(
        Math.floor(Number.parseFloat(totalSupply) * 10 ** decimals)
      );
      let saleSupply = 0n;
      let salePrice = 0;

      if (advancedOptions.saleEnabled) {
        saleSupply = BigInt(
          Math.floor(
            ((Number.parseFloat(totalSupply) *
              Number.parseFloat(advancedOptions.saleSupply)) /
              100) *
              10 ** decimals
          )
        );
        salePrice = Number.parseFloat(advancedOptions.salePrice);
      }

      // Prepare token parameters
      const tokenParams = {
        name: tokenInfo.name,
        symbol: tokenInfo.symbol,
        description: tokenInfo.description || "",
        primary_sale_recipient:
          advancedOptions.primarySaleAddress || activeAccount.address,
        platform_fee_recipient:
          advancedOptions.platformFeeRecipient || activeAccount.address,
        platform_fee_basis_points: Number.parseInt(
          advancedOptions.platformFeeBps || "250"
        ),
      };

      console.log("Deploying token with parameters:", tokenParams);

      // Deploy the token using deployERC20Contract
      try {
        setDeploymentStatus("Deploying Contract...");
        const contractAddress = await deployERC20Contract({
          chain,
          client: thirdwebClient,
          account: activeAccount,
          type: "DropERC20",
          params: tokenParams,
        });

        console.log("Token deployed to address:", contractAddress);

        // Get a reference to the deployed contract
        const contract = getContract({
          client: thirdwebClient,
          chain,
          address: contractAddress,
        });

        // Wait a moment before setting claim conditions
        setDeploymentStatus("Waiting for deployment confirmation...");
        await new Promise((resolve) => setTimeout(resolve, 3000)); // Short delay for UI feedback

        // Set up claim conditions - required for both sale and owner claiming
        try {
          setDeploymentStatus("Setting Claim Conditions...");
          console.log("Setting up claim conditions...");
          const transaction = setClaimConditions({
            contract,
            phases: [
              {
                maxClaimableSupply: totalSupplyBigInt,
                // If it's an initial sale, limit to 1 token per wallet (except for the owner)
                // If it's just for owner claiming, leave it unlimited
                maxClaimablePerWallet: advancedOptions.saleEnabled
                  ? toWei("1")
                  : toWei("0"),
                price: salePrice,
                currencyAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", // Native token
                startTime: new Date(),
                metadata: {
                  name: advancedOptions.saleEnabled
                    ? "Token Sale Phase"
                    : "Owner Claim Phase",
                },
                overrideList: [
                  { address: activeAccount.address, maxClaimable: "unlimited" },
                ],
              },
            ],
          });

          try {
            const tx = await sendTransaction({
              transaction,
              account: activeAccount,
            });

            // Wait for the claim conditions transaction to be confirmed
            setDeploymentStatus("Confirming claim conditions...");
            if (tx.transactionHash) {
              try {
                await waitForReceipt({
                  client: thirdwebClient,
                  chain,
                  transactionHash: tx.transactionHash,
                });
                console.log("Claim conditions set and confirmed successfully!");
              } catch (confirmError) {
                const errorMsg = `Failed to confirm claim conditions: ${confirmError instanceof Error ? confirmError.message : "Unknown error"}`;
                setErrorMessage(errorMsg);
                setErrorStep("claim_confirmation");
                throw new Error(errorMsg);
              }
            }
          } catch (sendError) {
            const errorMsg = `Failed to send claim conditions transaction: ${sendError instanceof Error ? sendError.message : "Unknown error"}`;
            setErrorMessage(errorMsg);
            setErrorStep("claim_transaction");
            throw new Error(errorMsg);
          }
        } catch (claimError) {
          const errorMsg = `Error setting claim conditions: ${claimError instanceof Error ? claimError.message : "Unknown error"}`;
          console.error(errorMsg, claimError);
          setErrorMessage(errorMsg);
          setErrorStep("claim_conditions");
          // dont continue if claim conditions fail
          toast.error(errorMsg);
          setIsDeploying(false);
          setDeploymentStatus("Deploy Token");
          return;
        }

        // Mint tokens to owner's wallet (owner's allocation + airdrop allocation if needed)
        const ownerSupplyPercentage =
          Number.parseFloat(advancedOptions.ownerSupply) || 0;
        const airdropSupplyPercentage =
          Number.parseFloat(advancedOptions.airdropSupply) || 0;

        // Calculate total tokens to mint to owner (their own allocation + airdrop amount if needed)
        const mintPercentage =
          ownerSupplyPercentage +
          (airdropAddresses.length > 0 ? airdropSupplyPercentage : 0);

        if (mintPercentage > 0) {
          try {
            setDeploymentStatus("Minting Tokens to Owner...");
            console.log(
              `Minting ${mintPercentage}% of tokens to owner's wallet...`
            );

            // Calculate total tokens to mint based on percentage and total supply
            const mintTokenAmount = BigInt(
              Math.floor(
                (Number.parseFloat(totalSupply) * mintPercentage) / 100
              )
            );

            console.log(
              `Minting ${mintTokenAmount} tokens to ${activeAccount.address}`
            );

            const claimTransaction = claimTo({
              contract,
              to: activeAccount.address,
              quantity: mintTokenAmount.toString(),
            });

            try {
              const mintTx = await sendTransaction({
                transaction: claimTransaction,
                account: activeAccount,
              });

              // Wait for the mint transaction to be confirmed
              setDeploymentStatus("Confirming token mint...");
              if (mintTx.transactionHash) {
                try {
                  await waitForReceipt({
                    client: thirdwebClient,
                    chain,
                    transactionHash: mintTx.transactionHash,
                  });
                  console.log(
                    `Successfully minted ${mintTokenAmount} tokens to owner's wallet`
                  );
                } catch (confirmError) {
                  const errorMsg = `Failed to confirm token mint: ${confirmError instanceof Error ? confirmError.message : "Unknown error"}`;
                  setErrorMessage(errorMsg);
                  setErrorStep("mint_confirmation");
                  throw new Error(errorMsg);
                }
              }
            } catch (mintSendError) {
              const errorMsg = `Failed to send token mint transaction: ${mintSendError instanceof Error ? mintSendError.message : "Unknown error"}`;
              setErrorMessage(errorMsg);
              setErrorStep("mint_transaction");
              throw new Error(errorMsg);
            }

            // Now airdrop from owner's wallet to recipients if needed
            if (airdropSupplyPercentage > 0 && airdropAddresses.length > 0) {
              try {
                setDeploymentStatus(
                  `Airdropping to ${airdropAddresses.length} Addresses...`
                );
                console.log(
                  `Airdropping to ${airdropAddresses.length} addresses...`
                );

                // Calculate the total token amount for airdrop based on percentage
                const totalAirdropTokens =
                  (Number.parseFloat(totalSupply) * airdropSupplyPercentage) /
                  100;

                // Calculate token amounts for each recipient proportionally based on their quantity
                // First, sum up all quantities
                const totalQuantities = airdropAddresses.reduce(
                  (sum, address) =>
                    sum + Number.parseFloat(address.quantity || "1"),
                  0
                );

                // Then, calculate each recipient's token amount based on their proportion
                const batch = airdropAddresses.map((address) => {
                  const proportion =
                    Number.parseFloat(address.quantity || "1") /
                    totalQuantities;
                  const amount = BigInt(
                    Math.floor(totalAirdropTokens * proportion)
                  );
                  return {
                    to: address.address,
                    amount: amount.toString(),
                  };
                });

                // Execute the batch transfer from owner's wallet to recipients
                const batchTransaction = transferBatch({
                  contract,
                  batch,
                });

                try {
                  const airdropTx = await sendTransaction({
                    transaction: batchTransaction,
                    account: activeAccount,
                  });

                  // Wait for the airdrop transaction to be confirmed
                  setDeploymentStatus("Confirming airdrop...");
                  if (airdropTx.transactionHash) {
                    try {
                      await waitForReceipt({
                        client: thirdwebClient,
                        chain,
                        transactionHash: airdropTx.transactionHash,
                      });
                      console.log(
                        `Successfully airdropped tokens to ${airdropAddresses.length} addresses`
                      );
                      toast.success(
                        `Successfully airdropped tokens to ${airdropAddresses.length} addresses`
                      );
                    } catch (confirmError) {
                      const errorMsg = `Failed to confirm airdrop: ${confirmError instanceof Error ? confirmError.message : "Unknown error"}`;
                      setErrorMessage(errorMsg);
                      setErrorStep("airdrop_confirmation");
                      throw new Error(errorMsg);
                    }
                  }
                } catch (airdropSendError) {
                  const errorMsg = `Failed to send airdrop transaction: ${airdropSendError instanceof Error ? airdropSendError.message : "Unknown error"}`;
                  setErrorMessage(errorMsg);
                  setErrorStep("airdrop_transaction");
                  throw new Error(errorMsg);
                }
              } catch (airdropError) {
                const errorMsg = `Error performing airdrop: ${airdropError instanceof Error ? airdropError.message : "Unknown error"}`;
                console.error(errorMsg, airdropError);
                setErrorMessage(errorMsg);
                setErrorStep("airdrop");
                toast.error(errorMsg);
                // Continue even if airdrop fails - the token is still minted to owner
              }
            }
          } catch (mintError) {
            const errorMsg = `Error minting tokens: ${mintError instanceof Error ? mintError.message : "Unknown error"}`;
            console.error(errorMsg, mintError);
            setErrorMessage(errorMsg);
            setErrorStep("mint");
            toast.error(errorMsg);
            // Continue deployment - contract is deployed but minting failed
          }
        }

        toast.success("Token deployed successfully!");
        setDeploymentStatus("Deployment Complete!");

        // Navigate to the token's page
        setTimeout(() => {
          router.push(`/${chain.id}/${contractAddress}`);
        }, 2000);
      } catch (deployError) {
        const errorMsg = `Contract deployment failed: ${deployError instanceof Error ? deployError.message : "Unknown error"}`;
        console.error(errorMsg, deployError);
        setErrorMessage(errorMsg);
        setErrorStep("deployment");
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error("Error deploying token:", error);
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to deploy token: ${errorMsg}`);
      setDeploymentStatus("Deployment Failed");
    } finally {
      setTimeout(() => {
        if (isDeploying) {
          setIsDeploying(false);
          setDeploymentStatus("Deploy Token");
        }
      }, 3000);
    }
  };

  // Render functions
  const renderStepIndicators = () => (
    <div className="flex justify-center mb-8 pt-6">
      <div className="relative flex w-full max-w-md justify-between">
        {/* Segmented lines between circles instead of a single line */}
        <div className="absolute top-5 left-0 right-0 flex justify-between">
          {/* First segment: between step 1 and 2 */}
          <div className="w-1/2 flex items-center">
            <div
              className={`h-0.5 w-full ${
                currentStep > 1 ? "bg-primary/20" : "bg-muted"
              }`}
              style={{ marginLeft: "25px", marginRight: "25px" }}
            />
          </div>
          {/* Second segment: between step 2 and 3 */}
          <div className="w-1/2 flex items-center">
            <div
              className={`h-0.5 w-full ${
                currentStep > 2 ? "bg-primary/20" : "bg-muted"
              }`}
              style={{ marginLeft: "25px", marginRight: "25px" }}
            />
          </div>
        </div>

        <StepIndicator step={1} currentStep={currentStep} label="Token Info" />
        <StepIndicator
          step={2}
          currentStep={currentStep}
          label="Token Options"
        />
        <StepIndicator step={3} currentStep={currentStep} label="Overview" />
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create Token</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Create an ERC20 token on the blockchain
      </p>

      {renderStepIndicators()}

      <Fieldset legend="Token Info">
        <Form {...tokenInfoForm}>
          <form
            onSubmit={tokenInfoForm.handleSubmit(onTokenInfoSubmit)}
            className="space-y-6"
          >
            <div className="flex flex-col md:grid md:grid-cols-[200px_1fr] gap-6">
              <FormFieldSetup
                errorMessage={
                  tokenInfoForm.formState.errors.image?.message as string
                }
                label="Image"
                isRequired={false}
              >
                <FileInput
                  accept={{ "image/*": [] }}
                  value={tokenInfoForm.watch("image")}
                  setValue={(file) =>
                    tokenInfoForm.setValue("image", file, {
                      shouldTouch: true,
                    })
                  }
                  className="rounded border-border bg-background transition-all duration-200 hover:border-active-border hover:bg-background"
                />
              </FormFieldSetup>

              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-6 lg:flex-row lg:gap-4">
                  <FormFieldSetup
                    className="grow"
                    label="Name"
                    isRequired
                    htmlFor="name"
                    errorMessage={tokenInfoForm.formState.errors.name?.message}
                  >
                    <Input
                      id="name"
                      placeholder="Token Name"
                      {...tokenInfoForm.register("name", {
                        required: "Name is required",
                      })}
                    />
                  </FormFieldSetup>

                  <FormFieldSetup
                    className="lg:max-w-[200px]"
                    label="Symbol"
                    isRequired
                    htmlFor="symbol"
                    errorMessage={
                      tokenInfoForm.formState.errors.symbol?.message
                    }
                  >
                    <Input
                      id="symbol"
                      placeholder="TKN"
                      {...tokenInfoForm.register("symbol")}
                    />
                  </FormFieldSetup>
                </div>

                <FormFieldSetup
                  label="Chain"
                  isRequired
                  htmlFor="chain"
                  errorMessage={tokenInfoForm.formState.errors.chain?.message}
                >
                  <NetworkSelectorButton
                    className="bg-background"
                    onSwitchChain={(chain) => {
                      tokenInfoForm.setValue(
                        "chain",
                        chain.chainId?.toString() || ""
                      );
                    }}
                  />
                </FormFieldSetup>

                <FormFieldSetup
                  label="Total Supply"
                  isRequired
                  htmlFor="supply"
                  errorMessage={tokenInfoForm.formState.errors.supply?.message}
                >
                  <Input
                    id="supply"
                    placeholder="1000000"
                    {...tokenInfoForm.register("supply")}
                  />
                </FormFieldSetup>

                <FormFieldSetup
                  label="Description"
                  isRequired={false}
                  htmlFor="description"
                  errorMessage={
                    tokenInfoForm.formState.errors.description?.message
                  }
                >
                  <Textarea
                    id="description"
                    placeholder="Describe your token"
                    className="min-h-[120px]"
                    {...tokenInfoForm.register("description")}
                  />
                </FormFieldSetup>
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <Button type="submit">
                Next <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </Form>
      </Fieldset>
    </div>
  );

  const renderStep2 = () => (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create Token</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Create an ERC20 token on the blockchain
      </p>

      {renderStepIndicators()}

      <Fieldset legend="Token Options">
        <Form {...advancedOptionsForm}>
          <form
            onSubmit={advancedOptionsForm.handleSubmit(onAdvancedOptionsSubmit)}
            className="space-y-6"
          >
            <div className="space-y-6">
              {/* Sell Token Option */}
              <div className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="saleEnabled"
                    checked={advancedOptionsForm.watch("saleEnabled")}
                    onCheckedChange={(checked) => {
                      advancedOptionsForm.setValue("saleEnabled", checked);
                      if (
                        checked &&
                        Number.parseFloat(
                          advancedOptionsForm.watch("saleSupply")
                        ) === 0
                      ) {
                        advancedOptionsForm.setValue("saleSupply", "10");
                        setLastUpdatedField("saleSupply");
                      } else if (!checked) {
                        advancedOptionsForm.setValue("saleSupply", "0");
                        setLastUpdatedField("saleSupply");
                      }
                    }}
                  />
                  <label
                    htmlFor="saleEnabled"
                    className="text-base font-medium cursor-pointer"
                  >
                    Launch token with Token Sale
                  </label>
                </div>
                <p className="text-sm text-muted-foreground ml-7">
                  Make sure your token is tradeable
                </p>

                {advancedOptionsForm.watch("saleEnabled") && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormFieldSetup
                      label="Sell % of supply"
                      isRequired
                      errorMessage={
                        advancedOptionsForm.formState.errors.saleSupply?.message
                      }
                    >
                      <div className="flex">
                        <Input
                          placeholder="10"
                          value={advancedOptionsForm.watch("saleSupply")}
                          onChange={(e) => {
                            advancedOptionsForm.setValue(
                              "saleSupply",
                              e.target.value
                            );
                            setLastUpdatedField("saleSupply");
                          }}
                        />
                        <span className="ml-2 self-center">%</span>
                      </div>
                    </FormFieldSetup>

                    <FormFieldSetup
                      label="Price per token"
                      isRequired
                      errorMessage={
                        advancedOptionsForm.formState.errors.salePrice?.message
                      }
                    >
                      <div className="flex">
                        <Input
                          placeholder="0.1"
                          {...advancedOptionsForm.register("salePrice")}
                        />
                        <span className="ml-2 self-center">NATIVE TOKEN</span>
                      </div>
                    </FormFieldSetup>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormFieldSetup
                  label="Send % of supply to owner"
                  isRequired
                  errorMessage={
                    advancedOptionsForm.formState.errors.ownerSupply?.message
                  }
                >
                  <div className="flex">
                    <Input
                      placeholder="100"
                      value={advancedOptionsForm.watch("ownerSupply")}
                      onChange={(e) => {
                        advancedOptionsForm.setValue(
                          "ownerSupply",
                          e.target.value
                        );
                        setLastUpdatedField("ownerSupply");
                      }}
                    />
                    <span className="ml-2 self-center">%</span>
                  </div>
                </FormFieldSetup>

                <FormFieldSetup
                  label="Airdrop % of supply to list:"
                  isRequired
                  errorMessage={
                    advancedOptionsForm.formState.errors.airdropSupply?.message
                  }
                >
                  <div className="flex">
                    <Input
                      placeholder="0"
                      value={advancedOptionsForm.watch("airdropSupply")}
                      onChange={(e) => {
                        advancedOptionsForm.setValue(
                          "airdropSupply",
                          e.target.value
                        );
                        setLastUpdatedField("airdropSupply");
                      }}
                    />
                    <span className="ml-2 self-center">%</span>
                  </div>
                </FormFieldSetup>
              </div>

              {advancedOptionsForm.watch("airdropSupply") &&
                Number.parseFloat(advancedOptionsForm.watch("airdropSupply")) >
                  0 && (
                  <div className="border border-dashed border-border rounded-md p-6">
                    {showAirdropUpload ? (
                      <AirdropUpload
                        setAirdrop={(addresses) => {
                          setAirdropAddresses(addresses);
                          setShowAirdropUpload(false);
                        }}
                        onClose={() => setShowAirdropUpload(false)}
                      />
                    ) : airdropAddresses.length > 0 ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {airdropAddresses.length} Addresses Ready for
                            Airdrop
                          </span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setShowAirdropUpload(true)}
                          >
                            Edit List
                          </Button>
                        </div>
                        <div className="border p-2 rounded max-h-40 overflow-y-auto">
                          <table className="w-full text-sm">
                            <thead className="border-b">
                              <tr>
                                <th className="text-left p-1">Address</th>
                                <th className="text-left p-1">Quantity</th>
                              </tr>
                            </thead>
                            <tbody>
                              {airdropAddresses
                                .slice(0, 5)
                                .map((address, idx) => (
                                  <tr key={idx} className="border-b">
                                    <td className="p-1 font-mono text-xs">
                                      {address.address.slice(0, 10)}...
                                      {address.address.slice(-8)}
                                    </td>
                                    <td className="p-1">{address.quantity}</td>
                                  </tr>
                                ))}
                              {airdropAddresses.length > 5 && (
                                <tr>
                                  <td
                                    colSpan={2}
                                    className="p-1 text-center text-muted-foreground"
                                  >
                                    ...and {airdropAddresses.length - 5} more
                                    addresses
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center">
                        <UploadIcon className="h-10 w-10 text-muted-foreground mb-4" />
                        <p className="text-sm text-muted-foreground mb-4">
                          Upload a CSV file with wallet addresses and token
                          amounts
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => setShowAirdropUpload(true)}
                        >
                          Upload CSV
                        </Button>
                      </div>
                    )}
                  </div>
                )}

              {/* Token Allocation Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Token Allocation</span>
                  <span className="text-muted-foreground">100.00%</span>
                </div>
                <div className="h-3 w-full bg-muted rounded-full overflow-hidden flex">
                  {/* Owner segment */}
                  {ownerPercentage > 0 && (
                    <div
                      className="h-full bg-primary"
                      style={{
                        width: `${ownerPercentage}%`,
                      }}
                    ></div>
                  )}
                  {/* Airdrop segment */}
                  {airdropPercentage > 0 && (
                    <div
                      className="h-full bg-purple-500"
                      style={{
                        width: `${airdropPercentage}%`,
                      }}
                    ></div>
                  )}
                  {/* Sale segment */}
                  {salePercentage > 0 && (
                    <div
                      className="h-full bg-green-500"
                      style={{
                        width: `${salePercentage}%`,
                      }}
                    ></div>
                  )}
                </div>
                <div className="flex gap-4 text-xs">
                  {ownerPercentage > 0 && (
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-primary rounded-full mr-1"></div>
                      <span>Owner: {ownerPercentage.toFixed(2)}%</span>
                    </div>
                  )}
                  {airdropPercentage > 0 && (
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-purple-500 rounded-full mr-1"></div>
                      <span>Airdrop: {airdropPercentage.toFixed(2)}%</span>
                    </div>
                  )}
                  {salePercentage > 0 && (
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                      <span>Initial Sale: {salePercentage.toFixed(2)}%</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Button
                type="button"
                variant="outline"
                className="flex w-full justify-between"
                onClick={() => setLastUpdatedField("showAdvancedSettings")}
              >
                <span>Advanced Settings</span>
                {lastUpdatedField === "showAdvancedSettings" && (
                  <ChevronUpIcon className="h-4 w-4" />
                )}
              </Button>

              {lastUpdatedField === "showAdvancedSettings" && (
                <div className="border rounded-md mt-2 p-4 space-y-6">
                  {/* Primary Sale Settings - only show if sale is enabled */}
                  {advancedOptionsForm.watch("saleEnabled") && (
                    <div>
                      <h3 className="text-base font-medium mb-4">
                        Primary Sales
                      </h3>
                      <FormFieldSetup
                        label="Recipient Address"
                        isRequired={false}
                        errorMessage={
                          advancedOptionsForm.formState.errors
                            .primarySaleAddress?.message
                        }
                        helperText="The wallet address that should receive the revenue from initial sales of the assets."
                      >
                        <SolidityInput
                          solidityType="address"
                          {...advancedOptionsForm.register(
                            "primarySaleAddress"
                          )}
                        />
                      </FormFieldSetup>
                    </div>
                  )}

                  {/* Platform Fee Settings */}
                  <div>
                    <h3 className="text-base font-medium mb-4">
                      Platform Fees
                    </h3>
                    <div className="flex flex-col gap-4 md:flex-row">
                      <FormFieldSetup
                        className="grow"
                        label="Recipient Address"
                        isRequired={false}
                        errorMessage={
                          advancedOptionsForm.formState.errors
                            .platformFeeRecipient?.message
                        }
                        helperText="The wallet address that should receive platform fees."
                      >
                        <SolidityInput
                          solidityType="address"
                          {...advancedOptionsForm.register(
                            "platformFeeRecipient"
                          )}
                        />
                      </FormFieldSetup>

                      <FormFieldSetup
                        label="Percentage"
                        isRequired
                        className="shrink-0 md:max-w-[150px]"
                        errorMessage={
                          advancedOptionsForm.formState.errors.platformFeeBps
                            ?.message
                        }
                      >
                        <BasisPointsInput
                          value={Number(
                            advancedOptionsForm.watch("platformFeeBps")
                          )}
                          onChange={(value) =>
                            advancedOptionsForm.setValue(
                              "platformFeeBps",
                              value.toString(),
                              {
                                shouldTouch: true,
                              }
                            )
                          }
                        />
                      </FormFieldSetup>
                    </div>
                  </div>

                  {/* Royalty Settings */}
                  <div>
                    <h3 className="text-base font-medium mb-4">Royalties</h3>
                    <div className="flex flex-col gap-4 md:flex-row">
                      <FormFieldSetup
                        className="grow"
                        label="Recipient Address"
                        isRequired={false}
                        errorMessage={
                          advancedOptionsForm.formState.errors.royaltyRecipient
                            ?.message
                        }
                        helperText="The wallet address that should receive royalties from secondary sales."
                      >
                        <SolidityInput
                          solidityType="address"
                          {...advancedOptionsForm.register("royaltyRecipient")}
                        />
                      </FormFieldSetup>

                      <FormFieldSetup
                        label="Percentage"
                        isRequired
                        className="shrink-0 md:max-w-[150px]"
                        errorMessage={
                          advancedOptionsForm.formState.errors.royaltyBps
                            ?.message
                        }
                      >
                        <BasisPointsInput
                          value={Number(
                            advancedOptionsForm.watch("royaltyBps")
                          )}
                          onChange={(value) =>
                            advancedOptionsForm.setValue(
                              "royaltyBps",
                              value.toString(),
                              {
                                shouldTouch: true,
                              }
                            )
                          }
                        />
                      </FormFieldSetup>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between pt-6">
              <Button type="button" variant="outline" onClick={goBack}>
                <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button type="submit">
                Next <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </Form>
      </Fieldset>
    </div>
  );

  const renderStep3 = () => (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create Token</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Create an ERC20 token on the blockchain
      </p>

      {renderStepIndicators()}

      <Fieldset legend="Overview">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4 flex justify-between">
              Token Info
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentStep(1)}
              >
                Edit
              </Button>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">Image:</p>
                {tokenInfo?.image ? (
                  <div className="w-16 h-16 rounded-md overflow-hidden">
                    <img
                      src={
                        typeof tokenInfo.image === "string"
                          ? tokenInfo.image
                          : URL.createObjectURL(tokenInfo.image as File)
                      }
                      alt="Token"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                    <UploadIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div></div>

              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">Name:</p>
                <p>{tokenInfo?.name}</p>
              </div>

              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">Symbol:</p>
                <p>{tokenInfo?.symbol}</p>
              </div>

              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">Chain:</p>
                <p>{tokenInfo?.chain}</p>
              </div>

              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">Supply:</p>
                <p>{tokenInfo?.supply}</p>
              </div>

              <div className="space-y-2 col-span-2">
                <p className="text-muted-foreground text-sm">Description:</p>
                <p>{tokenInfo?.description || "No description provided"}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium mb-4 flex justify-between">
              Token Options
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentStep(2)}
              >
                Edit
              </Button>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">Owner Supply:</p>
                <p>{advancedOptions?.ownerSupply}%</p>
              </div>

              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">Airdrop:</p>
                <p>{advancedOptions?.airdropSupply}%</p>
              </div>

              {advancedOptions?.saleEnabled && (
                <>
                  <div className="space-y-2">
                    <p className="text-muted-foreground text-sm">
                      Initial Sale:
                    </p>
                    <p>{advancedOptions?.saleSupply}%</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-muted-foreground text-sm">Sale Price:</p>
                    <p>{advancedOptions?.salePrice} USD per token</p>
                  </div>
                </>
              )}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium mb-4">Advanced Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              {advancedOptions?.primarySaleAddress && (
                <div className="space-y-2">
                  <p className="text-muted-foreground text-sm">
                    Primary Sales:
                  </p>
                  <p>{advancedOptions?.primarySaleAddress}</p>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">Platform Fees:</p>
                <p>
                  {(
                    Number(advancedOptions?.platformFeeBps || 250) / 100
                  ).toFixed(2)}
                  %
                </p>
              </div>

              {advancedOptions?.royaltyBps &&
                Number(advancedOptions.royaltyBps) > 0 && (
                  <div className="space-y-2">
                    <p className="text-muted-foreground text-sm">
                      Royalty Percentage:
                    </p>
                    <p>
                      {(Number(advancedOptions?.royaltyBps) / 100).toFixed(2)}%
                    </p>
                  </div>
                )}

              {advancedOptions?.royaltyRecipient && (
                <div className="space-y-2">
                  <p className="text-muted-foreground text-sm">
                    Royalty Recipient:
                  </p>
                  <p>{advancedOptions?.royaltyRecipient}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between pt-6">
            <Button type="button" variant="outline" onClick={goBack}>
              <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back
            </Button>
            <div className="flex flex-col items-end">
              {errorMessage && (
                <div className="text-red-500 text-sm mb-2 max-w-md text-right">
                  {errorStep && (
                    <span className="font-bold">
                      {errorStep.replace("_", " ").toUpperCase()}:{" "}
                    </span>
                  )}
                  {errorMessage}
                  {errorStep === "claim_conditions" && (
                    <div className="mt-1 text-xs text-amber-500">
                      <p>Try these fixes:</p>
                      <ul className="list-disc list-inside">
                        <li>Check if you have enough native tokens for gas</li>
                        <li>Wait a few minutes and try again</li>
                        <li>Verify that the parameters are valid</li>
                      </ul>
                    </div>
                  )}
                  {errorStep === "deployment" && (
                    <div className="mt-1 text-xs text-amber-500">
                      <p>Try these fixes:</p>
                      <ul className="list-disc list-inside">
                        <li>Check your wallet connection</li>
                        <li>Make sure you have enough funds for deployment</li>
                        <li>Try a different browser or network</li>
                      </ul>
                    </div>
                  )}
                </div>
              )}
              <Button
                type="button"
                className={cn(
                  "bg-primary hover:bg-primary/90",
                  errorStep && "bg-red-500 hover:bg-red-600"
                )}
                onClick={deployToken}
                disabled={isDeploying}
              >
                {isDeploying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    {deploymentStatus}
                  </>
                ) : (
                  <>
                    {deploymentStatus} <CheckIcon className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </Fieldset>
    </div>
  );

  // Render the appropriate step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return renderStep1();
    }
  };

  return <div className="w-full py-8">{renderCurrentStep()}</div>;
}
