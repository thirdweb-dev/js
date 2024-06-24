import styled from "@emotion/styled";
import { useCustomTheme } from "../../../../../../core/design-system/CustomThemeProvider.js";
import {
  iconSize,
  spacing,
} from "../../../../../../core/design-system/index.js";
import { Spacer } from "../../../../components/Spacer.js";
import { Container, Line, ModalHeader } from "../../../../components/basic.js";
import { Button } from "../../../../components/buttons.js";
import { Text } from "../../../../components/text.js";
import { type CurrencyMeta, currencies } from "./currencies.js";

export function CurrencySelection(props: {
  onSelect: (currency: CurrencyMeta) => void;
  onBack: () => void;
}) {
  return (
    <Container>
      <Container p="lg">
        <ModalHeader title="Pay with" onBack={props.onBack} />
      </Container>

      <Line />
      <Spacer y="lg" />

      <Container flex="column" gap="xs" px="lg">
        {currencies.map((c) => {
          return (
            <SelectCurrencyButton
              fullWidth
              variant="secondary"
              key={c.shorthand}
              onClick={() => props.onSelect(c)}
              gap="sm"
            >
              <c.icon size={iconSize.lg} />
              <Container flex="column" gap="xxs">
                <Text color="primaryText">{c.shorthand}</Text>
                <Text size="sm">{c.name}</Text>
              </Container>
            </SelectCurrencyButton>
          );
        })}
      </Container>

      <Spacer y="lg" />
    </Container>
  );
}

const SelectCurrencyButton = /* @__PURE__ */ styled(Button)(() => {
  const theme = useCustomTheme();
  return {
    background: theme.colors.tertiaryBg,
    justifyContent: "flex-start",
    gap: spacing.sm,
    padding: spacing.sm,
    "&:hover": {
      background: theme.colors.secondaryButtonBg,
      transform: "scale(1.01)",
    },
    transition: "background 200ms ease, transform 150ms ease",
  };
});
