import styled from "@emotion/styled";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import type { Chain } from "../../../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import { useCustomTheme } from "../../../../../../core/design-system/CustomThemeProvider.js";
import {
  fontSize,
  iconSize,
  spacing,
} from "../../../../../../core/design-system/index.js";
import { useChainQuery } from "../../../../../../core/hooks/others/useChainQuery.js";
import { Skeleton } from "../../../../components/Skeleton.js";
import { Spacer } from "../../../../components/Spacer.js";
import { TokenIcon } from "../../../../components/TokenIcon.js";
import { Container } from "../../../../components/basic.js";
import { Button } from "../../../../components/buttons.js";
import { Input } from "../../../../components/formElements.js";
import { Text } from "../../../../components/text.js";
import { TokenSymbol } from "../../../../components/token/TokenSymbol.js";
import type { ERC20OrNativeToken } from "../../nativeToken.js";
import { getBuyTokenAmountFontSize } from "../utils.js";

/**
 * @internal
 */
export function BuyTokenInput(props: {
  token: ERC20OrNativeToken;
  chain: Chain;
  value: string;
  onChange: (value: string) => void;
  onSelectToken: () => void;
  client: ThirdwebClient;
  hideTokenSelector?: boolean;
  freezeAmount?: boolean;
  freezeChainAndToken?: boolean;
}) {
  const chainQuery = useChainQuery(props.chain);

  const getWidth = () => {
    let chars = props.value.replace(".", "").length;
    const hasDot = props.value.includes(".");
    if (hasDot) {
      chars += 0.3;
    }
    return `calc(${`${Math.max(1, chars)}ch`} + 6px)`;
  };

  return (
    <Container>
      {/* Input */}

      {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
      <div
        onClick={(e) => {
          e.currentTarget.querySelector("input")?.focus();
        }}
      >
        <Container
          flex="row"
          center="both"
          gap="xs"
          style={{
            flexWrap: "nowrap",
          }}
        >
          <Input
            variant="outline"
            pattern="^[0-9]*[.,]?[0-9]*$"
            inputMode="decimal"
            tabIndex={-1}
            placeholder="0"
            type="text"
            data-placeholder={props.value === ""}
            value={props.value || "0"}
            disabled={props.freezeAmount}
            onClick={(e) => {
              // put cursor at the end of the input
              if (props.value === "") {
                e.currentTarget.setSelectionRange(
                  e.currentTarget.value.length,
                  e.currentTarget.value.length,
                );
              }
            }}
            onChange={(e) => {
              let value = e.target.value;

              if (value.startsWith(".")) {
                value = `0${value}`;
              }

              const numValue = Number(value);
              if (Number.isNaN(numValue)) {
                return;
              }

              if (value.startsWith("0") && !value.startsWith("0.")) {
                props.onChange(value.slice(1));
              } else {
                props.onChange(value);
              }
            }}
            style={{
              border: "none",
              fontSize: getBuyTokenAmountFontSize(props.value),
              boxShadow: "none",
              borderRadius: "0",
              padding: "0",
              paddingBlock: "2px",
              fontWeight: 600,
              textAlign: "right",
              width: getWidth(),
              maxWidth: "calc(100% - 100px)",
            }}
          />
          <TokenSymbol
            token={props.token}
            chain={props.chain}
            size="lg"
            color="secondaryText"
          />
        </Container>
      </div>

      {!props.hideTokenSelector && (
        <>
          <Spacer y="sm" />

          {/* Token / Chain selector */}
          <Container flex="row" center="x">
            <TokenButton
              variant="secondary"
              fullWidth
              style={{
                fontSize: fontSize.sm,
              }}
              gap="xxs"
              onClick={props.onSelectToken}
              disabled={props.freezeChainAndToken}
            >
              <Container flex="row" center="y" gap="sm">
                <TokenIcon
                  token={props.token}
                  chain={props.chain}
                  size="md"
                  client={props.client}
                />

                <Container
                  flex="column"
                  style={{
                    gap: "4px",
                  }}
                >
                  {/* Token Symbol */}
                  <TokenSymbol
                    token={props.token}
                    chain={props.chain}
                    size="sm"
                  />

                  {/* Network Name */}
                  {chainQuery.data?.name ? (
                    <Text size="xs" color="secondaryText">
                      {chainQuery.data.name}
                    </Text>
                  ) : (
                    <Skeleton width="90px" height={fontSize.xs} />
                  )}
                </Container>
              </Container>

              <ChevronDownIcon
                width={iconSize.sm}
                height={iconSize.sm}
                style={{
                  marginLeft: "auto",
                }}
              />
            </TokenButton>
          </Container>
        </>
      )}
    </Container>
  );
}

const TokenButton = /* @__PURE__ */ styled(Button)(() => {
  const theme = useCustomTheme();
  return {
    background: theme.colors.tertiaryBg,
    border: `1px solid ${theme.colors.borderColor}`,
    justifyContent: "flex-start",
    transition: "background 0.3s",
    padding: spacing.sm,
  };
});
