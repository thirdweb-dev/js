import { ChakraProviderSetup } from "@/components/ChakraProviderSetup";
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
      <Breadcrumb className="py-4 px-6 border-b border-border">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Explore</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="container py-8 flex flex-col gap-4">
        <h1 className="mb-3 text-3xl lg:text-5xl font-bold tracking-tighter">
          Explore
        </h1>
        <p className="text-base lg:text-lg text-muted-foreground max-w-screen-md">
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
        {/* TODO: remove this once we update the deploy upsell card */}
        <ChakraProviderSetup>
          <DeployUpsellCard />
        </ChakraProviderSetup>
      </div>
    </div>
  );
}
