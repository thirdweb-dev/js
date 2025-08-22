import { cookies } from "next/headers";
import type { ThirdwebContract } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import { getContractMetadata } from "thirdweb/extensions/common";
import { decimals, getActiveClaimCondition } from "thirdweb/extensions/erc20";
import { GridPattern } from "@/components/ui/background-patterns";
import { HAS_USED_DASHBOARD } from "@/constants/cookie";
import { resolveFunctionSelectors } from "@/lib/selectors";
import { AssetPageView } from "../_components/asset-page-view";
import { getContractCreator } from "../_components/getContractCreator";
import { PageHeader } from "../_components/PageHeader";
import { getTokenPriceData } from "./_apis/token-price-data";
import { ContractHeaderUI } from "./_components/ContractHeader";
import { TokenDropClaim } from "./_components/claim-tokens/claim-tokens-ui";
import { ContractAnalyticsOverview } from "./_components/contract-analytics/contract-analytics";
import { BuyTokenEmbed } from "./_components/PayEmbedSection";
import { TokenStats } from "./_components/PriceChart";
import { RecentTransfers } from "./_components/RecentTransfers";
import { fetchTokenInfoFromBridge } from "./_utils/fetch-coin-info";
import { getCurrencyMeta } from "./_utils/getCurrencyMeta";

export async function ERC20PublicPage(props: {
  serverContract: ThirdwebContract;
  clientContract: ThirdwebContract;
  chainMetadata: ChainMetadata;
}) {
  const [
    contractMetadata,
    activeClaimCondition,
    tokenDecimals,
    tokenInfo,
    functionSelectors,
    tokenPriceData,
  ] = await Promise.all([
    getContractMetadata({
      contract: props.serverContract,
    }),
    getActiveClaimConditionWithErrorHandler(props.serverContract),
    decimals({
      contract: props.serverContract,
    }),
    fetchTokenInfoFromBridge({
      chainId: props.serverContract.chain.id,
      clientId: props.clientContract.client.clientId,
      tokenAddress: props.serverContract.address,
    }),
    resolveFunctionSelectors(props.serverContract),
    getTokenPriceData({
      chainId: props.serverContract.chain.id,
      contractAddress: props.serverContract.address,
    }),
  ]);

  if (!contractMetadata.image && tokenInfo) {
    contractMetadata.image = tokenInfo.iconUri;
  }

  const [contractCreator, claimConditionCurrencyMeta] = await Promise.all([
    getContractCreator(props.serverContract, functionSelectors),
    activeClaimCondition
      ? getCurrencyMeta({
          chain: props.serverContract.chain,
          chainMetadata: props.chainMetadata,
          client: props.serverContract.client,
          currencyAddress: activeClaimCondition.currency,
        }).catch(() => undefined)
      : undefined,
  ]);

  const cookieStore = await cookies();
  const isDashboardUser = cookieStore.has(HAS_USED_DASHBOARD);

  const buyEmbed = (
    <BuyEmbed
      chainMetadata={props.chainMetadata}
      claimConditionMeta={
        activeClaimCondition && claimConditionCurrencyMeta
          ? {
              activeClaimCondition,
              claimConditionCurrency: claimConditionCurrencyMeta,
            }
          : undefined
      }
      clientContract={props.clientContract}
      tokenAddress={props.clientContract.address}
      tokenDecimals={tokenDecimals}
      tokenName={contractMetadata.name}
      tokenSymbol={contractMetadata.symbol}
    />
  );

  return (
    <div className="flex grow flex-col">
      <AssetPageView assetType="coin" chainId={props.chainMetadata.chainId} />
      <PageHeader containerClassName="max-w-5xl" />

      <div className="border-b">
        <div className="container max-w-5xl">
          <ContractHeaderUI
            chainMetadata={props.chainMetadata}
            clientContract={props.clientContract}
            contractCreator={contractCreator}
            image={contractMetadata.image}
            isDashboardUser={isDashboardUser}
            name={contractMetadata.name}
            socialUrls={
              typeof contractMetadata.social_urls === "object" &&
              contractMetadata.social_urls !== null
                ? contractMetadata.social_urls
                : {}
            }
            symbol={contractMetadata.symbol}
          />
        </div>
      </div>

      <div className="container flex max-w-5xl grow flex-col pt-8 pb-10">
        <div className="flex grow flex-col gap-8">
          <div className="sm:flex sm:justify-center w-full sm:border sm:border-dashed sm:bg-accent/20 sm:py-12 rounded-lg overflow-hidden relative">
            <GridPattern
              width={30}
              height={30}
              x={-1}
              y={-1}
              strokeDasharray={"4 2"}
              className="text-border dark:text-border/70"
              style={{
                maskImage:
                  "linear-gradient(to bottom right,white,transparent,transparent)",
              }}
            />
            <div className="sm:w-[420px] z-10">{buyEmbed}</div>
          </div>

          {tokenPriceData ? (
            <>
              <TokenStats
                chainId={props.chainMetadata.chainId}
                contractAddress={props.clientContract.address}
                tokenPriceData={tokenPriceData}
              />

              <ContractAnalyticsOverview
                chainId={props.chainMetadata.chainId}
                chainSlug={props.chainMetadata.slug}
                contractAddress={props.clientContract.address}
              />
            </>
          ) : (
            <ContractAnalyticsOverview
              chainId={props.chainMetadata.chainId}
              chainSlug={props.chainMetadata.slug}
              contractAddress={props.clientContract.address}
            />
          )}

          <RecentTransfers
            chainMetadata={props.chainMetadata}
            clientContract={props.clientContract}
            decimals={tokenDecimals}
            tokenSymbol={contractMetadata.symbol}
          />
        </div>
      </div>
    </div>
  );
}

function BuyEmbed(props: {
  clientContract: ThirdwebContract;
  chainMetadata: ChainMetadata;
  tokenDecimals: number;
  tokenName: string;
  tokenSymbol: string;
  tokenAddress: string;
  claimConditionMeta:
    | {
        activeClaimCondition: ActiveClaimCondition;
        claimConditionCurrency: {
          decimals: number;
          symbol: string;
        };
      }
    | undefined;
}) {
  if (!props.claimConditionMeta) {
    return (
      <BuyTokenEmbed
        chain={props.clientContract.chain}
        client={props.clientContract.client}
        tokenAddress={props.clientContract.address}
      />
    );
  }

  return (
    <TokenDropClaim
      chainMetadata={props.chainMetadata}
      claimCondition={props.claimConditionMeta.activeClaimCondition}
      claimConditionCurrency={props.claimConditionMeta.claimConditionCurrency}
      contract={props.clientContract}
      decimals={props.tokenDecimals}
      name={props.tokenName}
      symbol={props.tokenSymbol}
    />
  );
}

async function getActiveClaimConditionWithErrorHandler(
  contract: ThirdwebContract,
) {
  try {
    const activeClaimCondition = await getActiveClaimCondition({ contract });
    return activeClaimCondition;
  } catch {
    return undefined;
  }
}

type ActiveClaimCondition = Awaited<ReturnType<typeof getActiveClaimCondition>>;
