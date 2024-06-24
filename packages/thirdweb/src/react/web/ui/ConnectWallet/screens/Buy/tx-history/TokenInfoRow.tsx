import { useMemo } from "react";
import { getCachedChain } from "../../../../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import { formatNumber } from "../../../../../../../utils/formatNumber.js";
import { useChainQuery } from "../../../../../../core/hooks/others/useChainQuery.js";
import { Container } from "../../../../components/basic.js";
import { Text } from "../../../../components/text.js";
import { PayTokenIcon } from "../PayTokenIcon.js";

export function TokenInfoRow(props: {
  tokenSymbol: string;
  tokenAmount: string;
  tokenAddress: string;
  chainId: number;
  label: string;
  client: ThirdwebClient;
}) {
  const chainObj = useMemo(
    () => getCachedChain(props.chainId),
    [props.chainId],
  );
  const chainQuery = useChainQuery(chainObj);

  return (
    <Container
      flex="row"
      style={{
        justifyContent: "space-between",
      }}
    >
      <Text>{props.label}</Text>
      <Container
        flex="column"
        gap="xxs"
        style={{
          alignItems: "flex-end",
        }}
      >
        <Container flex="row" gap="xs" center="y">
          <PayTokenIcon
            chain={chainObj}
            size="sm"
            token={{
              address: props.tokenAddress,
            }}
            client={props.client}
          />
          <Text color="primaryText">
            {formatNumber(Number(props.tokenAmount), 4)} {props.tokenSymbol}
          </Text>
        </Container>

        <Text size="sm">{chainQuery.data?.name}</Text>
      </Container>
    </Container>
  );
}
