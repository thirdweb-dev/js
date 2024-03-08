import { Spacer } from "../../../components/Spacer.js";
import { Container, ModalHeader } from "../../../components/basic.js";
import { Button } from "../../../components/buttons.js";
import { Text } from "../../../components/text.js";
import { useCustomTheme } from "../../../design-system/CustomThemeProvider.js";
import { StyledDiv } from "../../../design-system/elements.js";
import {
  fontSize,
  iconSize,
  radius,
  spacing,
} from "../../../design-system/index.js";
import { CreditCardIcon } from "../../icons/CreditCardIcon.js";
import { CryptoIcon } from "../../icons/CryptoIcon.js";
import styled from "@emotion/styled";

/**
 * @internal
 */
export function BuyHeader(props: { onBack?: () => void }) {
  return (
    <div>
      <ModalHeader title="Buy" onBack={props.onBack} />
      <Spacer y="lg" />
      <Text size="sm">Pay with </Text>
      <Spacer y="sm" />
      <Container
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridGap: spacing.sm,
        }}
      >
        <CheckButton isChecked={true} variant="outline">
          <Container gap="xxs" flex="row" center="y">
            <CryptoIcon size={iconSize.sm} />
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
            <CreditCardIcon size={iconSize.sm} />
            Credit Card
          </CheckButton>
          <FloatingBadge> Coming Soon </FloatingBadge>
        </div>
      </Container>
    </div>
  );
}

const CheckButton = /* @__PURE__ */ styled(Button)((props: {
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
    width: "100%",
  };
});

const FloatingBadge = /* @__PURE__ */ StyledDiv(() => {
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
