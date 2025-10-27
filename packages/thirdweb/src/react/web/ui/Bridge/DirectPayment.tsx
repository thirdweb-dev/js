"use client";
import type { TokenWithPrices } from "../../../../bridge/types/Token.js";
import { defineChain } from "../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { SupportedFiatCurrency } from "../../../../pay/convert/type.js";
import type { Address } from "../../../../utils/address.js";
import { PoweredByThirdweb } from "../ConnectWallet/PoweredByTW.js";
import { FiatValue } from "../ConnectWallet/screens/Buy/swap/FiatValue.js";
import { Container, Line } from "../components/basic.js";
import { Button } from "../components/buttons.js";
import { ChainName } from "../components/ChainName.js";
import { Spacer } from "../components/Spacer.js";
import { Text } from "../components/text.js";
import { ChainIcon } from "./common/TokenAndChain.js";
import { WithHeader } from "./common/WithHeader.js";
import type { DirectPaymentInfo } from "./types.js";

type DirectPaymentProps = {
  paymentInfo: DirectPaymentInfo;
  currency: SupportedFiatCurrency;
  metadata: {
    title: string | undefined;
    description: string | undefined;
    image: string | undefined;
  };
  buttonLabel: string | undefined;

  /**
   * ThirdwebClient for blockchain interactions
   */
  client: ThirdwebClient;

  /**
   * Called when user continues with the payment
   */
  onContinue: (
    amount: string,
    token: TokenWithPrices,
    receiverAddress: Address,
  ) => void;

  /**
   * Whether to show thirdweb branding in the widget.
   */
  showThirdwebBranding: boolean;
};

export function DirectPayment({
  paymentInfo,
  metadata,
  client,
  onContinue,
  showThirdwebBranding = true,
  buttonLabel,
  currency,
}: DirectPaymentProps) {
  const chain = defineChain(paymentInfo.token.chainId);
  const handleContinue = () => {
    onContinue(
      paymentInfo.amount,
      paymentInfo.token,
      paymentInfo.sellerAddress,
    );
  };

  const buyNow = buttonLabel ? (
    <Text color="primaryButtonText" size="md">
      {buttonLabel}
    </Text>
  ) : (
    <Container flex="row" gap="3xs">
      <Text color="primaryButtonText" size="md">
        Buy Now ·
      </Text>
      <FiatValue
        currency={currency}
        chain={chain}
        client={client}
        color="primaryButtonText"
        size="md"
        token={paymentInfo.token}
        tokenAmount={paymentInfo.amount}
      />
    </Container>
  );

  return (
    <WithHeader
      client={client}
      title={metadata.title || "Direct Payment"}
      description={metadata.description}
      image={metadata.image}
    >
      {/* Price section */}
      <Container
        flex="row"
        gap="3xs"
        style={{
          justifyContent: "space-between",
          alignItems: "end",
        }}
      >
        <FiatValue
          currency={currency}
          chain={chain}
          client={client}
          color="primaryText"
          size="xl"
          token={paymentInfo.token}
          tokenAmount={paymentInfo.amount}
          weight={500}
        />
        <Container flex="row" gap="3xs">
          <Text
            color="secondaryText"
            size="xs"
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              opacity: 0.7,
            }}
          >
            One-time payment
          </Text>
        </Container>
      </Container>

      <Spacer y="md+" />

      <Line dashed />

      <Spacer y="md+" />

      <Container
        flex="row"
        style={{
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text color="secondaryText" size="sm">
          Price
        </Text>
        <Text color="primaryText" size="sm">
          {`${paymentInfo.amount} ${paymentInfo.token.symbol}`}
        </Text>
      </Container>

      <Spacer y="sm" />

      {/* Network section */}
      <Container
        flex="row"
        style={{
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text color="secondaryText" size="sm">
          Network
        </Text>
        <Container center="y" flex="row" gap="3xs">
          <ChainIcon chain={chain} client={client} size={"xs"} />
          <ChainName
            chain={chain}
            client={client}
            color="primaryText"
            short
            size="sm"
          />
        </Container>
      </Container>

      <Spacer y="md+" />

      <Line dashed />

      <Spacer y="md+" />

      {/* Action button */}
      <Container flex="column">
        <Button fullWidth onClick={handleContinue} variant="primary">
          {buyNow}
        </Button>

        {showThirdwebBranding ? (
          <div>
            <Spacer y="md+" />
            <PoweredByThirdweb />
          </div>
        ) : null}
        <Spacer y="md+" />
      </Container>
    </WithHeader>
  );
}
