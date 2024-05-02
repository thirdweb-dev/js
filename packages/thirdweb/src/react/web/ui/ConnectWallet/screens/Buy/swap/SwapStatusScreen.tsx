import { CheckCircledIcon } from "@radix-ui/react-icons";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import type { Chain } from "../../../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import {
  type BuyWithCryptoStatusQueryParams,
  useBuyWithCryptoStatus,
} from "../../../../../../core/hooks/pay/useBuyWithCryptoStatus.js";
import { invalidateWalletBalance } from "../../../../../../core/providers/invalidateWalletBalance.js";
import { Spacer } from "../../../../components/Spacer.js";
import { Spinner } from "../../../../components/Spinner.js";
import { TokenIcon } from "../../../../components/TokenIcon.js";
import { Container, ModalHeader } from "../../../../components/basic.js";
import { Button } from "../../../../components/buttons.js";
import { Text } from "../../../../components/text.js";
import { iconSize } from "../../../../design-system/index.js";
import { AccentFailIcon } from "../../../icons/AccentFailIcon.js";
import type { ERC20OrNativeToken } from "../../nativeToken.js";
import { SwapTxDetailsTable } from "../tx-history/SwapDetailsScreen.js";

type UIStatus = "pending" | "success" | "failed";

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
}) {
  const swapStatus = useBuyWithCryptoStatus(props.swapTx);
  let uiStatus: UIStatus = "pending";
  if (swapStatus.data?.status === "COMPLETED") {
    uiStatus = "success";
  } else if (swapStatus.data?.status === "FAILED") {
    uiStatus = "failed";
  }

  const queryClient = useQueryClient();
  const balanceInvalidated = useRef(false);
  useEffect(() => {
    if (uiStatus === "success" && !balanceInvalidated.current) {
      balanceInvalidated.current = true;
      invalidateWalletBalance(queryClient);
    }
  }, [queryClient, uiStatus]);

  const isSuccess = uiStatus === "success";
  const isFailed = uiStatus === "failed";

  return (
    <Container animate="fadein">
      <Container p="lg">
        <ModalHeader title="Buy" onBack={props.onBack} />
        <Spacer y="sm" />

        <Container
          flex="column"
          animate="fadein"
          center="both"
          color={
            uiStatus === "success"
              ? "success"
              : uiStatus === "failed"
                ? "danger"
                : "accentText"
          }
        >
          {isSuccess ? <Spacer y="lg" /> : <Spacer y="xxl" />}

          {/* Icon */}
          {isSuccess ? (
            <CheckCircledIcon
              width={iconSize["3xl"]}
              height={iconSize["3xl"]}
            />
          ) : isFailed ? (
            <AccentFailIcon size={iconSize["3xl"]} />
          ) : (
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
          )}

          {isSuccess ? <Spacer y="lg" /> : <Spacer y="xl" />}

          <Text color={"primaryText"} size="lg">
            {isSuccess
              ? "Buy Success"
              : isFailed
                ? "Transaction Failed"
                : "Buy Pending"}
          </Text>

          {isFailed && (
            <>
              <Spacer y="md" />
              <Text size="sm">Your transaction {`couldn't`} be processed</Text>
            </>
          )}
        </Container>

        <Spacer y="xl" />

        {isSuccess &&
          swapStatus.data &&
          swapStatus.data.status !== "NOT_FOUND" && (
            <>
              <SwapTxDetailsTable
                swapStatus={swapStatus.data}
                client={props.client}
                hideStatus={true}
              />
              <Spacer y="sm" />
              <Button variant="accent" fullWidth onClick={props.onBack}>
                Done
              </Button>
            </>
          )}

        {isFailed && (
          <Button variant="accent" fullWidth onClick={props.onTryAgain}>
            Try Again
          </Button>
        )}
      </Container>
    </Container>
  );
}
