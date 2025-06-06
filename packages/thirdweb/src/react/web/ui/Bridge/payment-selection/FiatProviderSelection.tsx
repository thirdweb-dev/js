"use client";
import { useMemo } from "react";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { checksumAddress } from "../../../../../utils/address.js";
import { toTokens } from "../../../../../utils/units.js";
import { useCustomTheme } from "../../../../core/design-system/CustomThemeProvider.js";
import {
  iconSize,
  radius,
  spacing,
} from "../../../../core/design-system/index.js";
import { useBuyWithFiatQuotesForProviders } from "../../../../core/hooks/pay/useBuyWithFiatQuotesForProviders.js";
import { Img } from "../../components/Img.js";
import { Spacer } from "../../components/Spacer.js";
import { Spinner } from "../../components/Spinner.js";
import { Container } from "../../components/basic.js";
import { Button } from "../../components/buttons.js";
import { Text } from "../../components/text.js";

export interface FiatProviderSelectionProps {
  client: ThirdwebClient;
  onProviderSelected: (provider: "coinbase" | "stripe" | "transak") => void;
  toChainId: number;
  toTokenAddress: string;
  toAddress: string;
  toAmount?: string;
}

const PROVIDERS = [
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

export function FiatProviderSelection({
  onProviderSelected,
  client,
  toChainId,
  toTokenAddress,
  toAddress,
  toAmount,
}: FiatProviderSelectionProps) {
  const theme = useCustomTheme();

  // Fetch quotes for all providers
  const quoteQueries = useBuyWithFiatQuotesForProviders({
    client,
    chainId: toChainId,
    tokenAddress: checksumAddress(toTokenAddress),
    receiver: checksumAddress(toAddress),
    amount: toAmount || "0",
    currency: "USD",
  });

  const quotes = useMemo(() => {
    return quoteQueries.map((q) => q.data).filter((q) => !!q);
  }, [quoteQueries]);

  // TODO: add a "remember my choice" checkbox

  return (
    <>
      <Container flex="column" gap="sm">
        {quotes.length > 0 ? (
          quotes
            .sort((a, b) => a.currencyAmount - b.currencyAmount)
            .map((quote, index) => {
              const provider = PROVIDERS.find(
                (p) => p.id === quote.intent.onramp,
              );
              if (!provider) {
                return null;
              }

              return (
                <Container
                  key={provider.id}
                  animate="fadein"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <Button
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
                      gap="sm"
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
                        <Text
                          size="md"
                          color="primaryText"
                          style={{ fontWeight: 600 }}
                        >
                          {provider.name}
                        </Text>
                      </Container>
                      <Container
                        flex="column"
                        gap="3xs"
                        style={{ alignItems: "flex-end" }}
                      >
                        <Text
                          size="sm"
                          color="primaryText"
                          style={{ fontWeight: 500 }}
                        >
                          $
                          {quote.currencyAmount.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{" "}
                          {quote.currency}
                        </Text>
                        <Text size="xs" color="secondaryText">
                          {toTokens(
                            quote.destinationAmount,
                            quote.destinationToken.decimals,
                          )}{" "}
                          {quote.destinationToken.symbol}
                        </Text>
                      </Container>
                    </Container>
                  </Button>
                </Container>
              );
            })
        ) : (
          <Container flex="column" center="both" style={{ minHeight: "120px" }}>
            <Spinner size="lg" color="secondaryText" />
            <Spacer y="sm" />
            <Text size="sm" color="secondaryText" center>
              Generating quotes...
            </Text>
          </Container>
        )}
      </Container>
    </>
  );
}
