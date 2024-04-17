import type { Chain } from "../../../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import type { BuyWithFiatQuote } from "../../../../../../../exports/pay.js";
import { formatNumber } from "../../../../../../../utils/formatNumber.js";
import { Spacer } from "../../../../components/Spacer.js";
import { TokenIcon } from "../../../../components/TokenIcon.js";
import { Container, ModalHeader } from "../../../../components/basic.js";
import { Button } from "../../../../components/buttons.js";
import { Text } from "../../../../components/text.js";
import { TokenSymbol } from "../../../../components/token/TokenSymbol.js";
import { iconSize } from "../../../../design-system/index.js";
import { USDIcon } from "../../../icons/USDIcon.js";
import { type ERC20OrNativeToken, NATIVE_TOKEN } from "../../nativeToken.js";

export function FiatConfirmation(props: {
  quote: BuyWithFiatQuote;
  onBack: () => void;
  step: 1 | 2;
  toToken: ERC20OrNativeToken;
  toChain: Chain;
  client: ThirdwebClient;
  toTokenAmount: string;
  onContinue: () => void;
}) {
  return (
    <Container p="lg">
      <ModalHeader title="Confirm Buy" onBack={props.onBack} />
      <Spacer y="xl" />
      <Text
        style={{
          letterSpacing: "0.05em",
        }}
      >
        STEP {props.step}
      </Text>
      <Spacer y="sm" />
      <Text color="primaryText" size="lg">
        {props.step === 1 ? (
          "Getting your funds onchain"
        ) : (
          <>
            Converting to{" "}
            <TokenSymbol
              token={props.toToken}
              chain={props.toChain}
              size="lg"
              color="primaryText"
              inline
            />
          </>
        )}
      </Text>
      <Spacer y="sm" />
      <Text multiline>
        We'll need to bring your funds onchain to exchange for your desired
        token
      </Text>

      <Spacer y="xl" />

      {/* Fiat */}
      <Container flex="row" gap="sm" center="y">
        <USDIcon size={iconSize.md} />
        <Text color="primaryText">
          {props.quote.fromCurrency.amount}{" "}
          {props.quote.fromCurrency.currencySymbol}
        </Text>
      </Container>

      <Spacer y="lg" />

      {/* Native Tokens */}
      <Container flex="row" gap="sm" center="y">
        <TokenIcon
          token={NATIVE_TOKEN}
          chain={props.toChain}
          size="md"
          client={props.client}
        />
        <div>
          <Text color="primaryText" inline>
            {formatNumber(Number(props.quote.onRampToken.amount), 4)}
          </Text>{" "}
          <TokenSymbol
            token={props.toToken}
            chain={props.toChain}
            size="md"
            inline
          />
        </div>
      </Container>

      <Spacer y="lg" />

      {/* Final Token */}
      <Container flex="row" gap="sm" center="y">
        <TokenIcon
          token={props.toToken}
          chain={props.toChain}
          size="md"
          client={props.client}
        />
        <div>
          <Text color="primaryText" inline>
            {props.toTokenAmount}{" "}
          </Text>
          <TokenSymbol
            token={props.toToken}
            chain={props.toChain}
            size="md"
            inline
          />
        </div>
      </Container>

      <Spacer y="xl" />

      <Button variant="accent" onClick={props.onContinue} fullWidth>
        Continue
      </Button>
    </Container>
  );
}
