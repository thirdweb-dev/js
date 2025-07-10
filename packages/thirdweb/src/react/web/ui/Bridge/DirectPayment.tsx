"use client";
import type { Token } from "../../../../bridge/types/Token.js";
import { defineChain } from "../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { Address } from "../../../../utils/address.js";
import { useCustomTheme } from "../../../core/design-system/CustomThemeProvider.js";
import { useActiveAccount } from "../../../core/hooks/wallets/useActiveAccount.js";
import { ConnectButton } from "../ConnectWallet/ConnectButton.js";
import { PoweredByThirdweb } from "../ConnectWallet/PoweredByTW.js";
import { FiatValue } from "../ConnectWallet/screens/Buy/swap/FiatValue.js";
import { Container, Line } from "../components/basic.js";
import { Button } from "../components/buttons.js";
import { ChainName } from "../components/ChainName.js";
import { Spacer } from "../components/Spacer.js";
import { Text } from "../components/text.js";
import type { PayEmbedConnectOptions } from "../PayEmbed.js";
import type { UIOptions } from "./BridgeOrchestrator.js";
import { ChainIcon } from "./common/TokenAndChain.js";
import { WithHeader } from "./common/WithHeader.js";

export interface DirectPaymentProps {
  /**
   * Payment information for the direct payment
   */
  uiOptions: Extract<UIOptions, { mode: "direct_payment" }>;

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

  /**
   * Whether to show thirdweb branding in the widget.
   * @default true
   */
  showThirdwebBranding?: boolean;
}

export function DirectPayment({
  uiOptions,
  client,
  onContinue,
  connectOptions,
  showThirdwebBranding = true,
}: DirectPaymentProps) {
  const activeAccount = useActiveAccount();
  const chain = defineChain(uiOptions.paymentInfo.token.chainId);
  const theme = useCustomTheme();
  const handleContinue = () => {
    onContinue(
      uiOptions.paymentInfo.amount,
      uiOptions.paymentInfo.token,
      uiOptions.paymentInfo.sellerAddress,
    );
  };

  const buyNow = (
    <Container flex="row" gap="3xs">
      <Text color="primaryButtonText" size="md">
        Buy Now ·
      </Text>
      <FiatValue
        currency={uiOptions.currency}
        chain={chain}
        client={client}
        color="primaryButtonText"
        size="md"
        token={uiOptions.paymentInfo.token}
        tokenAmount={uiOptions.paymentInfo.amount}
      />
    </Container>
  );

  return (
    <WithHeader
      client={client}
      defaultTitle="Direct Payment"
      uiOptions={uiOptions}
    >
      {/* Price section */}
      <Container
        center="y"
        flex="row"
        gap="3xs"
        style={{
          justifyContent: "space-between",
        }}
      >
        <FiatValue
          currency={uiOptions.currency}
          chain={chain}
          client={client}
          color="primaryText"
          size="xl"
          token={uiOptions.paymentInfo.token}
          tokenAmount={uiOptions.paymentInfo.amount}
          weight={700}
        />
        <Container flex="row" gap="3xs">
          <Text
            color="secondaryText"
            size="xs"
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
        <Text
          color="primaryText"
          size="sm"
          style={{
            fontFamily: "monospace",
          }}
        >
          {`${uiOptions.paymentInfo.amount} ${uiOptions.paymentInfo.token.symbol}`}
        </Text>
      </Container>

      <Spacer y="xs" />

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
          <Button fullWidth onClick={handleContinue} variant="primary">
            {buyNow}
          </Button>
        ) : (
          <ConnectButton
            client={client}
            connectButton={{
              label: buyNow,
              style: {
                width: "100%",
              },
            }}
            theme={theme}
            {...connectOptions}
          />
        )}

        {showThirdwebBranding ? (
          <div>
            <Spacer y="md" />
            <PoweredByThirdweb />
          </div>
        ) : null}
        <Spacer y="lg" />
      </Container>
    </WithHeader>
  );
}
