import styled from "@emotion/styled";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  DiscIcon,
} from "@radix-ui/react-icons";
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
import {
  getFiatSymbol,
  type SupportedFiatCurrency,
} from "../../../../../pay/convert/type.js";
import { getAddress } from "../../../../../utils/address.js";
import { toTokens, toUnits } from "../../../../../utils/units.js";
import { useCustomTheme } from "../../../../core/design-system/CustomThemeProvider.js";
import {
  fontSize,
  iconSize,
  radius,
  spacing,
  type Theme,
} from "../../../../core/design-system/index.js";
import { useWalletBalance } from "../../../../core/hooks/others/useWalletBalance.js";
import type {
  BridgePrepareRequest,
  BridgePrepareResult,
} from "../../../../core/hooks/useBridgePrepare.js";
import { ConnectButton } from "../../ConnectWallet/ConnectButton.js";
import { ArrowUpDownIcon } from "../../ConnectWallet/icons/ArrowUpDownIcon.js";
import { WalletDotIcon } from "../../ConnectWallet/icons/WalletDotIcon.js";
import { PoweredByThirdweb } from "../../ConnectWallet/PoweredByTW.js";
import { formatTokenAmount } from "../../ConnectWallet/screens/formatTokenBalance.js";
import { Container } from "../../components/basic.js";
import { Button } from "../../components/buttons.js";
import { Input } from "../../components/formElements.js";
import { Img } from "../../components/Img.js";
import { Skeleton } from "../../components/Skeleton.js";
import { Spacer } from "../../components/Spacer.js";
import { Text } from "../../components/text.js";
import { DecimalRenderer } from "./common.js";
import { SelectToken } from "./select-token-ui.js";
import type {
  ActiveWalletInfo,
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
    result: Extract<BridgePrepareResult, { type: "buy" | "sell" }>;
    request: Extract<BridgePrepareRequest, { type: "buy" | "sell" }>;
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
};

export function SwapUI(props: SwapUIProps) {
  const [screen, setScreen] = useState<
    "base" | "select-buy-token" | "select-sell-ui"
  >("base");

  if (screen === "base") {
    return (
      <SwapUIBase
        {...props}
        onSelectToken={(type) => {
          setScreen(type === "buy" ? "select-buy-token" : "select-sell-ui");
        }}
      />
    );
  }

  if (screen === "select-buy-token") {
    return (
      <SelectToken
        activeWalletInfo={props.activeWalletInfo}
        onBack={() => setScreen("base")}
        client={props.client}
        selectedToken={props.buyToken}
        setSelectedToken={(token) => {
          props.setBuyToken(token);
          setScreen("base");
          // if buy token is same as sell token, unset sell token
          if (
            props.sellToken &&
            token.tokenAddress === props.sellToken.tokenAddress &&
            token.chainId === props.sellToken.chainId
          ) {
            props.setSellToken(undefined);
          }
        }}
      />
    );
  }

  if (screen === "select-sell-ui") {
    return (
      <SelectToken
        onBack={() => setScreen("base")}
        client={props.client}
        selectedToken={props.sellToken}
        setSelectedToken={(token) => {
          props.setSellToken(token);
          setScreen("base");
          // if sell token is same as buy token, unset buy token
          if (
            props.buyToken &&
            token.tokenAddress === props.buyToken.tokenAddress &&
            token.chainId === props.buyToken.chainId
          ) {
            props.setBuyToken(undefined);
          }
        }}
        activeWalletInfo={props.activeWalletInfo}
      />
    );
  }

  return null;
}

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

function SwapUIBase(
  props: SwapUIProps & {
    onSelectToken: (type: "buy" | "sell") => void;
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
  },
) {
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

  return (
    <Container p="md">
      {/* Sell  */}
      <TokenSection
        isConnected={!!props.activeWalletInfo}
        notEnoughBalance={notEnoughBalance}
        balance={{
          data: sellTokenBalanceQuery.data?.value,
          isFetching: sellTokenBalanceQuery.isFetching,
        }}
        amount={{
          data: sellTokenAmount,
          isFetching: isSellAmountFetching,
        }}
        label="Sell"
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
        onSelectToken={() => props.onSelectToken("sell")}
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
        isConnected={!!props.activeWalletInfo}
        notEnoughBalance={false}
        balance={{
          data: buyTokenBalanceQuery.data?.value,
          isFetching: buyTokenBalanceQuery.isFetching,
        }}
        amount={{
          data: buyTokenAmount,
          isFetching: isBuyAmountFetching,
        }}
        label="Buy"
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
        onSelectToken={() => props.onSelectToken("buy")}
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
        <Spacer y="lg" />
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
          disabled={
            !preparedResultQuery.data ||
            preparedResultQuery.isFetching ||
            notEnoughBalance
          }
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
          style={{
            fontSize: fontSize.md,
            padding: `${spacing.sm} ${spacing.md}`,
            borderRadius: radius.lg,
          }}
          variant="primary"
        >
          Swap
        </Button>
      )}

      {props.showThirdwebBranding ? (
        <div>
          <Spacer y="md" />
          <PoweredByThirdweb />
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
          result: Extract<BridgePrepareResult, { type: "buy" | "sell" }>;
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
        fontSize: fontSize.xxl,
        fontWeight: 500,
        paddingInline: 0,
        paddingBlock: 0,
      }}
      type="text"
      value={props.value}
      variant="transparent"
    />
  );
}

function TokenSection(props: {
  label: string;
  notEnoughBalance: boolean;
  amount: {
    data: string;
    isFetching: boolean;
  };
  setAmount: (amount: string) => void;
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
}) {
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
      p="sm"
      borderColor="borderColor"
      bg="tertiaryBg"
      style={{ borderRadius: radius.lg, borderWidth: 1, borderStyle: "solid" }}
    >
      {/* row1 : label */}
      <Text size="md" color="primaryText" weight={500}>
        {props.label}
      </Text>

      {/* row2 : amount and select token */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: spacing.sm,
          paddingBottom: spacing.sm,
          paddingTop: spacing.sm,
        }}
      >
        {props.amount.isFetching ? (
          <Skeleton
            height={fontSize.xxl}
            width="140px"
            style={{
              borderRadius: radius.lg,
            }}
          />
        ) : (
          <DecimalInput value={props.amount.data} setValue={props.setAmount} />
        )}

        {!props.selectedToken ? (
          <Button
            variant="accent"
            style={{
              borderRadius: radius.full,
              gap: spacing.xxs,
              paddingBlock: spacing.sm,
              paddingInline: spacing.sm,
            }}
            onClick={props.onSelectToken}
          >
            {" "}
            Select Token
            <ChevronDownIcon width={iconSize.sm} height={iconSize.sm} />
          </Button>
        ) : (
          <SelectedTokenButton
            selectedToken={props.selectedToken}
            client={props.client}
            onSelectToken={props.onSelectToken}
            chain={chain}
          />
        )}
      </div>

      {/* row3 : fiat value/error and balance */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          justifyContent: "space-between",
        }}
      >
        {/* Exceeds Balance / Fiat Value */}
        {props.notEnoughBalance ? (
          <Text size="md" color="danger" weight={500}>
            {" "}
            Exceeds Balance{" "}
          </Text>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <Text size="md" color="secondaryText" weight={500}>
              {getFiatSymbol(props.currency)}
            </Text>
            {props.amount.isFetching ? (
              <Skeleton height={fontSize.md} width="50px" />
            ) : (
              <div>
                <DecimalRenderer
                  integerSize="md"
                  fractionSize="sm"
                  value={totalFiatValue?.toFixed(5) || "0.00"}
                  color="secondaryText"
                  weight={500}
                />
              </div>
            )}
          </div>
        )}

        {/* Balance */}
        {props.isConnected && props.selectedToken && (
          <div>
            {props.balance.data === undefined ||
            props.selectedToken.data === undefined ? (
              <Skeleton height={fontSize.md} width="50px" />
            ) : (
              <Text
                size="md"
                color="secondaryText"
                weight={500}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: spacing.xxs,
                }}
              >
                <WalletDotIcon size={fontSize.xs} />
                <DecimalRenderer
                  integerSize="md"
                  fractionSize="sm"
                  color="secondaryText"
                  weight={500}
                  value={formatTokenAmount(
                    props.balance.data,
                    props.selectedToken.data.decimals,
                    5,
                  )}
                />
              </Text>
            )}
          </div>
        )}
      </div>
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
  return (
    <Button
      variant="outline"
      bg="secondaryButtonBg"
      onClick={props.onSelectToken}
      gap="xs"
      style={{
        borderRadius: radius.full,
        paddingBlock: spacing.xxs,
        paddingInline: spacing.xs,
      }}
    >
      {/* icons */}
      <Container relative color="secondaryText">
        {/* token icon */}
        <Img
          key={props.selectedToken?.data?.iconUri}
          src={
            props.selectedToken?.data === undefined
              ? undefined
              : props.selectedToken.data.iconUri || ""
          }
          client={props.client}
          width={iconSize.lg}
          height={iconSize.lg}
          skeletonColor="modalBg"
          fallback={<DiscIcon width={iconSize.lg} height={iconSize.lg} />}
          style={{
            borderRadius: radius.full,
          }}
        />

        {/* chain icon */}
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
      </Container>

      {/* token symbol and chain name */}
      <Container flex="column" style={{ gap: "2px" }}>
        {props.selectedToken?.isFetching ? (
          <Skeleton width="40px" height={fontSize.sm} color="modalBg" />
        ) : (
          <Text size="sm" color="primaryText" weight={500}>
            {props.selectedToken?.data?.symbol}
          </Text>
        )}

        {props.chain ? (
          <Text
            size="xs"
            color="secondaryText"
            weight={500}
            style={{
              maxWidth: "100px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {cleanedChainName(props.chain.name)}
          </Text>
        ) : (
          <Skeleton width="70px" height={fontSize.xs} color="modalBg" />
        )}
      </Container>
      <Container color="secondaryText">
        <ChevronRightIcon width={iconSize.xs} height={iconSize.xs} />
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
        marginBlock: `-14px`,
      }}
    >
      <SwitchButtonInner
        variant="outline"
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
        <ArrowUpDownIcon size={iconSize.md} />
      </SwitchButtonInner>
    </div>
  );
}

const SwitchButtonInner = /* @__PURE__ */ styled(Button)(() => {
  const theme = useCustomTheme();
  return {
    "&:hover": {
      background: theme.colors.modalBg,
    },
    borderRadius: radius.lg,
    padding: spacing.xs,
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
