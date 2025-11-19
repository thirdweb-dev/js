import type { Metadata } from "next";
import { ContractRow } from "./components/contract-row";
import { CoinCard, NFTCollectionCard } from "./components/token-cards";
import { DeployUpsellCard } from "./components/upsells/deploy-your-own";
import {
  AIRDROP,
  GOVERNANCE,
  MARKETS,
  NFTS,
  SMART_WALLET,
  STAKING,
  STYLUS,
} from "./data";

const title = "List of smart contracts for EVM Developers";
const description =
  "A list of smart contract templates for web3 developers, including the most popular evm smart contracts for dapps, NFTs and more.";

export const metadata: Metadata = {
  description,
  openGraph: {
    description,
    title,
  },
  title,
};

export default async function ExplorePage() {
  return (
    <div className="flex flex-col">
      <div className="border-b py-12">
        <div className="container max-w-7xl">
          <h1 className="mb-2 font-semibold text-4xl lg:text-5xl tracking-tight">
            Explore
          </h1>
          <p className="max-w-screen-sm text-sm lg:text-base text-muted-foreground">
            The best place for web3 developers to explore smart contracts from
            world-class web3 protocols & engineers — all deployable with one
            click.
          </p>
        </div>
      </div>

      <div className="container max-w-7xl flex flex-col py-10">
        <div className="flex flex-col gap-14">
          <PopularSection />
          <ContractRow category={MARKETS} />
          <ContractRow category={NFTS} prefixCard={<NFTCollectionCard />} />
          <ContractRow category={SMART_WALLET} />
          <ContractRow category={AIRDROP} />
          <ContractRow category={STAKING} />
          <ContractRow category={GOVERNANCE} />
          <ContractRow category={STYLUS} />
          <DeployUpsellCard />
        </div>
      </div>
    </div>
  );
}

function PopularSection() {
  return (
    <section>
      <h2 className="font-semibold text-2xl tracking-tight mb-1">Popular</h2>
      <p className="text-muted-foreground mb-4">
        A collection of our most deployed contracts.
      </p>
      <div className="relative z-0 grid grid-cols-1 gap-4 md:grid-cols-3">
        <CoinCard />
        <NFTCollectionCard />
      </div>
    </section>
  );
}
