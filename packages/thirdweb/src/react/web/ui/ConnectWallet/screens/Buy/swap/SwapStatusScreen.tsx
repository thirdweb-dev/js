import { CheckCircledIcon, ExternalLinkIcon } from "@radix-ui/react-icons";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import type { Chain } from "../../../../../../../chains/types.js";
import { defineChain } from "../../../../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import { useChainQuery } from "../../../../../../core/hooks/others/useChainQuery.js";
import {
  type BuyWithCryptoStatusQueryParams,
  useBuyWithCryptoStatus,
} from "../../../../../../core/hooks/pay/useBuyWithCryptoStatus.js";
import { invalidateWalletBalance } from "../../../../../../core/providers/invalidateWalletBalance.js";
import { Spacer } from "../../../../components/Spacer.js";
import { Spinner } from "../../../../components/Spinner.js";
import { TokenIcon } from "../../../../components/TokenIcon.js";
import { Container, ModalHeader } from "../../../../components/basic.js";
import { Button, ButtonLink } from "../../../../components/buttons.js";
import { Text } from "../../../../components/text.js";
import { iconSize } from "../../../../design-system/index.js";
import { AccentFailIcon } from "../../../icons/AccentFailIcon.js";
import type { ERC20OrNativeToken } from "../../nativeToken.js";
import { SwapTxDetailsTable } from "../tx-history/SwapDetailsScreen.js";

type UIStatus = "pending" | "success" | "failed" | "partialSuccess";

export function SwapStatusScreen(props: {
  onBack: () => void;
  onViewPendingTx: () => void;
  swapTx: BuyWithCryptoStatusQueryParams;
  destinationToken: ERC20OrNativeToken;
  destinationChain: Chain;
  sourceAmount: string;
  destinationAmount: string;
  client: ThirdwebClient;
  onTryAgain: () => void;
  closeModal: () => void;
}) {
  const swapStatus = useBuyWithCryptoStatus(props.swapTx);
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

  console.log("swapStatus", swapStatus.data);

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

  const sourceChainQuery = useChainQuery(
    swapStatus.data?.status !== "NOT_FOUND" &&
      swapStatus.data?.source?.token.chainId
      ? defineChain(swapStatus.data?.source?.token.chainId)
      : undefined,
  );

  return (
    <Container animate="fadein">
      <Container p="lg">
        <ModalHeader title="Buy" onBack={props.onBack} />
        <Spacer y="sm" />

        {uiStatus === "success" && (
          <>
            <Spacer y="lg" />

            <Container color="success" flex="column" center="x">
              <CheckCircledIcon
                width={iconSize["3xl"]}
                height={iconSize["3xl"]}
              />
              <Spacer y="lg" />
              <Text color={"primaryText"} size="lg">
                Buy Success
              </Text>
            </Container>

            {swapStatus.data && swapStatus.data.status !== "NOT_FOUND" && (
              <>
                <Spacer y="xl" />
                <SwapTxDetailsTable
                  swapStatus={swapStatus.data}
                  client={props.client}
                  hideStatus={true}
                />
                <Spacer y="sm" />
                <Button variant="accent" fullWidth onClick={props.closeModal}>
                  Done
                </Button>
              </>
            )}
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
                <Text color={"primaryText"} size="lg">
                  Incomplete
                </Text>
                <Spacer y="sm" />
                <Text size="sm" color="danger">
                  Expected {swapStatus.data.quote.toToken.symbol}, Got{" "}
                  {swapStatus.data.destination.token.symbol} instead
                </Text>
              </Container>

              <Spacer y="xl" />

              <SwapTxDetailsTable
                swapStatus={swapStatus.data}
                client={props.client}
                hideStatus={true}
              />
              <Spacer y="sm" />
              <Button variant="accent" fullWidth onClick={props.closeModal}>
                Done
              </Button>
            </>
          )}

        {uiStatus === "failed" && (
          <>
            <Spacer y="xxl" />

            <Container flex="column" center="both">
              <AccentFailIcon size={iconSize["3xl"]} />
              <Spacer y="xl" />
              <Text color={"primaryText"} size="lg">
                Transaction Failed
              </Text>

              <Spacer y="sm" />
              <Text size="sm">Your transaction {`couldn't`} be processed</Text>
              <Spacer y="xxl" />

              {swapStatus.data?.status === "FAILED" &&
                swapStatus.data.subStatus === "REVERTED_ON_CHAIN" &&
                swapStatus.data.source?.transactionHash &&
                sourceChainQuery.data &&
                sourceChainQuery.data.explorers?.[0]?.url && (
                  <>
                    <ButtonLink
                      fullWidth
                      variant="outline"
                      href={`${sourceChainQuery.data.explorers[0].url}/tx/${swapStatus.data.source.transactionHash}`}
                      target="_blank"
                      gap="xs"
                    >
                      View on Explorer{" "}
                      <ExternalLinkIcon
                        width={iconSize.sm}
                        height={iconSize.sm}
                      />
                    </ButtonLink>
                    <Spacer y="sm" />
                  </>
                )}
              <Button variant="accent" fullWidth onClick={props.onTryAgain}>
                Try Again
              </Button>
            </Container>
          </>
        )}

        {uiStatus === "pending" && (
          <>
            <Spacer y="3xl" />

            <Container flex="column" animate="fadein" center="both">
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Spinner size="4xl" color="accentText" />
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <TokenIcon
                    chain={props.destinationChain}
                    token={props.destinationToken}
                    size="xxl"
                    client={props.client}
                  />
                </div>
              </div>
              <Spacer y="xl" />
              <Text color={"primaryText"} size="lg">
                Buy Pending
              </Text>
            </Container>

            <Spacer y="3xl" />
          </>
        )}
      </Container>
    </Container>
  );
}
