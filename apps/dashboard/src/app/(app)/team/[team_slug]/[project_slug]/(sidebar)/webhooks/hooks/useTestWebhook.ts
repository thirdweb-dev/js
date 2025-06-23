import { useState } from "react";
import { toast } from "sonner";
import { testWebhook } from "@/api/insight/webhooks";

type TestResult = {
  status: "success" | "error";
  timestamp: number;
};

export function useTestWebhook(clientId: string) {
  const [isTestingMap, setIsTestingMap] = useState<Record<string, boolean>>({});
  const [testResults, setTestResults] = useState<Record<string, TestResult>>(
    {},
  );

  const testWebhookEndpoint = async (
    webhookUrl: string,
    type: "event" | "transaction",
    id?: string,
  ) => {
    try {
      new URL(webhookUrl);
    } catch {
      toast.error("Cannot test webhook", {
        description:
          "Please enter a valid URL starting with http:// or https://",
      });
      return false;
    }

    const uniqueId = id || `${webhookUrl}-${type}`;

    if (isTestingMap[uniqueId]) return false;

    try {
      setIsTestingMap((prev) => ({ ...prev, [uniqueId]: true }));
      setTestResults((prev) => {
        const newResults = { ...prev };
        delete newResults[uniqueId];
        return newResults;
      });

      const result = await testWebhook(
        { type, webhook_url: webhookUrl },
        clientId,
      );

      if (result.success) {
        setTestResults((prev) => ({
          ...prev,
          [uniqueId]: {
            status: "success",
            timestamp: Date.now(),
          },
        }));

        toast.success("Test event sent successfully", {
          description:
            "Check your webhook endpoint to verify the delivery. The test event is signed with a secret key.",
        });
        return true;
      } else {
        setTestResults((prev) => ({
          ...prev,
          [uniqueId]: {
            status: "error",
            timestamp: Date.now(),
          },
        }));

        toast.error("Failed to send test event", {
          description:
            "The server reported a failure in sending the test event.",
        });
        return false;
      }
    } catch (error) {
      console.error("Error testing webhook:", error);

      setTestResults((prev) => ({
        ...prev,
        [uniqueId]: {
          status: "error",
          timestamp: Date.now(),
        },
      }));

      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      const isFailedSendError = errorMessage.includes(
        "Failed to send test event",
      );

      toast.error(
        isFailedSendError ? "Unable to test webhook" : "Failed to test webhook",
        {
          description: isFailedSendError
            ? "We couldn't send a test request to your webhook endpoint. This might be due to network issues or the endpoint being unavailable. Please verify your webhook URL and try again later."
            : errorMessage,
          duration: 10000,
        },
      );
      return false;
    } finally {
      setIsTestingMap((prev) => ({ ...prev, [uniqueId]: false }));
    }
  };

  const isRecentResult = (uniqueId: string) => {
    const result = testResults[uniqueId];
    if (!result) return false;

    return Date.now() - result.timestamp < 5000;
  };

  return {
    isRecentResult,
    isTestingMap,
    testResults,
    testWebhookEndpoint,
  };
}
