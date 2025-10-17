import { BarChart3Icon, DollarSignIcon, TrendingUpIcon } from "lucide-react";
import { cookies } from "next/headers";
import type { ThirdwebContract } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import { getContractMetadata } from "thirdweb/extensions/common";
import { decimals, getActiveClaimCondition } from "thirdweb/extensions/erc20";
import { BuyAndSwapEmbed } from "@/components/blocks/BuyAndSwapEmbed";
import { GridPatternEmbedContainer } from "@/components/blocks/grid-pattern-embed-container";
import { HAS_USED_DASHBOARD } from "@/constants/cookie";
import { resolveFunctionSelectors } from "@/lib/selectors";
import { AssetPageView } from "../_components/asset-page-view";
import { getContractCreator } from "../_components/getContractCreator";
import { PageHeader } from "../_components/PageHeader";
import { ContractHeaderUI } from "./_components/ContractHeader";
import { TokenDropClaim } from "./_components/claim-tokens/claim-tokens-ui";
import { ContractAnalyticsOverview } from "./_components/contract-analytics/contract-analytics";
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
    tokenInfoFromUB,
    functionSelectors,
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
      client: props.serverContract.client,
      tokenAddress: props.serverContract.address,
    }),
    resolveFunctionSelectors(props.serverContract),
  ]);

  if (!contractMetadata.image && tokenInfoFromUB) {
    contractMetadata.image = tokenInfoFromUB.iconUri;
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

  const claimConditionMeta =
    activeClaimCondition && claimConditionCurrencyMeta
      ? {
          activeClaimCondition,
          claimConditionCurrency: claimConditionCurrencyMeta,
        }
      : undefined;
  const isUBSupported = !!tokenInfoFromUB;
  const showBuyEmbed = isUBSupported || claimConditionMeta;

  return (
    <div className="flex grow flex-col">
      <AssetPageView
        assetType="coin"
        chainId={props.chainMetadata.chainId}
        is_testnet={props.chainMetadata.testnet}
      />
      <PageHeader containerClassName="max-w-7xl" />

      <div className="border-b border-dashed">
        <div className="container max-w-7xl">
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

      <div className="h-8" />

      {tokenInfoFromUB && (
        <div className="container max-w-7xl mb-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 p-6 border rounded-xl bg-card relative">
            <TokenInfoSection
              icon={DollarSignIcon}
              label="Price"
              value={
                tokenInfoFromUB.prices.USD
                  ? formatPrice(tokenInfoFromUB.prices.USD)
                  : "N/A"
              }
            />

            <TokenInfoSection
              className="border-t pt-6 lg:border-l lg:border-t-0 border-dashed lg:pl-8 lg:pt-0"
              icon={TrendingUpIcon}
              label="Market Cap"
              value={
                tokenInfoFromUB.marketCapUsd
                  ? formatCompactUSD(tokenInfoFromUB.marketCapUsd)
                  : "N/A"
              }
            />

            <TokenInfoSection
              className="border-t pt-6 lg:border-l lg:border-t-0 border-dashed lg:pl-8 lg:pt-0"
              icon={BarChart3Icon}
              label="Volume (24h)"
              value={
                tokenInfoFromUB.volume24hUsd
                  ? formatCompactUSD(tokenInfoFromUB.volume24hUsd)
                  : "N/A"
              }
            />
          </div>
        </div>
      )}

      {showBuyEmbed && (
        <div className="container max-w-7xl pb-10">
          <GridPatternEmbedContainer>
            <BuyEmbed
              chainMetadata={props.chainMetadata}
              claimConditionMeta={claimConditionMeta}
              clientContract={props.clientContract}
              tokenAddress={props.clientContract.address}
              tokenDecimals={tokenDecimals}
              tokenName={contractMetadata.name}
              tokenSymbol={contractMetadata.symbol}
            />
          </GridPatternEmbedContainer>
        </div>
      )}

      <div className="container flex max-w-7xl grow flex-col pb-10">
        <div className="flex grow flex-col gap-8">
          <ContractAnalyticsOverview
            chainId={props.chainMetadata.chainId}
            chainSlug={props.chainMetadata.slug}
            contractAddress={props.clientContract.address}
          />

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
      <BuyAndSwapEmbed
        // chain={props.clientContract.chain}
        swapTab={{
          sellToken: {
            chainId: props.clientContract.chain.id,
            tokenAddress: props.clientContract.address,
          },
          buyToken: undefined,
        }}
        buyTab={{
          buyToken: {
            chainId: props.clientContract.chain.id,
            tokenAddress: props.clientContract.address,
          },
        }}
        pageType="asset"
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

function TokenInfoSection(props: {
  label: string;
  value: string;
  icon: React.FC<{ className?: string }>;
  className?: string;
}) {
  return (
    <div className={props.className}>
      <div className="flex mb-5">
        <div className="border rounded-full bg-background p-2">
          <props.icon className="size-4 text-muted-foreground" />
        </div>
      </div>
      <dl className="space-y-1.5">
        <dt className="text-xs font-medium text-muted-foreground tracking-wider uppercase">
          {props.label}
        </dt>
        <dd className="text-3xl font-bold text-foreground tracking-tight">
          {props.value}
        </dd>
      </dl>
    </div>
  );
}

function formatPrice(value: number): string {
  if (value < 100) {
    return smallValueUSDFormatter.format(value);
  }
  return largeValueUSDFormatter.format(value);
}

const smallValueUSDFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 6,
  roundingMode: "halfEven",
});

const largeValueUSDFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
  roundingMode: "halfEven",
});

const compactValueUSDFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 2,
  roundingMode: "halfEven",
});

function formatCompactUSD(value: number): string {
  return compactValueUSDFormatter.format(value);
}
