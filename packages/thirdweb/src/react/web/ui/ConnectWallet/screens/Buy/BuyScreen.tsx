import { CrossCircledIcon } from "@radix-ui/react-icons";
import { useEffect, useMemo, useState } from "react";
import { polygon } from "../../../../../../chains/chain-definitions/polygon.js";
import type { Chain } from "../../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../../constants/addresses.js";
import { isSwapRequiredPostOnramp } from "../../../../../../pay/buyWithFiat/isSwapRequiredPostOnramp.js";
import type { PreparedTransaction } from "../../../../../../transaction/prepare-transaction.js";
import { formatNumber } from "../../../../../../utils/formatNumber.js";
import { toEther } from "../../../../../../utils/units.js";
import type {
  Account,
  Wallet,
} from "../../../../../../wallets/interfaces/wallet.js";
import { getTotalTxCostForBuy } from "../../../../../core/hooks/contract/useSendTransaction.js";
import {
  useChainQuery,
  useChainsQuery,
} from "../../../../../core/hooks/others/useChainQuery.js";
import { useWalletBalance } from "../../../../../core/hooks/others/useWalletBalance.js";
import {
  type BuyWithCryptoQuoteQueryParams,
  useBuyWithCryptoQuote,
} from "../../../../../core/hooks/pay/useBuyWithCryptoQuote.js";
import { useBuyWithFiatQuote } from "../../../../../core/hooks/pay/useBuyWithFiatQuote.js";
import {
  useActiveAccount,
  useActiveWallet,
  useActiveWalletChain,
} from "../../../../../core/hooks/wallets/wallet-hooks.js";
import { wait } from "../../../../../core/utils/wait.js";
import { LoadingScreen } from "../../../../wallets/shared/LoadingScreen.js";
import {
  Drawer,
  DrawerOverlay,
  useDrawer,
} from "../../../components/Drawer.js";
import { DynamicHeight } from "../../../components/DynamicHeight.js";
import { Skeleton } from "../../../components/Skeleton.js";
import { Spacer } from "../../../components/Spacer.js";
import { Spinner } from "../../../components/Spinner.js";
import { SwitchNetworkButton } from "../../../components/SwitchNetwork.js";
import { TokenIcon } from "../../../components/TokenIcon.js";
import { Container, Line, ModalHeader } from "../../../components/basic.js";
import { Button } from "../../../components/buttons.js";
import { Text } from "../../../components/text.js";
import {
  type Theme,
  fontSize,
  iconSize,
} from "../../../design-system/index.js";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue.js";
import type { PayUIOptions } from "../../ConnectWalletProps.js";
import type { SupportedTokens } from "../../defaultTokens.js";
import type { ConnectLocale } from "../../locale/types.js";
import { TokenSelector } from "../TokenSelector.js";
import {
  type ERC20OrNativeToken,
  NATIVE_TOKEN,
  isNativeToken,
} from "../nativeToken.js";
import { EstimatedTimeAndFees } from "./EstimatedTimeAndFees.js";
import { PayWithCreditCard } from "./PayWIthCreditCard.js";
import { PaymentSelection } from "./PaymentSelection.js";
import { FiatFlow } from "./fiat/FiatFlow.js";
import {
  type CurrencyMeta,
  defaultSelectedCurrency,
} from "./fiat/currencies.js";
import { openOnrampPopup } from "./openOnRamppopup.js";
import { BuyTokenInput } from "./swap/BuyTokenInput.js";
import { FiatFees, SwapFees } from "./swap/Fees.js";
import { PayWithCrypto } from "./swap/PayWithCrypto.js";
import { SwapFlow } from "./swap/SwapFlow.js";
import { addPendingTx } from "./swap/pendingSwapTx.js";
import { useBuySupportedChains } from "./swap/useSwapSupportedChains.js";
import { BuyTxHistoryButton } from "./tx-history/BuyTxHistoryButton.js";
import { TxDetailsScreen } from "./tx-history/TxDetailsScreen.js";
import { useBuyTransactionsToShow } from "./tx-history/useBuyTransactionsToShow.js";

// NOTE: Must not use useConnectUI here because this UI can be used outside connect ui

type BuyForTx = {
  cost: bigint;
  balance: bigint;
  tx: PreparedTransaction;
  tokenSymbol: string;
};

export type BuyScreenProps = {
  onBack?: () => void;
  supportedTokens: SupportedTokens;
  onViewPendingTx: () => void;
  client: ThirdwebClient;
  connectLocale: ConnectLocale;
  buyForTx?: BuyForTx;
  payOptions: PayUIOptions;
  theme: "light" | "dark" | Theme;
};

/**
 * @internal
 */
export default function BuyScreen(props: BuyScreenProps) {
  const activeChain = useActiveWalletChain();
  const activeWallet = useActiveWallet();
  const account = useActiveAccount();
  const supportedChainsQuery = useBuySupportedChains(props.client);

  if (!activeChain || !account || !activeWallet || !supportedChainsQuery.data) {
    return <LoadingScreen />;
  }

  return (
    <BuyScreenContent
      {...props}
      activeChain={activeChain}
      activeWallet={activeWallet}
      account={account}
      onViewPendingTx={props.onViewPendingTx}
      supportedChains={supportedChainsQuery.data}
      buyForTx={props.buyForTx}
    />
  );
}

type BuyScreenContentProps = {
  client: ThirdwebClient;
  onBack?: () => void;
  supportedTokens: SupportedTokens;
  activeChain: Chain;
  activeWallet: Wallet;
  account: Account;
  onViewPendingTx: () => void;
  supportedChains: Chain[];
  connectLocale: ConnectLocale;
  buyForTx?: BuyForTx;
  theme: "light" | "dark" | Theme;
  payOptions: PayUIOptions;
};

type Screen =
  | {
      type: "node";
      node: React.ReactNode;
    }
  | {
      type: "screen-id";
      name: "select-from-token" | "select-to-token" | "select-currency";
    }
  | {
      type: "main";
    };

/**
 * @internal
 */
export function BuyScreenContent(props: BuyScreenContentProps) {
  const { activeChain, client, supportedChains, connectLocale } = props;

  const buyWithFiatOptions = props.payOptions.buyWithFiat;
  const buyWithCryptoOptions = props.payOptions.buyWithCrypto;

  const showPaymentSelection =
    buyWithFiatOptions !== false && buyWithCryptoOptions !== false;

  const [method, setMethod] = useState<"crypto" | "creditCard">(
    buyWithCryptoOptions === false
      ? "creditCard"
      : buyWithFiatOptions === false
        ? "crypto"
        : "creditCard",
  );

  // prefetch chains metadata
  useChainsQuery(supportedChains || [], 50);

  // screens
  const [screen, setScreen] = useState<Screen>({
    type: "main",
  });
  const [drawerScreen, setDrawerScreen] = useState<React.ReactNode>();

  const { drawerRef, drawerOverlayRef, onClose } = useDrawer();

  const closeDrawer = () => {
    onClose(() => {
      setDrawerScreen(undefined);
    });
  };

  const initialTokenAmount = props.buyForTx
    ? formatNumber(
        Number(toEther(props.buyForTx.cost - props.buyForTx.balance)),
        4,
      )
    : undefined;

  // token amount
  const [tokenAmount, setTokenAmount] = useState<string>(
    initialTokenAmount ? String(initialTokenAmount) : "",
  );

  // once the user edits the tokenInput or confirms the Buy - stop updating the token amount
  const [stopUpdatingTokenAmount, setStopUpdatingTokenAmount] = useState(
    !props.buyForTx,
  );

  const [amountNeeded, setAmountNeeded] = useState<bigint | undefined>(
    props.buyForTx?.cost,
  );

  // update amount needed every 30 seconds
  // also update the token amount if allowed
  // ( Can't use useQuery because tx can't be added to queryKey )
  useEffect(() => {
    const buyTx = props.buyForTx;
    if (!buyTx || stopUpdatingTokenAmount) {
      return;
    }

    let mounted = true;

    async function pollTxCost() {
      if (!buyTx || !mounted) {
        return;
      }

      try {
        const totalCost = await getTotalTxCostForBuy(buyTx.tx);

        if (!mounted) {
          return;
        }

        setAmountNeeded(totalCost);

        if (totalCost > buyTx.balance) {
          const _tokenAmount = String(
            formatNumber(Number(toEther(totalCost - buyTx.balance)), 4),
          );
          setTokenAmount(_tokenAmount);
        }
      } catch {
        // no op
      }

      await wait(30000);
      pollTxCost();
    }

    pollTxCost();

    return () => {
      mounted = false;
    };
  }, [props.buyForTx, stopUpdatingTokenAmount]);

  const [hasEditedAmount, setHasEditedAmount] = useState(false);
  const isExpanded = props.buyForTx ? true : hasEditedAmount;

  const isChainSupported = useMemo(
    () => supportedChains?.find((c) => c.id === activeChain.id),
    [activeChain.id, supportedChains],
  );

  // selected chain
  const defaultChain = isChainSupported ? activeChain : polygon;

  const [toChain, setToChain] = useState<Chain>(
    props.buyForTx ? props.buyForTx.tx.chain : defaultChain,
  );

  const [toToken, setToToken] = useState<ERC20OrNativeToken>(NATIVE_TOKEN);
  const deferredTokenAmount = useDebouncedValue(tokenAmount, 300);

  const [fromChain, setFromChain] = useState<Chain>(
    props.buyForTx ? props.buyForTx.tx.chain : defaultChain,
  );
  const [fromToken, setFromToken] = useState<ERC20OrNativeToken>(
    props.supportedTokens[toChain.id]?.[0] || NATIVE_TOKEN,
  );

  // const [selectedCurrency, setSelectedCurrency] = useState<CurrencyMeta>(
  //   defaultSelectedCurrency,
  // );
  const selectedCurrency = defaultSelectedCurrency;
  // function showCurrencySelector() {
  //   setScreen(
  //     <CurrencySelection
  //       onSelect={(c) => {
  //         console.log("selected currency", c);
  //         setSelectedCurrency(c);
  //         closeDrawer();
  //       }}
  //       onBack={() => {
  //         setScreen(undefined);
  //       }}
  //     />,
  //   );
  // }

  if (screen.type === "node") {
    return screen.node;
  }

  function showMainScreen() {
    setScreen({
      type: "main",
    });
  }

  if (screen.type === "screen-id" && screen.name === "select-to-token") {
    return (
      <TokenSelector
        onBack={showMainScreen}
        tokenList={
          (toChain?.id ? props.supportedTokens[toChain.id] : undefined) || []
        }
        onTokenSelect={(tokenInfo) => {
          setToToken(tokenInfo);
          showMainScreen();
        }}
        chain={toChain}
        chainSelection={{
          chains: supportedChains,
          select: (c) => {
            setToChain(c);
          },
        }}
        connectLocale={connectLocale}
        client={client}
      />
    );
  }

  if (screen.type === "screen-id" && screen.name === "select-from-token") {
    return (
      <TokenSelector
        onBack={showMainScreen}
        tokenList={
          (fromChain?.id ? props.supportedTokens[fromChain.id] : undefined) ||
          []
        }
        onTokenSelect={(tokenInfo) => {
          setFromToken(tokenInfo);
          setScreen({
            type: "main",
          });
        }}
        chain={fromChain}
        chainSelection={{
          chains: supportedChains,
          select: (c) => setFromChain(c),
        }}
        connectLocale={connectLocale}
        client={client}
      />
    );
  }

  return (
    <Container animate="fadein">
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
      <div
        onClick={(e) => {
          if (
            drawerScreen &&
            drawerRef.current &&
            !drawerRef.current.contains(e.target as Node)
          ) {
            e.preventDefault();
            e.stopPropagation();
            closeDrawer();
          }
        }}
      >
        {/* Drawer */}
        {drawerScreen && (
          <>
            <DrawerOverlay ref={drawerOverlayRef} />
            <Drawer ref={drawerRef} close={closeDrawer}>
              <DynamicHeight>{drawerScreen}</DynamicHeight>
            </Drawer>
          </>
        )}

        <Container
          p="lg"
          style={{
            paddingBottom: 0,
          }}
        >
          <ModalHeader
            title={
              props.buyForTx
                ? `Not enough ${props.buyForTx.tokenSymbol}`
                : "Buy"
            }
            onBack={props.onBack}
          />

          <Spacer y="lg" />
          {!isExpanded && <Spacer y="xl" />}

          {/* Amount needed for Send Tx */}
          {amountNeeded && props.buyForTx ? (
            <BuyForTxUI
              amountNeeded={String(
                formatNumber(Number(toEther(amountNeeded)), 4),
              )}
              buyForTx={props.buyForTx}
              client={client}
            />
          ) : null}

          {/* To */}
          <BuyTokenInput
            value={tokenAmount}
            onChange={async (value) => {
              setHasEditedAmount(true);
              setStopUpdatingTokenAmount(true);
              setTokenAmount(value);
            }}
            token={toToken}
            chain={toChain}
            onSelectToken={() => {
              setScreen({
                type: "screen-id",
                name: "select-to-token",
              });
            }}
            client={props.client}
            hideTokenSelector={!!props.buyForTx}
          />
        </Container>

        <Spacer y="lg" />
        <Line />
        <Spacer y="md" />

        {isExpanded && (
          <>
            {showPaymentSelection && (
              <Container px="lg">
                <PaymentSelection selected={method} onSelect={setMethod} />
                <Spacer y="md" />
              </Container>
            )}

            {method === "crypto" && (
              <SwapScreenContent
                {...props}
                setScreen={setScreen}
                setDrawerScreen={setDrawerScreen}
                tokenAmount={deferredTokenAmount}
                toChain={toChain}
                toToken={toToken}
                setStopUpdatingTokenAmount={setStopUpdatingTokenAmount}
                fromChain={fromChain}
                fromToken={fromToken}
                showFromTokenSelector={() => {
                  setScreen({
                    type: "screen-id",
                    name: "select-from-token",
                  });
                }}
              />
            )}

            {method === "creditCard" && (
              <FiatScreenContent
                {...props}
                setScreen={setScreen}
                setDrawerScreen={setDrawerScreen}
                tokenAmount={deferredTokenAmount}
                toChain={toChain}
                toToken={toToken}
                closeDrawer={closeDrawer}
                selectedCurrency={selectedCurrency}
                showCurrencySelector={() => {
                  // currently disabled for Stripe
                }}
              />
            )}
          </>
        )}

        {!isExpanded && (
          <BuyScreenNonExpandedFooter
            client={client}
            onViewAllTransactions={props.onViewPendingTx}
            setScreen={setScreen}
          />
        )}

        <Spacer y="lg" />
      </div>
    </Container>
  );
}

function BuyScreenNonExpandedFooter(props: {
  client: ThirdwebClient;
  onViewAllTransactions: () => void;
  setScreen: (screen: Screen) => void;
}) {
  const { txInfosToShow: allList } = useBuyTransactionsToShow(props.client);
  const txInfosToShow = allList.slice(0, 3);
  const showMore = allList.length > 3;

  if (txInfosToShow.length === 0) {
    return (
      <Container px="lg">
        <Button
          variant="secondary"
          fullWidth
          disabled={true}
          data-disable={true}
        >
          Continue
        </Button>
      </Container>
    );
  }

  return (
    <Container px="lg">
      <Spacer y="xs" />
      <Text size="sm">Recent transactions</Text>
      <Spacer y="sm" />
      <Container flex="column" gap="xs">
        {txInfosToShow.map((txInfo) => {
          return (
            <BuyTxHistoryButton
              key={
                txInfo.type === "swap"
                  ? txInfo.status.source.transactionHash
                  : txInfo.status.intentId
              }
              txInfo={txInfo}
              client={props.client}
              onClick={() => {
                props.setScreen({
                  type: "node",
                  node: (
                    <TxDetailsScreen
                      client={props.client}
                      statusInfo={txInfo}
                      onBack={() =>
                        props.setScreen({
                          type: "main",
                        })
                      }
                    />
                  ),
                });
              }}
            />
          );
        })}
      </Container>

      {showMore && (
        <>
          <Spacer y="sm" />
          <Button
            onClick={props.onViewAllTransactions}
            variant="link"
            fullWidth
            style={{
              fontSize: fontSize.sm,
            }}
          >
            View all transactions
          </Button>
        </>
      )}
    </Container>
  );
}

/**
 * @internal
 */
function SwapScreenContent(
  props: BuyScreenContentProps & {
    setDrawerScreen: (screen: React.ReactNode) => void;
    setScreen: (screen: Screen) => void;
    tokenAmount: string;
    toToken: ERC20OrNativeToken;
    toChain: Chain;
    setStopUpdatingTokenAmount: (value: boolean) => void;
    fromChain: Chain;
    fromToken: ERC20OrNativeToken;
    showFromTokenSelector: () => void;
  },
) {
  const {
    setDrawerScreen,
    setStopUpdatingTokenAmount,
    setScreen,
    account,
    client,
    toChain,
    tokenAmount,
    toToken,
    fromChain,
    fromToken,
    showFromTokenSelector,
  } = props;

  const fromTokenBalanceQuery = useWalletBalance({
    address: account.address,
    chain: fromChain,
    tokenAddress: isNativeToken(fromToken) ? undefined : fromToken.address,
    client,
  });

  // when a quote is finalized ( approve sent if required or swap sent )
  // we save it here to stop refetching the quote query
  // const [finalizedQuote, setFinalizedQuote] = useState<
  //   BuyWithCryptoQuote | undefined
  // >();

  const buyWithCryptoParams: BuyWithCryptoQuoteQueryParams | undefined =
    tokenAmount && !(fromChain.id === toChain.id && fromToken === toToken)
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
          toAmount: tokenAmount,
          client,
        }
      : undefined;

  const buyWithCryptoQuoteQuery = useBuyWithCryptoQuote(buyWithCryptoParams, {
    // refetch every 30 seconds
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
    gcTime: 30 * 1000,
  });

  const swapQuote = buyWithCryptoQuoteQuery.data;

  const getErrorMessage = (err: Error) => {
    const defaultMessage = "Unable to get price quote";
    try {
      if (err instanceof Error) {
        if (err.message.includes("Minimum")) {
          const msg = err.message;
          return msg.replace("Fetch failed: Error: ", "");
        }
      }
      return defaultMessage;
    } catch {
      return defaultMessage;
    }
  };

  const sourceTokenAmount = swapQuote?.swapDetails.fromAmount || "";

  function showSwapFlow() {
    if (!buyWithCryptoQuoteQuery.data) {
      return;
    }

    setScreen({
      type: "node",
      node: (
        <SwapFlow
          client={client}
          onBack={() => {
            setStopUpdatingTokenAmount(true);
            setScreen({
              type: "main",
            });
          }}
          buyWithCryptoQuote={buyWithCryptoQuoteQuery.data}
          account={account}
          onViewPendingTx={props.onViewPendingTx}
          isFiatFlow={false}
        />
      ),
    });
  }

  const isNotEnoughBalance =
    !!sourceTokenAmount &&
    !!fromTokenBalanceQuery.data &&
    Number(fromTokenBalanceQuery.data.displayValue) < Number(sourceTokenAmount);

  const disableSwapContinue = !swapQuote || isNotEnoughBalance;
  const switchChainRequired = props.activeChain.id !== fromChain.id;

  const errorToShow = buyWithCryptoQuoteQuery.error;

  function showFees() {
    if (!swapQuote) {
      return;
    }

    setDrawerScreen(
      <div>
        <Text size="lg" color="primaryText">
          Fees
        </Text>

        <Spacer y="lg" />
        <SwapFees quote={swapQuote} align="left" />
      </div>,
    );
  }

  return (
    <Container px="lg">
      <PayWithCrypto
        value={sourceTokenAmount}
        onSelectToken={showFromTokenSelector}
        chain={fromChain}
        token={fromToken}
        isLoading={buyWithCryptoQuoteQuery.isLoading && !sourceTokenAmount}
        client={client}
      />
      <EstimatedTimeAndFees
        quoteIsLoading={buyWithCryptoQuoteQuery.isLoading}
        estimatedSeconds={
          buyWithCryptoQuoteQuery.data?.swapDetails.estimated.durationSeconds
        }
        onViewFees={showFees}
      />

      <Spacer y="md" />

      {errorToShow && (
        <>
          <ErrorMessage message={getErrorMessage(errorToShow)} />
          <Spacer y="md" />
        </>
      )}

      {switchChainRequired && (
        <SwitchNetworkButton variant="accent" fullWidth chain={fromChain} />
      )}

      {!switchChainRequired && (
        <Button
          variant={disableSwapContinue ? "outline" : "accent"}
          fullWidth
          data-disabled={disableSwapContinue}
          disabled={disableSwapContinue}
          onClick={async () => {
            if (!disableSwapContinue) {
              showSwapFlow();
            }
          }}
          gap="xs"
        >
          {isNotEnoughBalance ? (
            <Text color="danger">Not Enough Funds</Text>
          ) : buyWithCryptoQuoteQuery.isLoading ? (
            <>
              <Spinner size="sm" color="accentText" />
              Getting price quote
            </>
          ) : (
            "Continue"
          )}
        </Button>
      )}
    </Container>
  );
}

/**
 * @internal
 */
function FiatScreenContent(
  props: BuyScreenContentProps & {
    setDrawerScreen: (screen: React.ReactNode) => void;
    setScreen: (screen: Screen) => void;
    tokenAmount: string;
    toToken: ERC20OrNativeToken;
    toChain: Chain;
    closeDrawer: () => void;
    selectedCurrency: CurrencyMeta;
    showCurrencySelector: () => void;
  },
) {
  const {
    toToken,
    tokenAmount,
    account,
    client,
    setScreen,
    setDrawerScreen,
    toChain,
    showCurrencySelector,
    selectedCurrency,
  } = props;

  const buyWithFiatOptions = props.payOptions.buyWithFiat;

  const fiatQuoteQuery = useBuyWithFiatQuote(
    buyWithFiatOptions !== false && tokenAmount
      ? {
          fromCurrencySymbol: selectedCurrency.shorthand,
          toChainId: toChain.id,
          fromAddress: account.address,
          toAddress: account.address,
          toTokenAddress: isNativeToken(toToken)
            ? NATIVE_TOKEN_ADDRESS
            : toToken.address,
          toAmount: tokenAmount,
          client,
          isTestMode: buyWithFiatOptions?.testMode,
          provider: "STRIPE", // TODO - change when we have multiple providers
        }
      : undefined,
  );

  function handleSubmit() {
    if (!fiatQuoteQuery.data) {
      return;
    }

    const hasTwoSteps = isSwapRequiredPostOnramp(fiatQuoteQuery.data);
    let openedWindow: Window | null = null;

    if (!hasTwoSteps) {
      openedWindow = openOnrampPopup(
        fiatQuoteQuery.data.onRampLink,
        typeof props.theme === "string" ? props.theme : props.theme.type,
      );

      addPendingTx({
        type: "fiat",
        intentId: fiatQuoteQuery.data.intentId,
      });
    }

    setScreen({
      type: "node",
      node: (
        <FiatFlow
          quote={fiatQuoteQuery.data}
          onBack={() => {
            setScreen({
              type: "main",
            });
          }}
          client={client}
          testMode={
            buyWithFiatOptions !== false
              ? buyWithFiatOptions?.testMode || false
              : false
          }
          theme={
            typeof props.theme === "string" ? props.theme : props.theme.type
          }
          onViewPendingTx={props.onViewPendingTx}
          openedWindow={openedWindow}
        />
      ),
    });
  }

  function showFees() {
    if (!fiatQuoteQuery.data) {
      return;
    }

    setDrawerScreen(
      <div>
        <Text size="lg" color="primaryText">
          Fees
        </Text>

        <Spacer y="lg" />
        <FiatFees quote={fiatQuoteQuery.data} />
      </div>,
    );
  }

  function getErrorMessage(err: Error) {
    const defaultMessage = "Unable to get price quote";
    try {
      if (err instanceof Error) {
        if (err.message.includes("Minimum")) {
          const msg = err.message;
          return msg.replace("Fetch failed: Error: ", "");
        }
      }
      return defaultMessage;
    } catch {
      return defaultMessage;
    }
  }

  const disableSubmit = !fiatQuoteQuery.data;

  return (
    <Container px="lg">
      {/* Show Currency Selector + Calculated Amount */}
      <PayWithCreditCard
        isLoading={fiatQuoteQuery.isLoading}
        value={fiatQuoteQuery.data?.fromCurrencyWithFees.amount}
        client={client}
        currency={selectedCurrency}
        onSelectCurrency={showCurrencySelector}
        disableCurrencySelection={true}
      />
      {/* Estimated time + View fees button */}
      <EstimatedTimeAndFees
        quoteIsLoading={fiatQuoteQuery.isLoading}
        estimatedSeconds={fiatQuoteQuery.data?.estimatedDurationSeconds}
        onViewFees={showFees}
      />

      <Spacer y="md" />

      {/* Error message */}
      {fiatQuoteQuery.error && (
        <>
          <ErrorMessage message={getErrorMessage(fiatQuoteQuery.error)} />
          <Spacer y="md" />
        </>
      )}

      {/* Submit */}
      <Button
        variant={disableSubmit ? "outline" : "accent"}
        data-disabled={disableSubmit}
        disabled={disableSubmit}
        fullWidth
        onClick={handleSubmit}
        gap="xs"
      >
        {fiatQuoteQuery.isLoading ? (
          <>
            <Spinner size="sm" color="accentText" />
            Getting price quote
          </>
        ) : (
          "Continue"
        )}
      </Button>
    </Container>
  );
}

function BuyForTxUI(props: {
  amountNeeded: string;
  buyForTx: BuyForTx;
  client: ThirdwebClient;
}) {
  const chainQuery = useChainQuery(props.buyForTx.tx.chain);

  return (
    <Container>
      <Spacer y="xs" />
      <Container
        flex="row"
        style={{
          justifyContent: "space-between",
        }}
      >
        <Text size="sm">Amount Needed</Text>
        <Container
          flex="column"
          style={{
            alignItems: "flex-end",
          }}
        >
          <Container flex="row" gap="xs" center="y">
            <Text color="primaryText" size="sm">
              {props.amountNeeded} {props.buyForTx.tokenSymbol}
            </Text>
            <TokenIcon
              chain={props.buyForTx.tx.chain}
              client={props.client}
              size="sm"
              token={NATIVE_TOKEN}
            />
          </Container>
          <Spacer y="xxs" />
          {chainQuery.data ? (
            <Text size="sm"> {chainQuery.data.name}</Text>
          ) : (
            <Skeleton height={fontSize.sm} width="50px" />
          )}
        </Container>
      </Container>

      <Spacer y="md" />
      <Line />
      <Spacer y="md" />

      <Container
        flex="row"
        style={{
          justifyContent: "space-between",
        }}
      >
        <Text size="sm">Your Balance</Text>
        <Container flex="row" gap="xs">
          <Text color="primaryText" size="sm">
            {formatNumber(Number(toEther(props.buyForTx.balance)), 4)}{" "}
            {props.buyForTx.tokenSymbol}
          </Text>
          <TokenIcon
            chain={props.buyForTx.tx.chain}
            client={props.client}
            size="sm"
            token={NATIVE_TOKEN}
          />
        </Container>
      </Container>

      <Spacer y="md" />
      <Line />
      <Spacer y="lg" />

      <Text center size="sm">
        Purchase
      </Text>
      <Spacer y="xxs" />
    </Container>
  );
}

function ErrorMessage(props: {
  message: string;
}) {
  return (
    <Container flex="row" gap="xxs" center="both" color="danger">
      <CrossCircledIcon width={iconSize.sm} height={iconSize.sm} />
      <Text color="danger" size="sm">
        {props.message}
      </Text>
    </Container>
  );
}
