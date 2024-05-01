import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { defineChain } from "../../../../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import type { BuyWithCryptoStatus } from "../../../../../../../exports/pay.js";
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
  status: BuyWithCryptoStatus;
  onBack: () => void;
  client: ThirdwebClient;
}) {
  const { status, client } = props;

  const fromChainId = status.quote.fromToken.chainId;
  const toChainId = status.quote.toToken.chainId;

  const fromChainQuery = useChainQuery(defineChain(fromChainId));
  const toChainQuery = useChainQuery(defineChain(toChainId));

  const sourceTxHash = status.source.transactionHash;
  const destinationTxHash = status.destination?.transactionHash;

  const statusMeta = getBuyWithCryptoStatusMeta(props.status);

  const lineSpacer = (
    <>
      <Spacer y="md" />
      <Line />
      <Spacer y="md" />
    </>
  );

  return (
    <Container>
      <Container p="lg">
        <ModalHeader title="Transaction Details" onBack={props.onBack} />
      </Container>

      <Line />

      <Container p="lg">
        {/* Receive - to token */}
        <TokenInfoRow
          chainId={toChainId}
          client={client}
          label="Receive"
          tokenAmount={status.quote.toAmount}
          tokenSymbol={status.quote.toToken.symbol || ""}
          tokenAddress={status.quote.toToken.tokenAddress}
        />

        {lineSpacer}

        {/* Pay - from token */}
        <TokenInfoRow
          chainId={fromChainId}
          client={client}
          label="Pay"
          tokenAmount={status.quote.fromAmount}
          tokenSymbol={status.quote.fromToken.symbol || ""}
          tokenAddress={status.quote.fromToken.tokenAddress}
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
              ~{formatSeconds(status.quote.estimated.durationSeconds || 0)}
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
      </Container>
    </Container>
  );
}
