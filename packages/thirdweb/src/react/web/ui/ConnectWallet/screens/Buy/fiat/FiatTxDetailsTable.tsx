import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { defineChain } from "../../../../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import type { ValidBuyWithFiatStatus } from "../../../../../../../pay/buyWithFiat/getStatus.js";
import { formatNumber } from "../../../../../../../utils/formatNumber.js";
import { useChainQuery } from "../../../../../../core/hooks/others/useChainQuery.js";
import { Spacer } from "../../../../components/Spacer.js";
import { Container, Line } from "../../../../components/basic.js";
import { ButtonLink } from "../../../../components/buttons.js";
import { Text } from "../../../../components/text.js";
import { fontSize, iconSize } from "../../../../design-system/index.js";
import { USDIcon } from "../../../icons/currencies/USDIcon.js";
import { TokenInfoRow } from "../tx-history/TokenInfoRow.js";
import { getBuyWithFiatStatusMeta } from "../tx-history/statusMeta.js";

export function OnRampTxDetailsTable(props: {
  status: ValidBuyWithFiatStatus;
  client: ThirdwebClient;
  hideStatus?: boolean;
}) {
  const status = props.status;
  const statusMeta = getBuyWithFiatStatusMeta(status);

  const onRampChainQuery = useChainQuery(
    defineChain(status.quote.onRampToken.chainId),
  );

  const onrampTxHash = status.source?.transactionHash;

  const lineSpacer = (
    <>
      <Spacer y="md" />
      <Line />
      <Spacer y="md" />
    </>
  );

  return (
    <div>
      {status.destination ? (
        <TokenInfoRow
          chainId={status.destination.token.chainId}
          client={props.client}
          label="Received"
          tokenAmount={status.destination.amount}
          tokenSymbol={status.destination.token.symbol || ""}
          tokenAddress={status.destination.token.tokenAddress}
        />
      ) : (
        <TokenInfoRow
          chainId={status.quote.onRampToken.chainId}
          client={props.client}
          label="Receive"
          tokenAmount={status.quote.estimatedOnRampAmount}
          tokenSymbol={status.quote.onRampToken.symbol || ""}
          tokenAddress={status.quote.onRampToken.tokenAddress}
        />
      )}

      {lineSpacer}

      {/* Pay */}
      <Container
        flex="row"
        style={{
          justifyContent: "space-between",
        }}
      >
        <Text>Pay</Text>
        <Container
          flex="column"
          gap="xxs"
          style={{
            alignItems: "flex-end",
          }}
        >
          <Container flex="row" gap="xs" center="y">
            {status.quote.fromCurrencyWithFees.currencySymbol === "USD" && (
              <USDIcon size={iconSize.sm} />
            )}
            <Text color="primaryText">
              {formatNumber(
                Number(status.quote.fromCurrencyWithFees.amount),
                4,
              )}{" "}
              {status.quote.fromCurrencyWithFees.currencySymbol}
            </Text>
          </Container>
        </Container>
      </Container>

      {!props.hideStatus && (
        <>
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
        </>
      )}

      {lineSpacer}

      {onrampTxHash && onRampChainQuery.data?.explorers?.[0]?.url && (
        <>
          <Spacer y="md" />
          <ButtonLink
            fullWidth
            variant="outline"
            href={`${
              onRampChainQuery.data.explorers[0].url || ""
            }/tx/${onrampTxHash}`}
            target="_blank"
            gap="xs"
            style={{
              fontSize: fontSize.sm,
            }}
          >
            View on Explorer
            <ExternalLinkIcon width={iconSize.sm} height={iconSize.sm} />
          </ButtonLink>
        </>
      )}
    </div>
  );
}
