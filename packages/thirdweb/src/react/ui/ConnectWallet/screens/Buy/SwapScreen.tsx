import {
  CheckCircledIcon,
  ChevronDownIcon,
  CrossCircledIcon,
} from "@radix-ui/react-icons";
import { useDeferredValue, useMemo, useState } from "react";
import { ethereum } from "../../../../../chains/chain-definitions/ethereum.js";
import type { Chain } from "../../../../../chains/types.js";
import { defineChain } from "../../../../../chains/utils.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../constants/addresses.js";
import type { SwapTransaction } from "../../../../../pay/swap/actions/getStatus.js";
import type {
  GetSwapQuoteParams,
  SwapQuote,
} from "../../../../../pay/swap/actions/getSwap.js";
import type { SwapSupportedChainId } from "../../../../../pay/swap/supportedChains.js";
import { swapSupportedChains } from "../../../../../pay/swap/supportedChains.js";
import type { Account } from "../../../../../wallets/interfaces/wallet.js";
import { useThirdwebProviderProps } from "../../../../hooks/others/useThirdwebProviderProps.js";
import { useWalletBalance } from "../../../../hooks/others/useWalletBalance.js";
import { useSendSwapTransaction } from "../../../../hooks/pay/useSendSwapTransaction.js";
import { useSwapQuote } from "../../../../hooks/pay/useSwapQuote.js";
import { useSwapStatus } from "../../../../hooks/pay/useSwapStatus.js";
import { useTWLocale } from "../../../../providers/locale-provider.js";
import {
  useActiveAccount,
  useActiveWalletChain,
} from "../../../../providers/wallet-provider.js";
import { Spacer } from "../../../components/Spacer.js";
import { Spinner } from "../../../components/Spinner.js";
import { Container, ModalHeader } from "../../../components/basic.js";
import { Button } from "../../../components/buttons.js";
import { Text } from "../../../components/text.js";
import { iconSize } from "../../../design-system/index.js";
import { ChainButton, NetworkSelectorContent } from "../../NetworkSelector.js";
import type { SupportedTokens, TokenInfo } from "../../defaultTokens.js";
import { TokenSelector } from "../TokenSelector.js";
import {
  NATIVE_TOKEN,
  isNativeToken,
  type NativeToken,
} from "../nativeToken.js";
import { SwapInput } from "./swap/SwapInput.js";
import { useChainsQuery } from "../../../../hooks/others/useChainQuery.js";
import { BuyHeader } from "./BuyHeader.js";
import { DynamicHeight } from "../../../components/DynamicHeight.js";
import { WalletIcon } from "../../icons/WalletIcon.js";
import { useSendSwapApproval } from "../../../../hooks/pay/useSendSwapApproval.js";

const supportedChainsObj = /* @__PURE__ */ (() =>
  swapSupportedChains.map(defineChain))();

/**
 * @internal
 */
export function SwapScreen(props: {
  onBack: () => void;
  supportedTokens: SupportedTokens;
}) {
  const activeChain = useActiveWalletChain();
  const account = useActiveAccount();

  if (!activeChain || !account) {
    return null; // this should never happen
  }

  return (
    <SwapScreenContent {...props} activeChain={activeChain} account={account} />
  );
}

type TokenAmountState = {
  value: string;
  type: "source" | "destination";
};

type SelectedToken = TokenInfo | NativeToken;

type Screen =
  | "main"
  | "select-from-token"
  | "select-to-token"
  | "select-from-chain"
  | "select-to-chain"
  | "confirmation"
  | "error";

/**
 *
 * @internal
 */
export function SwapScreenContent(props: {
  onBack: () => void;
  supportedTokens: SupportedTokens;
  activeChain: Chain;
  account: Account;
}) {
  const { activeChain, account } = props;

  // prefetch chains metadata
  useChainsQuery(supportedChainsObj, 50);

  // screens
  const [screen, setScreen] = useState<Screen>("main");

  // token amount
  const [tokenAmount, setTokenAmount] = useState<TokenAmountState>({
    value: "",
    type: "source",
  });

  const isChainSupported = useMemo(
    () => swapSupportedChains.includes(activeChain.id as any),
    [activeChain.id],
  );

  // selected chain
  const defaultChain = isChainSupported ? activeChain : ethereum;
  const [fromChain, setFromChain] = useState<Chain>(defaultChain);
  const [toChain, setToChain] = useState<Chain>(defaultChain);

  // selected tokens
  const [fromToken, setFromToken] = useState<SelectedToken>(NATIVE_TOKEN);
  const [toToken, setToToken] = useState<SelectedToken>(
    props.supportedTokens[toChain.id]?.[0] || NATIVE_TOKEN,
  );

  const deferredTokenAmount = useDeferredValue(tokenAmount);
  const { client } = useThirdwebProviderProps();

  const fromTokenBalanceQuery = useWalletBalance({
    account: account,
    chain: fromChain,
    tokenAddress: isNativeToken(fromToken) ? undefined : fromToken.address,
  });

  const amounts =
    tokenAmount.type === "source"
      ? { fromAmount: deferredTokenAmount.value, toAmount: undefined }
      : {
          fromAmount: undefined,
          toAmount: deferredTokenAmount.value,
        };

  const swapParams: GetSwapQuoteParams | undefined =
    deferredTokenAmount.value &&
    !(fromChain === toChain && fromToken === toToken)
      ? {
          client: client,
          // wallet
          fromAddress: account.address,
          // from token
          fromChainId: fromChain.id as SwapSupportedChainId,
          fromTokenAddress: isNativeToken(fromToken)
            ? NATIVE_TOKEN_ADDRESS
            : fromToken.address,
          toChainId: toChain.id as SwapSupportedChainId,
          // to
          toTokenAddress: isNativeToken(toToken)
            ? NATIVE_TOKEN_ADDRESS
            : toToken.address,
          ...amounts,
        }
      : undefined;

  const swapQuoteQuery = useSwapQuote(swapParams, {
    // refetch every 30 seconds
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
    gcTime: 30 * 1000,
  });

  if (screen === "error") {
    return (
      <Container animate="fadein">
        <Container p="lg">
          <ModalHeader
            title="Buy"
            onBack={() => {
              setScreen("main");
            }}
          />
          <Spacer y="lg" />
          <Container
            flex="column"
            gap="lg"
            animate="fadein"
            center="both"
            style={{
              minHeight: "240px",
            }}
            color={"danger"}
          >
            <CrossCircledIcon width={iconSize.xl} height={iconSize.xl} />
            <Text color={"danger"}>Failed to swap</Text>
          </Container>
        </Container>
      </Container>
    );
  }

  if (screen === "confirmation" && swapQuoteQuery.data) {
    return (
      <ConfirmationScreen
        onBack={() => setScreen("main")}
        swapQuote={swapQuoteQuery.data}
      />
    );
  }

  if (screen === "select-from-token") {
    return (
      <TokenSelector
        onBack={() => setScreen("main")}
        tokenList={
          (fromChain?.id ? props.supportedTokens[fromChain.id] : undefined) ||
          []
        }
        onTokenSelect={(tokenInfo) => {
          setFromToken(tokenInfo);
          setScreen("main");
        }}
        chain={fromChain}
      />
    );
  }

  if (screen === "select-to-token") {
    return (
      <TokenSelector
        onBack={() => setScreen("main")}
        tokenList={
          (toChain?.id ? props.supportedTokens[toChain.id] : undefined) || []
        }
        onTokenSelect={(tokenInfo) => {
          setToToken(tokenInfo);
          setScreen("main");
        }}
        chain={toChain}
      />
    );
  }

  if (screen === "select-from-chain" || screen === "select-to-chain") {
    return (
      <NetworkSelectorContent
        showTabs={false}
        onBack={() => setScreen("main")}
        // pass swap supported chains
        chains={supportedChainsObj}
        closeModal={() => setScreen("main")}
        networkSelector={{
          renderChain(renderChainProps) {
            return (
              <ChainButton
                chain={renderChainProps.chain}
                confirming={false}
                switchingFailed={false}
                onClick={() => {
                  const chain = renderChainProps.chain;
                  if (screen === "select-from-chain") {
                    setFromChain(chain);
                    setFromToken(NATIVE_TOKEN);
                  } else {
                    setToChain(chain);
                    setToToken(NATIVE_TOKEN);
                  }
                  setScreen("main");
                }}
              />
            );
          },
        }}
      />
    );
  }

  const swapQuote = swapQuoteQuery.data;
  const isSwapQuoteLoading = swapQuoteQuery.isLoading;
  const isSwapQuoteError = swapQuoteQuery.isError;
  const isSwapQuoteFetching = swapQuoteQuery.isFetching;

  // SOURCE TOKEN ----

  // if the token amount was entered by user - show that
  // else - show the loading status until the quote is loaded
  // once the quote is loaded, show the value calculated from the quote
  let sourceTokenAmount =
    tokenAmount.type === "source" ? tokenAmount.value : "";

  // if quote is loaded and
  if (swapQuote && !sourceTokenAmount) {
    // amount in # of tokens
    sourceTokenAmount = swapQuote.swapDetails.fromAmount;
  }

  // DESTINATION TOKEN ----

  let destinationTokenAmount =
    tokenAmount.type === "destination" ? tokenAmount.value : "";

  if (swapQuote && !destinationTokenAmount) {
    destinationTokenAmount = swapQuote.swapDetails.toAmount;
  }

  const isNotEnoughBalance =
    !!sourceTokenAmount &&
    !!fromTokenBalanceQuery.data &&
    Number(fromTokenBalanceQuery.data.displayValue) < Number(sourceTokenAmount);

  return (
    <Container animate="fadein">
      <Container p="lg">
        <BuyHeader onBack={props.onBack} />
        <Spacer y="lg" />

        {/* From */}
        <SwapInput
          value={sourceTokenAmount}
          onChange={async (value) => {
            setTokenAmount({ value, type: "source" });
          }}
          label="From"
          valueIsLoading={isSwapQuoteLoading && !sourceTokenAmount}
          onTokenClick={() => setScreen("select-from-token")}
          chain={fromChain}
          token={fromToken}
          estimatedValue={swapQuote?.swapDetails.estimated.fromAmountUSDCents}
          onChainClick={() => setScreen("select-from-chain")}
        />

        <Spacer y="lg" />

        {/* To */}
        <SwapInput
          value={destinationTokenAmount}
          onChange={(value) => {
            setTokenAmount({ value, type: "destination" });
          }}
          label="To"
          valueIsLoading={isSwapQuoteLoading && !destinationTokenAmount}
          onTokenClick={() => setScreen("select-to-token")}
          chain={toChain}
          token={toToken}
          estimatedValue={swapQuote?.swapDetails.estimated.toAmountMinUSDCents}
          onChainClick={() => setScreen("select-to-chain")}
        />

        {swapQuote && (
          <Fees
            amount={
              swapQuote
                ? `$${swapQuote.swapDetails.estimated.feesUSDCents / 100}`
                : "---"
            }
          />
        )}

        {isSwapQuoteError && (
          <div>
            <Spacer y="md" />
            <Container flex="row" gap="xs" center="y" color="danger">
              <CrossCircledIcon width={iconSize.sm} height={iconSize.sm} />
              <Text color="danger" size="sm">
                Can not swap given tokens at the moment
              </Text>
            </Container>
          </div>
        )}

        {!isSwapQuoteError && isNotEnoughBalance && (
          <div>
            <Spacer y="md" />
            <Container flex="row" gap="xs" center="y" color="danger">
              <WalletIcon size={iconSize.xs} />
              <Text color="danger" size="sm">
                Exceeds balance
              </Text>
            </Container>
          </div>
        )}

        <Spacer y="lg" />

        <Button
          variant="accent"
          fullWidth
          disabled={(!isSwapQuoteFetching && !swapQuote) || isNotEnoughBalance}
          onClick={async () => {
            if (swapQuote) {
              setScreen("confirmation");
            }
          }}
          gap="sm"
        >
          Purchase
        </Button>
      </Container>
    </Container>
  );
}

function ConfirmationScreen(props: {
  onBack: () => void;
  swapQuote: SwapQuote;
  // onCompleted: () => void;
}) {
  const sendSwapMutation = useSendSwapTransaction();
  const sendSwapApprovalMutation = useSendSwapApproval();
  const [swapTx, setSwapTx] = useState<SwapTransaction | undefined>();
  const [step, setStep] = useState<"approval" | "swap">(
    props.swapQuote.approval ? "approval" : "swap",
  );
  const [status, setStatus] = useState<
    "pending" | "success" | "error" | "idle"
  >("idle");

  if (swapTx) {
    return (
      <WaitingForConfirmation
        onBack={() => {
          props.onBack();
        }}
        swapTx={swapTx}
      />
    );
  }

  return (
    <Container p="lg">
      <ModalHeader title="Buy" onBack={props.onBack} />
      <Spacer y="lg" />
      Confirmation screen
      <Spacer y="lg" />
      <Text>
        {step} -{status}
      </Text>
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
              setSwapTx(_swapTx);
            } catch {
              setStatus("error");
            }
          }
        }}
        gap="sm"
      >
        {step === "approval" ? "Approve" : "Swap"}
      </Button>
    </Container>
  );
}

function Fees(props: { amount: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div>
      <Spacer y="lg" />
      <Button
        variant="outline"
        gap="xs"
        fullWidth
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          border: "none",
          justifyContent: "space-between",
          padding: 0,
        }}
      >
        Breakdown
        <Container color="secondaryText" flex="row" center="both">
          <ChevronDownIcon
            width={iconSize.sm}
            height={iconSize.sm}
            style={{
              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}
          />
        </Container>
      </Button>

      <DynamicHeight>
        {isExpanded && (
          <div>
            <Spacer y="sm" />
            <Container
              animate="fadein"
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Container color="secondaryText" flex="row" center="y" gap="xxs">
                <Text color="secondaryText" size="sm">
                  Processing Fees
                </Text>
              </Container>
              <Text color="primaryText" size="sm">
                {props.amount}
              </Text>
            </Container>
            <Spacer y="sm" />
          </div>
        )}
      </DynamicHeight>
    </div>
  );
}

function WaitingForConfirmation(props: {
  onBack: () => void;
  swapTx: SwapTransaction;
}) {
  const locale = useTWLocale();
  const screenLocale = locale.connectWallet.swapScreen;
  const swapStatus = useSwapStatus(props.swapTx);

  const isSuccess = swapStatus.data?.status === "DONE";
  const isFailed = swapStatus.data?.status === "FAILED";

  return (
    <Container animate="fadein">
      <Container p="lg">
        <ModalHeader title={screenLocale.title} onBack={props.onBack} />
        <Spacer y="xl" />
        <Container
          flex="column"
          gap="lg"
          animate="fadein"
          center="both"
          style={{
            minHeight: "240px",
          }}
          color={isSuccess ? "success" : isFailed ? "danger" : "accentText"}
        >
          {isSuccess ? (
            <CheckCircledIcon width={iconSize.xl} height={iconSize.xl} />
          ) : isFailed ? (
            <CrossCircledIcon width={iconSize.xl} height={iconSize.xl} />
          ) : (
            <Spinner size="xl" color="accentText" />
          )}

          <Text
            color={isSuccess ? "success" : isFailed ? "danger" : "primaryText"}
          >
            {" "}
            {isSuccess
              ? "Swapped Successfully"
              : isFailed
                ? "Swap Failed"
                : "Waiting for confirmation"}{" "}
          </Text>
        </Container>

        <Spacer y="lg" />
      </Container>
    </Container>
  );
}
