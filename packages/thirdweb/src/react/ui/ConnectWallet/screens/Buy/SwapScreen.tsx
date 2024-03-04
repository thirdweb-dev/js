import { Spacer } from "../../../components/Spacer.js";
import { Container, Line, ModalHeader } from "../../../components/basic.js";
import { useTWLocale } from "../../../../providers/locale-provider.js";
import { Input } from "../../../components/formElements.js";
import { Button } from "../../../components/buttons.js";
import { StyledDiv } from "../../../design-system/elements.js";
import { useCustomTheme } from "../../../design-system/CustomThemeProvider.js";
import {
  fontSize,
  iconSize,
  radius,
  spacing,
} from "../../../design-system/index.js";
import { Skeleton } from "../../../components/Skeleton.js";
import { Text } from "../../../components/text.js";
import { useDeferredValue, useMemo, useState } from "react";
import {
  CheckCircledIcon,
  ChevronDownIcon,
  CrossCircledIcon,
} from "@radix-ui/react-icons";
import { TokenSelector, formatTokenBalance } from "../TokenSelector.js";
import type { SupportedTokens, TokenInfo } from "../../defaultTokens.js";
import type { Chain } from "../../../../../chains/types.js";
import { Img } from "../../../components/Img.js";
import {
  useActiveAccount,
  useActiveWalletChain,
} from "../../../../providers/wallet-provider.js";
import { useChainQuery } from "../../../../hooks/others/useChainQuery.js";
import { ChainIcon, fallbackChainIcon } from "../../../components/ChainIcon.js";
import { useQuery } from "@tanstack/react-query";
import { toTokens } from "../../../../../utils/units.js";
import { useThirdwebProviderProps } from "../../../../hooks/others/useThirdwebProviderProps.js";
import {
  getSwapRoute,
  swapSupportedChains,
} from "../../../../../pay/swap/actions/getSwap.js";
import type { SwapSupportChainId } from "../../../../../pay/swap/actions/getSwap.js";
import type { Account } from "../../../../../wallets/interfaces/wallet.js";
import {
  convertModifiedToNormalSwapRouteParams,
  type ModifiedSwapRouteParams,
} from "./convertModifiedToNormalSwapRouteParams.js";
import { ChainButton, NetworkSelectorContent } from "../../NetworkSelector.js";
import { defineChain } from "../../../../../chains/utils.js";
import { useWalletBalance } from "../../../../hooks/others/useWalletBalance.js";
import { WalletIcon } from "../../icons/WalletIcon.js";
import { ZERO_ADDRESS } from "../../../../../constants/addresses.js";
import { ethereum } from "../../../../../chains/chain-definitions/ethereum.js";
import {
  useSendSwap,
  type SwapStatusParams,
} from "../../../../hooks/pay/useSendSwap.js";
import { Spinner } from "../../../components/Spinner.js";
import { ArrowTopBottom } from "../../icons/ArrowTopBottom.js";
import { useSwapStatus } from "../../../../hooks/pay/useSwapStatus.js";

// TODO: change ZERO_ADDRESS to NATIVE_TOKEN_ADDRESS when the change is done in backend

/**
 * @internal
 */
export function SwapScreen(props: {
  onBack: () => void;
  supportedTokens: SupportedTokens;
}) {
  const activeChain = useActiveWalletChain();
  const account = useActiveAccount();

  if (!activeChain || !account) {
    return null; // this should never happen
  }

  return (
    <SwapScreenContent {...props} activeChain={activeChain} account={account} />
  );
}

type TokenAmountState = {
  value: string;
  type: "source" | "destination";
};

/**
 *
 * @internal
 */
export function SwapScreenContent(props: {
  onBack: () => void;
  supportedTokens: SupportedTokens;
  activeChain: Chain;
  account: Account;
}) {
  const { activeChain, account } = props;
  const locale = useTWLocale();
  const screenLocale = locale.connectWallet.swapScreen;

  // screens
  const [screen, setScreen] = useState<
    | "main"
    | "select-from-token"
    | "select-to-token"
    | "select-from-chain"
    | "select-to-chain"
  >("main");

  // inputs ---

  // token amount
  const [tokenAmount, setTokenAmount] = useState<TokenAmountState>({
    value: "",
    type: "source",
  });

  const deferredTokenAmount = useDeferredValue(tokenAmount);

  const isChainSupported = useMemo(
    () => swapSupportedChains.includes(activeChain.id as any),
    [activeChain.id],
  );

  const [fromChain, setFromChain] = useState<Chain>(
    isChainSupported ? activeChain : ethereum,
  );

  const [toChain, setToChain] = useState<Chain>(
    isChainSupported ? activeChain : ethereum,
  );

  // selected tokens
  const [fromToken, setFromToken] = useState<
    TokenInfo | { nativeToken: true } | undefined
  >({ nativeToken: true });
  const [toToken, setToToken] = useState<
    TokenInfo | { nativeToken: true } | undefined
  >({ nativeToken: true });

  const { client } = useThirdwebProviderProps();

  const swapParams: ModifiedSwapRouteParams | undefined =
    // both token should be set, a value for token amount should be set and the conversion should be between same chain+token
    fromToken &&
    toToken &&
    deferredTokenAmount.value &&
    !(
      fromChain === toChain &&
      (fromToken === toToken ||
        ("nativeToken" in fromToken && "nativeToken" in toToken))
    )
      ? {
          client: client,
          // wallet
          fromAddress: account.address,
          // from token
          fromChainId: fromChain.id as SwapSupportChainId,
          fromTokenAddress:
            "nativeToken" in fromToken ? ZERO_ADDRESS : fromToken.address,
          toChainId: toChain.id as SwapSupportChainId,
          fromTokenAmount:
            tokenAmount.type === "source"
              ? deferredTokenAmount.value
              : undefined,
          // to
          toTokenAddress:
            "nativeToken" in toToken ? ZERO_ADDRESS : toToken.address,
          toTokenAmount:
            tokenAmount.type === "destination"
              ? deferredTokenAmount.value
              : undefined,
        }
      : undefined;

  const swapQuoteQuery = useQuery({
    queryKey: ["swapQuote", swapParams],
    queryFn: async () => {
      if (!swapParams) {
        throw new Error("Swap params are not set");
      }

      const convertedParams =
        await convertModifiedToNormalSwapRouteParams(swapParams);

      return getSwapRoute(convertedParams);
    },
    retry: false,
    enabled: !!swapParams,
  });

  const sendSwapMutation = useSendSwap();

  const [sentSwap, setSentSwap] = useState<SwapStatusParams | undefined>();

  if (sentSwap) {
    return (
      <WaitingForConfirmation
        onBack={() => {
          setSentSwap(undefined);
          setScreen("main");
        }}
        sentSwap={sentSwap}
      />
    );
  }

  if (screen === "select-from-token") {
    return (
      <TokenSelector
        onBack={() => setScreen("main")}
        tokenList={
          (fromChain?.id ? props.supportedTokens[fromChain.id] : undefined) ||
          []
        }
        onTokenSelect={(tokenInfo) => {
          setFromToken(tokenInfo);
          setScreen("main");
        }}
        chain={fromChain}
      />
    );
  }

  if (screen === "select-to-token") {
    return (
      <TokenSelector
        onBack={() => setScreen("main")}
        tokenList={
          (toChain?.id ? props.supportedTokens[toChain.id] : undefined) || []
        }
        onTokenSelect={(tokenInfo) => {
          setToToken(tokenInfo);
          setScreen("main");
        }}
        chain={toChain}
      />
    );
  }

  if (screen === "select-from-chain" || screen === "select-to-chain") {
    return (
      <NetworkSelectorContent
        onBack={() => setScreen("main")}
        // pass swap supported chains
        chains={swapSupportedChains.map(defineChain)}
        closeModal={() => setScreen("main")}
        networkSelector={{
          renderChain(renderChainProps) {
            return (
              <ChainButton
                chain={renderChainProps.chain}
                confirming={false}
                switchingFailed={false}
                onClick={() => {
                  const chain = renderChainProps.chain;
                  if (screen === "select-from-chain") {
                    setFromChain(chain);
                    setFromToken({ nativeToken: true });
                  } else {
                    setToChain(renderChainProps.chain);
                    setToToken({ nativeToken: true });
                  }
                  setScreen("main");
                }}
              />
            );
          },
        }}
      />
    );
  }

  // SOURCE TOKEN ----

  // if the token amount was entered by user - show that
  // else - show the loading status until the quote is loaded
  // once the quote is loaded, show the value calculated from the quote
  let sourceTokenAmount =
    tokenAmount.type === "source" ? tokenAmount.value : "";

  // if quote is loaded and
  if (swapQuoteQuery.data && !sourceTokenAmount) {
    // amount in # of tokens
    sourceTokenAmount = toTokens(
      BigInt(swapQuoteQuery.data.swapDetails.fromAmountWei), // amount in wei
      swapQuoteQuery.data.swapDetails.fromToken.decimals, // decimals
    ).toString();
  }

  // DESTINATION TOKEN ----

  let destinationTokenAmount =
    tokenAmount.type === "destination" ? tokenAmount.value : "";

  if (swapQuoteQuery.data && !destinationTokenAmount) {
    destinationTokenAmount = toTokens(
      BigInt(swapQuoteQuery.data.swapDetails.toAmountWei),
      swapQuoteQuery.data.swapDetails.toToken.decimals,
    ).toString();
  }

  return (
    <Container animate="fadein">
      <Container p="lg">
        <ModalHeader title={screenLocale.title} onBack={props.onBack} />

        <Spacer y="xl" />

        {/* From */}
        <SwapInput
          value={sourceTokenAmount}
          onChange={async (value) => {
            setTokenAmount({ value, type: "source" });
          }}
          label="From"
          valueIsLoading={swapQuoteQuery.isLoading && !sourceTokenAmount}
          onTokenClick={() => setScreen("select-from-token")}
          chain={fromChain}
          token={fromToken}
          estimatedValue={
            swapQuoteQuery.data?.swapDetails.estimated.fromAmountUSDCents
          }
          onChainClick={() => setScreen("select-from-chain")}
          isInput={tokenAmount.type === "source"}
        />

        <ToggleButton
          onClick={() => {
            // toggle amounts
            setTokenAmount({
              type: tokenAmount.type === "source" ? "destination" : "source",
              value: tokenAmount.value,
            });
            // toggle tokens
            setFromChain(toChain);
            setToChain(fromChain);
            // toggle chains
            setFromToken(toToken);
            setToToken(fromToken);
          }}
        />

        {/* To */}
        <SwapInput
          value={destinationTokenAmount}
          onChange={(value) => {
            setTokenAmount({ value, type: "destination" });
          }}
          label="To"
          valueIsLoading={swapQuoteQuery.isLoading && !destinationTokenAmount}
          onTokenClick={() => setScreen("select-to-token")}
          chain={toChain}
          token={toToken}
          estimatedValue={
            swapQuoteQuery.data?.swapDetails.estimated.toAmountMinUSDCents
          }
          onChainClick={() => setScreen("select-to-chain")}
          isInput={tokenAmount.type === "destination"}
        />

        {swapQuoteQuery.data && (
          <div>
            <Spacer y="xl" />
            <Text color="primaryText">Fee Breakdown</Text>
            <Spacer y="xs" />
            <Fees
              label="Processing Fees"
              amount={`${swapQuoteQuery.data.swapDetails.estimated.feesUSDCents / 100}`}
            />
          </div>
        )}

        {swapQuoteQuery.isError && (
          <div>
            <Spacer y="lg" />
            <Container flex="row" gap="xs" center="y" color="danger">
              <CrossCircledIcon width={iconSize.sm} height={iconSize.sm} />
              <Text color="danger" size="sm">
                Can not swap given tokens
              </Text>
            </Container>
          </div>
        )}

        <Spacer y="lg" />

        <Button
          variant="accent"
          fullWidth
          disabled={!swapQuoteQuery.isFetching && !swapQuoteQuery.data}
          onClick={async () => {
            if (swapQuoteQuery.data) {
              const res = await sendSwapMutation.mutateAsync(
                swapQuoteQuery.data,
              );
              setSentSwap(res);
            }
          }}
          gap="sm"
        >
          {sendSwapMutation.isPending ? (
            <>
              Awaiting confirmation
              <Spinner color="accentButtonText" size="sm" />
            </>
          ) : (
            "Purchase"
          )}
        </Button>
      </Container>
    </Container>
  );
}

function Fees(props: { label: string; amount: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Container color="secondaryText" flex="row" center="y" gap="xxs">
        <Text color="secondaryText" size="sm">
          {props.label}
        </Text>
      </Container>
      <Text color="secondaryText" size="sm">
        ${props.amount}
      </Text>
    </div>
  );
}

function SwapInput(props: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  valueIsLoading: boolean;
  onTokenClick: () => void;
  onChainClick: () => void;
  chain: Chain;
  token?: TokenInfo | { nativeToken: true };
  estimatedValue?: number;
  isInput: boolean;
}) {
  const chainQuery = useChainQuery(props.chain);
  const activeAccount = useActiveAccount();

  const token =
    props.token && !("nativeToken" in props.token) ? props.token : undefined;

  const balanceQuery = useWalletBalance({
    account: activeAccount,
    chain: props.chain,
    tokenAddress: token?.address,
  });

  const tokenIcon = token?.icon || chainQuery.data?.icon?.url;
  const tokenSymbol = token?.symbol || balanceQuery.data?.symbol;

  const isNotEnoughBalance =
    props.isInput &&
    balanceQuery.data &&
    Number(balanceQuery.data.displayValue) < Number(props.value);

  return (
    <SwapInputContainer>
      <Container>
        {/* Header row */}
        <Container
          flex="row"
          gap="sm"
          center="y"
          style={{
            justifyContent: "space-between",
            paddingBlock: spacing.xs,
            paddingRight: spacing.sm,
            paddingLeft: spacing.md,
          }}
        >
          <Text size="sm">{props.label}</Text>

          {/* Chain selector */}
          <Button
            variant="outline"
            style={{
              borderColor: "transparent",
              paddingBlock: spacing.xs,
              paddingInline: spacing.sm,
              paddingRight: 0,
              fontSize: fontSize.sm,
            }}
            gap="xxs"
            onClick={props.onChainClick}
          >
            <ChainIcon chain={chainQuery.data} size={iconSize.sm} />
            {chainQuery.data?.name || (
              <Skeleton width="90px" height={fontSize.xs} />
            )}
            <Container color="secondaryText">
              <ChevronDownIcon />
            </Container>
          </Button>
        </Container>
        <Line />
        <div
          style={{
            padding: spacing.sm,
          }}
        >
          {/* Row 1 */}
          <div
            style={{
              display: "flex",
              flexWrap: "nowrap",
              gap: spacing.xxs,
              alignItems: "center",
            }}
          >
            {/* Input */}
            <div
              style={{
                position: "relative",
              }}
            >
              {props.valueIsLoading && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    zIndex: 1,
                    transform: "translateY(-50%)",
                  }}
                >
                  <Skeleton width="120px" height={fontSize.xl} />
                </div>
              )}

              <Input
                type="number"
                inputMode="numeric"
                placeholder={props.valueIsLoading ? "" : "0"}
                variant="transparent"
                data-focus="false"
                style={{
                  height: "100%",
                  fontSize: fontSize.xl,
                  paddingBlock: spacing.xxs,
                  paddingInline: spacing.xxs,
                  paddingLeft: 0,
                }}
                value={props.value}
                onChange={(e) => {
                  props.onChange(e.target.value);
                }}
              />
            </div>

            {/* Token Selector */}
            <Button
              variant="outline"
              style={{
                borderColor: "transparent",
                justifyContent: "flex-start",
                padding: spacing.xxs,
                paddingRight: 0,
              }}
              gap="xxs"
              onClick={props.onTokenClick}
            >
              {props.token ? (
                <>
                  <Container flex="row" center="y" gap="xs">
                    {tokenIcon ? (
                      <Img
                        src={tokenIcon}
                        width={iconSize.md}
                        height={iconSize.md}
                        fallbackImage={fallbackChainIcon}
                      />
                    ) : (
                      <Skeleton
                        width={iconSize.md + "px"}
                        height={iconSize.md + "px"}
                      />
                    )}

                    {tokenSymbol ? (
                      <Text color="primaryText" size="sm">
                        {tokenSymbol}
                      </Text>
                    ) : (
                      <Skeleton width="70px" height={fontSize.sm} />
                    )}
                  </Container>

                  <Container color="secondaryText">
                    <ChevronDownIcon />
                  </Container>
                </>
              ) : (
                <Container flex="row" center="y" gap="xs" color="secondaryText">
                  <Text size="sm"> Select token </Text>
                  <ChevronDownIcon />
                </Container>
              )}
            </Button>
          </div>

          <Spacer y="sm" />

          {/* Row 2 */}
          <div
            style={{
              display: "flex",
              flexWrap: "nowrap",
              gap: spacing.xs,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {isNotEnoughBalance ? (
              <Text color="danger" size="xs">
                Exceeds balance
              </Text>
            ) : (
              <Text size="xs" color="secondaryText">
                {props.estimatedValue ? (
                  `$${props.estimatedValue / 100}`
                ) : props.valueIsLoading ? (
                  <Skeleton width="70px" height={fontSize.xs} />
                ) : (
                  "$0.0"
                )}
              </Text>
            )}

            <Container flex="row" gap="xs" color="secondaryText">
              <div
                title="Wallet Balance"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <WalletIcon size={iconSize.xs} />
              </div>
              {balanceQuery.data ? (
                <Text size="xs" color="secondaryText">
                  {formatTokenBalance(balanceQuery.data)}
                </Text>
              ) : (
                <Skeleton width="70px" height={fontSize.xs} />
              )}
            </Container>
          </div>
        </div>
      </Container>
    </SwapInputContainer>
  );
}

const SwapInputContainer = /* @__PURE__ */ StyledDiv(() => {
  const theme = useCustomTheme();
  return {
    border: `1px solid ${theme.colors.borderColor}`,
    borderRadius: radius.lg,
  };
});

function ToggleButton(props: { onClick: () => void }) {
  const [animate, setAnimate] = useState(false);
  return (
    <ToggleButtonContainer>
      <Button
        variant="outline"
        data-animate={animate}
        style={{
          borderRadius: "50%",
          padding: spacing.xs,
        }}
        onClick={() => {
          props.onClick();
          setAnimate(true);
          setTimeout(() => {
            setAnimate(false);
          }, 400);
        }}
      >
        <ArrowTopBottom size={iconSize.sm} />{" "}
      </Button>
    </ToggleButtonContainer>
  );
}

const ToggleButtonContainer = /* @__PURE__ */ StyledDiv(() => {
  const theme = useCustomTheme();
  return {
    margin: "-8px 0",
    display: "flex",
    justifyContent: "center",
    button: {
      transition: "transform 0.3s",
      backgroundColor: theme.colors.modalBg,
    },
    "button:hover": {
      transform: `scale(1.2)`,
    },
    "button[data-animate='true'] svg": {
      transition: "transform 0.3s",
      transform: `rotate(180deg)`,
    },
  };
});

function WaitingForConfirmation(props: {
  onBack: () => void;
  sentSwap: SwapStatusParams;
}) {
  const locale = useTWLocale();
  const screenLocale = locale.connectWallet.swapScreen;
  const swapStatus = useSwapStatus(props.sentSwap);

  return (
    <Container animate="fadein">
      <Container p="lg">
        <ModalHeader title={screenLocale.title} onBack={props.onBack} />
        <Spacer y="xl" />
        <Container
          flex="column"
          gap="lg"
          animate="fadein"
          center="both"
          style={{
            minHeight: "240px",
          }}
          color="success"
        >
          {swapStatus.data ? (
            <CheckCircledIcon width={iconSize.xl} height={iconSize.xl} />
          ) : (
            <Spinner size="xl" color="accentText" />
          )}

          <Text color={swapStatus.data ? "success" : "primaryText"}>
            {" "}
            {swapStatus.data
              ? "Swapped Successfully"
              : "Waiting for confirmation"}{" "}
          </Text>
        </Container>

        <Spacer y="lg" />
      </Container>
    </Container>
  );
}
