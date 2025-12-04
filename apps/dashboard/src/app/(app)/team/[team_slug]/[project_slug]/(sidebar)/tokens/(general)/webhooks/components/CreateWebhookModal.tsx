"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import type { ThirdwebClient } from "thirdweb";
import { createWebhook } from "@/api/insight/webhooks";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import BasicInfoStep from "./BasicInfoStep";
import { FilterDetailsStep } from "./FilterDetailsStep";
import ReviewStep from "./ReviewStep";
import { useAbiMultiFetch } from "./useAbiProcessing";
import { useTestWebhook } from "./useTestWebhook";
import {
  extractEventSignatures,
  extractFunctionSignatures,
} from "./utils/abiUtils";
import type { WebhookPayload } from "./utils/webhookPayloadUtils";
import {
  buildEventWebhookPayload,
  buildTransactionWebhookPayload,
} from "./utils/webhookPayloadUtils";
import {
  type WebhookFormStep,
  WebhookFormSteps,
  type WebhookFormValues,
  webhookFormSchema,
} from "./utils/webhookTypes";

interface CreateWebhookModalProps {
  projectClientId: string;
  supportedChainIds: Array<number>;
  client: ThirdwebClient;
}

export function CreateContractWebhookButton({
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
    defaultValues: {
      abi: "",
      addresses: "",
      chainIds: [],
      eventTypes: [],
      filterType: "event",
      fromAddresses: "",
      inputAbi: [],
      name: "",
      secret: "",
      sigHash: [],
      sigHashAbi: "",
      toAddresses: "",
      webhookUrl: "",
    },
    resolver: zodResolver(webhookFormSchema),
  });

  const chainIds = useWatch({ control: formHook.control, name: "chainIds" });
  const addresses = useWatch({ control: formHook.control, name: "addresses" });
  const toAddresses = useWatch({
    control: formHook.control,
    name: "toAddresses",
  });

  const eventAbi = useAbiMultiFetch({
    addresses: addresses || "",
    chainIds,
    extractSignatures: extractEventSignatures,
    isOpen,
    thirdwebClient: client,
    type: "event",
  });

  const txAbi = useAbiMultiFetch({
    addresses: toAddresses || "",
    chainIds,
    extractSignatures: extractFunctionSignatures,
    isOpen,
    thirdwebClient: client,
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
        `Failed to process webhook: ${
          error instanceof Error ? error.message : String(error)
        }`,
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
        `Failed to create webhook: ${
          error instanceof Error ? error.message : String(error)
        }`,
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
          result = await formHook.trigger([
            "chainIds",
            "toAddresses",
            "fromAddresses",
          ]);
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
        <Button
          className="gap-2 rounded-full"
          size="sm"
          onClick={handleOpenModal}
        >
          <PlusIcon className="size-3.5" />
          Create Webhook
        </Button>
      </DialogTrigger>

      <DialogContent
        className="max-h-[85vh] max-w-5xl overflow-y-auto"
        dialogCloseClassName="hidden"
      >
        <div className="flex items-center justify-between">
          <DialogTitle className="font-medium text-lg">
            Create New Webhook
          </DialogTitle>
          <Button
            className="h-6 w-6"
            onClick={handleCloseModal}
            size="icon"
            variant="ghost"
          >
            <XIcon className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <Form {...formHook}>
          <form
            className="space-y-4"
            onSubmit={formHook.handleSubmit(handleSubmit)}
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
                  abiErrors={eventAbi.errors}
                  client={client}
                  eventSignatures={eventAbi.signatures}
                  fetchedAbis={eventAbi.fetchedAbis}
                  fetchedTxAbis={txAbi.fetchedAbis}
                  form={formHook}
                  functionSignatures={txAbi.signatures}
                  goToNextStep={goToNextStep}
                  goToPreviousStep={goToPreviousStep}
                  isFetchingEventAbi={eventAbi.isFetching}
                  isFetchingTxAbi={txAbi.isFetching}
                  isLoading={isLoading}
                  supportedChainIds={supportedChainIds}
                  txAbiErrors={txAbi.errors}
                />
              )}

              {currentStep === WebhookFormSteps.Review && (
                <ReviewStep
                  form={formHook}
                  goToPreviousStep={goToPreviousStep}
                  handleCreateButtonClick={handleCreateButtonClick}
                  isLoading={isLoading}
                  isRecentResult={isRecentResult}
                  isTestingMap={isTestingMap}
                  testResults={testResults}
                  testWebhookEndpoint={handleTestWebhook}
                />
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
