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
import { Container } from "../../../../components/basic.js";
import { Button } from "../../../../components/buttons.js";
import {
  Drawer,
  DrawerOverlay,
  useDrawer,
} from "../../../../components/Drawer.js";
import { Spacer } from "../../../../components/Spacer.js";
import { Spinner } from "../../../../components/Spinner.js";
import { Text } from "../../../../components/text.js";
import { TokenSymbol } from "../../../../components/token/TokenSymbol.js";
import type { PayEmbedConnectOptions } from "../../../../PayEmbed.js";
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
      client,
      tokenAddress: isNativeToken(fromToken) ? undefined : fromToken?.address,
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
          client,
          // wallets
          fromAddress: payer.account.address,
          // from
          fromChainId: fromChain.id,
          fromTokenAddress: isNativeToken(fromToken)
            ? NATIVE_TOKEN_ADDRESS
            : fromToken.address,
          paymentLinkId: props.paymentLinkId,
          purchaseData: payOptions.purchaseData,
          toAddress: receiverAddress,
          toAmount: tokenAmount,
          // to
          toChainId: toChain.id,
          toTokenAddress: isNativeToken(toToken)
            ? NATIVE_TOKEN_ADDRESS
            : toToken.address,
        }
      : undefined;

  const quoteQuery = useBuyWithCryptoQuote(quoteParams, {
    gcTime: 30 * 1000,
    refetchInterval: 30 * 1000,
    // refetch every 30 seconds
    staleTime: 30 * 1000,
  });

  const allowanceQuery = useQuery({
    enabled: !!quoteQuery.data?.approvalData,
    queryFn: () => {
      if (!quoteQuery.data?.approvalData) {
        return null;
      }
      return allowance({
        contract: getContract({
          address: quoteQuery.data.swapDetails.fromToken.tokenAddress,
          chain: getCachedChain(quoteQuery.data.swapDetails.fromToken.chainId),
          client: props.client,
        }),
        owner: props.payer.account.address,
        spender: quoteQuery.data.approvalData.spenderAddress,
      });
    },
    queryKey: [
      "allowance",
      payer.account.address,
      quoteQuery.data?.approvalData,
    ],
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
      approvalAmount: allowanceQuery.data ?? undefined,
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
    <Container animate="fadein" flex="column" gap="lg">
      {isOpen && (
        <>
          <DrawerOverlay ref={drawerOverlayRef} />
          <Drawer close={() => setIsOpen(false)} ref={drawerRef}>
            {drawerScreen === "fees" && quoteQuery.data && (
              <div>
                <Text color="primaryText" size="lg">
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
        <Container center="y" flex="row" gap="xxs">
          <Text size="sm">Pay with</Text>
          {fromToken && fromChain ? (
            <TokenSymbol
              chain={fromChain}
              color="secondaryText"
              size="sm"
              token={fromToken}
            />
          ) : (
            "crypto"
          )}
        </Container>
        <div>
          <PayWithCryptoQuoteInfo
            chain={fromChain}
            client={client}
            freezeChainAndTokenSelection={disableTokenSelection}
            isLoading={quoteQuery.isLoading && !sourceTokenAmount}
            onSelectToken={props.showFromTokenSelector}
            payerAccount={props.payer.account}
            swapRequired={swapRequired}
            token={fromToken}
            value={sourceTokenAmount || ""}
          />
          {swapRequired && fromChain && fromToken && (
            <EstimatedTimeAndFees
              estimatedSeconds={
                quoteQuery.data?.swapDetails.estimated.durationSeconds
              }
              onViewFees={showFees}
              quoteIsLoading={quoteQuery.isLoading}
            />
          )}
        </div>
        {/* Error message */}
        {errorMsg && (
          <div>
            <div>
              <Text center color="danger" multiline size="xs">
                {errorMsg.title}
              </Text>
              <Text center multiline size="xs">
                {errorMsg.message}
              </Text>
            </div>
          </div>
        )}

        {!errorMsg && isNotEnoughBalance && (
          <div>
            <Text center color="danger" multiline size="xs">
              Insufficient Funds
            </Text>
            <Text center multiline size="xs">
              Select another token or pay with card.
            </Text>
          </div>
        )}
      </Container>

      {/* Button */}
      {isNotEnoughBalance || errorMsg ? (
        <Button
          fullWidth
          onClick={() => props.showFromTokenSelector()}
          variant="accent"
        >
          Pay with another token
        </Button>
      ) : (
        <Button
          data-disabled={disableContinue}
          disabled={disableContinue}
          fullWidth
          gap="xs"
          onClick={async () => {
            if (!disableContinue) {
              if (props.payer.wallet.getChain()?.id !== fromChain?.id) {
                await props.payer.wallet.switchChain(fromChain);
              }
              showSwapFlow();
              trackPayEvent({
                chainId: fromChain.id,
                client: client,
                event: "confirm_swap_quote",
                fromToken: isNativeToken(fromToken)
                  ? undefined
                  : fromToken.address,
                toChainId: toChain.id,
                toToken: isNativeToken(toToken) ? undefined : toToken.address,
                walletAddress: payer.account.address,
                walletType: payer.wallet.id,
              });
            }
          }}
          variant={disableContinue ? "outline" : "accent"}
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
