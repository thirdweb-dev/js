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
  teamId: string;
}) {
  const authToken = await getAuthToken();
  const res = await fetch(`${UB_BASE_URL}/v1/developer/fees`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-team-id": props.teamId,
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
  teamId: string;
  feeRecipient: string;
  feeBps: number;
}) {
  const authToken = await getAuthToken();
  const res = await fetch(`${UB_BASE_URL}/v1/developer/fees`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-client-id-override": props.clientId,
      "x-team-id": props.teamId,
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
  return json as PaymentsResponse;
}
