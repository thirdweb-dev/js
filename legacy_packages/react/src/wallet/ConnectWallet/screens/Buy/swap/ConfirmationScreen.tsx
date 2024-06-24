/* eslint-disable i18next/no-literal-string */
import {
  CheckCircledIcon,
  CheckIcon,
  CrossCircledIcon,
} from "@radix-ui/react-icons";
import { useState } from "react";
import { formatSeconds } from "./formatSeconds";
import { keyframes } from "@emotion/react";
import {
  shortenString,
  useBuyWithCryptoStatus,
  useSigner,
  useWallet,
} from "@thirdweb-dev/react-core";
import {
  type BuyWithCryptoQuote,
  type BuyWithCryptoTransaction,
} from "@thirdweb-dev/sdk";
import { Skeleton } from "../../../../../components/Skeleton";
import { Spacer } from "../../../../../components/Spacer";
import { Spinner } from "../../../../../components/Spinner";
import { TokenIcon } from "../../../../../components/TokenIcon";
import { Container, ModalHeader, Line } from "../../../../../components/basic";
import { Button } from "../../../../../components/buttons";
import { useCustomTheme } from "../../../../../design-system/CustomThemeProvider";
import { StyledDiv } from "../../../../../design-system/elements";
import { iconSize, fontSize } from "../../../../../design-system/index";
import { useChainQuery } from "../../../../hooks/useChainQuery";
import { formatNumber } from "../../../../utils/formatNumber";
import { isNativeToken, type ERC20OrNativeToken } from "../../nativeToken";
import { SwapFees } from "./SwapFees";
import { addPendingSwapTransaction } from "./pendingSwapTx";
import { Text } from "../../../../../components/text";
import { AccentFailIcon } from "../../../icons/AccentFailIcon";
import { walletIds } from "@thirdweb-dev/wallets";

/**
 * @internal
 */
export function ConfirmationScreen(props: {
  onBack: () => void;
  buyWithCryptoQuote: BuyWithCryptoQuote;
  fromAmount: string;
  toAmount: string;
  fromChainId: number;
  toChainId: number;
  accountAddress: string;
  fromToken: ERC20OrNativeToken;
  toToken: ERC20OrNativeToken;
  onViewPendingTx: () => void;
  onQuoteFinalized: (quote: BuyWithCryptoQuote) => void;
  clientId: string;
}) {
  const signer = useSigner();
  const wallet = useWallet();

  const [swapTx, setSwapTx] = useState<BuyWithCryptoTransaction | undefined>();

  const isApprovalRequired = props.buyWithCryptoQuote.approval !== undefined;

  const [step, setStep] = useState<"approval" | "swap">(
    isApprovalRequired ? "approval" : "swap",
  );
  const [status, setStatus] = useState<
    "pending" | "success" | "error" | "idle"
  >("idle");

  const fromChain = useChainQuery(props.fromChainId);
  const toChain = useChainQuery(props.toChainId);

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
        destinationChainId={props.toChainId}
        destinationToken={props.toToken}
        sourceAmount={
          formatNumber(Number(props.fromAmount), 4) +
          " " +
          (fromTokenSymbol || "")
        }
        destinationAmount={
          formatNumber(Number(props.toAmount), 4) + " " + (toTokenSymbol || "")
        }
        swapTx={swapTx}
      />
    );
  }

  return (
    <Container p="lg">
      <ModalHeader title="Confirm Buy" onBack={props.onBack} />
      <Spacer y="lg" />

      {/* You Receive */}
      <ConfirmItem label="Receive">
        <TokenInfo
          chainId={props.toChainId}
          amount={String(formatNumber(Number(props.toAmount), 4))}
          symbol={toTokenSymbol || ""}
          token={props.toToken}
        />
      </ConfirmItem>

      <ConfirmItem label="Pay">
        <TokenInfo
          chainId={props.fromChainId}
          amount={String(formatNumber(Number(props.fromAmount), 4))}
          symbol={fromTokenSymbol || ""}
          token={props.fromToken}
        />
      </ConfirmItem>

      {/* Fees  */}
      <ConfirmItem label="Fees">
        <SwapFees quote={props.buyWithCryptoQuote} align="right" />
      </ConfirmItem>

      {/* Send to  */}
      <ConfirmItem label="Send to">
        <Text color="primaryText">
          {shortenString(props.accountAddress, false)}
        </Text>
      </ConfirmItem>

      {/* Time  */}
      <ConfirmItem label="Time">
        <Text color="primaryText">
          ~
          {formatSeconds(
            props.buyWithCryptoQuote.swapDetails.estimated.durationSeconds || 0,
          )}
        </Text>
      </ConfirmItem>

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
            <Step isDone={false} label="Confirm" isActive={step === "swap"} />
          </Container>
          <Spacer y="lg" />
        </>
      )}

      {status === "error" && (
        <>
          <Container flex="row" gap="xs" center="y" color="danger">
            <CrossCircledIcon width={iconSize.sm} height={iconSize.sm} />
            <Text color="danger" size="sm">
              {step === "approval" ? "Failed to Approve" : "Failed to Confirm"}
            </Text>
          </Container>

          <Spacer y="md" />
        </>
      )}

      <Button
        variant="accent"
        fullWidth
        disabled={status === "pending"}
        onClick={async () => {
          if (!signer) {
            return;
          }

          if (step === "approval" && props.buyWithCryptoQuote.approval) {
            try {
              setStatus("pending");

              const tx = await signer.sendTransaction(
                props.buyWithCryptoQuote.approval,
              );

              await tx.wait();
              props.onQuoteFinalized(props.buyWithCryptoQuote);

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
              let tx =  props.buyWithCryptoQuote.transactionRequest

              if (wallet?.walletId === walletIds.embeddedWallet) {
                tx = {
                  ...tx,
                  gasPrice: undefined,
                };
              }

              const _swapTx = await signer.sendTransaction(tx);

              const swapTxReceipt = await _swapTx.wait();
              props.onQuoteFinalized(props.buyWithCryptoQuote);

              // these will be defined by this time
              if (fromTokenSymbol && toTokenSymbol && fromChain.data) {
                addPendingSwapTransaction(props.clientId, {
                  source: {
                    symbol: fromTokenSymbol,
                    value: props.fromAmount,
                    chainId: props.fromChainId,
                  },
                  destination: {
                    symbol: toTokenSymbol,
                    value: props.toAmount,
                    chainId: props.toChainId,
                  },
                  status: "PENDING",
                  transactionHash: swapTxReceipt.transactionHash,
                });
              }

              setSwapTx({
                transactionHash: swapTxReceipt.transactionHash,
                clientId: props.clientId,
              });
            } catch (e) {
              console.error(e);
              setStatus("error");
            }
          }
        }}
        gap="xs"
      >
        {step === "approval" ? "Approve" : "Confirm"}
        {status === "pending" && <Spinner size="sm" color="accentButtonText" />}
      </Button>
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
            ? "accentText"
            : "secondaryText"
      }
    >
      <Circle>
        {props.isDone ? (
          <CheckIcon width={iconSize.sm} height={iconSize.sm} />
        ) : (
          <PulsingDot data-active={props.isActive} />
        )}
      </Circle>
      {props.label}
    </Container>
  );
}

const pulseAnimation = keyframes`
0% {
  opacity: 1;
  transform: scale(0.5);
}
100% {
  opacity: 0;
  transform: scale(1.5);
}
`;

const PulsingDot = /* @__PURE__ */ StyledDiv(() => {
  return {
    background: "currentColor",
    width: "9px",
    height: "9px",
    borderRadius: "50%",
    '&[data-active="true"]': {
      animation: `${pulseAnimation} 1s infinite`,
    },
  };
});

const Circle = /* @__PURE__ */ StyledDiv(() => {
  return {
    border: `1px solid currentColor`,
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
});

function TokenInfo(props: {
  chainId: number;
  token: ERC20OrNativeToken;
  amount: string;
  symbol: string;
}) {
  const chainQuery = useChainQuery(props.chainId);
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
        <TokenIcon token={props.token} chainId={props.chainId} size="sm" />
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

function WaitingForConfirmation(props: {
  onBack: () => void;
  onViewPendingTx: () => void;
  swapTx: BuyWithCryptoTransaction;
  destinationToken: ERC20OrNativeToken;
  destinationChainId: number;
  sourceAmount: string;
  destinationAmount: string;
}) {
  const swapStatus = useBuyWithCryptoStatus(props.swapTx);
  const isSuccess = swapStatus.data?.status === "COMPLETED";
  const isFailed = swapStatus.data?.status === "FAILED";
  // const isPending = !isSuccess && !isFailed;

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
              }}
            >
              <Spinner size="4xl" color="accentText" />
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <TokenIcon
                  chainId={props.destinationChainId}
                  token={props.destinationToken}
                  size="xxl"
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

        {!isFailed && (
          <Button variant="accent" fullWidth onClick={props.onViewPendingTx}>
            View Transactions
          </Button>
        )}

        {isFailed && (
          <Button variant="accent" fullWidth onClick={props.onBack}>
            Try Again
          </Button>
        )}
      </Container>
    </Container>
  );
}
