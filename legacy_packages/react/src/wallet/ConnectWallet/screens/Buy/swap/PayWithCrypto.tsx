import { ChevronDownIcon } from "@radix-ui/react-icons";
import styled from "@emotion/styled";
import { Skeleton } from "../../../../../components/Skeleton";
import { TokenIcon } from "../../../../../components/TokenIcon";
import { TokenSymbol } from "../../../../../components/TokenSymbol";
import { Container } from "../../../../../components/basic";
import { Button } from "../../../../../components/buttons";
import {
  radius,
  iconSize,
  fontSize,
  spacing,
} from "../../../../../design-system";
import { useCustomTheme } from "../../../../../design-system/CustomThemeProvider";
import { useChainQuery } from "../../../../hooks/useChainQuery";
import { formatNumber } from "../../../../utils/formatNumber";
import { formatTokenBalance } from "../../../../utils/formatTokenBalance";
import { isNativeToken, type ERC20OrNativeToken } from "../../nativeToken";
import { Text } from "../../../../../components/text";
import { WalletIcon } from "../../../icons/WalletIcon";
import { useMultiChainBalance } from "../../../../hooks/useMultiChainBalance";

/**
 * Shows an amount "value" and renders the selected token and chain
 * It also renders the buttons to select the token and chain
 * It also renders the balance of active wallet for the selected token in selected chain
 * @internal
 */
export function PayWithCrypto(props: {
  value: string;
  onSelectToken: () => void;
  chainId: number;
  token: ERC20OrNativeToken;
  isLoading: boolean;
}) {
  const chainQuery = useChainQuery(props.chainId);
  const balanceQuery = useMultiChainBalance({
    tokenAddress: isNativeToken(props.token) ? undefined : props.token.address,
    chainId: props.chainId,
  });

  return (
    <Container
      bg="walletSelectorButtonHoverBg"
      borderColor="borderColor"
      style={{
        borderRadius: radius.md,
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0,
        borderWidth: "1px",
        borderStyle: "solid",
        borderBottom: "none",
      }}
    >
      <Container
        flex="row"
        style={{
          flexWrap: "nowrap",
          justifyContent: "space-between",
        }}
      >
        {/* Left */}
        <TokenButton variant="secondary" onClick={props.onSelectToken}>
          <TokenIcon token={props.token} chainId={props.chainId} size="md" />
          <Container flex="column" gap="xxs">
            <Container flex="row" gap="xs" center="y">
              <TokenSymbol
                token={props.token}
                chainId={props.chainId}
                size="sm"
              />
              <ChevronDownIcon width={iconSize.sm} height={iconSize.sm} />
            </Container>
            {chainQuery.data?.name ? (
              <Text size="xs"> {chainQuery.data.name}</Text>
            ) : (
              <Skeleton width="90px" height={fontSize.xs} />
            )}
          </Container>
        </TokenButton>

        {/* Right */}
        <div
          style={{
            flexGrow: 1,
            flexShrink: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: spacing.xxs,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            justifyContent: "center",
            paddingRight: spacing.sm,
          }}
        >
          {props.isLoading ? (
            <Skeleton width="120px" height={fontSize.md} />
          ) : (
            <Text
              size="md"
              color={props.value ? "primaryText" : "secondaryText"}
              style={{}}
            >
              {formatNumber(Number(props.value), 4) || "--"}
            </Text>
          )}

          <Container flex="row" gap="xxs" center="y" color="secondaryText">
            <WalletIcon size={fontSize.xs} />
            {balanceQuery.data ? (
              <Text size="xs" color="secondaryText" weight={500}>
                {formatTokenBalance(balanceQuery.data, true)}
              </Text>
            ) : (
              <Skeleton width="70px" height={fontSize.xs} />
            )}
          </Container>
        </div>
      </Container>
    </Container>
  );
}

const TokenButton = /* @__PURE__ */ styled(Button)(() => {
  const theme = useCustomTheme();
  return {
    background: "transparent",
    border: `1px solid transparent`,
    "&:hover": {
      background: "transparent",
      borderColor: theme.colors.accentText,
    },
    justifyContent: "flex-start",
    transition: "background 0.3s, border-color 0.3s",
    gap: spacing.sm,
    paddingInline: spacing.sm,
    paddingBlock: spacing.sm,
    color: theme.colors.primaryText,
    borderRadius: radius.md,
    minWidth: "50%",
  };
});
