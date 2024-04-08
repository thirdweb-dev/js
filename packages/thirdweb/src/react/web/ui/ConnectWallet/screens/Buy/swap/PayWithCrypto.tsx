import { ChevronDownIcon } from "@radix-ui/react-icons";
import type { Chain } from "../../../../../../../chains/types.js";
import { formatNumber } from "../../../../../../../utils/formatNumber.js";
import { useChainQuery } from "../../../../../../core/hooks/others/useChainQuery.js";
import { useWalletBalance } from "../../../../../../core/hooks/others/useWalletBalance.js";
import { useActiveAccount } from "../../../../../../core/hooks/wallets/wallet-hooks.js";
import { ChainIcon } from "../../../../components/ChainIcon.js";
import { Skeleton } from "../../../../components/Skeleton.js";
import { Container, Line } from "../../../../components/basic.js";
import { Button } from "../../../../components/buttons.js";
import { Text } from "../../../../components/text.js";
import { useCustomTheme } from "../../../../design-system/CustomThemeProvider.js";
import { StyledDiv } from "../../../../design-system/elements.js";
import {
  fontSize,
  iconSize,
  radius,
  spacing,
} from "../../../../design-system/index.js";
import type { TokenInfo } from "../../../defaultTokens.js";
import { WalletIcon } from "../../../icons/WalletIcon.js";
import { formatTokenBalance } from "../../TokenSelector.js";
import { type NativeToken, isNativeToken } from "../../nativeToken.js";
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
  token: TokenInfo | NativeToken;
  isLoading: boolean;
}) {
  const chainQuery = useChainQuery(props.chain);
  const activeAccount = useActiveAccount();

  const balanceQuery = useWalletBalance({
    address: activeAccount?.address,
    chain: props.chain,
    tokenAddress: isNativeToken(props.token) ? undefined : props.token.address,
  });

  return (
    <div>
      <BorderBox>
        {/* Row 1 */}
        <Container
          px="sm"
          flex="row"
          style={{
            flexWrap: "nowrap",
            justifyContent: "space-between",
          }}
        >
          {/* Left */}

          <TokenSelectorButton
            onClick={props.onTokenClick}
            style={{
              border: "none",
              paddingInline: 0,
            }}
            token={props.token}
            chain={props.chain}
          />

          {/* Right */}

          <div
            style={{
              flexGrow: 1,
              flexShrink: 1,
              display: "flex",
              alignItems: "center",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              justifyContent: "flex-end",
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
                {formatNumber(Number(props.value), 4) || "--"}
              </Text>
            )}
          </div>
        </Container>

        <Line />

        {/* Row 2 */}
        <Container flex="row" px="sm" center="y">
          {/* right */}
          <Container
            flex="row"
            style={{
              flexGrow: 1,
              flexWrap: "nowrap",
            }}
          >
            <Button
              variant="outline"
              style={{
                fontSize: fontSize.sm,
                border: "none",
                paddingInline: 0,
                paddingBlock: spacing.sm,
              }}
              gap="xs"
              onClick={props.onChainClick}
            >
              <ChainIcon chain={chainQuery.data} size={iconSize.sm} />
              <Container color="secondaryText" flex="row" center="y" gap="xxs">
                {chainQuery.data?.name ? (
                  <Text color="secondaryText" size="sm">
                    {chainQuery.data.name}
                  </Text>
                ) : (
                  <Skeleton width="90px" height={fontSize.xs} />
                )}

                <ChevronDownIcon width={iconSize.sm} height={iconSize.sm} />
              </Container>
            </Button>
          </Container>

          <Container flex="row" gap="xxs" center="y" color="secondaryText">
            <WalletIcon size={iconSize.xs} />
            {balanceQuery.data ? (
              <Text size="xs" color="secondaryText">
                {formatTokenBalance(balanceQuery.data, true)}
              </Text>
            ) : (
              <Skeleton width="70px" height={fontSize.xs} />
            )}
          </Container>
        </Container>
      </BorderBox>
    </div>
  );
}

const BorderBox = /* @__PURE__ */ StyledDiv(() => {
  const theme = useCustomTheme();
  return {
    border: `1px solid ${theme.colors.borderColor}`,
    borderRadius: radius.lg,
  };
});
