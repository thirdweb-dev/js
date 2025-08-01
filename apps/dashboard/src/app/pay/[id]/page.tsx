import type { Metadata } from "next";
import { defineChain, getContract } from "thirdweb";
import { getCurrencyMetadata } from "thirdweb/extensions/erc20";
import { checksumAddress } from "thirdweb/utils";
import { getPaymentLink } from "@/api/universal-bridge/links";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { PayPageWidget } from "../components/client/PayPageWidget.client";

const title = "thirdweb Pay";
const description = "Fast, secure, and simple payments.";

export const metadata: Metadata = {
  description,
  openGraph: {
    description,
    title,
  },
  title,
};

export default async function PayPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ redirectUri?: string; theme?: "light" | "dark" }>;
}) {
  const { id } = await params;
  const { redirectUri, theme } = await searchParams;

  const paymentLink = await getPaymentLink({
    paymentId: id,
  });

  const tokenContract = getContract({
    address: paymentLink.destinationToken.address, // for this RPC call, use the dashboard client
    // eslint-disable-next-line no-restricted-syntax
    chain: defineChain(Number(paymentLink.destinationToken.chainId)),
    client: getClientThirdwebClient(undefined),
  });
  const {
    symbol,
    decimals,
    name: tokenName,
  } = await getCurrencyMetadata({
    contract: tokenContract,
  });
  const token = {
    address: checksumAddress(paymentLink.destinationToken.address),
    chainId: Number(paymentLink.destinationToken.chainId),
    decimals,
    name: tokenName,
    symbol,
  };

  return (
    <PayPageWidget
      amount={paymentLink.amount ? BigInt(paymentLink.amount) : undefined}
      chainId={Number(paymentLink.destinationToken.chainId)}
      clientId={undefined} // Payment links don't need to use the same client ID to be executed
      image={paymentLink.imageUrl}
      name={paymentLink.title}
      paymentLinkId={id}
      purchaseData={paymentLink.purchaseData}
      recipientAddress={paymentLink.receiver}
      redirectUri={redirectUri}
      theme={theme}
      token={token}
    />
  );
}
