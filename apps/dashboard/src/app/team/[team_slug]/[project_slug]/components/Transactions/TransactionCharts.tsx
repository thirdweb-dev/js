import { defineChain, getContract } from "thirdweb";
import { getChainMetadata } from "thirdweb/chains";
import { TransactionsChartCardUI } from "../../../(team)/_components/TransactionsCard";
import { getThirdwebClient } from "../../../../../../@/constants/thirdweb.server";
import { fetchDashboardContractMetadata } from "../../../../../../@3rdweb-sdk/react/hooks/useDashboardContractMetadata";
import type { TransactionStats } from "../../../../../../types/analytics";
import { PieChartCard } from "../../../../components/Analytics/PieChartCard";

export function TransactionsChartsUI({
  data,
  aggregatedData,
  searchParams,
}: {
  data: TransactionStats[];
  aggregatedData: TransactionStats[];
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <>
      <TransactionsChartCardUI
        searchParams={searchParams}
        data={data}
        aggregatedData={aggregatedData}
        className="max-md:rounded-none max-md:border-r-0 max-md:border-l-0"
      />
      <div className="grid gap-6 max-md:px-6 md:grid-cols-2">
        <ChainDistributionCard data={aggregatedData} />
        <ContractDistributionCard data={aggregatedData} />
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
          value,
          link: `/${chain.id}`,
        };
      }),
  );

  const aggregateFn = () => new Set(data.map((d) => `${d.chainId}`)).size;

  return (
    <PieChartCard title="Chains" data={reducedData} aggregateFn={aggregateFn} />
  );
}

async function ContractDistributionCard({
  data,
}: { data: TransactionStats[] }) {
  const reducedData = await Promise.all(
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
        const [chainId, contractAddress] = key.split(":");
        // eslint-disable-next-line no-restricted-syntax
        const chain = defineChain(Number(chainId));
        const chainMeta = await getChainMetadata(chain).catch(() => undefined);
        const contractData = await fetchDashboardContractMetadata(
          getContract({
            chain,
            address: contractAddress as string, // we filter above
            client: getThirdwebClient(),
          }),
        ).catch(() => undefined);
        return {
          label: `${contractData?.name} (${chainMeta?.slug || chainId})`,
          link: `/${chainId}/${contractAddress}`,
          value,
        };
      }),
  );

  const aggregateFn = () =>
    new Set(
      data
        .filter((d) => d.contractAddress)
        .map((d) => `${d.chainId}:${d.contractAddress}`),
    ).size;

  return (
    <PieChartCard
      title="Contracts"
      data={reducedData}
      aggregateFn={aggregateFn}
    />
  );
}
