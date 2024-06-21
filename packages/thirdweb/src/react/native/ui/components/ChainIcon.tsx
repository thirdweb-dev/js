import { useMemo } from "react";
import type { ChainMetadata } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import { resolveScheme } from "../../../../utils/ipfs.js";
import { CHAIN_ICON } from "../icons/svgs.js";
import { RNImage } from "./RNImage.js";

export type ChainIconProps = {
  chainIcon?: ChainMetadata["icon"];
  size: number;
  client: ThirdwebClient;
  active?: boolean;
};

export const ChainIcon = (props: ChainIconProps) => {
  const data = useMemo(() => {
    const url = props.chainIcon?.url;
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
  }, [props]);
  return <RNImage size={props.size} data={data} placeholder={CHAIN_ICON} />;
};
