import { useCallback, useMemo } from "react";
import type { TokenMetadata } from "@/api/universal-bridge/tokens";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAllChainsData } from "@/hooks/chains/allChains";
import { useTokensData } from "@/hooks/tokens";
import { cn } from "@/lib/utils";
import { fallbackChainIcon } from "@/utils/chain-icons";

// Mock shortenAddress function
function shortenAddress(address: string, chars = 4) {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

// Mock replaceIpfsUrl function
function replaceIpfsUrl(uri: string) {
  return uri;
}

// Mock ThirdwebClient type
type ThirdwebClient = {
  clientId?: string;
  secretKey?: string;
};

export function TokenSelector(props: {
  selectedToken: { chainId: number; address: string } | undefined;
  onChange: (token: TokenMetadata) => void;
  className?: string;
  chainId?: number;
  disableAddress?: boolean;
  placeholder?: string;
  client: ThirdwebClient;
  disabled?: boolean;
  enabled?: boolean;
  showCheck: boolean;
  addNativeTokenIfMissing: boolean;
}) {
  const tokensQuery = useTokensData({
    chainId: props.chainId,
    enabled: props.enabled,
  });

  const { idToChain } = useAllChainsData();

  const tokens = useMemo(() => {
    if (!tokensQuery.data) {
      return [];
    }

    if (props.addNativeTokenIfMissing) {
      const hasNativeToken = tokensQuery.data.some(
        (token) =>
          token.address === "0x0000000000000000000000000000000000000000",
      );

      if (!hasNativeToken && props.chainId) {
        return [
          {
            address: "0x0000000000000000000000000000000000000000",
            chainId: props.chainId,
            decimals: 18,
            name:
              idToChain.get(props.chainId)?.nativeCurrency.name ??
              "Native Token",
            symbol:
              idToChain.get(props.chainId)?.nativeCurrency.symbol ?? "ETH",
          } satisfies TokenMetadata,
          ...tokensQuery.data,
        ];
      }
    }
    return tokensQuery.data;
  }, [
    tokensQuery.data,
    props.chainId,
    props.addNativeTokenIfMissing,
    idToChain,
  ]);

  const addressChainToToken = useMemo(() => {
    const value = new Map<string, TokenMetadata>();
    for (const token of tokens) {
      value.set(`${token.chainId}:${token.address}`, token);
    }
    return value;
  }, [tokens]);

  const selectedValue = props.selectedToken
    ? `${props.selectedToken.chainId}:${props.selectedToken.address}`
    : undefined;

  const renderTokenOption = useCallback(
    (token: TokenMetadata) => {
      const resolvedSrc = token.iconUri
        ? replaceIpfsUrl(token.iconUri)
        : fallbackChainIcon;

      return (
        <div className="flex items-center justify-between gap-4">
          <span className="flex grow gap-2 truncate text-left">
            <img
              alt=""
              className={cn("size-5 rounded-full object-contain")}
              src={resolvedSrc}
              onError={(e) => {
                (e.target as HTMLImageElement).src = fallbackChainIcon;
              }}
            />
            {token.symbol}
          </span>

          {!props.disableAddress && (
            <Badge className="gap-2 py-1 max-sm:hidden" variant="outline">
              <span className="text-muted-foreground">Address</span>
              {shortenAddress(token.address, 4)}
            </Badge>
          )}
        </div>
      );
    },
    [props.disableAddress],
  );

  return (
    <Select
      disabled={tokensQuery.isPending || props.disabled}
      onValueChange={(tokenAddress) => {
        const token = addressChainToToken.get(tokenAddress);
        if (!token) {
          return;
        }
        props.onChange(token);
      }}
      value={selectedValue}
    >
      <SelectTrigger className={cn("w-full", props.className)}>
        <SelectValue
          placeholder={
            tokensQuery.isPending
              ? "Loading Tokens"
              : props.placeholder || "Select Token"
          }
        />
      </SelectTrigger>
      <SelectContent>
        {tokens.map((token) => {
          const tokenKey = `${token.chainId}:${token.address}`;
          return (
            <SelectItem key={tokenKey} value={tokenKey}>
              {renderTokenOption(token)}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
