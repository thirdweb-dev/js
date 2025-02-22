import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { TableCell, TableRow } from "@/components/ui/table";
import { getThirdwebClient } from "@/constants/thirdweb.server";
import { resolveSchemeWithErrorHandler } from "@/lib/resolveSchemeWithErrorHandler";
import { defineChain, getChainMetadata } from "thirdweb/chains";
import { TokenProvider, TokenSymbol } from "thirdweb/react";

type RouteListRowProps = {
  originChainId: number;
  originTokenAddress: string;
  originTokenIconUri: string | null;
  destinationChainId: number;
  destinationTokenAddress: string;
  destinationTokenIconUri: string | null;
};

export async function RouteListRow({
  originChainId,
  originTokenAddress,
  originTokenIconUri,
  destinationChainId,
  destinationTokenAddress,
  destinationTokenIconUri,
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
    <TableRow linkBox className="hover:bg-accent/50">
      <TableCell>
        <TokenProvider
          address={originTokenAddress}
          // eslint-disable-next-line no-restricted-syntax
          chain={defineChain(originChainId)}
          client={getThirdwebClient()}
        >
          <div className="flex flex-row items-center gap-4">
            <div className="flex items-center gap-1">
              {resolvedOriginTokenIconUri ? (
                // For now we're using a normal img tag because the domain for these images is unknown
                <img
                  src={resolvedOriginTokenIconUri}
                  alt={originTokenAddress}
                  className="size-6 rounded-full bg-muted-foreground"
                />
              ) : (
                <div className="size-6 rounded-full bg-muted-foreground" />
              )}
              <CopyTextButton
                textToCopy={originTokenAddress}
                textToShow={<TokenSymbol />}
                tooltip="Copy Token Address"
                className="relative z-10 text-base"
                variant="ghost"
                copyIconPosition="right"
              />
            </div>
          </div>
        </TokenProvider>
      </TableCell>

      <TableCell className="text-muted-foreground">
        {originChain.name}
      </TableCell>

      <TableCell>
        <TokenProvider
          address={destinationTokenAddress}
          // eslint-disable-next-line no-restricted-syntax
          chain={defineChain(destinationChainId)}
          client={getThirdwebClient()}
        >
          <div className="flex flex-row items-center gap-4">
            <div className="flex items-center gap-1">
              {resolvedDestinationTokenIconUri ? (
                <img
                  src={resolvedDestinationTokenIconUri}
                  alt={destinationTokenAddress}
                  className="size-6 rounded-full bg-muted-foreground"
                />
              ) : (
                <div className="size-6 rounded-full bg-muted-foreground" />
              )}
              <CopyTextButton
                textToCopy={destinationTokenAddress}
                textToShow={<TokenSymbol />}
                tooltip="Copy Token Address"
                className="relative z-10 text-base"
                variant="ghost"
                copyIconPosition="right"
              />
            </div>
          </div>
        </TokenProvider>
      </TableCell>

      <TableCell className="text-muted-foreground">
        {destinationChain.name}
      </TableCell>
    </TableRow>
  );
}
