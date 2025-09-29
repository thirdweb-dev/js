import styled from "@emotion/styled";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { prepare as BuyPrepare } from "../../../../../bridge/Buy.js";
import { Buy, Sell } from "../../../../../bridge/index.js";
import type { prepare as SellPrepare } from "../../../../../bridge/Sell.js";
import type { BridgeChain } from "../../../../../bridge/types/Chain.js";
import type { TokenWithPrices } from "../../../../../bridge/types/Token.js";
import { defineChain } from "../../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../constants/addresses.js";
import { getToken } from "../../../../../pay/convert/get-token.js";
import type { SupportedFiatCurrency } from "../../../../../pay/convert/type.js";
import { getAddress, shortenAddress } from "../../../../../utils/address.js";
import { toTokens, toUnits } from "../../../../../utils/units.js";
import { AccountProvider } from "../../../../core/account/provider.js";
import { useCustomTheme } from "../../../../core/design-system/CustomThemeProvider.js";
import {
  fontSize,
  iconSize,
  radius,
  spacing,
  type Theme,
} from "../../../../core/design-system/index.js";
import { useWalletBalance } from "../../../../core/hooks/others/useWalletBalance.js";
import type { BridgePrepareRequest } from "../../../../core/hooks/useBridgePrepare.js";
import { WalletProvider } from "../../../../core/wallet/provider.js";
import { ConnectButton } from "../../ConnectWallet/ConnectButton.js";
import { DetailsModal } from "../../ConnectWallet/Details.js";
import { ArrowUpDownIcon } from "../../ConnectWallet/icons/ArrowUpDownIcon.js";
import connectLocaleEn from "../../ConnectWallet/locale/en.js";
import { PoweredByThirdweb } from "../../ConnectWallet/PoweredByTW.js";
import {
  formatCurrencyAmount,
  formatTokenAmount,
} from "../../ConnectWallet/screens/formatTokenBalance.js";
import { Container } from "../../components/basic.js";
import { Button } from "../../components/buttons.js";
import { Input } from "../../components/formElements.js";
import { Img } from "../../components/Img.js";
import { Modal } from "../../components/Modal.js";
import { Skeleton } from "../../components/Skeleton.js";
import { Spacer } from "../../components/Spacer.js";
import { Spinner } from "../../components/Spinner.js";
import { Text } from "../../components/text.js";
import { useIsMobile } from "../../hooks/useisMobile.js";
import { AccountAvatar } from "../../prebuilt/Account/avatar.js";
import { AccountBlobbie } from "../../prebuilt/Account/blobbie.js";
import { AccountName } from "../../prebuilt/Account/name.js";
import { WalletIcon } from "../../prebuilt/Wallet/icon.js";
import { SelectToken } from "./select-token-ui.js";
import type {
  ActiveWalletInfo,
  SwapPreparedQuote,
  SwapWidgetConnectOptions,
  TokenSelection,
} from "./types.js";
import { useBridgeChains } from "./use-bridge-chains.js";
import { cleanedChainName } from "./utils.js";

type SwapUIProps = {
  activeWalletInfo: ActiveWalletInfo | undefined;
  client: ThirdwebClient;
  theme: Theme | "light" | "dark";
  connectOptions: SwapWidgetConnectOptions | undefined;
  currency: SupportedFiatCurrency;
  showThirdwebBranding: boolean;
  onSwap: (data: {
    result: SwapPreparedQuote;
    request: BridgePrepareRequest;
    buyToken: TokenWithPrices;
    sellTokenBalance: bigint;
    sellToken: TokenWithPrices;
    mode: "buy" | "sell";
  }) => void;
  buyToken: TokenSelection | undefined;
  sellToken: TokenSelection | undefined;
  setBuyToken: (token: TokenSelection | undefined) => void;
  setSellToken: (token: TokenSelection | undefined) => void;
  amountSelection: {
    type: "buy" | "sell";
    amount: string;
  };
  setAmountSelection: (amountSelection: {
    type: "buy" | "sell";
    amount: string;
  }) => void;
  onDisconnect: (() => void) | undefined;
};

function useTokenPrice(options: {
  token: TokenSelection | undefined;
  client: ThirdwebClient;
}) {
  return useQuery({
    queryKey: ["token-price", options.token],
    enabled: !!options.token,
    queryFn: () => {
      if (!options.token) {
        throw new Error("Token is required");
      }
      return getToken(
        options.client,
        options.token.tokenAddress,
        options.token.chainId,
      );
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

/**
 * @internal
 */
export function SwapUI(props: SwapUIProps) {
  const [modalState, setModalState] = useState<{
    screen: "select-buy-token" | "select-sell-token";
    isOpen: boolean;
  }>({
    screen: "select-buy-token",
    isOpen: false,
  });

  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const isMobile = useIsMobile();

  // Token Prices ----------------------------------------------------------------------------
  const buyTokenQuery = useTokenPrice({
    token: props.buyToken,
    client: props.client,
  });
  const sellTokenQuery = useTokenPrice({
    token: props.sellToken,
    client: props.client,
  });

  const buyTokenWithPrices = buyTokenQuery.data;
  const sellTokenWithPrices = sellTokenQuery.data;

  // Swap Quote ----------------------------------------------------------------------------
  const preparedResultQuery = useSwapQuote({
    amountSelection: props.amountSelection,
    buyTokenWithPrices: buyTokenWithPrices,
    sellTokenWithPrices: sellTokenWithPrices,
    activeWalletInfo: props.activeWalletInfo,
    client: props.client,
  });

  // Amount and Amount.fetching ------------------------------------------------------------

  const sellTokenAmount =
    props.amountSelection.type === "sell"
      ? props.amountSelection.amount
      : preparedResultQuery.data &&
          props.amountSelection.type === "buy" &&
          sellTokenWithPrices
        ? toTokens(
            preparedResultQuery.data.result.originAmount,
            sellTokenWithPrices.decimals,
          )
        : "";

  const buyTokenAmount =
    props.amountSelection.type === "buy"
      ? props.amountSelection.amount
      : preparedResultQuery.data &&
          props.amountSelection.type === "sell" &&
          buyTokenWithPrices
        ? toTokens(
            preparedResultQuery.data.result.destinationAmount,
            buyTokenWithPrices.decimals,
          )
        : "";

  // when buy amount is set, the sell amount is fetched
  const isBuyAmountFetching =
    props.amountSelection.type === "sell" && preparedResultQuery.isFetching;
  const isSellAmountFetching =
    props.amountSelection.type === "buy" && preparedResultQuery.isFetching;

  // token balances ------------------------------------------------------------
  const sellTokenBalanceQuery = useTokenBalance({
    chainId: sellTokenWithPrices?.chainId,
    tokenAddress: sellTokenWithPrices?.address,
    client: props.client,
    walletAddress: props.activeWalletInfo?.activeAccount.address,
  });

  const buyTokenBalanceQuery = useTokenBalance({
    chainId: buyTokenWithPrices?.chainId,
    tokenAddress: buyTokenWithPrices?.address,
    client: props.client,
    walletAddress: props.activeWalletInfo?.activeAccount.address,
  });

  const notEnoughBalance = !!(
    sellTokenBalanceQuery.data &&
    sellTokenWithPrices &&
    props.amountSelection.amount &&
    !!sellTokenAmount &&
    sellTokenBalanceQuery.data.value <
      Number(toUnits(sellTokenAmount, sellTokenWithPrices.decimals))
  );

  // ----------------------------------------------------------------------------
  const disableContinue =
    !preparedResultQuery.data ||
    preparedResultQuery.isFetching ||
    notEnoughBalance;

  return (
    <Container p="md">
      <Modal
        hide={false}
        className="tw-modal__swap-widget"
        size={isMobile ? "compact" : "wide"}
        title="Select Token"
        open={modalState.isOpen}
        crossContainerStyles={{
          right: spacing.md,
          top: spacing["md+"],
          transform: "none",
        }}
        setOpen={(v) => {
          if (!v) {
            setModalState((v) => ({
              ...v,
              isOpen: false,
            }));
          }
        }}
      >
        {modalState.screen === "select-buy-token" && (
          <SelectToken
            activeWalletInfo={props.activeWalletInfo}
            onClose={() => {
              setModalState((v) => ({
                ...v,
                isOpen: false,
              }));
            }}
            client={props.client}
            selectedToken={props.buyToken}
            setSelectedToken={(token) => {
              props.setBuyToken(token);
              // if buy token is same as sell token, unset sell token
              if (
                props.sellToken &&
                token.tokenAddress.toLowerCase() ===
                  props.sellToken.tokenAddress.toLowerCase() &&
                token.chainId === props.sellToken.chainId
              ) {
                props.setSellToken(undefined);
              }
            }}
          />
        )}

        {modalState.screen === "select-sell-token" && (
          <SelectToken
            onClose={() => {
              setModalState((v) => ({
                ...v,
                isOpen: false,
              }));
            }}
            client={props.client}
            selectedToken={props.sellToken}
            setSelectedToken={(token) => {
              props.setSellToken(token);
              // if sell token is same as buy token, unset buy token
              if (
                props.buyToken &&
                token.tokenAddress.toLowerCase() ===
                  props.buyToken.tokenAddress.toLowerCase() &&
                token.chainId === props.buyToken.chainId
              ) {
                props.setBuyToken(undefined);
              }
            }}
            activeWalletInfo={props.activeWalletInfo}
          />
        )}
      </Modal>

      {detailsModalOpen && (
        <DetailsModal
          client={props.client}
          locale={connectLocaleEn}
          detailsModal={undefined}
          theme={props.theme}
          closeModal={() => {
            setDetailsModalOpen(false);
          }}
          onDisconnect={() => {
            props.onDisconnect?.();
          }}
          chains={[]}
          connectOptions={props.connectOptions}
        />
      )}

      {/* Sell  */}
      <TokenSection
        onMaxClick={() => {
          if (sellTokenBalanceQuery.data) {
            props.setAmountSelection({
              type: "sell",
              amount: sellTokenBalanceQuery.data.displayValue,
            });
          }
        }}
        activeWalletInfo={props.activeWalletInfo}
        isConnected={!!props.activeWalletInfo}
        balance={{
          data: sellTokenBalanceQuery.data?.value,
          isFetching: sellTokenBalanceQuery.isFetching,
        }}
        amount={{
          data: sellTokenAmount,
          isFetching: isSellAmountFetching,
        }}
        type="sell"
        setAmount={(value) => {
          props.setAmountSelection({ type: "sell", amount: value });
        }}
        selectedToken={
          props.sellToken
            ? {
                data: sellTokenQuery.data,
                isFetching: sellTokenQuery.isFetching,
              }
            : undefined
        }
        client={props.client}
        currency={props.currency}
        onSelectToken={() =>
          setModalState({
            screen: "select-sell-token",
            isOpen: true,
          })
        }
        onWalletClick={() => {
          setDetailsModalOpen(true);
        }}
      />

      {/* Switch */}
      <SwitchButton
        onClick={() => {
          // switch tokens
          const temp = props.sellToken;
          props.setSellToken(props.buyToken);
          props.setBuyToken(temp);
          props.setAmountSelection({
            type: props.amountSelection.type === "buy" ? "sell" : "buy",
            amount: props.amountSelection.amount,
          });
        }}
      />

      {/* Buy */}
      <TokenSection
        onMaxClick={undefined}
        onWalletClick={() => {
          setDetailsModalOpen(true);
        }}
        activeWalletInfo={props.activeWalletInfo}
        isConnected={!!props.activeWalletInfo}
        balance={{
          data: buyTokenBalanceQuery.data?.value,
          isFetching: buyTokenBalanceQuery.isFetching,
        }}
        amount={{
          data: buyTokenAmount,
          isFetching: isBuyAmountFetching,
        }}
        type="buy"
        selectedToken={
          props.buyToken
            ? {
                data: buyTokenQuery.data,
                isFetching: buyTokenQuery.isFetching,
              }
            : undefined
        }
        setAmount={(value) => {
          props.setAmountSelection({ type: "buy", amount: value });
        }}
        client={props.client}
        currency={props.currency}
        onSelectToken={() =>
          setModalState({
            screen: "select-buy-token",
            isOpen: true,
          })
        }
      />

      {/* error message */}
      {preparedResultQuery.error ? (
        <Text
          size="sm"
          color="danger"
          center
          style={{
            paddingBlock: spacing.md,
          }}
        >
          Failed to get a quote
        </Text>
      ) : (
        <Spacer y="md" />
      )}

      {/* Button */}
      {!props.activeWalletInfo ? (
        <ConnectButton
          client={props.client}
          connectButton={{
            label: "Swap",
            style: {
              width: "100%",
              borderRadius: radius.lg,
            },
          }}
          theme={props.theme}
          {...props.connectOptions}
        />
      ) : (
        <Button
          disabled={disableContinue}
          fullWidth
          onClick={() => {
            if (
              preparedResultQuery.data &&
              buyTokenWithPrices &&
              sellTokenWithPrices &&
              sellTokenBalanceQuery.data &&
              preparedResultQuery.data.type === "preparedResult"
            ) {
              props.onSwap({
                result: preparedResultQuery.data.result,
                request: preparedResultQuery.data.request,
                buyToken: buyTokenWithPrices,
                sellToken: sellTokenWithPrices,
                sellTokenBalance: sellTokenBalanceQuery.data.value,
                mode: props.amountSelection.type,
              });
            }
          }}
          gap="xs"
          style={{
            fontSize: fontSize.md,
            borderRadius: radius.full,
            opacity: disableContinue ? 0.5 : 1,
          }}
          variant="primary"
        >
          {preparedResultQuery.isFetching && <Spinner size="sm" />}
          {preparedResultQuery.isFetching
            ? "Fetching Quote"
            : notEnoughBalance
              ? "Insufficient Balance"
              : "Swap"}
        </Button>
      )}

      {props.showThirdwebBranding ? (
        <div>
          <Spacer y="md" />
          <PoweredByThirdweb link="https://thirdweb.com/monetize/bridge" />
        </div>
      ) : null}
    </Container>
  );
}

function useSwapQuote(params: {
  amountSelection: {
    type: "buy" | "sell";
    amount: string;
  };
  buyTokenWithPrices: TokenWithPrices | undefined;
  sellTokenWithPrices: TokenWithPrices | undefined;
  activeWalletInfo: ActiveWalletInfo | undefined;
  client: ThirdwebClient;
}) {
  const {
    amountSelection,
    buyTokenWithPrices,
    sellTokenWithPrices,
    activeWalletInfo,
    client,
  } = params;

  return useQuery({
    queryKey: [
      "swap-quote",
      amountSelection,
      buyTokenWithPrices,
      sellTokenWithPrices,
      activeWalletInfo?.activeAccount.address,
    ],
    retry: false,
    enabled:
      !!buyTokenWithPrices && !!sellTokenWithPrices && !!amountSelection.amount,
    queryFn: async (): Promise<
      | {
          type: "preparedResult";
          result: SwapPreparedQuote;
          request: Extract<BridgePrepareRequest, { type: "buy" | "sell" }>;
        }
      | {
          type: "quote";
          result: Buy.quote.Result | Sell.quote.Result;
        }
    > => {
      if (
        !buyTokenWithPrices ||
        !sellTokenWithPrices ||
        !amountSelection.amount
      ) {
        throw new Error("Invalid state");
      }

      if (!activeWalletInfo) {
        if (amountSelection.type === "buy") {
          const res = await Buy.quote({
            amount: toUnits(
              amountSelection.amount,
              buyTokenWithPrices.decimals,
            ),
            // origin = sell
            originChainId: sellTokenWithPrices.chainId,
            originTokenAddress: sellTokenWithPrices.address,
            // destination = buy
            destinationChainId: buyTokenWithPrices.chainId,
            destinationTokenAddress: buyTokenWithPrices.address,
            client: client,
          });

          return {
            type: "quote",
            result: res,
          };
        }

        const res = await Sell.quote({
          amount: toUnits(amountSelection.amount, sellTokenWithPrices.decimals),
          // origin = sell
          originChainId: sellTokenWithPrices.chainId,
          originTokenAddress: sellTokenWithPrices.address,
          // destination = buy
          destinationChainId: buyTokenWithPrices.chainId,
          destinationTokenAddress: buyTokenWithPrices.address,
          client: client,
        });

        return {
          type: "quote",
          result: res,
        };
      }

      if (amountSelection.type === "buy") {
        const buyRequestOptions: BuyPrepare.Options = {
          amount: toUnits(amountSelection.amount, buyTokenWithPrices.decimals),
          // origin = sell
          originChainId: sellTokenWithPrices.chainId,
          originTokenAddress: sellTokenWithPrices.address,
          // destination = buy
          destinationChainId: buyTokenWithPrices.chainId,
          destinationTokenAddress: buyTokenWithPrices.address,
          client: client,
          receiver: activeWalletInfo.activeAccount.address,
          sender: activeWalletInfo.activeAccount.address,
        };

        const buyRequest: BridgePrepareRequest = {
          type: "buy",
          ...buyRequestOptions,
        };

        const res = await Buy.prepare(buyRequest);

        return {
          type: "preparedResult",
          result: { type: "buy", ...res },
          request: buyRequest,
        };
      } else if (amountSelection.type === "sell") {
        const sellRequestOptions: SellPrepare.Options = {
          amount: toUnits(amountSelection.amount, sellTokenWithPrices.decimals),
          // origin = sell
          originChainId: sellTokenWithPrices.chainId,
          originTokenAddress: sellTokenWithPrices.address,
          // destination = buy
          destinationChainId: buyTokenWithPrices.chainId,
          destinationTokenAddress: buyTokenWithPrices.address,
          client: client,
          receiver: activeWalletInfo.activeAccount.address,
          sender: activeWalletInfo.activeAccount.address,
        };

        const res = await Sell.prepare(sellRequestOptions);

        const sellRequest: BridgePrepareRequest = {
          type: "sell",
          ...sellRequestOptions,
        };

        return {
          type: "preparedResult",
          result: { type: "sell", ...res },
          request: sellRequest,
        };
      }

      throw new Error("Invalid amount selection type");
    },
    refetchInterval: 20000,
  });
}

function DecimalInput(props: {
  value: string;
  setValue: (value: string) => void;
}) {
  const handleAmountChange = (inputValue: string) => {
    let processedValue = inputValue;

    // Replace comma with period if it exists
    processedValue = processedValue.replace(",", ".");

    if (processedValue.startsWith(".")) {
      processedValue = `0${processedValue}`;
    }

    const numValue = Number(processedValue);
    if (Number.isNaN(numValue)) {
      return;
    }

    if (processedValue.startsWith("0") && !processedValue.startsWith("0.")) {
      props.setValue(processedValue.slice(1));
    } else {
      props.setValue(processedValue);
    }
  };

  return (
    <Input
      inputMode="decimal"
      onChange={(e) => {
        handleAmountChange(e.target.value);
      }}
      onClick={(e) => {
        // put cursor at the end of the input
        if (props.value === "") {
          e.currentTarget.setSelectionRange(
            e.currentTarget.value.length,
            e.currentTarget.value.length,
          );
        }
      }}
      pattern="^[0-9]*[.,]?[0-9]*$"
      placeholder="0.0"
      style={{
        border: "none",
        boxShadow: "none",
        fontSize: fontSize.xl,
        fontWeight: 500,
        paddingInline: 0,
        paddingBlock: 0,
        letterSpacing: "-0.025em",
        height: "30px",
      }}
      type="text"
      value={props.value}
      variant="transparent"
    />
  );
}

function TokenSection(props: {
  type: "buy" | "sell";
  amount: {
    data: string;
    isFetching: boolean;
  };
  setAmount: (amount: string) => void;
  activeWalletInfo: ActiveWalletInfo | undefined;
  selectedToken:
    | {
        data: TokenWithPrices | undefined;
        isFetching: boolean;
      }
    | undefined;
  currency: SupportedFiatCurrency;
  onSelectToken: () => void;
  client: ThirdwebClient;
  isConnected: boolean;
  balance: {
    data: bigint | undefined;
    isFetching: boolean;
  };
  onWalletClick: () => void;
  onMaxClick: (() => void) | undefined;
}) {
  const theme = useCustomTheme();
  const chainQuery = useBridgeChains(props.client);
  const chain = chainQuery.data?.find(
    (chain) => chain.chainId === props.selectedToken?.data?.chainId,
  );

  const fiatPricePerToken = props.selectedToken?.data?.prices[props.currency];
  const totalFiatValue = !props.amount.data
    ? undefined
    : fiatPricePerToken
      ? fiatPricePerToken * Number(props.amount.data)
      : undefined;

  return (
    <Container
      style={{
        borderRadius: radius.xl,
        borderWidth: 1,
        borderStyle: "solid",
        position: "relative",
        overflow: "hidden",
      }}
      borderColor="borderColor"
    >
      {/* make the background semi-transparent */}
      <Container
        bg="tertiaryBg"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.5,
          zIndex: 0,
        }}
      />

      <Container
        style={{
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* row1 : label */}
        <Container
          px="md"
          py="sm"
          relative
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Container flex="row" center="y" gap="3xs" color="secondaryText">
            <Text
              size="xs"
              color="primaryText"
              style={{
                letterSpacing: "0.07em",
              }}
            >
              {props.type === "buy" ? "BUY" : "SELL"}
            </Text>
          </Container>
          {props.activeWalletInfo && (
            <WalletButton
              variant="ghost-solid"
              style={{
                paddingInline: spacing.xxs,
                paddingBlock: "2px",
              }}
              onClick={props.onWalletClick}
            >
              <ActiveWalletDetails
                activeWalletInfo={props.activeWalletInfo}
                client={props.client}
              />
            </WalletButton>
          )}
        </Container>

        <Container
          bg="tertiaryBg"
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: radius.xl,
            borderTop: `1px solid ${theme.colors.borderColor}`,
          }}
        >
          <SelectedTokenButton
            selectedToken={props.selectedToken}
            client={props.client}
            onSelectToken={props.onSelectToken}
            chain={chain}
          />

          <Container px="md" py="md">
            <Container
              flex="row"
              gap="xs"
              center="y"
              style={{
                flexWrap: "nowrap",
              }}
            >
              {props.amount.isFetching ? (
                <div style={{ flexGrow: 1 }}>
                  <Skeleton
                    height="30px"
                    width="140px"
                    style={{
                      borderRadius: radius.lg,
                    }}
                  />
                </div>
              ) : (
                <DecimalInput
                  value={props.amount.data}
                  setValue={props.setAmount}
                />
              )}

              {props.activeWalletInfo &&
                props.onMaxClick &&
                props.selectedToken && (
                  <Button
                    variant="outline"
                    style={{
                      paddingInline: spacing.xs,
                      paddingBlock: spacing.xxs,
                      borderRadius: radius.full,
                      fontSize: fontSize.xs,
                      fontWeight: 400,
                    }}
                    onClick={props.onMaxClick}
                  >
                    Max
                  </Button>
                )}
            </Container>

            <Spacer y="sm" />

            {/* row3 : fiat value and balance */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "3px",
                }}
              >
                {props.amount.isFetching ? (
                  <Skeleton height={fontSize.xs} width="50px" />
                ) : (
                  <Text size="xs" color="secondaryText">
                    {formatCurrencyAmount(props.currency, totalFiatValue || 0)}
                  </Text>
                )}
              </div>

              {/* Balance */}
              {props.isConnected && props.selectedToken && (
                <div>
                  {props.balance.data === undefined ||
                  props.selectedToken.data === undefined ? (
                    <Skeleton height={fontSize.xs} width="100px" />
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "3px",
                      }}
                    >
                      <Text size="xs" color="secondaryText">
                        Balance:
                      </Text>
                      <Text size="xs" color="primaryText">
                        {formatTokenAmount(
                          props.balance.data,
                          props.selectedToken.data.decimals,
                          5,
                        )}
                      </Text>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Container>
        </Container>
      </Container>
    </Container>
  );
}

function SelectedTokenButton(props: {
  selectedToken:
    | {
        data: TokenWithPrices | undefined;
        isFetching: boolean;
      }
    | undefined;
  client: ThirdwebClient;
  onSelectToken: () => void;
  chain: BridgeChain | undefined;
}) {
  const theme = useCustomTheme();
  return (
    <Button
      variant="ghost-solid"
      hoverBg="secondaryButtonBg"
      fullWidth
      onClick={props.onSelectToken}
      gap="sm"
      style={{
        borderBottom: `1px dashed ${theme.colors.borderColor}`,
        justifyContent: "space-between",
        paddingInline: spacing.md,
        paddingBlock: spacing.md,
        borderRadius: 0,
      }}
    >
      <Container gap="sm" flex="row" center="y">
        {/* icons */}
        <Container relative color="secondaryText">
          {/* token icon */}
          {props.selectedToken ? (
            <Img
              key={props.selectedToken?.data?.iconUri}
              src={
                props.selectedToken?.data === undefined
                  ? undefined
                  : props.selectedToken.data.iconUri || ""
              }
              client={props.client}
              width="40"
              height="40"
              fallback={
                <Container
                  style={{
                    background: `linear-gradient(45deg, white, ${theme.colors.accentText})`,
                    borderRadius: radius.full,
                    width: "40px",
                    height: "40px",
                  }}
                />
              }
              style={{
                objectFit: "cover",
                borderRadius: radius.full,
              }}
            />
          ) : (
            <Container
              style={{
                border: `1px solid ${theme.colors.borderColor}`,
                background: `linear-gradient(45deg, white, ${theme.colors.accentText})`,
                borderRadius: radius.full,
                width: "40px",
                height: "40px",
              }}
            />
          )}

          {/* chain icon */}
          {props.chain && (
            <Container
              bg="modalBg"
              style={{
                padding: "2px",
                position: "absolute",
                bottom: -2,
                right: -2,
                display: "flex",
                borderRadius: radius.full,
              }}
            >
              <Img
                src={props.chain?.icon}
                client={props.client}
                width={iconSize.sm}
                height={iconSize.sm}
                style={{
                  borderRadius: radius.full,
                }}
              />
            </Container>
          )}
        </Container>

        {/* token symbol and chain name */}
        {props.selectedToken ? (
          <Container flex="column" style={{ gap: "3px" }}>
            {props.selectedToken?.isFetching ? (
              <Skeleton width="60px" height={fontSize.md} />
            ) : (
              <Text size="md" color="primaryText" weight={500}>
                {props.selectedToken?.data?.symbol}
              </Text>
            )}

            {props.chain ? (
              <Text
                size="xs"
                color="secondaryText"
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {cleanedChainName(props.chain.name)}
              </Text>
            ) : (
              <Skeleton width="140px" height={fontSize.sm} />
            )}
          </Container>
        ) : (
          <Container flex="column" style={{ gap: "3px" }}>
            <Text size="md" color="primaryText" weight={500}>
              Select Token
            </Text>
            <Text size="xs" color="secondaryText">
              Required
            </Text>
          </Container>
        )}
      </Container>
      <Container
        color="secondaryText"
        flex="row"
        center="both"
        borderColor="borderColor"
        style={{
          borderRadius: radius.full,
          borderWidth: 1,
          borderStyle: "solid",
          padding: spacing.xs,
        }}
      >
        <ChevronDownIcon width={iconSize.sm} height={iconSize.sm} />
      </Container>
    </Button>
  );
}

function SwitchButton(props: { onClick: () => void }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginBlock: `-13px`,
        zIndex: 2,
        position: "relative",
      }}
    >
      <SwitchButtonInner
        variant="ghost-solid"
        onClick={(e) => {
          props.onClick();
          const node = e.currentTarget.querySelector("svg");
          if (node) {
            node.style.transform = "rotate(180deg)";
            node.style.transition = "transform 300ms ease";
            setTimeout(() => {
              node.style.transition = "";
              node.style.transform = "rotate(0deg)";
            }, 300);
          }
        }}
      >
        <ArrowUpDownIcon size={iconSize["sm+"]} />
      </SwitchButtonInner>
    </div>
  );
}

const SwitchButtonInner = /* @__PURE__ */ styled(Button)(() => {
  const theme = useCustomTheme();
  return {
    "&:hover": {
      background: theme.colors.secondaryButtonBg,
    },
    borderRadius: radius.full,
    padding: spacing.xs,
    color: theme.colors.primaryText,
    background: theme.colors.modalBg,
    border: `1px solid ${theme.colors.borderColor}`,
  };
});

function useTokenBalance(props: {
  chainId: number | undefined;
  tokenAddress: string | undefined;
  client: ThirdwebClient;
  walletAddress: string | undefined;
}) {
  return useWalletBalance({
    address: props.walletAddress,
    chain: props.chainId ? defineChain(props.chainId) : undefined,
    client: props.client,
    tokenAddress: props.tokenAddress
      ? getAddress(props.tokenAddress) === getAddress(NATIVE_TOKEN_ADDRESS)
        ? undefined
        : getAddress(props.tokenAddress)
      : undefined,
  });
}

function ActiveWalletDetails(props: {
  activeWalletInfo: ActiveWalletInfo;
  client: ThirdwebClient;
}) {
  const wallet = props.activeWalletInfo.activeWallet;
  const account = props.activeWalletInfo.activeAccount;

  const accountBlobbie = (
    <AccountBlobbie
      style={{
        width: `${iconSize.xs}px`,
        height: `${iconSize.xs}px`,
        borderRadius: radius.full,
      }}
    />
  );
  const accountAvatarFallback = (
    <WalletIcon
      style={{
        width: `${iconSize.xs}px`,
        height: `${iconSize.xs}px`,
      }}
      fallbackComponent={accountBlobbie}
      loadingComponent={accountBlobbie}
    />
  );

  return (
    <WalletProvider id={props.activeWalletInfo.activeWallet.id}>
      <AccountProvider address={account.address} client={props.client}>
        <WalletProvider id={wallet.id}>
          <Container flex="row" gap="xxs" center="y">
            <AccountAvatar
              style={{
                width: `${iconSize.xs}px`,
                height: `${iconSize.xs}px`,
                borderRadius: radius.full,
              }}
              fallbackComponent={accountAvatarFallback}
              loadingComponent={accountAvatarFallback}
            />

            <span
              style={{
                fontSize: fontSize.xs,
                letterSpacing: "0.025em",
              }}
            >
              <AccountName
                fallbackComponent={
                  <span>{shortenAddress(account.address)}</span>
                }
                loadingComponent={
                  <span>{shortenAddress(account.address)}</span>
                }
              />
            </span>
          </Container>
        </WalletProvider>
      </AccountProvider>
    </WalletProvider>
  );
}

const WalletButton = /* @__PURE__ */ styled(Button)(() => {
  const theme = useCustomTheme();
  return {
    color: theme.colors.secondaryText,
    transition: "color 200ms ease",
    "&:hover": {
      color: theme.colors.primaryText,
    },
  };
});
