import {
  CheckCircledIcon,
  CheckIcon,
  CrossCircledIcon,
} from "@radix-ui/react-icons";
import { useState } from "react";
import type { Chain } from "../../../../../../chains/types.js";
import type { SwapTransaction } from "../../../../../../pay/swap/actions/getStatus.js";
import type { SwapQuote } from "../../../../../../pay/swap/actions/getSwap.js";
import type { Account } from "../../../../../../wallets/interfaces/wallet.js";
import { useSendSwapTransaction } from "../../../../../hooks/pay/useSendSwapTransaction.js";
import { useSwapStatus } from "../../../../../hooks/pay/useSwapStatus.js";
import { Spacer } from "../../../../components/Spacer.js";
import { Spinner } from "../../../../components/Spinner.js";
import { Container, ModalHeader } from "../../../../components/basic.js";
import { Button } from "../../../../components/buttons.js";
import { Text } from "../../../../components/text.js";
import { iconSize, radius, spacing } from "../../../../design-system/index.js";
import { isNativeToken, type ERC20OrNativeToken } from "../../nativeToken.js";
import { useChainQuery } from "../../../../../hooks/others/useChainQuery.js";
import { useSendSwapApproval } from "../../../../../hooks/pay/useSendSwapApproval.js";
import { StyledDiv } from "../../../../design-system/elements.js";
import { useCustomTheme } from "../../../../design-system/CustomThemeProvider.js";
import { ChainIcon } from "../../../../components/ChainIcon.js";
import { shortenString } from "../../../../../utils/addresses.js";
import { SwapFees } from "./SwapFees.js";
import { useThirdwebProviderProps } from "../../../../../hooks/others/useThirdwebProviderProps.js";
import { addPendingSwapTransaction } from "./pendingSwapTx.js";

/**
 * @internal
 */
export function ConfirmationScreen(props: {
  onBack: () => void;
  swapQuote: SwapQuote;
  fromAmount: string;
  toAmount: string;
  fromChain: Chain;
  toChain: Chain;
  account: Account;
  fromToken: ERC20OrNativeToken;
  toToken: ERC20OrNativeToken;
  onViewPendingTx: () => void;
}) {
  const sendSwapMutation = useSendSwapTransaction();
  const sendSwapApprovalMutation = useSendSwapApproval();
  const { client } = useThirdwebProviderProps();
  // TODO: remove after testing
  // const test = {
  //   client,
  //   transactionHash:
  //     "0x5242005d31ce3c77b3cd72e1a403c413226d08f3071a2c82b3cc4f0071519547",
  // };
  const [swapTx, setSwapTx] = useState<SwapTransaction | undefined>();
  const isApprovalRequired = props.swapQuote.approval !== undefined;

  const [step, setStep] = useState<"approval" | "swap">(
    isApprovalRequired ? "approval" : "swap",
  );
  const [status, setStatus] = useState<
    "pending" | "success" | "error" | "idle"
  >("idle");

  const fromChain = useChainQuery(props.fromChain);
  const toChain = useChainQuery(props.toChain);

  const fromTokenSymbol = isNativeToken(props.fromToken)
    ? fromChain.data?.nativeCurrency?.symbol
    : props.fromToken?.symbol;
  const toTokenSymbol = isNativeToken(props.toToken)
    ? toChain.data?.nativeCurrency?.symbol
    : props.toToken?.symbol;

  if (swapTx) {
    return (
      <WaitingForConfirmation
        onBack={() => {
          props.onBack();
        }}
        onViewPendingTx={props.onViewPendingTx}
        swapTx={swapTx}
      />
    );
  }

  return (
    <Container p="lg">
      <ModalHeader title="Confirm Buy" onBack={props.onBack} />
      <Spacer y="lg" />

      {/* You Pay */}
      <TokenSelection
        label="You Pay"
        chain={props.fromChain}
        amount={Number(props.fromAmount).toFixed(6)}
        symbol={fromTokenSymbol || ""}
      />
      <Spacer y="lg" />

      <TokenSelection
        label="You receive"
        chain={props.toChain}
        amount={Number(props.toAmount).toFixed(6)}
        symbol={toTokenSymbol || ""}
      />

      <Spacer y="lg" />
      <Text size="sm" color="secondaryText">
        Recipient Address
      </Text>
      <Spacer y="xs" />
      <BorderBox>
        <Text color="primaryText" size="md" weight={500}>
          {shortenString(props.account.address)}
        </Text>
      </BorderBox>

      <Spacer y="lg" />
      <SwapFees quote={props.swapQuote} />

      <Spacer y="lg" />

      {status === "error" && (
        <>
          <Container flex="row" gap="xs" center="y" color="danger">
            <CrossCircledIcon width={iconSize.sm} height={iconSize.sm} />
            <Text color="danger" size="sm">
              {step === "approval" ? "Approval Rejected" : "Swap Rejected"}
            </Text>
          </Container>

          <Spacer y="lg" />
        </>
      )}

      {/* Show 2 steps  */}
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
            <Step isDone={false} label="Swap" isActive={step === "swap"} />
          </Container>
          <Spacer y="lg" />
        </>
      )}

      <Button
        variant="accent"
        fullWidth
        onClick={async () => {
          if (step === "approval" && props.swapQuote.approval) {
            try {
              setStatus("pending");
              await sendSwapApprovalMutation.mutateAsync(
                props.swapQuote.approval,
              );
              setStep("swap");
              setStatus("idle");
            } catch {
              setStatus("error");
            }
          }

          if (step === "swap") {
            setStatus("pending");
            try {
              const _swapTx = await sendSwapMutation.mutateAsync(
                props.swapQuote,
              );

              // these will be defined by this time
              if (fromTokenSymbol && toTokenSymbol && fromChain.data) {
                const explorer = fromChain.data.explorers?.[0]?.url;
                addPendingSwapTransaction(client, {
                  from: {
                    symbol: fromTokenSymbol,
                    value: props.fromAmount,
                  },
                  to: {
                    symbol: toTokenSymbol,
                    value: props.toAmount,
                  },
                  status: "PENDING",
                  transactionHash: _swapTx.transactionHash,
                  txExplorerLink: explorer
                    ? `${explorer}/tx/${_swapTx.transactionHash}`
                    : "",
                });
              }

              setSwapTx(_swapTx);
            } catch {
              setStatus("error");
            }
          }
        }}
        gap="xs"
      >
        {step === "approval" ? "Approve" : "Swap"}
        {status === "pending" && <Spinner size="sm" color="accentButtonText" />}
      </Button>
    </Container>
  );
}

const ConnectorLine = /* @__PURE__ */ StyledDiv(() => {
  const theme = useCustomTheme();
  return {
    height: "1.5px",
    background: theme.colors.accentText,
    flex: 1,
  };
});

function Step(props: { isDone: boolean; label: string; isActive: boolean }) {
  return (
    <Container
      flex="row"
      center="y"
      gap="xs"
      color={props.isActive ? "primaryText" : "accentText"}
    >
      <Circle>
        {props.isDone ? (
          <CheckIcon width={iconSize.sm} height={iconSize.sm} />
        ) : (
          <div
            style={{
              background: "currentColor",
              width: "7px",
              height: "7px",
              borderRadius: "50%",
            }}
          />
        )}
      </Circle>
      {props.label}
    </Container>
  );
}

const Circle = /* @__PURE__ */ StyledDiv(() => {
  return {
    border: `1px solid currentColor`,
    width: iconSize.md + "px",
    height: iconSize.md + "px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
});

function TokenSelection(props: {
  label: string;
  chain: Chain;
  amount: string;
  symbol: string;
}) {
  const chainQuery = useChainQuery(props.chain);
  return (
    <div>
      <Text size="sm" color="secondaryText">
        {props.label}
      </Text>
      <Spacer y="xs" />
      <BorderBox>
        <Container flex="row" gap="sm" center="y">
          <Text color="primaryText" size="lg" weight={500}>
            {props.amount}
          </Text>
          <Container flex="row" center="y" gap="xs">
            <ChainIcon size={iconSize.md} chain={chainQuery.data} />
            <Text color="primaryText" size="sm" weight={500}>
              {props.symbol}
            </Text>
          </Container>
        </Container>
      </BorderBox>
    </div>
  );
}

function WaitingForConfirmation(props: {
  onBack: () => void;
  onViewPendingTx: () => void;
  swapTx: SwapTransaction;
}) {
  const swapStatus = useSwapStatus(props.swapTx);
  const isSuccess = swapStatus.data?.status === "COMPLETED";
  const isFailed = swapStatus.data?.status === "FAILED";
  const isPending = !isSuccess && !isFailed;

  return (
    <Container animate="fadein">
      <Container p="lg">
        <ModalHeader title="Buy" onBack={props.onBack} />
        <Spacer y="xxl" />
        <Spacer y="xxl" />
        <Container
          flex="column"
          animate="fadein"
          center="both"
          color={isSuccess ? "success" : isFailed ? "danger" : "accentText"}
        >
          {isSuccess ? (
            <CheckCircledIcon width={iconSize.xxl} height={iconSize.xxl} />
          ) : isFailed ? (
            <CrossCircledIcon width={iconSize.xxl} height={iconSize.xxl} />
          ) : (
            <Spinner size="xxl" color="accentText" />
          )}

          <Spacer y="xxl" />
          <Spacer y="xxl" />

          <Text color={"primaryText"} size="lg">
            {" "}
            {isSuccess
              ? "Buy Success"
              : isFailed
                ? "Buy Failed"
                : "Buy Pending"}{" "}
          </Text>

          {isPending && (
            <>
              <Spacer y="md" />
              <Text size="sm">Your transaction is currently pending</Text>
            </>
          )}
        </Container>

        <Spacer y="xl" />

        <Button variant="accent" fullWidth onClick={props.onViewPendingTx}>
          View Pending Transactions
        </Button>
      </Container>
    </Container>
  );
}

const BorderBox = /* @__PURE__ */ StyledDiv(() => {
  const theme = useCustomTheme();
  return {
    padding: spacing.sm,
    borderRadius: radius.md,
    border: `1px solid ${theme.colors.borderColor}`,
    height: "51px",
    display: "flex",
    alignItems: "center",
  };
});
