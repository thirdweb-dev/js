"use client";
import { useCustomTheme } from "../../../../core/design-system/CustomThemeProvider.js";
import {
  iconSize,
  radius,
  spacing,
} from "../../../../core/design-system/index.js";
import { Spacer } from "../../components/Spacer.js";
import { Container } from "../../components/basic.js";
import { Button } from "../../components/buttons.js";
import { Text } from "../../components/text.js";

export interface FiatProviderSelectionProps {
  onProviderSelected: (provider: "coinbase" | "stripe" | "transak") => void;
}

export function FiatProviderSelection({
  onProviderSelected,
}: FiatProviderSelectionProps) {
  const theme = useCustomTheme();

  const providers = [
    {
      id: "coinbase" as const,
      name: "Coinbase",
      description: "Fast and secure payments",
      backgroundColor: theme.colors.accentText,
      initial: "CB",
    },
    {
      id: "stripe" as const,
      name: "Stripe",
      description: "Trusted payment processing",
      backgroundColor: "#635BFF",
      initial: "S",
    },
    {
      id: "transak" as const,
      name: "Transak",
      description: "Global payment solution",
      backgroundColor: "#2B6CB0",
      initial: "T",
    },
  ];

  // TODO: add a "remember my choice" checkbox

  return (
    <>
      <Text size="md" color="primaryText">
        Select Payment Provider
      </Text>
      <Spacer y="md" />
      <Container flex="column" gap="sm">
        {providers.map((provider) => (
          <Button
            key={provider.id}
            variant="secondary"
            fullWidth
            onClick={() => onProviderSelected(provider.id)}
            style={{
              border: `1px solid ${theme.colors.borderColor}`,
              borderRadius: radius.md,
              padding: `${spacing.sm} ${spacing.md}`,
              backgroundColor: theme.colors.tertiaryBg,
              textAlign: "left",
            }}
          >
            <Container
              flex="row"
              gap="md"
              style={{ width: "100%", alignItems: "center" }}
            >
              <Container
                style={{
                  width: `${iconSize.md}px`,
                  height: `${iconSize.md}px`,
                  borderRadius: "50%",
                  backgroundColor: provider.backgroundColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: spacing.xs,
                }}
              >
                <Text
                  size="xs"
                  color="primaryButtonText"
                  style={{ fontWeight: 600 }}
                >
                  {provider.initial}
                </Text>
              </Container>
              <Container flex="column" gap="3xs" style={{ flex: 1 }}>
                <Text size="sm" color="primaryText" style={{ fontWeight: 600 }}>
                  {provider.name}
                </Text>
                <Text size="xs" color="secondaryText">
                  {provider.description}
                </Text>
              </Container>
            </Container>
          </Button>
        ))}
      </Container>
    </>
  );
}
