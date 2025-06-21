import "server-only";

import { DASHBOARD_THIRDWEB_SECRET_KEY } from "@/constants/server-envs";
import { UB_BASE_URL } from "./constants";

type PaymentLink = {
  clientId: string;
  title?: string;
  imageUrl?: string;
  receiver: string;
  destinationToken: {
    address: string;
    symbol: string;
    decimals: number;
    chainId: number;
  };
  amount: bigint | undefined;
  purchaseData: Record<string, unknown> | undefined;
};

export async function getPaymentLink(props: { paymentId: string }) {
  const res = await fetch(`${UB_BASE_URL}/v1/links/${props.paymentId}`, {
    headers: {
      "Content-Type": "application/json",
      "x-secret-key": DASHBOARD_THIRDWEB_SECRET_KEY,
    },
    method: "GET",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  const { data } = await res.json();
  return {
    amount: data.amount ? BigInt(data.amount) : undefined,
    clientId: data.clientId,
    destinationToken: data.destinationToken,
    imageUrl: data.imageUrl,
    purchaseData: data.purchaseData,
    receiver: data.receiver,
    title: data.title,
  } as PaymentLink;
}
