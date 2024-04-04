import { ClockIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { useMemo, useState } from "react";
import { polygon } from "../../../../../../chains/chain-definitions/polygon.js";
import type { Chain } from "../../../../../../chains/types.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../../constants/addresses.js";
import type {
  Account,
  Wallet,
} from "../../../../../../wallets/interfaces/wallet.js";
import { useChainsQuery } from "../../../../../core/hooks/others/useChainQuery.js";
import { useWalletBalance } from "../../../../../core/hooks/others/useWalletBalance.js";
import {
  useBuyWithCryptoQuote,
  type BuyWithCryptoQuoteQueryParams,
} from "../../../../../core/hooks/pay/useBuyWithCryptoQuote.js";
import {
  useActiveAccount,
  useActiveWallet,
  useActiveWalletChain,
  useSwitchActiveWalletChain,
} from "../../../../../core/hooks/wallets/wallet-hooks.js";
import { Spacer } from "../../../components/Spacer.js";
import { Spinner } from "../../../components/Spinner.js";
import { Container, ModalHeader } from "../../../components/basic.js";
import { Button } from "../../../components/buttons.js";
import { Text } from "../../../components/text.js";
import {
  fontSize,
  iconSize,
  radius,
  spacing,
} from "../../../design-system/index.js";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue.js";
import type { SupportedTokens } from "../../defaultTokens.js";
import { TokenSelector } from "../TokenSelector.js";
import {
  NATIVE_TOKEN,
  isNativeToken,
  type ERC20OrNativeToken,
} from "../nativeToken.js";
import { PaymentSelection } from "./PaymentSelection.js";
import { BuyTokenInput } from "./swap/BuyTokenInput.js";
import { ConfirmationScreen } from "./swap/ConfirmationScreen.js";
import { PayWithCrypto } from "./swap/PayWithCrypto.js";
// import { SwapFees } from "./swap/SwapFees.js";
import type { BuyWithCryptoQuote } from "../../../../../../pay/buyWithCrypto/actions/getQuote.js";
import { useSwapSupportedChains } from "./swap/useSwapSupportedChains.js";
import type { ThirdwebClient } from "../../../../../../client/client.js";
import { Skeleton } from "../../../components/Skeleton.js";
import type { IconFC } from "../../icons/types.js";
import styled from "@emotion/styled";
import { useCustomTheme } from "../../../design-system/CustomThemeProvider.js";
import {
  Drawer,
  DrawerOverlay,
  useDrawer,
} from "../../../components/Drawer.js";
import { SwapFees } from "./swap/SwapFees.js";
import { WalletImage } from "../../../components/WalletImage.js";
import { shortenString } from "../../../../../core/utils/addresses.js";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Input } from "../../../components/formElements.js";
import { WalletIcon } from "../../icons/WalletIcon.js";
import { isAddress } from "../../../../../../utils/address.js";
import { DynamicHeight } from "../../../components/DynamicHeight.js";
import { formatSeconds } from "./swap/formatSeconds.js";

/**
 * @internal
 */
export function SwapScreen(props: {
  onBack: () => void;
  supportedTokens: SupportedTokens;
  onViewPendingTx: () => void;
  client: ThirdwebClient;
}) {
  const activeChain = useActiveWalletChain();
  const activeWallet = useActiveWallet();
  const account = useActiveAccount();

  if (!activeChain || !account || !activeWallet) {
    return null; // this should never happen
  }

  return (
    <SwapScreenContent
      {...props}
      activeChain={activeChain}
      activeWallet={activeWallet}
      account={account}
      onViewPendingTx={props.onViewPendingTx}
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
  client: ThirdwebClient;
  onBack: () => void;
  supportedTokens: SupportedTokens;
  activeChain: Chain;
  activeWallet: Wallet;
  account: Account;
  onViewPendingTx: () => void;
}) {
  const { activeChain, account, client, activeWallet } = props;
  const [isSwitching, setIsSwitching] = useState(false);
  const switchActiveWalletChain = useSwitchActiveWalletChain();
  const supportedChainsQuery = useSwapSupportedChains(client);

  const supportedChains = supportedChainsQuery.data;

  // prefetch chains metadata
  useChainsQuery(supportedChains || [], 50);

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
    () => supportedChains?.find((c) => c.id === activeChain.id),
    [activeChain.id, supportedChains],
  );

  // selected chain
  const defaultChain = isChainSupported ? activeChain : polygon;
  const [fromChain, setFromChain] = useState<Chain>(defaultChain);
  const [toChain, setToChain] = useState<Chain>(defaultChain);
  const [address, setAddress] = useState<string>(account.address);

  // selected tokens
  const [fromToken, setFromToken] = useState<ERC20OrNativeToken>(NATIVE_TOKEN);
  const [toToken, setToToken] = useState<ERC20OrNativeToken>(
    props.supportedTokens[toChain.id]?.[0] || NATIVE_TOKEN,
  );

  const deferredTokenAmount = useDebouncedValue(tokenAmount, 300);

  const fromTokenBalanceQuery = useWalletBalance({
    address: account.address,
    chain: fromChain,
    tokenAddress: isNativeToken(fromToken) ? undefined : fromToken.address,
  });

  // when a quote is finalized ( approve sent if required or swap sent )
  // we save it here to stop refetching the quote query
  const [finalizedQuote, setFinalizedQuote] = useState<
    BuyWithCryptoQuote | undefined
  >();

  const buyWithCryptoParams: BuyWithCryptoQuoteQueryParams | undefined =
    deferredTokenAmount &&
    !finalizedQuote &&
    !(fromChain.id === toChain.id && fromToken === toToken)
      ? {
          // wallet
          fromAddress: address,
          // from token
          fromChainId: fromChain.id,
          fromTokenAddress: isNativeToken(fromToken)
            ? NATIVE_TOKEN_ADDRESS
            : fromToken.address,
          toChainId: toChain.id,
          // to
          toTokenAddress: isNativeToken(toToken)
            ? NATIVE_TOKEN_ADDRESS
            : toToken.address,
          toAmount: deferredTokenAmount,
          client,
        }
      : undefined;

  const buyWithCryptoQuoteQuery = useBuyWithCryptoQuote(buyWithCryptoParams, {
    // refetch every 30 seconds
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
    gcTime: 30 * 1000,
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
        tokenList={
          (fromChain?.id ? props.supportedTokens[fromChain.id] : undefined) ||
          []
        }
        onTokenSelect={(tokenInfo) => {
          setFromToken(tokenInfo);
          setScreen("main");
        }}
        chain={fromChain}
        chainSelection={{
          chains: supportedChains,
          select: (c) => setFromChain(c),
        }}
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
        chainSelection={{
          chains: supportedChains,
          select: (c) => setToChain(c),
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
        client={client}
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
        fromChain={fromChain}
        toChain={toChain}
        account={account}
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
  const switchChainRequired = props.activeChain.id !== fromChain.id;

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
                activeAccount={account}
                activeWallet={activeWallet}
                onSelect={(v) => {
                  setAddress(v);
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
            chain={toChain}
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
                chain={fromChain}
                token={fromToken}
                isLoading={
                  buyWithCryptoQuoteQuery.isLoading && !sourceTokenAmount
                }
              />

              {/* Other info */}
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
                  address={address}
                  activeAccount={account}
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
                  await switchActiveWalletChain(fromChain);
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
  activeWallet: Wallet;
  activeAccount: Account;
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
            address={props.activeAccount.address}
            activeAccount={props.activeAccount}
            activeWallet={props.activeWallet}
            onClick={() => {
              props.onSelect(props.activeAccount.address);
            }}
          />
        </div>
      )}
    </DynamicHeight>
  );
}

const StyledInput = /* @__PURE__ */ styled(Input)(() => {
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
  activeWallet: Wallet;
  activeAccount: Account;
  address: string;
  chevron?: boolean;
}) {
  return (
    <AccountButton variant="secondary" fullWidth onClick={props.onClick}>
      {props.activeAccount.address === props.address ? (
        <WalletImage id={props.activeWallet.id} size={iconSize.md} />
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
    background: theme.colors.tertiaryBg,
    border: `1px solid ${theme.colors.borderColor}`,
    "&:hover": {
      background: theme.colors.tertiaryBg,
      borderColor: theme.colors.accentText,
    },
    justifyContent: "flex-start",
    transition: "background 0.3s, border-color 0.3s",
    gap: spacing.sm,
    padding: spacing.sm,
    borderRadius: radius.md,
  };
});
