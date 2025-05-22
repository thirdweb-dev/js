import { getPaymentLink } from "@/api/universal-bridge/links";
import type { Metadata } from "next";
import { defineChain, getContract } from "thirdweb";
import { getCurrencyMetadata } from "thirdweb/extensions/erc20";
import { checksumAddress } from "thirdweb/utils";
import { getClientThirdwebClient } from "../../../@/constants/thirdweb-client.client";
import { PayPageEmbed } from "../components/client/PayPageEmbed.client";

const title = "thirdweb Pay";
const description = "Fast, secure, and simple payments.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
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
    client: getClientThirdwebClient(undefined), // for this RPC call, use the dashboard client
    // eslint-disable-next-line no-restricted-syntax
    chain: defineChain(Number(paymentLink.destinationToken.chainId)),
    address: paymentLink.destinationToken.address,
  });
  const {
    symbol,
    decimals,
    name: tokenName,
  } = await getCurrencyMetadata({
    contract: tokenContract,
  });
  const token = {
    symbol,
    decimals,
    name: tokenName,
    address: checksumAddress(paymentLink.destinationToken.address),
    chainId: Number(paymentLink.destinationToken.chainId),
  };

  return (
    <PayPageEmbed
      redirectUri={redirectUri}
      paymentLinkId={id}
      chainId={Number(paymentLink.destinationToken.chainId)}
      recipientAddress={paymentLink.receiver}
      amount={paymentLink.amount ? BigInt(paymentLink.amount) : undefined}
      token={token}
      clientId={paymentLink.clientId}
      name={paymentLink.label}
      theme={theme}
    />
  );
}
