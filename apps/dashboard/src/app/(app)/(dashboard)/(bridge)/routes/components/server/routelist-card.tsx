import { defineChain } from "thirdweb";
import { getChainMetadata } from "thirdweb/chains";
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
      <Card className="h-full w-full transition-colors hover:border-active-border">
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
          <table className="w-full">
            <tbody className="text-sm [&_td>*]:min-h-[25px]">
              <tr>
                <th className="text-left font-normal text-base">
                  {originTokenName === "ETH"
                    ? originChain.nativeCurrency.name
                    : originTokenName}
                </th>
                <td className="text-right text-base text-muted-foreground">
                  {originChain.name}
                </td>
              </tr>
              <tr>
                <th className="text-left font-normal text-base">
                  {destinationTokenName === "ETH"
                    ? destinationChain.nativeCurrency.name
                    : destinationTokenName}
                </th>
                <td className="text-right text-base text-muted-foreground">
                  {destinationChain.name}
                </td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
