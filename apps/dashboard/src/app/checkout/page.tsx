import "../../global.css";
import { getThirdwebClient } from "@/constants/thirdweb.server";
import type { Metadata } from "next";
import { createThirdwebClient, defineChain, getContract } from "thirdweb";
import { getCurrencyMetadata } from "thirdweb/extensions/erc20";
import { checksumAddress } from "thirdweb/utils";
import { CheckoutEmbed } from "./components/client/CheckoutEmbed.client";

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
}: { searchParams: Record<string, string | string[]> }) {
  const {
    chainId,
    recipientAddress,
    tokenAddress,
    amount,
    clientId,
    redirectUri,
  } = searchParams;

  if (!chainId || Array.isArray(chainId)) {
    throw new Error("A single chainId parameter is required.");
  }
  if (!recipientAddress || Array.isArray(recipientAddress)) {
    throw new Error("A single recipientAddress parameter is required.");
  }
  if (!tokenAddress || Array.isArray(tokenAddress)) {
    throw new Error("A single tokenAddress parameter is required.");
  }
  if (!amount || Array.isArray(amount)) {
    throw new Error("A single amount parameter is required.");
  }
  if (Array.isArray(clientId)) {
    throw new Error("A single clientId parameter is required.");
  }
  if (Array.isArray(redirectUri)) {
    throw new Error("A single redirectUri parameter is required.");
  }

  // Use any provided clientId or use the dashboard client
  const client =
    clientId && !Array.isArray(clientId)
      ? createThirdwebClient({ clientId })
      : getThirdwebClient(undefined);

  const tokenContract = getContract({
    client,
    // eslint-disable-next-line no-restricted-syntax
    chain: defineChain(Number(chainId)),
    address: tokenAddress,
  });
  const { symbol, decimals, name } = await getCurrencyMetadata({
    contract: tokenContract,
  });
  const token = {
    symbol,
    decimals,
    name,
    address: checksumAddress(tokenAddress),
    chainId: Number(chainId),
  };

  return (
    <div className="relative mx-auto flex h-screen w-screen flex-col items-center justify-center overflow-hidden border py-10">
      <main className="container z-10 flex justify-center">
        <CheckoutEmbed
          redirectUri={redirectUri}
          chainId={Number(chainId)}
          recipientAddress={recipientAddress}
          amount={BigInt(amount)}
          token={token}
          clientId={client.clientId}
        />
      </main>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt=""
        src="/assets/login/background.svg"
        className="-bottom-12 -right-12 pointer-events-none absolute lg:right-0 lg:bottom-0"
      />
    </div>
  );
}
