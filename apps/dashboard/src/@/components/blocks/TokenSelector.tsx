import { useAllChainsData } from "hooks/chains/allChains";
import { useTokensData } from "hooks/tokens/tokens";
import { useCallback, useMemo } from "react";
import {
  NATIVE_TOKEN_ADDRESS,
  type ThirdwebClient,
  getAddress,
} from "thirdweb";
import { shortenAddress } from "thirdweb/utils";
import { replaceIpfsUrl } from "../../../lib/sdk";
import { fallbackChainIcon } from "../../../utils/chain-icons";
import type { TokenMetadata } from "../../api/universal-bridge/tokens";
import { cn } from "../../lib/utils";
import { Badge } from "../ui/badge";
import { Img } from "./Img";
import { SelectWithSearch } from "./select-with-search";

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
            name:
              idToChain.get(props.chainId)?.nativeCurrency.name ??
              "Native Token",
            symbol:
              idToChain.get(props.chainId)?.nativeCurrency.symbol ?? "ETH",
            decimals: 18,
            chainId: props.chainId,
            address: checksummedNativeTokenAddress,
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
        ? replaceIpfsUrl(token.iconUri, props.client)
        : fallbackChainIcon;

      return (
        <div className="flex items-center justify-between gap-4">
          <span className="flex grow gap-2 truncate text-left">
            <Img
              // render different image element if src changes to avoid showing old image while loading new one
              key={resolvedSrc}
              className={cn("size-5 rounded-full object-contain")}
              src={resolvedSrc}
              loading={"lazy"}
              alt=""
              // eslint-disable-next-line @next/next/no-img-element
              fallback={<img src={fallbackChainIcon} alt="" />}
              skeleton={
                <div className="animate-pulse rounded-full bg-border" />
              }
            />
            {token.symbol}
          </span>

          {!props.disableAddress && (
            <Badge variant="outline" className="gap-2 py-1 max-sm:hidden">
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
      searchPlaceholder="Search by name or symbol"
      value={selectedValue}
      options={options}
      onValueChange={(tokenAddress) => {
        const token = addressChainToToken.get(tokenAddress);
        if (!token) {
          return;
        }
        props.onChange(token);
      }}
      closeOnSelect={true}
      showCheck={props.showCheck}
      placeholder={
        tokensQuery.isPending
          ? "Loading Tokens"
          : props.placeholder || "Select Token"
      }
      overrideSearchFn={searchFn}
      renderOption={renderOption}
      className={props.className}
      popoverContentClassName={props.popoverContentClassName}
      disabled={tokensQuery.isPending || props.disabled}
      side={props.side}
      align={props.align}
    />
  );
}
