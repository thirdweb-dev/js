"use server";
import { getAuthToken } from "app/(app)/api/lib/getAuthToken";
import { NEXT_PUBLIC_THIRDWEB_BRIDGE_HOST } from "../../constants/public-envs";

const UB_BASE_URL = NEXT_PUBLIC_THIRDWEB_BRIDGE_HOST;

type Webhook = {
  url: string;
  label: string;
  active: boolean;
  createdAt: string;
  id: string;
  secret: string;
  version?: number; // TODO (UB) make this mandatory after migration
};

export async function getWebhooks(props: { clientId: string; teamId: string }) {
  const authToken = await getAuthToken();
  const res = await fetch(`${UB_BASE_URL}/v1/developer/webhooks`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
      "x-client-id": props.clientId,
      "x-team-id": props.teamId,
    },
    method: "GET",
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
  teamId: string;
  version?: number;
  url: string;
  label: string;
  secret?: string;
}) {
  const authToken = await getAuthToken();

  const res = await fetch(`${UB_BASE_URL}/v1/developer/webhooks`, {
    body: JSON.stringify({
      label: props.label,
      secret: props.secret,
      url: props.url,
      version: props.version,
    }),
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
      "x-client-id": props.clientId,
      "x-team-id": props.teamId,
    },
    method: "POST",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  return;
}

export async function deleteWebhook(props: {
  clientId: string;
  teamId: string;
  webhookId: string;
}) {
  const authToken = await getAuthToken();
  const res = await fetch(
    `${UB_BASE_URL}/v1/developer/webhooks/${props.webhookId}`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
        "x-client-id": props.clientId,
        "x-team-id": props.teamId,
      },
      method: "DELETE",
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

export async function getFees(props: { clientId: string; teamId: string }) {
  const authToken = await getAuthToken();
  const res = await fetch(`${UB_BASE_URL}/v1/developer/fees`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
      "x-client-id": props.clientId,
      "x-team-id": props.teamId,
    },
    method: "GET",
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
  teamId: string;
  feeRecipient: string;
  feeBps: number;
}) {
  const authToken = await getAuthToken();
  const res = await fetch(`${UB_BASE_URL}/v1/developer/fees`, {
    body: JSON.stringify({
      feeBps: props.feeBps,
      feeRecipient: props.feeRecipient,
    }),
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
      "x-client-id": props.clientId,
      "x-team-id": props.teamId,
    },
    method: "PUT",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  return;
}

export type PaymentsResponse = {
  data: Payment[];
  meta: {
    totalCount: number;
  };
};
export type Payment = {
  id: string;
  blockNumber?: bigint;
  transactionId: string;
  clientId: string;
  sender: string;
  receiver: string;
  developerFeeRecipient: string;
  developerFeeBps: number;
  transactions: Array<{
    chainId: number;
    transactionHash: string;
  }>;
  status: "PENDING" | "COMPLETED" | "FAILED" | "NOT_FOUND";
  type: "buy" | "sell" | "transfer";
  originAmount: bigint;
  destinationAmount: bigint;
  purchaseData: unknown;
  originToken: {
    address: string;
    symbol: string;
    decimals: number;
    chainId: number;
  };
  destinationToken: {
    address: string;
    symbol: string;
    decimals: number;
    chainId: number;
  };
  createdAt: string;
};

export async function getPayments(props: {
  clientId: string;
  teamId: string;
  limit?: number;
  offset?: number;
}) {
  const authToken = await getAuthToken();

  // Build URL with query parameters if provided
  let url = `${UB_BASE_URL}/v1/developer/payments`;
  const queryParams = new URLSearchParams();

  if (props.limit) {
    queryParams.append("limit", props.limit.toString());
  }

  if (props.offset) {
    queryParams.append("offset", props.offset.toString());
  }

  // Append query params to URL if any exist
  const queryString = queryParams.toString();
  if (queryString) {
    url = `${url}?${queryString}`;
  }

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
      "x-client-id": props.clientId,
      "x-team-id": props.teamId,
    },
    method: "GET",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  const json = await res.json();
  return json as PaymentsResponse;
}
