import { useQuery } from "@tanstack/react-query";
import { trackPayEvent } from "../../../../../../analytics/track/pay.js";
import type { Chain } from "../../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../../constants/addresses.js";
import { getContract } from "../../../../../../contract/contract.js";
import { decimals } from "../../../../../../extensions/erc20/read/decimals.js";
import { shortenAddress } from "../../../../../../utils/address.js";
import { formatNumber } from "../../../../../../utils/formatNumber.js";
import { toTokens } from "../../../../../../utils/units.js";
import type { Account } from "../../../../../../wallets/interfaces/wallet.js";
import { useCustomTheme } from "../../../../../core/design-system/CustomThemeProvider.js";
import { iconSize, spacing } from "../../../../../core/design-system/index.js";
import type { PayUIOptions } from "../../../../../core/hooks/connection/ConnectButtonProps.js";
import { useChainMetadata } from "../../../../../core/hooks/others/useChainQuery.js";
import { useActiveWallet } from "../../../../../core/hooks/wallets/useActiveWallet.js";
import type { TokenInfo } from "../../../../../core/utils/defaultTokens.js";
import { useEnsName } from "../../../../../core/utils/wallet.js";
import { LoadingScreen } from "../../../../wallets/shared/LoadingScreen.js";
import { Container, Line, ModalHeader } from "../../../components/basic.js";
import { Button } from "../../../components/buttons.js";
import { ChainIcon } from "../../../components/ChainIcon.js";
import { Img } from "../../../components/Img.js";
import { Spacer } from "../../../components/Spacer.js";
import { TokenIcon } from "../../../components/TokenIcon.js";
import { Text } from "../../../components/text.js";
import { WalletImage } from "../../../components/WalletImage.js";
import type { PayEmbedConnectOptions } from "../../../PayEmbed.js";
import { ConnectButton } from "../../ConnectButton.js";
import { PoweredByThirdweb } from "../../PoweredByTW.js";
import { type ERC20OrNativeToken, isNativeToken } from "../nativeToken.js";
import type { SupportedChainAndTokens } from "./swap/useSwapSupportedChains.js";

export function DirectPaymentModeScreen(props: {
  client: ThirdwebClient;
  payUiOptions: Extract<PayUIOptions, { mode: "direct_payment" }>;
  supportedDestinations: SupportedChainAndTokens;
  payerAccount: Account | undefined;
  connectOptions: PayEmbedConnectOptions | undefined;
  onContinue: (
    tokenAmount: string,
    toChain: Chain,
    toToken: ERC20OrNativeToken,
  ) => void;
}) {
  const {
    payUiOptions,
    supportedDestinations,
    client,
    onContinue,
    payerAccount,
  } = props;
  const theme = useCustomTheme();
  const activeWallet = useActiveWallet();
  const metadata = payUiOptions.metadata;
  const paymentInfo = payUiOptions.paymentInfo;
  const { data: chainData } = useChainMetadata(paymentInfo.chain);
  const { data: sellerEns } = useEnsName({
    address: paymentInfo.sellerAddress,
    client,
  });

  const totalCostQuery = useQuery({
    queryFn: async () => {
      let tokenDecimals = 18;
      if (paymentInfo.token && !isNativeToken(paymentInfo.token)) {
        tokenDecimals = await decimals({
          contract: getContract({
            address: paymentInfo.token.address,
            chain: paymentInfo.chain,
            client,
          }),
        });
      }
      let cost: string;
      if ("amountWei" in paymentInfo) {
        cost = toTokens(paymentInfo.amountWei, tokenDecimals);
      } else {
        cost = paymentInfo.amount;
      }
      return cost;
    },
    queryKey: ["amount", paymentInfo],
  });

  const totalCost = totalCostQuery.data;
  if (!chainData || totalCost === undefined) {
    return <LoadingScreen />;
  }

  const token: TokenInfo = paymentInfo.token
    ? {
        address: paymentInfo.token.address || NATIVE_TOKEN_ADDRESS,
        icon:
          paymentInfo.token?.icon ||
          supportedDestinations
            .find((c) => c.chain.id === paymentInfo.chain.id)
            ?.tokens.find(
              (t) =>
                t.address.toLowerCase() ===
                paymentInfo.token?.address.toLowerCase(),
            )?.icon,
        name: paymentInfo.token.name || chainData.nativeCurrency.name,
        symbol: paymentInfo.token.symbol || chainData.nativeCurrency.symbol,
      }
    : {
        address: NATIVE_TOKEN_ADDRESS,
        icon: chainData.icon?.url,
        name: chainData.nativeCurrency.name,
        symbol: chainData.nativeCurrency.symbol,
      };

  return (
    <Container px="lg">
      <Spacer y="lg" />
      <ModalHeader title={metadata?.name || "Payment Details"} />

      <Spacer y="lg" />
      <Container>
        {metadata?.image ? (
          <Img
            client={client}
            src={metadata?.image}
            style={{
              backgroundColor: theme.colors.tertiaryBg,
              borderRadius: spacing.md,
              width: "100%",
            }}
          />
        ) : activeWallet ? (
          <Container
            center="both"
            flex="row"
            style={{
              backgroundColor: theme.colors.tertiaryBg,
              borderRadius: spacing.md,
              marginBottom: spacing.md,
              padding: spacing.md,
            }}
          >
            <WalletImage
              client={client}
              id={activeWallet.id}
              size={iconSize.xl}
            />
            <div
              style={{
                borderBottom: "6px dotted",
                borderColor: theme.colors.secondaryIconColor,
                flexGrow: 1,
                marginLeft: spacing.md,
                marginRight: spacing.md,
              }}
            />
            <ChainIcon
              chainIconUrl={chainData.icon?.url}
              client={client}
              size={iconSize.xl}
            />
          </Container>
        ) : null}
        <Spacer y="md" />
        <Container flex="row">
          <Container expand flex="column">
            <Text color="primaryText" size="md" weight={700}>
              Price
            </Text>
          </Container>
          <Container expand>
            <Container
              center="y"
              flex="row"
              gap="xs"
              style={{ justifyContent: "right" }}
            >
              <TokenIcon
                chain={paymentInfo.chain}
                client={props.client}
                size="sm"
                token={token}
              />
              <Text color="primaryText" size="md" weight={700}>
                {String(formatNumber(Number(totalCost), 6))} {token.symbol}
              </Text>
            </Container>
          </Container>
        </Container>
        <Spacer y="md" />
        <Line />
        <Spacer y="md" />
        <Container flex="row">
          <Container expand flex="column">
            <Text color="secondaryText" size="xs">
              Network
            </Text>
          </Container>
          <Container expand>
            <Container
              center="y"
              flex="row"
              gap="xs"
              style={{ justifyContent: "right" }}
            >
              <ChainIcon
                chainIconUrl={chainData.icon?.url}
                client={props.client}
                size="xs"
              />
              <Text
                color="secondaryText"
                size="xs"
                style={{ textAlign: "right" }}
              >
                {chainData.name}
              </Text>
            </Container>
          </Container>
        </Container>
        <Spacer y="sm" />
        <Container flex="row">
          <Container expand flex="column">
            <Text color="secondaryText" size="xs">
              Seller
            </Text>
          </Container>
          <Container expand>
            <Container
              center="y"
              flex="row"
              gap="xs"
              style={{ justifyContent: "right" }}
            >
              <Text
                color="secondaryText"
                size="xs"
                style={{ textAlign: "right" }}
              >
                {sellerEns || shortenAddress(paymentInfo.sellerAddress)}
              </Text>
            </Container>
          </Container>
        </Container>
      </Container>
      <Spacer y="xl" />
      {payerAccount ? (
        <Button
          fullWidth
          onClick={() => {
            trackPayEvent({
              client,
              event: "choose_payment_method_direct_payment_mode",
              toChainId: paymentInfo.chain.id,
              toToken: paymentInfo.token?.address,
              walletAddress: payerAccount.address,
              walletType: activeWallet?.id,
            });
            onContinue(totalCost, paymentInfo.chain, token);
          }}
          variant="accent"
        >
          Choose Payment Method
        </Button>
      ) : (
        <div>
          <ConnectButton
            {...props.connectOptions}
            client={client}
            connectButton={{
              style: {
                width: "100%",
              },
            }}
            theme={theme}
          />
        </div>
      )}
      <Spacer y="lg" />
      {payUiOptions.showThirdwebBranding !== false && (
        <>
          <PoweredByThirdweb link="https://playground.thirdweb.com/connect/pay?utm_source=ub_text" />
          <Spacer y="sm" />
        </>
      )}
    </Container>
  );
}
