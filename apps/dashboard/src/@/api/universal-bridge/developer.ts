"use server";
import type { Address } from "thirdweb";
import { getAuthToken } from "@/api/auth-token";
import { NEXT_PUBLIC_THIRDWEB_BRIDGE_HOST } from "@/constants/public-envs";

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

export async function getPaymentLinks(props: {
  clientId: string;
  teamId: string;
}): Promise<Array<PaymentLink>> {
  const authToken = await getAuthToken();
  const res = await fetch(`${UB_BASE_URL}/v1/developer/links`, {
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

export async function createPaymentLink(props: {
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
}) {
  const authToken = await getAuthToken();

  const res = await fetch(`${UB_BASE_URL}/v1/developer/links`, {
    body: JSON.stringify({
      title: props.title,
      imageUrl: props.imageUrl,
      intent: {
        destinationChainId: props.intent.destinationChainId,
        destinationTokenAddress: props.intent.destinationTokenAddress,
        receiver: props.intent.receiver,
        amount: props.intent.amount.toString(),
        purchaseData: props.intent.purchaseData,
      },
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

  const response = (await res.json()) as {
    data: PaymentLink;
  };

  return response.data;
}

export async function deletePaymentLink(props: {
  clientId: string;
  teamId: string;
  paymentLinkId: string;
}) {
  const authToken = await getAuthToken();
  const res = await fetch(
    `${UB_BASE_URL}/v1/developer/links/${props.paymentLinkId}`,
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

export async function getPayments(props: {
  clientId: string;
  teamId: string;
  paymentLinkId?: string;
  limit?: number;
  offset?: number;
}) {
  const authToken = await getAuthToken();

  // Build URL with query parameters if provided
  const url = new URL(`${UB_BASE_URL}/v1/developer/payments`);

  if (props.limit) {
    url.searchParams.append("limit", props.limit.toString());
  }

  if (props.offset) {
    url.searchParams.append("offset", props.offset.toString());
  }

  if (props.paymentLinkId) {
    url.searchParams.append("paymentLinkId", props.paymentLinkId);
  }

  const res = await fetch(url.toString(), {
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
