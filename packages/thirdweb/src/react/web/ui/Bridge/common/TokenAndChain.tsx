import { useMemo } from "react";
import type { Token } from "../../../../../bridge/index.js";
import type { Chain } from "../../../../../chains/types.js";
import { getCachedChain } from "../../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../constants/addresses.js";
import { resolveScheme } from "../../../../../utils/ipfs.js";
import { useCustomTheme } from "../../../../core/design-system/CustomThemeProvider.js";
import { iconSize, spacing } from "../../../../core/design-system/index.js";
import {
  useChainIconUrl,
  useChainMetadata,
} from "../../../../core/hooks/others/useChainQuery.js";
import { genericTokenIcon } from "../../../../core/utils/walletIcon.js";
import { isNativeToken } from "../../ConnectWallet/screens/nativeToken.js";
import { Container } from "../../components/basic.js";
import { ChainName } from "../../components/ChainName.js";
import { fallbackChainIcon } from "../../components/fallbackChainIcon.js";
import { Img } from "../../components/Img.js";
import { Text } from "../../components/text.js";

export function TokenAndChain({
  token,
  client,
  size,
  style,
}: {
  token: Omit<Token, "priceUsd">;
  client: ThirdwebClient;
  size: keyof typeof iconSize;
  style?: React.CSSProperties;
}) {
  const theme = useCustomTheme();
  const chain = getCachedChain(token.chainId);
  return (
    <Container
      center="y"
      flex="row"
      gap="sm"
      style={{
        flexWrap: "nowrap",
        ...style,
      }}
    >
      <Container
        style={{
          height: iconSize[size],
          position: "relative",
          width: iconSize[size],
        }}
      >
        <TokenIconWithFallback client={client} size={size} token={token} />
        {chain.id !== 1 && (
          <Container
            style={{
              background: theme.colors.borderColor,
              border: `1.5px solid ${theme.colors.modalBg}`,
              borderRadius: "50%",
              bottom: "-2px",
              height:
                size === "lg" || size === "xl" ? iconSize.sm : iconSize.xs,
              position: "absolute",
              right: "-6px",
              width: size === "lg" || size === "xl" ? iconSize.sm : iconSize.xs,
            }}
          >
            <ChainIcon
              chain={chain}
              client={client}
              size={size === "xl" || size === "lg" ? "sm" : "xs"}
            />
          </Container>
        )}
      </Container>

      <Container flex="column" gap="3xs" style={{ minWidth: 0 }}>
        <Text
          color="primaryText"
          size={size === "xl" ? "lg" : "sm"}
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          weight={600}
        >
          {token.name}
        </Text>
        <ChainName
          chain={chain}
          client={client}
          short
          size={size === "xl" ? "sm" : "xs"}
        />
      </Container>
    </Container>
  );
}

function TokenIconWithFallback(props: {
  token: Omit<Token, "priceUsd">;
  size: keyof typeof iconSize;
  client: ThirdwebClient;
}) {
  const chain = getCachedChain(props.token.chainId);
  const chainMeta = useChainMetadata(chain).data;
  const theme = useCustomTheme();

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
      client={props.client}
      fallbackImage={genericTokenIcon}
      height={iconSize[props.size]}
      src={tokenImage}
      style={{
        borderRadius: "50%",
      }}
      width={iconSize[props.size]}
    />
  ) : (
    <Container
      style={{
        alignItems: "center",
        backgroundColor: theme.colors.secondaryButtonBg,
        border: `1px solid ${theme.colors.borderColor}`,
        borderRadius: "50%",
        display: "flex",
        height: `${iconSize[props.size]}px`,
        justifyContent: "center",
        padding: spacing.xs,
        width: `${iconSize[props.size]}px`,
      }}
    >
      <Text
        color="secondaryText"
        size={props.size === "xl" ? "sm" : "xs"}
        style={{ fontWeight: 600 }}
      >
        {props.token.symbol.slice(0, 1)}
      </Text>
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
        alignItems: "center",
        display: "flex",
        flexShrink: 0,
        position: "relative",
      }}
    >
      <Img
        client={props.client}
        fallbackImage={fallbackChainIcon}
        height={iconSize[props.size]}
        src={getSrcChainIcon({
          chainIconUrl: url,
          client: props.client,
        })}
        width={iconSize[props.size]}
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
      client: props.client,
      uri: url,
    });
  } catch {
    return fallbackChainIcon;
  }
};
