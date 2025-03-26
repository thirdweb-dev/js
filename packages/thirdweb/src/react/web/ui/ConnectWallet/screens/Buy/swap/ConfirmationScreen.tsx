import { CrossCircledIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { trackPayEvent } from "../../../../../../../analytics/track/pay.js";
import type { Chain } from "../../../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import { getContract } from "../../../../../../../contract/contract.js";
import { approve } from "../../../../../../../extensions/erc20/write/approve.js";
import type { BuyWithCryptoQuote } from "../../../../../../../pay/buyWithCrypto/getQuote.js";
import { sendBatchTransaction } from "../../../../../../../transaction/actions/send-batch-transaction.js";
import { sendTransaction } from "../../../../../../../transaction/actions/send-transaction.js";
import {
  type WaitForReceiptOptions,
  waitForReceipt,
} from "../../../../../../../transaction/actions/wait-for-tx-receipt.js";
import { useCustomTheme } from "../../../../../../core/design-system/CustomThemeProvider.js";
import { iconSize } from "../../../../../../core/design-system/index.js";
import { Spacer } from "../../../../components/Spacer.js";
import { Spinner } from "../../../../components/Spinner.js";
import { StepBar } from "../../../../components/StepBar.js";
import { SwitchNetworkButton } from "../../../../components/SwitchNetwork.js";
import { Container, ModalHeader } from "../../../../components/basic.js";
import { Button } from "../../../../components/buttons.js";
import { Text } from "../../../../components/text.js";
import { StyledDiv } from "../../../../design-system/elements.js";
import type { ERC20OrNativeToken } from "../../nativeToken.js";
import { Step } from "../Stepper.js";
import type { PayerInfo } from "../types.js";
import { SwapSummary } from "./SwapSummary.js";
import { addPendingTx } from "./pendingSwapTx.js";

/**
 * @internal
 */
export function SwapConfirmationScreen(props: {
  title: string;
  onBack?: () => void;
  client: ThirdwebClient;
  quote: BuyWithCryptoQuote;
  setSwapTxHash: (txHash: string) => void;
  onTryAgain: () => void;
  toChain: Chain;
  toAmount: string;
  toTokenSymbol: string;
  fromChain: Chain;
  toToken: ERC20OrNativeToken;
  fromAmount: string;
  fromToken: ERC20OrNativeToken;
  fromTokenSymbol: string;
  isFiatFlow: boolean;
  payer: PayerInfo;
  preApprovedAmount?: bigint;
}) {
  const approveTxRequired =
    props.quote.approvalData &&
    props.preApprovedAmount !== undefined &&
    props.preApprovedAmount < BigInt(props.quote.approvalData.amountWei);
  const needsApprovalStep =
    approveTxRequired && !props.payer.account.sendBatchTransaction;
  const initialStep = needsApprovalStep ? "approval" : "swap";

  const [step, setStep] = useState<"approval" | "swap">(initialStep);
  const [status, setStatus] = useState<
    "pending" | "success" | "error" | "idle"
  >("idle");

  const receiver = props.quote.swapDetails.toAddress;
  const sender = props.quote.swapDetails.fromAddress;

  return (
    <Container p="lg">
      <ModalHeader title={props.title} onBack={props.onBack} />

      {props.isFiatFlow ? (
        <>
          <Spacer y="lg" />
          <StepBar steps={2} currentStep={2} />
          <Spacer y="sm" />
          <Text size="xs">
            Step 2 of 2 - Converting {props.fromTokenSymbol} to{" "}
            {props.toTokenSymbol}
          </Text>
          <Spacer y="md" />
        </>
      ) : (
        <>
          <Spacer y="lg" />
          <Text size="sm">Confirm payment</Text>
          <Spacer y="md" />
        </>
      )}

      <SwapSummary
        sender={sender}
        receiver={receiver}
        client={props.client}
        fromToken={props.fromToken}
        fromChain={props.fromChain}
        toToken={props.toToken}
        toChain={props.toChain}
        fromAmount={props.fromAmount}
        toAmount={props.toAmount}
      />

      <Spacer y="md" />

      {/* Show 2 steps - Approve and confirm  */}
      {needsApprovalStep && (
        <>
          <Spacer y="sm" />
          <Container
            gap="sm"
            flex="row"
            style={{
              justifyContent: "space-between",
            }}
            center="y"
            color="accentText"
          >
            <Step
              isDone={step === "swap"}
              isActive={step === "approval"}
              label={step === "approval" ? "Approve" : "Approved"}
            />
            <ConnectorLine />
            <Step isDone={false} label="Confirm" isActive={step === "swap"} />
          </Container>
          <Spacer y="lg" />
        </>
      )}

      {status === "error" && (
        <>
          <Container flex="row" gap="xs" center="both" color="danger">
            <CrossCircledIcon width={iconSize.sm} height={iconSize.sm} />
            <Text color="danger" size="sm">
              {step === "approval" ? "Failed to Approve" : "Failed to Confirm"}
            </Text>
          </Container>

          <Spacer y="md" />
        </>
      )}

      {props.payer.chain.id !== props.fromChain.id ? (
        <>
          <Spacer y="xs" />
          <SwitchNetworkButton
            fullWidth
            variant="accent"
            switchChain={async () => {
              await props.payer.wallet.switchChain(props.fromChain);
            }}
          />
        </>
      ) : (
        <>
          <Spacer y="xs" />
          <Button
            variant="accent"
            fullWidth
            disabled={status === "pending"}
            onClick={async () => {
              const wallet = props.payer.wallet;

              // in case the wallet is not on the same chain as the fromToken, switch to it
              if (wallet.getChain()?.id !== props.fromChain.id) {
                await wallet.switchChain(props.fromChain);
              }

              const account = wallet.getAccount();

              if (!account) {
                throw new Error("Payer wallet has no account");
              }

              if (step === "approval" && props.quote.approvalData) {
                try {
                  setStatus("pending");

                  trackPayEvent({
                    event: "prompt_swap_approval",
                    client: props.client,
                    walletAddress: account.address,
                    walletType: wallet.id,
                    fromToken: props.quote.swapDetails.fromToken.tokenAddress,
                    fromAmount: props.quote.swapDetails.fromAmountWei,
                    toToken: props.quote.swapDetails.toToken.tokenAddress,
                    toAmount: props.quote.swapDetails.toAmountWei,
                    chainId: props.quote.swapDetails.fromToken.chainId,
                    dstChainId: props.quote.swapDetails.toToken.chainId,
                  });

                  const transaction = approve({
                    contract: getContract({
                      client: props.client,
                      address: props.quote.swapDetails.fromToken.tokenAddress,
                      chain: props.fromChain,
                    }),
                    spender: props.quote.approvalData.spenderAddress,
                    amountWei: BigInt(props.quote.approvalData.amountWei),
                  });

                  const tx = await sendTransaction({
                    account: account,
                    transaction,
                  });

                  await waitForReceipt({ ...tx, maxBlocksWaitTime: 50 });

                  trackPayEvent({
                    event: "swap_approval_success",
                    client: props.client,
                    walletAddress: account.address,
                    walletType: wallet.id,
                    fromToken: props.quote.swapDetails.fromToken.tokenAddress,
                    fromAmount: props.quote.swapDetails.fromAmountWei,
                    toToken: props.quote.swapDetails.toToken.tokenAddress,
                    toAmount: props.quote.swapDetails.toAmountWei,
                    chainId: props.quote.swapDetails.fromToken.chainId,
                    dstChainId: props.quote.swapDetails.toToken.chainId,
                  });

                  setStep("swap");
                  setStatus("idle");
                } catch (e) {
                  console.error(e);
                  setStatus("error");
                }
              }

              if (step === "swap") {
                setStatus("pending");
                try {
                  trackPayEvent({
                    event: "prompt_swap_execution",
                    client: props.client,
                    walletAddress: account.address,
                    walletType: wallet.id,
                    fromToken: props.quote.swapDetails.fromToken.tokenAddress,
                    fromAmount: props.quote.swapDetails.fromAmountWei,
                    toToken: props.quote.swapDetails.toToken.tokenAddress,
                    toAmount: props.quote.swapDetails.toAmountWei,
                    chainId: props.quote.swapDetails.fromToken.chainId,
                    dstChainId: props.quote.swapDetails.toToken.chainId,
                  });
                  const tx = props.quote.transactionRequest;
                  let _swapTx: WaitForReceiptOptions;
                  // check if we can batch approval and swap
                  const canBatch = account.sendBatchTransaction;
                  if (
                    canBatch &&
                    props.quote.approvalData &&
                    approveTxRequired
                  ) {
                    const approveTx = approve({
                      contract: getContract({
                        client: props.client,
                        address: props.quote.swapDetails.fromToken.tokenAddress,
                        chain: props.fromChain,
                      }),
                      spender: props.quote.approvalData.spenderAddress,
                      amountWei: BigInt(props.quote.approvalData.amountWei),
                    });

                    _swapTx = await sendBatchTransaction({
                      account: account,
                      transactions: [approveTx, tx],
                    });
                  } else {
                    _swapTx = await sendTransaction({
                      account: account,
                      transaction: tx,
                    });
                  }

                  trackPayEvent({
                    event: "swap_execution_success",
                    client: props.client,
                    walletAddress: account.address,
                    walletType: wallet.id,
                    fromToken: props.quote.swapDetails.fromToken.tokenAddress,
                    fromAmount: props.quote.swapDetails.fromAmountWei,
                    toToken: props.quote.swapDetails.toToken.tokenAddress,
                    toAmount: props.quote.swapDetails.toAmountWei,
                    chainId: props.quote.swapDetails.fromToken.chainId,
                    dstChainId: props.quote.swapDetails.toToken.chainId,
                  });

                  // do not add pending tx if the swap is part of fiat flow
                  if (!props.isFiatFlow) {
                    addPendingTx({
                      type: "swap",
                      txHash: _swapTx.transactionHash,
                      chainId: _swapTx.chain.id,
                    });
                  }

                  props.setSwapTxHash(_swapTx.transactionHash);
                } catch (e) {
                  console.error(e);
                  setStatus("error");
                }
              }
            }}
            gap="xs"
          >
            {step === "approval" &&
              (status === "pending" ? "Approving" : "Approve")}
            {step === "swap" &&
              (status === "pending" ? "Confirming" : "Confirm")}
            {status === "pending" && (
              <Spinner size="sm" color="accentButtonText" />
            )}
          </Button>
        </>
      )}
    </Container>
  );
}

export const ConnectorLine = /* @__PURE__ */ StyledDiv(() => {
  const theme = useCustomTheme();
  return {
    height: "4px",
    background: theme.colors.borderColor,
    flex: 1,
  };
});
