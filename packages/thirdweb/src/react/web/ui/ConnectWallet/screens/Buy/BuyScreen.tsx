import { IdCardIcon } from "@radix-ui/react-icons";
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
  iconSize,
  spacing,
} from "../../../../../core/design-system/index.js";
import type { PayUIOptions } from "../../../../../core/hooks/connection/ConnectButtonProps.js";
import { useChainName } from "../../../../../core/hooks/others/useChainQuery.js";
import { useWalletBalance } from "../../../../../core/hooks/others/useWalletBalance.js";
import { useBuyWithCryptoQuote } from "../../../../../core/hooks/pay/useBuyWithCryptoQuote.js";
import { useBuyWithFiatQuote } from "../../../../../core/hooks/pay/useBuyWithFiatQuote.js";
import type { SupportedTokens } from "../../../../../core/utils/defaultTokens.js";
import { useActiveAccount } from "../../../../hooks/wallets/useActiveAccount.js";
import { LoadingScreen } from "../../../../wallets/shared/LoadingScreen.js";
import type { PayEmbedConnectOptions } from "../../../PayEmbed.js";
import { ChainName } from "../../../components/ChainName.js";
import {
  Drawer,
  DrawerOverlay,
  useDrawer,
} from "../../../components/Drawer.js";
import { Skeleton } from "../../../components/Skeleton.js";
import { Spacer } from "../../../components/Spacer.js";
import { Spinner } from "../../../components/Spinner.js";
import { SwitchNetworkButton } from "../../../components/SwitchNetwork.js";
import { TokenIcon } from "../../../components/TokenIcon.js";
import { Container, Line, ModalHeader } from "../../../components/basic.js";
import { Button } from "../../../components/buttons.js";
import { Text } from "../../../components/text.js";
import { TokenSymbol } from "../../../components/token/TokenSymbol.js";
import { ConnectButton } from "../../ConnectButton.js";
import { ChainButton, NetworkSelectorContent } from "../../NetworkSelector.js";
import { CoinsIcon } from "../../icons/CoinsIcon.js";
import type { ConnectLocale } from "../../locale/types.js";
import { TokenSelector } from "../TokenSelector.js";
import { WalletSwitcherConnectionScreen } from "../WalletSwitcherConnectionScreen.js";
import {
  type ERC20OrNativeToken,
  NATIVE_TOKEN,
  isNativeToken,
} from "../nativeToken.js";
import { EstimatedTimeAndFees } from "./EstimatedTimeAndFees.js";
import { PayTokenIcon } from "./PayTokenIcon.js";
import { PayWithCreditCard } from "./PayWIthCreditCard.js";
import { ReceiverWalletDrawerScreen } from "./ReceiverWalletSelectionScreen.js";
import { WalletSelectorButton } from "./WalletSelectorButton.js";
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
import { WalletSwitcherDrawerContent } from "./swap/WalletSwitcherDrawerContent.js";
import { addPendingTx } from "./swap/pendingSwapTx.js";
import {
  type SupportedChainAndTokens,
  useBuySupportedDestinations,
  useBuySupportedSources,
} from "./swap/useSwapSupportedChains.js";
import type { PayerInfo } from "./types.js";
import { usePayerSetup } from "./usePayerSetup.js";

// NOTE: Must not use useConnectUI here because this UI can be used outside connect ui

export type BuyScreenProps = {
  onBack: (() => void) | undefined;
  supportedTokens: SupportedTokens | undefined;
  onViewPendingTx: () => void;
  client: ThirdwebClient;
  connectLocale: ConnectLocale;
  buyForTx: BuyForTx | undefined;
  payOptions: PayUIOptions;
  theme: "light" | "dark" | Theme;
  onDone: () => void;
  connectOptions: PayEmbedConnectOptions | undefined;
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
  connectOptions: PayEmbedConnectOptions | undefined;
  isEmbed: boolean;
};

/**
 * @internal
 */
function BuyScreenContent(props: BuyScreenContentProps) {
  const { client, supportedDestinations, connectLocale, payOptions, buyForTx } =
    props;

  const activeAccount = useActiveAccount();
  const { payer, setPayer } = usePayerSetup();

  const [screen, setScreen] = useState<SelectedScreen>({
    id: "main",
  });

  // UI selection
  const {
    tokenAmount,
    setTokenAmount,
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

  // check if the screen is expanded or not

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

  // screens ----------------------------

  if (screen.id === "connect-payer-wallet") {
    return (
      <WalletSwitcherConnectionScreen
        accountAbstraction={props.connectOptions?.accountAbstraction}
        appMetadata={props.connectOptions?.appMetadata}
        chain={props.connectOptions?.chain}
        chains={props.connectOptions?.chains}
        client={props.client}
        connectLocale={props.connectLocale}
        isEmbed={props.isEmbed}
        onBack={() => setScreen(screen.backScreen)}
        onSelect={(w) => {
          const account = w.getAccount();
          const chain = w.getChain();
          if (w && account && chain) {
            setPayer({
              account,
              chain,
              wallet: w,
            });
          }
        }}
        recommendedWallets={props.connectOptions?.recommendedWallets}
        showAllWallets={!!props.connectOptions?.showAllWallets}
        walletConnect={props.connectOptions?.walletConnect}
        wallets={props.connectOptions?.wallets}
      />
    );
  }

  if (screen.id === "swap-flow" && payer) {
    return (
      <SwapFlow
        isBuyForTx={!!props.buyForTx}
        isEmbed={props.isEmbed}
        client={client}
        onBack={() => {
          setScreen({
            id: "buy-with-crypto",
          });
        }}
        buyWithCryptoQuote={screen.quote}
        payer={payer}
        onViewPendingTx={props.onViewPendingTx}
        isFiatFlow={false}
        onDone={props.onDone}
        onTryAgain={() => {
          setScreen({
            id: "buy-with-crypto",
          });
        }}
      />
    );
  }

  if (screen.id === "fiat-flow" && payer) {
    return (
      <FiatFlow
        isBuyForTx={!!props.buyForTx}
        quote={screen.quote}
        onBack={() => {
          setScreen({
            id: "buy-with-fiat",
          });
        }}
        client={client}
        testMode={
          props.payOptions.buyWithFiat !== false &&
          props.payOptions.buyWithFiat?.testMode === true
        }
        theme={typeof props.theme === "string" ? props.theme : props.theme.type}
        onViewPendingTx={props.onViewPendingTx}
        openedWindow={screen.openedWindow}
        onDone={props.onDone}
        isEmbed={props.isEmbed}
        payer={payer}
      />
    );
  }

  if (screen.id === "select-currency") {
    const goBack = () => setScreen(screen.backScreen);
    return (
      <CurrencySelection
        onSelect={(currency) => {
          goBack();
          setSelectedCurrency(currency);
        }}
        onBack={goBack}
      />
    );
  }

  if (screen.id === "select-to-token") {
    const chains = supportedDestinations.map((x) => x.chain);
    const goBack = () => setScreen(screen.backScreen);
    // if token selection is disabled - only show network selector screen
    if (payOptions.prefillBuy?.allowEdits?.token === false) {
      return (
        <ChainSelectionScreen
          chains={chains}
          client={props.client}
          connectLocale={props.connectLocale}
          setChain={setToChain}
          goBack={goBack}
        />
      );
    }

    return (
      <TokenSelector
        onBack={goBack}
        tokenList={(
          (toChain?.id ? destinationSupportedTokens[toChain.id] : undefined) ||
          []
        ).filter((x) => x.address !== NATIVE_TOKEN_ADDRESS)}
        onTokenSelect={(tokenInfo) => {
          setToToken(tokenInfo);
          goBack();
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
        modalTitle="Buy"
      />
    );
  }

  if (
    screen.id === "select-from-token" &&
    supportedSourcesQuery.data &&
    sourceSupportedTokens
  ) {
    const chains = supportedSourcesQuery.data.map((x) => x.chain);
    const goBack = () => setScreen(screen.backScreen);
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
          goBack={goBack}
        />
      );
    }

    return (
      <TokenSelector
        onBack={goBack}
        tokenList={(
          (fromChain?.id ? sourceSupportedTokens[fromChain.id] : undefined) ||
          []
        ).filter((x) => x.address !== NATIVE_TOKEN_ADDRESS)}
        onTokenSelect={(tokenInfo) => {
          setFromToken(tokenInfo);
          goBack();
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
        modalTitle="Pay with"
      />
    );
  }

  return (
    <Container animate="fadein">
      <div>
        {screen.id === "main" && (
          <MainScreen
            payerAccount={payer?.account}
            buyForTx={buyForTx}
            client={client}
            onSelectBuyToken={() =>
              setScreen({ id: "select-to-token", backScreen: screen })
            }
            payOptions={payOptions}
            setTokenAmount={setTokenAmount}
            toChain={toChain}
            toToken={toToken}
            tokenAmount={tokenAmount}
            connectOptions={props.connectOptions}
            onViewPendingTx={props.onViewPendingTx}
            setScreen={setScreen}
            supportedDestinations={supportedDestinations}
            onBack={props.onBack}
            theme={props.theme}
          />
        )}

        {(screen.id === "select-payment-method" ||
          screen.id === "buy-with-crypto" ||
          screen.id === "buy-with-fiat") &&
          payer && (
            <TokenSelectedLayout
              selectedChain={toChain}
              selectedToken={toToken}
              tokenAmount={tokenAmount}
              client={client}
              onBack={() => {
                if (
                  screen.id === "buy-with-crypto" ||
                  screen.id === "buy-with-fiat"
                ) {
                  setScreen({ id: "select-payment-method" });
                } else if (screen.id === "select-payment-method") {
                  setScreen({ id: "main" });
                }
              }}
            >
              {screen.id === "select-payment-method" && (
                <PaymentMethodSelection setScreen={(id) => setScreen({ id })} />
              )}

              {screen.id === "buy-with-crypto" && activeAccount && (
                <SwapScreenContent
                  setScreen={setScreen}
                  tokenAmount={deferredTokenAmount}
                  toChain={toChain}
                  toToken={toToken}
                  fromChain={fromChain}
                  fromToken={fromToken}
                  showFromTokenSelector={() => {
                    setScreen({
                      id: "select-from-token",
                      backScreen: screen,
                    });
                  }}
                  payer={payer}
                  buyForTx={buyForTx || null}
                  client={client}
                  isEmbed={props.isEmbed}
                  onDone={props.onDone}
                  onViewPendingTx={props.onViewPendingTx}
                  payOptions={payOptions}
                  connectLocale={connectLocale}
                  connectOptions={props.connectOptions}
                  setPayer={setPayer}
                  // pass it even though we are passing payer, because payer might be different
                  activeAccount={activeAccount}
                />
              )}

              {screen.id === "buy-with-fiat" && (
                <FiatScreenContent
                  setScreen={setScreen}
                  tokenAmount={deferredTokenAmount}
                  toChain={toChain}
                  toToken={toToken}
                  selectedCurrency={selectedCurrency}
                  buyForTx={buyForTx || null}
                  client={client}
                  isEmbed={props.isEmbed}
                  onDone={props.onDone}
                  onViewPendingTx={props.onViewPendingTx}
                  payOptions={payOptions}
                  theme={props.theme}
                  showCurrencySelector={() => {
                    setScreen({
                      id: "select-currency",
                      backScreen: screen,
                    });
                  }}
                  payer={payer}
                  setTokenAmount={setTokenAmount}
                />
              )}
            </TokenSelectedLayout>
          )}
      </div>
    </Container>
  );
}

function SelectedTokenInfo(props: {
  selectedToken: ERC20OrNativeToken;
  selectedChain: Chain;
  tokenAmount: string;
  client: ThirdwebClient;
}) {
  return (
    <div>
      <Container
        flex="row"
        gap="sm"
        center="y"
        style={{
          justifyContent: "space-between",
        }}
      >
        <Container flex="row" gap="xs" center="y">
          <Text color="primaryText" data-testid="tokenAmount" size="xxl">
            {formatNumber(Number(props.tokenAmount), 5)}
          </Text>

          <Container flex="row" gap="xxs" center="y">
            <TokenSymbol
              token={props.selectedToken}
              chain={props.selectedChain}
              size="md"
              color="secondaryText"
            />
            <PayTokenIcon
              chain={props.selectedChain}
              client={props.client}
              size="sm"
              token={props.selectedToken}
            />
          </Container>
        </Container>

        <ChainName
          chain={props.selectedChain}
          client={props.client}
          size="sm"
          short
        />
      </Container>
    </div>
  );
}

function MainScreen(props: {
  buyForTx: BuyForTx | undefined;
  client: ThirdwebClient;
  setTokenAmount: (amount: string) => void;
  payerAccount: Account | undefined;
  tokenAmount: string;
  payOptions: PayUIOptions;
  toToken: ERC20OrNativeToken;
  toChain: Chain;
  onSelectBuyToken: () => void;
  connectOptions: PayEmbedConnectOptions | undefined;
  onViewPendingTx: () => void;
  setScreen: (screen: SelectedScreen) => void;
  supportedDestinations: SupportedChainAndTokens;
  onBack: (() => void) | undefined;
  theme: "light" | "dark" | Theme;
}) {
  const { showPaymentSelection, buyWithCryptoEnabled, buyWithFiatEnabled } =
    useEnabledPaymentMethods({
      payOptions: props.payOptions,
      supportedDestinations: props.supportedDestinations,
      toChain: props.toChain,
      toToken: props.toToken,
    });

  const [hasEditedAmount, setHasEditedAmount] = useState(false);
  const {
    buyForTx,
    setTokenAmount,
    payerAccount,
    client,
    tokenAmount,
    payOptions,
    toToken,
    toChain,
  } = props;

  // Buy Transaction flow states
  const { amountNeeded } = useBuyTxStates({
    setTokenAmount,
    buyForTx: buyForTx || null,
    hasEditedAmount,
    account: payerAccount || null,
  });

  const disableContinue = !tokenAmount;

  return (
    <Container p="lg">
      <ModalHeader
        title={
          props.buyForTx ? `Not enough ${props.buyForTx.tokenSymbol}` : "Buy"
        }
        onBack={props.onBack}
      />

      {/* Amount needed for Send Tx */}
      {amountNeeded && props.buyForTx ? (
        <>
          <Spacer y="lg" />
          <BuyForTxUI
            amountNeeded={String(
              formatNumber(Number(toEther(amountNeeded)), 4),
            )}
            buyForTx={props.buyForTx}
            client={client}
          />
        </>
      ) : (
        <Spacer y="xl" />
      )}

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
        onSelectToken={props.onSelectBuyToken}
        client={props.client}
        hideTokenSelector={!!props.buyForTx}
      />

      <Spacer y="xl" />

      {/* Continue */}
      <Container flex="column" gap="sm">
        {!payerAccount ? (
          <div>
            <ConnectButton
              {...props.connectOptions}
              client={props.client}
              theme={props.theme}
              connectButton={{
                style: {
                  width: "100%",
                },
              }}
            />
          </div>
        ) : (
          <Button
            variant="accent"
            fullWidth
            disabled={disableContinue}
            data-disabled={disableContinue}
            onClick={() => {
              if (showPaymentSelection) {
                props.setScreen({ id: "select-payment-method" });
              } else if (buyWithCryptoEnabled) {
                props.setScreen({ id: "buy-with-crypto" });
              } else if (buyWithFiatEnabled) {
                props.setScreen({ id: "buy-with-fiat" });
              } else {
                console.error("No payment method enabled");
              }
            }}
          >
            Continue
          </Button>
        )}

        {/* Do we want to remove this? */}
        {payerAccount && (
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
    </Container>
  );
}

function TokenSelectedLayout(props: {
  children: React.ReactNode;
  tokenAmount: string;
  selectedToken: ERC20OrNativeToken;
  selectedChain: Chain;
  client: ThirdwebClient;
  onBack: () => void;
}) {
  return (
    <Container>
      <Container p="lg">
        <ModalHeader title={"Buy"} onBack={props.onBack} />
      </Container>

      <Container
        px="lg"
        style={{
          paddingBottom: spacing.lg,
        }}
      >
        <Spacer y="xs" />
        <SelectedTokenInfo
          selectedToken={props.selectedToken}
          selectedChain={props.selectedChain}
          tokenAmount={props.tokenAmount}
          client={props.client}
        />

        <Spacer y="md" />
        <Line />
        <Spacer y="lg" />

        <Text size="sm"> Pay with </Text>
        <Spacer y="sm" />

        {props.children}
      </Container>
    </Container>
  );
}

function PaymentMethodSelection(props: {
  setScreen: (screenId: "buy-with-crypto" | "buy-with-fiat") => void;
}) {
  return (
    <Container animate="fadein">
      {/* Credit Card */}
      <Container flex="column" gap="sm">
        <Button
          variant="outline"
          bg="tertiaryBg"
          onClick={() => props.setScreen("buy-with-fiat")}
          gap="sm"
          style={{
            justifyContent: "flex-start",
            textAlign: "left",
          }}
        >
          <Container color="secondaryText" flex="row" center="both">
            <IdCardIcon
              style={{
                width: iconSize.md,
                height: iconSize.md,
              }}
            />
          </Container>

          <Container flex="column" gap="xxs">
            <Text size="md" color="primaryText">
              Credit Card
            </Text>
            <Text size="xs">Easily and securely make payments</Text>
          </Container>
        </Button>

        {/* Crypto */}
        <Button
          variant="outline"
          bg="tertiaryBg"
          onClick={() => props.setScreen("buy-with-crypto")}
          style={{
            justifyContent: "flex-start",
          }}
          gap="sm"
        >
          <Container color="secondaryText" flex="row" center="both">
            <CoinsIcon size={iconSize.md} />
          </Container>

          <Container flex="column" gap="xxs">
            <Text size="md" color="primaryText">
              Crypto
            </Text>
            <Text size="xs">Pay with confidence using crypto</Text>
          </Container>
        </Button>
      </Container>
    </Container>
  );
}

function SwapScreenContent(props: {
  setScreen: (screen: SelectedScreen) => void;
  tokenAmount: string;
  toToken: ERC20OrNativeToken;
  toChain: Chain;
  fromChain: Chain;
  fromToken: ERC20OrNativeToken;
  showFromTokenSelector: () => void;
  payer: PayerInfo;
  client: ThirdwebClient;
  payOptions: PayUIOptions;
  buyForTx: BuyForTx | null;
  isEmbed: boolean;
  onViewPendingTx: () => void;
  onDone: () => void;
  connectOptions: PayEmbedConnectOptions | undefined;
  connectLocale: ConnectLocale;
  setPayer: (payer: PayerInfo) => void;
  activeAccount: Account;
}) {
  const {
    setScreen,
    payer,
    client,
    toChain,
    tokenAmount,
    toToken,
    fromChain,
    fromToken,
    showFromTokenSelector,
    payOptions,
  } = props;

  const [receiverAddress, setReceiverAddress] = useState(
    props.activeAccount.address,
  );
  const { drawerRef, drawerOverlayRef, isOpen, setIsOpen } = useDrawer();
  const [drawerScreen, setDrawerScreen] = useState<
    "fees" | "receiver" | "payer"
  >("fees");

  const fromTokenBalanceQuery = useWalletBalance({
    address: payer.account.address,
    chain: fromChain,
    tokenAddress: isNativeToken(fromToken) ? undefined : fromToken.address,
    client,
  });

  const quoteParams: GetBuyWithCryptoQuoteParams | undefined =
    tokenAmount && !(fromChain.id === toChain.id && fromToken === toToken)
      ? {
          // wallets
          fromAddress: payer.account.address,
          toAddress: receiverAddress,
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
          purchaseData: payOptions.purchaseData,
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
  const switchChainRequired = props.payer.chain.id !== fromChain.id;

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
      id: "swap-flow",
      quote: quoteQuery.data,
    });
  }

  function showFees() {
    if (!quoteQuery.data) {
      return;
    }

    setIsOpen(true);
    setDrawerScreen("fees");
  }

  const prefillSource =
    payOptions.buyWithCrypto !== false
      ? payOptions.buyWithCrypto?.prefillSource
      : undefined;

  return (
    <Container flex="column" gap="md" animate="fadein">
      {isOpen && (
        <>
          <DrawerOverlay ref={drawerOverlayRef} />
          <Drawer ref={drawerRef} close={() => setIsOpen(false)}>
            {drawerScreen === "fees" && quoteQuery.data && (
              <div>
                <Text size="lg" color="primaryText">
                  Fees
                </Text>
                <Spacer y="lg" />
                <SwapFees quote={quoteQuery.data} align="left" />
              </div>
            )}

            {drawerScreen === "receiver" && (
              <ReceiverWalletDrawerScreen
                client={props.client}
                onSelect={(x) => setReceiverAddress(x)}
                receiverAddress={receiverAddress}
                onBack={() => setIsOpen(false)}
              />
            )}

            {drawerScreen === "payer" && (
              <WalletSwitcherDrawerContent
                client={client}
                onSelect={(w) => {
                  const chain = w.getChain();
                  const account = w.getAccount();
                  if (chain && account) {
                    props.setPayer({
                      account,
                      chain,
                      wallet: w,
                    });
                  }
                }}
                showAllWallets={!!props.connectOptions?.showAllWallets}
                wallets={props.connectOptions?.wallets}
                onBack={() => {
                  setIsOpen(false);
                }}
                onConnect={() => {
                  setScreen({
                    id: "connect-payer-wallet",
                    backScreen: {
                      id: "buy-with-crypto",
                    },
                  });
                }}
                selectedAddress={payer.account.address}
              />
            )}
          </Drawer>
        </>
      )}

      {/* Quote info */}
      <div>
        <WalletSelectorButton
          client={props.client}
          onClick={() => {
            setIsOpen(true);
            setDrawerScreen("payer");
          }}
          address={props.payer.account.address}
          walletId={props.payer.wallet.id}
          containerStyle={{
            borderBottomRightRadius: 0,
            borderBottomLeftRadius: 0,
          }}
        />

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
          payerAccount={props.payer.account}
        />
        <EstimatedTimeAndFees
          quoteIsLoading={quoteQuery.isLoading}
          estimatedSeconds={
            quoteQuery.data?.swapDetails.estimated.durationSeconds
          }
          onViewFees={showFees}
        />

        <Spacer y="md" />
        <Text size="sm">Send to</Text>
        <Spacer y="xs" />
        <WalletSelectorButton
          client={props.client}
          onClick={() => {
            setIsOpen(true);
            setDrawerScreen("receiver");
          }}
          address={receiverAddress}
          walletId={undefined}
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
        <SwitchNetworkButton
          variant="accent"
          fullWidth
          switchChain={async () => {
            await props.payer.wallet.switchChain(fromChain);
          }}
        />
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
              Getting price quote
              <Spinner size="sm" color="accentText" />
            </>
          ) : (
            "Continue"
          )}
        </Button>
      )}
    </Container>
  );
}

function FiatScreenContent(props: {
  setScreen: (screen: SelectedScreen) => void;
  tokenAmount: string;
  toToken: ERC20OrNativeToken;
  toChain: Chain;
  selectedCurrency: CurrencyMeta;
  showCurrencySelector: () => void;
  payOptions: PayUIOptions;
  theme: "light" | "dark" | Theme;
  buyForTx: BuyForTx | null;
  client: ThirdwebClient;
  onViewPendingTx: () => void;
  onDone: () => void;
  isEmbed: boolean;
  payer: PayerInfo;
  setTokenAmount: (amount: string) => void;
}) {
  const [receiverAddress, setReceiverAddress] = useState(
    props.payer.account.address,
  );
  const { drawerRef, drawerOverlayRef, isOpen, setIsOpen } = useDrawer();
  const [drawerScreen, setDrawerScreen] = useState<"fees" | "receiver">("fees");

  const {
    toToken,
    tokenAmount,
    payer,
    client,
    setScreen,
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
          toAddress: receiverAddress,
          toTokenAddress: isNativeToken(toToken)
            ? NATIVE_TOKEN_ADDRESS
            : toToken.address,
          toAmount: tokenAmount,
          client,
          isTestMode: buyWithFiatOptions?.testMode,
          purchaseData: props.payOptions.purchaseData,
          fromAddress: payer.account.address,
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
      id: "fiat-flow",
      quote: fiatQuoteQuery.data,
      openedWindow,
    });
  }

  function showFees() {
    if (!fiatQuoteQuery.data) {
      return;
    }

    setDrawerScreen("fees");
    setIsOpen(true);
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  function getErrorMessage(err: any) {
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

        const minAmountUSD = obj.data.minimumAmountUSDCents;
        const currentAmountUSD = obj.data.requestedAmountUSDCents;
        const currentAmountToken = Number(props.tokenAmount);
        const minAmountToken =
          (minAmountUSD * currentAmountToken) / currentAmountUSD;
        const minAmountTokenWithBuffer = minAmountToken * 1.2; // 20% buffer
        const formattedNum = formatNumber(minAmountTokenWithBuffer, 3);

        return {
          msg: [`Minimum purchase amount is ${formattedNum}`],
          minAmount: formattedNum,
        };
      }
    } catch {}

    return {
      msg: [defaultMessage],
    };
  }

  const disableSubmit = !fiatQuoteQuery.data;

  // TODO: API should just not return a quote if fromAddress !== toAddress and a swap is required after onramp and return an error message with a specific error id

  // TODO: if the receiver wallet is frozen by the developer, we need to stop the user from clicking continue here

  // Selecting Reciever wallet only allowed if no swap required after onramp
  const enableReceiverSelection =
    fiatQuoteQuery.data && !isSwapRequiredPostOnramp(fiatQuoteQuery.data);

  const errorMsg =
    !fiatQuoteQuery.isLoading && fiatQuoteQuery.error
      ? getErrorMessage(fiatQuoteQuery.error)
      : undefined;

  return (
    <Container flex="column" gap="md" animate="fadein">
      {isOpen && fiatQuoteQuery.data && (
        <>
          <DrawerOverlay ref={drawerOverlayRef} />
          <Drawer ref={drawerRef} close={() => setIsOpen(false)}>
            {drawerScreen === "fees" && (
              <div>
                <Text size="lg" color="primaryText">
                  Fees
                </Text>

                <Spacer y="lg" />
                <FiatFees quote={fiatQuoteQuery.data} />
              </div>
            )}

            {drawerScreen === "receiver" && (
              <ReceiverWalletDrawerScreen
                client={props.client}
                onSelect={(x) => setReceiverAddress(x)}
                receiverAddress={receiverAddress}
                onBack={() => setIsOpen(false)}
              />
            )}
          </Drawer>
        </>
      )}

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
        <Spacer y="md" />
        <Text size="sm">Send to</Text>
        <Spacer y="xs" />
        <WalletSelectorButton
          client={props.client}
          onClick={() => {
            setDrawerScreen("receiver");
            setIsOpen(true);
          }}
          address={receiverAddress}
          disabled={!enableReceiverSelection}
          walletId={undefined}
        />
      </div>

      {/* Error message */}
      {errorMsg && (
        <div>
          {errorMsg.msg.map((msg) => (
            <Text color="danger" size="sm" center multiline key={msg}>
              {msg}
            </Text>
          ))}
        </div>
      )}

      {errorMsg?.minAmount ? (
        <Button
          variant="accent"
          fullWidth
          onClick={() => {
            props.setTokenAmount(String(errorMsg.minAmount));
          }}
        >
          Set Minimum
        </Button>
      ) : (
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
              Getting price quote
              <Spinner size="sm" color="accentText" />
            </>
          ) : (
            "Continue"
          )}
        </Button>
      )}
    </Container>
  );
}

function BuyForTxUI(props: {
  amountNeeded: string;
  buyForTx: BuyForTx;
  client: ThirdwebClient;
}) {
  const chainNameQuery = useChainName(props.buyForTx.tx.chain);

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
          {chainNameQuery.name ? (
            <Text size="sm">{chainNameQuery.name}</Text>
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
      <Spacer y="xl" />

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
  goBack: () => void;
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
      onBack={props.goBack}
      chains={props.chains}
      closeModal={props.goBack}
      networkSelector={{
        renderChain(renderChainProps) {
          return (
            <ChainButton
              chain={renderChainProps.chain}
              confirming={false}
              switchingFailed={false}
              onClick={() => {
                props.setChain(renderChainProps.chain);
                props.goBack();
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
