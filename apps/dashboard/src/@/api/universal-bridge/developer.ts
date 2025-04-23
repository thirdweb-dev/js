"use server";
import { getAuthToken } from "app/(app)/api/lib/getAuthToken";

const UB_BASE_URL = process.env.NEXT_PUBLIC_THIRDWEB_BRIDGE_HOST;

type Webhook = {
  url: string;
  label: string;
  active: boolean;
  createdAt: string;
  id: string;
  secret: string;
  version?: number; // TODO (UB) make this mandatory after migration
};

export async function getWebhooks(props: {
  clientId: string;
}) {
  const authToken = await getAuthToken();
  const res = await fetch(`${UB_BASE_URL}/v1/developer/webhooks`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-client-id-override": props.clientId,
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  const json = await res.json();
  return json.data as Array<Webhook>;
}

export async function createWebhook(props: {
  clientId: string;
  version?: number;
  url: string;
  label: string;
  secret?: string;
}) {
  const authToken = await getAuthToken();
  const res = await fetch(`${UB_BASE_URL}/v1/developer/webhooks`, {
    method: "POST",
    body: JSON.stringify({
      url: props.url,
      label: props.label,
      version: props.version,
      secret: props.secret,
    }),
    headers: {
      "Content-Type": "application/json",
      "x-client-id-override": props.clientId,
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  return;
}

export async function deleteWebhook(props: {
  clientId: string;
  webhookId: string;
}) {
  const authToken = await getAuthToken();
  const res = await fetch(
    `${UB_BASE_URL}/v1/developer/webhooks/${props.webhookId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-client-id-override": props.clientId,
        Authorization: `Bearer ${authToken}`,
      },
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  return;
}

export type Fee = {
  feeRecipient: string;
  feeBps: number;
  createdAt: string;
  updatedAt: string;
};

export async function getFees(props: {
  clientId: string;
}) {
  const authToken = await getAuthToken();
  const res = await fetch(`${UB_BASE_URL}/v1/developer/fees`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-client-id-override": props.clientId,
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  const json = await res.json();
  return json.data as Fee;
}

export async function updateFee(props: {
  clientId: string;
  feeRecipient: string;
  feeBps: number;
}) {
  const authToken = await getAuthToken();
  const res = await fetch(`${UB_BASE_URL}/v1/developer/fees`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-client-id-override": props.clientId,
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      feeRecipient: props.feeRecipient,
      feeBps: props.feeBps,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  return;
}
