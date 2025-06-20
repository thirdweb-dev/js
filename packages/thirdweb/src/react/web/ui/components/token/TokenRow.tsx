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
import { Container } from "../basic.js";
import { Button } from "../buttons.js";
import { Skeleton } from "../Skeleton.js";
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
        fullWidth
        gap="xxs"
        onClick={props.onSelectToken}
        style={{
          fontSize: fontSize.sm,
          justifyContent: "space-between",
          paddingBottom: spacing.md,
          paddingTop: spacing.md,
          ...props.style,
        }}
        variant="secondary"
      >
        <Text color="primaryText" size="sm">
          Select payment token
        </Text>
        <Container color="primaryText">
          <ChevronDownIcon height={iconSize.sm} width={iconSize.sm} />
        </Container>
      </Button>
    );
  }

  return (
    <TokenButton
      disabled={props.freezeChainAndToken}
      fullWidth
      gap="xxs"
      onClick={props.onSelectToken}
      style={{
        fontSize: fontSize.sm,
        ...props.style,
      }}
      variant="secondary"
    >
      <Container center="y" flex="row" gap="sm">
        <PayTokenIcon
          chain={props.chain}
          client={props.client}
          size="md"
          token={props.token}
        />

        <Container flex="column" gap="4xs">
          {/* Token Symbol */}
          <Container flex="column" gap="4xs">
            {props.isLoading ? (
              <Skeleton
                color="borderColor"
                height={fontSize.md}
                width="120px"
              />
            ) : props.value ? (
              <Container center="y" color="primaryText" flex="row" gap="xxs">
                <Text
                  color={props.value ? "primaryText" : "secondaryText"}
                  size="md"
                >
                  {formatNumber(Number(props.value), 6) || ""}
                </Text>
                <TokenSymbol
                  chain={props.chain}
                  color="secondaryText"
                  size="sm"
                  token={props.token}
                />
              </Container>
            ) : (
              <TokenSymbol chain={props.chain} size="sm" token={props.token} />
            )}
          </Container>

          {/* Network Name */}
          {name ? (
            <Text color="secondaryText" size="xs">
              {name}
            </Text>
          ) : (
            <Skeleton height={fontSize.xs} width="90px" />
          )}
        </Container>
      </Container>
      {!props.freezeChainAndToken && (
        <Container color="primaryText">
          <ChevronDownIcon height={iconSize.sm} width={iconSize.sm} />
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
    padding: spacing.sm,
    transition: "background 0.3s",
  };
});
