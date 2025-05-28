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

export async function createWebhook(
  payload: CreateWebhookPayload,
  clientId: string,
): Promise<WebhookSingleResponse> {
  try {
    const authToken = await getAuthToken();
    const response = await fetch(`${THIRDWEB_INSIGHT_API_DOMAIN}/v1/webhooks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": clientId,
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(payload),
    });

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
    const response = await fetch(`${THIRDWEB_INSIGHT_API_DOMAIN}/v1/webhooks`, {
      method: "GET",
      headers: {
        "x-client-id": clientId,
        Authorization: `Bearer ${authToken}`,
      },
    });

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
      `${THIRDWEB_INSIGHT_API_DOMAIN}/v1/webhooks/${encodeURIComponent(webhookId)}`,
      {
        method: "DELETE",
        headers: {
          "x-client-id": clientId,
          Authorization: `Bearer ${authToken}`,
        },
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
      `${THIRDWEB_INSIGHT_API_DOMAIN}/v1/webhooks/test`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-client-id": clientId,
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `Failed to test webhook: ${errorText}`,
      };
    }

    return (await response.json()) as TestWebhookResponse;
  } catch (error) {
    return {
      success: false,
      error: `Network or parsing error: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}
