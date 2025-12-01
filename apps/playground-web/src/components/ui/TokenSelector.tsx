"use client";

import { CoinsIcon } from "lucide-react";
import { useCallback, useMemo } from "react";
import { NATIVE_TOKEN_ADDRESS, type ThirdwebClient } from "thirdweb";
import { shortenAddress } from "thirdweb/utils";
import { Badge } from "@/components/ui/badge";
import { Img } from "@/components/ui/Img";
import { SelectWithSearch } from "@/components/ui/select-with-search";
import { useTokensData } from "@/hooks/useTokensData";
import type { TokenMetadata } from "@/lib/types";
import { cn, fallbackChainIcon, replaceIpfsUrl } from "@/lib/utils";

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
  includeNativeToken?: boolean;
}) {
  const tokensQuery = useTokensData({
    chainId: props.chainId,
    enabled: props.enabled,
  });

  const tokens = useMemo(() => {
    if (props.includeNativeToken === false) {
      return (
        tokensQuery.data?.filter(
          (token) =>
            token.address.toLowerCase() !== NATIVE_TOKEN_ADDRESS.toLowerCase(),
        ) || []
      );
    }
    return tokensQuery.data || [];
  }, [tokensQuery.data, props.includeNativeToken]);
  const addressChainToToken = useMemo(() => {
    const value = new Map<string, TokenMetadata>();
    for (const token of tokens) {
      value.set(`${token.chainId}:${token.address}`, token);
    }
    return value;
  }, [tokens]);

  const options = useMemo(() => {
    return tokens.map((token) => ({
      label: token.symbol,
      value: `${token.chainId}:${token.address}`,
    }));
  }, [tokens]);

  const selectedValue = props.selectedToken
    ? `${props.selectedToken.chainId}:${props.selectedToken.address}`
    : undefined;

  const searchFn = useCallback(
    (option: { label: string; value: string }, searchValue: string) => {
      const token = addressChainToToken.get(option.value);
      if (!token) {
        return false;
      }

      const searchLower = searchValue.toLowerCase();
      return (
        token.symbol.toLowerCase().includes(searchLower) ||
        token.name.toLowerCase().includes(searchLower) ||
        token.address.toLowerCase().includes(searchLower)
      );
    },
    [addressChainToToken],
  );

  const renderTokenOption = useCallback(
    (option: { label: string; value: string }) => {
      const token = addressChainToToken.get(option.value);
      if (!token) {
        return option.label;
      }

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
    [props.disableAddress, props.client, addressChainToToken],
  );

  return (
    <SelectWithSearch
      className={cn("w-full", props.className)}
      closeOnSelect={true}
      disabled={tokensQuery.isLoading || props.disabled}
      onValueChange={(tokenAddress) => {
        const token = addressChainToToken.get(tokenAddress);
        if (!token) {
          return;
        }
        props.onChange(token);
      }}
      options={options}
      overrideSearchFn={searchFn}
      placeholder={
        tokensQuery.isLoading
          ? "Loading Tokens..."
          : props.placeholder || "Select Token"
      }
      renderOption={renderTokenOption}
      searchPlaceholder="Search by Symbol, Name or Address"
      showCheck={false}
      value={selectedValue}
    />
  );
}
