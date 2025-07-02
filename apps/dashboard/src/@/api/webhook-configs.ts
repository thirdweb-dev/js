"use server";

import { getAuthToken } from "@/api/auth-token";
import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "@/constants/public-envs";

export interface WebhookConfig {
  id: string;
  teamId: string;
  projectId: string;
  destinationUrl: string;
  description: string;
  pausedAt: string | null;
  webhookSecret: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  topics: {
    id: string;
    serviceName: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }[];
}

interface WebhookConfigsResponse {
  data: WebhookConfig[];
  error?: string;
}

interface CreateWebhookConfigRequest {
  topicIds: string[];
  destinationUrl: string;
  description: string;
  isPaused?: boolean;
}

interface CreateWebhookConfigResponse {
  data: WebhookConfig;
  error?: string;
}

export interface Topic {
  id: string;
  serviceName: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface TopicsResponse {
  data: Topic[];
  error?: string;
}

interface UpdateWebhookConfigRequest {
  destinationUrl?: string;
  topicIds?: string[];
  description?: string;
  isPaused?: boolean;
}

interface UpdateWebhookConfigResponse {
  data: WebhookConfig;
  error?: string;
}

interface DeleteWebhookConfigResponse {
  data: WebhookConfig;
  error?: string;
}

export async function getWebhookConfigs(props: {
  teamIdOrSlug: string;
  projectIdOrSlug: string;
}): Promise<WebhookConfigsResponse> {
  const authToken = await getAuthToken();

  if (!authToken) {
    return {
      data: [],
      error: "Authentication required",
    };
  }

  const response = await fetch(
    `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams/${props.teamIdOrSlug}/projects/${props.projectIdOrSlug}/webhook-configs`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      method: "GET",
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    return {
      data: [],
      error: `Failed to fetch webhook configs: ${errorText}`,
    };
  }

  const result = await response.json();
  return {
    data: result.data,
    error: undefined,
  };
}

export async function createWebhookConfig(props: {
  teamIdOrSlug: string;
  projectIdOrSlug: string;
  config: CreateWebhookConfigRequest;
}): Promise<CreateWebhookConfigResponse> {
  const authToken = await getAuthToken();

  if (!authToken) {
    return {
      data: {} as WebhookConfig,
      error: "Authentication required",
    };
  }

  const response = await fetch(
    `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams/${props.teamIdOrSlug}/projects/${props.projectIdOrSlug}/webhook-configs`,
    {
      body: JSON.stringify(props.config),
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    return {
      data: {} as WebhookConfig,
      error: `Failed to create webhook config: ${errorText}`,
    };
  }

  const result = await response.json();
  return {
    data: result.data,
    error: undefined,
  };
}

export async function getAvailableTopics(): Promise<TopicsResponse> {
  const authToken = await getAuthToken();

  if (!authToken) {
    return {
      data: [],
      error: "Authentication required",
    };
  }

  const response = await fetch(
    `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/webhook-topics`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      method: "GET",
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    return {
      data: [],
      error: `Failed to fetch topics: ${errorText}`,
    };
  }

  const result = await response.json();
  return {
    data: result.data,
    error: undefined,
  };
}

export async function updateWebhookConfig(props: {
  teamIdOrSlug: string;
  projectIdOrSlug: string;
  webhookConfigId: string;
  config: UpdateWebhookConfigRequest;
}): Promise<UpdateWebhookConfigResponse> {
  const authToken = await getAuthToken();

  if (!authToken) {
    return {
      data: {} as WebhookConfig,
      error: "Authentication required",
    };
  }

  const response = await fetch(
    `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams/${props.teamIdOrSlug}/projects/${props.projectIdOrSlug}/webhook-configs/${props.webhookConfigId}`,
    {
      body: JSON.stringify(props.config),
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      method: "PATCH",
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    return {
      data: {} as WebhookConfig,
      error: `Failed to update webhook config: ${errorText}`,
    };
  }

  const result = await response.json();
  return {
    data: result.data,
    error: undefined,
  };
}

export async function deleteWebhookConfig(props: {
  teamIdOrSlug: string;
  projectIdOrSlug: string;
  webhookConfigId: string;
}): Promise<DeleteWebhookConfigResponse> {
  const authToken = await getAuthToken();

  if (!authToken) {
    return {
      data: {} as WebhookConfig,
      error: "Authentication required",
    };
  }

  const response = await fetch(
    `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams/${props.teamIdOrSlug}/projects/${props.projectIdOrSlug}/webhook-configs/${props.webhookConfigId}`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      method: "DELETE",
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    return {
      data: {} as WebhookConfig,
      error: `Failed to delete webhook config: ${errorText}`,
    };
  }

  const result = await response.json();
  return {
    data: result.data,
    error: undefined,
  };
}
