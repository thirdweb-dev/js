import { CheckCircledIcon } from "@radix-ui/react-icons";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import type { BuyWithFiatQuote } from "../../../../../../../exports/pay.js";
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
import { FiatSteps, fiatQuoteToPartialQuote } from "./FiatSteps.js";
import { PostOnRampSwap } from "./PostOnRampSwap.js";

export function FiatStatusScreen(props: {
  client: ThirdwebClient;
  onBack: () => void;
  intentId: string;
  onViewPendingTx: () => void;
  hasTwoSteps: boolean;
  openedWindow: Window | null;
  quote: BuyWithFiatQuote;
}) {
  const { openedWindow } = props;
  const statusQuery = useBuyWithFiatStatus({
    intentId: props.intentId,
    client: props.client,
  });

  const isFailed =
    statusQuery.data?.status === "ON_RAMP_TRANSFER_FAILED" ||
    statusQuery.data?.status === "PAYMENT_FAILED";

  // if no swap required - show success screen
  const isCompleted = statusQuery.data?.status === "ON_RAMP_TRANSFER_COMPLETED";

  const queryClient = useQueryClient();
  const isLoading = statusQuery.isLoading || (!isFailed && !isCompleted);

  // use state instead of directly using statusQuery.data to ensure if status changes it does not unmount the component
  const [showPostOnRampSwap, setShowPostOnRampSwap] = useState(false);

  const [showStep2, setShowStep2] = useState(false);

  const isStep2 =
    statusQuery.data?.status === "CRYPTO_SWAP_REQUIRED" ||
    statusQuery.data?.status === "CRYPTO_SWAP_FAILED" ||
    statusQuery.data?.status === "CRYPTO_SWAP_IN_PROGRESS";

  useEffect(() => {
    if (!openedWindow || !statusQuery.data) {
      return;
    }

    if (
      statusQuery.data.status === "CRYPTO_SWAP_REQUIRED" ||
      statusQuery.data.status === "ON_RAMP_TRANSFER_COMPLETED"
    ) {
      openedWindow.close();
    }
  }, [statusQuery.data, openedWindow]);

  const invalidatedBalance = useRef(false);
  useEffect(() => {
    if (
      !invalidatedBalance.current &&
      statusQuery.data &&
      statusQuery.data.status === "ON_RAMP_TRANSFER_COMPLETED"
    ) {
      invalidatedBalance.current = true;
      invalidateWalletBalance(queryClient);
    }
  }, [statusQuery.data, queryClient]);

  useEffect(() => {
    if (
      statusQuery.data &&
      statusQuery.data.status === "CRYPTO_SWAP_REQUIRED"
    ) {
      setShowStep2(true);
    }
  }, [statusQuery.data]);

  if (showPostOnRampSwap && statusQuery.data) {
    return (
      <PostOnRampSwap
        buyWithFiatStatus={statusQuery.data}
        client={props.client}
        onBack={props.onBack}
        onViewPendingTx={props.onViewPendingTx}
      />
    );
  }

  if (showStep2) {
    return (
      <FiatSteps
        client={props.client}
        onBack={props.onBack}
        partialQuote={fiatQuoteToPartialQuote(props.quote)}
        step={2}
        onContinue={() => {
          setShowStep2(false);
          setShowPostOnRampSwap(true);
        }}
      />
    );
  }

  return (
    <Container p="lg">
      <ModalHeader title="Buy" onBack={props.onBack} />

      {props.hasTwoSteps && (
        <>
          <Spacer y="lg" />
          <StepBar steps={2} currentStep={isStep2 ? 2 : 1} />
          <Spacer y="xs" />
          <Text size="xs">
            Step {isStep2 ? 2 : 1} of 2 -
            {isStep2 ? (
              <>
                Converting {props.quote.onRampToken.token.symbol} to{" "}
                {props.quote.toToken.symbol}
              </>
            ) : (
              <>
                {" "}
                Buying {props.quote.onRampToken.token.symbol} with{" "}
                {props.quote.fromCurrency.currencySymbol}
              </>
            )}
          </Text>
        </>
      )}

      <Spacer y="xl" />
      <Spacer y="xl" />

      {isLoading && (
        <>
          <Container flex="row" center="x">
            <Spinner size="xxl" color="accentText" />
          </Container>
          <Spacer y="xl" />
          <Text color="primaryText" size="lg" center>
            Buy Pending
          </Text>
          <Spacer y="md" />
          {!isMobile() && <Text center>Complete the purchase in popup</Text>}
        </>
      )}

      {isFailed && (
        <>
          <Container flex="row" center="x">
            <AccentFailIcon size={iconSize["3xl"]} />
          </Container>
          <Spacer y="xl" />
          <Text color="primaryText" size="lg" center>
            Transaction Failed
          </Text>
        </>
      )}

      {isCompleted && (
        <>
          <Container flex="row" center="x" color="success">
            <CheckCircledIcon
              width={iconSize["3xl"]}
              height={iconSize["3xl"]}
            />
          </Container>
          <Spacer y="xl" />
          <Text color="primaryText" size="lg" center>
            Buy Complete
          </Text>
          <Spacer y="xxl" />
          <Button variant="accent" fullWidth onClick={props.onBack}>
            Done
          </Button>
        </>
      )}

      {!isCompleted && (
        <>
          <Spacer y="lg" />
          <Spacer y="xl" />
        </>
      )}
    </Container>
  );
}
