import type { ThirdwebClient } from "../../../../client/client.js";
import { resolveScheme } from "../../../../utils/ipfs.js";
import { Container } from "./basic.js";
import { ChainActiveDot } from "./ChainActiveDot.js";
import { fallbackChainIcon } from "./fallbackChainIcon.js";
import { Img } from "./Img.js";

/**
 * This component (file) will eventually be replaced with the ChainIcon prebuilt version.
 * @internal
 */
export const ChainIcon: React.FC<{
  chainIconUrl?: string;
  size: string;
  active?: boolean;
  className?: string;
  loading?: "lazy" | "eager";
  client: ThirdwebClient;
}> = (props) => {
  return (
    <Container
      style={{
        alignItems: "center",
        display: "flex",
        flexShrink: 0,
        position: "relative",
      }}
    >
      <Img
        client={props.client}
        fallbackImage={fallbackChainIcon}
        height={props.size}
        src={getSrcChainIcon(props)}
        width={props.size}
      />
      {props.active && (
        <ChainActiveDot className="tw-chain-active-dot-legacy-chain-icon" />
      )}
    </Container>
  );
};

/**
 * @internal
 */
export const getSrcChainIcon = (props: {
  client: ThirdwebClient;
  chainIconUrl?: string;
}) => {
  const url = props.chainIconUrl;
  if (!url) {
    return fallbackChainIcon;
  }
  try {
    return resolveScheme({
      client: props.client,
      uri: url,
    });
  } catch {
    return fallbackChainIcon;
  }
};
