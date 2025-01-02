import type { ThirdwebClient } from "../../../../client/client.js";
import { resolveScheme } from "../../../../utils/ipfs.js";
import { ChainActiveDot } from "./ChainActiveDot.js";
import { Img } from "./Img.js";
import { Container } from "./basic.js";
import { fallbackChainIcon } from "./fallbackChainIcon.js";

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
        position: "relative",
        display: "flex",
        flexShrink: 0,
        alignItems: "center",
      }}
    >
      <Img
        src={getSrcChainIcon(props)}
        width={props.size}
        height={props.size}
        fallbackImage={fallbackChainIcon}
        client={props.client}
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
      uri: url,
      client: props.client,
    });
  } catch {
    return fallbackChainIcon;
  }
};
