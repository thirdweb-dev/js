import { useMemo } from "react";
import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import { resolveScheme } from "../../../../utils/ipfs.js";
import type { Theme } from "../../../core/design-system/index.js";
import { useChainIconUrl } from "../../../core/hooks/others/useChainQuery.js";
import { CHAIN_ICON } from "../icons/svgs.js";
import { RNImage } from "./RNImage.js";

type ChainIconProps = {
  theme: Theme;
  size: number;
  client: ThirdwebClient;
  chain?: Chain;
};

export const ChainIcon = (props: ChainIconProps) => {
  const { url } = useChainIconUrl(props.chain);
  const data = useMemo(() => {
    if (!url) {
      return CHAIN_ICON;
    }
    try {
      return resolveScheme({
        client: props.client,
        uri: url,
      });
    } catch {
      return CHAIN_ICON;
    }
  }, [props, url]);
  return (
    <RNImage
      color={props.theme.colors.secondaryIconColor}
      data={data}
      placeholder={CHAIN_ICON}
      size={props.size}
      theme={props.theme}
    />
  );
};
