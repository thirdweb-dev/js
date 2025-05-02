"use client";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import { CheckIcon, PlayIcon, XIcon } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

import { truncateMiddle } from "../_utils/abi-utils";
import type { WebhookFormValues } from "../_utils/webhook-types";

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
  testWebhookEndpoint: (url: string) => Promise<void>;
}

export default function ReviewStep({
  form,
  isTestingMap,
  testResults,
  isRecentResult,
  testWebhookEndpoint,
}: ReviewStepProps) {
  // Determine if testing is in progress
  const webhookUrl = form.watch("webhookUrl");
  const isTesting = isTestingMap[webhookUrl || ""];
  // Get test result if available
  const testResult = testResults[webhookUrl || ""];
  const isRecent = isRecentResult(webhookUrl || "");

  const handleTestWebhook = async () => {
    if (webhookUrl) {
      await testWebhookEndpoint(webhookUrl);
    }
  };

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
          {form.watch("filterType") === "transaction" ? (
            <></>
          ) : (
            <li className="flex justify-between">
              <span className="text-muted-foreground text-sm">
                Contract Addresses:
              </span>
              <span className="font-medium text-sm">
                {(() => {
                  const fromAddresses = form.watch("fromAddresses");
                  const addresses = form.watch("addresses");

                  if (fromAddresses) {
                    return fromAddresses
                      .split(",")
                      .map((addr) => truncateMiddle(addr.trim(), 6, 4))
                      .join(", ");
                  } else if (addresses) {
                    return addresses
                      .split(",")
                      .map((addr) => truncateMiddle(addr.trim(), 6, 4))
                      .join(", ");
                  } else {
                    return "None";
                  }
                })()}
              </span>
            </li>
          )}

          {form.watch("filterType") === "event" ? (
            <></>
          ) : (
            <>
              <li className="flex justify-between">
                <span className="text-muted-foreground text-sm">
                  From Address:
                </span>
                <span className="font-medium text-sm">
                  {(() => {
                    const fromAddresses = form.watch("fromAddresses");
                    return fromAddresses
                      ? fromAddresses
                          .split(",")
                          .map((addr) => truncateMiddle(addr.trim(), 6, 4))
                          .join(", ")
                      : "None";
                  })()}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground text-sm">
                  To Address:
                </span>
                <span className="font-medium text-sm">
                  {(() => {
                    const toAddresses = form.watch("toAddresses");
                    return toAddresses
                      ? toAddresses
                          .split(",")
                          .map((addr) => truncateMiddle(addr.trim(), 6, 4))
                          .join(", ")
                      : "None";
                  })()}
                </span>
              </li>
            </>
          )}

          <li className="flex justify-between">
            <span className="text-muted-foreground text-sm">
              Signature Hash:
            </span>
            <span className="font-medium text-sm">
              {(() => {
                const sigHash = form.watch("sigHash");
                return sigHash ? truncateMiddle(sigHash, 10, 6) : "None";
              })()}
            </span>
          </li>

          <li className="flex justify-between">
            <span className="text-muted-foreground text-sm">ABIs:</span>
            <span className="font-medium text-sm">
              {Object.keys(form.watch("sigHashAbi") ? { dummy: true } : {})
                .length > 0
                ? "Provided"
                : "None"}
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

        {/* Dynamic button that changes style based on test results */}
        {(() => {
          if (testResult?.status === "success" && isRecent) {
            return (
              <Button
                className="gap-2"
                disabled={isTesting}
                onClick={handleTestWebhook}
                size="sm"
                type="button"
                variant="outline"
                style={{
                  borderColor: "rgb(22, 163, 74)",
                  color: "rgb(22, 163, 74)",
                  backgroundColor: "rgba(22, 163, 74, 0.1)",
                }}
              >
                <CheckIcon className="h-4 w-4" />
                Test Successful
              </Button>
            );
          }

          if (testResult?.status === "error" && isRecent) {
            return (
              <Button
                className="gap-2"
                disabled={isTesting}
                onClick={handleTestWebhook}
                size="sm"
                type="button"
                variant="outline"
                style={{
                  borderColor: "rgb(220, 38, 38)",
                  color: "rgb(220, 38, 38)",
                  backgroundColor: "rgba(220, 38, 38, 0.1)",
                }}
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
        })()}
      </div>
    </>
  );
}
