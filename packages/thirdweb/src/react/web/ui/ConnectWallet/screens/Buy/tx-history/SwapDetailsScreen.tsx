import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { defineChain } from "../../../../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import type { ValidBuyWithCryptoStatus } from "../../../../../../../pay/buyWithCrypto/getStatus.js";
import { useChainQuery } from "../../../../../../core/hooks/others/useChainQuery.js";
import { Spacer } from "../../../../components/Spacer.js";
import { Container, Line, ModalHeader } from "../../../../components/basic.js";
import { ButtonLink } from "../../../../components/buttons.js";
import { Text } from "../../../../components/text.js";
import { fontSize, iconSize } from "../../../../design-system/index.js";
import { formatSeconds } from "../swap/formatSeconds.js";
import { TokenInfoRow } from "./TokenInfoRow.js";
import { getBuyWithCryptoStatusMeta } from "./statusMeta.js";

export function SwapDetailsScreen(props: {
  status: ValidBuyWithCryptoStatus;
  onBack: () => void;
  client: ThirdwebClient;
}) {
  const { status, client } = props;

  return (
    <Container>
      <Container p="lg">
        <ModalHeader title="Transaction Details" onBack={props.onBack} />
      </Container>

      <Line />

      <Container p="lg">
        <SwapTxDetailsTable swapStatus={status} client={client} />
      </Container>
    </Container>
  );
}

export function SwapTxDetailsTable(props: {
  swapStatus: ValidBuyWithCryptoStatus;
  client: ThirdwebClient;
}) {
  const { swapStatus, client } = props;

  const statusMeta = getBuyWithCryptoStatusMeta(swapStatus);

  const fromChainId = swapStatus.quote.fromToken.chainId;
  const toChainId = swapStatus.quote.toToken.chainId;

  const fromChainQuery = useChainQuery(defineChain(fromChainId));
  const toChainQuery = useChainQuery(defineChain(toChainId));

  const sourceTxHash = swapStatus.source?.transactionHash;
  const destinationTxHash = swapStatus.destination?.transactionHash;

  const lineSpacer = (
    <>
      <Spacer y="md" />
      <Line />
      <Spacer y="md" />
    </>
  );

  return (
    <div>
      {/* Receive - to token */}
      <TokenInfoRow
        chainId={swapStatus.quote.toToken.chainId}
        client={client}
        label="Receive"
        tokenAmount={swapStatus.quote.toAmount}
        tokenSymbol={swapStatus.quote.toToken.symbol || ""}
        tokenAddress={swapStatus.quote.toToken.tokenAddress}
      />

      {lineSpacer}

      {/* Pay - from token */}
      <TokenInfoRow
        chainId={swapStatus.quote.fromToken.chainId}
        client={client}
        label="Pay"
        tokenAmount={swapStatus.quote.fromAmount}
        tokenSymbol={swapStatus.quote.fromToken.symbol || ""}
        tokenAddress={swapStatus.quote.fromToken.tokenAddress}
      />

      {lineSpacer}

      {/* Duration */}
      <Container
        flex="row"
        center="y"
        style={{
          justifyContent: "space-between",
        }}
      >
        <Text> Time </Text>
        <Container flex="row" gap="xs" center="y">
          <Text color="primaryText">
            ~{formatSeconds(swapStatus.quote.estimated.durationSeconds || 0)}
          </Text>
        </Container>
      </Container>

      {lineSpacer}

      {/* Status */}
      <Container
        flex="row"
        center="y"
        style={{
          justifyContent: "space-between",
        }}
      >
        <Text>Status</Text>
        <Container flex="row" gap="xs" center="y">
          <Text color={statusMeta.color}>{statusMeta.status}</Text>
        </Container>
      </Container>

      {lineSpacer}

      <Spacer y="xl" />

      {fromChainQuery.data?.explorers?.[0]?.url && (
        <ButtonLink
          fullWidth
          variant="outline"
          href={`${fromChainQuery.data.explorers[0].url}/tx/${sourceTxHash}`}
          target="_blank"
          gap="xs"
          style={{
            fontSize: fontSize.sm,
          }}
        >
          View on {fromChainQuery.data.name} Explorer
          <ExternalLinkIcon width={iconSize.sm} height={iconSize.sm} />
        </ButtonLink>
      )}

      {destinationTxHash &&
        sourceTxHash !== destinationTxHash &&
        toChainQuery.data?.explorers?.[0]?.url && (
          <>
            <Spacer y="sm" />
            <ButtonLink
              fullWidth
              variant="outline"
              href={`${toChainQuery.data.explorers[0].url}/tx/${destinationTxHash}`}
              target="_blank"
              gap="xs"
              style={{
                fontSize: fontSize.sm,
              }}
            >
              View on {toChainQuery.data.name} Explorer
              <ExternalLinkIcon width={iconSize.sm} height={iconSize.sm} />
            </ButtonLink>
          </>
        )}
    </div>
  );
}
