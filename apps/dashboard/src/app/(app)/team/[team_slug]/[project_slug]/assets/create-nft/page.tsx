"use client";

import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useThirdwebClient } from "@/constants/thirdweb.client";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Fieldset } from "components/contract-components/contract-deploy-form/common";
import { BasisPointsInput } from "components/inputs/BasisPointsInput";
import { NetworkSelectorButton } from "components/selects/NetworkSelectorButton";
import { FileInput } from "components/shared/FileInput";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ImageIcon,
  Loader2Icon,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { deployERC721Contract } from "thirdweb/deploys";
import { setClaimConditions } from "thirdweb/extensions/erc721";
import {
  useActiveAccount,
  useActiveWalletChain,
  useSwitchActiveWalletChain,
} from "thirdweb/react";
import { upload } from "thirdweb/storage";
import { sendTransaction } from "thirdweb/transaction";
import * as z from "zod";

// Form schemas
const collectionInfoSchema = z.object({
  name: z.string().min(1, "Name is required"),
  symbol: z
    .string()
    .min(1, "Symbol is required")
    .max(10, "Symbol must be 10 characters or less"),
  chain: z.string().min(1, "Chain is required"),
  description: z.string().optional(),
  asCollection: z.boolean().default(true),
  image: z.any().optional(),
});

const mintSettingsSchema = z.object({
  price: z.string().default("0.1"),
  supply: z.string().min(1, "Supply is required"),
  initialMint: z.string().default("1"),
  // Royalty settings
  royaltyPercentage: z.string().default("0"),
  royaltyAddress: z.string().optional(),
  collectionType: z.enum(["new", "existing", "project"]).default("new"),
  platformFeeBps: z.string().default("250"), // Using basis points (2.5% = 250 basis points)
});

type CollectionInfoValues = z.infer<typeof collectionInfoSchema>;
type MintSettingsValues = z.infer<typeof mintSettingsSchema>;

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

export default function CreateNFTPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [collectionInfo, setCollectionInfo] =
    useState<CollectionInfoValues | null>(null);
  const [mintSettings, setMintSettings] = useState<MintSettingsValues | null>(
    null
  );
  const [showRoyaltySettings, setShowRoyaltySettings] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const router = useDashboardRouter();
  const activeAccount = useActiveAccount();
  const activeChain = useActiveWalletChain();
  const switchChain = useSwitchActiveWalletChain();
  const thirdwebClient = useThirdwebClient();
  const connectedAddress = activeAccount?.address;

  // Forms
  const collectionInfoForm = useForm<CollectionInfoValues>({
    resolver: zodResolver(collectionInfoSchema),
    defaultValues: {
      name: "",
      symbol: "",
      chain: activeChain?.id ? activeChain.id.toString() : "Ethereum",
      description: "",
      asCollection: true,
      image: undefined,
    },
  });

  const mintSettingsForm = useForm<MintSettingsValues>({
    resolver: zodResolver(mintSettingsSchema),
    defaultValues: {
      price: "0.1",
      supply: "10000",
      initialMint: "1",
      royaltyPercentage: "0",
      royaltyAddress: "",
      collectionType: "new",
      platformFeeBps: "250",
    },
  });

  // Step handlers
  const onCollectionInfoSubmit = (data: CollectionInfoValues) => {
    setCollectionInfo(data);
    setCurrentStep(2);
  };

  const onMintSettingsSubmit = (data: MintSettingsValues) => {
    setMintSettings(data);
    setCurrentStep(3);
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
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

        <StepIndicator step={1} currentStep={currentStep} label="Basic Info" />
        <StepIndicator step={2} currentStep={currentStep} label="Options" />
        <StepIndicator step={3} currentStep={currentStep} label="Overview" />
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create NFT Collection</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Create a collection of NFTs with shared properties
      </p>

      {renderStepIndicators()}

      <Fieldset legend="Basic Info">
        <div className="flex items-center space-x-2 mb-6">
          <Switch
            id="asCollection"
            checked={collectionInfoForm.watch("asCollection")}
            onCheckedChange={(checked) =>
              collectionInfoForm.setValue("asCollection", checked)
            }
          />
          <label htmlFor="asCollection" className="font-medium cursor-pointer">
            Create as collection
          </label>
        </div>

        <Form {...collectionInfoForm}>
          <form
            onSubmit={collectionInfoForm.handleSubmit(onCollectionInfoSubmit)}
            className="space-y-6"
          >
            <div className="flex flex-col md:grid md:grid-cols-[200px_1fr] gap-6">
              <FormFieldSetup
                errorMessage={
                  collectionInfoForm.formState.errors.image?.message as string
                }
                label="Image"
                isRequired={false}
              >
                <FileInput
                  accept={{ "image/*": [] }}
                  value={collectionInfoForm.watch("image")}
                  setValue={(file) =>
                    collectionInfoForm.setValue("image", file, {
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
                    errorMessage={
                      collectionInfoForm.formState.errors.name?.message
                    }
                  >
                    <Input
                      id="name"
                      placeholder="Collection Name"
                      {...collectionInfoForm.register("name", {
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
                      collectionInfoForm.formState.errors.symbol?.message
                    }
                  >
                    <Input
                      id="symbol"
                      placeholder="NFT"
                      {...collectionInfoForm.register("symbol")}
                    />
                  </FormFieldSetup>
                </div>

                <FormFieldSetup
                  label="Chain"
                  isRequired
                  htmlFor="chain"
                  errorMessage={
                    collectionInfoForm.formState.errors.chain?.message
                  }
                >
                  <NetworkSelectorButton
                    className="bg-background"
                    onSwitchChain={(chain) => {
                      collectionInfoForm.setValue(
                        "chain",
                        chain.chainId?.toString() || ""
                      );
                    }}
                  />
                </FormFieldSetup>

                <FormFieldSetup
                  label="Description"
                  isRequired={false}
                  htmlFor="description"
                  errorMessage={
                    collectionInfoForm.formState.errors.description?.message
                  }
                >
                  <Textarea
                    id="description"
                    placeholder="Describe your NFT collection"
                    className="min-h-[120px]"
                    {...collectionInfoForm.register("description")}
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
      <h1 className="text-2xl font-bold mb-6">Create NFT Collection</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Create a collection of NFTs with shared properties
      </p>

      {renderStepIndicators()}

      <Fieldset legend="Options">
        <Form {...mintSettingsForm}>
          <form
            onSubmit={mintSettingsForm.handleSubmit(onMintSettingsSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-base font-medium">Price</h3>
                <FormFieldSetup
                  label="Price per NFT"
                  isRequired
                  errorMessage={
                    mintSettingsForm.formState.errors.price?.message
                  }
                >
                  <div className="flex">
                    <Input
                      placeholder="0.1"
                      {...mintSettingsForm.register("price")}
                    />
                    <Select defaultValue="ETH">
                      <SelectTrigger className="w-[80px] ml-2">
                        <SelectValue placeholder="ETH" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ETH">ETH</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </FormFieldSetup>
              </div>

              <div className="space-y-4">
                <h3 className="text-base font-medium">Supply</h3>
                <FormFieldSetup
                  label="Maximum Supply"
                  isRequired
                  errorMessage={
                    mintSettingsForm.formState.errors.supply?.message
                  }
                  helperText="The maximum number of NFTs that can be minted in this collection"
                >
                  <Input
                    placeholder="10000"
                    {...mintSettingsForm.register("supply")}
                  />
                </FormFieldSetup>

                <FormFieldSetup
                  label="Initial Mint"
                  isRequired
                  errorMessage={
                    mintSettingsForm.formState.errors.initialMint?.message
                  }
                  helperText="The number of NFTs to mint immediately upon creation"
                >
                  <Input
                    placeholder="1"
                    {...mintSettingsForm.register("initialMint")}
                  />
                </FormFieldSetup>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-base font-medium">Collection</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-start space-x-2">
                        <div className="flex h-5 items-center">
                          <input
                            id="createNew"
                            name="collectionOption"
                            type="radio"
                            className="h-4 w-4 rounded-full border-gray-300"
                            defaultChecked
                            onChange={() =>
                              mintSettingsForm.setValue("collectionType", "new")
                            }
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="createNew" className="font-medium">
                            Create new collection
                          </label>
                          <p className="text-muted-foreground">
                            Create a new collection for this NFT with its own
                            contract.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="flex items-start space-x-2">
                        <div className="flex h-5 items-center">
                          <input
                            id="existing"
                            name="collectionOption"
                            type="radio"
                            className="h-4 w-4 rounded-full border-gray-300"
                            onChange={() =>
                              mintSettingsForm.setValue(
                                "collectionType",
                                "existing"
                              )
                            }
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="existing" className="font-medium">
                            Add to existing collection
                          </label>
                          <p className="text-muted-foreground">
                            Add this NFT to one of your existing collections.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="flex items-start space-x-2">
                        <div className="flex h-5 items-center">
                          <input
                            id="projectLevel"
                            name="collectionOption"
                            type="radio"
                            className="h-4 w-4 rounded-full border-gray-300"
                            onChange={() =>
                              mintSettingsForm.setValue(
                                "collectionType",
                                "project"
                              )
                            }
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="projectLevel" className="font-medium">
                            Add to project-level collection
                          </label>
                          <p className="text-muted-foreground">
                            Add this NFT to the default collection for your
                            project.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-base font-medium">Fees</h3>
                <FormFieldSetup
                  label="Platform Fees"
                  isRequired
                  helperText="A 2.5% platform fee is deducted from each primary sale"
                  errorMessage={
                    mintSettingsForm.formState.errors.platformFeeBps?.message
                  }
                >
                  <div className="flex">
                    <Input value="2.5" readOnly />
                    <span className="ml-2 self-center">%</span>
                  </div>
                </FormFieldSetup>
              </div>
            </div>

            {/* Royalty Settings Section */}
            <div className="mt-8">
              <Button
                type="button"
                variant="outline"
                className="flex w-full justify-between"
                onClick={() => setShowRoyaltySettings(!showRoyaltySettings)}
              >
                <span>Royalty Settings</span>
                {showRoyaltySettings ? (
                  <ChevronUpIcon className="h-4 w-4" />
                ) : (
                  <ChevronDownIcon className="h-4 w-4" />
                )}
              </Button>

              {showRoyaltySettings && (
                <div className="border rounded-md mt-2 p-4 space-y-6">
                  <div className="flex flex-col gap-4 md:flex-row">
                    <FormFieldSetup
                      className="grow"
                      label="Royalty Recipient Address"
                      isRequired={false}
                      errorMessage={
                        mintSettingsForm.formState.errors.royaltyAddress
                          ?.message
                      }
                      helperText="Address that will receive royalties from secondary sales"
                    >
                      <SolidityInput
                        solidityType="address"
                        {...mintSettingsForm.register("royaltyAddress")}
                      />
                    </FormFieldSetup>

                    <FormFieldSetup
                      label="Royalty Percentage"
                      isRequired
                      className="shrink-0 md:max-w-[150px]"
                      errorMessage={
                        mintSettingsForm.formState.errors.royaltyPercentage
                          ?.message
                      }
                    >
                      <BasisPointsInput
                        value={Number(
                          mintSettingsForm.watch("royaltyPercentage")
                        )}
                        onChange={(value) =>
                          mintSettingsForm.setValue(
                            "royaltyPercentage",
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
      <h1 className="text-2xl font-bold mb-6">Create NFT Collection</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Create a collection of NFTs with shared properties
      </p>

      {renderStepIndicators()}

      <Fieldset legend="Overview">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4 flex justify-between">
              Basic Info
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
                {collectionInfo?.image ? (
                  <div className="w-16 h-16 rounded-md overflow-hidden">
                    <img
                      src={
                        typeof collectionInfo.image === "string"
                          ? collectionInfo.image
                          : URL.createObjectURL(collectionInfo.image as File)
                      }
                      alt="Collection"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div></div>

              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">Name:</p>
                <p>{collectionInfo?.name}</p>
              </div>

              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">Symbol:</p>
                <p>{collectionInfo?.symbol}</p>
              </div>

              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">Chain:</p>
                <p>{collectionInfo?.chain}</p>
              </div>

              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">Type:</p>
                <p>
                  {collectionInfo?.asCollection ? "Collection" : "Single NFT"}
                </p>
              </div>

              <div className="space-y-2 col-span-2">
                <p className="text-muted-foreground text-sm">Description:</p>
                <p>
                  {collectionInfo?.description || "No description provided"}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium mb-4 flex justify-between">
              Options
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
                <p className="text-muted-foreground text-sm">Price:</p>
                <p>{mintSettings?.price} ETH</p>
              </div>

              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">Maximum Supply:</p>
                <p>{mintSettings?.supply}</p>
              </div>

              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">Initial Mint:</p>
                <p>{mintSettings?.initialMint}</p>
              </div>
              {/* 
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">Collection:</p>
                <p>
                  {mintSettings?.collectionType === "new" && "New Collection"}
                  {mintSettings?.collectionType === "existing" &&
                    "Existing Collection"}
                  {mintSettings?.collectionType === "project" &&
                    "Project Collection"}
                </p>
              </div> */}

              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">Platform Fee:</p>
                <p>
                  {(Number(mintSettings?.platformFeeBps || 250) / 100).toFixed(
                    2
                  )}
                  %
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium mb-4">Royalty Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">
                  Royalty Percentage:
                </p>
                <p>
                  {(Number(mintSettings?.royaltyPercentage || 0) / 100).toFixed(
                    2
                  )}
                  %
                </p>
              </div>

              {mintSettings?.royaltyAddress && (
                <div className="space-y-2">
                  <p className="text-muted-foreground text-sm">
                    Royalty Recipient:
                  </p>
                  <p>{mintSettings?.royaltyAddress}</p>
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
              onClick={deployNFTCollection}
              disabled={isDeploying}
            >
              {isDeploying ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />{" "}
                  Deploying Collection...
                </>
              ) : (
                <>
                  Deploy Collection <CheckIcon className="ml-2 h-4 w-4" />
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

  // Add this after the existing functions
  const deployNFTCollection = async () => {
    if (!collectionInfo || !mintSettings || !activeAccount || !thirdwebClient) {
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

      console.log("Collection info:", collectionInfo);
      console.log("Mint settings:", mintSettings);

      // Make sure we have all required collection properties
      if (
        !collectionInfo.name ||
        !collectionInfo.symbol ||
        !collectionInfo.chain
      ) {
        throw new Error("Missing required collection information");
      }

      // Get the appropriate chain
      let chain;
      const chainName = collectionInfo.chain.toLowerCase();
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
          const chainId = Number.parseInt(collectionInfo.chain, 10);
          if (!isNaN(chainId)) {
            chain = defineChain(chainId);
          } else {
            console.log("Unsupported chain:", collectionInfo);
            throw new Error(`Unsupported chain: ${collectionInfo.chain}`);
          }
      }

      console.log("Using chain:", chain);

      // Switch network if needed
      await switchChain(chain);

      // Handle collection image
      let imageUri = "";
      if (collectionInfo.image) {
        try {
          const imageFile = await fetch(
            typeof collectionInfo.image === "string"
              ? collectionInfo.image
              : URL.createObjectURL(collectionInfo.image as Blob)
          ).then((r) => r.blob());

          // Convert Blob to File with a name
          const file = new File([imageFile], "collection-image.png", {
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
        } catch (err) {
          console.error("Error uploading image:", err);
        }
      }

      // Prepare initialization parameters
      const initializeParams = {
        name: collectionInfo.name,
        symbol: collectionInfo.symbol,
        description: collectionInfo.description || "",
        primary_sale_recipient:
          mintSettings.royaltyAddress || activeAccount.address,
        fee_recipient: mintSettings.royaltyAddress || activeAccount.address,
        seller_fee_basis_points:
          Number.parseInt(mintSettings.royaltyPercentage || "0") * 100,
      };

      console.log("Deploying with parameters:", initializeParams);

      const contractAddress = await deployERC721Contract({
        chain,
        client: thirdwebClient,
        account: activeAccount,
        type: "DropERC721",
        params: initializeParams,
      });

      // Get a reference to the deployed contract
      const contract = getContract({
        client: thirdwebClient,
        chain,
        address: contractAddress,
      });

      // Set up claim conditions for the NFT collection
      console.log("Setting up claim conditions...");
      const priceValue = Number.parseFloat(mintSettings.price) || 0.1;
      const maxSupply = BigInt(mintSettings.supply) || 10000n;

      try {
        const transaction = setClaimConditions({
          contract,
          phases: [
            {
              maxClaimableSupply: maxSupply,
              maxClaimablePerWallet: 1n,
              price: priceValue,
              currencyAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", // Native token (ETH, MATIC, etc.)
              startTime: new Date(),
              overrideList: [
                { address: activeAccount.address, maxClaimable: "unlimited" }, // this wallet can claim a given amount, or "unlimited"
              ],
              metadata: {
                name: "Claim Phase",
              },
            },
          ],
        });

        await sendTransaction({ transaction, account: activeAccount });
        console.log("Claim conditions set successfully!");

        toast.success("NFT Collection deployed successfully!");

        // Navigate to the collection's page
        setTimeout(() => {
          router.push(`/${chain.id}/${contractAddress}`);
        }, 2000);
      } catch (error) {
        console.error("Error setting claim conditions:", error);
        toast.error(
          `Failed to set claim conditions: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error deploying NFT collection:", error);
      toast.error(
        `Failed to deploy NFT collection: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsDeploying(false);
    }
  };

  return <div className="w-full py-8">{renderCurrentStep()}</div>;
}
