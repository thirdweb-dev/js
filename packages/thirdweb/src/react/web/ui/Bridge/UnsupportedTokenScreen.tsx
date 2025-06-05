import type { Chain } from "../../../../chains/types.js";
import { iconSize } from "../../../core/design-system/index.js";
import { useChainMetadata } from "../../../core/hooks/others/useChainQuery.js";
import { AccentFailIcon } from "../ConnectWallet/icons/AccentFailIcon.js";
import { Spacer } from "../components/Spacer.js";
import { Spinner } from "../components/Spinner.js";
import { Container } from "../components/basic.js";
import { Text } from "../components/text.js";

export interface UnsupportedTokenScreenProps {
  /**
   * The chain the token is on
   */
  chain: Chain;
  /**
   * Callback when user wants to try a different token
   */
  onTryDifferentToken: () => void;
  /**
   * Optional callback when user wants to contact support
   */
  onContactSupport?: () => void;
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
        flex="column"
        center="both"
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
          style={{ maxWidth: "280px", lineHeight: 1.5 }}
        >
          The Universal Bridge does not support testnets at this time.
        </Text>
      </Container>
    );
  }

  return (
    <Container
      animate="fadein"
      flex="column"
      center="both"
      style={{ minHeight: "350px" }}
    >
      {/* Loading Spinner */}
      <Spinner size="xl" color="accentText" />
      <Spacer y="lg" />

      {/* Title */}
      <Text center color="primaryText" size="lg" weight={600}>
        Indexing Token
      </Text>
      <Spacer y="sm" />

      {/* Description */}
      <Text
        center
        color="secondaryText"
        size="sm"
        style={{ maxWidth: "280px", lineHeight: 1.5 }}
      >
        This token is being indexed by the Universal Bridge. Please check back
        later.
      </Text>
    </Container>
  );
}
