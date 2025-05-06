"use client";

import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  UploadIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Fieldset } from "components/contract-components/contract-deploy-form/common";
import { FileInput } from "components/shared/FileInput";
import { BasisPointsInput } from "components/inputs/BasisPointsInput";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import { Form } from "@/components/ui/form";

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
  const [step, setStep] = useState<number>(1);
  const [tokenInfo, setTokenInfo] = useState<TokenInfoValues>();
  const [advancedOptions, setAdvancedOptions] = useState<AdvancedOptionsValues>(
    {
      ownerSupply: "100",
      airdropSupply: "0",
      platformFeeBps: "250",
      royaltyBps: "0",
      platformFeeRecipient: "",
      royaltyRecipient: "",
      primarySaleAddress: "",
    }
  );
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

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
      primarySaleAddress: "",
      platformFeeBps: "250",
      platformFeeRecipient: "",
      royaltyBps: "0",
      royaltyRecipient: "",
    },
  });

  // Step handlers
  const onTokenInfoSubmit = (data: TokenInfoValues) => {
    setTokenInfo(data);
    setStep(2);
  };

  const onAdvancedOptionsSubmit = (data: AdvancedOptionsValues) => {
    setAdvancedOptions(data);
    setStep(3);
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Allocation bar calculations
  const ownerPercentage =
    parseFloat(advancedOptionsForm.watch("ownerSupply")) || 0;
  const airdropPercentage =
    parseFloat(advancedOptionsForm.watch("airdropSupply")) || 0;
  const totalAllocation = ownerPercentage + airdropPercentage;

  const isAllocationValid = totalAllocation <= 100;

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
                step > 1 ? "bg-primary/20" : "bg-muted"
              }`}
              style={{ marginLeft: "25px", marginRight: "25px" }}
            />
          </div>
          {/* Second segment: between step 2 and 3 */}
          <div className="w-1/2 flex items-center">
            <div
              className={`h-0.5 w-full ${
                step > 2 ? "bg-primary/20" : "bg-muted"
              }`}
              style={{ marginLeft: "25px", marginRight: "25px" }}
            />
          </div>
        </div>

        <StepIndicator step={1} currentStep={step} label="Token Info" />
        <StepIndicator step={2} currentStep={step} label="Token Options" />
        <StepIndicator step={3} currentStep={step} label="Overview" />
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
                  <Select
                    defaultValue={tokenInfoForm.watch("chain")}
                    onValueChange={(value) =>
                      tokenInfoForm.setValue("chain", value)
                    }
                  >
                    <SelectTrigger id="chain">
                      <SelectValue placeholder="Select chain" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ethereum">Ethereum</SelectItem>
                      <SelectItem value="Base">Base</SelectItem>
                      <SelectItem value="Polygon">Polygon</SelectItem>
                      <SelectItem value="Arbitrum">Arbitrum</SelectItem>
                      <SelectItem value="Optimism">Optimism</SelectItem>
                    </SelectContent>
                  </Select>
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
                      {...advancedOptionsForm.register("ownerSupply")}
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
                      {...advancedOptionsForm.register("airdropSupply")}
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
                    <Button variant="outline">Upload file</Button>
                  </div>
                )}

              {/* Token Allocation Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Token Allocation</span>
                  <span
                    className={
                      isAllocationValid
                        ? "text-muted-foreground"
                        : "text-red-500"
                    }
                  >
                    {totalAllocation}%
                  </span>
                </div>
                <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      isAllocationValid ? "bg-primary" : "bg-red-500"
                    }`}
                    style={{
                      width: `${Math.min(totalAllocation, 100)}%`,
                    }}
                  ></div>
                </div>
                {!isAllocationValid && (
                  <p className="text-red-500 text-xs">
                    Total allocation exceeds 100%
                  </p>
                )}
              </div>
            </div>

            <div className="mt-8">
              <Button
                type="button"
                variant="outline"
                className="flex w-full justify-between"
                onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
              >
                <span>Advanced Settings</span>
                {showAdvancedSettings ? (
                  <ChevronUpIcon className="h-4 w-4" />
                ) : (
                  <ChevronDownIcon className="h-4 w-4" />
                )}
              </Button>

              {showAdvancedSettings && (
                <div className="border rounded-md mt-2 p-4 space-y-6">
                  {/* Primary Sale Settings */}
                  <div>
                    <h3 className="text-base font-medium mb-4">
                      Primary Sales
                    </h3>
                    <FormFieldSetup
                      label="Recipient Address"
                      isRequired={false}
                      errorMessage={
                        advancedOptionsForm.formState.errors.primarySaleAddress
                          ?.message
                      }
                      helperText="The wallet address that should receive the revenue from initial sales of the assets."
                    >
                      <SolidityInput
                        solidityType="address"
                        {...advancedOptionsForm.register("primarySaleAddress")}
                      />
                    </FormFieldSetup>
                  </div>

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
              <Button type="submit" disabled={!isAllocationValid}>
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
              <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
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
              <Button variant="ghost" size="sm" onClick={() => setStep(2)}>
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
              onClick={() => alert("Token creation would be processed here")}
            >
              Deploy Token <CheckIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </Fieldset>
    </div>
  );

  // Render the appropriate step
  const renderCurrentStep = () => {
    switch (step) {
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
