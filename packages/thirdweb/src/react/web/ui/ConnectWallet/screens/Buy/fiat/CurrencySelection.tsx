import styled from "@emotion/styled";
import { Spacer } from "../../../../components/Spacer.js";
import { Container, Line, ModalHeader } from "../../../../components/basic.js";
import { Button } from "../../../../components/buttons.js";
import { Text } from "../../../../components/text.js";
import { useCustomTheme } from "../../../../design-system/CustomThemeProvider.js";
import { iconSize, radius, spacing } from "../../../../design-system/index.js";
import { type CurrencyMeta, currencies } from "./currencies.js";

export function CurrencySelection(props: {
  onSelect: (currency: CurrencyMeta) => void;
  onBack: () => void;
}) {
  return (
    <Container>
      <Container p="lg">
        <ModalHeader title="Select Currency" onBack={props.onBack} />
      </Container>

      <Line />
      <Spacer y="lg" />

      <Container flex="column" gap="xs" px="md">
        {currencies.map((c) => {
          return (
            <CurrencyButton
              fullWidth
              variant="secondary"
              key={c.shorthand}
              onClick={() => props.onSelect(c)}
              gap="sm"
            >
              <c.icon size={iconSize.lg} />
              <Container flex="column" gap="xxs">
                <Text color="primaryText">{c.shorthand}</Text>
                <Text>{c.name}</Text>
              </Container>
            </CurrencyButton>
          );
        })}
      </Container>

      <Spacer y="lg" />
    </Container>
  );
}

const CurrencyButton = /* @__PURE__ */ styled(Button)(() => {
  const theme = useCustomTheme();
  return {
    background: "transparent",

    justifyContent: "flex-start",
    transition: "background 0.3s, border-color 0.3s",
    gap: spacing.sm,
    paddingInline: spacing.sm,
    paddingBlock: spacing.sm,
    color: theme.colors.primaryText,
    borderRadius: radius.md,
    minWidth: "50%",
  };
});
