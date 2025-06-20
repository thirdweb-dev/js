import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { getCachedChain } from "../../../../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import type { BuyWithCryptoQuote } from "../../../../../../../pay/buyWithCrypto/getQuote.js";
import type { ValidBuyWithCryptoStatus } from "../../../../../../../pay/buyWithCrypto/getStatus.js";
import { formatExplorerTxUrl } from "../../../../../../../utils/url.js";
import {
  fontSize,
  iconSize,
  spacing,
} from "../../../../../../core/design-system/index.js";
import {
  useChainExplorers,
  useChainName,
} from "../../../../../../core/hooks/others/useChainQuery.js";
import { Container, Line } from "../../../../components/basic.js";
import { ButtonLink } from "../../../../components/buttons.js";
import { Spacer } from "../../../../components/Spacer.js";
import { Text } from "../../../../components/text.js";
import { WalletRow } from "../swap/WalletRow.js";
import { getBuyWithCryptoStatusMeta, type StatusMeta } from "./statusMeta.js";
import { TokenInfoRow } from "./TokenInfoRow.js";

type SwapTxDetailsData = {
  fromToken: {
    chainId: number;
    symbol: string;
    address: string;
    amount: string;
  };
  quotedToToken: {
    chainId: number;
    symbol: string;
    address: string;
    amount: string;
  };
  gotToken?: {
    chainId: number;
    symbol: string;
    address: string;
    amount: string;
  };
  statusMeta?: StatusMeta;
  sourceTxHash?: string;
  destinationTxHash?: string;
  isPartialSuccess: boolean;
  estimatedDuration: number;
  fromAddress: string;
  toAddress: string;
};

export function SwapTxDetailsTable(
  props:
    | {
        type: "quote";
        quote: BuyWithCryptoQuote;
        client: ThirdwebClient;
      }
    | {
        client: ThirdwebClient;
        type: "status";
        status: ValidBuyWithCryptoStatus;
        hideStatusRow?: boolean;
      },
) {
  let uiData: SwapTxDetailsData;
  let showStatusRow = true;
  if (props.type === "status") {
    const status = props.status;
    if (props.hideStatusRow) {
      showStatusRow = false;
    }

    const isPartialSuccess =
      status.status === "COMPLETED" && status.subStatus === "PARTIAL_SUCCESS";

    uiData = {
      destinationTxHash: status.destination?.transactionHash,
      estimatedDuration: status.quote.estimated.durationSeconds || 0,
      fromAddress: status.fromAddress,
      fromToken: {
        address: status.quote.fromToken.tokenAddress,
        amount: status.quote.fromAmount,
        chainId: status.quote.fromToken.chainId,
        symbol: status.quote.fromToken.symbol || "",
      },
      gotToken: status.destination
        ? {
            address: status.destination.token.tokenAddress,
            amount: status.destination.amount,
            chainId: status.destination.token.chainId,
            symbol: status.destination.token.symbol || "",
          }
        : undefined,
      isPartialSuccess,
      quotedToToken: {
        address: status.quote.toToken.tokenAddress,
        amount: status.quote.toAmount,
        chainId: status.quote.toToken.chainId,
        symbol: status.quote.toToken.symbol || "",
      },
      sourceTxHash: status.source?.transactionHash,
      statusMeta: getBuyWithCryptoStatusMeta(status),
      toAddress: status.toAddress,
    };
  } else {
    const quote = props.quote;
    uiData = {
      estimatedDuration: quote.swapDetails.estimated.durationSeconds || 0,
      fromAddress: quote.swapDetails.fromAddress,
      fromToken: {
        address: quote.swapDetails.fromToken.tokenAddress,
        amount: quote.swapDetails.fromAmount,
        chainId: quote.swapDetails.fromToken.chainId,
        symbol: quote.swapDetails.fromToken.symbol || "",
      },
      isPartialSuccess: false,
      quotedToToken: {
        address: quote.swapDetails.toToken.tokenAddress,
        amount: quote.swapDetails.toAmount,
        chainId: quote.swapDetails.toToken.chainId,
        symbol: quote.swapDetails.toToken.symbol || "",
      },
      toAddress: quote.swapDetails.toAddress,
    };
  }

  const { client } = props;

  const {
    fromToken,
    quotedToToken: toToken,
    statusMeta,
    sourceTxHash,
    destinationTxHash,
    isPartialSuccess,
    gotToken,
  } = uiData;

  const fromChainId = fromToken.chainId;
  const toChainId = toToken.chainId;

  const fromChainName = useChainName(getCachedChain(fromChainId));
  const fromChainExplorers = useChainExplorers(getCachedChain(fromChainId));
  const toChainName = useChainName(getCachedChain(toChainId));
  const toChainExplorers = useChainExplorers(getCachedChain(toChainId));

  const lineSpacer = (
    <>
      <Spacer y="md" />
      <Line />
      <Spacer y="md" />
    </>
  );

  return (
    <div>
      {/* Pay */}
      <TokenInfoRow
        chainId={fromToken.chainId}
        client={client}
        label="Paid"
        tokenAddress={fromToken.address}
        tokenAmount={fromToken.amount}
        tokenSymbol={fromToken.symbol || ""}
      />

      {lineSpacer}
      {isPartialSuccess && gotToken ? (
        // Expected + Got
        <>
          {/* Expected */}
          <TokenInfoRow
            chainId={toToken.chainId}
            client={client}
            label={isPartialSuccess ? "Expected" : "Received"}
            tokenAddress={toToken.address}
            tokenAmount={toToken.amount}
            tokenSymbol={toToken.symbol || ""}
          />

          {lineSpacer}

          {/* Got */}
          <TokenInfoRow
            chainId={gotToken.chainId}
            client={client}
            label="Got"
            tokenAddress={gotToken.address}
            tokenAmount={gotToken.amount}
            tokenSymbol={gotToken.symbol || ""}
          />
        </>
      ) : (
        // Receive
        <TokenInfoRow
          chainId={toToken.chainId}
          client={client}
          label="Received"
          tokenAddress={toToken.address}
          tokenAmount={toToken.amount}
          tokenSymbol={toToken.symbol || ""}
        />
      )}

      {lineSpacer}
      <Container
        flex="row"
        style={{
          justifyContent: "space-between",
        }}
      >
        <Text size="sm">Recipient</Text>
        <WalletRow address={uiData.toAddress} client={client} iconSize="sm" />
      </Container>

      {/* Status */}
      {statusMeta && showStatusRow && (
        <>
          {lineSpacer}
          <Container
            flex="row"
            style={{
              justifyContent: "space-between",
            }}
          >
            <Text size="sm">Status</Text>
            <Container
              center="y"
              flex="column"
              gap="3xs"
              style={{
                alignItems: "flex-end",
              }}
            >
              <Text color={statusMeta.color} size="sm">
                {statusMeta.status}
              </Text>
            </Container>
          </Container>
        </>
      )}

      <Spacer y="lg" />

      {/* source chain Tx hash link */}
      {fromChainExplorers.explorers?.[0]?.url && sourceTxHash && (
        <ButtonLink
          fullWidth
          gap="xs"
          href={formatExplorerTxUrl(
            fromChainExplorers.explorers[0]?.url,
            sourceTxHash,
          )}
          style={{
            fontSize: fontSize.sm,
            padding: spacing.sm,
          }}
          target="_blank"
          variant="outline"
        >
          View on {fromChainName.name} Explorer
          <ExternalLinkIcon height={iconSize.sm} width={iconSize.sm} />
        </ButtonLink>
      )}

      {/* destination chain tx hash link */}
      {destinationTxHash &&
        sourceTxHash !== destinationTxHash &&
        toChainExplorers?.explorers?.[0]?.url && (
          <>
            <Spacer y="sm" />
            <ButtonLink
              fullWidth
              gap="xs"
              href={formatExplorerTxUrl(
                toChainExplorers.explorers[0]?.url,
                destinationTxHash,
              )}
              style={{
                fontSize: fontSize.sm,
                padding: spacing.sm,
              }}
              target="_blank"
              variant="outline"
            >
              View on {toChainName.name} Explorer
              <ExternalLinkIcon height={iconSize.sm} width={iconSize.sm} />
            </ButtonLink>
          </>
        )}
    </div>
  );
}
