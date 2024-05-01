import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { defineChain } from "../../../../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import type { BuyWithFiatStatus } from "../../../../../../../exports/pay.js";
import type { ValidBuyWithFiatStatus } from "../../../../../../../pay/buyWithFiat/getStatus.js";
import { formatNumber } from "../../../../../../../utils/formatNumber.js";
import { useChainQuery } from "../../../../../../core/hooks/others/useChainQuery.js";
import { ChainIcon } from "../../../../components/ChainIcon.js";
import { Spacer } from "../../../../components/Spacer.js";
import { Container, Line, ModalHeader } from "../../../../components/basic.js";
import { Button } from "../../../../components/buttons.js";
import { Text } from "../../../../components/text.js";
import { fontSize, iconSize } from "../../../../design-system/index.js";
import { type BuyWithFiatPartialQuote, FiatSteps } from "../fiat/FiatSteps.js";
import { PostOnRampSwap } from "../fiat/PostOnRampSwap.js";
import { getBuyWithFiatStatusMeta } from "./statusMeta.js";

export function FiatDetailsScreen(props: {
  status: ValidBuyWithFiatStatus;
  onBack: () => void;
  client: ThirdwebClient;
}) {
  const status = props.status;

  const toChainQuery = useChainQuery(defineChain(status.quote.toToken.chainId));
  const onRampChainQuery = useChainQuery(
    defineChain(status.quote.onRampToken.chainId),
  );

  const onrampTxHash = status.source?.transactionHash;
  const destinationTxHash = status.destination?.transactionHash;

  const statusMeta = getBuyWithFiatStatusMeta(status);
  const [screen, setScreen] = useState<"base" | "postonramp-swap">("base");

  if (screen === "postonramp-swap") {
    const fiatQuote = status.quote;
    return (
      <PostOnRampFlow
        client={props.client}
        buyWithFiatStatus={status}
        onBack={props.onBack}
        onViewPendingTx={props.onBack}
        quote={{
          fromCurrencyAmount: fiatQuote.fromCurrency.amount,
          fromCurrencySymbol: fiatQuote.fromCurrency.currencySymbol,
          onRampTokenAmount: fiatQuote.estimatedOnRampAmount,
          toTokenAmount: fiatQuote.estimatedToTokenAmount,
          onRampToken: {
            chainId: fiatQuote.onRampToken.chainId,
            tokenAddress: fiatQuote.onRampToken.tokenAddress,
            name: fiatQuote.onRampToken.name,
            symbol: fiatQuote.onRampToken.symbol,
          },
          toToken: {
            chainId: fiatQuote.toToken.chainId,
            tokenAddress: fiatQuote.toToken.tokenAddress,
            name: fiatQuote.toToken.name,
            symbol: fiatQuote.toToken.symbol,
          },
        }}
      />
    );
  }

  const toTokenValue = status.quote.estimatedToTokenAmount;
  const toTokenSymbol = status.quote.toToken.symbol;

  const actionRequired =
    status.status === "CRYPTO_SWAP_REQUIRED" ||
    status.status === "PAYMENT_FAILED";

  return (
    <Container>
      <Container p="lg">
        <ModalHeader title="Transaction Details" onBack={props.onBack} />
      </Container>

      <Line />

      <Container p="lg">
        {/* Buy */}
        <Container
          flex="row"
          center="y"
          style={{
            justifyContent: "space-between",
          }}
        >
          <Text>Buy</Text>
          <Container flex="row" gap="xs" center="y">
            <ChainIcon
              chain={toChainQuery.data}
              size={iconSize.md}
              client={props.client}
            />
            <Text color="primaryText">
              {formatNumber(Number(toTokenValue), 4)} {toTokenSymbol}
            </Text>
          </Container>
        </Container>

        <Spacer y="md" />
        <Line />
        <Spacer y="md" />

        {/* Status */}
        <Container
          flex="row"
          center="y"
          style={{
            justifyContent: "space-between",
          }}
        >
          <Text>Status</Text>
          <Container flex="row" gap="xs" center="y">
            <Text color={statusMeta.color}>{statusMeta.status}</Text>
          </Container>
        </Container>

        <Spacer y="md" />
        <Line />
        <Spacer y="md" />

        <Spacer y="xl" />

        {actionRequired && (
          <>
            <Button
              fullWidth
              variant="accent"
              onClick={() => {
                setScreen("postonramp-swap");
              }}
            >
              Complete Transaction
            </Button>
            <Spacer y="sm" />
          </>
        )}

        {onrampTxHash && onRampChainQuery.data?.explorers?.[0]?.url && (
          <ButtonLink
            fullWidth
            variant="outline"
            href={`${
              onRampChainQuery.data.explorers[0].url || ""
            }/tx/${onrampTxHash}`}
            target="_blank"
            gap="xs"
            style={{
              fontSize: fontSize.sm,
            }}
          >
            View on {onRampChainQuery.data.name} Explorer
            <ExternalLinkIcon width={iconSize.sm} height={iconSize.sm} />
          </ButtonLink>
        )}

        {destinationTxHash && toChainQuery.data?.explorers?.[0]?.url && (
          <ButtonLink
            fullWidth
            variant="outline"
            href={`${
              toChainQuery.data.explorers[0].url || ""
            }/tx/${destinationTxHash}`}
            target="_blank"
            gap="xs"
            style={{
              fontSize: fontSize.sm,
            }}
          >
            View on {toChainQuery.data.name} Explorer
            <ExternalLinkIcon width={iconSize.sm} height={iconSize.sm} />
          </ButtonLink>
        )}
      </Container>
    </Container>
  );
}

function PostOnRampFlow(props: {
  client: ThirdwebClient;
  onBack: () => void;
  quote: BuyWithFiatPartialQuote;
  buyWithFiatStatus: BuyWithFiatStatus;
  onViewPendingTx: () => void;
}) {
  const [screen, setScreen] = useState<"step-2" | "post-onramp">("step-2");

  if (screen === "step-2") {
    return (
      <FiatSteps
        step={2}
        client={props.client}
        onBack={props.onBack}
        onContinue={() => {
          setScreen("post-onramp");
        }}
        partialQuote={props.quote}
      />
    );
  }

  return (
    <PostOnRampSwap
      client={props.client}
      buyWithFiatStatus={props.buyWithFiatStatus}
      onBack={props.onBack}
      onViewPendingTx={props.onViewPendingTx}
    />
  );
}

const ButtonLink = /* @__PURE__ */ (() => Button.withComponent("a"))();
