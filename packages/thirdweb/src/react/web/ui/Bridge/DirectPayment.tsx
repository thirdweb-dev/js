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
import { Container, Line, ModalHeader } from "../components/basic.js";
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
      image: string;
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

  return (
    <Container flex="column" p="lg">
      {/* Header with product name */}
      <ModalHeader title={paymentInfo.metadata.name} />

      <Spacer y="lg" />

      {/* Product image */}
      <div
        style={{
          width: "100%",
          borderRadius: radius.lg,
          overflow: "hidden",
          aspectRatio: "4/3",
          backgroundColor: theme.colors.secondaryIconColor,
          backgroundImage: `url(${paymentInfo.metadata.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          border: `1px solid ${theme.colors.borderColor}`,
        }}
      />

      <Spacer y="lg" />

      {/* Price section */}
      <Container
        flex="row"
        style={{
          justifyContent: "space-between",
        }}
      >
        <Text size="md" color="secondaryText">
          Price
        </Text>
        <Container
          flex="column"
          color="secondaryText"
          gap="3xs"
          style={{
            alignItems: "flex-end",
            minWidth: 0,
            overflow: "hidden",
          }}
        >
          <FiatValue
            tokenAmount={paymentInfo.amount}
            token={paymentInfo.token}
            chain={chain}
            client={client}
            color="primaryText"
            size="md"
            weight={600}
          />
          <Text
            size="xs"
            color="secondaryText"
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {`${paymentInfo.amount} ${paymentInfo.token.symbol}`}
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

      <Spacer y="sm" />

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
          />
        </Container>
      </Container>

      <Spacer y="xl" />

      {/* Action button */}
      {activeAccount ? (
        <Button variant="accent" fullWidth onClick={handleContinue}>
          Buy Now
        </Button>
      ) : (
        <ConnectButton
          client={client}
          theme={theme}
          connectButton={{
            label: "Buy Now",
            style: {
              width: "100%",
            },
          }}
          {...connectOptions}
        />
      )}

      <Spacer y="lg" />

      <PoweredByThirdweb />
    </Container>
  );
}
