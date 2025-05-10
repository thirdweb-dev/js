"use server";

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
      params?: string[];
    }>;
  };
}

interface CreateWebhookPayload {
  webhook_url: string;
  filters: WebhookFilters;
}

interface WebhooksListResponse {
  data: WebhookResponse[];
}

interface WebhookSingleResponse {
  data: WebhookResponse;
}

interface TestWebhookPayload {
  webhook_url: string;
  type?: "event" | "transaction";
}

interface TestWebhookResponse {
  success: boolean;
}

export async function createWebhook(
  payload: CreateWebhookPayload,
  clientId: string,
): Promise<WebhookSingleResponse> {
  const response = await fetch(`${THIRDWEB_INSIGHT_API_DOMAIN}/v1/webhooks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-client-id": clientId,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create webhook: ${errorText}`);
  }

  return await response.json();
}

export async function getWebhooks(
  clientId: string,
): Promise<WebhooksListResponse> {
  const response = await fetch(`${THIRDWEB_INSIGHT_API_DOMAIN}/v1/webhooks`, {
    method: "GET",
    headers: {
      "x-client-id": clientId,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to get webhooks: ${errorText}`);
  }

  return await response.json();
}

export async function deleteWebhook(
  webhookId: string,
  clientId: string,
): Promise<WebhookSingleResponse> {
  const response = await fetch(
    `${THIRDWEB_INSIGHT_API_DOMAIN}/v1/webhooks/${webhookId}`,
    {
      method: "DELETE",
      headers: {
        "x-client-id": clientId,
      },
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to delete webhook: ${errorText}`);
  }

  return await response.json();
}

export async function testWebhook(
  payload: TestWebhookPayload,
  clientId: string,
): Promise<TestWebhookResponse> {
  const response = await fetch(
    `${THIRDWEB_INSIGHT_API_DOMAIN}/v1/webhooks/test`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": clientId,
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to test webhook: ${errorText}`);
  }

  return await response.json();
}
