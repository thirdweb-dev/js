import { Spacer } from "../../../components/Spacer.js";
import { Container, ModalHeader } from "../../../components/basic.js";
import { useTWLocale } from "../../../../providers/locale-provider.js";
import { Button } from "../../../components/buttons.js";
import { StyledDiv } from "../../../design-system/elements.js";
import { useCustomTheme } from "../../../design-system/CustomThemeProvider.js";
import { iconSize, spacing } from "../../../design-system/index.js";
import { Text } from "../../../components/text.js";
import { useDeferredValue, useMemo, useState } from "react";
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { TokenSelector } from "../TokenSelector.js";
import type { SupportedTokens, TokenInfo } from "../../defaultTokens.js";
import type { Chain } from "../../../../../chains/types.js";
import {
  useActiveAccount,
  useActiveWalletChain,
} from "../../../../providers/wallet-provider.js";
import { useThirdwebProviderProps } from "../../../../hooks/others/useThirdwebProviderProps.js";
import type { GetSwapQuoteParams } from "../../../../../pay/swap/actions/getSwap.js";
import type { Account } from "../../../../../wallets/interfaces/wallet.js";
import { ChainButton, NetworkSelectorContent } from "../../NetworkSelector.js";
import { defineChain } from "../../../../../chains/utils.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../constants/addresses.js";
import { ethereum } from "../../../../../chains/chain-definitions/ethereum.js";
import { useSendSwapTransaction } from "../../../../hooks/pay/useSendSwapTransaction.js";
import { Spinner } from "../../../components/Spinner.js";
import { ArrowTopBottom } from "../../icons/ArrowTopBottom.js";
import { useSwapStatus } from "../../../../hooks/pay/useSwapStatus.js";
import { SwapInput } from "./swap/SwapInput.js";
import {
  NATIVE_TOKEN,
  isNativeToken,
  type NativeToken,
} from "../nativeToken.js";
import { useWalletBalance } from "../../../../hooks/others/useWalletBalance.js";
import { WalletIcon } from "../../icons/WalletIcon.js";
import { swapSupportedChains } from "../../../../../pay/swap/supportedChains.js";
import type { SwapTransaction } from "../../../../../pay/swap/actions/getStatus.js";
import type { SwapSupportedChainId } from "../../../../../pay/swap/supportedChains.js";
import { useSwapQuote } from "../../../../hooks/pay/useSwapQuote.js";

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
  const locale = useTWLocale();
  const screenLocale = locale.connectWallet.swapScreen;
  const sendSwapMutation = useSendSwapTransaction();
  const [swapTx, setswapTx] = useState<SwapTransaction | undefined>();

  // screens
  const [screen, setScreen] = useState<
    | "main"
    | "select-from-token"
    | "select-to-token"
    | "select-from-chain"
    | "select-to-chain"
  >("main");

  // inputs ---

  // token amount
  const [tokenAmount, setTokenAmount] = useState<TokenAmountState>({
    value: "",
    type: "source",
  });

  const deferredTokenAmount = useDeferredValue(tokenAmount);

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

  const { client } = useThirdwebProviderProps();

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
          fromAmount:
            tokenAmount.type === "source"
              ? deferredTokenAmount.value
              : undefined,
          // to
          toTokenAddress: isNativeToken(toToken)
            ? NATIVE_TOKEN_ADDRESS
            : toToken.address,
          toAmount:
            tokenAmount.type === "destination"
              ? deferredTokenAmount.value
              : undefined,
        }
      : undefined;

  const swapQuoteQuery = useSwapQuote(swapParams);

  const fromTokenBalanceQuery = useWalletBalance({
    account: account,
    chain: fromChain,
    tokenAddress: isNativeToken(fromToken) ? undefined : fromToken.address,
  });

  if (swapTx) {
    return (
      <WaitingForConfirmation
        onBack={() => {
          setswapTx(undefined);
          setScreen("main");
        }}
        swapTx={swapTx}
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

  // SOURCE TOKEN ----

  // if the token amount was entered by user - show that
  // else - show the loading status until the quote is loaded
  // once the quote is loaded, show the value calculated from the quote
  let sourceTokenAmount =
    tokenAmount.type === "source" ? tokenAmount.value : "";

  // if quote is loaded and
  if (swapQuoteQuery.data && !sourceTokenAmount) {
    // amount in # of tokens
    sourceTokenAmount = swapQuoteQuery.data.swapDetails.fromAmount;
  }

  // DESTINATION TOKEN ----

  let destinationTokenAmount =
    tokenAmount.type === "destination" ? tokenAmount.value : "";

  if (swapQuoteQuery.data && !destinationTokenAmount) {
    destinationTokenAmount = swapQuoteQuery.data.swapDetails.toAmount;
  }

  const isNotEnoughBalance =
    !!sourceTokenAmount &&
    !!fromTokenBalanceQuery.data &&
    Number(fromTokenBalanceQuery.data.displayValue) < Number(sourceTokenAmount);

  return (
    <Container animate="fadein">
      <Container p="lg">
        <ModalHeader title={screenLocale.title} onBack={props.onBack} />

        <Spacer y="lg" />

        {/* From */}
        <SwapInput
          value={sourceTokenAmount}
          onChange={async (value) => {
            setTokenAmount({ value, type: "source" });
          }}
          label="From"
          valueIsLoading={swapQuoteQuery.isLoading && !sourceTokenAmount}
          onTokenClick={() => setScreen("select-from-token")}
          chain={fromChain}
          token={fromToken}
          estimatedValue={
            swapQuoteQuery.data?.swapDetails.estimated.fromAmountUSDCents
          }
          onChainClick={() => setScreen("select-from-chain")}
        />

        <ToggleButton
          onClick={() => {
            // toggle amounts
            setTokenAmount({
              type: tokenAmount.type === "source" ? "destination" : "source",
              value: tokenAmount.value,
            });
            // toggle tokens
            setFromChain(toChain);
            setToChain(fromChain);
            // toggle chains
            setFromToken(toToken);
            setToToken(fromToken);
          }}
        />

        {/* To */}
        <SwapInput
          value={destinationTokenAmount}
          onChange={(value) => {
            setTokenAmount({ value, type: "destination" });
          }}
          label="To"
          valueIsLoading={swapQuoteQuery.isLoading && !destinationTokenAmount}
          onTokenClick={() => setScreen("select-to-token")}
          chain={toChain}
          token={toToken}
          estimatedValue={
            swapQuoteQuery.data?.swapDetails.estimated.toAmountMinUSDCents
          }
          onChainClick={() => setScreen("select-to-chain")}
        />

        {swapQuoteQuery.data && (
          <div>
            <Spacer y="lg" />
            <Text color="primaryText">Fee Breakdown</Text>
            <Spacer y="xs" />
            <Fees
              label="Processing Fees"
              amount={`${swapQuoteQuery.data.swapDetails.estimated.feesUSDCents / 100}`}
            />
          </div>
        )}

        {swapQuoteQuery.isError && (
          <div>
            <Spacer y="lg" />
            <Container flex="row" gap="xs" center="y" color="danger">
              <CrossCircledIcon width={iconSize.sm} height={iconSize.sm} />
              <Text color="danger" size="sm">
                Can not swap given tokens
              </Text>
            </Container>
          </div>
        )}

        {isNotEnoughBalance && (
          <div>
            <Spacer y="lg" />
            <Container flex="row" gap="xs" center="y" color="danger">
              <WalletIcon size={iconSize.sm} />
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
          disabled={
            (!swapQuoteQuery.isFetching && !swapQuoteQuery.data) ||
            isNotEnoughBalance
          }
          onClick={async () => {
            if (swapQuoteQuery.data) {
              const res = await sendSwapMutation.mutateAsync(
                swapQuoteQuery.data,
              );
              setswapTx(res);
            }
          }}
          gap="sm"
        >
          {sendSwapMutation.isPending ? (
            <>
              Awaiting confirmation
              <Spinner color="accentButtonText" size="sm" />
            </>
          ) : (
            "Purchase"
          )}
        </Button>
      </Container>
    </Container>
  );
}

function Fees(props: { label: string; amount: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Container color="secondaryText" flex="row" center="y" gap="xxs">
        <Text color="secondaryText" size="sm">
          {props.label}
        </Text>
      </Container>
      <Text color="secondaryText" size="sm">
        ${props.amount}
      </Text>
    </div>
  );
}

function ToggleButton(props: { onClick: () => void }) {
  const [animate, setAnimate] = useState(false);
  return (
    <ToggleButtonContainer>
      <Button
        variant="outline"
        data-animate={animate}
        style={{
          borderRadius: "50%",
          padding: spacing.xs,
        }}
        onClick={() => {
          props.onClick();
          setAnimate(true);
          setTimeout(() => {
            setAnimate(false);
          }, 400);
        }}
      >
        <Container color="secondaryText" flex="row" center="both">
          <ArrowTopBottom size={iconSize.sm} />
        </Container>
      </Button>
    </ToggleButtonContainer>
  );
}

const ToggleButtonContainer = /* @__PURE__ */ StyledDiv(() => {
  const theme = useCustomTheme();
  return {
    margin: "-9px 0",
    display: "flex",
    justifyContent: "center",
    button: {
      transition: "transform 0.3s, color 0.3s",
      backgroundColor: theme.colors.modalBg,
    },
    "button:hover": {
      transform: `scale(1.15)`,
      backgroundColor: theme.colors.primaryButtonBg,
      borderColor: theme.colors.primaryButtonBg,
      svg: {
        color: theme.colors.primaryButtonText,
      },
    },
    "button[data-animate='true'] svg": {
      transition: "transform 0.3s",
      transform: `rotate(180deg)`,
    },
  };
});

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
