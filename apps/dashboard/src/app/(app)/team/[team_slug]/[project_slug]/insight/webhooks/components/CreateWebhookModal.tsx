"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useThirdwebClient } from "@/constants/thirdweb.client";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import BasicInfoStep from "./_components/BasicInfoStep";
import FilterDetailsStep from "./_components/FilterDetailsStep";
import ReviewStep from "./_components/ReviewStep";
import StepIndicator from "./_components/StepIndicator";

import { useTestWebhook } from "app/(app)/team/[team_slug]/[project_slug]/insight/webhooks/components/_hooks/useTestWebhook";
import { useV5DashboardChain } from "lib/v5-adapter";
import { XIcon } from "lucide-react";
import { useAbiProcessing } from "./_hooks/useAbiProcessing";
import {
  type WebhookFormStep,
  WebhookFormSteps,
  type WebhookFormValues,
  webhookFormSchema,
} from "./_utils/webhook-types";
const { createWebhook } = await import("@/api/insight/webhooks");

interface CreateWebhookModalProps {
  clientId: string;
}

export default function CreateWebhookModal({
  clientId,
}: CreateWebhookModalProps) {
  const router = useDashboardRouter();
  const thirdwebClient = useThirdwebClient();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<WebhookFormStep>(
    WebhookFormSteps.BasicInfo,
  );

  const formHook = useForm<WebhookFormValues>({
    resolver: zodResolver(webhookFormSchema),
    defaultValues: {
      name: "",
      webhookUrl: "",
      filterType: "event",
      chainIds: [],
      addresses: "",
      fromAddresses: "",
      toAddresses: "",
      sigHash: "",
      sigHashAbi: "",
      abi: "",
      abiData: [],
      secret: "",
      eventTypes: [],
    },
  });

  // Get chain information for ABI fetching
  const selectedChainIds = formHook.watch("chainIds") || [];
  const firstChainId =
    selectedChainIds.length > 0 ? Number(selectedChainIds[0]) : undefined;
  const chain = useV5DashboardChain(firstChainId);

  // Use the ABI processing hook with the form
  const {
    eventSignatures,
    functionSignatures,
    fetchedAbis,
    abiErrors,
    fetchedTxAbis,
    txAbiErrors,
    isFetchingEventAbi,
    isFetchingTxAbi,
    resetAbiState,
  } = useAbiProcessing({
    form: formHook,
    isOpen,
    thirdwebClient,
    chain,
  });

  // Track loading state locally
  const [isLoading, setIsLoading] = useState(false);

  // Standalone function for the review step create button
  const handleCreateButtonClick = async () => {
    try {
      const data = formHook.getValues();

      await handleSubmit(data);
    } catch (error) {
      toast.error(
        `Failed to process webhook: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  };

  // Create our own submit handler
  const handleSubmit = async (data: WebhookFormValues) => {
    setIsLoading(true);

    try {
      // Determine if it's an event or transaction webhook
      const filterType = data.filterType;

      // Define payload types to avoid using 'any'
      type WebhookPayload = {
        name?: string;
        filters: Record<
          string,
          {
            chain_ids?: string[];
            addresses?: string[];
            from_addresses?: string[];
            to_addresses?: string[];
            signatures?: Array<{
              sig_hash: string;
              abi?: string;
              params: Record<string, unknown> | unknown[];
            }>;
          }
        >;
        webhook_url: string;
      };

      // Build the appropriate payload
      let payload: WebhookPayload;

      if (filterType === "event") {
        const eventSignatures = [];
        if (data.sigHash) {
          eventSignatures.push({
            sig_hash: data.sigHash,
            abi: data.sigHashAbi,
            params: {},
          });
        }

        payload = {
          name: data.name || undefined,
          filters: {
            "v1.events": {
              chain_ids: data.chainIds,
              addresses: data.addresses
                ? data.addresses.split(",").map((addr) => addr.trim())
                : [],
              signatures:
                eventSignatures.length > 0 ? eventSignatures : undefined,
            },
          },
          webhook_url: data.webhookUrl,
        };
      } else {
        const txSignatures = [];
        if (data.sigHash) {
          txSignatures.push({
            sig_hash: data.sigHash,
            abi: data.sigHashAbi,
            params: [],
          });
        }

        payload = {
          name: data.name || undefined,
          filters: {
            "v1.transactions": {
              chain_ids: data.chainIds,
              from_addresses: data.fromAddresses
                ? data.fromAddresses.split(/[\s,]+/).map((addr) => addr.trim())
                : [],
              to_addresses: data.toAddresses
                ? data.toAddresses.split(/[\s,]+/).map((addr) => addr.trim())
                : [],
              signatures: txSignatures.length > 0 ? txSignatures : undefined,
            },
          },
          webhook_url: data.webhookUrl,
        };
      }

      await createWebhook(payload, clientId);
      toast.success("Webhook created successfully!");

      // Reset local state
      formHook.reset();
      resetAbiState();
      setCurrentStep(WebhookFormSteps.BasicInfo);
      setIsOpen(false);

      // Refresh the webhooks table
      router.refresh();
    } catch (error) {
      toast.error(
        `Failed to create webhook: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const goToNextStep = async () => {
    switch (currentStep) {
      case WebhookFormSteps.BasicInfo: {
        const result = await formHook.trigger([
          "name",
          "webhookUrl",
          "filterType",
        ]);

        if (result) {
          setCurrentStep(WebhookFormSteps.FilterDetails);
        } else {
          toast.error("Please fill in all required fields marked with *");
        }
        break;
      }
      case WebhookFormSteps.FilterDetails: {
        // Validate based on filter type
        const filterType = formHook.getValues("filterType");
        let result: boolean;

        if (filterType === "event") {
          result = await formHook.trigger(["chainIds", "addresses"]);
        } else {
          result = await formHook.trigger(["chainIds", "toAddresses"]);
        }

        if (result) {
          setCurrentStep(WebhookFormSteps.Review);
        } else {
          toast.error("Please fill in all required fields marked with *");
        }
        break;
      }
      default:
        break;
    }
  };

  const goToPreviousStep = () => {
    switch (currentStep) {
      case WebhookFormSteps.FilterDetails:
        setCurrentStep(WebhookFormSteps.BasicInfo);
        break;
      case WebhookFormSteps.Review:
        setCurrentStep(WebhookFormSteps.FilterDetails);
        break;
      default:
        break;
    }
  };

  const handleOpenModal = () => {
    formHook.reset();
    resetAbiState();
    setCurrentStep(WebhookFormSteps.BasicInfo);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const { testWebhookEndpoint, isTestingMap, testResults, isRecentResult } =
    useTestWebhook(clientId);

  const handleTestWebhook = async (webhookUrl: string) => {
    const filterType = formHook.getValues("filterType");
    await testWebhookEndpoint(webhookUrl, filterType);
  };

  return (
    <Dialog open={isOpen}>
      <DialogTrigger asChild>
        <Button onClick={handleOpenModal}>New Webhook</Button>
      </DialogTrigger>

      <DialogContent
        dialogCloseClassName="hidden"
        className="max-h-[85vh] max-w-3xl overflow-y-auto"
      >
        <div className="flex items-center justify-between">
          <DialogTitle className="font-medium text-lg">
            Create New Webhook
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCloseModal}
            className="h-6 w-6"
          >
            <XIcon className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <Form {...formHook}>
          <form
            onSubmit={formHook.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {/* Step indicator */}
            <StepIndicator currentStep={currentStep} />

            {/* Step Content */}
            <div className="min-h-[300px]">
              {currentStep === WebhookFormSteps.BasicInfo && (
                <BasicInfoStep form={formHook} />
              )}

              {currentStep === WebhookFormSteps.FilterDetails && (
                <FilterDetailsStep
                  form={formHook}
                  eventSignatures={eventSignatures}
                  functionSignatures={functionSignatures}
                  fetchedAbis={fetchedAbis}
                  abiErrors={abiErrors}
                  fetchedTxAbis={fetchedTxAbis}
                  txAbiErrors={txAbiErrors}
                  isFetchingEventAbi={isFetchingEventAbi}
                  isFetchingTxAbi={isFetchingTxAbi}
                />
              )}

              {currentStep === WebhookFormSteps.Review && (
                <ReviewStep
                  form={formHook}
                  isTestingMap={isTestingMap}
                  testResults={testResults}
                  isRecentResult={isRecentResult}
                  testWebhookEndpoint={handleTestWebhook}
                />
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4">
              {currentStep !== WebhookFormSteps.BasicInfo ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={goToPreviousStep}
                  disabled={isLoading}
                >
                  Back
                </Button>
              ) : (
                <div />
              )}

              {currentStep !== WebhookFormSteps.Review ? (
                <Button
                  type="button"
                  onClick={goToNextStep}
                  disabled={isLoading}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleCreateButtonClick}
                  disabled={isLoading}
                >
                  {isLoading ? "Creating..." : "Create Webhook"}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
