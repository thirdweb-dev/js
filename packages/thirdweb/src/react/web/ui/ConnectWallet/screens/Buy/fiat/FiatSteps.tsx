import {
  Cross1Icon,
  ExternalLinkIcon,
  TriangleDownIcon,
} from "@radix-ui/react-icons";
import { useMemo } from "react";
import { getCachedChain } from "../../../../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../../../constants/addresses.js";
import type { BuyWithFiatQuote } from "../../../../../../../pay/buyWithFiat/getQuote.js";
import type { BuyWithFiatStatus } from "../../../../../../../pay/buyWithFiat/getStatus.js";
import { formatNumber } from "../../../../../../../utils/formatNumber.js";
import {
  type Theme,
  fontSize,
  iconSize,
  radius,
  spacing,
} from "../../../../../../core/design-system/index.js";
import { useChainQuery } from "../../../../../../core/hooks/others/useChainQuery.js";
import { Spacer } from "../../../../components/Spacer.js";
import { Spinner } from "../../../../components/Spinner.js";
import { Container, Line, ModalHeader } from "../../../../components/basic.js";
import { Button, ButtonLink } from "../../../../components/buttons.js";
import { Text } from "../../../../components/text.js";
import { TokenSymbol } from "../../../../components/token/TokenSymbol.js";
import type { TokenInfo } from "../../../defaultTokens.js";
import { type ERC20OrNativeToken, NATIVE_TOKEN } from "../../nativeToken.js";
import { PayTokenIcon } from "../PayTokenIcon.js";
import { StepIcon } from "../Stepper.js";
import {
  type FiatStatusMeta,
  getBuyWithFiatStatusMeta,
} from "../tx-history/statusMeta.js";
import { getCurrencyMeta } from "./currencies.js";

export type BuyWithFiatPartialQuote = {
  fromCurrencySymbol: string;
  fromCurrencyAmount: string;
  onRampTokenAmount: string;
  toTokenAmount: string;
  onRampToken: {
    tokenAddress: string;
    name?: string;
    symbol?: string;
    chainId: number;
  };

  toToken: {
    tokenAddress: string;
    name?: string;
    symbol?: string;
    chainId: number;
  };
};

export function fiatQuoteToPartialQuote(
  quote: BuyWithFiatQuote,
): BuyWithFiatPartialQuote {
  const data: BuyWithFiatPartialQuote = {
    fromCurrencyAmount: quote.fromCurrencyWithFees.amount,
    fromCurrencySymbol: quote.fromCurrencyWithFees.currencySymbol,
    onRampTokenAmount: quote.onRampToken.amount,
    toTokenAmount: quote.estimatedToAmountMin,
    onRampToken: {
      chainId: quote.onRampToken.token.chainId,
      tokenAddress: quote.onRampToken.token.tokenAddress,
      name: quote.onRampToken.token.name,
      symbol: quote.onRampToken.token.symbol,
    },
    toToken: {
      chainId: quote.toToken.chainId,
      tokenAddress: quote.toToken.tokenAddress,
      name: quote.toToken.name,
      symbol: quote.toToken.symbol,
    },
  };

  return data;
}

export function FiatSteps(props: {
  partialQuote: BuyWithFiatPartialQuote;
  status?: BuyWithFiatStatus;
  onBack: () => void;
  client: ThirdwebClient;
  step: number;
  onContinue: () => void;
}) {
  const statusMeta = props.status
    ? getBuyWithFiatStatusMeta(props.status)
    : undefined;

  const {
    toToken: toTokenMeta,
    onRampToken: onRampTokenMeta,
    onRampTokenAmount,
    fromCurrencySymbol,
    fromCurrencyAmount,
    toTokenAmount,
  } = props.partialQuote;

  const currency = getCurrencyMeta(fromCurrencySymbol);
  const isPartialSuccess = statusMeta?.progressStatus === "partialSuccess";

  const toChain = useMemo(
    () => getCachedChain(toTokenMeta.chainId),
    [toTokenMeta.chainId],
  );

  const destinationChain = useMemo(() => {
    if (props.status?.status !== "NOT_FOUND" && props.status?.destination) {
      return getCachedChain(props.status?.destination.token.chainId);
    }

    return undefined;
  }, [props.status]);

  const toToken: ERC20OrNativeToken = useMemo(() => {
    if (toTokenMeta.tokenAddress === NATIVE_TOKEN_ADDRESS) {
      return NATIVE_TOKEN;
    }

    const tokenInfo: TokenInfo = {
      address: toTokenMeta.tokenAddress,
      name: toTokenMeta.name || "",
      symbol: toTokenMeta.symbol || "",
      // TODO: when icon is available in endpoint
      // icon: toTokenMeta.icon
    };
    return tokenInfo;
  }, [toTokenMeta]);

  const onRampChain = useMemo(
    () => getCachedChain(onRampTokenMeta.chainId),
    [onRampTokenMeta.chainId],
  );

  const onRampToken: ERC20OrNativeToken = useMemo(() => {
    if (onRampTokenMeta.tokenAddress === NATIVE_TOKEN_ADDRESS) {
      return NATIVE_TOKEN;
    }

    const tokenInfo: TokenInfo = {
      address: onRampTokenMeta.tokenAddress,
      name: onRampTokenMeta.name || "",
      symbol: onRampTokenMeta.symbol || "",
      // TODO: when icon is available in endpoint
      // icon: onRampTokenMeta.icon,
    };
    return tokenInfo;
  }, [onRampTokenMeta]);

  const onRampChainMetaQuery = useChainQuery(onRampChain);
  const toChainMetaQuery = useChainQuery(toChain);

  const destinationChainMetaQuery = useChainQuery(destinationChain);

  const onRampTokenInfo = (
    <div>
      <Text color="primaryText" size="sm">
        {formatNumber(Number(onRampTokenAmount), 4)}{" "}
        <TokenSymbol token={onRampToken} chain={onRampChain} size="sm" inline />
      </Text>
    </div>
  );

  const fiatIcon = <currency.icon size={iconSize.sm} />;

  const onRampTokenIcon = (
    <PayTokenIcon
      token={onRampToken}
      chain={onRampChain}
      size="sm"
      client={props.client}
    />
  );

  const toTokenIcon = (
    <PayTokenIcon
      token={toToken}
      chain={toChain}
      size="sm"
      client={props.client}
    />
  );

  const onRampChainInfo = (
    <Text size="xs">{onRampChainMetaQuery.data?.name}</Text>
  );

  const partialSuccessToTokenInfo =
    props.status?.status === "CRYPTO_SWAP_FALLBACK" &&
    props.status.destination ? (
      <div>
        <Text
          color="secondaryText"
          size="sm"
          inline
          style={{
            textDecoration: "line-through",
          }}
        >
          {formatNumber(Number(toTokenAmount), 4)}{" "}
          <TokenSymbol
            token={toToken}
            chain={toChain}
            size="sm"
            inline
            color="secondaryText"
          />
        </Text>{" "}
        <Text color="danger" size="sm" inline>
          {formatNumber(Number(props.status.destination.amount), 4)}{" "}
          <TokenSymbol
            token={{
              address: props.status.destination.token.tokenAddress,
              name: props.status.destination.token.name || "",
              symbol: props.status.destination.token.symbol || "",
            }}
            chain={toChain}
            size="sm"
            inline
            color="danger"
          />
        </Text>
      </div>
    ) : null;

  const toTokenInfo = partialSuccessToTokenInfo || (
    <Text color="primaryText" size="sm">
      {formatNumber(Number(toTokenAmount), 4)}{" "}
      <TokenSymbol token={toToken} chain={toChain} size="sm" inline />
    </Text>
  );

  const partialSuccessToChainInfo =
    props.status?.status === "CRYPTO_SWAP_FALLBACK" &&
    props.status.destination &&
    props.status.destination.token.chainId !==
      props.status.quote.toToken.chainId ? (
      <div>
        <Text
          size="xs"
          inline
          style={{
            textDecoration: "line-through",
          }}
        >
          {toChainMetaQuery.data?.name}
        </Text>{" "}
        <Text size="xs" inline>
          {destinationChainMetaQuery.data?.name}
        </Text>
      </div>
    ) : null;

  const toTokehChainInfo = partialSuccessToChainInfo || (
    <Text size="xs">{toChainMetaQuery.data?.name}</Text>
  );

  const onRampTxHash =
    props.status?.status !== "NOT_FOUND"
      ? props.status?.source?.transactionHash
      : undefined;

  const toTokenTxHash =
    props.status?.status !== "NOT_FOUND"
      ? props.status?.destination?.transactionHash
      : undefined;

  const showContinueBtn =
    !props.status ||
    props.status.status === "CRYPTO_SWAP_REQUIRED" ||
    props.status.status === "CRYPTO_SWAP_FAILED";

  function getStep1State(): FiatStatusMeta["progressStatus"] {
    if (!statusMeta) {
      if (props.step === 2) {
        return "completed";
      }
      return "actionRequired";
    }

    if (statusMeta.step === 2) {
      return "completed";
    }

    return statusMeta.progressStatus;
  }

  function getStep2State(): FiatStatusMeta["progressStatus"] | undefined {
    if (!statusMeta) {
      if (props.step === 2) {
        return "actionRequired";
      }
      return undefined;
    }

    if (statusMeta.step === 2) {
      return statusMeta.progressStatus;
    }

    return undefined;
  }

  return (
    <Container p="lg">
      <ModalHeader title="Buy" onBack={props.onBack} />
      <Spacer y="lg" />

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
            with {props.partialQuote.fromCurrencySymbol}
          </Text>
        }
        step={1}
        from={{
          icon: fiatIcon,
          primaryText: (
            <Text color="primaryText" size="sm">
              {formatNumber(Number(fromCurrencyAmount), 4)} {fromCurrencySymbol}
            </Text>
          ),
        }}
        to={{
          icon: onRampTokenIcon,
          primaryText: onRampTokenInfo,
          secondaryText: onRampChainInfo,
        }}
        state={getStep1State()}
        explorer={
          onRampChainMetaQuery.data?.explorers?.[0]?.url && onRampTxHash
            ? {
                label: "View on Explorer",
                url: `${onRampChainMetaQuery.data.explorers[0].url}/tx/${onRampTxHash}`,
              }
            : undefined
        }
      />

      <Spacer y="md" />

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
        state={getStep2State()}
        explorer={
          toChainMetaQuery.data?.explorers?.[0]?.url && toTokenTxHash
            ? {
                label: "View on Explorer",
                url: `${toChainMetaQuery.data.explorers[0].url}/tx/${toTokenTxHash}`,
              }
            : undefined
        }
      />

      {isPartialSuccess &&
        props.status &&
        props.status.status !== "NOT_FOUND" &&
        props.status.source &&
        props.status.destination && (
          <>
            <Spacer y="md" />
            <Text color="danger" size="sm" center>
              Expected {props.status.source?.token.symbol}, Got{" "}
              {props.status.destination?.token.symbol} instead
            </Text>
            <Spacer y="sm" />
          </>
        )}

      {showContinueBtn && (
        <>
          <Spacer y="md" />
          <Button variant="accent" onClick={props.onContinue} fullWidth>
            Continue
          </Button>
        </>
      )}
    </Container>
  );
}

function PaymentStep(props: {
  step: number;
  title: React.ReactNode;
  state?: FiatStatusMeta["progressStatus"];
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
  iconText?: string;
  explorer?: {
    label: string;
    url: string;
  };
}) {
  return (
    <StepContainer state={props.state}>
      <Text size="sm">Step {props.step}</Text>
      <Spacer y="sm" />
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

      {props.explorer && (
        <>
          <Spacer y="md" />
          <ButtonLink
            variant="outline"
            fullWidth
            href={props.explorer.url}
            style={{
              fontSize: fontSize.xs,
              padding: spacing.xs,
            }}
            gap="xxs"
            target="_blank"
          >
            {props.explorer.label}{" "}
            <ExternalLinkIcon width={iconSize.xs} height={iconSize.xs} />
          </ButtonLink>
        </>
      )}
    </StepContainer>
  );
}

function PaymentSubStep(props: {
  icon: React.ReactNode;
  primaryText: React.ReactNode;
  secondaryText?: React.ReactNode;
}) {
  return (
    <Container
      flex="row"
      gap="sm"
      center="y"
      style={{
        flexWrap: "nowrap",
      }}
    >
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
  state?: FiatStatusMeta["progressStatus"];
  children: React.ReactNode;
}) {
  let color: keyof Theme["colors"] = "borderColor";
  let text: string | undefined;

  if (props.state === "pending") {
    text = "Pending";
    color = "accentText";
  } else if (props.state === "actionRequired") {
    color = "accentText";
  } else if (props.state === "completed") {
    text = "Completed";
    color = "success";
  } else if (props.state === "failed") {
    color = "danger";
    text = "Failed";
  } else if (props.state === "partialSuccess") {
    color = "danger";
    text = "Incomplete";
  }

  return (
    <Container
      bg="tertiaryBg"
      borderColor={color === "success" ? "borderColor" : color}
      py="sm"
      px="md"
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
          right: spacing.sm,
          top: spacing.sm,
          display: "flex",
          gap: spacing.xs,
          alignItems: "center",
        }}
      >
        {props.state && text && (
          <Text size="sm" color={color}>
            {text}
          </Text>
        )}

        {(props.state === "actionRequired" || props.state === "completed") && (
          <StepIcon
            isActive={props.state === "actionRequired"}
            isDone={props.state === "completed"}
          />
        )}

        {props.state === "pending" && <Spinner color="accentText" size="sm" />}

        {props.state === "failed" && (
          <Container color="danger" flex="row" center="both">
            <Cross1Icon width={iconSize.sm} height={iconSize.sm} />
          </Container>
        )}
      </div>
    </Container>
  );
}
