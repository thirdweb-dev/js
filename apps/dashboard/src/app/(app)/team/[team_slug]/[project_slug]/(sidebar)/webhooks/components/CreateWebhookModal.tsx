"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import BasicInfoStep from "./BasicInfoStep";
import { FilterDetailsStep } from "./FilterDetailsStep";
import ReviewStep from "./ReviewStep";

import { createWebhook } from "@/api/insight/webhooks";
import { XIcon } from "lucide-react";
import type { ThirdwebClient } from "thirdweb";
import { useAbiMultiFetch } from "../hooks/useAbiProcessing";
import { useTestWebhook } from "../hooks/useTestWebhook";
import {
  extractEventSignatures,
  extractFunctionSignatures,
} from "../utils/abiUtils";
import {
  buildEventWebhookPayload,
  buildTransactionWebhookPayload,
} from "../utils/webhookPayloadUtils";
import type { WebhookPayload } from "../utils/webhookPayloadUtils";
import {
  type WebhookFormStep,
  WebhookFormSteps,
  type WebhookFormValues,
  webhookFormSchema,
} from "../utils/webhookTypes";

interface CreateWebhookModalProps {
  projectClientId: string;
  supportedChainIds: Array<number>;
  client: ThirdwebClient;
}

export function CreateWebhookModal({
  projectClientId,
  supportedChainIds,
  client,
}: CreateWebhookModalProps) {
  const router = useDashboardRouter();
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
      inputAbi: [],
      secret: "",
      eventTypes: [],
    },
  });

  const chainIds = useWatch({ control: formHook.control, name: "chainIds" });
  const addresses = useWatch({ control: formHook.control, name: "addresses" });
  const toAddresses = useWatch({
    control: formHook.control,
    name: "toAddresses",
  });

  const eventAbi = useAbiMultiFetch({
    isOpen,
    thirdwebClient: client,
    chainIds,
    addresses: addresses || "",
    extractSignatures: extractEventSignatures,
    type: "event",
  });

  const txAbi = useAbiMultiFetch({
    isOpen,
    thirdwebClient: client,
    chainIds,
    addresses: toAddresses || "",
    extractSignatures: extractFunctionSignatures,
    type: "transaction",
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
      let payload: WebhookPayload;
      if (data.filterType === "event") {
        payload = buildEventWebhookPayload(data);
      } else {
        payload = buildTransactionWebhookPayload(data);
      }

      const response = await createWebhook(payload, projectClientId);
      if (response?.error) {
        toast.error(`${response.error}`);
        return;
      }
      toast.success("Webhook created successfully!");

      // Reset local state
      formHook.reset();
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
    setCurrentStep(WebhookFormSteps.BasicInfo);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const { testWebhookEndpoint, isTestingMap, testResults, isRecentResult } =
    useTestWebhook(projectClientId);

  const handleTestWebhook = async (webhookUrl: string) => {
    const filterType = formHook.getValues("filterType");
    return await testWebhookEndpoint(webhookUrl, filterType);
  };

  return (
    <Dialog open={isOpen}>
      <DialogTrigger asChild>
        <Button onClick={handleOpenModal}>New Webhook</Button>
      </DialogTrigger>

      <DialogContent
        dialogCloseClassName="hidden"
        className="max-h-[85vh] max-w-5xl overflow-y-auto"
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
            {/* Step Content */}
            <div className="min-h-[300px]">
              {currentStep === WebhookFormSteps.BasicInfo && (
                <BasicInfoStep
                  form={formHook}
                  goToNextStep={goToNextStep}
                  isLoading={isLoading}
                />
              )}

              {currentStep === WebhookFormSteps.FilterDetails && (
                <FilterDetailsStep
                  client={client}
                  form={formHook}
                  eventSignatures={eventAbi.signatures}
                  functionSignatures={txAbi.signatures}
                  fetchedAbis={eventAbi.fetchedAbis}
                  abiErrors={eventAbi.errors}
                  fetchedTxAbis={txAbi.fetchedAbis}
                  txAbiErrors={txAbi.errors}
                  isFetchingEventAbi={eventAbi.isFetching}
                  isFetchingTxAbi={txAbi.isFetching}
                  goToNextStep={goToNextStep}
                  goToPreviousStep={goToPreviousStep}
                  isLoading={isLoading}
                  supportedChainIds={supportedChainIds}
                />
              )}

              {currentStep === WebhookFormSteps.Review && (
                <ReviewStep
                  form={formHook}
                  isTestingMap={isTestingMap}
                  testResults={testResults}
                  isRecentResult={isRecentResult}
                  testWebhookEndpoint={handleTestWebhook}
                  goToPreviousStep={goToPreviousStep}
                  isLoading={isLoading}
                  handleCreateButtonClick={handleCreateButtonClick}
                />
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
