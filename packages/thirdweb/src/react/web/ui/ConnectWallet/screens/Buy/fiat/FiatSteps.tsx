import { TriangleDownIcon } from "@radix-ui/react-icons";
import { useMemo } from "react";
import { defineChain } from "../../../../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../../../constants/addresses.js";
import type { BuyWithFiatQuote } from "../../../../../../../exports/pay.js";
import { formatNumber } from "../../../../../../../utils/formatNumber.js";
import { useChainQuery } from "../../../../../../core/hooks/others/useChainQuery.js";
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

  const onRampChainMetaQuery = useChainQuery(onRampChain);
  const toChainMetaQuery = useChainQuery(toChain);

  const onRampTokenInfo = (
    <div>
      <Text color="primaryText" size="sm">
        {formatNumber(Number(onRampTokenMeta.amount), 4)}{" "}
        <TokenSymbol token={onRampToken} chain={onRampChain} size="sm" inline />
      </Text>
    </div>
  );

  const fiatIcon = <currency.icon size={iconSize.sm} />;

  const onRampTokenIcon = (
    <TokenIcon
      token={onRampToken}
      chain={onRampChain}
      size="sm"
      client={props.client}
    />
  );
  const toTokenIcon = (
    <TokenIcon
      token={toToken}
      chain={toChain}
      size="sm"
      client={props.client}
    />
  );

  const onRampChainInfo = (
    <Text size="xs">{onRampChainMetaQuery.data?.name}</Text>
  );

  const toTokenInfo = (
    <Text color="primaryText" size="sm">
      {props.quote.estimatedToAmountMin}{" "}
      <TokenSymbol token={toToken} chain={toChain} size="sm" inline />
    </Text>
  );

  const toTokehChainInfo = <Text size="xs">{toChainMetaQuery.data?.name}</Text>;

  return (
    <Container p="lg">
      <ModalHeader title="Confirm Buy" onBack={props.onBack} />

      <Spacer y="xl" />

      {/* Step 1 */}
      <PaymentStep
        title={
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
        }
        step={1}
        isActive={step === 1}
        isDone={step === 2}
        from={{
          icon: fiatIcon,
          primaryText: (
            <Text color="primaryText" size="sm">
              {props.quote.fromCurrency.amount}{" "}
              {props.quote.fromCurrency.currencySymbol}
            </Text>
          ),
        }}
        to={{
          icon: onRampTokenIcon,
          primaryText: onRampTokenInfo,
          secondaryText: onRampChainInfo,
        }}
      />

      <Spacer y="sm" />

      <PaymentStep
        title={
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
        }
        step={2}
        isActive={step === 2}
        isDone={false}
        from={{
          icon: onRampTokenIcon,
          primaryText: onRampTokenInfo,
          secondaryText: onRampChainInfo,
        }}
        to={{
          icon: toTokenIcon,
          primaryText: toTokenInfo,
          secondaryText: toTokehChainInfo,
        }}
      />

      <Spacer y="md" />

      <Button variant="accent" onClick={props.onContinue} fullWidth>
        Continue
      </Button>
    </Container>
  );
}

function PaymentStep(props: {
  step: number;
  title: React.ReactNode;
  isActive: boolean;
  isDone: boolean;
  from: {
    icon: React.ReactNode;
    primaryText: React.ReactNode;
    secondaryText?: React.ReactNode;
  };
  to: {
    icon: React.ReactNode;
    primaryText: React.ReactNode;
    secondaryText?: React.ReactNode;
  };
}) {
  return (
    <StepContainer isActive={props.isActive} isDone={props.isDone}>
      <Text size="sm">Step {props.step}</Text>
      <Spacer y="xs" />
      {props.title}
      <Spacer y="sm" />
      <Line />
      <Spacer y="md" />

      <PaymentSubStep {...props.from} />

      <Container
        color="borderColor"
        style={{
          paddingLeft: "18px",
          position: "relative",
          marginBlock: "3px",
        }}
      >
        {/* TODO - replace this with SVG  */}
        <div
          style={{
            height: "18px",
            width: "2px",
            backgroundColor: "currentColor",
            transform: "translateX(-50%)",
          }}
        />
        <TriangleDownIcon
          width={iconSize.sm}
          height={iconSize.sm}
          style={{
            position: "absolute",
            bottom: "0",
            transform: "translate(-50%, 50%)",
          }}
        />
      </Container>

      <PaymentSubStep {...props.to} />
    </StepContainer>
  );
}

function PaymentSubStep(props: {
  icon: React.ReactNode;
  primaryText: React.ReactNode;
  secondaryText?: React.ReactNode;
}) {
  return (
    <Container flex="row" gap="sm" center="y">
      {/* icon */}
      <Container
        p="xs"
        borderColor="borderColor"
        flex="row"
        center="both"
        style={{
          borderStyle: "solid",
          borderWidth: "1.5px",
          borderRadius: radius.lg,
        }}
      >
        {props.icon}
      </Container>
      <Container flex="column" gap="xxs">
        {props.primaryText}
        {props.secondaryText}
      </Container>
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
