import { DASHBOARD_THIRDWEB_SECRET_KEY } from "@/constants/server-envs";
import { UB_BASE_URL } from "./constants";

type PaymentLink = {
  clientId: string;
  label?: string;
  receiver: string;
  destinationToken: {
    address: string;
    symbol: string;
    decimals: number;
    chainId: number;
  };
  amount: bigint | undefined;
  purchaseData: unknown;
};

export async function getPaymentLink(props: {
  paymentId: string;
}) {
  const res = await fetch(`${UB_BASE_URL}/v1/links/${props.paymentId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-secret-key": DASHBOARD_THIRDWEB_SECRET_KEY,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  const { data } = await res.json();
  return {
    clientId: data.clientId,
    label: data.label,
    receiver: data.receiver,
    destinationToken: data.destinationToken,
    amount: data.amount ? BigInt(data.amount) : undefined,
    purchaseData: data.purchaseData,
  } as PaymentLink;
}
