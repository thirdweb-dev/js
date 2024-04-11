import styled from "@emotion/styled";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Skeleton } from "../../../../../components/Skeleton";
import { Spacer } from "../../../../../components/Spacer";
import { TokenIcon } from "../../../../../components/TokenIcon";
import { Container } from "../../../../../components/basic";
import { Button } from "../../../../../components/buttons";
import { Input } from "../../../../../components/formElements";
import { fontSize, iconSize, spacing } from "../../../../../design-system";
import { useCustomTheme } from "../../../../../design-system/CustomThemeProvider";
import { useChainQuery } from "../../../../hooks/useChainQuery";
import type { ERC20OrNativeToken } from "../../nativeToken";
import { TokenSymbol } from "../../../../../components/TokenSymbol";
import { Text } from "../../../../../components/text";

/**
 * @internal
 */
export function BuyTokenInput(props: {
  token: ERC20OrNativeToken;
  chainId: number;
  value: string;
  onChange: (value: string) => void;
  onSelectToken: () => void;
}) {
  const chainQuery = useChainQuery(props.chainId);

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
            chainId={props.chainId}
            size="lg"
            color="secondaryText"
          />
        </Container>
      </div>

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
            <TokenIcon token={props.token} chainId={props.chainId} size="md" />

            <Container
              flex="column"
              style={{
                gap: "4px",
              }}
            >
              {/* Token Symbol */}
              <TokenSymbol
                token={props.token}
                chainId={props.chainId}
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
    </Container>
  );
}

const TokenButton = /* @__PURE__ */ styled(Button)(() => {
  const theme = useCustomTheme();
  return {
    background: theme.colors.walletSelectorButtonHoverBg,
    border: `1px solid ${theme.colors.borderColor}`,
    justifyContent: "flex-start",
    transition: "background 0.3s",
    padding: spacing.sm,
  };
});
