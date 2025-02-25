import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getThirdwebClient } from "@/constants/thirdweb.server";
import { resolveSchemeWithErrorHandler } from "@/lib/resolveSchemeWithErrorHandler";
import { NATIVE_TOKEN_ADDRESS, defineChain, getContract } from "thirdweb";
import { getChainMetadata } from "thirdweb/chains";
import { name } from "thirdweb/extensions/common";

type RouteListCardProps = {
  originChainId: number;
  originTokenAddress: string;
  originTokenIconUri: string | null;
  destinationChainId: number;
  destinationTokenAddress: string;
  destinationTokenIconUri: string | null;
};

export async function RouteListCard({
  originChainId,
  originTokenAddress,
  originTokenIconUri,
  destinationChainId,
  destinationTokenAddress,
  destinationTokenIconUri,
}: RouteListCardProps) {
  const [
    originChain,
    originTokenName,
    destinationChain,
    destinationTokenName,
    resolvedOriginTokenIconUri,
    resolvedDestinationTokenIconUri,
  ] = await Promise.all([
    // eslint-disable-next-line no-restricted-syntax
    getChainMetadata(defineChain(originChainId)),
    originTokenAddress.toLowerCase() === NATIVE_TOKEN_ADDRESS
      ? "ETH"
      : name({
          contract: getContract({
            address: originTokenAddress,
            // eslint-disable-next-line no-restricted-syntax
            chain: defineChain(originChainId),
            client: getThirdwebClient(),
          }),
        }).catch(() => undefined),
    // eslint-disable-next-line no-restricted-syntax
    getChainMetadata(defineChain(destinationChainId)),
    destinationTokenAddress.toLowerCase() === NATIVE_TOKEN_ADDRESS
      ? "ETH"
      : name({
          contract: getContract({
            address: destinationTokenAddress,
            // eslint-disable-next-line no-restricted-syntax
            chain: defineChain(destinationChainId),
            client: getThirdwebClient(),
          }),
        }).catch(() => undefined),
    originTokenIconUri
      ? resolveSchemeWithErrorHandler({
          uri: originTokenIconUri,
          client: getThirdwebClient(),
        })
      : undefined,
    destinationTokenIconUri
      ? resolveSchemeWithErrorHandler({
          uri: destinationTokenIconUri,
          client: getThirdwebClient(),
        })
      : undefined,
  ]);

  return (
    <div className="relative h-full">
      <Card className="h-full w-full transition-colors hover:border-active-border">
        <CardHeader className="flex flex-row items-center justify-between p-4">
          <div className="flex flex-row items-center gap-2">
            {resolvedOriginTokenIconUri ? (
              <img
                src={resolvedOriginTokenIconUri}
                alt={originTokenAddress}
                className="size-8 rounded-full bg-white"
              />
            ) : (
              <div className="size-8 rounded-full bg-white/10" />
            )}
            {resolvedDestinationTokenIconUri ? (
              <img
                src={resolvedDestinationTokenIconUri}
                alt={destinationTokenAddress}
                className="-translate-x-4 size-8 rounded-full bg-white ring-2 ring-card"
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
