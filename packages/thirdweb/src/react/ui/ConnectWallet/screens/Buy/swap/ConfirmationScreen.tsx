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
import {
  fontSize,
  iconSize,
  radius,
  spacing,
} from "../../../../design-system/index.js";
import { isNativeToken, type ERC20OrNativeToken } from "../../nativeToken.js";
import { useChainQuery } from "../../../../../hooks/others/useChainQuery.js";
import { useSendSwapApproval } from "../../../../../hooks/pay/useSendSwapApproval.js";
import { StyledDiv } from "../../../../design-system/elements.js";
import { useCustomTheme } from "../../../../design-system/CustomThemeProvider.js";
import { shortenString } from "../../../../../utils/addresses.js";
import { SwapFees } from "./SwapFees.js";
import { useThirdwebProviderProps } from "../../../../../hooks/others/useThirdwebProviderProps.js";
import { addPendingSwapTransaction } from "./pendingSwapTx.js";
import { Img } from "../../../../components/Img.js";
import { Skeleton } from "../../../../components/Skeleton.js";
import { useActiveWallet } from "../../../../../providers/wallet-provider.js";
import { formatNumber } from "../../../../../utils/formatNumber.js";
import { useTrack } from "../../../../hooks/useTrack.js";

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
  const activeWallet = useActiveWallet();
  const track = useTrack();

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

      <TokenSelection
        label="You Receive"
        chain={props.toChain}
        amount={String(formatNumber(Number(props.toAmount), 4))}
        symbol={toTokenSymbol || ""}
        token={props.toToken}
      />

      <Spacer y="lg" />

      {/* You Pay */}
      <TokenSelection
        label="You Pay"
        chain={props.fromChain}
        amount={String(formatNumber(Number(props.fromAmount), 4))}
        symbol={fromTokenSymbol || ""}
        token={props.fromToken}
      />

      <Spacer y="lg" />

      <Text size="sm" color="secondaryText">
        Recipient Address
      </Text>

      <Spacer y="xs" />

      <TokenInfoContainer>
        <Container flex="row" gap="md" center="y">
          <Img
            width={iconSize.lg}
            height={iconSize.lg}
            src={activeWallet?.metadata.iconUrl || ""}
          />
          <Text color="primaryText" size="sm">
            {shortenString(props.account.address, false)}
          </Text>
        </Container>
      </TokenInfoContainer>

      <Spacer y="xl" />
      <SwapFees quote={props.swapQuote} />

      <Spacer y="lg" />

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

      {status === "error" && (
        <>
          <Container flex="row" gap="xs" center="y" color="danger">
            <CrossCircledIcon width={iconSize.sm} height={iconSize.sm} />
            <Text color="danger" size="sm">
              {step === "approval" ? "Failed to Approve" : "Failed to Swap"}
            </Text>
          </Container>

          <Spacer y="md" />
        </>
      )}

      <Button
        variant="accent"
        fullWidth
        onClick={async () => {
          if (step === "approval" && props.swapQuote.approval) {
            try {
              setStatus("pending");
              track({
                source: "ConnectButton",
                action: "approve.initiated",
                quote: props.swapQuote,
              });
              await sendSwapApprovalMutation.mutateAsync(
                props.swapQuote.approval,
              );
              track({
                source: "ConnectButton",
                action: "approve.success",
                quote: props.swapQuote,
              });
              setStep("swap");
              setStatus("idle");
            } catch {
              track({
                source: "ConnectButton",
                action: "approve.failed",
                quote: props.swapQuote,
              });
              setStatus("error");
            }
          }

          if (step === "swap") {
            setStatus("pending");
            try {
              track({
                source: "ConnectButton",
                action: "swap.initiated",
                quote: props.swapQuote,
              });
              const _swapTx = await sendSwapMutation.mutateAsync(
                props.swapQuote,
              );

              track({
                source: "ConnectButton",
                action: "swap.sent",
                quote: props.swapQuote,
              });

              // these will be defined by this time
              if (fromTokenSymbol && toTokenSymbol && fromChain.data) {
                const explorer = fromChain.data.explorers?.[0]?.url;
                addPendingSwapTransaction(
                  client,
                  {
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
                  },
                  props.swapQuote,
                );
              }

              setSwapTx(_swapTx);
            } catch {
              track({
                source: "ConnectButton",
                action: "swap.failedToSend",
                quote: props.swapQuote,
              });
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
    background: theme.colors.secondaryText,
    flex: 1,
  };
});

function Step(props: { isDone: boolean; label: string; isActive: boolean }) {
  return (
    <Container
      flex="row"
      center="y"
      gap="xs"
      style={{
        fontSize: fontSize.sm,
      }}
      color={
        props.isDone
          ? "success"
          : props.isActive
            ? "primaryText"
            : "secondaryText"
      }
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
  token: ERC20OrNativeToken;
  amount: string;
  symbol: string;
}) {
  const chainQuery = useChainQuery(props.chain);
  const tokenIcon = isNativeToken(props.token)
    ? chainQuery.data?.icon?.url
    : props.token.icon;
  return (
    <div>
      <Text size="sm" color="secondaryText">
        {props.label}
      </Text>
      <Spacer y="xs" />
      <TokenInfoContainer>
        <Container flex="row" gap="md" center="y">
          {tokenIcon ? (
            <Img width={iconSize.lg} height={iconSize.lg} src={tokenIcon} />
          ) : (
            <Skeleton width={iconSize.lg} height={iconSize.lg} />
          )}

          <Container flex="column" gap="xxs">
            <Text color="primaryText" size="sm">
              {props.amount} {props.symbol}
            </Text>
            {chainQuery.data ? (
              <Text size="sm">{chainQuery.data.name}</Text>
            ) : (
              <Skeleton width={"100px"} height={fontSize.md} />
            )}
          </Container>
        </Container>
      </TokenInfoContainer>
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
          View Transactions
        </Button>
      </Container>
    </Container>
  );
}

const TokenInfoContainer = /* @__PURE__ */ StyledDiv(() => {
  const theme = useCustomTheme();
  return {
    padding: spacing.sm,
    borderRadius: radius.md,
    background: theme.colors.walletSelectorButtonHoverBg,
    display: "flex",
    alignItems: "center",
  };
});
