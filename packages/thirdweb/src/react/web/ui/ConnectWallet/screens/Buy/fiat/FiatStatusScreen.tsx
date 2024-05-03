import { CheckCircledIcon } from "@radix-ui/react-icons";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import type {
  BuyWithFiatQuote,
  BuyWithFiatStatus,
} from "../../../../../../../exports/pay.js";
import { isMobile } from "../../../../../../../utils/web/isMobile.js";
import { useBuyWithFiatStatus } from "../../../../../../core/hooks/pay/useBuyWithFiatStatus.js";
import { invalidateWalletBalance } from "../../../../../../core/providers/invalidateWalletBalance.js";
import { Spacer } from "../../../../components/Spacer.js";
import { Spinner } from "../../../../components/Spinner.js";
import { StepBar } from "../../../../components/StepBar.js";
import { Container, ModalHeader } from "../../../../components/basic.js";
import { Button } from "../../../../components/buttons.js";
import { Text } from "../../../../components/text.js";
import { iconSize } from "../../../../design-system/index.js";
import { AccentFailIcon } from "../../../icons/AccentFailIcon.js";
import { FiatTxDetailsTable } from "./FiatTxDetailsTable.js";

type UIStatus = "loading" | "failed" | "completed" | "partialSuccess";

export function FiatStatusScreen(props: {
  client: ThirdwebClient;
  onBack: () => void;
  intentId: string;
  onViewPendingTx: () => void;
  hasTwoSteps: boolean;
  openedWindow: Window | null;
  quote: BuyWithFiatQuote;
  closeModal: () => void;
  onShowSwapFlow: (status: BuyWithFiatStatus) => void;
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

  // determine step
  let step = 1;
  if (
    statusQuery.data?.status === "CRYPTO_SWAP_FALLBACK" ||
    statusQuery.data?.status === "CRYPTO_SWAP_REQUIRED" ||
    statusQuery.data?.status === "CRYPTO_SWAP_FAILED" ||
    statusQuery.data?.status === "CRYPTO_SWAP_IN_PROGRESS"
  ) {
    step = 2;
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
          <StepBar steps={2} currentStep={step} />
          <Spacer y="sm" />
          <Text size="xs">
            Step {step} of 2 -
            {step === 2 ? (
              <>
                Converting {props.quote.onRampToken.token.symbol} to{" "}
                {props.quote.toToken.symbol}
              </>
            ) : (
              <>
                {" "}
                Buying {props.quote.onRampToken.token.symbol} with{" "}
                {props.quote.fromCurrencyWithFees.currencySymbol}
              </>
            )}
          </Text>
        </>
      )}

      <FiatStatusScreenUI
        uiStatus={uiStatus}
        closeModal={props.closeModal}
        fiatStatus={statusQuery.data}
        client={props.client}
      />
    </Container>
  );
}

function FiatStatusScreenUI(props: {
  uiStatus: UIStatus;
  fiatStatus?: BuyWithFiatStatus;
  closeModal: () => void;
  client: ThirdwebClient;
}) {
  return (
    <Container>
      <Spacer y="xl" />

      {props.uiStatus === "loading" && (
        <>
          <Spacer y="xxl" />

          <Container flex="row" center="x">
            <Spinner size="xxl" color="accentText" />
          </Container>
          <Spacer y="xl" />
          <Text color="primaryText" size="lg" center>
            Buy Pending
          </Text>
          <Spacer y="md" />
          {!isMobile() && <Text center>Complete the purchase in popup</Text>}
          <Spacer y="xl" />
          <Spacer y="xl" />
        </>
      )}

      {props.uiStatus === "failed" && (
        <>
          <Spacer y="xxl" />

          <Container flex="row" center="x">
            <AccentFailIcon size={iconSize["3xl"]} />
          </Container>
          <Spacer y="xl" />
          <Text color="primaryText" size="lg" center>
            Transaction Failed
          </Text>
          <Spacer y="xl" />
          <Spacer y="xl" />
        </>
      )}

      {props.uiStatus === "completed" && (
        <>
          <Container flex="row" center="x" color="success">
            <Spacer y="xl" />
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
              <FiatTxDetailsTable
                status={props.fiatStatus}
                client={props.client}
                hideStatus={true}
              />
              <Spacer y="sm" />
            </>
          )}
          <Button variant="accent" fullWidth onClick={props.closeModal}>
            Done
          </Button>
        </>
      )}
    </Container>
  );
}
