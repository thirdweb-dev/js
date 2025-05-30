import type { Metadata } from "next";
import { createThirdwebClient, defineChain, getContract } from "thirdweb";
import { getCurrencyMetadata } from "thirdweb/extensions/erc20";
import { checksumAddress } from "thirdweb/utils";
import { PayPageEmbed } from "./components/client/PayPageEmbed.client";
import { PaymentLinkForm } from "./components/client/PaymentLinkForm.client";
import type { PayParams } from "./components/types";
import { payAppThirdwebClient } from "./constants";

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
  searchParams,
}: { searchParams: Promise<PayParams> }) {
  const params = await searchParams;

  // If no query parameters are provided, show the form
  if (
    !params.chainId &&
    !params.recipientAddress &&
    !params.tokenAddress &&
    !params.amount
  ) {
    return <PaymentLinkForm />;
  }

  // Validate query parameters
  if (Array.isArray(params.chainId)) {
    throw new Error("A single chainId parameter is required.");
  }
  if (Array.isArray(params.recipientAddress)) {
    throw new Error("A single recipientAddress parameter is required.");
  }
  if (Array.isArray(params.tokenAddress)) {
    throw new Error("A single tokenAddress parameter is required.");
  }
  if (Array.isArray(params.amount)) {
    throw new Error("A single amount parameter is required.");
  }
  if (Array.isArray(params.clientId)) {
    throw new Error("A single clientId parameter is required.");
  }
  if (Array.isArray(params.redirectUri)) {
    throw new Error("A single redirectUri parameter is required.");
  }

  // Use any provided clientId or use the dashboard client
  const client =
    params.clientId && !Array.isArray(params.clientId)
      ? createThirdwebClient({ clientId: params.clientId })
      : payAppThirdwebClient;

  const tokenContract = getContract({
    client: payAppThirdwebClient,
    // eslint-disable-next-line no-restricted-syntax
    chain: defineChain(Number(params.chainId)),
    address: params.tokenAddress,
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
    address: checksumAddress(params.tokenAddress),
    chainId: Number(params.chainId),
  };

  return (
    <PayPageEmbed
      redirectUri={params.redirectUri}
      chainId={Number(params.chainId)}
      recipientAddress={params.recipientAddress}
      amount={BigInt(params.amount)}
      token={token}
      clientId={client.clientId}
      name={params.name}
      image={params.image}
      theme={params.theme}
      purchaseData={undefined}
    />
  );
}
