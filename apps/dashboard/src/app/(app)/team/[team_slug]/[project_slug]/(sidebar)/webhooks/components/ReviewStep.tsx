"use client";
import { CheckIcon, PlayIcon, XIcon } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { truncateMiddle } from "../utils/abiUtils";
import type { WebhookFormValues } from "../utils/webhookTypes";

interface WebhookTestResult {
  status: string;
  timestamp?: number;
  error?: string;
  statusCode?: number;
}

interface ReviewStepProps {
  form: UseFormReturn<WebhookFormValues>;
  isTestingMap: Record<string, boolean>;
  testResults: Record<string, WebhookTestResult>;
  isRecentResult: (id: string) => boolean;
  testWebhookEndpoint: (url: string, filterType: string) => Promise<boolean>;
  goToPreviousStep: () => void;
  isLoading: boolean;
  handleCreateButtonClick: () => void;
}

// Helper to format addresses
function formatAddresses(addresses: string | undefined, start = 6, end = 4) {
  if (!addresses) return "None";
  return addresses
    .split(/[,\s]+/)
    .map((addr) => truncateMiddle(addr.trim(), start, end))
    .join(", ");
}

export default function ReviewStep({
  form,
  isTestingMap,
  testResults,
  isRecentResult,
  testWebhookEndpoint,
  goToPreviousStep,
  isLoading,
  handleCreateButtonClick,
}: ReviewStepProps) {
  // Determine if testing is in progress
  const webhookUrl = form.watch("webhookUrl");
  const filterType = form.watch("filterType");
  const uniqueId = `${webhookUrl}-${filterType}`;
  const isTesting = isTestingMap[uniqueId];
  // Get test result if available
  const testResult = testResults[uniqueId];
  const isRecent = isRecentResult(uniqueId);

  const handleTestWebhook = async () => {
    if (webhookUrl && filterType) {
      await testWebhookEndpoint(webhookUrl, filterType);
    }
  };

  function renderTestButton() {
    if (testResult?.status === "success" && isRecent) {
      return (
        <Button
          className="gap-2 border-green-500 text-green-700"
          disabled={isTesting}
          onClick={handleTestWebhook}
          size="sm"
          type="button"
          variant="outline"
        >
          <CheckIcon className="h-4 w-4" />
          Test Successful
        </Button>
      );
    }
    if (testResult?.status === "error" && isRecent) {
      return (
        <Button
          className="gap-2 border-red-500 text-red-700"
          disabled={isTesting}
          onClick={handleTestWebhook}
          size="sm"
          type="button"
          variant="outline"
        >
          <XIcon className="h-4 w-4" />
          Test Failed
        </Button>
      );
    }
    return (
      <Button
        className="gap-2"
        disabled={isTesting}
        onClick={handleTestWebhook}
        size="sm"
        type="button"
        variant="outline"
      >
        {isTesting ? (
          <>
            <Spinner className="h-4 w-4" />
            Testing...
          </>
        ) : (
          <>
            <PlayIcon className="h-4 w-4" />
            Test Webhook
          </>
        )}
      </Button>
    );
  }

  return (
    <>
      <div className="mb-4">
        <h2 className="font-medium text-lg">Step 3: Review</h2>
        <p className="text-muted-foreground text-sm">
          Review your webhook configuration before creating
        </p>
      </div>

      {/* Review Details */}
      <div className="rounded-md border p-4">
        <ul className="space-y-2">
          <li className="flex justify-between">
            <span className="text-muted-foreground text-sm">Name:</span>
            <span className="font-medium text-sm">{form.watch("name")}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-muted-foreground text-sm">Webhook URL:</span>
            <span className="font-medium text-sm">
              {truncateMiddle(form.watch("webhookUrl"), 12, 10)}
            </span>
          </li>

          <li className="flex justify-between">
            <span className="text-muted-foreground text-sm">Type:</span>
            <span className="font-medium text-sm capitalize">
              {form.watch("filterType")}
            </span>
          </li>

          <li className="flex justify-between">
            <span className="text-muted-foreground text-sm">Chain IDs:</span>
            <span className="font-medium text-sm">
              {(form.watch("chainIds") || []).length > 0
                ? (form.watch("chainIds") || [])
                    .map((id) => id.toString())
                    .join(", ")
                : "None"}
            </span>
          </li>
          <li className="flex justify-between">
            <span className="text-muted-foreground text-sm">
              Contract Addresses:
            </span>
            <span className="font-medium text-sm">
              {(() => {
                const filterType = form.watch("filterType");
                if (filterType === "event") {
                  return formatAddresses(form.watch("addresses"));
                } else if (filterType === "transaction") {
                  return formatAddresses(form.watch("toAddresses"));
                } else {
                  return "None";
                }
              })()}
            </span>
          </li>

          {form.watch("filterType") === "event" ? null : (
            <>
              <li className="flex justify-between">
                <span className="text-muted-foreground text-sm">
                  From Address:
                </span>
                <span className="font-medium text-sm">
                  {formatAddresses(form.watch("fromAddresses"))}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground text-sm">
                  To Address:
                </span>
                <span className="font-medium text-sm">
                  {formatAddresses(form.watch("toAddresses"))}
                </span>
              </li>
            </>
          )}

          <li className="flex justify-between">
            <span className="text-muted-foreground text-sm">
              Signature Hash
              {Array.isArray(form.watch("sigHash")) &&
              (form.watch("sigHash")?.length || 0) > 1
                ? "es"
                : ""}
              :
            </span>
            <span className="font-medium text-sm">
              {(() => {
                const sigHash = form.watch("sigHash");
                if (!sigHash) return "None";

                if (Array.isArray(sigHash)) {
                  if (sigHash.length === 0) return "None";
                  if (sigHash.length === 1) {
                    return truncateMiddle(sigHash[0] || "", 10, 6);
                  }
                  return `${sigHash.length} signature${sigHash.length > 1 ? "s" : ""} selected`;
                } else {
                  return truncateMiddle(sigHash, 10, 6);
                }
              })()}
            </span>
          </li>

          <li className="flex justify-between">
            <span className="text-muted-foreground text-sm">ABIs:</span>
            <span className="font-medium text-sm">
              {form.watch("sigHashAbi") ? "Provided" : "None"}
            </span>
          </li>
        </ul>
      </div>

      {/* Test Webhook Section */}
      <div className="mt-6 rounded-md border bg-primary/5 p-4">
        <h3 className="mb-2 font-medium text-sm">Test your webhook</h3>
        <p className="mb-4 text-muted-foreground text-sm">
          Before creating your webhook, you can test if your endpoint is
          configured correctly to receive events.
        </p>

        {renderTestButton()}
      </div>

      <div className="flex justify-between pt-4">
        <Button
          disabled={isLoading}
          onClick={goToPreviousStep}
          type="button"
          variant="outline"
        >
          Back
        </Button>
        <Button
          disabled={isLoading}
          onClick={handleCreateButtonClick}
          type="submit"
        >
          {isLoading ? "Creating..." : "Create Webhook"}
        </Button>
      </div>
    </>
  );
}
