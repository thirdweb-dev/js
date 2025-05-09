import { ContractRow } from "components/explore/contract-row";
import { DeployUpsellCard } from "components/explore/upsells/deploy-your-own";
import { PublishUpsellCard } from "components/explore/upsells/publish-submit";
import { EXPLORE_PAGE_DATA } from "data/explore";
import type { Metadata } from "next";
import { Fragment } from "react";

const title = "List of smart contracts for EVM Developers";
const description =
  "A list of Ethereum smart contract templates for web3 developers, including the most popular evm smart contracts for dapps, NFTs and more.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
};

export default async function ExplorePage() {
  return (
    <div className="flex flex-col">
      <div className="container flex flex-col gap-4 py-8">
        <h1 className="mb-3 font-bold text-3xl tracking-tighter lg:text-5xl">
          Explore
        </h1>
        <p className="max-w-screen-md text-base text-muted-foreground lg:text-lg">
          The best place for web3 developers to explore smart contracts from
          world-class web3 protocols & engineers — all deployable with one
          click.
        </p>
        <div className="h-10" />
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

        <div className="h-16" />
        <DeployUpsellCard />
      </div>
    </div>
  );
}
