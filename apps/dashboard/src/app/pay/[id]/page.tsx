import { ShieldCheckIcon } from "lucide-react";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Bridge, defineChain, toTokens } from "thirdweb";
import { getChainMetadata } from "thirdweb/chains";
import { shortenAddress } from "thirdweb/utils";
import { getPaymentLink } from "@/api/universal-bridge/links";
import { Badge } from "@/components/ui/badge";
import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "@/constants/public-envs";
import {
  API_SERVER_SECRET,
  DASHBOARD_THIRDWEB_SECRET_KEY,
} from "@/constants/server-envs";
import { getConfiguredThirdwebClient } from "@/constants/thirdweb.server";
import { resolveEns } from "@/lib/ens";
import { resolveSchemeWithErrorHandler } from "@/utils/resolveSchemeWithErrorHandler";
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

  const projectMetadataPromise = getProjectMetadata(paymentLink.clientId);

  const tokensPromise = Bridge.tokens({
    client: getConfiguredThirdwebClient({
      secretKey: DASHBOARD_THIRDWEB_SECRET_KEY,
      teamId: undefined,
    }),
    chainId: Number(paymentLink.destinationToken.chainId),
    tokenAddress: paymentLink.destinationToken.address,
  });

  const chainPromise = getChainMetadata(
    // eslint-disable-next-line no-restricted-syntax
    defineChain(Number(paymentLink.destinationToken.chainId)),
  );

  const recipientPromise = resolveEns(
    paymentLink.receiver,
    getConfiguredThirdwebClient({
      secretKey: DASHBOARD_THIRDWEB_SECRET_KEY,
      teamId: undefined,
    }),
  );

  const [tokens, projectMetadata, chain, recipientEnsOrAddress] =
    await Promise.all([
      tokensPromise,
      projectMetadataPromise,
      chainPromise,
      recipientPromise,
    ]);

  const token = tokens[0];
  if (!token) {
    throw new Error("Token not found");
  }

  return (
    <ThemeProvider
      forcedTheme={theme === "light" ? "light" : "dark"}
      attribute="class"
      disableTransitionOnChange
      enableSystem={false}
    >
      <div className="flex z-10 flex-col lg:flex-row h-full w-full">
        <header className="min-w-full lg:min-w-[500px] border-b lg:border-r lg:h-full bg-card flex flex-col gap-4 items-start p-4 lg:p-8">
          <div>
            <div className="flex flex-row items-center justify-start gap-4">
              {projectMetadata.image && (
                <img
                  src={
                    resolveSchemeWithErrorHandler({
                      uri: projectMetadata.image,
                      client: payAppThirdwebClient,
                    }) || ""
                  }
                  alt={projectMetadata.name}
                  width={25}
                  height={25}
                  className="rounded-full overflow-hidden"
                />
              )}
              <h2 className="text-xl font-bold">{projectMetadata.name}</h2>
            </div>
            {projectMetadata.description && (
              <p className="mt-2 text-sm text-muted-foreground">
                {projectMetadata.description}
              </p>
            )}
          </div>

          <div className="hidden lg:block my-4 w-full">
            {paymentLink.amount && (
              <div className="flex flex-col gap-1 w-full my-4">
                <span className="text-muted-foreground text-xs">Details</span>
                <div className="font-medium flex-row flex justify-between items-center w-full">
                  <div className="flex flex-row items-center gap-2">
                    {token.iconUri && (
                      <img
                        src={resolveSchemeWithErrorHandler({
                          uri: token.iconUri,
                          client: getConfiguredThirdwebClient({
                            secretKey: DASHBOARD_THIRDWEB_SECRET_KEY,
                            teamId: undefined,
                          }),
                        })}
                        alt={token.name}
                        width={25}
                        height={25}
                        className="size-5 rounded-full overflow-hidden"
                      />
                    )}
                    {toTokens(BigInt(paymentLink.amount), token.decimals)}{" "}
                    {token.symbol}
                  </div>
                  {token.prices.USD && (
                    <span>
                      $
                      {(
                        Number(token.prices.USD) *
                        Number(
                          toTokens(BigInt(paymentLink.amount), token.decimals),
                        )
                      ).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            )}
            {chain && (
              <div className="flex flex-col gap-1 w-full my-4">
                <span className="text-muted-foreground text-xs">Network</span>
                <div className="font-medium flex-row flex justify-between items-center w-full">
                  <div className="flex flex-row items-center gap-2">
                    {chain.icon?.url && (
                      <img
                        src={resolveSchemeWithErrorHandler({
                          uri: chain.icon.url,
                          client: getConfiguredThirdwebClient({
                            secretKey: DASHBOARD_THIRDWEB_SECRET_KEY,
                            teamId: undefined,
                          }),
                        })}
                        alt={chain.name}
                        width={chain.icon.width}
                        height={chain.icon.height}
                        className="size-5 rounded-full overflow-hidden"
                      />
                    )}
                    {chain.name}
                  </div>
                </div>
              </div>
            )}
            {recipientEnsOrAddress.ensName ||
              (recipientEnsOrAddress.address && (
                <div className="flex flex-col gap-1 w-full my-4">
                  <span className="text-muted-foreground text-xs">Seller</span>
                  <div className="font-medium flex-row flex justify-between items-center w-full">
                    {recipientEnsOrAddress.ensName ??
                      shortenAddress(recipientEnsOrAddress.address)}
                  </div>
                </div>
              ))}
          </div>

          <div className="mt-auto hidden lg:block">
            <Badge className="flex items-center gap-1.5 bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800">
              <ShieldCheckIcon className="size-3" />
              Secured by thirdweb
            </Badge>
          </div>
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
            token={token}
          />
        </main>
      </div>
    </ThemeProvider>
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
