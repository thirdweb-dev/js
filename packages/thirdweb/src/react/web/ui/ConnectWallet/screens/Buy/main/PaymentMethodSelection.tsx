import { IdCardIcon } from "@radix-ui/react-icons";
import type { Chain } from "../../../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import { iconSize } from "../../../../../../core/design-system/index.js";
import { Container } from "../../../../components/basic.js";
import { Button } from "../../../../components/buttons.js";
import { Text } from "../../../../components/text.js";
import { CoinsIcon } from "../../../icons/CoinsIcon.js";
import type { ERC20OrNativeToken } from "../../nativeToken.js";
import { TokenSelectedLayout } from "./TokenSelectedLayout.js";

export function PaymentMethodSelectionScreen(props: {
  setScreen: (screenId: "buy-with-crypto" | "buy-with-fiat") => void;
  tokenAmount: string;
  selectedToken: ERC20OrNativeToken;
  selectedChain: Chain;
  client: ThirdwebClient;
  onBack: () => void;
}) {
  const content = (
    <Container animate="fadein">
      {/* Credit Card */}
      <Container flex="column" gap="sm">
        <Button
          variant="outline"
          bg="tertiaryBg"
          onClick={() => props.setScreen("buy-with-fiat")}
          gap="sm"
          style={{
            justifyContent: "flex-start",
            textAlign: "left",
          }}
        >
          <Container color="secondaryText" flex="row" center="both">
            <IdCardIcon
              style={{
                width: iconSize.md,
                height: iconSize.md,
              }}
            />
          </Container>

          <Container flex="column" gap="xxs">
            <Text size="md" color="primaryText">
              Credit Card
            </Text>
            <Text size="xs">Easily and securely make payments</Text>
          </Container>
        </Button>

        {/* Crypto */}
        <Button
          variant="outline"
          bg="tertiaryBg"
          onClick={() => props.setScreen("buy-with-crypto")}
          style={{
            justifyContent: "flex-start",
          }}
          gap="sm"
        >
          <Container color="secondaryText" flex="row" center="both">
            <CoinsIcon size={iconSize.md} />
          </Container>

          <Container flex="column" gap="xxs">
            <Text size="md" color="primaryText">
              Crypto
            </Text>
            <Text size="xs">Pay with confidence using crypto</Text>
          </Container>
        </Button>
      </Container>
    </Container>
  );

  return (
    <TokenSelectedLayout
      client={props.client}
      onBack={props.onBack}
      selectedChain={props.selectedChain}
      selectedToken={props.selectedToken}
      tokenAmount={props.tokenAmount}
    >
      {content}
    </TokenSelectedLayout>
  );
}
