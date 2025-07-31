"use client";

import { CoinsIcon } from "lucide-react";
import { useCallback, useMemo } from "react";
import {
  getAddress,
  NATIVE_TOKEN_ADDRESS,
  type ThirdwebClient,
} from "thirdweb";
import { shortenAddress } from "thirdweb/utils";
import { Badge } from "@/components/ui/badge";
import { Img } from "@/components/ui/Img";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAllChainsData } from "@/hooks/chains";
import { useTokensData } from "@/hooks/useTokensData";
import type { TokenMetadata } from "@/lib/types";
import { cn, fallbackChainIcon, replaceIpfsUrl } from "@/lib/utils";

const checksummedNativeTokenAddress = getAddress(NATIVE_TOKEN_ADDRESS);

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
  addNativeTokenIfMissing: boolean;
}) {
  const tokensQuery = useTokensData({
    chainId: props.chainId,
    enabled: props.enabled,
  });

  const { idToChain } = useAllChainsData().data;

  const tokens = useMemo(() => {
    if (!tokensQuery.data) {
      return [];
    }

    if (props.addNativeTokenIfMissing) {
      const hasNativeToken = tokensQuery.data.some(
        (token) => token.address === checksummedNativeTokenAddress,
      );

      if (!hasNativeToken && props.chainId) {
        return [
          {
            address: checksummedNativeTokenAddress,
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
        ? replaceIpfsUrl(token.iconUri, props.client)
        : fallbackChainIcon;

      return (
        <div className="flex items-center justify-between gap-4">
          <span className="flex grow gap-2 truncate text-left">
            <Img
              alt=""
              className={cn("size-5 rounded-full object-contain")}
              fallback={<CoinsIcon className="size-5" />}
              key={resolvedSrc}
              loading="lazy"
              skeleton={
                <div className="animate-pulse rounded-full bg-border" />
              }
              src={resolvedSrc}
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
    [props.disableAddress, props.client],
  );

  return (
    <Select
      disabled={tokensQuery.isLoading || props.disabled}
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
            tokensQuery.isLoading
              ? "Loading Tokens..."
              : props.placeholder || "Select Token"
          }
        />
      </SelectTrigger>
      <SelectContent>
        {tokens.map((token) => {
          const value = `${token.chainId}:${token.address}`;
          return (
            <SelectItem key={value} value={value}>
              {renderTokenOption(token)}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
