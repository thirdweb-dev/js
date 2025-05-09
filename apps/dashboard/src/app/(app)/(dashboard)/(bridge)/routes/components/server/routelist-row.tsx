import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { TableCell, TableRow } from "@/components/ui/table";
import { serverThirdwebClient } from "@/constants/thirdweb-client.server";
import { resolveSchemeWithErrorHandler } from "@/lib/resolveSchemeWithErrorHandler";
import { defineChain, getChainMetadata } from "thirdweb/chains";

type RouteListRowProps = {
  originChainId: number;
  originTokenAddress: string;
  originTokenIconUri?: string | null;
  originTokenSymbol?: string;
  originTokenName?: string;
  destinationChainId: number;
  destinationTokenAddress: string;
  destinationTokenIconUri?: string | null;
  destinationTokenSymbol?: string;
  destinationTokenName?: string;
};

export async function RouteListRow({
  originChainId,
  originTokenAddress,
  originTokenIconUri,
  originTokenSymbol,
  destinationChainId,
  destinationTokenAddress,
  destinationTokenIconUri,
  destinationTokenSymbol,
}: RouteListRowProps) {
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
          uri: originTokenIconUri,
          client: serverThirdwebClient,
        })
      : undefined,
    destinationTokenIconUri
      ? resolveSchemeWithErrorHandler({
          uri: destinationTokenIconUri,
          client: serverThirdwebClient,
        })
      : undefined,
  ]);

  return (
    <TableRow linkBox className="hover:bg-accent/50">
      <TableCell>
        <div className="flex flex-row items-center gap-4">
          <div className="flex items-center gap-1">
            {resolvedOriginTokenIconUri ? (
              // For now we're using a normal img tag because the domain for these images is unknown
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={resolvedOriginTokenIconUri}
                alt={originTokenAddress}
                className="size-6 rounded-full border border-muted-foreground"
              />
            ) : (
              <div className="size-6 rounded-full bg-muted-foreground" />
            )}
            {originTokenSymbol && (
              <CopyTextButton
                textToCopy={originTokenAddress}
                textToShow={
                  originTokenSymbol === "ETH"
                    ? originChain.nativeCurrency.symbol
                    : originTokenSymbol
                }
                tooltip="Copy Token Address"
                className="relative z-10 text-base"
                variant="ghost"
                copyIconPosition="right"
              />
            )}
          </div>
        </div>
      </TableCell>

      <TableCell className="text-muted-foreground">
        {originChain.name}
      </TableCell>

      <TableCell>
        <div className="flex flex-row items-center gap-4">
          <div className="flex items-center gap-1">
            {resolvedDestinationTokenIconUri ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={resolvedDestinationTokenIconUri}
                alt={destinationTokenAddress}
                className="size-6 rounded-full border border-muted-foreground"
              />
            ) : (
              <div className="size-6 rounded-full bg-muted-foreground" />
            )}
            {destinationTokenSymbol && (
              <CopyTextButton
                textToCopy={destinationTokenAddress}
                textToShow={
                  destinationTokenSymbol === "ETH"
                    ? destinationChain.nativeCurrency.symbol
                    : destinationTokenSymbol
                }
                tooltip="Copy Token Address"
                className="relative z-10 text-base"
                variant="ghost"
                copyIconPosition="right"
              />
            )}
          </div>
        </div>
      </TableCell>

      <TableCell className="text-muted-foreground">
        {destinationChain.name}
      </TableCell>
    </TableRow>
  );
}
