"use client";
import { useMemo } from "react";
import type { ThirdwebClient } from "../../../../../client/client.js";
import type { SupportedFiatCurrency } from "../../../../../pay/convert/type.js";
import type { FiatProvider } from "../../../../../pay/utils/commonTypes.js";
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
import { Spinner } from "../../components/Spinner.js";
import { Text } from "../../components/text.js";

interface FiatProviderSelectionProps {
  client: ThirdwebClient;
  onProviderSelected: (provider: FiatProvider) => void;
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
  {
    description: "Buy crypto with cards & bank transfers",
    iconUri: "https://avatars.githubusercontent.com/u/35312605?s=200&v=4",
    id: "moonpay" as const,
    name: "MoonPay",
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

  const quotesByProvider = useMemo(() => {
    const map = new Map<FiatProvider, (typeof quoteQueries)[number]["data"]>();
    for (const q of quoteQueries) {
      if (q.data) {
        map.set(q.provider, q.data);
      }
    }
    return map;
  }, [quoteQueries]);

  const providersSorted = useMemo(() => {
    return [...PROVIDERS].sort((a, b) => {
      const aQuote = quotesByProvider.get(a.id);
      const bQuote = quotesByProvider.get(b.id);
      const aAmount = aQuote?.currencyAmount ?? Number.POSITIVE_INFINITY;
      const bAmount = bQuote?.currencyAmount ?? Number.POSITIVE_INFINITY;
      return aAmount - bAmount;
    });
  }, [quotesByProvider]);

  // TODO: add a "remember my choice" checkbox

  return (
    <Container
      flex="column"
      gap="xs"
      style={{
        flexGrow: 1,
      }}
    >
      {providersSorted.map((provider) => {
        const quote = quotesByProvider.get(provider.id);
        const query = quoteQueries.find((q) => q.provider === provider.id);
        const isLoading = query?.isLoading;
        const isError = query?.isError;

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
                {quote ? (
                  <>
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
                  </>
                ) : (
                  <>
                    <Container flex="row" gap="xs" style={{ alignItems: "center" }}>
                      {isLoading ? (
                        <Spinner color="secondaryText" size="sm" />
                      ) : null}
                      <Text
                        color="primaryText"
                        size="sm"
                        style={{ fontWeight: 500 }}
                      >
                        {isError ? "Quote unavailable" : "Get quote"}
                      </Text>
                    </Container>
                    <Text color="secondaryText" size="xs">
                      {isError
                        ? "Tap to try anyway"
                        : "Tap to continue"}
                    </Text>
                  </>
                )}
              </Container>
            </Container>
          </Button>
        );
      })}
    </Container>
  );
}
