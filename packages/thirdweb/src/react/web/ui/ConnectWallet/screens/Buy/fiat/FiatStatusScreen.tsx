import { CheckCircledIcon } from "@radix-ui/react-icons";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import type { BuyWithFiatQuote } from "../../../../../../../pay/buyWithFiat/getQuote.js";
import type {
  BuyWithFiatStatus,
  ValidBuyWithFiatStatus,
} from "../../../../../../../pay/buyWithFiat/getStatus.js";
import { isMobile } from "../../../../../../../utils/web/isMobile.js";
import { iconSize } from "../../../../../../core/design-system/index.js";
import { useBuyWithFiatStatus } from "../../../../../../core/hooks/pay/useBuyWithFiatStatus.js";
import { invalidateWalletBalance } from "../../../../../../core/providers/invalidateWalletBalance.js";
import { Spacer } from "../../../../components/Spacer.js";
import { Spinner } from "../../../../components/Spinner.js";
import { StepBar } from "../../../../components/StepBar.js";
import { Container, ModalHeader } from "../../../../components/basic.js";
import { Button } from "../../../../components/buttons.js";
import { Text } from "../../../../components/text.js";
import { AccentFailIcon } from "../../../icons/AccentFailIcon.js";
import { getBuyWithFiatStatusMeta } from "../tx-history/statusMeta.js";
import { OnRampTxDetailsTable } from "./FiatTxDetailsTable.js";

type UIStatus = "loading" | "failed" | "completed" | "partialSuccess";

/**
 * Poll for "Buy with Fiat" status - when the on-ramp is in progress
 * - Show success screen if swap is not required and on-ramp is completed
 * - Show Failed screen if on-ramp failed
 * - call `onShowSwapFlow` if on-ramp is completed and swap is required
 */
export function OnrampStatusScreen(props: {
  client: ThirdwebClient;
  onBack: () => void;
  intentId: string;
  onViewPendingTx: () => void;
  hasTwoSteps: boolean;
  openedWindow: Window | null;
  quote: BuyWithFiatQuote;
  onDone: () => void;
  onShowSwapFlow: (status: BuyWithFiatStatus) => void;
  isBuyForTx: boolean;
  isEmbed: boolean;
}) {
  const queryClient = useQueryClient();
  const { openedWindow } = props;
  const statusQuery = useBuyWithFiatStatus({
    intentId: props.intentId,
    client: props.client,
  });

  // determine UI status
  let uiStatus: UIStatus = "loading";
  if (
    statusQuery.data?.status === "ON_RAMP_TRANSFER_FAILED" ||
    statusQuery.data?.status === "PAYMENT_FAILED"
  ) {
    uiStatus = "failed";
  } else if (statusQuery.data?.status === "CRYPTO_SWAP_FALLBACK") {
    uiStatus = "partialSuccess";
  } else if (statusQuery.data?.status === "ON_RAMP_TRANSFER_COMPLETED") {
    uiStatus = "completed";
  }

  // close the onramp popup if onramp is completed
  useEffect(() => {
    if (!openedWindow || !statusQuery.data) {
      return;
    }

    if (
      statusQuery.data?.status === "CRYPTO_SWAP_REQUIRED" ||
      statusQuery.data?.status === "ON_RAMP_TRANSFER_COMPLETED"
    ) {
      openedWindow.close();
    }
  }, [statusQuery.data, openedWindow]);

  // invalidate wallet balance when onramp is completed
  const invalidatedBalance = useRef(false);
  useEffect(() => {
    if (
      !invalidatedBalance.current &&
      statusQuery.data?.status === "ON_RAMP_TRANSFER_COMPLETED"
    ) {
      invalidatedBalance.current = true;
      invalidateWalletBalance(queryClient);
    }
  }, [statusQuery.data, queryClient]);

  // show swap flow
  useEffect(() => {
    if (statusQuery.data?.status === "CRYPTO_SWAP_REQUIRED") {
      props.onShowSwapFlow(statusQuery.data);
    }
  }, [statusQuery.data, props.onShowSwapFlow]);

  return (
    <Container p="lg">
      <ModalHeader title="Buy" onBack={props.onBack} />

      {props.hasTwoSteps && (
        <>
          <Spacer y="lg" />
          <StepBar steps={2} currentStep={1} />
          <Spacer y="sm" />
          <Text size="xs">
            Step 1 of 2 - Buying {props.quote.onRampToken.token.symbol} with{" "}
            {props.quote.fromCurrencyWithFees.currencySymbol}
          </Text>
        </>
      )}

      <OnrampStatusScreenUI
        uiStatus={uiStatus}
        onDone={props.onDone}
        fiatStatus={statusQuery.data}
        client={props.client}
        isBuyForTx={props.isBuyForTx}
        quote={props.quote}
        isEmbed={props.isEmbed}
      />
    </Container>
  );
}

function OnrampStatusScreenUI(props: {
  uiStatus: UIStatus;
  fiatStatus?: BuyWithFiatStatus;
  onDone: () => void;
  client: ThirdwebClient;
  isBuyForTx: boolean;
  isEmbed: boolean;
  quote: BuyWithFiatQuote;
}) {
  const { uiStatus } = props;

  const statusMeta = props.fiatStatus
    ? getBuyWithFiatStatusMeta(props.fiatStatus)
    : undefined;

  const fiatStatus: ValidBuyWithFiatStatus | undefined =
    props.fiatStatus && props.fiatStatus.status !== "NOT_FOUND"
      ? props.fiatStatus
      : undefined;

  const onRampTokenQuote = props.quote.onRampToken;

  const txDetails = (
    <OnRampTxDetailsTable
      client={props.client}
      token={
        fiatStatus?.source // source tx is onRamp token
          ? {
              chainId: fiatStatus.source.token.chainId,
              address: fiatStatus.source.token.tokenAddress,
              symbol: fiatStatus.source.token.symbol || "",
              amount: fiatStatus.source.amount,
            }
          : {
              chainId: onRampTokenQuote.token.chainId,
              address: onRampTokenQuote.token.tokenAddress,
              symbol: onRampTokenQuote.token.symbol,
              amount: onRampTokenQuote.amount,
            }
      }
      fiat={{
        amount: props.quote.fromCurrencyWithFees.amount,
        currencySymbol: props.quote.fromCurrencyWithFees.currencySymbol,
      }}
      statusMeta={
        fiatStatus?.source && statusMeta
          ? {
              color: statusMeta?.color,
              text: statusMeta?.status,
              txHash: fiatStatus.source.transactionHash,
            }
          : undefined
      }
    />
  );

  return (
    <Container>
      <Spacer y="xl" />

      {uiStatus === "loading" && (
        <>
          <Spacer y="md" />
          <Container flex="row" center="x">
            <Spinner size="3xl" color="accentText" />
          </Container>
          <Spacer y="md" />
          <Text color="primaryText" size="lg" center>
            Buy Pending
          </Text>
          <Spacer y="sm" />
          {!isMobile() && <Text center>Complete the purchase in popup</Text>}
          <Spacer y="xxl" />
          {txDetails}
        </>
      )}

      {uiStatus === "failed" && (
        <>
          <Spacer y="md" />
          <Container flex="row" center="x">
            <AccentFailIcon size={iconSize["3xl"]} />
          </Container>
          <Spacer y="lg" />
          <Text color="primaryText" size="lg" center>
            Transaction Failed
          </Text>
          <Spacer y="xxl" />
          {txDetails}
        </>
      )}

      {uiStatus === "completed" && (
        <>
          <Spacer y="md" />
          <Container flex="row" center="x" color="success">
            <CheckCircledIcon
              width={iconSize["3xl"]}
              height={iconSize["3xl"]}
            />
          </Container>
          <Spacer y="md" />
          <Text color="primaryText" size="lg" center>
            Buy Complete
          </Text>
          {props.fiatStatus && props.fiatStatus.status !== "NOT_FOUND" && (
            <>
              <Spacer y="xxl" />
              {txDetails}
              <Spacer y="sm" />
            </>
          )}

          {!props.isEmbed && (
            <Button variant="accent" fullWidth onClick={props.onDone}>
              {props.isBuyForTx ? "Continue Transaction" : "Done"}
            </Button>
          )}
        </>
      )}
    </Container>
  );
}
