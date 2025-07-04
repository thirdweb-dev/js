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

type WebhookConfigsResponse =
  | {
      data: WebhookConfig[];
      status: "success";
    }
  | {
      body: string;
      reason: string;
      status: "error";
    };

interface CreateWebhookConfigRequest {
  topicIds: string[];
  destinationUrl: string;
  description: string;
  isPaused?: boolean;
}

type CreateWebhookConfigResponse =
  | {
      data: WebhookConfig;
      status: "success";
    }
  | {
      body: string;
      reason: string;
      status: "error";
    };

export interface Topic {
  id: string;
  serviceName: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

type TopicsResponse =
  | {
      data: Topic[];
      status: "success";
    }
  | {
      body: string;
      reason: string;
      status: "error";
    };

interface UpdateWebhookConfigRequest {
  destinationUrl?: string;
  topicIds?: string[];
  description?: string;
  isPaused?: boolean;
}

type UpdateWebhookConfigResponse =
  | {
      data: WebhookConfig;
      status: "success";
    }
  | {
      body: string;
      reason: string;
      status: "error";
    };

type DeleteWebhookConfigResponse =
  | {
      data: WebhookConfig;
      status: "success";
    }
  | {
      body: string;
      reason: string;
      status: "error";
    };

export async function getWebhookConfigs(props: {
  teamIdOrSlug: string;
  projectIdOrSlug: string;
}): Promise<WebhookConfigsResponse> {
  const authToken = await getAuthToken();

  if (!authToken) {
    return {
      body: "Authentication required",
      reason: "no_auth_token",
      status: "error",
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
    const body = await response.text();
    return {
      body,
      reason: "unknown",
      status: "error",
    };
  }

  const result = await response.json();
  return {
    data: result.data,
    status: "success",
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
      body: "Authentication required",
      reason: "no_auth_token",
      status: "error",
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
    const body = await response.text();
    return {
      body,
      reason: "unknown",
      status: "error",
    };
  }

  const result = await response.json();
  return {
    data: result.data,
    status: "success",
  };
}

export async function getAvailableTopics(): Promise<TopicsResponse> {
  const authToken = await getAuthToken();

  if (!authToken) {
    return {
      body: "Authentication required",
      reason: "no_auth_token",
      status: "error",
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
    const body = await response.text();
    return {
      body,
      reason: "unknown",
      status: "error",
    };
  }

  const result = await response.json();
  return {
    data: result.data,
    status: "success",
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
      body: "Authentication required",
      reason: "no_auth_token",
      status: "error",
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
    const body = await response.text();
    return {
      body,
      reason: "unknown",
      status: "error",
    };
  }

  const result = await response.json();
  return {
    data: result.data,
    status: "success",
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
      body: "Authentication required",
      reason: "no_auth_token",
      status: "error",
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
    const body = await response.text();
    return {
      body,
      reason: "unknown",
      status: "error",
    };
  }

  const result = await response.json();
  return {
    data: result.data,
    status: "success",
  };
}
