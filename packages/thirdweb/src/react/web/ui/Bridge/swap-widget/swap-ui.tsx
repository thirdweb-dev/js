import styled from "@emotion/styled";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { prepare as BuyPrepare } from "../../../../../bridge/Buy.js";
import { Buy, Sell } from "../../../../../bridge/index.js";
import type { prepare as SellPrepare } from "../../../../../bridge/Sell.js";
import type { TokenWithPrices } from "../../../../../bridge/types/Token.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { getToken } from "../../../../../pay/convert/get-token.js";
import type { SupportedFiatCurrency } from "../../../../../pay/convert/type.js";
import { toTokens, toUnits } from "../../../../../utils/units.js";
import { useCustomTheme } from "../../../../core/design-system/CustomThemeProvider.js";
import {
  fontSize,
  iconSize,
  radius,
  spacing,
  type Theme,
} from "../../../../core/design-system/index.js";
import type { BridgePrepareRequest } from "../../../../core/hooks/useBridgePrepare.js";
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
import { Modal } from "../../components/Modal.js";
import { Skeleton } from "../../components/Skeleton.js";
import { Spacer } from "../../components/Spacer.js";
import { Spinner } from "../../components/Spinner.js";
import { Text } from "../../components/text.js";
import { useIsMobile } from "../../hooks/useisMobile.js";
import { ActiveWalletDetails } from "../common/active-wallet-details.js";
import { DecimalInput } from "../common/decimal-input.js";
import { SelectedTokenButton } from "../common/selected-token-button.js";
import { useTokenBalance } from "../common/token-balance.js";
import { SelectToken } from "./select-token-ui.js";
import type {
  ActiveWalletInfo,
  SwapPreparedQuote,
  SwapWidgetConnectOptions,
  TokenSelection,
} from "./types.js";
import { useBridgeChains } from "./use-bridge-chains.js";

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
    retry: false,
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
        autoFocusCrossIcon={false}
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
                isError: sellTokenQuery.isError,
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
                isError: buyTokenQuery.isError,
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
      {preparedResultQuery.error ||
      buyTokenQuery.isError ||
      sellTokenQuery.isError ? (
        <Text
          size="sm"
          color="danger"
          multiline
          center
          style={{
            paddingBlock: spacing.md,
          }}
        >
          {preparedResultQuery.error
            ? preparedResultQuery.error.message || "Failed to get a quote"
            : buyTokenQuery.isError
              ? "Failed to fetch buy token details"
              : sellTokenQuery.isError
                ? "Failed to fetch sell token details"
                : "Failed to get a quote"}
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
              borderRadius: radius.full,
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
        isError: boolean;
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
            <ActiveWalletDetails
              activeWalletInfo={props.activeWalletInfo}
              client={props.client}
              onClick={props.onWalletClick}
            />
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
