import { useMemo, useState } from "react";
import type { Chain } from "../../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../../constants/addresses.js";
import type { GetBuyWithCryptoQuoteParams } from "../../../../../../pay/buyWithCrypto/getQuote.js";
import { isSwapRequiredPostOnramp } from "../../../../../../pay/buyWithFiat/isSwapRequiredPostOnramp.js";
import { formatNumber } from "../../../../../../utils/formatNumber.js";
import { toEther } from "../../../../../../utils/units.js";
import type { Account } from "../../../../../../wallets/interfaces/wallet.js";
import {
  type Theme,
  fontSize,
  spacing,
} from "../../../../../core/design-system/index.js";
import {
  useChainQuery,
  useChainsQuery,
} from "../../../../../core/hooks/others/useChainQuery.js";
import { useWalletBalance } from "../../../../../core/hooks/others/useWalletBalance.js";
import { useBuyWithCryptoQuote } from "../../../../../core/hooks/pay/useBuyWithCryptoQuote.js";
import { useBuyWithFiatQuote } from "../../../../../core/hooks/pay/useBuyWithFiatQuote.js";
import { useActiveAccount } from "../../../../hooks/wallets/useActiveAccount.js";
import { useActiveWalletChain } from "../../../../hooks/wallets/useActiveWalletChain.js";
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
import type { PayUIOptions } from "../../ConnectButtonProps.js";
import { ChainButton, NetworkSelectorContent } from "../../NetworkSelector.js";
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
import { CurrencySelection } from "./fiat/CurrencySelection.js";
import { FiatFlow } from "./fiat/FiatFlow.js";
import type { CurrencyMeta } from "./fiat/currencies.js";
import type { BuyForTx, SelectedScreen } from "./main/types.js";
import { useBuyTxStates } from "./main/useBuyTxStates.js";
import { useEnabledPaymentMethods } from "./main/useEnabledPaymentMethods.js";
import { useUISelectionStates } from "./main/useUISelectionStates.js";
import { openOnrampPopup } from "./openOnRamppopup.js";
import { BuyTokenInput } from "./swap/BuyTokenInput.js";
import { FiatFees, SwapFees } from "./swap/Fees.js";
import { PayWithCrypto } from "./swap/PayWithCrypto.js";
import { SwapFlow } from "./swap/SwapFlow.js";
import { addPendingTx } from "./swap/pendingSwapTx.js";
import {
  type SupportedChainAndTokens,
  useBuySupportedDestinations,
  useBuySupportedSources,
} from "./swap/useSwapSupportedChains.js";

// NOTE: Must not use useConnectUI here because this UI can be used outside connect ui

export type BuyScreenProps = {
  onBack?: () => void;
  supportedTokens?: SupportedTokens;
  onViewPendingTx: () => void;
  client: ThirdwebClient;
  connectLocale: ConnectLocale;
  buyForTx?: BuyForTx;
  payOptions: PayUIOptions;
  theme: "light" | "dark" | Theme;
  onDone: () => void;
  connectButton?: React.ReactNode;
  isEmbed: boolean;
};

/**
 * @internal
 */
export default function BuyScreen(props: BuyScreenProps) {
  const supportedDestinationsQuery = useBuySupportedDestinations(props.client);

  if (!supportedDestinationsQuery.data) {
    return <LoadingScreen />;
  }

  return (
    <BuyScreenContent
      {...props}
      onViewPendingTx={props.onViewPendingTx}
      supportedDestinations={supportedDestinationsQuery.data}
      buyForTx={props.buyForTx}
    />
  );
}

type BuyScreenContentProps = {
  client: ThirdwebClient;
  onBack?: () => void;
  supportedTokens?: SupportedTokens;
  onViewPendingTx: () => void;
  supportedDestinations: SupportedChainAndTokens;
  connectLocale: ConnectLocale;
  buyForTx?: BuyForTx;
  theme: "light" | "dark" | Theme;
  payOptions: PayUIOptions;
  onDone: () => void;
  connectButton?: React.ReactNode;
  isEmbed: boolean;
};

function useBuyScreenStates(options: { payOptions: PayUIOptions }) {
  const { payOptions } = options;

  const [method, setMethod] = useState<"crypto" | "creditCard">(
    payOptions.buyWithCrypto === false
      ? "creditCard"
      : payOptions.buyWithFiat === false
        ? "crypto"
        : "creditCard",
  );

  const [screen, setScreen] = useState<SelectedScreen>({
    type: "main",
  });

  const [drawerScreen, setDrawerScreen] = useState<React.ReactNode>();
  const { drawerRef, drawerOverlayRef, onClose } = useDrawer();

  function closeDrawer() {
    onClose(() => {
      setDrawerScreen(undefined);
    });
  }

  function showMainScreen() {
    setScreen({
      type: "main",
    });
  }

  return {
    method,
    setMethod,
    screen,
    setScreen,
    drawerScreen,
    setDrawerScreen,
    drawerRef,
    drawerOverlayRef,
    closeDrawer,
    showMainScreen,
  };
}

/**
 * @internal
 */
function BuyScreenContent(props: BuyScreenContentProps) {
  const { client, supportedDestinations, connectLocale, payOptions, buyForTx } =
    props;

  const account = useActiveAccount();
  const activeChain = useActiveWalletChain();

  // prefetch chains metadata for destination chains
  useChainsQuery(supportedDestinations.map((x) => x.chain) || [], 50);

  // screen
  const {
    method,
    setMethod,
    screen,
    setScreen,
    drawerScreen,
    setDrawerScreen,
    drawerRef,
    drawerOverlayRef,
    closeDrawer,
    showMainScreen,
  } = useBuyScreenStates({ payOptions });

  // UI selection
  const {
    tokenAmount,
    setTokenAmount,
    setHasEditedAmount,
    hasEditedAmount,
    toChain,
    setToChain,
    deferredTokenAmount,
    fromChain,
    setFromChain,
    toToken,
    setToToken,
    fromToken,
    setFromToken,
    selectedCurrency,
    setSelectedCurrency,
  } = useUISelectionStates({
    payOptions,
    buyForTx,
    supportedDestinations,
  });

  // Buy Transaction flow states
  const { amountNeeded } = useBuyTxStates({
    setTokenAmount,
    buyForTx,
    hasEditedAmount,
    isMainScreen: screen.type === "main",
    account,
  });

  // check if the screen is expanded or not
  const isExpanded = activeChain && tokenAmount;

  // update supportedSources whenever toToken or toChain is updated
  const supportedSourcesQuery = useBuySupportedSources({
    client: props.client,
    destinationChainId: toChain.id,
    destinationTokenAddress: isNativeToken(toToken)
      ? NATIVE_TOKEN_ADDRESS
      : toToken.address,
  });

  const destinationSupportedTokens: SupportedTokens = useMemo(() => {
    return createSupportedTokens(
      supportedDestinations,
      payOptions,
      props.supportedTokens,
    );
  }, [props.supportedTokens, supportedDestinations, payOptions]);

  const sourceSupportedTokens: SupportedTokens | undefined = useMemo(() => {
    if (!supportedSourcesQuery.data) {
      return undefined;
    }

    return createSupportedTokens(
      supportedSourcesQuery.data,
      payOptions,
      props.supportedTokens,
    );
  }, [props.supportedTokens, supportedSourcesQuery.data, payOptions]);

  const { showPaymentSelection } = useEnabledPaymentMethods({
    payOptions,
    supportedDestinations,
    toChain,
    toToken,
    method,
    setMethod,
  });

  // screens ----------------------------

  if (screen.type === "node") {
    return screen.node;
  }

  if (screen.type === "select-currency") {
    return (
      <CurrencySelection
        onSelect={(currency) => {
          showMainScreen();
          setSelectedCurrency(currency);
        }}
        onBack={showMainScreen}
      />
    );
  }

  if (screen.type === "screen-id" && screen.name === "select-to-token") {
    const chains = supportedDestinations.map((x) => x.chain);
    // if token selection is disabled - only show network selector screen
    if (payOptions.prefillBuy?.allowEdits?.token === false) {
      return (
        <ChainSelectionScreen
          chains={chains}
          client={props.client}
          connectLocale={props.connectLocale}
          setChain={setToChain}
          showMainScreen={showMainScreen}
        />
      );
    }

    return (
      <TokenSelector
        onBack={showMainScreen}
        tokenList={(
          (toChain?.id ? destinationSupportedTokens[toChain.id] : undefined) ||
          []
        ).filter((x) => x.address !== NATIVE_TOKEN_ADDRESS)}
        onTokenSelect={(tokenInfo) => {
          setToToken(tokenInfo);
          showMainScreen();
        }}
        chain={toChain}
        chainSelection={
          // hide chain selection if it's disabled
          payOptions.prefillBuy?.allowEdits?.chain !== false
            ? {
                chains: chains,
                select: (c) => {
                  setToChain(c);
                },
              }
            : undefined
        }
        connectLocale={connectLocale}
        client={client}
      />
    );
  }

  if (
    screen.type === "screen-id" &&
    screen.name === "select-from-token" &&
    supportedSourcesQuery.data &&
    sourceSupportedTokens
  ) {
    const chains = supportedSourcesQuery.data.map((x) => x.chain);
    // if token selection is disabled - only show network selector screen
    if (
      payOptions.buyWithCrypto !== false &&
      payOptions.buyWithCrypto?.prefillSource?.allowEdits?.token === false
    ) {
      return (
        <ChainSelectionScreen
          chains={chains}
          client={props.client}
          connectLocale={props.connectLocale}
          setChain={setFromChain}
          showMainScreen={showMainScreen}
        />
      );
    }

    return (
      <TokenSelector
        onBack={showMainScreen}
        tokenList={(
          (fromChain?.id ? sourceSupportedTokens[fromChain.id] : undefined) ||
          []
        ).filter((x) => x.address !== NATIVE_TOKEN_ADDRESS)}
        onTokenSelect={(tokenInfo) => {
          setFromToken(tokenInfo);
          setScreen({
            type: "main",
          });
        }}
        chain={fromChain}
        chainSelection={
          // hide chain selection if it's disabled
          payOptions.buyWithCrypto !== false &&
          payOptions.buyWithCrypto?.prefillSource?.allowEdits?.chain !== false
            ? {
                chains: supportedSourcesQuery.data.map((x) => x.chain),
                select: (c) => setFromChain(c),
              }
            : undefined
        }
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
              setTokenAmount(value);
            }}
            freezeAmount={payOptions.prefillBuy?.allowEdits?.amount === false}
            freezeChainAndToken={
              payOptions.prefillBuy?.allowEdits?.chain === false &&
              payOptions.prefillBuy?.allowEdits?.token === false
            }
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

        {showPaymentSelection ? <Spacer y="lg" /> : <Spacer y="md" />}

        {isExpanded && (
          <>
            {showPaymentSelection && (
              <Container px="lg">
                <PaymentSelection selected={method} onSelect={setMethod} />
                <Spacer y="md" />
              </Container>
            )}

            {method === "crypto" && account && activeChain && (
              <SwapScreenContent
                {...props}
                setScreen={setScreen}
                setDrawerScreen={setDrawerScreen}
                tokenAmount={deferredTokenAmount}
                toChain={toChain}
                toToken={toToken}
                fromChain={fromChain}
                fromToken={fromToken}
                showFromTokenSelector={() => {
                  setScreen({
                    type: "screen-id",
                    name: "select-from-token",
                  });
                }}
                account={account}
                activeChain={activeChain}
              />
            )}

            {method === "creditCard" && account && (
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
                  setScreen({
                    type: "select-currency",
                  });
                }}
                account={account}
              />
            )}

            <Spacer y="sm" />
          </>
        )}

        <Container px="lg" flex="column" gap="sm">
          {!isExpanded && (
            <>
              {!account && props.connectButton ? (
                <div>{props.connectButton}</div>
              ) : (
                <Button
                  variant="accent"
                  fullWidth
                  disabled={true}
                  data-disable={true}
                >
                  Continue
                </Button>
              )}
            </>
          )}

          {account && (
            <Button
              variant="outline"
              fullWidth
              style={{
                padding: spacing.xs,
                fontSize: fontSize.sm,
              }}
              onClick={props.onViewPendingTx}
            >
              View all transactions
            </Button>
          )}
        </Container>

        <Spacer y="lg" />
      </div>
    </Container>
  );
}

function SwapScreenContent(
  props: BuyScreenContentProps & {
    setDrawerScreen: (screen: React.ReactNode) => void;
    setScreen: (screen: SelectedScreen) => void;
    tokenAmount: string;
    toToken: ERC20OrNativeToken;
    toChain: Chain;
    fromChain: Chain;
    fromToken: ERC20OrNativeToken;
    showFromTokenSelector: () => void;
    account: Account;
    activeChain: Chain;
  },
) {
  const {
    setDrawerScreen,
    setScreen,
    account,
    client,
    toChain,
    tokenAmount,
    toToken,
    fromChain,
    fromToken,
    showFromTokenSelector,
    payOptions,
  } = props;

  const fromTokenBalanceQuery = useWalletBalance({
    address: account.address,
    chain: fromChain,
    tokenAddress: isNativeToken(fromToken) ? undefined : fromToken.address,
    client,
  });

  const quoteParams: GetBuyWithCryptoQuoteParams | undefined =
    tokenAmount && !(fromChain.id === toChain.id && fromToken === toToken)
      ? {
          // wallet
          fromAddress: account.address,
          // from
          fromChainId: fromChain.id,
          fromTokenAddress: isNativeToken(fromToken)
            ? NATIVE_TOKEN_ADDRESS
            : fromToken.address,
          // to
          toChainId: toChain.id,
          toTokenAddress: isNativeToken(toToken)
            ? NATIVE_TOKEN_ADDRESS
            : toToken.address,
          toAmount: tokenAmount,
          client,
        }
      : undefined;

  const quoteQuery = useBuyWithCryptoQuote(quoteParams, {
    // refetch every 30 seconds
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
    gcTime: 30 * 1000,
  });

  const sourceTokenAmount = quoteQuery.data?.swapDetails.fromAmount;

  const isNotEnoughBalance =
    !!sourceTokenAmount &&
    !!fromTokenBalanceQuery.data &&
    Number(fromTokenBalanceQuery.data.displayValue) < Number(sourceTokenAmount);

  const disableContinue = !quoteQuery.data || isNotEnoughBalance;
  const switchChainRequired = props.activeChain.id !== fromChain.id;

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

  function showSwapFlow() {
    if (!quoteQuery.data) {
      return;
    }

    setScreen({
      type: "node",
      node: (
        <SwapFlow
          isBuyForTx={!!props.buyForTx}
          isEmbed={props.isEmbed}
          client={client}
          onBack={() => {
            setScreen({
              type: "main",
            });
          }}
          buyWithCryptoQuote={quoteQuery.data}
          account={account}
          onViewPendingTx={props.onViewPendingTx}
          isFiatFlow={false}
          onDone={props.onDone}
          onTryAgain={() => {
            setScreen({
              type: "main",
            });
            quoteQuery.refetch();
          }}
        />
      ),
    });
  }

  function showFees() {
    if (!quoteQuery.data) {
      return;
    }

    setDrawerScreen(
      <div>
        <Text size="lg" color="primaryText">
          Fees
        </Text>
        <Spacer y="lg" />
        <SwapFees quote={quoteQuery.data} align="left" />
      </div>,
    );
  }

  const prefillSource =
    payOptions.buyWithCrypto !== false
      ? payOptions.buyWithCrypto?.prefillSource
      : undefined;

  return (
    <Container px="lg" flex="column" gap="md">
      {/* Quote info */}
      <div>
        <PayWithCrypto
          value={sourceTokenAmount || ""}
          onSelectToken={showFromTokenSelector}
          chain={fromChain}
          token={fromToken}
          isLoading={quoteQuery.isLoading && !sourceTokenAmount}
          client={client}
          freezeChainAndTokenSelection={
            prefillSource?.allowEdits?.chain === false &&
            prefillSource?.allowEdits?.token === false
          }
        />
        <EstimatedTimeAndFees
          quoteIsLoading={quoteQuery.isLoading}
          estimatedSeconds={
            quoteQuery.data?.swapDetails.estimated.durationSeconds
          }
          onViewFees={showFees}
        />
      </div>

      {/* Error */}
      {quoteQuery.error && (
        <Text color="danger" size="sm" center>
          {getErrorMessage(quoteQuery.error)}
        </Text>
      )}

      {/* Button */}
      {switchChainRequired &&
      !quoteQuery.isLoading &&
      !isNotEnoughBalance &&
      !quoteQuery.error ? (
        <SwitchNetworkButton variant="accent" fullWidth chain={fromChain} />
      ) : (
        <Button
          variant={disableContinue ? "outline" : "accent"}
          fullWidth
          data-disabled={disableContinue}
          disabled={disableContinue}
          onClick={async () => {
            if (!disableContinue) {
              showSwapFlow();
            }
          }}
          gap="xs"
        >
          {isNotEnoughBalance ? (
            <Text color="danger">Not Enough Funds</Text>
          ) : quoteQuery.isLoading ? (
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

function FiatScreenContent(
  props: BuyScreenContentProps & {
    setDrawerScreen: (screen: React.ReactNode) => void;
    setScreen: (screen: SelectedScreen) => void;
    tokenAmount: string;
    toToken: ERC20OrNativeToken;
    toChain: Chain;
    closeDrawer: () => void;
    selectedCurrency: CurrencyMeta;
    showCurrencySelector: () => void;
    account: Account;
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
          toAddress: account.address,
          toTokenAddress: isNativeToken(toToken)
            ? NATIVE_TOKEN_ADDRESS
            : toToken.address,
          toAmount: tokenAmount,
          client,
          isTestMode: buyWithFiatOptions?.testMode,
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
          isBuyForTx={!!props.buyForTx}
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
          onDone={props.onDone}
          isEmbed={props.isEmbed}
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

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  function getErrorMessage(err: any): string[] {
    type AmountTooLowError = {
      code: "MINIMUM_PURCHASE_AMOUNT";
      data: {
        minimumAmountUSDCents: number;
        requestedAmountUSDCents: number;
      };
    };

    const defaultMessage = "Unable to get price quote";
    try {
      if (err.error.code === "MINIMUM_PURCHASE_AMOUNT") {
        const obj = err.error as AmountTooLowError;
        return [
          `Minimum purchase amount is $${obj.data.minimumAmountUSDCents / 100}`,
          `Requested amount is $${obj.data.requestedAmountUSDCents / 100}`,
        ];
      }
    } catch {}

    return [defaultMessage];
  }

  const disableSubmit = !fiatQuoteQuery.data;

  return (
    <Container px="lg" flex="column" gap="md">
      {/* Show Calculated Fiat Amount */}
      <div>
        <PayWithCreditCard
          isLoading={fiatQuoteQuery.isLoading}
          value={fiatQuoteQuery.data?.fromCurrencyWithFees.amount}
          client={client}
          currency={selectedCurrency}
          onSelectCurrency={showCurrencySelector}
        />
        {/* Estimated time + View fees button */}
        <EstimatedTimeAndFees
          quoteIsLoading={fiatQuoteQuery.isLoading}
          estimatedSeconds={fiatQuoteQuery.data?.estimatedDurationSeconds}
          onViewFees={showFees}
        />
      </div>

      {/* Error message */}
      {fiatQuoteQuery.error && (
        <div>
          {getErrorMessage(fiatQuoteQuery.error).map((msg) => (
            <Text color="danger" size="sm" center multiline key={msg}>
              {msg}
            </Text>
          ))}
        </div>
      )}

      {/* Continue */}
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

function createSupportedTokens(
  data: SupportedChainAndTokens,
  payOptions: PayUIOptions,
  supportedTokensOverrides?: SupportedTokens,
): SupportedTokens {
  const tokens: SupportedTokens = {};

  const isBuyWithFiatDisabled = payOptions.buyWithFiat === false;
  const isBuyWithCryptoDisabled = payOptions.buyWithCrypto === false;

  for (const x of data) {
    tokens[x.chain.id] = x.tokens.filter((t) => {
      // it token supports both - include it
      if (t.buyWithCryptoEnabled && t.buyWithFiatEnabled) {
        return true;
      }

      // if buyWithFiat is disabled, and buyWithCrypto is not supported by token - exclude the token
      if (!t.buyWithCryptoEnabled && isBuyWithFiatDisabled) {
        return false;
      }

      // if buyWithCrypto is disabled, and buyWithFiat is not supported by token - exclude the token
      if (!t.buyWithFiatEnabled && isBuyWithCryptoDisabled) {
        return false;
      }

      return true; // include the token
    });
  }

  // override with props.supportedTokens
  if (supportedTokensOverrides) {
    for (const k in supportedTokensOverrides) {
      const key = Number(k);
      const tokenList = supportedTokensOverrides[key];

      if (tokenList) {
        tokens[key] = tokenList;
      }
    }
  }

  return tokens;
}

function ChainSelectionScreen(props: {
  showMainScreen: () => void;
  chains: Chain[];
  client: ThirdwebClient;
  connectLocale: ConnectLocale;
  setChain: (chain: Chain) => void;
}) {
  return (
    <NetworkSelectorContent
      client={props.client}
      connectLocale={props.connectLocale}
      showTabs={false}
      onBack={props.showMainScreen}
      chains={props.chains}
      closeModal={props.showMainScreen}
      networkSelector={{
        renderChain(renderChainProps) {
          return (
            <ChainButton
              chain={renderChainProps.chain}
              confirming={false}
              switchingFailed={false}
              onClick={() => {
                props.setChain(renderChainProps.chain);
                props.showMainScreen();
              }}
              client={props.client}
              connectLocale={props.connectLocale}
            />
          );
        },
      }}
    />
  );
}
