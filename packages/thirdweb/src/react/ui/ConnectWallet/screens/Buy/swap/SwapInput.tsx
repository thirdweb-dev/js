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
import { Container } from "../../../../components/basic.js";
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
import { formatTokenBalance } from "../../TokenSelector.js";
import type { Chain } from "../../../../../../chains/types.js";
import { Text } from "../../../../components/text.js";
import type { NativeToken } from "../../nativeToken.js";

const height = "52px";
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
    <div>
      <Container>
        {/* Header row */}
        <Container flex="row" gap="sm" center="y">
          <Text size="sm">{props.label}</Text>

          {/* Chain selector */}
          <Button
            variant="outline"
            style={{
              paddingBlock: spacing.xxs,
              paddingInline: spacing.xs,
              fontSize: fontSize.xs,
              borderWidth: "1px",
            }}
            gap="xxs"
            onClick={props.onChainClick}
          >
            <ChainIcon chain={chainQuery.data} size={iconSize.sm} />
            {chainQuery.data?.name || (
              <Skeleton width="90px" height={fontSize.xs} />
            )}
            <Container color="secondaryText">
              <ChevronDownIcon width={iconSize.xs} height={iconSize.xs} />
            </Container>
          </Button>
        </Container>

        <Spacer y="xs" />

        <div>
          {/* Row 1 */}
          <SwapInputContainer>
            {/* Input */}
            <InputBorderBox>
              {props.valueIsLoading && (
                <div
                  style={{
                    position: "absolute",
                    left: spacing.sm,
                    top: "50%",
                    zIndex: 1,
                    transform: "translateY(-50%)",
                  }}
                >
                  <Skeleton width="120px" height={fontSize.lg} />
                </div>
              )}

              <Input
                inputMode="decimal"
                placeholder={props.valueIsLoading ? "" : "0"}
                variant="outline"
                pattern="^[0-9]*[.,]?[0-9]*$"
                type="text"
                style={{
                  fontSize: fontSize.lg,
                  border: "none",
                  boxShadow: "none",
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                  fontWeight: 500,
                }}
                value={props.value}
                onChange={(e) => {
                  const isNum = Number(e.target.value);
                  if (isNaN(isNum)) {
                    return;
                  }
                  props.onChange(e.target.value);
                }}
              />
            </InputBorderBox>

            {/* Token Selector */}
            <Button
              variant="outline"
              style={{
                height: height,
                justifyContent: "flex-start",
                // borderLeft: "none",
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                minWidth: "140px",
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
          </SwapInputContainer>

          <Spacer y="xs" />

          {/* Row 2 */}
          <div
            style={{
              display: "flex",
              flexWrap: "nowrap",
              gap: spacing.xs,
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Container flex="row" gap="xs" color="secondaryText">
              <Text size="xs">Balance:</Text>
              {balanceQuery.data ? (
                <Text size="xs" color="secondaryText">
                  {formatTokenBalance(balanceQuery.data, false)}
                </Text>
              ) : (
                <Skeleton width="70px" height={fontSize.xs} />
              )}
            </Container>
          </div>
        </div>
      </Container>
    </div>
  );
}

const SwapInputContainer = /* @__PURE__ */ StyledDiv(() => {
  const theme = useCustomTheme();
  return {
    borderRadius: radius.lg,
    display: "flex",
    flexWrap: "nowrap",
    alignItems: "center",
    "&:focus-within [data-line]": {
      background: theme.colors.accentText,
    },
  };
});

const InputBorderBox = /* @__PURE__ */ StyledDiv(() => {
  const theme = useCustomTheme();
  return {
    borderRadius: radius.lg,
    border: "1.5px solid",
    borderColor: theme.colors.borderColor,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderRightWidth: "1px",
    height,
    position: "relative",
  };
});
