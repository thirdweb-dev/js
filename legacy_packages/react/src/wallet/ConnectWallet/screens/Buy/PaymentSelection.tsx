/* eslint-disable i18next/no-literal-string */
import styled from "@emotion/styled";
import { Spacer } from "../../../../components/Spacer";
import { Container } from "../../../../components/basic";
import { Button } from "../../../../components/buttons";
import { spacing, fontSize, radius } from "../../../../design-system";
import { useCustomTheme } from "../../../../design-system/CustomThemeProvider";
import { StyledDiv } from "../../../../design-system/elements";
import { Text } from "../../../../components/text";

/**
 * @internal
 */
export function PaymentSelection() {
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
        <CheckButton isChecked={true} variant="outline">
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
            variant="outline"
            isChecked={false}
            style={{
              opacity: 0.5,
            }}
            disabled
          >
            Credit Card
          </CheckButton>
          <FloatingBadge> Coming Soon </FloatingBadge>
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FloatingBadge = /* @__PURE__ */ StyledDiv((_) => {
  const theme = useCustomTheme();
  return {
    position: "absolute",
    top: 0,
    right: 0,
    transform: "translate(10%, -60%)",
    backgroundColor: theme.colors.secondaryButtonBg,
    paddingBlock: "3px",
    paddingInline: spacing.xs,
    fontSize: fontSize.xs,
    borderRadius: radius.sm,
    color: theme.colors.accentText,
  };
});
