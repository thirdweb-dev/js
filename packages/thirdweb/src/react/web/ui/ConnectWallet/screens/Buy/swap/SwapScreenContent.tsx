import { trackPayEvent } from "../../../../../../../analytics/track/pay.js";
import type { Chain } from "../../../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../../../constants/addresses.js";
import type { Account } from "../../../../../../../wallets/interfaces/wallet.js";
import type { PayUIOptions } from "../../../../../../core/hooks/connection/ConnectButtonProps.js";
import { useWalletBalance } from "../../../../../../core/hooks/others/useWalletBalance.js";
import {
  useBuyPrepare,
  type UseBuyPrepareParams,
} from "../../../../../../core/hooks/bridge/useBuyPrepare.js";
import { getErrorMessage } from "../../../../../utils/errors.js";
import type { PayEmbedConnectOptions } from "../../../../PayEmbed.js";
import { Value } from "ox";
import { Spinner } from "../../../../components/Spinner.js";
import { Container } from "../../../../components/basic.js";
import { Button } from "../../../../components/buttons.js";
import { Text } from "../../../../components/text.js";
import { TokenSymbol } from "../../../../components/token/TokenSymbol.js";
import type { ConnectLocale } from "../../../locale/types.js";
import { type ERC20OrNativeToken, isNativeToken } from "../../nativeToken.js";
import type { SelectedScreen } from "../main/types.js";
import type { PayerInfo } from "../types.js";
import { PayWithCryptoQuoteInfo } from "./PayWithCrypto.js";
import {
  fontSize,
  iconSize,
  radius,
} from "../../../../../../core/design-system/index.js";
import { ClockIcon } from "@radix-ui/react-icons";
import { formatSeconds } from "./formatSeconds.js";
import { Skeleton } from "../../../../components/Skeleton.js";

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
  const quoteParams: UseBuyPrepareParams | undefined =
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

  const quoteQuery = useBuyPrepare(quoteParams, {
    // refetch every 30 seconds
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
    gcTime: 30 * 1000,
  });

  // Extract values directly from Bridge quote for display
  const firstStep = quoteQuery.data?.steps[0];
  const hasValidQuote = !!quoteQuery.data && !!firstStep;

  const sourceTokenAmount =
    swapRequired && firstStep
      ? Value.format(
        firstStep.originAmount,
        firstStep.originToken.decimals,
      ).toString()
      : tokenAmount;

  const isNotEnoughBalance =
    !!sourceTokenAmount &&
    !!fromTokenBalanceQuery.data &&
    Number(fromTokenBalanceQuery.data.displayValue) < Number(sourceTokenAmount);

  const disableContinue =
    !fromChain ||
    !fromToken ||
    (swapRequired && !hasValidQuote) ||
    isNotEnoughBalance;

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

  return (
    <Container flex="column" gap="lg" animate="fadein">
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
            <Container
              bg="tertiaryBg"
              flex="row"
              borderColor="borderColor"
              style={{
                borderRadius: radius.md,
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                justifyContent: "space-between",
                alignItems: "center",
                borderWidth: "1px",
                borderStyle: "solid",
              }}
            >
              <Container
                flex="row"
                center="y"
                gap="xxs"
                color="accentText"
                p="sm"
              >
                <ClockIcon width={iconSize.sm} height={iconSize.sm} />
                {quoteQuery.isLoading ? (
                  <Skeleton
                    height={fontSize.xs}
                    width="50px"
                    color="borderColor"
                  />
                ) : (
                  <Text size="xs" color="secondaryText">
                    {quoteQuery.data?.estimatedExecutionTimeMs !== undefined
                      ? `~${formatSeconds(quoteQuery.data.estimatedExecutionTimeMs / 1000)}`
                      : "--"}
                  </Text>
                )}
              </Container>
            </Container>
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
