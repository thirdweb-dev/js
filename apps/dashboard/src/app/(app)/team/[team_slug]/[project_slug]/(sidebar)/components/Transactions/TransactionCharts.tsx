import { defineChain, getContract, type ThirdwebClient } from "thirdweb";
import { getChainMetadata } from "thirdweb/chains";
import { fetchDashboardContractMetadata } from "@/hooks/useDashboardContractMetadata";
import type { TransactionStats } from "@/types/analytics";
import { PieChartCard } from "../../../../../components/Analytics/PieChartCard";
import { TransactionsChartCardWithChainMapping } from "../../../../(team)/_components/transaction-card-with-chain-mapping";

export function TransactionsChartsUI(props: {
  data: TransactionStats[];
  aggregatedData: TransactionStats[];
  selectedChartQueryParam: string;
  client: ThirdwebClient;
  selectedChart: string | undefined;
}) {
  return (
    <>
      <TransactionsChartCardWithChainMapping
        aggregatedData={props.aggregatedData}
        data={props.data}
        selectedChartQueryParam={props.selectedChartQueryParam}
        selectedChart={props.selectedChart}
      />
      <div className="grid gap-6 md:grid-cols-2">
        <ChainDistributionCard data={props.aggregatedData} />
        <ContractDistributionCard
          client={props.client}
          data={props.aggregatedData}
        />
      </div>
    </>
  );
}

async function ChainDistributionCard({ data }: { data: TransactionStats[] }) {
  const reducedData = await Promise.all(
    Object.entries(
      data.reduce(
        (acc, curr) => {
          acc[curr.chainId] = (acc[curr.chainId] || 0) + curr.count;
          return acc;
        },
        {} as Record<string, number>,
      ),
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10) // only top ten
      .map(async ([key, value]) => {
        // eslint-disable-next-line no-restricted-syntax
        const chain = defineChain(Number(key));
        const chainMeta = await getChainMetadata(chain).catch(() => undefined);
        return {
          label: chainMeta?.slug || chain.id.toString(),
          link: `/${chain.id}`,
          value,
        };
      }),
  );

  const aggregateFn = () => new Set(data.map((d) => `${d.chainId}`)).size;

  return (
    <PieChartCard aggregateFn={aggregateFn} data={reducedData} title="Chains" />
  );
}

async function ContractDistributionCard({
  data,
  client,
}: {
  data: TransactionStats[];
  client: ThirdwebClient;
}) {
  const _reducedData = await Promise.all(
    Object.entries(
      data
        .filter((d) => d.contractAddress)
        .reduce(
          (acc, curr) => {
            acc[`${curr.chainId}:${curr.contractAddress}`] =
              (acc[`${curr.chainId}:${curr.contractAddress}`] || 0) +
              curr.count;
            return acc;
          },
          {} as Record<string, number>,
        ),
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10) // only top ten
      .map(async ([key, value]) => {
        try {
          const [chainId, contractAddress] = key.split(":");
          if (Number(chainId) === 0) {
            return undefined;
          }
          // eslint-disable-next-line no-restricted-syntax
          const chain = defineChain(Number(chainId));
          const chainMeta = await getChainMetadata(chain).catch(
            () => undefined,
          );
          const contractData = await fetchDashboardContractMetadata(
            getContract({
              address: contractAddress as string,
              chain, // we filter above
              client,
            }),
          ).catch(() => undefined);
          return {
            label: `${contractData?.name} (${chainMeta?.slug || chainId})`,
            link: `/${chainId}/${contractAddress}`,
            value,
          };
        } catch {
          return undefined;
        }
      }),
  );

  const reducedData = _reducedData.filter((d) => !!d);

  const aggregateFn = () =>
    new Set(
      data
        .filter((d) => d.contractAddress)
        .map((d) => `${d.chainId}:${d.contractAddress}`),
    ).size;

  return (
    <PieChartCard
      aggregateFn={aggregateFn}
      data={reducedData}
      title="Contracts"
    />
  );
}
