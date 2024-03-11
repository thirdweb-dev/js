import { ChevronDownIcon } from "@radix-ui/react-icons";
import { useChainQuery } from "../../../../../hooks/others/useChainQuery.js";
import { useWalletBalance } from "../../../../../hooks/others/useWalletBalance.js";
import { useActiveAccount } from "../../../../../providers/wallet-provider.js";
import { Skeleton } from "../../../../components/Skeleton.js";
import { Container, Line } from "../../../../components/basic.js";
import { Button } from "../../../../components/buttons.js";
import { useCustomTheme } from "../../../../design-system/CustomThemeProvider.js";
import { StyledDiv } from "../../../../design-system/elements.js";
import {
  spacing,
  fontSize,
  iconSize,
  radius,
} from "../../../../design-system/index.js";
import type { TokenInfo } from "../../../defaultTokens.js";
import { formatTokenBalance } from "../../TokenSelector.js";
import type { Chain } from "../../../../../../chains/types.js";
import { Text } from "../../../../components/text.js";
import type { NativeToken } from "../../nativeToken.js";
import { TokenSelectorButton } from "./TokenSelector.js";

/**
 * Shows an amount "value" and renders the selected token and chain
 * It also renders the buttons to select the token and chain
 * It also renders the balance of active wallet for the selected token in selected chain
 * @internal
 */
export function PayWithCrypto(props: {
  value: string;
  onTokenClick: () => void;
  onChainClick: () => void;
  chain: Chain;
  token?: TokenInfo | NativeToken;
  isLoading: boolean;
}) {
  const chainQuery = useChainQuery(props.chain);
  const activeAccount = useActiveAccount();

  const token =
    props.token && !("nativeToken" in props.token) ? props.token : undefined;

  const balanceQuery = useWalletBalance({
    account: activeAccount,
    chain: props.chain,
    tokenAddress: token?.address,
  });

  const tokenIcon = token?.icon || chainQuery.data?.icon?.url;
  const tokenSymbol = token?.symbol || balanceQuery.data?.symbol;

  return (
    <BorderBox>
      {/* Row 1 */}
      <Container
        flex="row"
        style={{
          flexWrap: "nowrap",
          justifyContent: "space-between",
        }}
      >
        {/* Left */}
        <div
          style={{
            flexGrow: 1,
            flexShrink: 1,
            display: "flex",
            alignItems: "center",
            padding: spacing.sm,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {props.isLoading ? (
            <Skeleton width="120px" height={fontSize.md} />
          ) : (
            <Text
              size="lg"
              color={props.value ? "primaryText" : "secondaryText"}
              style={{}}
            >
              {props.value || "--"}
            </Text>
          )}
        </div>

        {/* Right */}
        <TokenSelectorButton
          onClick={props.onTokenClick}
          style={{
            border: "none",
          }}
          token={props.token}
          tokenIcon={tokenIcon}
          tokenSymbol={tokenSymbol}
        />
      </Container>

      <Line />

      {/* Row 2 */}
      <Container
        flex="row"
        px="sm"
        center="y"
        style={{
          justifyContent: "space-between",
        }}
      >
        {/* left */}
        <Container
          flex="row"
          gap="xxs"
          color="secondaryText"
          style={{
            flex: 1,
          }}
        >
          <Text size="sm">Balance:</Text>
          {balanceQuery.data ? (
            <Text size="sm" color="secondaryText">
              {formatTokenBalance(balanceQuery.data, false)}
            </Text>
          ) : (
            <Skeleton width="70px" height={fontSize.sm} />
          )}
        </Container>

        {/* right */}
        <Button
          variant="outline"
          style={{
            fontSize: fontSize.sm,
            border: "none",
            paddingInline: 0,
          }}
          gap="xxs"
          onClick={props.onChainClick}
        >
          {chainQuery.data?.name || (
            <Skeleton width="90px" height={fontSize.xs} />
          )}
          <Container color="secondaryText">
            <ChevronDownIcon width={iconSize.sm} height={iconSize.sm} />
          </Container>
        </Button>
      </Container>
    </BorderBox>
  );
}

const BorderBox = /* @__PURE__ */ StyledDiv(() => {
  const theme = useCustomTheme();
  return {
    border: `1px solid ${theme.colors.borderColor}`,
    borderRadius: radius.lg,
  };
});
