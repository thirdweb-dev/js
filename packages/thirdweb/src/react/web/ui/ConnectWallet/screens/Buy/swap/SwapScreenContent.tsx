import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { trackPayEvent } from "../../../../../../../analytics/track/pay.js";
import type { Chain } from "../../../../../../../chains/types.js";
import { getCachedChain } from "../../../../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../../../constants/addresses.js";
import { getContract } from "../../../../../../../contract/contract.js";
import { allowance } from "../../../../../../../extensions/erc20/__generated__/IERC20/read/allowance.js";
import type { GetBuyWithCryptoQuoteParams } from "../../../../../../../pay/buyWithCrypto/getQuote.js";
import type { Account } from "../../../../../../../wallets/interfaces/wallet.js";
import type { PayUIOptions } from "../../../../../../core/hooks/connection/ConnectButtonProps.js";
import { useWalletBalance } from "../../../../../../core/hooks/others/useWalletBalance.js";
import { useBuyWithCryptoQuote } from "../../../../../../core/hooks/pay/useBuyWithCryptoQuote.js";
import { getErrorMessage } from "../../../../../utils/errors.js";
import type { PayEmbedConnectOptions } from "../../../../PayEmbed.js";
import {
  Drawer,
  DrawerOverlay,
  useDrawer,
} from "../../../../components/Drawer.js";
import { Spacer } from "../../../../components/Spacer.js";
import { Spinner } from "../../../../components/Spinner.js";
import { Container } from "../../../../components/basic.js";
import { Button } from "../../../../components/buttons.js";
import { Text } from "../../../../components/text.js";
import { TokenSymbol } from "../../../../components/token/TokenSymbol.js";
import type { ConnectLocale } from "../../../locale/types.js";
import { type ERC20OrNativeToken, isNativeToken } from "../../nativeToken.js";
import { EstimatedTimeAndFees } from "../EstimatedTimeAndFees.js";
import type { SelectedScreen } from "../main/types.js";
import type { PayerInfo } from "../types.js";
import { SwapFees } from "./Fees.js";
import { PayWithCryptoQuoteInfo } from "./PayWithCrypto.js";

export function SwapScreenContent(props: {
  setScreen: (screen: SelectedScreen) => void;
  tokenAmount: string;
  toToken: ERC20OrNativeToken;
  toChain: Chain;
  fromChain: Chain | undefined;
  fromToken: ERC20OrNativeToken | undefined;
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
  paymentLinkId: undefined | string;
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

  const fromTokenBalanceQuery = useWalletBalance(
    {
      address: payer.account.address,
      chain: fromChain,
      tokenAddress: isNativeToken(fromToken) ? undefined : fromToken?.address,
      client,
    },
    {
      enabled: !!fromChain && !!fromToken,
    },
  );

  const fromTokenId = isNativeToken(fromToken)
    ? NATIVE_TOKEN_ADDRESS
    : fromToken?.address?.toLowerCase();
  const toTokenId = isNativeToken(toToken)
    ? NATIVE_TOKEN_ADDRESS
    : toToken.address.toLowerCase();
  const swapRequired =
    !!tokenAmount &&
    !!fromChain &&
    !!fromTokenId &&
    !(fromChain?.id === toChain.id && fromTokenId === toTokenId);
  const quoteParams: GetBuyWithCryptoQuoteParams | undefined =
    fromChain && fromToken && swapRequired
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
          paymentLinkId: props.paymentLinkId,
        }
      : undefined;

  const quoteQuery = useBuyWithCryptoQuote(quoteParams, {
    // refetch every 30 seconds
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
    gcTime: 30 * 1000,
  });

  const allowanceQuery = useQuery({
    queryKey: [
      "allowance",
      payer.account.address,
      quoteQuery.data?.approvalData,
    ],
    queryFn: () => {
      if (!quoteQuery.data?.approvalData) {
        return null;
      }
      return allowance({
        contract: getContract({
          client: props.client,
          address: quoteQuery.data.swapDetails.fromToken.tokenAddress,
          chain: getCachedChain(quoteQuery.data.swapDetails.fromToken.chainId),
        }),
        spender: quoteQuery.data.approvalData.spenderAddress,
        owner: props.payer.account.address,
      });
    },
    enabled: !!quoteQuery.data?.approvalData,
    refetchOnMount: true,
  });

  const sourceTokenAmount = swapRequired
    ? quoteQuery.data?.swapDetails.fromAmount
    : tokenAmount;

  const isNotEnoughBalance =
    !!sourceTokenAmount &&
    !!fromTokenBalanceQuery.data &&
    Number(fromTokenBalanceQuery.data.displayValue) < Number(sourceTokenAmount);

  const disableContinue =
    !fromChain ||
    !fromToken ||
    (swapRequired && !quoteQuery.data) ||
    isNotEnoughBalance ||
    allowanceQuery.isLoading;

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
      approvalAmount: allowanceQuery.data ?? undefined,
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
    <Container flex="column" gap="lg" animate="fadein">
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
      <Container flex="column" gap="sm">
        <Container flex="row" gap="xxs" center="y">
          <Text size="sm">Pay with</Text>
          {fromToken && fromChain ? (
            <TokenSymbol
              token={fromToken}
              chain={fromChain}
              size="sm"
              color="secondaryText"
            />
          ) : (
            "crypto"
          )}
        </Container>
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
            onSelectToken={props.showFromTokenSelector}
          />
          {swapRequired && fromChain && fromToken && (
            <EstimatedTimeAndFees
              quoteIsLoading={quoteQuery.isLoading}
              estimatedSeconds={
                quoteQuery.data?.swapDetails.estimated.durationSeconds
              }
              onViewFees={showFees}
            />
          )}
        </div>
        {/* Error message */}
        {errorMsg && (
          <div>
            <div>
              <Text color="danger" size="xs" center multiline>
                {errorMsg.title}
              </Text>
              <Text size="xs" center multiline>
                {errorMsg.message}
              </Text>
            </div>
          </div>
        )}

        {!errorMsg && isNotEnoughBalance && (
          <div>
            <Text color="danger" size="xs" center multiline>
              Insufficient Funds
            </Text>
            <Text size="xs" center multiline>
              Select another token or pay with card.
            </Text>
          </div>
        )}
      </Container>

      {/* Button */}
      {isNotEnoughBalance || errorMsg ? (
        <Button
          variant="accent"
          fullWidth
          onClick={() => props.showFromTokenSelector()}
        >
          Pay with another token
        </Button>
      ) : (
        <Button
          variant={disableContinue ? "outline" : "accent"}
          fullWidth
          data-disabled={disableContinue}
          disabled={disableContinue}
          onClick={async () => {
            if (!disableContinue) {
              if (props.payer.wallet.getChain()?.id !== fromChain?.id) {
                await props.payer.wallet.switchChain(fromChain);
              }
              showSwapFlow();
              trackPayEvent({
                event: "confirm_swap_quote",
                client: client,
                walletAddress: payer.account.address,
                walletType: payer.wallet.id,
                chainId: fromChain.id,
                fromToken: isNativeToken(fromToken)
                  ? undefined
                  : fromToken.address,
                toChainId: toChain.id,
                toToken: isNativeToken(toToken) ? undefined : toToken.address,
              });
            }
          }}
          gap="xs"
        >
          {quoteQuery.isLoading ? (
            <>
              Getting price quote
              <Spinner size="sm" />
            </>
          ) : (
            "Continue"
          )}
        </Button>
      )}
    </Container>
  );
}
