import type { Metadata } from "next";
import { Fragment } from "react";
import { ContractRow } from "./components/contract-row";
import { DeployUpsellCard } from "./components/upsells/deploy-your-own";
import { PublishUpsellCard } from "./components/upsells/publish-submit";
import { EXPLORE_PAGE_DATA } from "./data";
import { TokensSection } from "./tokens-section";

const title = "List of smart contracts for EVM Developers";
const description =
  "A list of Ethereum smart contract templates for web3 developers, including the most popular evm smart contracts for dapps, NFTs and more.";

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
      <div className="border-b py-10">
        <div className="container max-w-7xl">
          <h1 className="mb-2 font-bold text-4xl lg:text-5xl tracking-tight">
            Explore
          </h1>
          <p className="max-w-screen-sm text-sm lg:text-base text-muted-foreground">
            The best place for web3 developers to explore smart contracts from
            world-class web3 protocols & engineers — all deployable with one
            click.
          </p>
        </div>
      </div>

      <div className="container max-w-7xl pt-8 pb-4">
        <TokensSection />
      </div>

      <div className="container max-w-7xl flex flex-col gap-8 py-10">
        <div className="flex flex-col gap-14">
          {EXPLORE_PAGE_DATA.map((category, idx) => (
            <Fragment key={category.id}>
              {Math.floor(EXPLORE_PAGE_DATA.length / 2) === idx && (
                <PublishUpsellCard />
              )}
              <ContractRow category={category} />
            </Fragment>
          ))}
        </div>

        <DeployUpsellCard />
      </div>
    </div>
  );
}
