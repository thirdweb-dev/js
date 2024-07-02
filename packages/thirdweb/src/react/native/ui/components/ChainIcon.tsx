import { useMemo } from "react";
import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import { resolveScheme } from "../../../../utils/ipfs.js";
import type { Theme } from "../../../core/design-system/index.js";
import { useChainQuery } from "../../../core/hooks/others/useChainQuery.js";
import { CHAIN_ICON } from "../icons/svgs.js";
import { RNImage } from "./RNImage.js";

export type ChainIconProps = {
  theme: Theme;
  size: number;
  client: ThirdwebClient;
  chain?: Chain;
};

export const ChainIcon = (props: ChainIconProps) => {
  const chainQuery = useChainQuery(props.chain);
  const data = useMemo(() => {
    const url = chainQuery?.data?.icon?.url;
    if (!url) {
      return CHAIN_ICON;
    }
    try {
      return resolveScheme({
        uri: url,
        client: props.client,
      });
    } catch {
      return CHAIN_ICON;
    }
  }, [props, chainQuery?.data?.icon?.url]);
  return (
    <RNImage
      theme={props.theme}
      size={props.size}
      data={data}
      placeholder={CHAIN_ICON}
      color={props.theme.colors.secondaryIconColor}
    />
  );
};
