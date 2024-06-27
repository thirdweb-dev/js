import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { getCachedChain } from "../../../../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import { formatNumber } from "../../../../../../../utils/formatNumber.js";
import {
  fontSize,
  iconSize,
} from "../../../../../../core/design-system/index.js";
import { useChainQuery } from "../../../../../../core/hooks/others/useChainQuery.js";
import { Spacer } from "../../../../components/Spacer.js";
import { Container, Line } from "../../../../components/basic.js";
import { ButtonLink } from "../../../../components/buttons.js";
import { Text } from "../../../../components/text.js";
import { TokenInfoRow } from "../tx-history/TokenInfoRow.js";
import type { FiatStatusMeta } from "../tx-history/statusMeta.js";
import { getCurrencyMeta } from "./currencies.js";

/**
 * Show a table with the details of a "OnRamp" transaction step in the "Buy with Fiat" flow.
 * - Show OnRamp token as "Receive"
 * - Show fiat amount as "Pay"
 */
export function OnRampTxDetailsTable(props: {
  client: ThirdwebClient;
  token: {
    chainId: number;
    address: string;
    symbol: string;
    amount: string;
  };
  fiat: {
    currencySymbol: string;
    amount: string;
  };
  statusMeta?: {
    color: FiatStatusMeta["color"];
    text: FiatStatusMeta["status"];
    txHash?: string;
  };
}) {
  const onRampChainQuery = useChainQuery(getCachedChain(props.token.chainId));
  const onrampTxHash = props.statusMeta?.txHash;
  const currencyMeta = getCurrencyMeta(props.fiat.currencySymbol);

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
            <currencyMeta.icon size={iconSize.sm} />
            <Text color="primaryText">
              {formatNumber(Number(props.fiat.amount), 4)}{" "}
              {props.fiat.currencySymbol}
            </Text>
          </Container>
        </Container>
      </Container>

      {lineSpacer}

      {/* Receive */}
      <TokenInfoRow
        chainId={props.token.chainId}
        client={props.client}
        label="Receive"
        tokenAmount={props.token.amount}
        tokenSymbol={props.token.symbol}
        tokenAddress={props.token.address}
      />

      {/* Status */}
      {props.statusMeta && (
        <>
          {lineSpacer}
          <Container
            flex="row"
            center="y"
            style={{
              justifyContent: "space-between",
            }}
          >
            <Text>Status</Text>
            <Container flex="row" gap="xs" center="y">
              <Text color={props.statusMeta.color}>
                {props.statusMeta.text}
              </Text>
            </Container>
          </Container>
        </>
      )}

      {lineSpacer}

      {/* Transaction Hash link */}
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
