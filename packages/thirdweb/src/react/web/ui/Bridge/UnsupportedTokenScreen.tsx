import type { Chain } from "../../../../chains/types.js";
import { iconSize } from "../../../core/design-system/index.js";
import { useChainMetadata } from "../../../core/hooks/others/useChainQuery.js";
import { AccentFailIcon } from "../ConnectWallet/icons/AccentFailIcon.js";
import { Container } from "../components/basic.js";
import { Spacer } from "../components/Spacer.js";
import { Text } from "../components/text.js";

export interface UnsupportedTokenScreenProps {
  /**
   * The chain the token is on
   */
  chain: Chain;
}

/**
 * Screen displayed when a specified token is not supported by the Bridge API
 * @internal
 */
export function UnsupportedTokenScreen(props: UnsupportedTokenScreenProps) {
  const { chain } = props;

  const { data: chainMetadata } = useChainMetadata(chain);

  if (chainMetadata?.testnet) {
    return (
      <Container
        animate="fadein"
        center="both"
        flex="column"
        style={{ minHeight: "350px" }}
      >
        {/* Error Icon */}
        <AccentFailIcon size={iconSize["3xl"]} />
        <Spacer y="lg" />

        {/* Title */}
        <Text center color="primaryText" size="lg" weight={600}>
          Testnet Not Supported
        </Text>
        <Spacer y="sm" />

        {/* Description */}
        <Text
          center
          color="secondaryText"
          size="sm"
          style={{ lineHeight: 1.5, maxWidth: "280px" }}
        >
          The Universal Bridge does not support testnets at this time.
        </Text>
      </Container>
    );
  }

  return (
    <Container
      animate="fadein"
      center="both"
      flex="column"
      style={{ minHeight: "350px" }}
    >
      {/* Error Icon */}
      <AccentFailIcon size={iconSize["3xl"]} />
      <Spacer y="lg" />

      {/* Title */}
      <Text center color="primaryText" size="lg" weight={600}>
        Token Not Supported
      </Text>
      <Spacer y="sm" />

      {/* Description */}
      <Text
        center
        color="secondaryText"
        size="sm"
        style={{ lineHeight: 1.5, maxWidth: "280px" }}
      >
        This token or chain is not supported by the Universal Bridge.
      </Text>
    </Container>
  );
}
