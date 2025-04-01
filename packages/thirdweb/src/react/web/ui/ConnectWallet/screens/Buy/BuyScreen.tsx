import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import type { Chain } from "../../../../../../chains/types.js";
import { getCachedChain } from "../../../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../../constants/addresses.js";
import type { BuyWithCryptoStatus } from "../../../../../../pay/buyWithCrypto/getStatus.js";
import type { BuyWithFiatStatus } from "../../../../../../pay/buyWithFiat/getStatus.js";
import { formatNumber } from "../../../../../../utils/formatNumber.js";
import type { Account } from "../../../../../../wallets/interfaces/wallet.js";
import type { WalletId } from "../../../../../../wallets/wallet-types.js";
import {
  type Theme,
  fontSize,
  spacing,
} from "../../../../../core/design-system/index.js";
import type {
  FundWalletOptions,
  PayUIOptions,
} from "../../../../../core/hooks/connection/ConnectButtonProps.js";
import { useActiveAccount } from "../../../../../core/hooks/wallets/useActiveAccount.js";
import { invalidateWalletBalance } from "../../../../../core/providers/invalidateWalletBalance.js";
import type { SupportedTokens } from "../../../../../core/utils/defaultTokens.js";
import { ErrorState } from "../../../../wallets/shared/ErrorState.js";
import { LoadingScreen } from "../../../../wallets/shared/LoadingScreen.js";
import type { PayEmbedConnectOptions } from "../../../PayEmbed.js";
import { ChainName } from "../../../components/ChainName.js";
import { Spacer } from "../../../components/Spacer.js";
import { Container, Line, ModalHeader } from "../../../components/basic.js";
import { Button } from "../../../components/buttons.js";
import { Input } from "../../../components/formElements.js";
import { TokenSymbol } from "../../../components/token/TokenSymbol.js";
import { ConnectButton } from "../../ConnectButton.js";
import { ChainButton, NetworkSelectorContent } from "../../NetworkSelector.js";
import type { ConnectLocale } from "../../locale/types.js";
import { TokenSelector } from "../TokenSelector.js";
import { WalletSwitcherConnectionScreen } from "../WalletSwitcherConnectionScreen.js";
import { type ERC20OrNativeToken, isNativeToken } from "../nativeToken.js";
import { DirectPaymentModeScreen } from "./DirectPaymentModeScreen.js";
import { PayTokenIcon } from "./PayTokenIcon.js";
import { TransactionModeScreen } from "./TransactionModeScreen.js";
import { CurrencySelection } from "./fiat/CurrencySelection.js";
import { FiatScreenContent } from "./fiat/FiatScreenContent.js";
import { OnRampScreen } from "./fiat/OnRampScreen.js";
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
import { BuyTokenInput } from "./swap/BuyTokenInput.js";
import { FiatValue } from "./swap/FiatValue.js";
import { SwapFlow } from "./swap/SwapFlow.js";
import { SwapScreenContent } from "./swap/SwapScreenContent.js";
import { TokenSelectorScreen } from "./swap/TokenSelectorScreen.js";
import { TransferFlow } from "./swap/TransferFlow.js";
import {
  type SupportedChainAndTokens,
  useBuySupportedDestinations,
  useBuySupportedSources,
} from "./swap/useSwapSupportedChains.js";
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

  const supportedDestinations = props.supportedTokens
    ? Object.entries(props.supportedTokens).map(([chainId, tokens]) => ({
        chain: getCachedChain(Number.parseInt(chainId)),
        tokens: tokens.map((t) => ({
          ...t,
          buyWithCryptoEnabled: true,
          buyWithFiatEnabled: true,
        })),
      }))
    : supportedDestinationsQuery.data;

  return (
    <BuyScreenContent
      {...props}
      supportedDestinations={supportedDestinations}
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
        approvalAmount={screen.approvalAmount}
      />
    );
  }

  if (screen.id === "fiat-flow" && payer) {
    const defaultRecipientAddress = (
      props.payOptions as Extract<PayUIOptions, { mode: "direct_payment" }>
    )?.paymentInfo?.sellerAddress;
    const receiverAddress = defaultRecipientAddress || payer.account.address;
    return (
      <OnRampScreen
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
        onDone={onDone}
        isEmbed={props.isEmbed}
        payer={payer}
        receiverAddress={receiverAddress}
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
          screen.id === "buy-with-fiat" ||
          screen.id === "select-from-token") &&
          payer && (
            <TokenSelectedLayout
              disabled={
                ("prefillBuy" in payOptions &&
                  payOptions.prefillBuy?.allowEdits?.amount === false) ||
                payOptions.mode !== "fund_wallet"
              }
              title={props.title}
              selectedChain={toChain}
              selectedToken={toToken}
              tokenAmount={tokenAmount}
              setTokenAmount={setTokenAmount}
              client={client}
              onBack={() => {
                if (
                  screen.id === "buy-with-crypto" ||
                  screen.id === "buy-with-fiat"
                ) {
                  setScreen({
                    id: "select-from-token",
                    backScreen: { id: "main" },
                  });
                } else if (screen.id === "select-from-token") {
                  setScreen(screen.backScreen);
                } else {
                  setScreen({ id: "main" });
                }
              }}
            >
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

              {screen.id === "select-from-token" &&
                supportedSourcesQuery.data &&
                sourceSupportedTokens && (
                  <TokenSelectorScreen
                    fiatSupported={props.payOptions.buyWithFiat !== false}
                    client={props.client}
                    sourceTokens={sourceSupportedTokens}
                    sourceSupportedTokens={sourceSupportedTokens}
                    toChain={toChain}
                    toToken={toToken}
                    tokenAmount={tokenAmount}
                    mode={payOptions.mode}
                    hiddenWallets={props.hiddenWallets}
                    onConnect={() => {
                      setScreen({
                        id: "connect-payer-wallet",
                        backScreen: screen,
                      });
                    }}
                    onPayWithFiat={() => {
                      setScreen({
                        id: "buy-with-fiat",
                      });
                    }}
                    onSelectToken={(w, token, chain) => {
                      const account = w.getAccount();
                      if (account) {
                        setPayer({
                          account,
                          chain,
                          wallet: w,
                        });
                        setFromToken(token);
                        setFromChain(chain);
                      }
                      setScreen({ id: "buy-with-crypto" });
                    }}
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
  setTokenAmount: (amount: string) => void;
  client: ThirdwebClient;
  disabled?: boolean;
}) {
  const getWidth = () => {
    const amount = formatNumber(Number(props.tokenAmount), 6).toString();
    let chars = amount.replace(".", "").length;
    const hasDot = amount.includes(".");
    if (hasDot) {
      chars += 0.3;
    }
    return `calc(${`${Math.max(1, chars)}ch + 2px`})`;
  };
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
        <Container flex="row" gap="xxs" center="y">
          <Input
            variant="outline"
            pattern="^[0-9]*[.,]?[0-9]*$"
            inputMode="decimal"
            tabIndex={-1}
            placeholder="0"
            type="text"
            data-placeholder={props.tokenAmount === ""}
            value={props.tokenAmount || "0"}
            disabled={props.disabled}
            onClick={(e) => {
              // put cursor at the end of the input
              if (props.tokenAmount === "") {
                e.currentTarget.setSelectionRange(
                  e.currentTarget.value.length,
                  e.currentTarget.value.length,
                );
              }
            }}
            onChange={(e) => {
              let value = e.target.value;

              // Replace comma with period if it exists
              value = value.replace(",", ".");

              if (value.startsWith(".")) {
                value = `0${value}`;
              }

              if (value.length > 10) {
                return;
              }

              const numValue = Number(value);
              if (Number.isNaN(numValue)) {
                return;
              }

              if (value.startsWith("0") && !value.startsWith("0.")) {
                props.setTokenAmount(value.slice(1));
              } else {
                props.setTokenAmount(value);
              }
            }}
            style={{
              border: "none",
              fontSize: fontSize.lg,
              boxShadow: "none",
              borderRadius: "0",
              padding: "0",
              paddingBlock: "2px",
              fontWeight: 600,
              textAlign: "left",
              width: getWidth(),
            }}
          />

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

          <FiatValue
            chain={props.selectedChain}
            client={props.client}
            tokenAmount={props.tokenAmount}
            token={props.selectedToken}
            size="sm"
          />
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
              props.setScreen({
                id: "select-from-token",
                backScreen: { id: "main" },
              });
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
              props.setScreen({
                id: "select-from-token",
                backScreen: { id: "main" },
              });
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
              (payOptions.prefillBuy?.allowEdits?.chain === false &&
                payOptions.prefillBuy?.allowEdits?.token === false) ||
              (payOptions.buyWithCrypto !== false &&
                payOptions.buyWithCrypto?.prefillSource?.allowEdits?.token ===
                  false &&
                payOptions.buyWithCrypto?.prefillSource?.allowEdits?.chain ===
                  false)
            }
            token={toToken}
            chain={toChain}
            onSelectToken={props.onSelectBuyToken}
            client={props.client}
          />

          <Spacer y="md" />

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
                    props.setScreen({
                      id: "select-from-token",
                      backScreen: { id: "main" },
                    });
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
  setTokenAmount: (amount: string) => void;
  selectedToken: ERC20OrNativeToken;
  selectedChain: Chain;
  client: ThirdwebClient;
  onBack: () => void;
  disabled?: boolean;
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
          setTokenAmount={props.setTokenAmount}
          client={props.client}
          disabled={props.disabled}
        />

        <Spacer y="sm" />
        <Line />
        <Spacer y="sm" />
        {props.children}
      </Container>
    </Container>
  );
}

function createSupportedTokens(
  data: SupportedChainAndTokens,
  payOptions: PayUIOptions,
  supportedTokensOverrides?: SupportedTokens,
): SupportedTokens {
  // dev override
  if (supportedTokensOverrides) {
    return supportedTokensOverrides;
  }

  const tokens: SupportedTokens = {};
  const isBuyWithFiatDisabled = payOptions.buyWithFiat === false;
  const isBuyWithCryptoDisabled = payOptions.buyWithCrypto === false;

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
