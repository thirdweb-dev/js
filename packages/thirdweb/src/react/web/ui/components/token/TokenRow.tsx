import styled from "@emotion/styled";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import type { Chain } from "../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { formatNumber } from "../../../../../utils/formatNumber.js";
import { useCustomTheme } from "../../../../core/design-system/CustomThemeProvider.js";
import {
  fontSize,
  iconSize,
  spacing,
} from "../../../../core/design-system/index.js";
import { useChainName } from "../../../../core/hooks/others/useChainQuery.js";
import { PayTokenIcon } from "../../ConnectWallet/screens/Buy/PayTokenIcon.js";
import type { ERC20OrNativeToken } from "../../ConnectWallet/screens/nativeToken.js";
import { Skeleton } from "../Skeleton.js";
import { Container } from "../basic.js";
import { Button } from "../buttons.js";
import { Text } from "../text.js";
import { TokenSymbol } from "./TokenSymbol.js";

export function TokenRow(props: {
  token: ERC20OrNativeToken | undefined;
  chain: Chain | undefined;
  client: ThirdwebClient;
  onSelectToken: () => void;
  freezeChainAndToken?: boolean;
  value?: string;
  isLoading?: boolean;
  style?: React.CSSProperties;
}) {
  const { name } = useChainName(props.chain);

  if (!props.token || !props.chain) {
    return (
      <Button
        variant="secondary"
        fullWidth
        style={{
          fontSize: fontSize.sm,
          justifyContent: "space-between",
          paddingTop: spacing.md,
          paddingBottom: spacing.md,
          ...props.style,
        }}
        gap="xxs"
        onClick={props.onSelectToken}
      >
        <Text size="sm" color="primaryText">
          Select payment token
        </Text>
        <Container color="primaryText">
          <ChevronDownIcon width={iconSize.sm} height={iconSize.sm} />
        </Container>
      </Button>
    );
  }

  return (
    <TokenButton
      variant="secondary"
      fullWidth
      style={{
        fontSize: fontSize.sm,
        ...props.style,
      }}
      gap="xxs"
      onClick={props.onSelectToken}
      disabled={props.freezeChainAndToken}
    >
      <Container flex="row" center="y" gap="sm">
        <PayTokenIcon
          token={props.token}
          chain={props.chain}
          size="md"
          client={props.client}
        />

        <Container flex="column" gap="4xs">
          {/* Token Symbol */}
          <Container flex="column" gap="4xs">
            {props.isLoading ? (
              <Skeleton
                width="120px"
                height={fontSize.md}
                color="borderColor"
              />
            ) : props.value ? (
              <Container flex="row" gap="xxs" center="y" color="primaryText">
                <Text
                  size="md"
                  color={props.value ? "primaryText" : "secondaryText"}
                >
                  {formatNumber(Number(props.value), 6) || ""}
                </Text>
                <TokenSymbol
                  token={props.token}
                  chain={props.chain}
                  color="secondaryText"
                  size="sm"
                />
              </Container>
            ) : (
              <TokenSymbol token={props.token} chain={props.chain} size="sm" />
            )}
          </Container>

          {/* Network Name */}
          {name ? (
            <Text size="xs" color="secondaryText">
              {name}
            </Text>
          ) : (
            <Skeleton width="90px" height={fontSize.xs} />
          )}
        </Container>
      </Container>
      {!props.freezeChainAndToken && (
        <Container color="primaryText">
          <ChevronDownIcon width={iconSize.sm} height={iconSize.sm} />
        </Container>
      )}
    </TokenButton>
  );
}

const TokenButton = /* @__PURE__ */ styled(Button)(() => {
  const theme = useCustomTheme();
  return {
    background: theme.colors.tertiaryBg,
    border: `1px solid ${theme.colors.borderColor}`,
    justifyContent: "space-between",
    transition: "background 0.3s",
    padding: spacing.sm,
  };
});
