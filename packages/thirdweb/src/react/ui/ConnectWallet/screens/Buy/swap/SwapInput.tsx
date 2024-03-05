import { ChevronDownIcon } from "@radix-ui/react-icons";
import { useChainQuery } from "../../../../../hooks/others/useChainQuery.js";
import { useWalletBalance } from "../../../../../hooks/others/useWalletBalance.js";
import { useActiveAccount } from "../../../../../providers/wallet-provider.js";
import {
  ChainIcon,
  fallbackChainIcon,
} from "../../../../components/ChainIcon.js";
import { Img } from "../../../../components/Img.js";
import { Skeleton } from "../../../../components/Skeleton.js";
import { Spacer } from "../../../../components/Spacer.js";
import { Container, Line } from "../../../../components/basic.js";
import { Button } from "../../../../components/buttons.js";
import { Input } from "../../../../components/formElements.js";
import { useCustomTheme } from "../../../../design-system/CustomThemeProvider.js";
import { StyledDiv } from "../../../../design-system/elements.js";
import {
  spacing,
  fontSize,
  iconSize,
  radius,
} from "../../../../design-system/index.js";
import type { TokenInfo } from "../../../defaultTokens.js";
import { WalletIcon } from "../../../icons/WalletIcon.js";
import { formatTokenBalance } from "../../TokenSelector.js";
import type { Chain } from "../../../../../../chains/types.js";
import { Text } from "../../../../components/text.js";
import type { NativeToken } from "../../nativeToken.js";

/**
 * @internal
 */
export function SwapInput(props: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  valueIsLoading: boolean;
  onTokenClick: () => void;
  onChainClick: () => void;
  chain: Chain;
  token?: TokenInfo | NativeToken;
  estimatedValue?: number;
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
    <SwapInputContainer>
      <Container>
        {/* Header row */}
        <Container
          flex="row"
          gap="sm"
          center="y"
          style={{
            justifyContent: "space-between",
            paddingBlock: spacing.xs,
            paddingRight: spacing.sm,
            paddingLeft: spacing.md,
          }}
        >
          <Text size="sm">{props.label}</Text>

          {/* Chain selector */}
          <Button
            variant="outline"
            style={{
              borderColor: "transparent",
              paddingBlock: spacing.xs,
              paddingInline: spacing.sm,
              paddingRight: 0,
              fontSize: fontSize.sm,
            }}
            gap="xxs"
            onClick={props.onChainClick}
          >
            <ChainIcon chain={chainQuery.data} size={iconSize.sm} />
            {chainQuery.data?.name || (
              <Skeleton width="90px" height={fontSize.xs} />
            )}
            <Container color="secondaryText">
              <ChevronDownIcon />
            </Container>
          </Button>
        </Container>
        <Line />
        <div
          style={{
            padding: spacing.sm,
          }}
        >
          {/* Row 1 */}
          <div
            style={{
              display: "flex",
              flexWrap: "nowrap",
              gap: spacing.xxs,
              alignItems: "center",
            }}
          >
            {/* Input */}
            <div
              style={{
                position: "relative",
              }}
            >
              {props.valueIsLoading && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    zIndex: 1,
                    transform: "translateY(-50%)",
                  }}
                >
                  <Skeleton width="120px" height={fontSize.xl} />
                </div>
              )}

              <Input
                type="number"
                inputMode="decimal"
                placeholder={props.valueIsLoading ? "" : "0"}
                variant="transparent"
                data-focus="false"
                style={{
                  height: "100%",
                  fontSize: fontSize.xl,
                  paddingBlock: spacing.xxs,
                  paddingInline: spacing.xxs,
                  paddingLeft: 0,
                }}
                value={props.value}
                onChange={(e) => {
                  props.onChange(e.target.value);
                }}
              />
            </div>

            {/* Token Selector */}
            <Button
              variant="outline"
              style={{
                borderColor: "transparent",
                justifyContent: "flex-start",
                padding: spacing.xxs,
                paddingRight: 0,
              }}
              gap="xxs"
              onClick={props.onTokenClick}
            >
              {props.token ? (
                <>
                  <Container flex="row" center="y" gap="xs">
                    {tokenIcon ? (
                      <Img
                        src={tokenIcon}
                        width={iconSize.md}
                        height={iconSize.md}
                        fallbackImage={fallbackChainIcon}
                      />
                    ) : (
                      <Skeleton
                        width={iconSize.md + "px"}
                        height={iconSize.md + "px"}
                      />
                    )}

                    {tokenSymbol ? (
                      <Text color="primaryText" size="sm">
                        {tokenSymbol}
                      </Text>
                    ) : (
                      <Skeleton width="70px" height={fontSize.sm} />
                    )}
                  </Container>

                  <Container color="secondaryText">
                    <ChevronDownIcon />
                  </Container>
                </>
              ) : (
                <Container flex="row" center="y" gap="xs" color="secondaryText">
                  <Text size="sm"> Select token </Text>
                  <ChevronDownIcon />
                </Container>
              )}
            </Button>
          </div>

          <Spacer y="sm" />

          {/* Row 2 */}
          <div
            style={{
              display: "flex",
              flexWrap: "nowrap",
              gap: spacing.xs,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text size="xs" color="secondaryText">
              {props.estimatedValue ? (
                `$${props.estimatedValue / 100}`
              ) : props.valueIsLoading ? (
                <Skeleton width="70px" height={fontSize.xs} />
              ) : (
                "$0.0"
              )}
            </Text>

            <Container flex="row" gap="xs" color="secondaryText">
              <div
                title="Wallet Balance"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <WalletIcon size={iconSize.xs} />
              </div>
              {balanceQuery.data ? (
                <Text size="xs" color="secondaryText">
                  {formatTokenBalance(balanceQuery.data)}
                </Text>
              ) : (
                <Skeleton width="70px" height={fontSize.xs} />
              )}
            </Container>
          </div>
        </div>
      </Container>
    </SwapInputContainer>
  );
}

const SwapInputContainer = /* @__PURE__ */ StyledDiv(() => {
  const theme = useCustomTheme();
  return {
    border: `1px solid ${theme.colors.borderColor}`,
    borderRadius: radius.lg,
  };
});
