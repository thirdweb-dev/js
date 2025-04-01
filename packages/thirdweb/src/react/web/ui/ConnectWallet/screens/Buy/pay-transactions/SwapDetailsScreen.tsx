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
import { useBuyWithCryptoStatus } from "../../../../../../core/hooks/pay/useBuyWithCryptoStatus.js";
import { Spacer } from "../../../../components/Spacer.js";
import { Container, Line, ModalHeader } from "../../../../components/basic.js";
import { ButtonLink } from "../../../../components/buttons.js";
import { Text } from "../../../../components/text.js";
import { WalletRow } from "../swap/WalletRow.js";
import { TokenInfoRow } from "./TokenInfoRow.js";
import { type StatusMeta, getBuyWithCryptoStatusMeta } from "./statusMeta.js";

export function SwapDetailsScreen(props: {
  status: ValidBuyWithCryptoStatus;
  onBack: () => void;
  client: ThirdwebClient;
}) {
  const { status: initialStatus, client } = props;
  const statusQuery = useBuyWithCryptoStatus(
    initialStatus.source?.transactionHash
      ? {
          client: client,
          transactionHash: initialStatus.source.transactionHash,
          chainId: initialStatus.source.token.chainId,
        }
      : undefined,
  );

  const status: ValidBuyWithCryptoStatus =
    (statusQuery.data?.status !== "NOT_FOUND" ? statusQuery.data : undefined) ||
    initialStatus;

  return (
    <Container>
      <Container p="lg">
        <ModalHeader title="Transaction Details" onBack={props.onBack} />
      </Container>

      <Line />

      <Container p="lg">
        <SwapTxDetailsTable type="status" status={status} client={client} />
      </Container>
    </Container>
  );
}

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
      fromToken: {
        chainId: status.quote.fromToken.chainId,
        symbol: status.quote.fromToken.symbol || "",
        address: status.quote.fromToken.tokenAddress,
        amount: status.quote.fromAmount,
      },
      quotedToToken: {
        chainId: status.quote.toToken.chainId,
        symbol: status.quote.toToken.symbol || "",
        address: status.quote.toToken.tokenAddress,
        amount: status.quote.toAmount,
      },
      gotToken: status.destination
        ? {
            chainId: status.destination.token.chainId,
            symbol: status.destination.token.symbol || "",
            address: status.destination.token.tokenAddress,
            amount: status.destination.amount,
          }
        : undefined,
      statusMeta: getBuyWithCryptoStatusMeta(status),
      estimatedDuration: status.quote.estimated.durationSeconds || 0,
      isPartialSuccess,
      destinationTxHash: status.destination?.transactionHash,
      sourceTxHash: status.source?.transactionHash,
      fromAddress: status.fromAddress,
      toAddress: status.toAddress,
    };
  } else {
    const quote = props.quote;
    uiData = {
      fromToken: {
        chainId: quote.swapDetails.fromToken.chainId,
        symbol: quote.swapDetails.fromToken.symbol || "",
        address: quote.swapDetails.fromToken.tokenAddress,
        amount: quote.swapDetails.fromAmount,
      },
      quotedToToken: {
        chainId: quote.swapDetails.toToken.chainId,
        symbol: quote.swapDetails.toToken.symbol || "",
        address: quote.swapDetails.toToken.tokenAddress,
        amount: quote.swapDetails.toAmount,
      },
      isPartialSuccess: false,
      estimatedDuration: quote.swapDetails.estimated.durationSeconds || 0,
      fromAddress: quote.swapDetails.fromAddress,
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
        tokenAmount={fromToken.amount}
        tokenSymbol={fromToken.symbol || ""}
        tokenAddress={fromToken.address}
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
            tokenAmount={toToken.amount}
            tokenSymbol={toToken.symbol || ""}
            tokenAddress={toToken.address}
          />

          {lineSpacer}

          {/* Got */}
          <TokenInfoRow
            chainId={gotToken.chainId}
            client={client}
            label="Got"
            tokenAmount={gotToken.amount}
            tokenSymbol={gotToken.symbol || ""}
            tokenAddress={gotToken.address}
          />
        </>
      ) : (
        // Receive
        <TokenInfoRow
          chainId={toToken.chainId}
          client={client}
          label="Received"
          tokenAmount={toToken.amount}
          tokenSymbol={toToken.symbol || ""}
          tokenAddress={toToken.address}
        />
      )}

      <>
        {lineSpacer}
        <Container
          flex="row"
          style={{
            justifyContent: "space-between",
          }}
        >
          <Text size="sm">Recipient</Text>
          <WalletRow address={uiData.toAddress} iconSize="sm" client={client} />
        </Container>
      </>

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
              flex="column"
              gap="3xs"
              center="y"
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
          variant="outline"
          href={formatExplorerTxUrl(
            fromChainExplorers.explorers[0]?.url,
            sourceTxHash,
          )}
          target="_blank"
          gap="xs"
          style={{
            fontSize: fontSize.sm,
            padding: spacing.sm,
          }}
        >
          View on {fromChainName.name} Explorer
          <ExternalLinkIcon width={iconSize.sm} height={iconSize.sm} />
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
              variant="outline"
              href={formatExplorerTxUrl(
                toChainExplorers.explorers[0]?.url,
                destinationTxHash,
              )}
              target="_blank"
              gap="xs"
              style={{
                fontSize: fontSize.sm,
                padding: spacing.sm,
              }}
            >
              View on {toChainName.name} Explorer
              <ExternalLinkIcon width={iconSize.sm} height={iconSize.sm} />
            </ButtonLink>
          </>
        )}
    </div>
  );
}
