import { CrossCircledIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { trackPayEvent } from "../../../../../../../analytics/track/pay.js";
import type { Chain } from "../../../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import { getContract } from "../../../../../../../contract/contract.js";
import { approve } from "../../../../../../../extensions/erc20/write/approve.js";
import type { BuyWithCryptoQuote } from "../../../../../../../pay/buyWithCrypto/getQuote.js";
import { sendTransaction } from "../../../../../../../transaction/actions/send-transaction.js";
import { waitForReceipt } from "../../../../../../../transaction/actions/wait-for-tx-receipt.js";
import { shortenAddress } from "../../../../../../../utils/address.js";
import { formatNumber } from "../../../../../../../utils/formatNumber.js";
import { useCustomTheme } from "../../../../../../core/design-system/CustomThemeProvider.js";
import {
  fontSize,
  iconSize,
} from "../../../../../../core/design-system/index.js";
import { useChainName } from "../../../../../../core/hooks/others/useChainQuery.js";
import { useEnsName } from "../../../../../../core/utils/wallet.js";
import { Skeleton } from "../../../../components/Skeleton.js";
import { Spacer } from "../../../../components/Spacer.js";
import { Spinner } from "../../../../components/Spinner.js";
import { StepBar } from "../../../../components/StepBar.js";
import { SwitchNetworkButton } from "../../../../components/SwitchNetwork.js";
import { Container, Line, ModalHeader } from "../../../../components/basic.js";
import { Button } from "../../../../components/buttons.js";
import { Text } from "../../../../components/text.js";
import { StyledDiv } from "../../../../design-system/elements.js";
import type { ERC20OrNativeToken } from "../../nativeToken.js";
import { PayTokenIcon } from "../PayTokenIcon.js";
import { Step } from "../Stepper.js";
import type { PayerInfo } from "../types.js";
import { formatSeconds } from "./formatSeconds.js";
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
  const needsApproval =
    props.quote.approvalData &&
    props.preApprovedAmount !== undefined &&
    props.preApprovedAmount < BigInt(props.quote.approvalData.amountWei);
  const initialStep = needsApproval ? "approval" : "swap";

  const [step, setStep] = useState<"approval" | "swap">(initialStep);
  const [status, setStatus] = useState<
    "pending" | "success" | "error" | "idle"
  >("idle");

  const receiver = props.quote.swapDetails.toAddress;
  const sender = props.quote.swapDetails.fromAddress;
  const isDifferentRecipient = receiver.toLowerCase() !== sender.toLowerCase();

  const ensName = useEnsName({ client: props.client, address: receiver });

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
        <Spacer y="lg" />
      )}

      {/* Pay */}
      <ConfirmItem label="Pay">
        <RenderTokenInfo
          chain={props.fromChain}
          amount={String(formatNumber(Number(props.fromAmount), 6))}
          symbol={props.fromTokenSymbol || ""}
          token={props.fromToken}
          client={props.client}
        />
      </ConfirmItem>

      {/* Receive */}
      {!isDifferentRecipient && (
        <ConfirmItem label="Receive">
          <RenderTokenInfo
            chain={props.toChain}
            amount={String(formatNumber(Number(props.toAmount), 6))}
            symbol={props.toTokenSymbol}
            token={props.toToken}
            client={props.client}
          />
        </ConfirmItem>
      )}

      {/* Fees  */}
      <ConfirmItem label="Fees">
        <SwapFeesRightAligned quote={props.quote} />
      </ConfirmItem>

      {/* Time  */}
      <ConfirmItem label="Time">
        <Text size="sm" color="primaryText">
          ~
          {formatSeconds(
            props.quote.swapDetails.estimated.durationSeconds || 0,
          )}
        </Text>
      </ConfirmItem>

      {/* Send to  */}
      {isDifferentRecipient && (
        <ConfirmItem label="Receiver">
          <Text color="primaryText" size="sm">
            {ensName.data || shortenAddress(receiver)}
          </Text>
        </ConfirmItem>
      )}

      <Spacer y="xl" />

      {/* Show 2 steps - Approve and confirm  */}
      {needsApproval && (
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
        <SwitchNetworkButton
          fullWidth
          variant="accent"
          switchChain={async () => {
            await props.payer.wallet.switchChain(props.fromChain);
          }}
        />
      ) : (
        <Button
          variant="accent"
          fullWidth
          disabled={status === "pending"}
          onClick={async () => {
            if (step === "approval" && props.quote.approvalData) {
              try {
                setStatus("pending");

                trackPayEvent({
                  event: "prompt_swap_approval",
                  client: props.client,
                  walletAddress: props.payer.account.address,
                  walletType: props.payer.wallet.id,
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
                  account: props.payer.account,
                  transaction,
                });

                await waitForReceipt({ ...tx, maxBlocksWaitTime: 50 });

                trackPayEvent({
                  event: "swap_approval_success",
                  client: props.client,
                  walletAddress: props.payer.account.address,
                  walletType: props.payer.wallet.id,
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
                const tx = props.quote.transactionRequest;

                trackPayEvent({
                  event: "prompt_swap_execution",
                  client: props.client,
                  walletAddress: props.payer.account.address,
                  walletType: props.payer.wallet.id,
                  fromToken: props.quote.swapDetails.fromToken.tokenAddress,
                  fromAmount: props.quote.swapDetails.fromAmountWei,
                  toToken: props.quote.swapDetails.toToken.tokenAddress,
                  toAmount: props.quote.swapDetails.toAmountWei,
                  chainId: props.quote.swapDetails.fromToken.chainId,
                  dstChainId: props.quote.swapDetails.toToken.chainId,
                });

                const _swapTx = await sendTransaction({
                  account: props.payer.account,
                  transaction: tx,
                });

                await waitForReceipt({ ..._swapTx, maxBlocksWaitTime: 50 });

                trackPayEvent({
                  event: "swap_execution_success",
                  client: props.client,
                  walletAddress: props.payer.account.address,
                  walletType: props.payer.wallet.id,
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
          {step === "swap" && (status === "pending" ? "Confirming" : "Confirm")}
          {status === "pending" && (
            <Spinner size="sm" color="accentButtonText" />
          )}
        </Button>
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

function RenderTokenInfo(props: {
  chain: Chain;
  token: ERC20OrNativeToken;
  amount: string;
  symbol: string;
  client: ThirdwebClient;
}) {
  const { name } = useChainName(props.chain);
  return (
    <Container
      flex="column"
      gap="xxs"
      style={{
        alignItems: "flex-end",
      }}
    >
      <Container flex="row" center="y" gap="xs">
        <Text color="primaryText" size="sm">
          {props.amount} {props.symbol}
        </Text>
        <PayTokenIcon
          token={props.token}
          chain={props.chain}
          size="xs"
          client={props.client}
        />
      </Container>

      {name ? (
        <Text size="xs">{name}</Text>
      ) : (
        <Skeleton width="100px" height={fontSize.xs} />
      )}
    </Container>
  );
}

function ConfirmItem(props: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Container
        flex="row"
        gap="md"
        py="md"
        style={{
          justifyContent: "space-between",
        }}
      >
        <Text size="sm" color="secondaryText">
          {props.label}
        </Text>
        {props.children}
      </Container>
      <Line />
    </>
  );
}

/**
 * @internal
 */
function SwapFeesRightAligned(props: {
  quote: BuyWithCryptoQuote;
}) {
  return (
    <Container
      flex="column"
      gap="xs"
      style={{
        alignItems: "flex-end",
      }}
    >
      {props.quote.processingFees.map((fee) => {
        const feeAmount = formatNumber(Number(fee.amount), 6);
        return (
          <Container
            key={`${fee.token.chainId}_${fee.token.tokenAddress}_${feeAmount}`}
            flex="row"
            gap="xxs"
          >
            <Text color="primaryText" size="sm">
              {feeAmount === 0 ? "~" : ""}
              {feeAmount} {fee.token.symbol}
            </Text>
            <Text color="secondaryText" size="sm">
              (${(fee.amountUSDCents / 100).toFixed(2)})
            </Text>
          </Container>
        );
      })}
    </Container>
  );
}
