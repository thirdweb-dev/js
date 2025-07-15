"use client";
import { useMemo } from "react";
import type { ThirdwebClient } from "../../../../../client/client.js";
import type { SupportedFiatCurrency } from "../../../../../pay/convert/type.js";
import { checksumAddress } from "../../../../../utils/address.js";
import { formatNumber } from "../../../../../utils/formatNumber.js";
import { toTokens } from "../../../../../utils/units.js";
import { useCustomTheme } from "../../../../core/design-system/CustomThemeProvider.js";
import {
  iconSize,
  radius,
  spacing,
} from "../../../../core/design-system/index.js";
import { useBuyWithFiatQuotesForProviders } from "../../../../core/hooks/pay/useBuyWithFiatQuotesForProviders.js";
import { Container } from "../../components/basic.js";
import { Button } from "../../components/buttons.js";
import { Img } from "../../components/Img.js";
import { Spacer } from "../../components/Spacer.js";
import { Spinner } from "../../components/Spinner.js";
import { Text } from "../../components/text.js";

interface FiatProviderSelectionProps {
  client: ThirdwebClient;
  onProviderSelected: (provider: "coinbase" | "stripe" | "transak") => void;
  toChainId: number;
  toTokenAddress: string;
  toAddress: string;
  toAmount?: string;
  currency?: SupportedFiatCurrency;
}

const PROVIDERS = [
  {
    description: "Fast and secure payments",
    iconUri: "https://i.ibb.co/LDJ3Rk2t/Frame-5.png",
    id: "coinbase" as const,
    name: "Coinbase",
  },
  {
    description: "Trusted payment processing",
    iconUri: "https://i.ibb.co/CpgQC2Lf/images-3.png",
    id: "stripe" as const,
    name: "Stripe",
  },
  {
    description: "Global payment solution",
    iconUri: "https://i.ibb.co/Xx2r882p/Transak-official-symbol-1.png",
    id: "transak" as const,
    name: "Transak",
  },
];

export function FiatProviderSelection({
  onProviderSelected,
  client,
  toChainId,
  toTokenAddress,
  toAddress,
  toAmount,
  currency,
}: FiatProviderSelectionProps) {
  const theme = useCustomTheme();

  // Fetch quotes for all providers
  const quoteQueries = useBuyWithFiatQuotesForProviders({
    amount: toAmount || "0",
    chainId: toChainId,
    client,
    currency: currency || "USD",
    receiver: checksumAddress(toAddress),
    tokenAddress: checksumAddress(toTokenAddress),
  });

  const quotes = useMemo(() => {
    return quoteQueries.map((q) => q.data).filter((q) => !!q);
  }, [quoteQueries]);

  if (quoteQueries.every((q) => q.isError)) {
    return (
      <Container center="both" flex="column" style={{ minHeight: "120px" }}>
        <Text color="secondaryText" size="sm">
          No quotes available
        </Text>
      </Container>
    );
  }

  // TODO: add a "remember my choice" checkbox

  return (
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
                animate="fadein"
                key={provider.id}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <Button
                  fullWidth
                  onClick={() => onProviderSelected(provider.id)}
                  style={{
                    backgroundColor: theme.colors.tertiaryBg,
                    border: `1px solid ${theme.colors.borderColor}`,
                    borderRadius: radius.md,
                    padding: `${spacing.sm} ${spacing.md}`,
                    textAlign: "left",
                  }}
                  variant="secondary"
                >
                  <Container
                    flex="row"
                    gap="sm"
                    style={{ alignItems: "center", width: "100%" }}
                  >
                    <Container
                      style={{
                        alignItems: "center",
                        borderRadius: "50%",
                        display: "flex",
                        height: `${iconSize.md}px`,
                        justifyContent: "center",
                        overflow: "hidden",
                        padding: spacing.xs,
                        width: `${iconSize.md}px`,
                      }}
                    >
                      <Img
                        alt={provider.name}
                        client={client}
                        height={iconSize.md}
                        src={provider.iconUri}
                        width={iconSize.md}
                      />
                    </Container>
                    <Container flex="column" gap="3xs" style={{ flex: 1 }}>
                      <Text
                        color="primaryText"
                        size="md"
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
                        color="primaryText"
                        size="sm"
                        style={{ fontWeight: 500 }}
                      >
                        $
                        {quote.currencyAmount.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}{" "}
                        {quote.currency}
                      </Text>
                      <Text color="secondaryText" size="xs">
                        {formatNumber(
                          Number(
                            toTokens(
                              quote.destinationAmount,
                              quote.destinationToken.decimals,
                            ),
                          ),
                          4,
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
        <Container center="both" flex="column" style={{ minHeight: "120px" }}>
          <Spinner color="secondaryText" size="lg" />
          <Spacer y="sm" />
          <Text center color="secondaryText" size="sm">
            Generating quotes...
          </Text>
        </Container>
      )}
    </Container>
  );
}
