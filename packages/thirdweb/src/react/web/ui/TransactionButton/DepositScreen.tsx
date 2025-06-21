import { keyframes } from "@emotion/react";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { PreparedTransaction } from "../../../../transaction/prepare-transaction.js";
import { shortenAddress } from "../../../../utils/address.js";
import { formatNumber } from "../../../../utils/formatNumber.js";
import { toTokens } from "../../../../utils/units.js";
import { hasSponsoredTransactionsEnabled } from "../../../../wallets/smart/is-smart-wallet.js";
import { useCustomTheme } from "../../../core/design-system/CustomThemeProvider.js";
import {
  fontSize,
  iconSize,
  radius,
  spacing,
} from "../../../core/design-system/index.js";
import { useActiveAccount } from "../../../core/hooks/wallets/useActiveAccount.js";
import { useActiveWallet } from "../../../core/hooks/wallets/useActiveWallet.js";
import { ErrorState } from "../../wallets/shared/ErrorState.js";
import { LoadingScreen } from "../../wallets/shared/LoadingScreen.js";
import { CoinsIcon } from "../ConnectWallet/icons/CoinsIcon.js";
import type { ConnectLocale } from "../ConnectWallet/locale/types.js";
import { useTransactionCostAndData } from "../ConnectWallet/screens/Buy/main/useBuyTxStates.js";
import { WalletRow } from "../ConnectWallet/screens/Buy/swap/WalletRow.js";
import { formatTokenBalance } from "../ConnectWallet/screens/formatTokenBalance.js";
import { isNativeToken } from "../ConnectWallet/screens/nativeToken.js";
import { Container, ModalHeader } from "../components/basic.js";
import { Button } from "../components/buttons.js";
import { CopyIcon } from "../components/CopyIcon.js";
import { QRCode } from "../components/QRCode.js";
import { Skeleton } from "../components/Skeleton.js";
import { Spacer } from "../components/Spacer.js";
import { Text } from "../components/text.js";
import { TokenSymbol } from "../components/token/TokenSymbol.js";
import { WalletImage } from "../components/WalletImage.js";
import { StyledButton, StyledDiv } from "../design-system/elements.js";
import { useClipboard } from "../hooks/useCopyClipboard.js";

const pulseAnimation = keyframes`
0% {
  opacity: 1;
  transform: scale(0.5);
}
100% {
  opacity: 0;
  transform: scale(1.5);
}
`;

const WaitingBadge = /* @__PURE__ */ StyledDiv(() => {
  const theme = useCustomTheme();
  return {
    "&::before": {
      animation: `${pulseAnimation} 1s infinite`,
      backgroundColor: theme.colors.accentText,
      borderRadius: "50%",
      content: '""',
      height: "8px",
      width: "8px",
    },
    alignItems: "center",
    backgroundColor: theme.colors.tertiaryBg,
    border: `1px solid ${theme.colors.borderColor}`,
    borderRadius: radius.lg,
    color: theme.colors.secondaryText,
    display: "flex",
    fontSize: fontSize.sm,
    fontWeight: 500,
    gap: spacing.sm,
    padding: `${spacing.md} ${spacing.sm}`,
    position: "relative" as const,
  };
});

/**
 *
 * @internal
 */
export function DepositScreen(props: {
  onBack: (() => void) | undefined;
  connectLocale: ConnectLocale;
  client: ThirdwebClient;
  tx: PreparedTransaction;
  onDone: () => void;
}) {
  const activeWallet = useActiveWallet();
  const activeAccount = useActiveAccount();
  const address = activeAccount?.address;
  const { hasCopied, onCopy } = useClipboard(address || "");
  const { connectLocale, client } = props;
  const locale = connectLocale.receiveFundsScreen;
  const isTestnet = props.tx.chain.testnet === true;
  const {
    data: transactionCostAndData,
    error: transactionCostAndDataError,
    isFetching: transactionCostAndDataFetching,
    refetch: transactionCostAndDataRefetch,
  } = useTransactionCostAndData({
    account: activeAccount,
    refetchIntervalMs: 10_000,
    supportedDestinations: [],
    transaction: props.tx,
  });
  const theme = useCustomTheme();
  const sponsoredTransactionsEnabled =
    hasSponsoredTransactionsEnabled(activeWallet);

  if (transactionCostAndDataError) {
    return (
      <Container
        center="both"
        flex="row"
        fullHeight
        style={{
          minHeight: "350px",
        }}
      >
        <ErrorState
          onTryAgain={transactionCostAndDataRefetch}
          title={transactionCostAndDataError?.message || "Something went wrong"}
        />
      </Container>
    );
  }

  if (!transactionCostAndData) {
    return <LoadingScreen />;
  }

  const totalCost =
    isNativeToken(transactionCostAndData.token) && !sponsoredTransactionsEnabled
      ? transactionCostAndData.transactionValueWei +
        transactionCostAndData.gasCostWei
      : transactionCostAndData.transactionValueWei;
  const insufficientFunds =
    transactionCostAndData.walletBalance.value < totalCost;
  const requiredFunds = transactionCostAndData.walletBalance.value
    ? totalCost - transactionCostAndData.walletBalance.value
    : totalCost;

  const openFaucetLink = () => {
    window.open(
      `https://thirdweb.com/${props.tx.chain.id}?utm_source=ub_deposit`,
    );
  };

  return (
    <Container p="lg">
      <ModalHeader onBack={props.onBack} title={"Insufficient funds"} />

      <Spacer y="lg" />

      <Container flex="column" gap="sm">
        {insufficientFunds && (
          <div>
            <Text center color="danger" multiline size="xs">
              You need{" "}
              {formatNumber(
                Number.parseFloat(
                  toTokens(requiredFunds, transactionCostAndData.decimals),
                ),
                5,
              )}{" "}
              {transactionCostAndData.token.symbol} to continue
            </Text>
          </div>
        )}
        <Container
          flex="row"
          style={{
            border: `1px solid ${theme.colors.borderColor}`,
            borderBottom: "none",
            borderRadius: `${radius.md} ${radius.md} 0 0`,
            justifyContent: "space-between",
            padding: spacing.sm,
          }}
        >
          {activeAccount && (
            <WalletRow
              address={activeAccount?.address}
              client={client}
              iconSize="md"
            />
          )}
          {transactionCostAndData.walletBalance.value !== undefined &&
          !transactionCostAndDataFetching ? (
            <Container center="y" flex="row" gap="3xs">
              <Text color="secondaryText" size="xs" weight={500}>
                {formatTokenBalance(
                  transactionCostAndData.walletBalance,
                  false,
                )}
              </Text>
              <TokenSymbol
                chain={props.tx.chain}
                color="secondaryText"
                size="xs"
                token={transactionCostAndData.token}
              />
            </Container>
          ) : (
            <Container center="y" flex="row" gap="3xs">
              <Skeleton height={fontSize.xs} width="70px" />
            </Container>
          )}
        </Container>
      </Container>

      <WalletAddressContainer onClick={onCopy}>
        <Container center="both" expand flex="column" gap="md">
          <Container center="x" flex="row">
            <QRCode
              QRIcon={
                activeWallet && (
                  <WalletImage
                    client={client}
                    id={activeWallet.id}
                    size={iconSize.xl}
                  />
                )
              }
              qrCodeUri={address}
              size={250}
            />
          </Container>
          <Container center="x" flex="row" gap="xs">
            <Text
              color="primaryText"
              size="md"
              style={{
                fontFamily: "monospace",
              }}
            >
              {address ? shortenAddress(address) : ""}
            </Text>
            <CopyIcon
              hasCopied={hasCopied}
              text={address || ""}
              tip="Copy address"
            />
          </Container>
        </Container>
      </WalletAddressContainer>

      <Spacer y="md" />

      <Text
        balance
        center
        className="receive_fund_screen_instruction"
        multiline
        size="sm"
      >
        {locale.instruction}
      </Text>

      <Spacer y="md" />

      {insufficientFunds ? (
        <WaitingBadge>
          Waiting for funds on {transactionCostAndData.chainMetadata.name}...
        </WaitingBadge>
      ) : (
        <Button fullWidth onClick={props.onDone} variant="accent">
          Continue
        </Button>
      )}
      {insufficientFunds && isTestnet && (
        <>
          <Spacer y="md" />
          <Button fullWidth onClick={openFaucetLink} variant="link">
            <Container center="x" color="accentText" flex="row" gap="xs">
              <CoinsIcon size={iconSize.sm} />
              <Text center color="accentText" size="xs" weight={500}>
                Get testnet funds
              </Text>
            </Container>
          </Button>
        </>
      )}
    </Container>
  );
}

const WalletAddressContainer = /* @__PURE__ */ StyledButton((_) => {
  const theme = useCustomTheme();
  return {
    "&:hover": {
      borderColor: theme.colors.accentText,
    },
    all: "unset",
    border: `1px solid ${theme.colors.borderColor}`,
    borderRadius: `0 0 ${radius.md} ${radius.md}`,
    boxSizing: "border-box",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    padding: spacing.md,
    transition: "border-color 200ms ease",
    width: "100%",
  };
});
