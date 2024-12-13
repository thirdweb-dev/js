import type { ThirdwebClient } from "../../../../client/client.js";
import { resolveScheme } from "../../../../utils/ipfs.js";
import { ChainActiveDot } from "./ChainActiveDot.js";
import { Img } from "./Img.js";
import { Container } from "./basic.js";
import { fallbackChainIcon } from "./fallbackChainIcon.js";

/**
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
  const getSrc = () => {
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
        src={getSrc()}
        width={props.size}
        height={props.size}
        fallbackImage={fallbackChainIcon}
        client={props.client}
      />
      {props.active && <ChainActiveDot />}
    </Container>
  );
};
