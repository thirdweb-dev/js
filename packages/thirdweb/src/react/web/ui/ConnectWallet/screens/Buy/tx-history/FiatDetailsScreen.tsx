import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { defineChain } from "../../../../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import type { BuyWithFiatStatus } from "../../../../../../../exports/pay.js";
import type { ValidBuyWithFiatStatus } from "../../../../../../../pay/buyWithFiat/getStatus.js";
import { formatNumber } from "../../../../../../../utils/formatNumber.js";
import { useChainQuery } from "../../../../../../core/hooks/others/useChainQuery.js";
import { Spacer } from "../../../../components/Spacer.js";
import { Container, Line, ModalHeader } from "../../../../components/basic.js";
import { ButtonLink } from "../../../../components/buttons.js";
import { Text } from "../../../../components/text.js";
import { fontSize, iconSize } from "../../../../design-system/index.js";
import { USDIcon } from "../../../icons/currencies/USDIcon.js";
import { type BuyWithFiatPartialQuote, FiatSteps } from "../fiat/FiatSteps.js";
import { PostOnRampSwap } from "../fiat/PostOnRampSwap.js";
import { TokenInfoRow } from "./TokenInfoRow.js";
import { type FiatStatusMeta, getBuyWithFiatStatusMeta } from "./statusMeta.js";

export function FiatDetailsScreen(props: {
  status: ValidBuyWithFiatStatus;
  onBack: () => void;
  client: ThirdwebClient;
  closeModal: () => void;
}) {
  const status = props.status;
  const statusMeta = getBuyWithFiatStatusMeta(status);

  const hasTwoSteps = isSwapRequiredAfterOnRamp(status);

  if (hasTwoSteps) {
    const fiatQuote = status.quote;
    return (
      <TwoStepFlow
        statusMeta={statusMeta}
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
        closeModal={props.closeModal}
      />
    );
  }

  return (
    <Container>
      <Container p="lg">
        <ModalHeader title="Transaction Details" onBack={props.onBack} />
      </Container>

      <Line />

      <Container p="lg">
        <FiatTxDetailsTable status={status} client={props.client} />
      </Container>
    </Container>
  );
}

export function FiatTxDetailsTable(props: {
  status: ValidBuyWithFiatStatus;
  client: ThirdwebClient;
  hideStatus?: boolean;
}) {
  const status = props.status;
  const statusMeta = getBuyWithFiatStatusMeta(status);

  const onRampChainQuery = useChainQuery(
    defineChain(status.quote.onRampToken.chainId),
  );

  const onrampTxHash = status.source?.transactionHash;

  const lineSpacer = (
    <>
      <Spacer y="md" />
      <Line />
      <Spacer y="md" />
    </>
  );

  return (
    <div>
      {/* Receive - to token */}
      <TokenInfoRow
        chainId={status.quote.toToken.chainId}
        client={props.client}
        label="Receive"
        tokenAmount={status.quote.estimatedToTokenAmount}
        tokenSymbol={status.quote.toToken.symbol || ""}
        tokenAddress={status.quote.toToken.tokenAddress}
      />

      {lineSpacer}

      {/* Pay */}
      <Container
        flex="row"
        style={{
          justifyContent: "space-between",
        }}
      >
        <Text>Pay</Text>
        <Container
          flex="column"
          gap="xxs"
          style={{
            alignItems: "flex-end",
          }}
        >
          <Container flex="row" gap="xs" center="y">
            {status.quote.fromCurrency.currencySymbol === "USD" && (
              <USDIcon size={iconSize.sm} />
            )}
            <Text color="primaryText">
              {formatNumber(Number(status.quote.fromCurrency.amount), 4)}{" "}
              {status.quote.fromCurrency.currencySymbol}
            </Text>
          </Container>
        </Container>
      </Container>

      {!props.hideStatus && (
        <>
          {lineSpacer}

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
        </>
      )}

      {lineSpacer}

      <Spacer y="md" />

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
          View on Explorer
          <ExternalLinkIcon width={iconSize.sm} height={iconSize.sm} />
        </ButtonLink>
      )}
    </div>
  );
}

// if the toToken is the same as the onRampToken, no swap is required
export function isSwapRequiredAfterOnRamp(
  buyWithFiatStatus: BuyWithFiatStatus,
) {
  if (buyWithFiatStatus.status === "NOT_FOUND") {
    return false;
  }

  const sameChain =
    buyWithFiatStatus.quote.toToken.chainId ===
    buyWithFiatStatus.quote.onRampToken.chainId;

  const sameToken =
    buyWithFiatStatus.quote.toToken.tokenAddress ===
    buyWithFiatStatus.quote.onRampToken.tokenAddress;

  return !(sameChain && sameToken);
}

function TwoStepFlow(props: {
  client: ThirdwebClient;
  onBack: () => void;
  quote: BuyWithFiatPartialQuote;
  buyWithFiatStatus: BuyWithFiatStatus;
  onViewPendingTx: () => void;
  onRampTxHash?: string;
  toTokenTxHash?: string;
  statusMeta: FiatStatusMeta;
  closeModal: () => void;
}) {
  const [screen, setScreen] = useState<"base" | "post-onramp">("base");

  if (screen === "post-onramp") {
    return (
      <PostOnRampSwap
        client={props.client}
        buyWithFiatStatus={props.buyWithFiatStatus}
        onBack={props.onBack}
        onViewPendingTx={props.onViewPendingTx}
        closeModal={props.closeModal}
      />
    );
  }

  return (
    <FiatSteps
      step={props.statusMeta.step}
      client={props.client}
      onBack={props.onBack}
      onContinue={() => {
        setScreen("post-onramp");
      }}
      partialQuote={props.quote}
      status={props.buyWithFiatStatus}
    />
  );
}
