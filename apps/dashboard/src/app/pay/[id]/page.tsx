import type { Metadata } from "next";
import Image from "next/image";
import { defineChain, getContract } from "thirdweb";
import { getCurrencyMetadata } from "thirdweb/extensions/erc20";
import { resolveScheme } from "thirdweb/storage";
import { checksumAddress } from "thirdweb/utils";
import { getPaymentLink } from "@/api/universal-bridge/links";
import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "@/constants/public-envs";
import { API_SERVER_SECRET } from "@/constants/server-envs";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { PayPageWidget } from "../components/client/PayPageWidget.client";
import { payAppThirdwebClient } from "../constants";

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
  const currencyMetadataPromise = getCurrencyMetadata({
    contract: tokenContract,
  });

  const projectMetadataPromise = getProjectMetadata(paymentLink.clientId);

  const [{ symbol, decimals, name: tokenName }, projectMetadata] =
    await Promise.all([currencyMetadataPromise, projectMetadataPromise]);

  const token = {
    address: checksumAddress(paymentLink.destinationToken.address),
    chainId: Number(paymentLink.destinationToken.chainId),
    decimals,
    name: tokenName,
    symbol,
  };

  return (
    <div className="flex z-10 flex-col lg:flex-row h-full w-full">
      <header className="min-w-full lg:min-w-[500px] border-b lg:border-r lg:h-full bg-card flex flex-col gap-4 items-start p-4 lg:p-8">
        <div className="flex flex-row items-center justify-center gap-4">
          {projectMetadata.image && (
            <Image
              src={resolveScheme({
                uri: projectMetadata.image,
                client: payAppThirdwebClient,
              })}
              alt={projectMetadata.name}
              width={25}
              height={25}
              className="rounded-full overflow-hidden"
            />
          )}
          <h2 className="text-xl font-bold">{projectMetadata.name}</h2>
        </div>
        {projectMetadata.description && (
          <p className="text-sm text-muted-foreground">
            {projectMetadata.description}
          </p>
        )}
      </header>
      <main className="flex justify-center p-12 w-full items-center">
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
      </main>
    </div>
  );
}

async function getProjectMetadata(clientId: string) {
  const url = new URL(`${NEXT_PUBLIC_THIRDWEB_API_HOST}/v2/keys/lookup`);
  url.searchParams.append("clientId", clientId);
  const response = await fetch(url.toString(), {
    headers: {
      "x-service-api-key": API_SERVER_SECRET,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch project");
  }

  const { data } = (await response.json()) as {
    data: { name: string; image: string | null; description: string | null };
  };
  return data;
}
