import { useCallback, useMemo } from "react";
import {
  getAddress,
  NATIVE_TOKEN_ADDRESS,
  type ThirdwebClient,
} from "thirdweb";
import { shortenAddress } from "thirdweb/utils";
import type { TokenMetadata } from "@/api/universal-bridge/tokens";
import { Img } from "@/components/blocks/Img";
import { SelectWithSearch } from "@/components/blocks/select-with-search";
import { Badge } from "@/components/ui/badge";
import { useAllChainsData } from "@/hooks/chains/allChains";
import { useTokensData } from "@/hooks/tokens";
import { cn } from "@/lib/utils";
import { fallbackChainIcon } from "@/utils/chain-icons";
import { resolveSchemeWithErrorHandler } from "@/utils/resolveSchemeWithErrorHandler";
import { Spinner } from "../ui/Spinner/Spinner";

type Option = { label: string; value: string };

const checksummedNativeTokenAddress = getAddress(NATIVE_TOKEN_ADDRESS);

export function TokenSelector(props: {
  selectedToken: { chainId: number; address: string } | undefined;
  onChange: (token: TokenMetadata) => void;
  className?: string;
  popoverContentClassName?: string;
  chainId?: number;
  side?: "left" | "right" | "top" | "bottom";
  disableAddress?: boolean;
  align?: "center" | "start" | "end";
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

  const options = useMemo(() => {
    return (
      tokens.map((token) => {
        return {
          label: token.symbol,
          value: `${token.chainId}:${token.address}`,
        };
      }) || []
    );
  }, [tokens]);

  const searchFn = useCallback(
    (option: Option, searchValue: string) => {
      const token = addressChainToToken.get(option.value);
      if (!token) {
        return false;
      }

      if (Number.isInteger(Number(searchValue))) {
        return String(token.chainId).startsWith(searchValue);
      }
      return (
        token.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        token.symbol.toLowerCase().includes(searchValue.toLowerCase()) ||
        token.address.toLowerCase().includes(searchValue.toLowerCase())
      );
    },
    [addressChainToToken],
  );

  const renderOption = useCallback(
    (option: Option) => {
      const token = addressChainToToken.get(option.value);
      if (!token) {
        return option.label;
      }
      const resolvedSrc = token.iconUri
        ? resolveSchemeWithErrorHandler({
            client: props.client,
            uri: token.iconUri,
          })
        : fallbackChainIcon;

      return (
        <div className="flex items-center justify-between gap-4">
          <span className="flex grow gap-2 truncate text-left">
            <Img
              // render different image element if src changes to avoid showing old image while loading new one
              alt=""
              className={cn("size-5 rounded-full object-contain")}
              fallback={<img alt="" src={fallbackChainIcon} />}
              key={resolvedSrc}
              loading={"lazy"}
              // eslint-disable-next-line @next/next/no-img-element
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
    [addressChainToToken, props.disableAddress, props.client],
  );

  const selectedValue = props.selectedToken
    ? `${props.selectedToken.chainId}:${props.selectedToken.address}`
    : undefined;

  // if selected value is not in options, add it
  if (
    selectedValue &&
    !options.find((option) => option.value === selectedValue)
  ) {
    options.push({
      label: props.selectedToken?.address || "Unknown",
      value: selectedValue,
    });
  }

  return (
    <SelectWithSearch
      align={props.align}
      className={props.className}
      closeOnSelect={true}
      disabled={tokensQuery.isPending || props.disabled}
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
        tokensQuery.isPending ? (
          <div className="flex items-center gap-2">
            <Spinner className="size-4" />
            <span>Loading tokens</span>
          </div>
        ) : (
          props.placeholder || "Select Token"
        )
      }
      popoverContentClassName={props.popoverContentClassName}
      renderOption={renderOption}
      searchPlaceholder="Search by name or symbol"
      showCheck={props.showCheck}
      side={props.side}
      value={selectedValue}
    />
  );
}
