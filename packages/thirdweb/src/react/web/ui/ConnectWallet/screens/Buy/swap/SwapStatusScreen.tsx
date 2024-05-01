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
  const isSuccess = swapStatus.data?.status === "COMPLETED";
  const isFailed = swapStatus.data?.status === "FAILED";

  const queryClient = useQueryClient();
  const balanceInvalidated = useRef(false);
  useEffect(() => {
    if (isSuccess && !balanceInvalidated.current) {
      balanceInvalidated.current = true;
      invalidateWalletBalance(queryClient);
    }
  }, [queryClient, isSuccess]);

  return (
    <Container animate="fadein">
      <Container p="lg">
        <ModalHeader title="Buy" onBack={props.onBack} />
        <Spacer y="sm" />

        <Container
          flex="column"
          animate="fadein"
          center="both"
          color={isSuccess ? "success" : isFailed ? "danger" : "accentText"}
        >
          <Spacer y="xxl" />
          {/* Icon */}
          {isSuccess ? (
            <CheckCircledIcon
              width={iconSize["4xl"]}
              height={iconSize["4xl"]}
            />
          ) : isFailed ? (
            <AccentFailIcon size={iconSize["4xl"]} />
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

          <Spacer y="xxl" />

          <Text color={"primaryText"} size="lg">
            {isSuccess
              ? "Buy Success"
              : isFailed
                ? "Transaction Failed"
                : "Buy Pending"}
          </Text>

          {/* Token info */}
          {!isFailed && (
            <>
              <Spacer y="lg" />
              <div>
                <Text size="md" inline>
                  {" "}
                  {isSuccess ? "Bought" : "Buy"}{" "}
                </Text>
                <Text size="md" color="primaryText" inline>
                  {props.destinationAmount}
                </Text>

                <Text size="md" inline>
                  {" "}
                  for{" "}
                </Text>
                <Text size="md" color="primaryText" inline>
                  {props.sourceAmount}
                </Text>
              </div>
            </>
          )}

          {isFailed && (
            <>
              <Spacer y="md" />
              <Text size="sm">Your transaction {`couldn't`} be processed</Text>
            </>
          )}
        </Container>

        <Spacer y="xl" />

        {isSuccess && (
          <Button variant="accent" fullWidth onClick={props.onViewPendingTx}>
            View Transactions
          </Button>
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
