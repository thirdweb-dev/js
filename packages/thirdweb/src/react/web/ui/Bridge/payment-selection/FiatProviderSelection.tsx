"use client";
import { useMemo } from "react";
import type { ThirdwebClient } from "../../../../../client/client.js";
import type { SupportedFiatCurrency } from "../../../../../pay/convert/type.js";
import { checksumAddress } from "../../../../../utils/address.js";
import { formatNumber } from "../../../../../utils/formatNumber.js";
import { toTokens } from "../../../../../utils/units.js";
import {
  iconSize,
  radius,
  spacing,
} from "../../../../core/design-system/index.js";
import { useBuyWithFiatQuotesForProviders } from "../../../../core/hooks/pay/useBuyWithFiatQuotesForProviders.js";
import { formatCurrencyAmount } from "../../ConnectWallet/screens/formatTokenBalance.js";
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
  country: string | undefined;
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
  country,
}: FiatProviderSelectionProps) {
  // Fetch quotes for all providers
  const quoteQueries = useBuyWithFiatQuotesForProviders({
    amount: toAmount || "0",
    chainId: toChainId,
    client,
    currency: currency || "USD",
    receiver: checksumAddress(toAddress),
    tokenAddress: checksumAddress(toTokenAddress),
    country,
  });

  const quotes = useMemo(() => {
    return quoteQueries.map((q) => q.data).filter((q) => !!q);
  }, [quoteQueries]);

  const isPending = quoteQueries.some((q) => q.isLoading);

  if (quoteQueries.every((q) => q.isError)) {
    return (
      <Container
        center="both"
        flex="column"
        style={{ minHeight: "200px", flexGrow: 1 }}
      >
        <Text color="secondaryText" size="sm">
          No quotes available
        </Text>
      </Container>
    );
  }

  // TODO: add a "remember my choice" checkbox

  return (
    <Container
      flex="column"
      gap="xs"
      style={{
        flexGrow: 1,
      }}
    >
      {!isPending ? (
        quotes
          .sort((a, b) => a.currencyAmount - b.currencyAmount)
          .map((quote) => {
            const provider = PROVIDERS.find(
              (p) => p.id === quote.intent.onramp,
            );
            if (!provider) {
              return null;
            }

            return (
              <Button
                key={provider.id}
                fullWidth
                onClick={() => onProviderSelected(provider.id)}
                style={{
                  borderRadius: radius.lg,
                  textAlign: "left",
                  padding: `${spacing.md}`,
                }}
                variant="secondary"
              >
                <Container
                  flex="row"
                  gap="sm"
                  style={{ alignItems: "center", width: "100%" }}
                >
                  <Img
                    alt={provider.name}
                    client={client}
                    height={iconSize.lg}
                    src={provider.iconUri}
                    width={iconSize.lg}
                    style={{
                      borderRadius: radius.full,
                    }}
                  />
                  <Container flex="column" gap="3xs" style={{ flex: 1 }}>
                    <Text color="primaryText" size="md" weight={500}>
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
                      {formatCurrencyAmount(
                        currency || "USD",
                        quote.currencyAmount,
                      )}
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
            );
          })
      ) : (
        <Container
          center="both"
          flex="column"
          style={{ flexGrow: 1, paddingBottom: spacing.lg }}
          px="md"
        >
          <Spinner color="secondaryText" size="xl" />
          <Spacer y="lg" />
          <Text center color="primaryText" size="lg" weight={600} trackingTight>
            Searching Providers
          </Text>
          <Spacer y="xs" />
          <Text
            center
            color="secondaryText"
            size="sm"
            multiline
            style={{
              textWrap: "pretty",
            }}
          >
            Searching for the best providers for this payment
          </Text>
        </Container>
      )}
    </Container>
  );
}
