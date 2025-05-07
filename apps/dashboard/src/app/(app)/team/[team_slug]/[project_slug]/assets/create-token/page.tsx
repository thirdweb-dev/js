"use client";

import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  UploadIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Fieldset } from "components/contract-components/contract-deploy-form/common";
import { FileInput } from "components/shared/FileInput";
import { BasisPointsInput } from "components/inputs/BasisPointsInput";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import { Form } from "@/components/ui/form";
import { NetworkSelectorButton } from "components/selects/NetworkSelectorButton";
import { useActiveAccount, useSwitchActiveWalletChain } from "thirdweb/react";
import { deployContractfromDeployMetadata } from "thirdweb/deploys";
import { useThirdwebClient } from "@/constants/thirdweb.client";
import { defineChain } from "thirdweb/chains";
import { toast } from "sonner";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { upload } from "thirdweb/storage";

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

export default function CreateTokenPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [tokenInfo, setTokenInfo] = useState<TokenInfoValues | null>(null);
  const [advancedOptions, setAdvancedOptions] =
    useState<AdvancedOptionsValues | null>(null);
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [lastUpdatedField, setLastUpdatedField] = useState<string | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const router = useDashboardRouter();
  const params = router.params;
  const activeAccount = useActiveAccount();
  const switchChain = useSwitchActiveWalletChain();
  const thirdwebClient = useThirdwebClient();
  const connectedAddress = activeAccount?.address;

  // Forms
  const tokenInfoForm = useForm<TokenInfoValues>({
    resolver: zodResolver(tokenInfoSchema),
    defaultValues: {
      name: "",
      symbol: "",
      chain: "Ethereum",
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

  // Watch for changes in percentage fields and ensure they sum to 100%
  useEffect(() => {
    if (!lastUpdatedField) return;

    const isSaleEnabled = advancedOptionsForm.getValues("saleEnabled");

    // Get current values
    let owner = parseFloat(advancedOptionsForm.getValues("ownerSupply")) || 0;
    let airdrop =
      parseFloat(advancedOptionsForm.getValues("airdropSupply")) || 0;
    let sale = isSaleEnabled
      ? parseFloat(advancedOptionsForm.getValues("saleSupply")) || 0
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
    const airdrop = parseFloat(data.airdropSupply) || 0;
    const sale = data.saleEnabled ? parseFloat(data.saleSupply) || 0 : 0;
    const owner = Math.max(0, 100 - airdrop - sale);

    // Update the owner percentage to ensure total is 100%
    const finalData = {
      ...data,
      ownerSupply: owner.toFixed(2),
    };

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
    parseFloat(advancedOptionsForm.watch("airdropSupply")) || 0;
  const salePercentage = advancedOptionsForm.watch("saleEnabled")
    ? parseFloat(advancedOptionsForm.watch("saleSupply")) || 0
    : 0;

  // Ensure owner percentage makes the total exactly 100%
  const ownerPercentage = Math.max(0, 100 - airdropPercentage - salePercentage);

  // Handle CSV file upload
  const handleCsvUpload = (file: File | undefined) => {
    setCsvData(file || []);
    // File processing would happen here in a real implementation
  };

  const deployToken = async () => {
    if (!tokenInfo || !advancedOptions || !activeAccount || !thirdwebClient) {
      toast.error("Missing required information. Please check your inputs.");
      return;
    }

    setIsDeploying(true);

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
        throw new Error("Missing required token information");
      }

      // Calculate supply percentages - use totalSupply property
      const totalSupply =
        parseFloat(tokenInfo.supply || "0") *
        Math.pow(10, parseInt(advancedOptions.platformFeeBps || "18"));

      const ownerPercentage =
        parseFloat(advancedOptions.ownerSupply || "100") / 100;
      const airdropPercentage =
        parseFloat(advancedOptions.airdropSupply || "0") / 100;
      const salePercentage = advancedOptions.saleEnabled
        ? parseFloat(advancedOptions.saleSupply || "0") / 100
        : 0;

      // Get wallet chain
      const chainId = parseInt(tokenInfo.chain, 10);
      const walletChain = isNaN(chainId)
        ? defineChain({ name: tokenInfo.chain.toLowerCase() })
        : defineChain({ chainId });

      // Switch network if needed
      await switchChain({ chain: walletChain });

      // Prepare initialization parameters with fallbacks for all values
      const initializeParams = {
        name: tokenInfo.name,
        symbol: tokenInfo.symbol,
        decimals: parseInt(advancedOptions.platformFeeBps || "18"),
        primary_sale_recipient:
          advancedOptions.primarySaleAddress || activeAccount.address,
        platform_fee_recipient:
          advancedOptions.platformFeeRecipient || activeAccount.address,
        platform_fee_basis_points: parseInt(
          advancedOptions.platformFeeBps || "0"
        ),
      };

      // Print out what we're going to deploy
      console.log("Deploying with parameters:", initializeParams);

      // Handle token image
      let imageUri = "";
      if (tokenInfo.image) {
        try {
          const imageFile = await fetch(tokenInfo.image).then((r) => r.blob());
          imageUri = await upload({
            client: thirdwebClient,
            data: [imageFile],
          });
        } catch (err) {
          console.error("Error uploading image:", err);
        }
      }

      // Deploy the contract
      const contractAddress = await deployContractfromDeployMetadata({
        client: thirdwebClient,
        signer: activeAccount,
        contractMetadata: {
          name: tokenInfo.name,
          description: tokenInfo.description || "",
          image: imageUri,
          external_link: tokenInfo.externalLink || "",
        },
        publishMetadata: {
          name: "TokenERC20",
          publisherAddress: activeAccount.address,
        },
        constructorParams: initializeParams,
      });

      toast.success("Token deployed successfully!");

      // Navigate to the token's page
      router.push(
        `/team/${teamSlug}/${projectSlug}/contracts/${contractAddress}`
      );
    } catch (error) {
      console.error("Error deploying token:", error);
      toast.error(
        `Failed to deploy token: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsDeploying(false);
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
                        chain.name || chain.chainId?.toString() || ""
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
                        parseFloat(advancedOptionsForm.watch("saleSupply")) ===
                          0
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
                        <span className="ml-2 self-center">USD</span>
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
                parseFloat(advancedOptionsForm.watch("airdropSupply")) > 0 && (
                  <div className="border border-dashed border-border rounded-md p-6 flex flex-col items-center justify-center text-center">
                    <UploadIcon className="h-10 w-10 text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload a CSV file with wallet addresses and amounts
                    </p>
                    <FileInput
                      accept={{ "text/csv": [] }}
                      value={csvData.map((row) => row[0]) || undefined}
                      setValue={handleCsvUpload}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      onClick={() =>
                        alert("CSV upload functionality not implemented")
                      }
                    >
                      Upload CSV
                    </Button>
                    {csvData.length > 0 && (
                      <p className="mt-2 text-sm font-medium">
                        {csvData[0][0]}
                      </p>
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
            <Button
              type="button"
              className="bg-primary hover:bg-primary/90"
              onClick={deployToken}
              disabled={isDeploying}
            >
              {isDeploying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deploying
                  Token...
                </>
              ) : (
                <>
                  Deploy Token <CheckIcon className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
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
