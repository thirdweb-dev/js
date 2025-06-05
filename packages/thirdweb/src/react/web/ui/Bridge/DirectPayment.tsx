"use client";
import type { Token } from "../../../../bridge/types/Token.js";
import { defineChain } from "../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import { type Address, shortenAddress } from "../../../../utils/address.js";
import { useCustomTheme } from "../../../core/design-system/CustomThemeProvider.js";
import { radius } from "../../../core/design-system/index.js";
import { useActiveAccount } from "../../../core/hooks/wallets/useActiveAccount.js";
import { useEnsName } from "../../../core/utils/wallet.js";
import { ConnectButton } from "../ConnectWallet/ConnectButton.js";
import { PoweredByThirdweb } from "../ConnectWallet/PoweredByTW.js";
import { FiatValue } from "../ConnectWallet/screens/Buy/swap/FiatValue.js";
import type { PayEmbedConnectOptions } from "../PayEmbed.js";
import { ChainName } from "../components/ChainName.js";
import { Spacer } from "../components/Spacer.js";
import { Container, Line } from "../components/basic.js";
import { Button } from "../components/buttons.js";
import { Text } from "../components/text.js";
import { ChainIcon } from "./TokenAndChain.js";

export interface DirectPaymentProps {
  /**
   * Payment information for the direct payment
   */
  paymentInfo: {
    sellerAddress: Address;
    token: Token;
    amount: string;
    feePayer?: "sender" | "receiver";
    metadata: {
      name: string;
      description?: string;
      image?: string;
    };
  };

  /**
   * ThirdwebClient for blockchain interactions
   */
  client: ThirdwebClient;

  /**
   * Called when user continues with the payment
   */
  onContinue: (amount: string, token: Token, receiverAddress: Address) => void;

  /**
   * Connect options for wallet connection
   */
  connectOptions?: PayEmbedConnectOptions;
}

export function DirectPayment({
  paymentInfo,
  client,
  onContinue,
  connectOptions,
}: DirectPaymentProps) {
  const activeAccount = useActiveAccount();
  const chain = defineChain(paymentInfo.token.chainId);
  const theme = useCustomTheme();
  const handleContinue = () => {
    onContinue(
      paymentInfo.amount,
      paymentInfo.token,
      paymentInfo.sellerAddress,
    );
  };
  const ensName = useEnsName({
    address: paymentInfo.sellerAddress,
    client,
  });
  const sellerAddress =
    ensName.data || shortenAddress(paymentInfo.sellerAddress);

  const buyNow = (
    <Container flex="row" gap="3xs">
      <Text size="md" color="primaryButtonText">
        Buy Now ·
      </Text>
      <FiatValue
        tokenAmount={paymentInfo.amount}
        token={paymentInfo.token}
        chain={chain}
        client={client}
        color="primaryButtonText"
        size="md"
      />
    </Container>
  );

  return (
    <Container flex="column">
      {/* Product image */}
      {paymentInfo.metadata.image && (
        <div
          style={{
            width: "100%",
            borderRadius: `${radius.md} ${radius.md} 0 0`,
            overflow: "hidden",
            aspectRatio: "16/9",
            backgroundColor: theme.colors.secondaryIconColor,
            backgroundImage: `url(${paymentInfo.metadata.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}
      <Container flex="column" px="lg">
        <Spacer y="lg" />

        {/* Header with product name */}
        <Text size="lg" color="primaryText" weight={700}>
          {paymentInfo.metadata.name}
        </Text>

        <Spacer y="xs" />

        {/* Description */}
        {paymentInfo.metadata.description && (
          <Text size="sm" color="secondaryText">
            {paymentInfo.metadata.description}
          </Text>
        )}

        <Spacer y="lg" />

        {/* Price section */}
        <Container
          flex="row"
          center="y"
          gap="3xs"
          style={{
            justifyContent: "space-between",
          }}
        >
          <FiatValue
            tokenAmount={paymentInfo.amount}
            token={paymentInfo.token}
            chain={chain}
            client={client}
            color="primaryText"
            size="xl"
            weight={700}
          />
          <Container flex="row" gap="3xs">
            <Text
              size="xs"
              color="secondaryText"
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              One-time payment
            </Text>
          </Container>
        </Container>

        <Spacer y="md" />

        <Line />

        <Spacer y="md" />

        {/* Seller section */}
        <Container
          flex="row"
          style={{
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text size="sm" color="secondaryText">
            Sold by
          </Text>
          <Text
            size="sm"
            color="primaryText"
            style={{
              fontFamily: "monospace",
            }}
          >
            {sellerAddress}
          </Text>
        </Container>

        <Spacer y="xs" />

        <Container
          flex="row"
          style={{
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text size="sm" color="secondaryText">
            Price
          </Text>
          <Text
            size="sm"
            color="primaryText"
            style={{
              fontFamily: "monospace",
            }}
          >
            {`${paymentInfo.amount} ${paymentInfo.token.symbol}`}
          </Text>
        </Container>

        <Spacer y="xs" />

        {/* Network section */}
        <Container
          flex="row"
          style={{
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text size="sm" color="secondaryText">
            Network
          </Text>
          <Container flex="row" gap="3xs" center="y">
            <ChainIcon chain={chain} size={"xs"} client={client} />
            <ChainName
              chain={chain}
              client={client}
              size="sm"
              color="primaryText"
              short
              style={{
                fontFamily: "monospace",
              }}
            />
          </Container>
        </Container>

        <Spacer y="md" />

        <Line />

        <Spacer y="lg" />

        {/* Action button */}
        <Container flex="column">
          {activeAccount ? (
            <Button variant="primary" fullWidth onClick={handleContinue}>
              {buyNow}
            </Button>
          ) : (
            <ConnectButton
              client={client}
              theme={theme}
              connectButton={{
                label: buyNow,
                style: {
                  width: "100%",
                },
              }}
              {...connectOptions}
            />
          )}

          <Spacer y="md" />

          <PoweredByThirdweb />
          <Spacer y="md" />
        </Container>
      </Container>
    </Container>
  );
}
