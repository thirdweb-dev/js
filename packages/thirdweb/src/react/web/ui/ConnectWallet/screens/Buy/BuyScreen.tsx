import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import type { Chain } from "../../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../../constants/addresses.js";
import type { GetBuyWithCryptoQuoteParams } from "../../../../../../pay/buyWithCrypto/getQuote.js";
import type { BuyWithCryptoStatus } from "../../../../../../pay/buyWithCrypto/getStatus.js";
import type { BuyWithFiatStatus } from "../../../../../../pay/buyWithFiat/getStatus.js";
import { isSwapRequiredPostOnramp } from "../../../../../../pay/buyWithFiat/isSwapRequiredPostOnramp.js";
import { formatNumber } from "../../../../../../utils/formatNumber.js";
import type { Account } from "../../../../../../wallets/interfaces/wallet.js";
import type { WalletId } from "../../../../../../wallets/wallet-types.js";
import {
  type Theme,
  spacing,
} from "../../../../../core/design-system/index.js";
import type {
  FundWalletOptions,
  PayUIOptions,
} from "../../../../../core/hooks/connection/ConnectButtonProps.js";
import { useWalletBalance } from "../../../../../core/hooks/others/useWalletBalance.js";
import { useBuyWithCryptoQuote } from "../../../../../core/hooks/pay/useBuyWithCryptoQuote.js";
import { useBuyWithFiatQuote } from "../../../../../core/hooks/pay/useBuyWithFiatQuote.js";
import { useActiveAccount } from "../../../../../core/hooks/wallets/useActiveAccount.js";
import { invalidateWalletBalance } from "../../../../../core/providers/invalidateWalletBalance.js";
import type { SupportedTokens } from "../../../../../core/utils/defaultTokens.js";
import { ErrorState } from "../../../../wallets/shared/ErrorState.js";
import { LoadingScreen } from "../../../../wallets/shared/LoadingScreen.js";
import type { PayEmbedConnectOptions } from "../../../PayEmbed.js";
import { ChainName } from "../../../components/ChainName.js";
import {
  Drawer,
  DrawerOverlay,
  useDrawer,
} from "../../../components/Drawer.js";
import { Spacer } from "../../../components/Spacer.js";
import { Spinner } from "../../../components/Spinner.js";
import { SwitchNetworkButton } from "../../../components/SwitchNetwork.js";
import { Container, Line, ModalHeader } from "../../../components/basic.js";
import { Button } from "../../../components/buttons.js";
import { Text } from "../../../components/text.js";
import { TokenSymbol } from "../../../components/token/TokenSymbol.js";
import { ConnectButton } from "../../ConnectButton.js";
import { ChainButton, NetworkSelectorContent } from "../../NetworkSelector.js";
import type { ConnectLocale } from "../../locale/types.js";
import { TokenSelector } from "../TokenSelector.js";
import { WalletSwitcherConnectionScreen } from "../WalletSwitcherConnectionScreen.js";
import { type ERC20OrNativeToken, isNativeToken } from "../nativeToken.js";
import { DirectPaymentModeScreen } from "./DirectPaymentModeScreen.js";
import { EstimatedTimeAndFees } from "./EstimatedTimeAndFees.js";
import { PayTokenIcon } from "./PayTokenIcon.js";
import { PayWithCreditCard } from "./PayWIthCreditCard.js";
import { TransactionModeScreen } from "./TransactionModeScreen.js";
import { CurrencySelection } from "./fiat/CurrencySelection.js";
import { FiatFlow } from "./fiat/FiatFlow.js";
import type { CurrencyMeta } from "./fiat/currencies.js";
import type { SelectedScreen } from "./main/types.js";
import {
  type PaymentMethods,
  useEnabledPaymentMethods,
} from "./main/useEnabledPaymentMethods.js";
import {
  useFiatCurrencySelectionStates,
  useFromTokenSelectionStates,
  useToTokenSelectionStates,
} from "./main/useUISelectionStates.js";
import { openOnrampPopup } from "./openOnRamppopup.js";
import { BuyTokenInput } from "./swap/BuyTokenInput.js";
import { FiatFees, SwapFees } from "./swap/Fees.js";
import { PayWithCryptoQuoteInfo } from "./swap/PayWithCrypto.js";
import { PaymentSelectionScreen } from "./swap/PaymentSelectionScreen.js";
import { SwapFlow } from "./swap/SwapFlow.js";
import { TransferFlow } from "./swap/TransferFlow.js";
import { addPendingTx } from "./swap/pendingSwapTx.js";
import {
  type SupportedChainAndTokens,
  useBuySupportedDestinations,
  useBuySupportedSources,
} from "./swap/useSwapSupportedChains.js";
import type { PayerInfo } from "./types.js";
import { usePayerSetup } from "./usePayerSetup.js";

export type BuyScreenProps = {
  title: string;
  onBack: (() => void) | undefined;
  supportedTokens: SupportedTokens | undefined;
  client: ThirdwebClient;
  connectLocale: ConnectLocale;
  payOptions: PayUIOptions;
  theme: "light" | "dark" | Theme;
  onDone: () => void;
  connectOptions: PayEmbedConnectOptions | undefined;
  hiddenWallets?: WalletId[];
  isEmbed: boolean;
};

/**
 * @internal
 */
export default function BuyScreen(props: BuyScreenProps) {
  const isTestMode = props.payOptions.buyWithCrypto
    ? props.payOptions.buyWithCrypto.testMode
    : undefined;
  const supportedDestinationsQuery = useBuySupportedDestinations(
    props.client,
    isTestMode,
  );

  if (supportedDestinationsQuery.isError) {
    return (
      <Container
        style={{
          minHeight: "350px",
        }}
        fullHeight
        flex="row"
        center="both"
      >
        <ErrorState
          title="Something went wrong"
          onTryAgain={supportedDestinationsQuery.refetch}
        />
      </Container>
    );
  }

  if (!supportedDestinationsQuery.data) {
    return <LoadingScreen />;
  }

  return (
    <BuyScreenContent
      {...props}
      supportedDestinations={supportedDestinationsQuery.data}
    />
  );
}

type BuyScreenContentProps = {
  title: string;
  client: ThirdwebClient;
  onBack?: () => void;
  supportedTokens?: SupportedTokens;
  supportedDestinations: SupportedChainAndTokens;
  connectLocale: ConnectLocale;
  theme: "light" | "dark" | Theme;
  payOptions: PayUIOptions;
  onDone: () => void;
  hiddenWallets?: WalletId[];
  connectOptions: PayEmbedConnectOptions | undefined;
  isEmbed: boolean;
};

/**
 * @internal
 */
function BuyScreenContent(props: BuyScreenContentProps) {
  const { client, supportedDestinations, connectLocale, payOptions } = props;

  const activeAccount = useActiveAccount();
  const { payer, setPayer } = usePayerSetup();

  const [screen, setScreen] = useState<SelectedScreen>({
    id: "main",
  });

  const {
    tokenAmount,
    setTokenAmount,
    toChain,
    setToChain,
    deferredTokenAmount,
    toToken,
    setToToken,
  } = useToTokenSelectionStates({
    payOptions,
    supportedDestinations,
  });

  const [hasEditedAmount, setHasEditedAmount] = useState(false);

  const onDone = useCallback(() => {
    setScreen({ id: "main" });
    props.onDone();
  }, [props.onDone]);

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

    const supportedSources = supportedSourcesQuery.data;

    return createSupportedTokens(
      supportedSources,
      payOptions,
      props.supportedTokens,
    );
  }, [props.supportedTokens, supportedSourcesQuery.data, payOptions]);

  const { fromChain, setFromChain, fromToken, setFromToken } =
    useFromTokenSelectionStates({
      payOptions,
      supportedSources: supportedSourcesQuery.data || [],
    });

  const { selectedCurrency, setSelectedCurrency } =
    useFiatCurrencySelectionStates({
      payOptions,
    });

  const enabledPaymentMethods = useEnabledPaymentMethods({
    payOptions: props.payOptions,
    supportedDestinations: props.supportedDestinations,
    toChain: toChain,
    toToken: toToken,
  });

  const payDisabled =
    enabledPaymentMethods.buyWithCryptoEnabled === false &&
    enabledPaymentMethods.buyWithFiatEnabled === false;

  // screens ----------------------------

  const queryClient = useQueryClient();

  const onSwapSuccess = useCallback(
    (_status: BuyWithCryptoStatus) => {
      props.payOptions.onPurchaseSuccess?.({
        type: "crypto",
        status: _status,
      });
      invalidateWalletBalance(queryClient);
    },
    [props.payOptions.onPurchaseSuccess, queryClient],
  );

  const onFiatSuccess = useCallback(
    (_status: BuyWithFiatStatus) => {
      props.payOptions.onPurchaseSuccess?.({
        type: "fiat",
        status: _status,
      });
      invalidateWalletBalance(queryClient);
    },
    [props.payOptions.onPurchaseSuccess, queryClient],
  );

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
        hiddenWallets={props.hiddenWallets}
        recommendedWallets={props.connectOptions?.recommendedWallets}
        showAllWallets={
          props.connectOptions?.showAllWallets === undefined
            ? true
            : props.connectOptions?.showAllWallets
        }
        walletConnect={props.connectOptions?.walletConnect}
        wallets={props.connectOptions?.wallets?.filter((w) => w.id !== "inApp")}
      />
    );
  }

  if (screen.id === "swap-flow" && payer) {
    return (
      <SwapFlow
        title={props.title}
        transactionMode={payOptions.mode === "transaction"}
        isEmbed={props.isEmbed}
        client={client}
        onBack={() => {
          setScreen({
            id: "buy-with-crypto",
          });
        }}
        buyWithCryptoQuote={screen.quote}
        payer={payer}
        isFiatFlow={false}
        onDone={onDone}
        onTryAgain={() => {
          setScreen({
            id: "buy-with-crypto",
          });
        }}
        onSuccess={onSwapSuccess}
      />
    );
  }

  if (screen.id === "fiat-flow" && payer) {
    return (
      <FiatFlow
        title={props.title}
        transactionMode={payOptions.mode === "transaction"}
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
        openedWindow={screen.openedWindow}
        onDone={onDone}
        isEmbed={props.isEmbed}
        payer={payer}
        onSuccess={onFiatSuccess}
      />
    );
  }

  if (screen.id === "transfer-flow" && payer && activeAccount) {
    const goBack = () => setScreen({ id: "buy-with-crypto" });
    // TODO (pay) pass it via screen props
    const defaultRecipientAddress = (
      props.payOptions as Extract<PayUIOptions, { mode: "direct_payment" }>
    )?.paymentInfo?.sellerAddress;
    const receiverAddress = defaultRecipientAddress || activeAccount.address;
    return (
      <TransferFlow
        title={props.title}
        onBack={goBack}
        payer={payer}
        client={props.client}
        chain={toChain}
        token={toToken}
        tokenAmount={tokenAmount}
        receiverAddress={receiverAddress}
        transactionMode={props.payOptions.mode === "transaction"}
        payOptions={payOptions}
        isEmbed={props.isEmbed}
        onDone={onDone}
        onTryAgain={() => {
          setScreen({
            id: "buy-with-crypto",
          });
        }}
        onSuccess={onSwapSuccess}
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
    const allowEdits = (payOptions as FundWalletOptions)?.prefillBuy
      ?.allowEdits;
    // if token selection is disabled - only show network selector screen
    if (allowEdits?.token === false) {
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
          allowEdits?.chain !== false
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
        modalTitle={props.title}
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
            title={props.title}
            payerAccount={payer?.account}
            client={client}
            onSelectBuyToken={() =>
              setScreen({ id: "select-to-token", backScreen: screen })
            }
            payOptions={payOptions}
            setTokenAmount={setTokenAmount}
            setToChain={setToChain}
            setToToken={setToToken}
            setFromChain={setFromChain}
            setFromToken={setFromToken}
            toChain={toChain}
            toToken={toToken}
            tokenAmount={tokenAmount}
            connectOptions={props.connectOptions}
            setScreen={setScreen}
            supportedDestinations={supportedDestinations}
            onBack={props.onBack}
            theme={props.theme}
            hasEditedAmount={hasEditedAmount}
            setHasEditedAmount={setHasEditedAmount}
            enabledPaymentMethods={enabledPaymentMethods}
          />
        )}

        {(screen.id === "select-payment-method" ||
          screen.id === "buy-with-crypto" ||
          screen.id === "buy-with-fiat") &&
          payer && (
            <TokenSelectedLayout
              title={props.title}
              selectedChain={toChain}
              selectedToken={toToken}
              tokenAmount={tokenAmount}
              client={client}
              onBack={() => {
                if (
                  enabledPaymentMethods.buyWithCryptoEnabled &&
                  screen.id === "buy-with-fiat"
                ) {
                  setScreen({ id: "select-payment-method" });
                } else if (screen.id === "buy-with-crypto") {
                  setScreen({ id: "select-payment-method" });
                } else {
                  setScreen({ id: "main" });
                }
              }}
            >
              {screen.id === "select-payment-method" && (
                <PaymentSelectionScreen
                  client={client}
                  mode={payOptions.mode}
                  sourceSupportedTokens={sourceSupportedTokens}
                  hiddenWallets={props.hiddenWallets}
                  payWithFiatEnabled={props.payOptions.buyWithFiat !== false}
                  toChain={toChain}
                  toToken={toToken}
                  tokenAmount={tokenAmount}
                  onSelect={(w, token, chain) => {
                    const account = w.getAccount();
                    if (account) {
                      setPayer({
                        account,
                        chain,
                        wallet: w,
                      });
                      setFromToken(token);
                      setFromChain(chain);
                      setScreen({ id: "buy-with-crypto" });
                    }
                  }}
                  onSelectFiat={() => {
                    setScreen({ id: "buy-with-fiat" });
                  }}
                  showAllWallets={!!props.connectOptions?.showAllWallets}
                  wallets={props.connectOptions?.wallets}
                  onBack={() => {
                    // no-op
                  }}
                  onConnect={() => {
                    setScreen({
                      id: "connect-payer-wallet",
                      backScreen: {
                        id: "select-payment-method",
                      },
                    });
                  }}
                />
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
                  client={client}
                  isEmbed={props.isEmbed}
                  onDone={onDone}
                  payOptions={payOptions}
                  connectLocale={connectLocale}
                  connectOptions={props.connectOptions}
                  setPayer={setPayer}
                  // pass it even though we are passing payer, because payer might be different
                  activeAccount={activeAccount}
                  setTokenAmount={setTokenAmount}
                  setHasEditedAmount={setHasEditedAmount}
                  disableTokenSelection={
                    payDisabled === true ||
                    (payOptions.buyWithCrypto !== false &&
                      payOptions.buyWithCrypto?.prefillSource?.allowEdits
                        ?.chain === false &&
                      payOptions.buyWithCrypto?.prefillSource?.allowEdits
                        ?.token === false)
                  }
                />
              )}

              {screen.id === "buy-with-fiat" && (
                <FiatScreenContent
                  setScreen={setScreen}
                  tokenAmount={deferredTokenAmount}
                  toChain={toChain}
                  toToken={toToken}
                  selectedCurrency={selectedCurrency}
                  client={client}
                  isEmbed={props.isEmbed}
                  onDone={onDone}
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
                  setHasEditedAmount={setHasEditedAmount}
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
          <Text color="primaryText" data-testid="tokenAmount" size="xl">
            {formatNumber(Number(props.tokenAmount), 6)}
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
  title: string;
  client: ThirdwebClient;
  setTokenAmount: (amount: string) => void;
  setFromChain: (chain: Chain) => void;
  setFromToken: (token: ERC20OrNativeToken) => void;
  setToChain: (chain: Chain) => void;
  setToToken: (token: ERC20OrNativeToken) => void;
  payerAccount: Account | undefined;
  tokenAmount: string;
  payOptions: PayUIOptions;
  toToken: ERC20OrNativeToken;
  toChain: Chain;
  onSelectBuyToken: () => void;
  connectOptions: PayEmbedConnectOptions | undefined;
  setScreen: (screen: SelectedScreen) => void;
  supportedDestinations: SupportedChainAndTokens;
  onBack: (() => void) | undefined;
  theme: "light" | "dark" | Theme;
  hasEditedAmount: boolean;
  setHasEditedAmount: (hasEdited: boolean) => void;
  enabledPaymentMethods: PaymentMethods;
}) {
  const {
    setTokenAmount,
    setToChain,
    setToToken,
    setFromChain,
    setFromToken,
    payerAccount,
    client,
    tokenAmount,
    payOptions,
    toToken,
    toChain,
    supportedDestinations,
    enabledPaymentMethods,
  } = props;

  const { buyWithCryptoEnabled, buyWithFiatEnabled } = enabledPaymentMethods;
  const disableContinue = !tokenAmount;

  switch (payOptions.mode) {
    case "transaction": {
      return (
        <TransactionModeScreen
          supportedDestinations={supportedDestinations}
          payUiOptions={payOptions}
          payerAccount={payerAccount}
          connectOptions={props.connectOptions}
          client={client}
          onContinue={(tokenAmount, toChain, toToken) => {
            setTokenAmount(tokenAmount);
            setToChain(toChain);
            setFromChain(toChain);
            setFromToken(toToken);
            setToToken(toToken);
            if (buyWithFiatEnabled && !buyWithCryptoEnabled) {
              props.setScreen({ id: "buy-with-fiat" });
            } else {
              props.setScreen({ id: "select-payment-method" });
            }
          }}
        />
      );
    }
    case "direct_payment": {
      return (
        <DirectPaymentModeScreen
          client={client}
          payUiOptions={payOptions}
          payerAccount={payerAccount}
          connectOptions={props.connectOptions}
          supportedDestinations={supportedDestinations}
          onContinue={(tokenAmount, toChain, toToken) => {
            setTokenAmount(tokenAmount);
            setToChain(toChain);
            setFromChain(toChain);
            setFromToken(toToken);
            setToToken(toToken);
            if (buyWithFiatEnabled && !buyWithCryptoEnabled) {
              props.setScreen({ id: "buy-with-fiat" });
            } else {
              props.setScreen({ id: "select-payment-method" });
            }
          }}
        />
      );
    }
    default: {
      return (
        <Container p="lg">
          <ModalHeader title={props.title} onBack={props.onBack} />

          <Spacer y="xl" />

          {/* To */}
          <BuyTokenInput
            value={tokenAmount}
            onChange={async (value) => {
              props.setHasEditedAmount(true);
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
                  if (buyWithFiatEnabled && !buyWithCryptoEnabled) {
                    props.setScreen({ id: "buy-with-fiat" });
                  } else {
                    props.setScreen({ id: "select-payment-method" });
                  }
                }}
              >
                Continue
              </Button>
            )}
          </Container>
        </Container>
      );
    }
  }
}

function TokenSelectedLayout(props: {
  title: string;
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
        <ModalHeader title={props.title} onBack={props.onBack} />
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
  isEmbed: boolean;
  onDone: () => void;
  connectOptions: PayEmbedConnectOptions | undefined;
  connectLocale: ConnectLocale;
  setPayer: (payer: PayerInfo) => void;
  activeAccount: Account;
  setTokenAmount: (amount: string) => void;
  setHasEditedAmount: (hasEdited: boolean) => void;
  disableTokenSelection: boolean;
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
    payOptions,
    disableTokenSelection,
  } = props;

  const defaultRecipientAddress = (
    props.payOptions as Extract<PayUIOptions, { mode: "direct_payment" }>
  )?.paymentInfo?.sellerAddress;
  const receiverAddress =
    defaultRecipientAddress || props.activeAccount.address;
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

  const fromTokenId = isNativeToken(fromToken)
    ? NATIVE_TOKEN_ADDRESS
    : fromToken.address.toLowerCase();
  const toTokenId = isNativeToken(toToken)
    ? NATIVE_TOKEN_ADDRESS
    : toToken.address.toLowerCase();
  const swapRequired =
    !!tokenAmount &&
    !(fromChain.id === toChain.id && fromTokenId === toTokenId);
  const quoteParams: GetBuyWithCryptoQuoteParams | undefined = swapRequired
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

  const sourceTokenAmount = swapRequired
    ? quoteQuery.data?.swapDetails.fromAmount
    : tokenAmount;

  const isNotEnoughBalance =
    !!sourceTokenAmount &&
    !!fromTokenBalanceQuery.data &&
    Number(fromTokenBalanceQuery.data.displayValue) < Number(sourceTokenAmount);

  const disableContinue =
    (swapRequired && !quoteQuery.data) || isNotEnoughBalance;
  const switchChainRequired =
    props.payer.wallet.getChain()?.id !== fromChain.id;

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  function getErrorMessage(err: any) {
    type AmountTooLowError = {
      code: "MINIMUM_PURCHASE_AMOUNT";
      data: {
        minimumAmountUSDCents: number;
        requestedAmountUSDCents: number;
        minimumAmountWei: string;
        minimumAmountEth: string;
      };
    };

    const defaultMessage = "Unable to get price quote";
    try {
      if (err.error.code === "MINIMUM_PURCHASE_AMOUNT") {
        const obj = err.error as AmountTooLowError;
        const minAmountToken = obj.data.minimumAmountEth;
        return {
          minAmount: formatNumber(Number(minAmountToken), 6),
        };
      }
    } catch {}

    return {
      msg: [defaultMessage],
    };
  }

  const errorMsg =
    !quoteQuery.isLoading && quoteQuery.error
      ? getErrorMessage(quoteQuery.error)
      : undefined;

  function showSwapFlow() {
    if (
      (props.payOptions.mode === "direct_payment" ||
        props.payOptions.mode === "fund_wallet") &&
      !isNotEnoughBalance &&
      !swapRequired
    ) {
      // same currency, just direct transfer
      setScreen({
        id: "transfer-flow",
      });
    } else if (
      props.payOptions.mode === "transaction" &&
      !isNotEnoughBalance &&
      !swapRequired
    ) {
      if (payer.account.address !== receiverAddress) {
        // needs transfer from another wallet before executing the transaction
        setScreen({
          id: "transfer-flow",
        });
      } else {
        // has enough balance to just do the transaction directly
        props.onDone();
      }

      return;
    }

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
                <SwapFees quote={quoteQuery.data} />
              </div>
            )}
          </Drawer>
        </>
      )}

      {/* Quote info */}
      <div>
        <PayWithCryptoQuoteInfo
          value={sourceTokenAmount || ""}
          chain={fromChain}
          token={fromToken}
          isLoading={quoteQuery.isLoading && !sourceTokenAmount}
          client={client}
          freezeChainAndTokenSelection={disableTokenSelection}
          payerAccount={props.payer.account}
          swapRequired={swapRequired}
        />
        {swapRequired && (
          <EstimatedTimeAndFees
            quoteIsLoading={quoteQuery.isLoading}
            estimatedSeconds={
              quoteQuery.data?.swapDetails.estimated.durationSeconds
            }
            onViewFees={showFees}
          />
        )}
        <Spacer y="md" />
      </div>

      {/* Error message */}
      {errorMsg && (
        <div>
          {errorMsg.minAmount && (
            <Text color="danger" size="sm" center multiline>
              Minimum amount is {errorMsg.minAmount}{" "}
              <TokenSymbol
                token={toToken}
                chain={toChain}
                size="sm"
                inline
                color="danger"
              />
            </Text>
          )}

          {errorMsg.msg?.map((msg) => (
            <Text color="danger" size="sm" center multiline key={msg}>
              {msg}
            </Text>
          ))}
        </div>
      )}

      {!errorMsg && isNotEnoughBalance && (
        <div>
          <Text color="danger" size="sm" center multiline>
            Not enough funds.
          </Text>
          <Text color="danger" size="sm" center multiline>
            Try a different wallet or token.
          </Text>
        </div>
      )}

      {/* Button */}
      {errorMsg?.minAmount ? (
        <Button
          variant="accent"
          fullWidth
          onClick={() => {
            props.setTokenAmount(String(errorMsg.minAmount));
            props.setHasEditedAmount(true);
          }}
        >
          Set Minimum
        </Button>
      ) : switchChainRequired &&
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
          {quoteQuery.isLoading ? (
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
  client: ThirdwebClient;
  onDone: () => void;
  isEmbed: boolean;
  payer: PayerInfo;
  setTokenAmount: (amount: string) => void;
  setHasEditedAmount: (hasEdited: boolean) => void;
}) {
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
  const defaultRecipientAddress = (
    props.payOptions as Extract<PayUIOptions, { mode: "direct_payment" }>
  )?.paymentInfo?.sellerAddress;
  const receiverAddress =
    defaultRecipientAddress || props.payer.account.address;
  const { drawerRef, drawerOverlayRef, isOpen, setIsOpen } = useDrawer();
  const [drawerScreen, setDrawerScreen] = useState<"fees">("fees");

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
          preferredProvider: buyWithFiatOptions?.preferredProvider,
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
        minimumAmountWei: string;
        minimumAmountEth: string;
      };
    };

    const defaultMessage = "Unable to get price quote";
    try {
      if (err.error.code === "MINIMUM_PURCHASE_AMOUNT") {
        const obj = err.error as AmountTooLowError;
        const minAmountToken = obj.data.minimumAmountEth;
        return {
          minAmount: formatNumber(Number(minAmountToken), 6),
        };
      }
    } catch {}

    return {
      msg: [defaultMessage],
    };
  }

  const disableSubmit = !fiatQuoteQuery.data;

  const errorMsg =
    !fiatQuoteQuery.isLoading && fiatQuoteQuery.error
      ? getErrorMessage(fiatQuoteQuery.error)
      : undefined;

  return (
    <Container flex="column" gap="md" animate="fadein">
      {isOpen && (
        <>
          <DrawerOverlay ref={drawerOverlayRef} />
          <Drawer ref={drawerRef} close={() => setIsOpen(false)}>
            {drawerScreen === "fees" && fiatQuoteQuery.data && (
              <div>
                <Text size="lg" color="primaryText">
                  Fees
                </Text>

                <Spacer y="lg" />
                <FiatFees quote={fiatQuoteQuery.data} />
              </div>
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
      </div>

      {/* Error message */}
      {errorMsg && (
        <div>
          {errorMsg.minAmount && (
            <Text color="danger" size="sm" center multiline>
              Minimum amount is {errorMsg.minAmount}{" "}
              <TokenSymbol
                token={toToken}
                chain={toChain}
                size="sm"
                inline
                color="danger"
              />
            </Text>
          )}

          {errorMsg.msg?.map((msg) => (
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
            props.setHasEditedAmount(true);
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

function createSupportedTokens(
  data: SupportedChainAndTokens,
  payOptions: PayUIOptions,
  supportedTokensOverrides?: SupportedTokens,
): SupportedTokens {
  const tokens: SupportedTokens = {};

  const isBuyWithFiatDisabled = payOptions.buyWithFiat === false;
  const isBuyWithCryptoDisabled = payOptions.buyWithCrypto === false;

  // FIXME (pay) when buywithFiat is disabled, missing a bunch of tokens on base??

  for (const x of data) {
    tokens[x.chain.id] = x.tokens.filter((t) => {
      // for source tokens, data is not provided, so we include all of them
      if (
        t.buyWithCryptoEnabled === undefined &&
        t.buyWithFiatEnabled === undefined
      ) {
        return true;
      }
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
