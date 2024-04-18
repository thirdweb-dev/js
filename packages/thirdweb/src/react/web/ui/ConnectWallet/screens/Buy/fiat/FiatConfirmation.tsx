import { ChevronRightIcon } from "@radix-ui/react-icons";
import type { Chain } from "../../../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import type { BuyWithFiatQuote } from "../../../../../../../exports/pay.js";
import { formatNumber } from "../../../../../../../utils/formatNumber.js";
import { Spacer } from "../../../../components/Spacer.js";
import { TokenIcon } from "../../../../components/TokenIcon.js";
import { Container, Line, ModalHeader } from "../../../../components/basic.js";
import { Button } from "../../../../components/buttons.js";
import { Text } from "../../../../components/text.js";
import { TokenSymbol } from "../../../../components/token/TokenSymbol.js";
import { iconSize, radius, spacing } from "../../../../design-system/index.js";
import { type ERC20OrNativeToken, NATIVE_TOKEN } from "../../nativeToken.js";
import { StepIcon } from "../Stepper.js";
import type { CurrencyMeta } from "./currencies.js";

export function FiatConfirmation(props: {
  quote: BuyWithFiatQuote;
  onBack: () => void;
  step: 1 | 2;
  toToken: ERC20OrNativeToken;
  toChain: Chain;
  client: ThirdwebClient;
  toTokenAmount: string;
  onContinue: () => void;
  currency: CurrencyMeta;
}) {
  const fiat = (
    <Container flex="row" gap="sm" center="y">
      <props.currency.icon size={iconSize.md} />
      <Text color="primaryText">
        {props.quote.fromCurrency.amount}{" "}
        {props.quote.fromCurrency.currencySymbol}
      </Text>
    </Container>
  );

  const nativeToken = (
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
          token={NATIVE_TOKEN}
          chain={props.toChain}
          size="md"
          inline
        />
      </div>
    </Container>
  );

  const finalToken = (
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
  );

  return (
    <Container p="lg">
      <ModalHeader title="Confirm Buy" onBack={props.onBack} />

      <Spacer y="xl" />

      {/* Step 1 */}
      <VerticalStepper isActive={props.step === 1} isDone={props.step === 2}>
        <Container>
          <Text size="sm">Step 1</Text>
          <Spacer y="xs" />
          <Text color="primaryText" size="md">
            Get{" "}
            <TokenSymbol
              token={NATIVE_TOKEN}
              chain={props.toChain}
              size="md"
              inline
            />{" "}
            with {props.quote.fromCurrency.currencySymbol}
          </Text>

          <Spacer y="sm" />
          <Line />
          <Spacer y="sm" />
          <Container flex="column" gap="xs">
            <Container flex="row" gap="xxs" center="y">
              {fiat}
              <ChevronRightIcon width={iconSize.sm} />
            </Container>
            {nativeToken}
          </Container>
        </Container>
      </VerticalStepper>

      <Spacer y="md" />

      {/* Step 2 */}
      <VerticalStepper isActive={props.step === 2} isDone={false}>
        <Container>
          <Text size="sm">Step 2</Text>
          <Spacer y="xs" />
          <Text color="primaryText" size="md">
            Convert{" "}
            <TokenSymbol
              token={NATIVE_TOKEN}
              chain={props.toChain}
              size="md"
              inline
            />{" "}
            to{" "}
            <TokenSymbol
              token={props.toToken}
              chain={props.toChain}
              size="md"
              inline
            />
          </Text>

          <Spacer y="sm" />
          <Line />
          <Spacer y="sm" />

          <Container flex="column" gap="xs">
            <Container flex="row" gap="xxs" center="y">
              {nativeToken}
              <ChevronRightIcon width={iconSize.sm} />
            </Container>
            {finalToken}
          </Container>
        </Container>
      </VerticalStepper>

      <Spacer y="md" />

      <Button variant="accent" onClick={props.onContinue} fullWidth>
        Continue
      </Button>
    </Container>
  );
}

function VerticalStepper(props: {
  isActive: boolean;
  isDone: boolean;
  children: React.ReactNode;
}) {
  return (
    <Container
      bg="tertiaryBg"
      borderColor={props.isActive ? "accentText" : "borderColor"}
      p="md"
      style={{
        borderRadius: radius.lg,
        alignItems: "flex-start",
        borderWidth: "1px",
        borderStyle: "solid",
        position: "relative",
      }}
    >
      {props.children}
      <div
        style={{
          position: "absolute",
          right: spacing.md,
          top: spacing.md,
        }}
      >
        <StepIcon isActive={props.isActive} isDone={props.isDone} />
      </div>
    </Container>
  );
}
