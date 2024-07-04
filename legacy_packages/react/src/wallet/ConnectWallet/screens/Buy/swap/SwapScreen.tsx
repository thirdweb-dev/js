/* eslint-disable i18next/no-literal-string */
import styled from "@emotion/styled";
import {
  ChevronDownIcon,
  ClockIcon,
  CrossCircledIcon,
} from "@radix-ui/react-icons";
import {
  useBuyWithCryptoQuote,
  shortenString,
  useChainId,
  useWallet,
  useWalletContext,
  type WalletInstance,
  useSwitchChain,
  useAddress,
  useWalletConfig,
  type WalletConfig,
  useSupportedChains,
} from "@thirdweb-dev/react-core";
import {
  type BuyWithCryptoQuote,
  NATIVE_TOKEN_ADDRESS,
  type GetBuyWithCryptoQuoteParams,
} from "@thirdweb-dev/sdk";
import { isAddress } from "ethers/lib/utils";
import { useMemo, useState } from "react";
import {
  useDrawer,
  DrawerOverlay,
  Drawer,
} from "../../../../../components/Drawer";
import { DynamicHeight } from "../../../../../components/DynamicHeight";
import { Skeleton } from "../../../../../components/Skeleton";
import { Spacer } from "../../../../../components/Spacer";
import { Spinner } from "../../../../../components/Spinner";
import { Container, ModalHeader } from "../../../../../components/basic";
import { Button } from "../../../../../components/buttons";
import { Input } from "../../../../../components/formElements";
import {
  radius,
  iconSize,
  fontSize,
  spacing,
} from "../../../../../design-system";
import { useCustomTheme } from "../../../../../design-system/CustomThemeProvider";
import { useDebouncedValue } from "../../../../hooks/useDebouncedValue";
import type { SupportedTokens } from "../../../defaultTokens";
import { WalletIcon } from "../../../icons/WalletIcon";
import type { IconFC } from "../../../icons/types";
import { TokenSelector } from "../../TokenSelector";
import { type ERC20OrNativeToken, NATIVE_TOKEN } from "../../nativeToken";
import { PaymentSelection } from "../PaymentSelection";
import { BuyTokenInput } from "./BuyTokenInput";
import { ConfirmationScreen } from "./ConfirmationScreen";
import { PayWithCrypto } from "./PayWithCrypto";
import { SwapFees } from "./SwapFees";
import { formatSeconds } from "./formatSeconds";
import { useSwapSupportedChains } from "./useSwapSupportedChains";
import { LoadingScreen } from "../../../../../components/LoadingScreen";
import { isNativeToken } from "../../../nativeToken";
import { Text } from "../../../../../components/text";
import { Img } from "../../../../../components/Img";
import type { Chain } from "@thirdweb-dev/chains";
import { useMultiChainBalance } from "../../../../hooks/useMultiChainBalance";

/**
 * @internal
 */
export function SwapScreen(props: {
  onBack: () => void;
  supportedTokens: SupportedTokens;
  onViewPendingTx: () => void;
}) {
  const chainId = useChainId();
  const activeWallet = useWallet();
  const activeWalletConfig = useWalletConfig();
  const { clientId } = useWalletContext();
  const activeAddress = useAddress();
  const supportedChainsQuery = useSwapSupportedChains(clientId || "");

  const supportedChains = supportedChainsQuery.data;

  // this should never happen
  if (
    !chainId ||
    !activeWallet ||
    !clientId ||
    !activeAddress ||
    !activeWalletConfig ||
    !supportedChains
  ) {
    return <LoadingScreen />;
  }

  return (
    <SwapScreenContent
      {...props}
      activeChainId={chainId}
      clientId={clientId}
      activeWallet={activeWallet}
      activeWalletConfig={activeWalletConfig}
      activeAddress={activeAddress}
      onViewPendingTx={props.onViewPendingTx}
      supportedChains={supportedChains}
    />
  );
}

type Screen = "main" | "select-from-token" | "select-to-token" | "confirmation";
type DrawerScreen = "fees" | "address" | undefined;

/**
 *
 * @internal
 */
export function SwapScreenContent(props: {
  clientId: string;
  onBack: () => void;
  supportedTokens: SupportedTokens;
  activeChainId: number;
  activeWallet: WalletInstance;
  activeAddress: string;
  onViewPendingTx: () => void;
  activeWalletConfig: WalletConfig;
  supportedChains: Chain[];
}) {
  const {
    activeChainId,
    clientId,
    activeWallet,
    activeAddress,
    supportedChains,
  } = props;
  const [isSwitching, setIsSwitching] = useState(false);
  const switchActiveWalletChain = useSwitchChain();
  const walletSupportedChains = useSupportedChains();

  // prefetch chains metadata

  // screens
  const [screen, setScreen] = useState<Screen>("main");
  const [drawerScreen, setDrawerScreen] = useState<DrawerScreen>();
  const { drawerRef, drawerOverlayRef, onClose } = useDrawer();

  const closeDrawer = () => {
    onClose(() => {
      setDrawerScreen(undefined);
    });
  };

  // token amount
  const [tokenAmount, setTokenAmount] = useState<string>("");
  const [hasEditedAmount, setHasEditedAmount] = useState(false);

  const isChainSupported = useMemo(
    () => supportedChains.find((c) => c.chainId === activeChainId),
    [activeChainId, supportedChains],
  );

  // selected chain
  const defaultChainId = isChainSupported ? activeChainId : 1;
  const [fromChainId, setFromChainId] = useState(defaultChainId);
  const [toChainId, setToChainId] = useState(defaultChainId);
  const [receiverAddress, setReceiverAddress] = useState<string>(activeAddress);

  // selected tokens
  const [fromToken, setFromToken] = useState<ERC20OrNativeToken>(NATIVE_TOKEN);
  const [toToken, setToToken] = useState<ERC20OrNativeToken>(
    props.supportedTokens[toChainId]?.[0] || NATIVE_TOKEN,
  );

  const deferredTokenAmount = useDebouncedValue(tokenAmount, 300);

  const fromTokenBalanceQuery = useMultiChainBalance({
    tokenAddress: isNativeToken(fromToken) ? undefined : fromToken.address,
    chainId: fromChainId,
  });

  // when a quote is finalized ( approve sent if required or swap sent )
  // we save it here to stop refetching the quote query
  const [finalizedQuote, setFinalizedQuote] = useState<
    BuyWithCryptoQuote | undefined
  >();

  const buyWithCryptoParams: GetBuyWithCryptoQuoteParams | undefined =
    deferredTokenAmount &&
    !finalizedQuote &&
    !(fromChainId === toChainId && fromToken === toToken)
      ? {
          // wallet
          fromAddress: activeAddress,
          toAddress: receiverAddress,
          // from token
          fromChainId: fromChainId,
          fromTokenAddress: isNativeToken(fromToken)
            ? NATIVE_TOKEN_ADDRESS
            : fromToken.address,
          toChainId: toChainId,
          // to
          toTokenAddress: isNativeToken(toToken)
            ? NATIVE_TOKEN_ADDRESS
            : toToken.address,
          toAmount: deferredTokenAmount,
          clientId,
        }
      : undefined;

  const buyWithCryptoQuoteQuery = useBuyWithCryptoQuote(buyWithCryptoParams, {
    // refetch every 30 seconds
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
  });

  if (!supportedChains) {
    return (
      <Container
        flex="row"
        center="both"
        style={{
          minHeight: "350px",
        }}
      >
        <Spinner color="secondaryText" size="lg" />
      </Container>
    );
  }

  if (screen === "select-from-token") {
    return (
      <TokenSelector
        onBack={() => setScreen("main")}
        tokenList={props.supportedTokens[fromChainId] || []}
        onTokenSelect={(tokenInfo) => {
          setFromToken(tokenInfo);
          setScreen("main");
        }}
        chainId={fromChainId}
        chainSelection={{
          chains: supportedChains,
          select: (c) => setFromChainId(c.chainId),
        }}
      />
    );
  }

  if (screen === "select-to-token") {
    return (
      <TokenSelector
        onBack={() => setScreen("main")}
        tokenList={props.supportedTokens[toChainId] || []}
        onTokenSelect={(tokenInfo) => {
          setToToken(tokenInfo);
          setScreen("main");
        }}
        chainId={toChainId}
        chainSelection={{
          chains: supportedChains,
          select: (c) => setToChainId(c.chainId),
        }}
      />
    );
  }

  const swapQuote = buyWithCryptoQuoteQuery.data;
  const isSwapQuoteError = buyWithCryptoQuoteQuery.isError;

  const getErrorMessage = () => {
    const defaultMessage = "Unable to get price quote";
    try {
      if (buyWithCryptoQuoteQuery.error instanceof Error) {
        if (buyWithCryptoQuoteQuery.error.message.includes("Minimum")) {
          const msg = buyWithCryptoQuoteQuery.error.message;
          return msg.replace("Fetch failed: Error: ", "");
        }
      }
      return defaultMessage;
    } catch {
      return defaultMessage;
    }
  };

  const sourceTokenAmount = swapQuote?.swapDetails.fromAmount || "";
  const quoteToConfirm = finalizedQuote || buyWithCryptoQuoteQuery.data;

  if (screen === "confirmation" && quoteToConfirm) {
    return (
      <ConfirmationScreen
        clientId={clientId}
        accountAddress={receiverAddress}
        onBack={() => {
          // remove finalized quote when going back
          setFinalizedQuote(undefined);
          setScreen("main");
        }}
        buyWithCryptoQuote={quoteToConfirm}
        onQuoteFinalized={(_quote) => {
          setFinalizedQuote(_quote);
        }}
        fromAmount={quoteToConfirm.swapDetails.fromAmount}
        toAmount={tokenAmount}
        fromChainId={fromChainId}
        toChainId={toChainId}
        fromToken={fromToken}
        toToken={toToken}
        onViewPendingTx={props.onViewPendingTx}
      />
    );
  }

  const isNotEnoughBalance =
    !!sourceTokenAmount &&
    !!fromTokenBalanceQuery.data &&
    Number(fromTokenBalanceQuery.data.displayValue) < Number(sourceTokenAmount);

  const disableContinue = !swapQuote || isNotEnoughBalance;
  const switchChainRequired = activeChainId !== fromChainId;

  const estimatedSeconds =
    buyWithCryptoQuoteQuery.data?.swapDetails.estimated.durationSeconds;

  return (
    <Container animate="fadein">
      <div
        onClick={(e) => {
          if (
            drawerScreen &&
            drawerRef.current &&
            !drawerRef.current.contains(e.target as Node)
          ) {
            e.preventDefault();
            e.stopPropagation();
            closeDrawer();
          }
        }}
      >
        {/* Drawer */}
        {drawerScreen && (
          <>
            <DrawerOverlay ref={drawerOverlayRef} />
            <Drawer ref={drawerRef} close={closeDrawer}>
              <DrawerContent
                drawerScreen={drawerScreen}
                quote={swapQuote}
                activeWallet={activeWallet}
                activeAddress={activeAddress}
                activeWalletConfig={props.activeWalletConfig}
                onSelect={(v) => {
                  setReceiverAddress(v);
                  closeDrawer();
                }}
              />
            </Drawer>
          </>
        )}

        <Container
          p="lg"
          style={{
            paddingBottom: 0,
          }}
        >
          <ModalHeader title="Buy" onBack={props.onBack} />
          <Spacer y="lg" />
          {!hasEditedAmount && <Spacer y="xl" />}

          {/* To */}
          <BuyTokenInput
            value={tokenAmount}
            onChange={async (value) => {
              setHasEditedAmount(true);
              setTokenAmount(value);
            }}
            token={toToken}
            chainId={toChainId}
            onSelectToken={() => setScreen("select-to-token")}
          />
        </Container>

        <Spacer y="md" />
        <Container px="lg">
          {hasEditedAmount && (
            <div>
              <PaymentSelection />
              <Spacer y="md" />

              {/* From */}
              <PayWithCrypto
                value={sourceTokenAmount}
                onSelectToken={() => {
                  setScreen("select-from-token");
                }}
                chainId={fromChainId}
                token={fromToken}
                isLoading={
                  buyWithCryptoQuoteQuery.isLoading && !sourceTokenAmount
                }
              />

              {/* Other info */}
              <Container
                bg="walletSelectorButtonHoverBg"
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
                  {buyWithCryptoQuoteQuery.isLoading ? (
                    <Skeleton height={fontSize.xs} width="50px" />
                  ) : (
                    <Text size="xs" color="secondaryText">
                      {estimatedSeconds
                        ? "~" + formatSeconds(estimatedSeconds)
                        : "--"}
                    </Text>
                  )}
                </Container>

                <FeesButton
                  variant="secondary"
                  onClick={() => {
                    setDrawerScreen("fees");
                  }}
                >
                  <Container color="accentText" flex="row" center="both">
                    <ViewFeeIcon size={iconSize.sm} />
                  </Container>
                  <Text size="xs" color="secondaryText">
                    View Fees
                  </Text>
                </FeesButton>
              </Container>

              <Spacer y="md" />

              {/* Send To */}
              <Container>
                <Text size="sm">Send To</Text>
                <Spacer y="xxs" />
                <WalletSelectorButton
                  activeAddress={activeAddress}
                  activeWalletConfig={props.activeWalletConfig}
                  address={receiverAddress}
                  activeWallet={activeWallet}
                  onClick={() => {
                    setDrawerScreen("address");
                  }}
                  chevron
                />
              </Container>

              <Spacer y="md" />

              <Container flex="column" gap="md">
                {isSwapQuoteError && (
                  <div>
                    <Container flex="row" gap="xs" center="y" color="danger">
                      <CrossCircledIcon
                        width={iconSize.sm}
                        height={iconSize.sm}
                      />
                      <Text color="danger" size="sm">
                        {getErrorMessage()}
                      </Text>
                    </Container>
                    <Spacer y="lg" />
                  </div>
                )}
              </Container>
            </div>
          )}

          {switchChainRequired && (
            <Button
              fullWidth
              variant="accent"
              disabled={!hasEditedAmount}
              data-disabled={!hasEditedAmount}
              gap="sm"
              onClick={async () => {
                setIsSwitching(true);
                try {
                  // need to update supported chains for wallet before switching to ensure it will work
                  if (
                    !walletSupportedChains.find(
                      (c) => c.chainId === fromChainId,
                    )
                  ) {
                    const chain = supportedChains.find(
                      (c) => c.chainId === fromChainId,
                    );
                    if (chain) {
                      activeWallet.updateChains([
                        ...walletSupportedChains,
                        chain,
                      ]);
                    }
                  }

                  await switchActiveWalletChain(fromChainId);
                } catch {}
                setIsSwitching(false);
              }}
            >
              {hasEditedAmount ? (
                <>
                  {isSwitching && (
                    <Spinner size="sm" color="accentButtonText" />
                  )}
                  {isSwitching ? "Switching" : "Switch Network"}
                </>
              ) : (
                "Continue"
              )}
            </Button>
          )}

          {!switchChainRequired && (
            <Button
              variant={disableContinue ? "outline" : "accent"}
              fullWidth
              data-disabled={disableContinue}
              disabled={disableContinue}
              onClick={async () => {
                if (!disableContinue) {
                  setScreen("confirmation");
                }
              }}
              gap="sm"
            >
              {isNotEnoughBalance ? "Not Enough Funds" : "Continue"}
            </Button>
          )}
        </Container>
        <Spacer y="lg" />
      </div>
    </Container>
  );
}

function DrawerContent(props: {
  drawerScreen: DrawerScreen;
  quote?: BuyWithCryptoQuote;
  activeWallet: WalletInstance;
  activeAddress: string;
  activeWalletConfig: WalletConfig;
  onSelect: (address: string) => void;
}) {
  const { drawerScreen, quote } = props;
  const [address, setAddress] = useState<string>("");
  const isValidAddress = useMemo(() => isAddress(address), [address]);
  const showError = !!address && !isValidAddress;

  return (
    <DynamicHeight>
      {drawerScreen === "fees" && (
        <div>
          <Text size="lg" color="primaryText">
            Fees
          </Text>

          <Spacer y="lg" />
          {quote && <SwapFees quote={quote} align="left" />}
        </div>
      )}

      {drawerScreen === "address" && (
        <div>
          <Text size="lg" color="primaryText">
            Send to
          </Text>
          <Spacer y="lg" />
          <Container
            flex="row"
            center="y"
            style={{
              flexWrap: "nowrap",
              height: "50px",
            }}
          >
            <StyledInput
              data-is-error={showError}
              value={address}
              placeholder="Enter wallet address"
              variant="outline"
              onChange={(e) => setAddress(e.target.value)}
            />
            <Button
              variant="accent"
              disabled={!isValidAddress}
              style={{
                height: "100%",
                minWidth: "100px",
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
              }}
              onClick={() => {
                props.onSelect(address);
              }}
            >
              Confirm
            </Button>
          </Container>

          {showError && (
            <>
              <Spacer y="xxs" />
              <Text color="danger" size="sm">
                Invalid address
              </Text>
            </>
          )}

          <Spacer y="xl" />
          <Text size="sm">Connected</Text>
          <Spacer y="xs" />
          <WalletSelectorButton
            address={props.activeAddress}
            activeAddress={props.activeAddress}
            activeWalletConfig={props.activeWalletConfig}
            activeWallet={props.activeWallet}
            onClick={() => {
              props.onSelect(props.activeAddress);
            }}
          />
        </div>
      )}
    </DynamicHeight>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledInput = /* @__PURE__ */ styled(Input)((_) => {
  const theme = useCustomTheme();
  return {
    border: `1.5px solid ${theme.colors.borderColor}`,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    height: "100%",
    boxSizing: "border-box",
    boxShadow: "none",
    borderRight: "none",
    "&:focus": {
      boxShadow: "none",
      borderColor: theme.colors.accentText,
    },
    "&[data-is-error='true']": {
      boxShadow: "none",
      borderColor: theme.colors.danger,
    },
  };
});

const ViewFeeIcon: IconFC = (props) => {
  return (
    <svg
      width={props.size}
      height={props.size}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.5 1.5H2.5C1.94772 1.5 1.5 1.94772 1.5 2.5V9.5C1.5 10.0523 1.94772 10.5 2.5 10.5H9.5C10.0523 10.5 10.5 10.0523 10.5 9.5V2.5C10.5 1.94772 10.0523 1.5 9.5 1.5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.5 7.5L7.5 4.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

function WalletSelectorButton(props: {
  onClick: () => void;
  activeWallet: WalletInstance;
  activeAddress: string;
  address: string;
  chevron?: boolean;
  activeWalletConfig: WalletConfig;
}) {
  return (
    <AccountButton variant="secondary" fullWidth onClick={props.onClick}>
      {props.activeAddress === props.address ? (
        <Img
          src={props.activeWalletConfig.meta.iconURL}
          width={iconSize.md}
          height={iconSize.md}
        />
      ) : (
        <Container color="secondaryText" flex="row" center="both">
          <WalletIcon size={iconSize.md} />
        </Container>
      )}

      <Text size="sm" color="primaryText">
        {shortenString(props.address, false)}
      </Text>
      {props.chevron && (
        <ChevronDownIcon
          width={iconSize.sm}
          height={iconSize.sm}
          style={{
            marginLeft: "auto",
          }}
        />
      )}
    </AccountButton>
  );
}

const FeesButton = /* @__PURE__ */ styled(Button)(() => {
  const theme = useCustomTheme();
  return {
    background: "transparent",
    border: `1px solid transparent`,
    "&:hover": {
      background: "transparent",
      borderColor: theme.colors.accentText,
    },
    justifyContent: "flex-start",
    transition: "background 0.3s, border-color 0.3s",
    gap: spacing.xs,
    padding: spacing.sm,
    color: theme.colors.primaryText,
    borderRadius: radius.md,
  };
});

const AccountButton = /* @__PURE__ */ styled(Button)(() => {
  const theme = useCustomTheme();
  return {
    background: theme.colors.walletSelectorButtonHoverBg,
    border: `1px solid ${theme.colors.borderColor}`,
    "&:hover": {
      background: theme.colors.walletSelectorButtonHoverBg,
      borderColor: theme.colors.accentText,
    },
    justifyContent: "flex-start",
    transition: "background 0.3s, border-color 0.3s",
    gap: spacing.sm,
    padding: spacing.sm,
    borderRadius: radius.md,
  };
});
