import { ChevronRightIcon } from "@radix-ui/react-icons";
import { useMemo } from "react";
import { defineChain } from "../../../../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../../../constants/addresses.js";
import type { BuyWithFiatQuote } from "../../../../../../../exports/pay.js";
import { formatNumber } from "../../../../../../../utils/formatNumber.js";
import { Spacer } from "../../../../components/Spacer.js";
import { TokenIcon } from "../../../../components/TokenIcon.js";
import { Container, Line, ModalHeader } from "../../../../components/basic.js";
import { Button } from "../../../../components/buttons.js";
import { Text } from "../../../../components/text.js";
import { TokenSymbol } from "../../../../components/token/TokenSymbol.js";
import { iconSize, radius, spacing } from "../../../../design-system/index.js";
import type { TokenInfo } from "../../../defaultTokens.js";
import { type ERC20OrNativeToken, NATIVE_TOKEN } from "../../nativeToken.js";
import { StepIcon } from "../Stepper.js";
import { getCurrencyMeta } from "./currencies.js";

export function FiatSteps(props: {
  quote: BuyWithFiatQuote;
  onBack: () => void;
  client: ThirdwebClient;
  step: number;
  onContinue: () => void;
}) {
  const step = props.step;
  const currency = getCurrencyMeta(props.quote.fromCurrency.currencySymbol);

  const { toToken: toTokenMeta, onRampToken: onRampTokenMeta } = props.quote;

  const toChain = useMemo(
    () => defineChain(toTokenMeta.chainId),
    [toTokenMeta.chainId],
  );

  const toToken: ERC20OrNativeToken = useMemo(() => {
    if (toTokenMeta.tokenAddress === NATIVE_TOKEN_ADDRESS) {
      return NATIVE_TOKEN;
    }

    const tokenInfo: TokenInfo = {
      address: toTokenMeta.tokenAddress,
      icon: "",
      name: toTokenMeta.name || "",
      symbol: toTokenMeta.symbol || "",
    };
    return tokenInfo;
  }, [toTokenMeta]);

  const onRampChain = useMemo(
    () => defineChain(onRampTokenMeta.token.chainId),
    [onRampTokenMeta.token.chainId],
  );

  const onRampToken: ERC20OrNativeToken = useMemo(() => {
    if (onRampTokenMeta.token.tokenAddress === NATIVE_TOKEN_ADDRESS) {
      return NATIVE_TOKEN;
    }

    const tokenInfo: TokenInfo = {
      address: onRampTokenMeta.token.tokenAddress,
      icon: "",
      name: onRampTokenMeta.token.name || "",
      symbol: onRampTokenMeta.token.symbol || "",
    };
    return tokenInfo;
  }, [onRampTokenMeta]);

  const fiat = (
    <Container flex="row" gap="sm" center="y">
      <currency.icon size={iconSize.sm} />
      <Text color="primaryText" size="sm">
        {props.quote.fromCurrency.amount}{" "}
        {props.quote.fromCurrency.currencySymbol}
      </Text>
    </Container>
  );

  const onRampTokenInfo = (
    <Container flex="row" gap="sm" center="y">
      <TokenIcon
        token={onRampToken}
        chain={onRampChain}
        size="sm"
        client={props.client}
      />
      <div>
        <Text color="primaryText" inline size="sm">
          {formatNumber(Number(onRampTokenMeta.amount), 4)}
        </Text>{" "}
        <TokenSymbol token={onRampToken} chain={onRampChain} size="sm" inline />
      </div>
    </Container>
  );

  const toTokenInfo = (
    <Container flex="row" gap="sm" center="y">
      <TokenIcon
        token={toToken}
        chain={toChain}
        size="sm"
        client={props.client}
      />
      <div>
        <Text color="primaryText" inline>
          {props.quote.estimatedToAmountMin}{" "}
        </Text>
        <TokenSymbol token={toToken} chain={toChain} size="sm" inline />
      </div>
    </Container>
  );

  return (
    <Container p="lg">
      <ModalHeader title="Confirm Buy" onBack={props.onBack} />

      <Spacer y="xl" />

      {/* Step 1 */}
      <StepContainer isActive={step === 1} isDone={step === 2}>
        <Container>
          <Text size="sm">Step 1</Text>
          <Spacer y="xs" />
          <Text color="primaryText" size="md">
            Get{" "}
            <TokenSymbol
              token={onRampToken}
              chain={onRampChain}
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
            {onRampTokenInfo}
          </Container>
        </Container>
      </StepContainer>

      <Spacer y="md" />

      {/* Step 2 */}
      <StepContainer isActive={step === 2} isDone={false}>
        <Container>
          <Text size="sm">Step 2</Text>
          <Spacer y="xs" />
          <Text color="primaryText" size="md">
            Convert{" "}
            <TokenSymbol
              token={onRampToken}
              chain={onRampChain}
              size="md"
              inline
            />{" "}
            to <TokenSymbol token={toToken} chain={toChain} size="md" inline />
          </Text>

          <Spacer y="sm" />
          <Line />
          <Spacer y="sm" />

          <Container flex="column" gap="xs">
            <Container flex="row" gap="xxs" center="y">
              {onRampTokenInfo}
              <ChevronRightIcon width={iconSize.sm} />
            </Container>
            {toTokenInfo}
          </Container>
        </Container>
      </StepContainer>

      <Spacer y="lg" />

      <Button variant="accent" onClick={props.onContinue} fullWidth>
        Continue
      </Button>
    </Container>
  );
}

function StepContainer(props: {
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
