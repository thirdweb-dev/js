"use client";

import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Fieldset } from "components/contract-components/contract-deploy-form/common";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import { Form } from "@/components/ui/form";
import { NetworkSelectorButton } from "components/selects/NetworkSelectorButton";

// Form schema
const contractDetailsSchema = z.object({
  contractAddress: z.string().min(1, "Contract address is required"),
  network: z.string().min(1, "Network is required"),
});

type ContractDetailsValues = z.infer<typeof contractDetailsSchema>;

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

export default function ImportAssetPage() {
  const [step, setStep] = useState<number>(1);
  const [contractDetails, setContractDetails] =
    useState<ContractDetailsValues>();

  // Form
  const contractDetailsForm = useForm<ContractDetailsValues>({
    resolver: zodResolver(contractDetailsSchema),
    defaultValues: {
      contractAddress: "",
      network: "Ethereum",
    },
  });

  // Step handlers
  const onContractDetailsSubmit = (data: ContractDetailsValues) => {
    setContractDetails(data);
    setStep(2);
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Render functions
  const renderStepIndicators = () => (
    <div className="flex justify-center mb-8 pt-6">
      <div className="relative flex w-full max-w-md justify-between">
        {/* Segmented line between circles */}
        <div className="absolute top-5 left-0 right-0 flex justify-center">
          <div className="w-1/2 flex items-center">
            <div
              className={`h-0.5 w-full ${
                step > 1 ? "bg-primary/20" : "bg-muted"
              }`}
              style={{ marginLeft: "25px", marginRight: "25px" }}
            />
          </div>
        </div>

        <StepIndicator step={1} currentStep={step} label="Contract Details" />
        <StepIndicator step={2} currentStep={step} label="Overview" />
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Import Asset</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Import an existing token or NFT collection from the blockchain
      </p>

      {renderStepIndicators()}

      <Fieldset legend="Contract Details">
        <Form {...contractDetailsForm}>
          <form
            onSubmit={contractDetailsForm.handleSubmit(onContractDetailsSubmit)}
            className="space-y-6"
          >
            <div className="space-y-6">
              <FormFieldSetup
                label="Contract Address"
                isRequired
                htmlFor="contractAddress"
                errorMessage={
                  contractDetailsForm.formState.errors.contractAddress?.message
                }
                helperText="Enter the address of the contract you want to import"
              >
                <SolidityInput
                  id="contractAddress"
                  solidityType="address"
                  placeholder="0x..."
                  {...contractDetailsForm.register("contractAddress", {
                    required: "Contract address is required",
                  })}
                />
              </FormFieldSetup>

              <FormFieldSetup
                label="Network"
                isRequired
                htmlFor="network"
                errorMessage={
                  contractDetailsForm.formState.errors.network?.message
                }
              >
                <NetworkSelectorButton
                  className="bg-background"
                  onSwitchChain={(chain) => {
                    contractDetailsForm.setValue("network", chain.name);
                  }}
                />
              </FormFieldSetup>
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
      <h1 className="text-2xl font-bold mb-6">Import Asset</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Import an existing token or NFT collection from the blockchain
      </p>

      {renderStepIndicators()}

      <Fieldset legend="Overview">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4 flex justify-between">
              Contract Details
              <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
                Edit
              </Button>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">
                  Contract Address:
                </p>
                <p className="font-mono">{contractDetails?.contractAddress}</p>
              </div>

              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">Network:</p>
                <p>{contractDetails?.network}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="rounded-md bg-muted/50 p-4">
            <h3 className="text-base font-medium mb-2">Note:</h3>
            <p className="text-sm text-muted-foreground">
              Importing this asset will allow you to manage it through the
              dashboard. No changes will be made to the contract itself.
            </p>
          </div>

          <div className="flex justify-between pt-6">
            <Button type="button" variant="outline" onClick={goBack}>
              <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button
              type="button"
              className="bg-primary hover:bg-primary/90"
              onClick={() => alert("Asset would be imported here")}
            >
              Import Asset <CheckIcon className="ml-2 h-4 w-4" />
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
      default:
        return renderStep1();
    }
  };

  return <div className="w-full py-8">{renderCurrentStep()}</div>;
}
