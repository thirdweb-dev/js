import styled from "@emotion/styled";
import { ChevronDownIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Buy, Sell } from "../../../../../bridge/index.js";
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
import { ConnectButton } from "../../ConnectWallet/ConnectButton.js";
import { ArrowUpDownIcon } from "../../ConnectWallet/icons/ArrowUpDownIcon.js";
import { Container } from "../../components/basic.js";
import { Button } from "../../components/buttons.js";
import { Input } from "../../components/formElements.js";
import { Img } from "../../components/Img.js";
import { Skeleton } from "../../components/Skeleton.js";
import { Spacer } from "../../components/Spacer.js";
import { Text } from "../../components/text.js";
import { SelectBuyToken } from "./select-buy-token.js";
import { SelectSellToken } from "./select-sell-token.js";
import { getLastUsedTokens, setLastUsedTokens } from "./storage.js";
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
  onSwap: (
    quote: Buy.quote.Result | Sell.quote.Result,
    selection: {
      buyToken: TokenWithPrices;
      sellTokenBalance: bigint;
      sellToken: TokenWithPrices;
    },
  ) => void;
  prefill:
    | {
        buyToken?: {
          tokenAddress?: string;
          chainId: number;
          amount?: string;
        };
        sellToken?: {
          tokenAddress?: string;
          chainId: number;
          amount?: string;
        };
      }
    | undefined;
};

export function SwapUI(props: SwapUIProps) {
  const [screen, setScreen] = useState<
    "base" | "select-buy-token" | "select-sell-ui"
  >("base");

  const [amountSelection, setAmountSelection] = useState<{
    type: "buy" | "sell";
    amount: string;
  }>(() => {
    if (props.prefill?.buyToken?.amount) {
      return {
        type: "buy",
        amount: props.prefill.buyToken.amount,
      };
    }
    if (props.prefill?.sellToken?.amount) {
      return {
        type: "sell",
        amount: props.prefill.sellToken.amount,
      };
    }
    return {
      type: "buy",
      amount: "",
    };
  });

  const [buyToken, setBuyToken] = useState<TokenSelection | undefined>(() => {
    if (props.prefill?.buyToken) {
      return {
        tokenAddress:
          props.prefill.buyToken.tokenAddress ||
          getAddress(NATIVE_TOKEN_ADDRESS),
        chainId: props.prefill.buyToken.chainId,
      };
    }
    const last = getLastUsedTokens()?.buyToken;
    if (last) {
      return {
        tokenAddress: getAddress(last.tokenAddress),
        chainId: last.chainId,
      };
    }
    return undefined;
  });
  const [sellToken, setSellToken] = useState<TokenSelection | undefined>(() => {
    if (props.prefill?.sellToken) {
      return {
        tokenAddress:
          props.prefill.sellToken.tokenAddress ||
          getAddress(NATIVE_TOKEN_ADDRESS),
        chainId: props.prefill.sellToken.chainId,
      };
    }
    const last = getLastUsedTokens()?.sellToken;
    if (last) {
      return {
        tokenAddress: getAddress(last.tokenAddress),
        chainId: last.chainId,
      };
    }
    return undefined;
  });

  // persist selections to localStorage whenever they change
  useEffect(() => {
    if (buyToken) {
      setLastUsedTokens({ buyToken, sellToken });
    }
  }, [buyToken, sellToken]);

  console.log("prefill", props.prefill);

  if (screen === "base") {
    return (
      <SwapUIBase
        {...props}
        onSelectToken={(type) => {
          setScreen(type === "buy" ? "select-buy-token" : "select-sell-ui");
        }}
        buyToken={buyToken}
        sellToken={sellToken}
        setBuyToken={setBuyToken}
        setSellToken={setSellToken}
        amountSelection={amountSelection}
        setAmountSelection={setAmountSelection}
      />
    );
  }

  if (screen === "select-buy-token") {
    return (
      <SelectBuyToken
        onBack={() => setScreen("base")}
        client={props.client}
        selectedToken={buyToken}
        setSelectedToken={(token) => {
          setBuyToken(token);
          setScreen("base");
        }}
      />
    );
  }

  if (screen === "select-sell-ui") {
    return (
      <SelectSellToken
        onBack={() => setScreen("base")}
        client={props.client}
        selectedToken={sellToken}
        theme={props.theme}
        setSelectedToken={(token) => {
          setSellToken(token);
          setScreen("base");
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

export function SwapUIBase(
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

  const preparedResultQuery = useQuery({
    queryKey: [
      "swap-quote",
      props.amountSelection,
      buyTokenWithPrices,
      sellTokenWithPrices,
    ],
    enabled:
      !!buyTokenWithPrices &&
      !!sellTokenWithPrices &&
      !!props.amountSelection.amount,
    queryFn: async () => {
      if (
        !buyTokenWithPrices ||
        !sellTokenWithPrices ||
        !props.activeWalletInfo ||
        !props.amountSelection.amount
      ) {
        throw new Error("Invalid state");
      }

      if (props.amountSelection.type === "buy") {
        const res = await Buy.quote({
          buyAmountWei: toUnits(
            props.amountSelection.amount,
            buyTokenWithPrices.decimals,
          ),
          // origin = sell
          originChainId: sellTokenWithPrices.chainId,
          originTokenAddress: sellTokenWithPrices.address,
          // destination = buy
          destinationChainId: buyTokenWithPrices.chainId,
          destinationTokenAddress: buyTokenWithPrices.address,
          client: props.client,
        });

        return res;
      } else if (props.amountSelection.type === "sell") {
        const res = await Sell.prepare({
          amount: toUnits(
            props.amountSelection.amount,
            sellTokenWithPrices.decimals,
          ),
          // origin = sell
          originChainId: sellTokenWithPrices.chainId,
          originTokenAddress: sellTokenWithPrices.address,
          // destination = buy
          destinationChainId: buyTokenWithPrices.chainId,
          destinationTokenAddress: buyTokenWithPrices.address,
          client: props.client,
          receiver: props.activeWalletInfo.activeAccount.address,
          sender: props.activeWalletInfo.activeAccount.address,
        });

        return res;
      }

      return null;
    },
    refetchInterval: 20000,
  });

  const sellTokenAmount =
    props.amountSelection.type === "sell"
      ? props.amountSelection.amount
      : preparedResultQuery.data &&
          props.amountSelection.type === "buy" &&
          sellTokenWithPrices
        ? toTokens(
            preparedResultQuery.data.originAmount,
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
            preparedResultQuery.data.destinationAmount,
            buyTokenWithPrices.decimals,
          )
        : "";

  // when buy amount is set, the sell amount is fetched
  const isBuyAmountFetching =
    props.amountSelection.type === "sell" && preparedResultQuery.isFetching;
  const isSellAmountFetching =
    props.amountSelection.type === "buy" && preparedResultQuery.isFetching;

  const sellTokenBalanceQuery = useTokenBalance({
    chainId: sellTokenWithPrices?.chainId,
    tokenAddress: sellTokenWithPrices?.address,
    client: props.client,
    walletAddress: props.activeWalletInfo?.activeAccount.address,
  });

  return (
    <Container p="md">
      {/* Sell  */}
      <TokenSection
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
        }}
      />

      {/* Buy */}
      <TokenSection
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

      <Spacer y="lg" />

      {/* Button */}
      {!props.activeWalletInfo ? (
        <ConnectButton
          client={props.client}
          connectButton={{
            label: "Connect Wallet",
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
          disabled={!preparedResultQuery.data || preparedResultQuery.isFetching}
          fullWidth
          onClick={() => {
            if (
              preparedResultQuery.data &&
              buyTokenWithPrices &&
              sellTokenWithPrices &&
              sellTokenBalanceQuery.data
            ) {
              props.onSwap(preparedResultQuery.data, {
                buyToken: buyTokenWithPrices,
                sellToken: sellTokenWithPrices,
                sellTokenBalance: sellTokenBalanceQuery.data.value,
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
    </Container>
  );
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
      {/* label */}
      <Text size="md" color="primaryText" weight={500}>
        {props.label}
      </Text>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          minHeight: "60px",
          justifyContent: "space-between",
          gap: spacing.sm,
        }}
      >
        {props.amount.isFetching ? (
          <Skeleton height={fontSize.xxl} width="140px" />
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

      {/* Fiat Value */}
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        <Text size="md" color="secondaryText" weight={500}>
          {getFiatSymbol(props.currency)}
        </Text>
        {props.amount.isFetching ? (
          <Skeleton height={fontSize.md} width="50px" />
        ) : (
          <Text size="md" color="secondaryText" weight={500}>
            {totalFiatValue === undefined
              ? "0.00"
              : totalFiatValue < 0.01
                ? "~0.00"
                : totalFiatValue.toFixed(2)}
          </Text>
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
        padding: spacing.xs,
      }}
    >
      {/* icons */}
      <div
        style={{
          position: "relative",
        }}
      >
        {/* token icon */}
        <Img
          src={
            props.selectedToken === undefined
              ? undefined
              : props.selectedToken.data?.iconUri || ""
          }
          client={props.client}
          width={iconSize.lg}
          height={iconSize.lg}
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
      </div>

      {/* token symbol and chain name */}
      <Container flex="column" style={{ gap: "2px" }}>
        {props.selectedToken?.isFetching ? (
          <Skeleton width="40px" height={fontSize.md} color="modalBg" />
        ) : (
          <Text size="md" color="primaryText" weight={500}>
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
        <ChevronRightIcon width={iconSize.sm} height={iconSize.sm} />
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
