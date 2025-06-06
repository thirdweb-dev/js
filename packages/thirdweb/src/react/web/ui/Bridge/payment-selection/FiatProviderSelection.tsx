"use client";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { useCustomTheme } from "../../../../core/design-system/CustomThemeProvider.js";
import {
  iconSize,
  radius,
  spacing,
} from "../../../../core/design-system/index.js";
import { Img } from "../../components/Img.js";
import { Spacer } from "../../components/Spacer.js";
import { Container } from "../../components/basic.js";
import { Button } from "../../components/buttons.js";
import { Text } from "../../components/text.js";

export interface FiatProviderSelectionProps {
  client: ThirdwebClient;
  onProviderSelected: (provider: "coinbase" | "stripe" | "transak") => void;
}

export function FiatProviderSelection({
  client,
  onProviderSelected,
}: FiatProviderSelectionProps) {
  const theme = useCustomTheme();

  const providers = [
    {
      id: "coinbase" as const,
      name: "Coinbase",
      description: "Fast and secure payments",
      iconUri: "https://i.ibb.co/LDJ3Rk2t/Frame-5.png",
    },
    {
      id: "stripe" as const,
      name: "Stripe",
      description: "Trusted payment processing",
      iconUri: "https://i.ibb.co/CpgQC2Lf/images-3.png",
    },
    {
      id: "transak" as const,
      name: "Transak",
      description: "Global payment solution",
      iconUri: "https://i.ibb.co/Xx2r882p/Transak-official-symbol-1.png",
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
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: spacing.xs,
                  overflow: "hidden",
                }}
              >
                <Img
                  src={provider.iconUri}
                  alt={provider.name}
                  width={iconSize.md}
                  height={iconSize.md}
                  client={client}
                />
              </Container>
              <Container flex="column" gap="3xs" style={{ flex: 1 }}>
                <Text size="sm" color="primaryText" style={{ fontWeight: 600 }}>
                  {provider.name}
                </Text>
              </Container>
            </Container>
          </Button>
        ))}
      </Container>
    </>
  );
}
