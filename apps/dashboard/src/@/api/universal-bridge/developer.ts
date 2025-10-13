import type { Address } from "thirdweb";
import { NEXT_PUBLIC_THIRDWEB_BRIDGE_HOST } from "@/constants/public-envs";

const UB_BASE_URL = NEXT_PUBLIC_THIRDWEB_BRIDGE_HOST;

export type Webhook = {
  url: string;
  label: string;
  active: boolean;
  createdAt: string;
  id: string;
  version?: number; // TODO (UB) make this mandatory after migration
};

export async function getWebhooks(params: {
  clientId: string;
  teamId: string;
  authToken: string;
}) {
  const res = await fetch(`${UB_BASE_URL}/v1/developer/webhooks`, {
    headers: {
      Authorization: `Bearer ${params.authToken}`,
      "Content-Type": "application/json",
      "x-client-id": params.clientId,
      "x-team-id": params.teamId,
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

export async function getWebhookById(params: {
  clientId: string;
  teamId: string;
  authToken: string;
  webhookId: string;
}) {
  const res = await fetch(
    `${UB_BASE_URL}/v1/developer/webhooks/${encodeURIComponent(params.webhookId)}`,
    {
      headers: {
        Authorization: `Bearer ${params.authToken}`,
        "Content-Type": "application/json",
        "x-client-id": params.clientId,
        "x-team-id": params.teamId,
      },
      method: "GET",
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  const json = await res.json();
  return json.data as Webhook;
}

export async function createWebhook(params: {
  clientId: string;
  teamId: string;
  version?: number;
  url: string;
  label: string;
  secret?: string;
  authToken: string;
}) {
  const res = await fetch(`${UB_BASE_URL}/v1/developer/webhooks`, {
    body: JSON.stringify({
      label: params.label,
      secret: params.secret,
      url: params.url,
      version: params.version,
    }),
    headers: {
      Authorization: `Bearer ${params.authToken}`,
      "Content-Type": "application/json",
      "x-client-id": params.clientId,
      "x-team-id": params.teamId,
    },
    method: "POST",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  return (await res.json()) as Webhook;
}

export async function deleteWebhook(params: {
  clientId: string;
  teamId: string;
  webhookId: string;
  authToken: string;
}) {
  const res = await fetch(
    `${UB_BASE_URL}/v1/developer/webhooks/${encodeURIComponent(params.webhookId)}`,
    {
      headers: {
        Authorization: `Bearer ${params.authToken}`,
        "Content-Type": "application/json",
        "x-client-id": params.clientId,
        "x-team-id": params.teamId,
      },
      method: "DELETE",
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  return true;
}

export async function updateWebhook(params: {
  clientId: string;
  teamId: string;
  webhookId: string;
  authToken: string;
  body: {
    version?: number;
    url: string;
    label: string;
  };
}) {
  const res = await fetch(
    `${UB_BASE_URL}/v1/developer/webhooks/${encodeURIComponent(params.webhookId)}`,
    {
      method: "PUT",
      body: JSON.stringify(params.body),
      headers: {
        Authorization: `Bearer ${params.authToken}`,
        "Content-Type": "application/json",
        "x-client-id": params.clientId,
        "x-team-id": params.teamId,
      },
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  const json = await res.json();

  return json.data as Webhook;
}

export type WebhookSend = {
  id: string;
  webhookId: string;
  webhookUrl: string;
  createdAt: string;
  onrampId: string | null;
  paymentId: string | null;
  response: string | null;
  responseStatus: number;
  status: "PENDING" | "COMPLETED" | "FAILED";
  success: boolean;
  transactionId: string | null;
  body: unknown;
};

type WebhookSendsResponse = {
  data: WebhookSend[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
};

export async function getWebhookSends(options: {
  authToken: string;
  projectClientId: string;
  teamId: string;
  limit?: number;
  offset?: number;
  webhookId: string;
  success?: boolean;
}): Promise<WebhookSendsResponse> {
  const { limit, offset, success, webhookId, authToken } = options;

  const url = new URL(
    `${NEXT_PUBLIC_THIRDWEB_BRIDGE_HOST}/v1/developer/webhook-sends`,
  );

  url.searchParams.set("webhookId", webhookId);

  if (limit !== undefined) {
    url.searchParams.set("limit", limit.toString());
  }
  if (offset !== undefined) {
    url.searchParams.set("offset", offset.toString());
  }
  if (success !== undefined) {
    url.searchParams.set("success", success.toString());
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "x-client-id": options.projectClientId,
      "x-team-id": options.teamId,
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    const errorJson = await response.json();
    throw new Error(errorJson.message);
  }

  return (await response.json()) as WebhookSendsResponse;
}

export async function resendWebhook(
  params: {
    authToken: string;
    projectClientId: string;
    teamId: string;
  } & (
    | {
        paymentId: string;
      }
    | {
        onrampId: string;
      }
  ),
) {
  const url = new URL(
    `${NEXT_PUBLIC_THIRDWEB_BRIDGE_HOST}/v1/developer/webhooks/retry`,
  );

  const response = await fetch(url.toString(), {
    method: "POST",
    body: JSON.stringify(
      "paymentId" in params
        ? { paymentId: params.paymentId }
        : { onrampId: params.onrampId },
    ),
    headers: {
      "Content-Type": "application/json",
      "x-client-id": params.projectClientId,
      "x-team-id": params.teamId,
      Authorization: `Bearer ${params.authToken}`,
    },
  });

  if (!response.ok) {
    const errorJson = await response.json();
    throw new Error(errorJson.message);
  }

  return true;
}

type PaymentLink = {
  id: string;
  link: string;
  title: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  destinationToken: {
    chainId: number;
    address: Address;
    symbol: string;
    name: string;
    decimals: number;
    iconUri: string;
  };
  receiver: Address;
  amount: bigint;
};

export async function getPaymentLinks(params: {
  clientId: string;
  teamId: string;
  authToken: string;
}): Promise<Array<PaymentLink>> {
  const res = await fetch(`${UB_BASE_URL}/v1/developer/links`, {
    headers: {
      Authorization: `Bearer ${params.authToken}`,
      "Content-Type": "application/json",
      "x-client-id": params.clientId,
      "x-team-id": params.teamId,
    },
    method: "GET",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  const json = (await res.json()) as {
    data: Array<PaymentLink & { amount: string }>;
  };
  return json.data.map((link) => ({
    id: link.id,
    link: link.link,
    title: link.title,
    imageUrl: link.imageUrl,
    createdAt: link.createdAt,
    updatedAt: link.updatedAt,
    destinationToken: {
      chainId: link.destinationToken.chainId,
      address: link.destinationToken.address,
      symbol: link.destinationToken.symbol,
      name: link.destinationToken.name,
      decimals: link.destinationToken.decimals,
      iconUri: link.destinationToken.iconUri,
    },
    receiver: link.receiver,
    amount: BigInt(link.amount),
  }));
}

export async function createPaymentLink(params: {
  clientId: string;
  teamId: string;
  title: string;
  imageUrl?: string;
  intent: {
    destinationChainId: number;
    destinationTokenAddress: Address;
    receiver: Address;
    amount: bigint;
    purchaseData?: unknown;
  };
  authToken: string;
}) {
  const res = await fetch(`${UB_BASE_URL}/v1/developer/links`, {
    body: JSON.stringify({
      title: params.title,
      imageUrl: params.imageUrl,
      intent: {
        destinationChainId: params.intent.destinationChainId,
        destinationTokenAddress: params.intent.destinationTokenAddress,
        receiver: params.intent.receiver,
        amount: params.intent.amount.toString(),
        purchaseData: params.intent.purchaseData,
      },
    }),
    headers: {
      Authorization: `Bearer ${params.authToken}`,
      "Content-Type": "application/json",
      "x-client-id": params.clientId,
      "x-team-id": params.teamId,
    },
    method: "POST",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  const response = (await res.json()) as {
    data: PaymentLink;
  };

  return response.data;
}

export async function deletePaymentLink(params: {
  clientId: string;
  teamId: string;
  paymentLinkId: string;
  authToken: string;
}) {
  const res = await fetch(
    `${UB_BASE_URL}/v1/developer/links/${encodeURIComponent(params.paymentLinkId)}`,
    {
      headers: {
        Authorization: `Bearer ${params.authToken}`,
        "Content-Type": "application/json",
        "x-client-id": params.clientId,
        "x-team-id": params.teamId,
      },
      method: "DELETE",
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  return true;
}

export type Fee = {
  feeRecipient: string;
  feeBps: number;
  createdAt: string;
  updatedAt: string;
};

export async function getFees(params: {
  clientId: string;
  teamId: string;
  authToken: string;
}) {
  const res = await fetch(`${UB_BASE_URL}/v1/developer/fees`, {
    headers: {
      Authorization: `Bearer ${params.authToken}`,
      "Content-Type": "application/json",
      "x-client-id": params.clientId,
      "x-team-id": params.teamId,
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

export async function updateFee(params: {
  clientId: string;
  teamId: string;
  feeRecipient: string;
  feeBps: number;
  authToken: string;
}) {
  const res = await fetch(`${UB_BASE_URL}/v1/developer/fees`, {
    body: JSON.stringify({
      feeBps: params.feeBps,
      feeRecipient: params.feeRecipient,
    }),
    headers: {
      Authorization: `Bearer ${params.authToken}`,
      "Content-Type": "application/json",
      "x-client-id": params.clientId,
      "x-team-id": params.teamId,
    },
    method: "PUT",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  return true;
}

export type PaymentsResponse = {
  data: Payment[];
  meta: {
    totalCount: number;
  };
};

type BridgePaymentType = "buy" | "sell" | "transfer";
type OnrampPaymentType = "onramp";

export type Payment = {
  // common
  id: string;
  createdAt: string;
  clientId: string;
  receiver: string;
  transactions: Array<{
    chainId: number;
    transactionHash: string;
  }>;
  status: "PENDING" | "COMPLETED" | "FAILED" | "NOT_FOUND";

  destinationAmount: string;
  destinationToken: {
    address: string;
    symbol: string;
    decimals: number;
    chainId: number;
  };
  purchaseData: unknown;
} & (
  | {
      type: BridgePaymentType;
      transactionId: string;
      blockNumber?: string;
      sender: string;
      developerFeeRecipient: string;
      developerFeeBps: number;
      originAmount: string;
      originToken: {
        address: string;
        symbol: string;
        decimals: number;
        chainId: number;
      };
    }
  | {
      onrampId: string;
      type: OnrampPaymentType;
    }
);

export type BridgePayment = Extract<Payment, { type: BridgePaymentType }>;

export async function getPayments(params: {
  clientId: string;
  teamId: string;
  paymentLinkId?: string;
  limit?: number;
  authToken: string;
  offset?: number;
}) {
  const url = new URL(`${UB_BASE_URL}/v1/developer/payments`);

  if (params.limit) {
    url.searchParams.append("limit", params.limit.toString());
  }

  if (params.offset) {
    url.searchParams.append("offset", params.offset.toString());
  }

  if (params.paymentLinkId) {
    url.searchParams.append("paymentLinkId", params.paymentLinkId);
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${params.authToken}`,
      "Content-Type": "application/json",
      "x-client-id": params.clientId,
      "x-team-id": params.teamId,
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
