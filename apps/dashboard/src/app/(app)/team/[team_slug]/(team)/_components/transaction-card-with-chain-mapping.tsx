import { defineChain } from "thirdweb";
import { type ChainMetadata, getChainMetadata } from "thirdweb/chains";
import type { TransactionStats } from "@/types/analytics";
import { TransactionsChartCardUI } from "./TransactionsCard";

export async function TransactionsChartCardWithChainMapping(props: {
  data: TransactionStats[];
  className?: string;
  onlyMainnet?: boolean;
  title?: string;
  selectedChartQueryParam: string;
  selectedChart: string | undefined;
  description?: string;
  aggregatedData: TransactionStats[];
}) {
  const uniqueChainIds = [
    ...new Set(props.data.map((item) => item.chainId).filter(Boolean)),
  ];
  const chains = await Promise.all(
    uniqueChainIds.map((chainId) =>
      // eslint-disable-next-line no-restricted-syntax
      getChainMetadata(defineChain(Number(chainId))).catch(() => undefined),
    ),
  ).then((chains) => chains.filter((c) => c) as ChainMetadata[]);

  const processedAggregatedData = {
    mainnet: props.aggregatedData
      .filter(
        (d) => !chains.find((c) => c.chainId === Number(d.chainId))?.testnet,
      )
      .reduce((acc, curr) => acc + curr.count, 0),
    testnet: props.aggregatedData
      .filter(
        (d) => chains.find((c) => c.chainId === Number(d.chainId))?.testnet,
      )
      .reduce((acc, curr) => acc + curr.count, 0),
    total: props.aggregatedData.reduce((acc, curr) => acc + curr.count, 0),
  };

  return (
    <TransactionsChartCardUI
      className={props.className}
      data={props.data}
      onlyMainnet={props.onlyMainnet}
      processedAggregatedData={processedAggregatedData}
      selectedChart={props.selectedChart}
      selectedChartQueryParam={props.selectedChartQueryParam}
      chains={chains}
    />
  );
}
