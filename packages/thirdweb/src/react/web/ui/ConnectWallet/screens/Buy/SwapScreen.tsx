import { CrossCircledIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { useDeferredValue, useMemo, useState } from "react";
import { polygon } from "../../../../../../chains/chain-definitions/polygon.js";
import type { Chain } from "../../../../../../chains/types.js";
import { defineChain } from "../../../../../../chains/utils.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../../constants/addresses.js";
import { fallbackSwapSupportedChainIds } from "../../../../../../pay/buyWithCrypto/supportedChains.js";
import { getClientFetch } from "../../../../../../utils/fetch.js";
import type { Account } from "../../../../../../wallets/interfaces/wallet.js";
import { useChainsQuery } from "../../../../../core/hooks/others/useChainQuery.js";
import { useThirdwebProviderProps } from "../../../../../core/hooks/others/useThirdwebProviderProps.js";
import { useWalletBalance } from "../../../../../core/hooks/others/useWalletBalance.js";
import {
  useBuyWithCryptoQuote,
  type BuyWithCryptoQuoteQueryParams,
} from "../../../../../core/hooks/pay/useBuyWithCryptoQuote.js";
import {
  useActiveAccount,
  useActiveWalletChain,
} from "../../../../../core/hooks/wallets/wallet-hooks.js";
import { Spacer } from "../../../components/Spacer.js";
import { Container, Line, ModalHeader } from "../../../components/basic.js";
import { Button } from "../../../components/buttons.js";
import { Text } from "../../../components/text.js";
import { iconSize } from "../../../design-system/index.js";
import { useTrack } from "../../../hooks/useTrack.js";
import { ChainButton, NetworkSelectorContent } from "../../NetworkSelector.js";
import type { SupportedTokens } from "../../defaultTokens.js";
import { TokenSelector } from "../TokenSelector.js";
import {
  NATIVE_TOKEN,
  isNativeToken,
  type ERC20OrNativeToken,
} from "../nativeToken.js";
import { PaymentSelection } from "./PaymentSelection.js";
import { BuyTokenInput } from "./swap/BuyTokenInput.js";
import { ConfirmationScreen } from "./swap/ConfirmationScreen.js";
import { PayWithCrypto } from "./swap/PayWithCrypto.js";
import { SwapFees } from "./swap/SwapFees.js";

const fallbackSupportedChains = /* @__PURE__ */ (() =>
  fallbackSwapSupportedChainIds.map(defineChain))();

/**
 * @internal
 */
export function SwapScreen(props: {
  onBack: () => void;
  supportedTokens: SupportedTokens;
  onViewPendingTx: () => void;
}) {
  const activeChain = useActiveWalletChain();
  const account = useActiveAccount();

  if (!activeChain || !account) {
    return null; // this should never happen
  }

  return (
    <SwapScreenContent
      {...props}
      activeChain={activeChain}
      account={account}
      onViewPendingTx={props.onViewPendingTx}
    />
  );
}

type Screen =
  | "main"
  | "select-from-token"
  | "select-to-token"
  | "select-from-chain"
  | "select-to-chain"
  | "confirmation";

/**
 *
 * @internal
 */
export function SwapScreenContent(props: {
  onBack: () => void;
  supportedTokens: SupportedTokens;
  activeChain: Chain;
  account: Account;
  onViewPendingTx: () => void;
}) {
  const track = useTrack();
  const { activeChain, account } = props;
  const { client } = useThirdwebProviderProps();
  const supportedChainsQuery = useQuery({
    queryKey: ["swapSupportedChains", client],
    queryFn: async () => {
      const fetchWithHeaders = getClientFetch(client);
      const res = await fetchWithHeaders("https://pay.thirdweb-dev.com/chains");
      const data = await res.json();
      const chainIds = data.result.chainIds as number[];
      return chainIds.map(defineChain);
    },
    initialData: fallbackSupportedChains,
  });

  const supportedChains = supportedChainsQuery.data;

  // prefetch chains metadata
  useChainsQuery(supportedChains, 50);

  // screens
  const [screen, setScreen] = useState<Screen>("main");

  // token amount
  const [tokenAmount, setTokenAmount] = useState<string>("");
  const [hasEditedAmount, setHasEditedAmount] = useState(false);

  const isChainSupported = useMemo(
    () => supportedChains.includes(activeChain.id as any),
    [activeChain.id, supportedChains],
  );

  // selected chain
  const defaultChain = isChainSupported ? activeChain : polygon;
  const [fromChain, setFromChain] = useState<Chain>(defaultChain);
  const [toChain, setToChain] = useState<Chain>(defaultChain);

  // selected tokens
  const [fromToken, setFromToken] = useState<ERC20OrNativeToken>(NATIVE_TOKEN);
  const [toToken, setToToken] = useState<ERC20OrNativeToken>(
    props.supportedTokens[toChain.id]?.[0] || NATIVE_TOKEN,
  );

  const deferredTokenAmount = useDeferredValue(tokenAmount);

  const fromTokenBalanceQuery = useWalletBalance({
    account: account,
    chain: fromChain,
    tokenAddress: isNativeToken(fromToken) ? undefined : fromToken.address,
  });

  const buyWithCryptoParams: BuyWithCryptoQuoteQueryParams | undefined =
    deferredTokenAmount && !(fromChain === toChain && fromToken === toToken)
      ? {
          // wallet
          fromAddress: account.address,
          // from token
          fromChainId: fromChain.id,
          fromTokenAddress: isNativeToken(fromToken)
            ? NATIVE_TOKEN_ADDRESS
            : fromToken.address,
          toChainId: toChain.id,
          // to
          toTokenAddress: isNativeToken(toToken)
            ? NATIVE_TOKEN_ADDRESS
            : toToken.address,
          toAmount: deferredTokenAmount,
        }
      : undefined;

  const buyWithCryptoQuoteQuery = useBuyWithCryptoQuote(buyWithCryptoParams, {
    // refetch every 30 seconds
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
    gcTime: 30 * 1000,
  });

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
        chains={supportedChains}
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

  const swapQuote = buyWithCryptoQuoteQuery.data;
  const isSwapQuoteError = buyWithCryptoQuoteQuery.isError;

  const getErrorMessage = () => {
    const defaultMessage = "Unable to get price quote";
    try {
      if (buyWithCryptoQuoteQuery.error instanceof Error) {
        if (buyWithCryptoQuoteQuery.error.message.includes("Minimum")) {
          const msg = buyWithCryptoQuoteQuery.error.message;
          return msg.replace("Fetch failed: Error: ", "");
        }
      }
      return defaultMessage;
    } catch {
      return defaultMessage;
    }
  };

  const sourceTokenAmount = swapQuote?.swapDetails.fromAmount || "";

  if (screen === "confirmation" && buyWithCryptoQuoteQuery.data) {
    return (
      <ConfirmationScreen
        onBack={() => setScreen("main")}
        buyWithCryptoQuote={buyWithCryptoQuoteQuery.data}
        fromAmount={sourceTokenAmount}
        toAmount={tokenAmount}
        fromChain={fromChain}
        toChain={toChain}
        account={account}
        fromToken={fromToken}
        toToken={toToken}
        onViewPendingTx={props.onViewPendingTx}
      />
    );
  }

  const isNotEnoughBalance =
    !!sourceTokenAmount &&
    !!fromTokenBalanceQuery.data &&
    Number(fromTokenBalanceQuery.data.displayValue) < Number(sourceTokenAmount);

  const disableContinue = !swapQuote || isNotEnoughBalance;

  return (
    <Container animate="fadein">
      <Container p="lg">
        <ModalHeader title="Buy" onBack={props.onBack} />
        <Spacer y="xl" />

        {!hasEditedAmount && <Spacer y="xl" />}

        {/* To */}
        <BuyTokenInput
          value={tokenAmount}
          onChange={async (value) => {
            setHasEditedAmount(true);
            setTokenAmount(value);
          }}
          token={toToken}
          chain={toChain}
          onChainClick={() => setScreen("select-to-chain")}
          onTokenClick={() => setScreen("select-to-token")}
        />
      </Container>

      {!hasEditedAmount && <Spacer y="xxl" />}
      <Line />

      <Container p="lg">
        {hasEditedAmount && (
          <div>
            <PaymentSelection />
            <Spacer y="lg" />

            {/* From */}
            <PayWithCrypto
              value={sourceTokenAmount}
              onTokenClick={() => setScreen("select-from-token")}
              chain={fromChain}
              token={fromToken}
              isLoading={
                buyWithCryptoQuoteQuery.isLoading && !sourceTokenAmount
              }
              onChainClick={() => setScreen("select-from-chain")}
            />

            <Spacer y="lg" />

            <Container flex="column" gap="md">
              {buyWithCryptoQuoteQuery.data && (
                <div>
                  <SwapFees quote={buyWithCryptoQuoteQuery.data} />
                  <Spacer y="lg" />
                </div>
              )}

              {isSwapQuoteError && (
                <div>
                  <Container flex="row" gap="xs" center="y" color="danger">
                    <CrossCircledIcon
                      width={iconSize.sm}
                      height={iconSize.sm}
                    />
                    <Text color="danger" size="sm">
                      {getErrorMessage()}
                    </Text>
                  </Container>
                  <Spacer y="lg" />
                </div>
              )}
            </Container>
          </div>
        )}

        <Button
          variant={disableContinue ? "outline" : "accent"}
          fullWidth
          data-disabled={disableContinue}
          disabled={disableContinue}
          onClick={async () => {
            if (!disableContinue) {
              track({
                source: "ConnectButton",
                action: "continue.click",
                quote: buyWithCryptoQuoteQuery.data,
              });
              setScreen("confirmation");
            }
          }}
          gap="sm"
        >
          {isNotEnoughBalance ? "Not Enough Balance" : "Continue"}
        </Button>
      </Container>
    </Container>
  );
}
