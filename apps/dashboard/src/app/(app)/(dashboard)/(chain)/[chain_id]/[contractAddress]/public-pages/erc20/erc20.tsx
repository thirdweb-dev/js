import type { ThirdwebContract } from "thirdweb";
import {} from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import { getContractMetadata } from "thirdweb/extensions/common";
import { decimals, getActiveClaimCondition } from "thirdweb/extensions/erc20";
import { PageHeader } from "../_components/PageHeader";
import { ContractHeaderUI } from "./_components/ContractHeader";
import { BuyTokenEmbed } from "./_components/PayEmbedSection";
import { TokenStats } from "./_components/PriceChart";
import { RecentTransfers } from "./_components/RecentTransfers";
import { TokenDropClaim } from "./_components/claim-tokens/claim-tokens-ui";
import { ContractAnalyticsOverview } from "./_components/contract-analytics/contract-analytics";
import { getCurrencyMeta } from "./_utils/getCurrencyMeta";

export async function ERC20PublicPage(props: {
  serverContract: ThirdwebContract;
  clientContract: ThirdwebContract;
  chainMetadata: ChainMetadata;
}) {
  const [contractMetadata, activeClaimCondition, tokenDecimals] =
    await Promise.all([
      getContractMetadata({
        contract: props.serverContract,
      }),
      getActiveClaimConditionWithErrorHandler(props.serverContract),
      decimals({
        contract: props.serverContract,
      }),
    ]);

  const claimConditionCurrencyMeta = activeClaimCondition
    ? await getCurrencyMeta({
        currencyAddress: activeClaimCondition.currency,
        chainMetadata: props.chainMetadata,
        chain: props.serverContract.chain,
        client: props.serverContract.client,
      }).catch(() => undefined)
    : undefined;

  const buyEmbed = (
    <BuyEmbed
      clientContract={props.clientContract}
      chainMetadata={props.chainMetadata}
      tokenDecimals={tokenDecimals}
      tokenName={contractMetadata.name}
      tokenSymbol={contractMetadata.symbol}
      tokenAddress={props.clientContract.address}
      claimConditionMeta={
        activeClaimCondition && claimConditionCurrencyMeta
          ? {
              activeClaimCondition,
              claimConditionCurrency: claimConditionCurrencyMeta,
            }
          : undefined
      }
    />
  );

  return (
    <div className="flex grow flex-col">
      <PageHeader />
      <div className="container flex max-w-8xl grow flex-col">
        <ContractHeaderUI
          chainMetadata={props.chainMetadata}
          clientContract={props.clientContract}
          image={contractMetadata.image}
          name={contractMetadata.name}
          symbol={contractMetadata.symbol}
          socialUrls={
            typeof contractMetadata.social_urls === "object" &&
            contractMetadata.social_urls !== null
              ? contractMetadata.social_urls
              : {}
          }
        />

        <div className="h-6" />

        <div className="flex flex-col gap-8 pb-20 xl:flex-row">
          <div className="flex grow flex-col gap-8 overflow-hidden">
            {activeClaimCondition ? (
              <div className="border-b border-dashed pb-6">
                <ContractAnalyticsOverview
                  contractAddress={props.clientContract.address}
                  chainId={props.chainMetadata.chainId}
                  chainSlug={props.chainMetadata.slug}
                />
              </div>
            ) : (
              <TokenStats
                chainId={props.chainMetadata.chainId}
                contractAddress={props.clientContract.address}
              />
            )}

            <div className="xl:hidden">{buyEmbed}</div>

            <RecentTransfers
              clientContract={props.clientContract}
              tokenSymbol={contractMetadata.symbol}
              chainMetadata={props.chainMetadata}
              decimals={tokenDecimals}
            />

            {!activeClaimCondition && (
              <ContractAnalyticsOverview
                contractAddress={props.clientContract.address}
                chainId={props.chainMetadata.chainId}
                chainSlug={props.chainMetadata.slug}
              />
            )}
          </div>
          <div className="hidden xl:block xl:w-96">
            <div className="-mt-6 sticky top-0 pt-6">{buyEmbed}</div>
          </div>
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
        client={props.clientContract.client}
        chain={props.clientContract.chain}
        tokenSymbol={props.tokenSymbol}
        tokenName={props.tokenName}
        tokenAddress={props.clientContract.address}
      />
    );
  }

  return (
    <TokenDropClaim
      contract={props.clientContract}
      decimals={props.tokenDecimals}
      name={props.tokenName}
      symbol={props.tokenSymbol}
      chainMetadata={props.chainMetadata}
      claimCondition={props.claimConditionMeta.activeClaimCondition}
      claimConditionCurrency={props.claimConditionMeta.claimConditionCurrency}
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
