import styled from "@emotion/styled";
import { Spacer } from "../../../components/Spacer.js";
import { Container } from "../../../components/basic.js";
import { Button } from "../../../components/buttons.js";
import { Text } from "../../../components/text.js";
import { useCustomTheme } from "../../../design-system/CustomThemeProvider.js";
import { fontSize, spacing } from "../../../design-system/index.js";

/**
 * @internal
 */
export function PaymentSelection(props: {
  selected: "crypto" | "creditCard";
  onSelect: (method: "crypto" | "creditCard") => void;
}) {
  return (
    <div>
      <Text size="sm">Pay with </Text>
      <Spacer y="xs" />
      <Container
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridGap: spacing.sm,
        }}
      >
        <CheckButton
          isChecked={props.selected === "crypto"}
          variant="outline"
          onClick={() => {
            props.onSelect("crypto");
          }}
        >
          <Container gap="xxs" flex="row" center="y">
            Crypto
          </Container>
        </CheckButton>
        <div
          style={{
            position: "relative",
          }}
        >
          <CheckButton
            isChecked={props.selected === "creditCard"}
            variant="outline"
            onClick={() => {
              props.onSelect("creditCard");
            }}
          >
            Credit Card
          </CheckButton>
        </div>
      </Container>
    </div>
  );
}

const CheckButton = /* @__PURE__ */ styled(Button)(
  (props: {
    isChecked: boolean;
  }) => {
    const theme = useCustomTheme();
    return {
      fontSize: fontSize.sm,
      borderColor: props.isChecked
        ? theme.colors.accentText
        : theme.colors.borderColor,
      gap: spacing.xs,
      paddingInline: spacing.xxs,
      paddingBlock: spacing.sm,
      width: "100%",
    };
  },
);
