import type { UseQueryResult } from "@tanstack/react-query";
import type { Chain } from "../../../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../../../constants/addresses.js";
import type {
  BuyWithCryptoQuote,
  GetBuyWithCryptoQuoteParams,
} from "../../../../../../../pay/buyWithCrypto/getQuote.js";
import type {
  Account,
  Wallet,
} from "../../../../../../../wallets/interfaces/wallet.js";
import { useWalletBalance } from "../../../../../../core/hooks/others/useWalletBalance.js";
import { useBuyWithCryptoQuote } from "../../../../../../core/hooks/pay/useBuyWithCryptoQuote.js";
import { Spacer } from "../../../../components/Spacer.js";
import { Spinner } from "../../../../components/Spinner.js";
import { SwitchNetworkButton } from "../../../../components/SwitchNetwork.js";
import { Container } from "../../../../components/basic.js";
import { Button } from "../../../../components/buttons.js";
import { Text } from "../../../../components/text.js";
import type { PayUIOptions } from "../../../ConnectButtonProps.js";
import { type ERC20OrNativeToken, isNativeToken } from "../../nativeToken.js";
import { EstimatedTimeAndFees } from "../EstimatedTimeAndFees.js";
import { TokenSelectedLayout } from "../main/TokenSelectedLayout.js";
import type { BuyForTx, SelectedScreen } from "../main/types.js";
import { SwapFees } from "./Fees.js";
import { PayWithCrypto } from "./PayWithCrypto.js";

export function SwapScreenMain(props: {
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
  client: ThirdwebClient;
  payOptions: PayUIOptions;
  buyForTx: BuyForTx | null;
  isEmbed: boolean;
  onViewPendingTx: () => void;
  onDone: () => void;
  onBack: () => void;
  activeWallet: Wallet;
}) {
  const {
    account,
    client,
    toChain,
    tokenAmount,
    toToken,
    fromChain,
    fromToken,
    payOptions,
  } = props;

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
          purchaseData: payOptions.purchaseData,
        }
      : undefined;

  const quoteQuery = useBuyWithCryptoQuote(quoteParams, {
    // refetch every 30 seconds
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
    gcTime: 30 * 1000,
  });

  return <SwapScreenMainUI {...props} quoteQuery={quoteQuery} />;
}

export function SwapScreenMainUI(props: {
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
  client: ThirdwebClient;
  payOptions: PayUIOptions;
  buyForTx: BuyForTx | null;
  isEmbed: boolean;
  onViewPendingTx: () => void;
  onDone: () => void;
  onBack: () => void;
  quoteQuery: UseQueryResult<BuyWithCryptoQuote>;
  activeWallet: Wallet;
}) {
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
    quoteQuery,
  } = props;

  const fromTokenBalanceQuery = useWalletBalance({
    address: account.address,
    chain: fromChain,
    tokenAddress: isNativeToken(fromToken) ? undefined : fromToken.address,
    client,
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
      id: "swapFlow",
      quote: quoteQuery.data,
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

  const content = (
    <Container flex="column" gap="md" animate="fadein">
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

  return (
    <TokenSelectedLayout
      selectedChain={toChain}
      selectedToken={toToken}
      tokenAmount={tokenAmount}
      client={client}
      onBack={props.onBack}
    >
      {content}
    </TokenSelectedLayout>
  );
}
