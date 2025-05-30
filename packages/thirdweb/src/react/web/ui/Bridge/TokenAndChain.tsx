import { useMemo } from "react";
import type { Token } from "../../../../bridge/index.js";
import type { Chain } from "../../../../chains/types.js";
import { getCachedChain } from "../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../constants/addresses.js";
import { resolveScheme } from "../../../../utils/ipfs.js";
import { useCustomTheme } from "../../../core/design-system/CustomThemeProvider.js";
import { iconSize } from "../../../core/design-system/index.js";
import {
  useChainIconUrl,
  useChainMetadata,
} from "../../../core/hooks/others/useChainQuery.js";
import { genericTokenIcon } from "../../../core/utils/walletIcon.js";
import { CoinsIcon } from "../ConnectWallet/icons/CoinsIcon.js";
import { isNativeToken } from "../ConnectWallet/screens/nativeToken.js";
import { ChainName } from "../components/ChainName.js";
import { Img } from "../components/Img.js";
import { Container } from "../components/basic.js";
import { fallbackChainIcon } from "../components/fallbackChainIcon.js";
import { Text } from "../components/text.js";

export function TokenAndChain({
  token,
  client,
  size,
  style,
}: {
  token: Token;
  client: ThirdwebClient;
  size: keyof typeof iconSize;
  style?: React.CSSProperties;
}) {
  const theme = useCustomTheme();
  const chain = getCachedChain(token.chainId);
  return (
    <Container
      flex="row"
      center="y"
      gap="sm"
      style={{
        flexWrap: "nowrap",
        ...style,
      }}
    >
      <Container
        style={{
          position: "relative",
          width: iconSize[size],
          height: iconSize[size],
        }}
      >
        <TokenIconWithFallback token={token} size={size} client={client} />
        {chain.id !== 1 && (
          <Container
            style={{
              position: "absolute",
              bottom: "-2px",
              right: "-2px",
              width: size === "lg" || size === "xl" ? iconSize.sm : iconSize.xs,
              height:
                size === "lg" || size === "xl" ? iconSize.sm : iconSize.xs,
              borderRadius: "50%",
              background: theme.colors.borderColor,
              border: `1.5px solid ${theme.colors.modalBg}`,
            }}
          >
            <ChainIcon
              chain={chain}
              size={size === "xl" || size === "lg" ? "sm" : "xs"}
              client={client}
            />
          </Container>
        )}
      </Container>

      <Container flex="column" gap="3xs" style={{ minWidth: 0 }}>
        <Text
          size={size === "xl" ? "lg" : "sm"}
          color="primaryText"
          weight={600}
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {token.name}
        </Text>
        <ChainName
          chain={chain}
          size={size === "xl" ? "sm" : "xs"}
          client={client}
          short
        />
      </Container>
    </Container>
  );
}

export function TokenIconWithFallback(props: {
  token: Token;
  size: keyof typeof iconSize;
  client: ThirdwebClient;
}) {
  const chain = getCachedChain(props.token.chainId);
  const chainMeta = useChainMetadata(chain).data;

  const tokenImage = useMemo(() => {
    if (
      isNativeToken(props.token) ||
      props.token.address === NATIVE_TOKEN_ADDRESS
    ) {
      if (chainMeta?.nativeCurrency.symbol === "ETH") {
        return "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/ethereum/512.png"; // ETH icon
      }
      return chainMeta?.icon?.url;
    }
    return props.token.iconUri;
  }, [props.token, chainMeta?.icon?.url, chainMeta?.nativeCurrency.symbol]);

  return tokenImage ? (
    <Img
      src={tokenImage}
      style={{
        borderRadius: "50%",
      }}
      width={iconSize[props.size]}
      height={iconSize[props.size]}
      fallbackImage={genericTokenIcon}
      client={props.client}
    />
  ) : (
    <Container
      center="both"
      style={{ width: iconSize[props.size], height: iconSize[props.size] }}
      color="secondaryText"
    >
      <CoinsIcon size={iconSize[props.size]} />
    </Container>
  );
}

export const ChainIcon: React.FC<{
  chain: Chain;
  size: keyof typeof iconSize;
  client: ThirdwebClient;
}> = (props) => {
  const { url } = useChainIconUrl(props.chain);
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
        src={getSrcChainIcon({
          client: props.client,
          chainIconUrl: url,
        })}
        width={iconSize[props.size]}
        height={iconSize[props.size]}
        fallbackImage={fallbackChainIcon}
        client={props.client}
      />
    </Container>
  );
};

const getSrcChainIcon = (props: {
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
