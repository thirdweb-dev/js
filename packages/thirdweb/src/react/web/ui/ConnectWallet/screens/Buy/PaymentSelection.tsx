import styled from "@emotion/styled";
import { useCustomTheme } from "../../../../../core/design-system/CustomThemeProvider.js";
import { fontSize, spacing } from "../../../../../core/design-system/index.js";
import { Spacer } from "../../../components/Spacer.js";
import { Container } from "../../../components/basic.js";
import { Button } from "../../../components/buttons.js";
import { Text } from "../../../components/text.js";

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
          isChecked={props.selected === "creditCard"}
          variant="outline"
          onClick={() => {
            props.onSelect("creditCard");
          }}
        >
          Credit Card
        </CheckButton>

        <CheckButton
          isChecked={props.selected === "crypto"}
          variant="outline"
          onClick={() => {
            props.onSelect("crypto");
          }}
        >
          Crypto
        </CheckButton>
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
      "&:hover": {
        borderColor: props.isChecked
          ? theme.colors.accentText
          : theme.colors.secondaryText,
      },
      gap: spacing.xs,
      paddingInline: spacing.xxs,
      paddingBlock: spacing.sm,
      width: "100%",
    };
  },
);
