import {
  Cross1Icon,
  ExternalLinkIcon,
  TriangleDownIcon,
} from "@radix-ui/react-icons";
import { useMemo } from "react";
import type { Chain } from "../../../../../../../chains/types.js";
import { getCachedChain } from "../../../../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../../../constants/addresses.js";
import { getContract } from "../../../../../../../contract/contract.js";
import { addSessionKey } from "../../../../../../../extensions/erc4337/account/addSessionKey.js";
import type { BuyWithFiatQuote } from "../../../../../../../pay/buyWithFiat/getQuote.js";
import type { BuyWithFiatStatus } from "../../../../../../../pay/buyWithFiat/getStatus.js";
import { getPayBaseUrl } from "../../../../../../../pay/utils/definitions.js";
import { formatNumber } from "../../../../../../../utils/formatNumber.js";
import { createAndSignUserOp } from "../../../../../../../wallets/smart/lib/userop.js";
import { hexlifyUserOp } from "../../../../../../../wallets/smart/lib/utils.js";
import { smartWallet } from "../../../../../../../wallets/smart/smart-wallet.js";
import {
  type Theme,
  fontSize,
  iconSize,
  radius,
  spacing,
} from "../../../../../../core/design-system/index.js";
import {
  useChainExplorers,
  useChainName,
} from "../../../../../../core/hooks/others/useChainQuery.js";
import { useActiveAccount } from "../../../../../../core/hooks/wallets/useActiveAccount.js";
import { useSwitchActiveWalletChain } from "../../../../../../core/hooks/wallets/useSwitchActiveWalletChain.js";
import type { TokenInfo } from "../../../../../../core/utils/defaultTokens.js";
import { Spacer } from "../../../../components/Spacer.js";
import { Spinner } from "../../../../components/Spinner.js";
import { Container, Line, ModalHeader } from "../../../../components/basic.js";
import { Button, ButtonLink } from "../../../../components/buttons.js";
import { Text } from "../../../../components/text.js";
import { TokenSymbol } from "../../../../components/token/TokenSymbol.js";
import { type ERC20OrNativeToken, NATIVE_TOKEN } from "../../nativeToken.js";
import { PayTokenIcon } from "../PayTokenIcon.js";
import { StepIcon } from "../Stepper.js";
import {
  type FiatStatusMeta,
  getBuyWithFiatStatusMeta,
} from "../pay-transactions/statusMeta.js";
import { getCurrencyMeta } from "./currencies.js";

export type BuyWithFiatPartialQuote = {
  intentId: string;
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
    intentId: quote.intentId,
  };

  return data;
}

export function FiatSteps(props: {
  title: string;
  partialQuote: BuyWithFiatPartialQuote;
  status?: BuyWithFiatStatus;
  onBack: () => void;
  client: ThirdwebClient;
  step: number;
  onContinue: () => void;
  setOnRampLinkOverride?: (link: string) => void;
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
    intentId,
  } = props.partialQuote;

  const account = useActiveAccount();
  const switchChain = useSwitchActiveWalletChain();

  const deploySmartWallet = async ({ chain }: { chain: Chain }) => {
    if (!account) return;

    await switchChain(chain);

    const smartWalletHandle = smartWallet({
      chain,
      sponsorGas: true,
    });

    const smartAccount = await smartWalletHandle.connect({
      client: props.client,
      personalAccount: account,
    });
    console.log("smartAccount", smartAccount);

    const smartAccountContract = getContract({
      client: props.client,
      chain,
      address: smartAccount.address,
    });

    console.log("onRampTokenAmount", props.partialQuote.onRampTokenAmount);
    const sessionKeyTx = addSessionKey({
      contract: smartAccountContract,
      account: account,
      // TODO: Env var this.
      // // prod
      // sessionKeyAddress: "0x1629Ce9Df01B10E7CF8837f559037A49d983aA10", // pay engine backend wallet
      // dev
      sessionKeyAddress: "0x32DC86f866e9F5Ed59A60b18c3B0f9b972a928F0", // dev engine backend wallet
      permissions: {
        approvedTargets: "*", // the addresses of allowed contracts, or '*' for any contract
        permissionStartTimestamp: new Date(), // the date when the session key becomes active
        permissionEndTimestamp: new Date(Date.now() + 24 * 60 * 60 * 1000), // the date when the session key expires
        // TODO: Perhaps add a buffer here to be safe?
        nativeTokenLimitPerTransaction: props.partialQuote.onRampTokenAmount,
      },
    });

    const signedUserOp = await createAndSignUserOp({
      transactions: [sessionKeyTx],
      adminAccount: account,
      client: props.client,
      smartWalletOptions: {
        chain,
        sponsorGas: true,
      },
    });

    const hexlifiedUserOp = hexlifyUserOp(signedUserOp);
    console.log("signedUserOp", signedUserOp);
    console.log("hexlifiedUserOp", hexlifiedUserOp);
    console.log("sessionKeyTx", sessionKeyTx);

    console.log("chainId", chain.id);
    console.log("intentId", intentId);
    console.log("toAddress", account.address);
    const response = await fetch(
      `${getPayBaseUrl()}/v2/intent-wallets/deploy`,
      {
        method: "POST",
        body: JSON.stringify({
          chainId: chain.id,
          intentId: intentId,
          intentType: "buyWithFiat",
          signedUserOps: [hexlifiedUserOp],
          toAddress: account.address,
          smartWalletAddress: smartAccount.address,
        }),
        headers: {
          "Content-Type": "application/json",
          "x-client-id": process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID as string,
        },
      },
    );

    const data = await response.json();
    console.log("response from server", data);

    props.setOnRampLinkOverride?.(data.onRampLink);

    return {
      smartWalletAddress: smartAccount.address,
      userAddress: account.address,
    };
  };

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

  const onRampName = useChainName(onRampChain);
  const onRampExplorers = useChainExplorers(onRampChain);
  const toChainName = useChainName(toChain);
  const toChainExplorers = useChainExplorers(toChain);
  const destinationName = useChainName(destinationChain);

  const onRampTokenInfo = (
    <div>
      <Text color="primaryText" size="sm">
        {formatNumber(Number(onRampTokenAmount), 6)}{" "}
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

  const onRampChainInfo = <Text size="xs">{onRampName.name}</Text>;

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
          {formatNumber(Number(toTokenAmount), 6)}{" "}
          <TokenSymbol
            token={toToken}
            chain={toChain}
            size="sm"
            inline
            color="secondaryText"
          />
        </Text>{" "}
        <Text color="danger" size="sm" inline>
          {formatNumber(Number(props.status.destination.amount), 6)}{" "}
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
      {formatNumber(Number(toTokenAmount), 6)}{" "}
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
          {toChainName.name}
        </Text>{" "}
        <Text size="xs" inline>
          {destinationName.name}
        </Text>
      </div>
    ) : null;

  const toTokehChainInfo = partialSuccessToChainInfo || (
    <Text size="xs">{toChainName.name}</Text>
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
      <ModalHeader title={props.title} onBack={props.onBack} />
      <Spacer y="lg" />

      {/* Step 1 */}
      <button onClick={() => deploySmartWallet({ chain: onRampChain })}>
        Deploy smart wallet with session key
      </button>

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
              {formatNumber(Number(fromCurrencyAmount), 6)} {fromCurrencySymbol}
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
          onRampExplorers.explorers[0]?.url && onRampTxHash
            ? {
                label: "View on Explorer",
                url: `${onRampExplorers.explorers[0]?.url}/tx/${onRampTxHash}`,
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
          toChainExplorers.explorers[0]?.url && toTokenTxHash
            ? {
                label: "View on Explorer",
                url: `${toChainExplorers.explorers[0].url}/tx/${toTokenTxHash}`,
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
