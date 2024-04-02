import { Container } from "../../../../components/basic.js";
import { Input } from "../../../../components/formElements.js";
import type { Chain } from "../../../../../../../chains/types.js";
import type { ERC20OrNativeToken } from "../../nativeToken.js";
import { Skeleton } from "../../../../components/Skeleton.js";
import { fontSize, iconSize } from "../../../../design-system/index.js";
import { Spacer } from "../../../../components/Spacer.js";
import { Button } from "../../../../components/buttons.js";
import { useChainQuery } from "../../../../../../core/hooks/others/useChainQuery.js";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Text } from "../../../../components/text.js";
import styled from "@emotion/styled";
import { useCustomTheme } from "../../../../design-system/CustomThemeProvider.js";
import { TokenIcon } from "../../../../components/TokenIcon.js";
import { TokenSymbol } from "../../../../components/token/TokenSymbol.js";

/**
 * @internal
 */
export function BuyTokenInput(props: {
  token: ERC20OrNativeToken;
  chain: Chain;
  value: string;
  onChange: (value: string) => void;
  onSelectToken: () => void;
}) {
  const chainQuery = useChainQuery(props.chain);

  const getWidth = () => {
    let chars = props.value.replace(".", "").length;
    const hasDot = props.value.includes(".");
    if (hasDot) {
      chars += 0.3;
    }
    return `calc(${Math.max(1, chars) + "ch"} + 6px)`;
  };

  return (
    <Container>
      {/* Input */}

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
          placeholder="0"
          type="text"
          data-placeholder={props.value === ""}
          value={props.value || "0"}
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
              value = "0" + value;
            }

            const numValue = Number(value);
            if (isNaN(numValue)) {
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
            fontSize:
              props.value.length > 10
                ? "26px"
                : props.value.length > 6
                  ? "34px"
                  : "50px",
            boxShadow: "none",
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

      <Spacer y="md" />

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
        >
          <Container flex="row" center="y" gap="sm">
            <TokenIcon token={props.token} chain={props.chain} size="md" />
            {/* <BorderBox
              style={{
                padding: "6px",
              }}
            >

            </BorderBox> */}

            {/* <BorderBox
              style={{
                position: "relative",
                padding: "4px",
                transform: "translate(-10%, -10%)",
              }}
            >
              <ChainIcon chain={chainQuery.data} size={iconSize.md} />
              <BorderBox
                style={{
                  position: "absolute",
                  right: 0,
                  bottom: 0,
                  transform: "translate(40%, 40%)",
                  padding: "2px",
                }}
              >
                <TokenIcon token={props.token} chain={props.chain} size="sm" />
              </BorderBox>
            </BorderBox> */}

            <Container flex="column" gap="xxs">
              {/* Token Symbol */}
              <TokenSymbol token={props.token} chain={props.chain} size="sm" />

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

        {/* <TokenSelectorButton
          onClick={props.onTokenClick}
          token={props.token}
          chain={props.chain}
          style={{
            padding: 0,
            fontSize: fontSize.sm,
            border: "none",
          }}
        /> */}
      </Container>
    </Container>
  );
}

const TokenButton = /* @__PURE__ */ styled(Button)(() => {
  const theme = useCustomTheme();
  return {
    background: theme.colors.walletSelectorButtonHoverBg,
    justifyContent: "flex-start",
    transition: "background 0.3s",
  };
});

// const BorderBox = /* @__PURE__ */ StyledDiv(() => {
//   const theme = useCustomTheme();
//   return {
//     border: `2px solid ${theme.colors.borderColor}`,
//     borderRadius: radius.sm,
//     // background: theme.colors.walletSelectorButtonHoverBg,
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//   };
// });
