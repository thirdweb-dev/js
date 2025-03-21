import { CheckCircledIcon } from "@radix-ui/react-icons";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import type { Chain } from "../../../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import type { BuyWithCryptoQuote } from "../../../../../../../pay/buyWithCrypto/getQuote.js";
import type { BuyWithCryptoStatus } from "../../../../../../../pay/buyWithCrypto/getStatus.js";
import { iconSize } from "../../../../../../core/design-system/index.js";
import { useBuyWithCryptoStatus } from "../../../../../../core/hooks/pay/useBuyWithCryptoStatus.js";
import { invalidateWalletBalance } from "../../../../../../core/providers/invalidateWalletBalance.js";
import { Spacer } from "../../../../components/Spacer.js";
import { Spinner } from "../../../../components/Spinner.js";
import { Container, ModalHeader } from "../../../../components/basic.js";
import { Button } from "../../../../components/buttons.js";
import { Text } from "../../../../components/text.js";
import { AccentFailIcon } from "../../../icons/AccentFailIcon.js";
import { SwapTxDetailsTable } from "../pay-transactions/SwapDetailsScreen.js";

type UIStatus = "pending" | "success" | "failed" | "partialSuccess";

export function SwapStatusScreen(props: {
  title: string;
  onBack?: () => void;
  swapTxHash: string;
  fromChain: Chain;
  client: ThirdwebClient;
  onTryAgain: () => void;
  onDone: () => void;
  transactionMode: boolean;
  isEmbed: boolean;
  quote: BuyWithCryptoQuote | undefined;
  onSuccess: ((status: BuyWithCryptoStatus) => void) | undefined;
}) {
  const { onSuccess } = props;
  const [showDetails, setShowDetails] = useState(false);

  const swapStatus = useBuyWithCryptoStatus({
    client: props.client,
    transactionHash: props.swapTxHash,
    chainId: props.fromChain.id,
  });

  let uiStatus: UIStatus = "pending";
  if (swapStatus.data?.status === "COMPLETED") {
    uiStatus = "success";
  } else if (swapStatus.data?.status === "FAILED") {
    uiStatus = "failed";
  }

  if (
    swapStatus.data?.status === "COMPLETED" &&
    swapStatus.data?.subStatus === "PARTIAL_SUCCESS"
  ) {
    uiStatus = "partialSuccess";
  }

  const purchaseCbCalled = useRef(false);
  useEffect(() => {
    if (purchaseCbCalled.current || !onSuccess) {
      return;
    }

    if (swapStatus.data?.status === "COMPLETED") {
      purchaseCbCalled.current = true;
      onSuccess(swapStatus.data);
    }
  }, [onSuccess, swapStatus]);

  const queryClient = useQueryClient();
  const balanceInvalidated = useRef(false);
  useEffect(() => {
    if (
      (uiStatus === "success" || uiStatus === "partialSuccess") &&
      !balanceInvalidated.current
    ) {
      balanceInvalidated.current = true;
      invalidateWalletBalance(queryClient);
    }
  }, [queryClient, uiStatus]);

  const swapDetails =
    swapStatus.data && swapStatus.data.status !== "NOT_FOUND" ? (
      <SwapTxDetailsTable
        status={swapStatus.data}
        type="status"
        client={props.client}
      />
    ) : props.quote ? (
      <SwapTxDetailsTable
        type="quote"
        quote={props.quote}
        client={props.client}
      />
    ) : null;

  if (showDetails) {
    return (
      <Container animate="fadein">
        <Container p="lg">
          <ModalHeader
            title={"Transaction Details"}
            onBack={() => setShowDetails(false)}
          />
          <Spacer y="xl" />
          {swapDetails}
        </Container>
      </Container>
    );
  }

  return (
    <Container animate="fadein">
      <Container p="lg">
        <ModalHeader title={props.title} onBack={props.onBack} />
        <Spacer y="sm" />

        {uiStatus === "success" && (
          <>
            <Spacer y="md" />
            <Container color="success" flex="column" center="x">
              <CheckCircledIcon
                width={iconSize["3xl"]}
                height={iconSize["3xl"]}
              />
              <Spacer y="sm" />
              <Text color="primaryText" size="lg">
                Buy Complete
              </Text>
            </Container>

            <Spacer y="xl" />
            <Button
              variant="outline"
              fullWidth
              onClick={() => setShowDetails(true)}
            >
              View transaction details
            </Button>
            <Spacer y="sm" />
            <Button variant="accent" fullWidth onClick={props.onDone}>
              {props.transactionMode ? "Continue Transaction" : "Done"}
            </Button>
          </>
        )}

        {uiStatus === "partialSuccess" &&
          swapStatus.data?.status !== "NOT_FOUND" &&
          swapStatus.data?.destination && (
            <>
              <Spacer y="lg" />
              <Container color="success" flex="column" center="x">
                <AccentFailIcon size={iconSize["3xl"]} />
                <Spacer y="xl" />
                <Text color="primaryText" size="lg">
                  Incomplete
                </Text>
                <Spacer y="sm" />
                <Text size="sm" color="danger">
                  Expected {swapStatus.data.quote.toToken.symbol}, Got{" "}
                  {swapStatus.data.destination.token.symbol} instead
                </Text>
              </Container>
              <Spacer y="xl" />
            </>
          )}

        {uiStatus === "failed" && (
          <>
            <Spacer y="xxl" />

            <Container flex="column">
              <Container flex="column" center="both">
                <AccentFailIcon size={iconSize["3xl"]} />
                <Spacer y="xl" />
                <Text color="primaryText" size="lg">
                  Transaction Failed
                </Text>

                <Spacer y="sm" />
                <Text size="sm">
                  Your transaction {`couldn't`} be processed
                </Text>
              </Container>

              <Spacer y="xl" />
              <Button
                variant="outline"
                fullWidth
                onClick={() => setShowDetails(true)}
              >
                View transaction details
              </Button>

              <Spacer y="sm" />

              <Button variant="accent" fullWidth onClick={props.onTryAgain}>
                Try Again
              </Button>
            </Container>
          </>
        )}

        {uiStatus === "pending" && (
          <>
            <Spacer y="xl" />
            <Container flex="column" animate="fadein" center="both">
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Spinner size="3xl" color="accentText" />
              </div>
              <Spacer y="lg" />
              <Text color="primaryText" size="lg">
                Buy Pending
              </Text>
              <Spacer y="sm" />
              <Text color="secondaryText" size="sm">
                This may take a minute to complete
              </Text>
            </Container>
            <Spacer y="xl" />
          </>
        )}
      </Container>
    </Container>
  );
}
