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
import type { PayEmbedConnectOptions } from "../../../PayEmbed.js";
import { ChainIcon } from "../../../components/ChainIcon.js";
import { Img } from "../../../components/Img.js";
import { Spacer } from "../../../components/Spacer.js";
import { TokenIcon } from "../../../components/TokenIcon.js";
import { WalletImage } from "../../../components/WalletImage.js";
import { Container, Line, ModalHeader } from "../../../components/basic.js";
import { Button } from "../../../components/buttons.js";
import { Text } from "../../../components/text.js";
import { ConnectButton } from "../../ConnectButton.js";
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
    client,
    address: paymentInfo.sellerAddress,
  });

  const totalCostQuery = useQuery({
    queryKey: ["amount", paymentInfo],
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
  });

  const totalCost = totalCostQuery.data;
  if (!chainData || totalCost === undefined) {
    return <LoadingScreen />;
  }

  const token: TokenInfo = paymentInfo.token
    ? {
        ...paymentInfo.token,
        icon:
          paymentInfo.token?.icon ||
          supportedDestinations
            .find((c) => c.chain.id === paymentInfo.chain.id)
            ?.tokens.find(
              (t) =>
                t.address.toLowerCase() ===
                paymentInfo.token?.address.toLowerCase(),
            )?.icon,
      }
    : {
        address: NATIVE_TOKEN_ADDRESS,
        name: chainData.nativeCurrency.name,
        symbol: chainData.nativeCurrency.symbol,
        icon: chainData.icon?.url,
      };

  return (
    <Container p="lg">
      <ModalHeader title={metadata?.name || "Payment Details"} />

      <Spacer y="lg" />
      <Container>
        {metadata?.image ? (
          <Img
            client={client}
            src={metadata?.image}
            style={{
              width: "100%",
              borderRadius: spacing.md,
              backgroundColor: theme.colors.tertiaryBg,
            }}
          />
        ) : activeWallet ? (
          <Container
            flex="row"
            center="both"
            style={{
              padding: spacing.md,
              marginBottom: spacing.md,
              borderRadius: spacing.md,
              backgroundColor: theme.colors.tertiaryBg,
            }}
          >
            <WalletImage
              size={iconSize.xl}
              id={activeWallet.id}
              client={client}
            />
            <div
              style={{
                flexGrow: 1,
                borderBottom: "6px dotted",
                borderColor: theme.colors.secondaryIconColor,
                marginLeft: spacing.md,
                marginRight: spacing.md,
              }}
            />
            <ChainIcon
              client={client}
              size={iconSize.xl}
              chainIconUrl={chainData.icon?.url}
            />
          </Container>
        ) : null}
        <Spacer y="md" />
        <Container flex="row">
          <Container flex="column" expand>
            <Text size="md" color="primaryText" weight={700}>
              Price
            </Text>
          </Container>
          <Container expand>
            <Container
              flex="row"
              gap="xs"
              center="y"
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
          <Container flex="column" expand>
            <Text size="xs" color="secondaryText">
              Network
            </Text>
          </Container>
          <Container expand>
            <Container
              flex="row"
              gap="xs"
              center="y"
              style={{ justifyContent: "right" }}
            >
              <ChainIcon
                chainIconUrl={chainData.icon?.url}
                size="xs"
                client={props.client}
              />
              <Text
                size="xs"
                color="secondaryText"
                style={{ textAlign: "right" }}
              >
                {chainData.name}
              </Text>
            </Container>
          </Container>
        </Container>
        <Spacer y="sm" />
        <Container flex="row">
          <Container flex="column" expand>
            <Text size="xs" color="secondaryText">
              Seller
            </Text>
          </Container>
          <Container expand>
            <Container
              flex="row"
              gap="xs"
              center="y"
              style={{ justifyContent: "right" }}
            >
              <Text
                size="xs"
                color="secondaryText"
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
          variant="accent"
          fullWidth
          onClick={() => {
            trackPayEvent({
              event: "choose_payment_method_direct_payment_mode",
              client,
              walletAddress: payerAccount.address,
              walletType: activeWallet?.id,
            });
            onContinue(totalCost, paymentInfo.chain, token);
          }}
        >
          Choose Payment Method
        </Button>
      ) : (
        <div>
          <ConnectButton
            {...props.connectOptions}
            client={client}
            theme={theme}
            connectButton={{
              style: {
                width: "100%",
              },
            }}
          />
        </div>
      )}
    </Container>
  );
}
