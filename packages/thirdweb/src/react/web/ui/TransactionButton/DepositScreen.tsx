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
import { CopyIcon } from "../components/CopyIcon.js";
import { QRCode } from "../components/QRCode.js";
import { Skeleton } from "../components/Skeleton.js";
import { Spacer } from "../components/Spacer.js";
import { WalletImage } from "../components/WalletImage.js";
import { Container, ModalHeader } from "../components/basic.js";
import { Button } from "../components/buttons.js";
import { Text } from "../components/text.js";
import { TokenSymbol } from "../components/token/TokenSymbol.js";
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
    display: "flex",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: theme.colors.tertiaryBg,
    border: `1px solid ${theme.colors.borderColor}`,
    padding: `${spacing.md} ${spacing.sm}`,
    borderRadius: radius.lg,
    color: theme.colors.secondaryText,
    fontSize: fontSize.sm,
    fontWeight: 500,
    position: "relative" as const,
    "&::before": {
      content: '""',
      width: "8px",
      height: "8px",
      borderRadius: "50%",
      backgroundColor: theme.colors.accentText,
      animation: `${pulseAnimation} 1s infinite`,
    },
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
    transaction: props.tx,
    account: activeAccount,
    supportedDestinations: [],
    refetchIntervalMs: 10_000,
  });
  const theme = useCustomTheme();
  const sponsoredTransactionsEnabled =
    hasSponsoredTransactionsEnabled(activeWallet);

  if (transactionCostAndDataError) {
    return (
      <Container
        style={{
          minHeight: "350px",
        }}
        fullHeight
        flex="row"
        center="both"
      >
        <ErrorState
          title={transactionCostAndDataError?.message || "Something went wrong"}
          onTryAgain={transactionCostAndDataRefetch}
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
      <ModalHeader title={"Insufficient funds"} onBack={props.onBack} />

      <Spacer y="lg" />

      <Container flex="column" gap="sm">
        {insufficientFunds && (
          <div>
            <Text size="xs" center color="danger" multiline>
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
            justifyContent: "space-between",
            padding: spacing.sm,
            borderRadius: `${radius.md} ${radius.md} 0 0`,
            border: `1px solid ${theme.colors.borderColor}`,
            borderBottom: "none",
          }}
        >
          {activeAccount && (
            <WalletRow
              address={activeAccount?.address}
              iconSize="md"
              client={client}
            />
          )}
          {transactionCostAndData.walletBalance.value !== undefined &&
          !transactionCostAndDataFetching ? (
            <Container flex="row" gap="3xs" center="y">
              <Text size="xs" color="secondaryText" weight={500}>
                {formatTokenBalance(
                  transactionCostAndData.walletBalance,
                  false,
                )}
              </Text>
              <TokenSymbol
                token={transactionCostAndData.token}
                chain={props.tx.chain}
                size="xs"
                color="secondaryText"
              />
            </Container>
          ) : (
            <Container flex="row" gap="3xs" center="y">
              <Skeleton width="70px" height={fontSize.xs} />
            </Container>
          )}
        </Container>
      </Container>

      <WalletAddressContainer onClick={onCopy}>
        <Container flex="column" gap="md" center="both" expand>
          <Container flex="row" center="x">
            <QRCode
              qrCodeUri={address}
              size={250}
              QRIcon={
                activeWallet && (
                  <WalletImage
                    id={activeWallet.id}
                    size={iconSize.xl}
                    client={client}
                  />
                )
              }
            />
          </Container>
          <Container flex="row" center="x" gap="xs">
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
              text={address || ""}
              tip="Copy address"
              hasCopied={hasCopied}
            />
          </Container>
        </Container>
      </WalletAddressContainer>

      <Spacer y="md" />

      <Text
        multiline
        center
        balance
        size="sm"
        className="receive_fund_screen_instruction"
      >
        {locale.instruction}
      </Text>

      <Spacer y="md" />

      {insufficientFunds ? (
        <WaitingBadge>
          Waiting for funds on {transactionCostAndData.chainMetadata.name}...
        </WaitingBadge>
      ) : (
        <Button variant="accent" onClick={props.onDone} fullWidth>
          Continue
        </Button>
      )}
      {insufficientFunds && isTestnet && (
        <>
          <Spacer y="md" />
          <Button variant="link" onClick={openFaucetLink} fullWidth>
            <Container flex="row" center="x" gap="xs" color="accentText">
              <CoinsIcon size={iconSize.sm} />
              <Text size="xs" color="accentText" weight={500} center>
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
    all: "unset",
    width: "100%",
    boxSizing: "border-box",
    cursor: "pointer",
    padding: spacing.md,
    display: "flex",
    justifyContent: "space-between",
    border: `1px solid ${theme.colors.borderColor}`,
    borderRadius: `0 0 ${radius.md} ${radius.md}`,
    transition: "border-color 200ms ease",
    "&:hover": {
      borderColor: theme.colors.accentText,
    },
  };
});
