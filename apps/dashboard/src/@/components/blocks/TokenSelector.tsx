import { useCallback, useMemo } from "react";
import type { ThirdwebClient } from "thirdweb";
import { shortenAddress } from "thirdweb/utils";
import { useTokensData } from "../../../hooks/tokens/tokens";
import { replaceIpfsUrl } from "../../../lib/sdk";
import { fallbackChainIcon } from "../../../utils/chain-icons";
import { cn } from "../../lib/utils";
import { Badge } from "../ui/badge";
import { Img } from "./Img";
import { SelectWithSearch } from "./select-with-search";

type Option = { label: string; value: string };

export function TokenSelector(props: {
  tokenAddress: string | undefined;
  onChange: (tokenAddress: string) => void;
  className?: string;
  popoverContentClassName?: string;
  chainId?: number;
  side?: "left" | "right" | "top" | "bottom";
  disableChainId?: boolean;
  align?: "center" | "start" | "end";
  placeholder?: string;
  client: ThirdwebClient;
  disabled?: boolean;
  enabled?: boolean;
}) {
  const { tokens, isFetching } = useTokensData({
    clientId: props.client.clientId,
    chainId: props.chainId,
    enabled: props.enabled,
  });

  const options = useMemo(() => {
    return tokens.allTokens.map((token) => {
      return {
        label: token.symbol,
        value: `${token.chainId}:${token.address}`,
      };
    });
  }, [tokens.allTokens]);

  const searchFn = useCallback(
    (option: Option, searchValue: string) => {
      const token = tokens.addressChainToToken.get(option.value);
      if (!token) {
        return false;
      }

      if (Number.isInteger(Number.parseInt(searchValue))) {
        return String(token.chainId).startsWith(searchValue);
      }
      return (
        token.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        token.symbol.toLowerCase().includes(searchValue.toLowerCase()) ||
        token.address.toLowerCase().includes(searchValue.toLowerCase())
      );
    },
    [tokens],
  );

  const renderOption = useCallback(
    (option: Option) => {
      const token = tokens.addressChainToToken.get(option.value);
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

          {!props.disableChainId && (
            <Badge variant="outline" className="gap-2 max-sm:hidden">
              <span className="text-muted-foreground">Address</span>
              {shortenAddress(token.address, 4)}
            </Badge>
          )}
        </div>
      );
    },
    [tokens, props.disableChainId, props.client],
  );

  return (
    <SelectWithSearch
      searchPlaceholder="Search by name or symbol"
      value={props.tokenAddress}
      options={options}
      onValueChange={(tokenAddress) => {
        props.onChange(tokenAddress);
      }}
      closeOnSelect={true}
      showCheck={false}
      placeholder={
        isFetching ? "Loading Tokens..." : props.placeholder || "Select Token"
      }
      overrideSearchFn={searchFn}
      renderOption={renderOption}
      className={props.className}
      popoverContentClassName={props.popoverContentClassName}
      disabled={isFetching || props.disabled}
      side={props.side}
      align={props.align}
    />
  );
}
