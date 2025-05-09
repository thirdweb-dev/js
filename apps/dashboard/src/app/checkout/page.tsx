import type { Metadata } from "next";
import { createThirdwebClient, defineChain, getContract } from "thirdweb";
import { getCurrencyMetadata } from "thirdweb/extensions/erc20";
import { checksumAddress } from "thirdweb/utils";
import { getClientThirdwebClient } from "../../@/constants/thirdweb-client.client";
import { CheckoutEmbed } from "./components/client/CheckoutEmbed.client";
import { CheckoutLinkForm } from "./components/client/CheckoutLinkForm.client";
import type { CheckoutParams } from "./components/types";

const title = "thirdweb Checkout";
const description = "Fast, secure, and simple payments.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
};

export default async function RoutesPage({
  searchParams,
}: { searchParams: Promise<CheckoutParams> }) {
  const params = await searchParams;

  // If no query parameters are provided, show the form
  if (
    !params.chainId ||
    !params.recipientAddress ||
    !params.tokenAddress ||
    !params.amount
  ) {
    return <CheckoutLinkForm />;
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
      : getClientThirdwebClient(undefined);

  const tokenContract = getContract({
    client: getClientThirdwebClient(undefined), // for this RPC call, use the dashboard client
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
    <CheckoutEmbed
      redirectUri={params.redirectUri}
      chainId={Number(params.chainId)}
      recipientAddress={params.recipientAddress}
      amount={BigInt(params.amount)}
      token={token}
      clientId={client.clientId}
      name={params.name}
      image={params.image}
      theme={params.theme}
    />
  );
}
