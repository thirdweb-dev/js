/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { getAuthToken } from "app/(app)/api/lib/getAuthToken";
import { THIRDWEB_INSIGHT_API_DOMAIN } from "constants/urls";

export interface WebhookResponse {
  id: string;
  name: string;
  team_id: string;
  project_id: string;
  webhook_url: string;
  webhook_secret: string;
  filters: WebhookFilters;
  suspended_at: string | null;
  suspended_reason: string | null;
  disabled: boolean;
  created_at: string;
  updated_at: string | null;
}

export interface WebhookFilters {
  "v1.events"?: {
    chain_ids?: string[];
    addresses?: string[];
    signatures?: Array<{
      sig_hash: string;
      abi?: string;
      params?: Record<string, unknown>;
    }>;
  };
  "v1.transactions"?: {
    chain_ids?: string[];
    from_addresses?: string[];
    to_addresses?: string[];
    signatures?: Array<{
      sig_hash: string;
      abi?: string;
      params?: Record<string, unknown>;
    }>;
  };
}

interface CreateWebhookPayload {
  name: string;
  webhook_url: string;
  filters: WebhookFilters;
}

interface WebhooksListResponse {
  data: WebhookResponse[];
  error?: string;
}

interface WebhookSingleResponse {
  data: WebhookResponse | null;
  error?: string;
}

interface TestWebhookPayload {
  webhook_url: string;
  type?: "event" | "transaction";
}

interface TestWebhookResponse {
  success: boolean;
  error?: string;
}

type SupportedWebhookChainsResponse =
  | { chains: Array<number> }
  | { error: string };

export async function createWebhook(
  payload: CreateWebhookPayload,
  clientId: string,
): Promise<WebhookSingleResponse> {
  try {
    const authToken = await getAuthToken();
    const response = await fetch(
      `https://${THIRDWEB_INSIGHT_API_DOMAIN}/v1/webhooks`,
      {
        body: JSON.stringify(payload),
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
          "x-client-id": clientId,
        },
        method: "POST",
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      return {
        data: null,
        error: `Failed to create webhook: ${errorText}`,
      };
    }

    return (await response.json()) as WebhookSingleResponse;
  } catch (error) {
    return {
      data: null,
      error: `Network or parsing error: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

export async function getWebhooks(
  clientId: string,
): Promise<WebhooksListResponse> {
  try {
    const authToken = await getAuthToken();
    const response = await fetch(
      `https://${THIRDWEB_INSIGHT_API_DOMAIN}/v1/webhooks`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "x-client-id": clientId,
        },
        method: "GET",
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      return {
        data: [],
        error: `Failed to get webhooks: ${errorText}`,
      };
    }

    return (await response.json()) as WebhooksListResponse;
  } catch (error) {
    return {
      data: [],
      error: `Network or parsing error: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

export async function deleteWebhook(
  webhookId: string,
  clientId: string,
): Promise<WebhookSingleResponse> {
  try {
    const authToken = await getAuthToken();
    const response = await fetch(
      `https://${THIRDWEB_INSIGHT_API_DOMAIN}/v1/webhooks/${encodeURIComponent(webhookId)}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "x-client-id": clientId,
        },
        method: "DELETE",
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      return {
        data: null,
        error: `Failed to delete webhook: ${errorText}`,
      };
    }

    return (await response.json()) as WebhookSingleResponse;
  } catch (error) {
    return {
      data: null,
      error: `Network or parsing error: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

export async function testWebhook(
  payload: TestWebhookPayload,
  clientId: string,
): Promise<TestWebhookResponse> {
  try {
    const authToken = await getAuthToken();
    const response = await fetch(
      `https://${THIRDWEB_INSIGHT_API_DOMAIN}/v1/webhooks/test`,
      {
        body: JSON.stringify(payload),
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
          "x-client-id": clientId,
        },
        method: "POST",
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      return {
        error: `Failed to test webhook: ${errorText}`,
        success: false,
      };
    }

    return (await response.json()) as TestWebhookResponse;
  } catch (error) {
    return {
      error: `Network or parsing error: ${error instanceof Error ? error.message : "Unknown error"}`,
      success: false,
    };
  }
}

export async function getSupportedWebhookChains(): Promise<SupportedWebhookChainsResponse> {
  try {
    const response = await fetch(
      `https://${THIRDWEB_INSIGHT_API_DOMAIN}/service/chains`,
      {
        headers: {
          "x-service-api-key": process.env.INSIGHT_SERVICE_API_KEY || "",
        },
        method: "GET",
      },
    );

    if (!response.ok) {
      const errorText = await response.json();
      return { error: `Failed to fetch supported chains: ${errorText.error}` };
    }

    const data = await response.json();
    if (Array.isArray(data.data)) {
      return { chains: data.data };
    }
    return { error: "Unexpected response format" };
  } catch (error) {
    console.error("Error fetching supported chains:", error);
    return { error: `Failed to fetch supported chains: ${error}` };
  }
}
