import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { ContractRow } from "components/explore/contract-row";
import { DeployUpsellCard } from "components/explore/upsells/deploy-your-own";
import { PublishUpsellCard } from "components/explore/upsells/publish-submit";
import { EXPLORE_PAGE_DATA } from "data/explore";
import type { Metadata } from "next";
import { Fragment } from "react";

export const metadata: Metadata = {
  title: "Explore | Smart Contracts",
  description:
    "Browse a large collection of ready-to-deploy contracts that have been built by thirdweb and other contract developers. Find a contract for your specific app's or game's needs.",
  openGraph: {
    title: "thirdweb Explore: Smart Contracts & Protocols",
  },
};

export default async function ExplorePage() {
  return (
    <div className="flex flex-col">
      <Breadcrumb className="border-border border-b px-6 py-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Explore</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
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
