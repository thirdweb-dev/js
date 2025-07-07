import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { defineChain, getAddress, NATIVE_TOKEN_ADDRESS } from "thirdweb";
import { type ChainMetadata, getChainMetadata } from "thirdweb/chains";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { serverThirdwebClient } from "@/constants/thirdweb-client.server";
import { resolveSchemeWithErrorHandler } from "@/utils/resolveSchemeWithErrorHandler";

type RouteListCardProps = {
  originChainId: number;
  originTokenAddress: string;
  originTokenIconUri?: string | null;
  originTokenSymbol: string;
  originTokenName: string;
  destinationChainId: number;
  destinationTokenAddress: string;
  destinationTokenIconUri?: string | null;
  destinationTokenSymbol: string;
  destinationTokenName: string;
};

export async function RouteListCard({
  originChainId,
  originTokenAddress,
  originTokenIconUri,
  originTokenName,
  destinationChainId,
  destinationTokenAddress,
  destinationTokenIconUri,
  destinationTokenName,
}: RouteListCardProps) {
  const [
    originChain,
    destinationChain,
    resolvedOriginTokenIconUri,
    resolvedDestinationTokenIconUri,
  ] = await Promise.all([
    // eslint-disable-next-line no-restricted-syntax
    getChainMetadata(defineChain(originChainId)),
    // eslint-disable-next-line no-restricted-syntax
    getChainMetadata(defineChain(destinationChainId)),
    originTokenIconUri
      ? resolveSchemeWithErrorHandler({
          client: serverThirdwebClient,
          uri: originTokenIconUri,
        })
      : undefined,
    destinationTokenIconUri
      ? resolveSchemeWithErrorHandler({
          client: serverThirdwebClient,
          uri: destinationTokenIconUri,
        })
      : undefined,
  ]);

  return (
    <div className="relative h-full">
      <Card className="h-full w-full">
        <CardHeader className="flex flex-row items-center justify-between p-4">
          <div className="flex flex-row items-center gap-2">
            {resolvedOriginTokenIconUri ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt={originTokenAddress}
                className="size-8 rounded-full border border-muted-foreground"
                src={resolvedOriginTokenIconUri}
              />
            ) : (
              <div className="size-8 rounded-full bg-muted-foreground" />
            )}
            {resolvedDestinationTokenIconUri ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt={destinationTokenAddress}
                className="-translate-x-4 size-8 rounded-full border border-muted-foreground ring-2 ring-card"
                src={resolvedDestinationTokenIconUri}
              />
            ) : (
              <div className="-translate-x-4 size-8 rounded-full bg-muted-foreground ring-2 ring-card" />
            )}
          </div>
        </CardHeader>

        <CardContent className="px-4 pt-0 pb-4">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between gap-2">
              <TokenName
                chainMetadata={originChain}
                tokenAddress={originTokenAddress}
                tokenName={originTokenName}
              />
              <div className="text-right text-base text-muted-foreground">
                {originChain.name}
              </div>
            </div>

            <div className="flex justify-between gap-2">
              <TokenName
                chainMetadata={destinationChain}
                tokenAddress={destinationTokenAddress}
                tokenName={destinationTokenName}
              />
              <div className="text-right text-base text-muted-foreground">
                {destinationChain.name}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const nativeTokenAddress = getAddress(NATIVE_TOKEN_ADDRESS);

function TokenName(props: {
  tokenAddress: string;
  tokenName: string;
  chainMetadata: ChainMetadata;
}) {
  const isERC20 = getAddress(props.tokenAddress) !== nativeTokenAddress;

  if (isERC20) {
    return (
      <Link
        className="flex items-center gap-1.5 font-normal text-base group/link hover:underline underline-offset-4 decoration-muted-foreground/50 decoration-dotted"
        href={`https://thirdweb.com/${props.chainMetadata.slug}/${props.tokenAddress}`}
        target="_blank"
      >
        {props.tokenName}
        <ExternalLinkIcon className="size-3.5 text-muted-foreground group-hover/link:text-foreground" />
      </Link>
    );
  }

  return (
    <div className="text-left font-normal text-base">
      {props.chainMetadata.nativeCurrency.name}
    </div>
  );
}
