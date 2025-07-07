import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { getAddress, NATIVE_TOKEN_ADDRESS } from "thirdweb";
import {
  type ChainMetadata,
  defineChain,
  getChainMetadata,
} from "thirdweb/chains";
import { shortenAddress } from "thirdweb/utils";
import { Img } from "@/components/blocks/Img";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { serverThirdwebClient } from "@/constants/thirdweb-client.server";
import { resolveSchemeWithErrorHandler } from "@/utils/resolveSchemeWithErrorHandler";

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
    <TableRow className="group">
      <TableCell>
        <TokenInfo
          chainMetadata={originChain}
          tokenAddress={originTokenAddress}
          tokenIconUri={resolvedOriginTokenIconUri}
          tokenSymbol={originTokenSymbol}
        />
      </TableCell>

      <TableCell className="text-muted-foreground/90">
        <span className="font-medium">{originChain.name}</span>
      </TableCell>

      <TableCell>
        <TokenInfo
          chainMetadata={destinationChain}
          tokenAddress={destinationTokenAddress}
          tokenIconUri={resolvedDestinationTokenIconUri}
          tokenSymbol={destinationTokenSymbol}
        />
      </TableCell>

      <TableCell className="text-muted-foreground/90">
        <span className="font-medium">{destinationChain.name}</span>
      </TableCell>
    </TableRow>
  );
}

const nativeTokenAddress = getAddress(NATIVE_TOKEN_ADDRESS);

function TokenInfo(props: {
  tokenAddress: string;
  tokenSymbol: string | undefined;
  chainMetadata: ChainMetadata;
  tokenIconUri: string | undefined;
}) {
  const isERC20 = getAddress(props.tokenAddress) !== nativeTokenAddress;

  return (
    <div className="flex items-center gap-1.5">
      {props.tokenIconUri ? (
        <Img
          alt={props.tokenAddress}
          className="size-7 rounded-full border border-border/50"
          src={props.tokenIconUri}
        />
      ) : (
        <div className="size-7 rounded-full bg-muted-foreground/20" />
      )}
      {isERC20 ? (
        <Button
          asChild
          className="h-auto w-auto py-1 px-1.5 gap-2"
          variant="ghost"
        >
          <Link
            href={`https://thirdweb.com/${props.chainMetadata.slug}/${props.tokenAddress}`}
            target="_blank"
          >
            {props.tokenSymbol || shortenAddress(props.tokenAddress)}
            <ExternalLinkIcon className="size-3.5 text-muted-foreground" />
          </Link>
        </Button>
      ) : (
        <span className="font-medium text-sm px-1.5 py-1">
          {props.chainMetadata.nativeCurrency.symbol}
        </span>
      )}
    </div>
  );
}
