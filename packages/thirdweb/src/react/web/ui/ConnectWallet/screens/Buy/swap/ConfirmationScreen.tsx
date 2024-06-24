import { CrossCircledIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import type { Chain } from "../../../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import type { BuyWithCryptoQuote } from "../../../../../../../pay/buyWithCrypto/getQuote.js";
import { waitForReceipt } from "../../../../../../../transaction/actions/wait-for-tx-receipt.js";
import { formatNumber } from "../../../../../../../utils/formatNumber.js";
import { useCustomTheme } from "../../../../../../core/design-system/CustomThemeProvider.js";
import {
  fontSize,
  iconSize,
} from "../../../../../../core/design-system/index.js";
import { useChainQuery } from "../../../../../../core/hooks/others/useChainQuery.js";
import { useSendTransactionCore } from "../../../../../../core/hooks/transaction/useSendTransaction.js";
import { useActiveWallet } from "../../../../../hooks/wallets/useActiveWallet.js";
import { useActiveWalletChain } from "../../../../../hooks/wallets/useActiveWalletChain.js";
import { useSwitchActiveWalletChain } from "../../../../../hooks/wallets/useSwitchActiveWalletChain.js";
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
import { SwapFees } from "./Fees.js";
import { formatSeconds } from "./formatSeconds.js";
import { addPendingTx } from "./pendingSwapTx.js";

/**
 * @internal
 */
export function SwapConfirmationScreen(props: {
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
}) {
  const activeChain = useActiveWalletChain();
  const activeWallet = useActiveWallet();
  const switchChain = useSwitchActiveWalletChain();
  const sendTransactionMutation = useSendTransactionCore({
    wallet: activeWallet,
    switchChain,
  });

  const isApprovalRequired = props.quote.approval !== undefined;
  const initialStep = isApprovalRequired ? "approval" : "swap";

  const [step, setStep] = useState<"approval" | "swap">(initialStep);
  const [status, setStatus] = useState<
    "pending" | "success" | "error" | "idle"
  >("idle");

  return (
    <Container p="lg">
      <ModalHeader title="Buy" onBack={props.onBack} />

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

      {/* Receive */}
      <ConfirmItem label="Receive">
        <RenderTokenInfo
          chain={props.toChain}
          amount={String(formatNumber(Number(props.toAmount), 4))}
          symbol={props.toTokenSymbol}
          token={props.toToken}
          client={props.client}
        />
      </ConfirmItem>

      {/* Pay */}
      <ConfirmItem label="Pay">
        <RenderTokenInfo
          chain={props.fromChain}
          amount={String(formatNumber(Number(props.fromAmount), 4))}
          symbol={props.fromTokenSymbol || ""}
          token={props.fromToken}
          client={props.client}
        />
      </ConfirmItem>

      {/* Fees  */}
      <ConfirmItem label="Fees">
        <SwapFees quote={props.quote} align="right" />
      </ConfirmItem>

      {/* Time  */}
      <ConfirmItem label="Time">
        <Text color="primaryText">
          ~
          {formatSeconds(
            props.quote.swapDetails.estimated.durationSeconds || 0,
          )}
        </Text>
      </ConfirmItem>

      <Spacer y="xl" />

      {/* Show 2 steps - Approve and confirm  */}
      {isApprovalRequired && (
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

      {activeChain && activeChain.id !== props.fromChain.id ? (
        <SwitchNetworkButton
          fullWidth
          chain={props.fromChain}
          variant="accent"
        />
      ) : (
        <Button
          variant="accent"
          fullWidth
          disabled={status === "pending"}
          onClick={async () => {
            if (step === "approval" && props.quote.approval) {
              try {
                setStatus("pending");

                const tx = await sendTransactionMutation.mutateAsync(
                  props.quote.approval,
                );

                await waitForReceipt({ ...tx, maxBlocksWaitTime: 50 });
                // props.onQuoteFinalized(props.quote);

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
                let tx = props.quote.transactionRequest;

                // Fix for inApp wallet
                // Ideally - the pay server sends a non-legacy transaction to avoid this issue
                if (
                  activeWallet?.id === "inApp" ||
                  activeWallet?.id === "embedded"
                ) {
                  tx = {
                    ...props.quote.transactionRequest,
                    gasPrice: undefined,
                  };
                }

                const _swapTx = await sendTransactionMutation.mutateAsync(tx);

                await waitForReceipt({ ..._swapTx, maxBlocksWaitTime: 50 });

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

const ConnectorLine = /* @__PURE__ */ StyledDiv(() => {
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
  const chainQuery = useChainQuery(props.chain);
  return (
    <Container
      flex="column"
      gap="xxs"
      style={{
        alignItems: "flex-end",
      }}
    >
      <Container flex="row" center="y" gap="xs">
        <Text color="primaryText" size="md">
          {props.amount} {props.symbol}
        </Text>
        <PayTokenIcon
          token={props.token}
          chain={props.chain}
          size="sm"
          client={props.client}
        />
      </Container>

      {chainQuery.data ? (
        <Text size="sm">{chainQuery.data.name}</Text>
      ) : (
        <Skeleton width={"100px"} height={fontSize.sm} />
      )}
    </Container>
  );
}

function ConfirmItem(props: { label: string; children: React.ReactNode }) {
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
        <Text size="md" color="secondaryText">
          {props.label}
        </Text>
        {props.children}
      </Container>
      <Line />
    </>
  );
}
