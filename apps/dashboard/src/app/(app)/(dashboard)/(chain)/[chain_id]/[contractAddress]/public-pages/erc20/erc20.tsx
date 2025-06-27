import type { ThirdwebContract } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import { getContractMetadata } from "thirdweb/extensions/common";
import { decimals, getActiveClaimCondition } from "thirdweb/extensions/erc20";
import { resolveFunctionSelectors } from "@/lib/selectors";
import { getContractCreator } from "../_components/getContractCreator";
import { PageHeader } from "../_components/PageHeader";
import { ContractHeaderUI } from "./_components/ContractHeader";
import { TokenDropClaim } from "./_components/claim-tokens/claim-tokens-ui";
import { ContractAnalyticsOverview } from "./_components/contract-analytics/contract-analytics";
import { BuyTokenEmbed } from "./_components/PayEmbedSection";
import { TokenStats } from "./_components/PriceChart";
import { RecentTransfers } from "./_components/RecentTransfers";
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
    functionSelectors,
  ] = await Promise.all([
    getContractMetadata({
      contract: props.serverContract,
    }),
    getActiveClaimConditionWithErrorHandler(props.serverContract),
    decimals({
      contract: props.serverContract,
    }),
    resolveFunctionSelectors(props.serverContract),
  ]);

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
      <PageHeader />
      <div className="container flex max-w-8xl grow flex-col">
        <ContractHeaderUI
          chainMetadata={props.chainMetadata}
          clientContract={props.clientContract}
          contractCreator={contractCreator}
          image={contractMetadata.image}
          name={contractMetadata.name}
          socialUrls={
            typeof contractMetadata.social_urls === "object" &&
            contractMetadata.social_urls !== null
              ? contractMetadata.social_urls
              : {}
          }
          symbol={contractMetadata.symbol}
        />

        <div className="h-6" />

        <div className="flex flex-col gap-8 pb-20 xl:flex-row">
          <div className="flex grow flex-col gap-8 overflow-hidden">
            {activeClaimCondition ? (
              <div className="border-b border-dashed pb-6">
                <ContractAnalyticsOverview
                  chainId={props.chainMetadata.chainId}
                  chainSlug={props.chainMetadata.slug}
                  contractAddress={props.clientContract.address}
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
              chainMetadata={props.chainMetadata}
              clientContract={props.clientContract}
              decimals={tokenDecimals}
              tokenSymbol={contractMetadata.symbol}
            />

            {!activeClaimCondition && (
              <ContractAnalyticsOverview
                chainId={props.chainMetadata.chainId}
                chainSlug={props.chainMetadata.slug}
                contractAddress={props.clientContract.address}
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
