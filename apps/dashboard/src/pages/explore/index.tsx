import { QueryClient, dehydrate } from "@tanstack/react-query";
import { AppLayout } from "components/app-layouts/app";
import { ContractRow } from "components/explore/contract-row";
import { DeployUpsellCard } from "components/explore/upsells/deploy-your-own";
import { PublishUpsellCard } from "components/explore/upsells/publish-submit";
import { PublisherSDKContext } from "contexts/custom-sdk-context";
import { ContractsSidebar } from "core-ui/sidebar/contracts";
import {
  EXPLORE_PAGE_DATA,
  type ExploreCategory,
  prefetchCategory,
} from "data/explore";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { NextSeo } from "next-seo";
import { PageId } from "page-id";
import { Fragment } from "react";
import type { ThirdwebNextPage } from "utils/types";

const ExplorePage: ThirdwebNextPage = (
  props: InferGetStaticPropsType<typeof getStaticProps>,
) => {
  return (
    <>
      <NextSeo
        title="Explore | Smart Contracts"
        description="Browse a large collection of ready-to-deploy contracts that have been built by thirdweb and other contract developers. Find a contract for your specific app's or game's needs."
        openGraph={{
          title: "thirdweb Explore: Smart Contracts & Protocols",
          description:
            "Browse a large collection of ready-to-deploy contracts that have been built by thirdweb and other contract developers. Find a contract for your specific app's or game's needs.",
          images: [
            {
              url: "https://thirdweb.com/thirdweb-explore.png",
              width: 1200,
              height: 630,
              alt: "thirdweb Explore",
            },
          ],
        }}
      />

      <div>
        <h1 className="mb-3 text-5xl font-bold tracking-tighter">Explore</h1>
        <p className="text-lg text-secondary-foreground max-w-screen-md">
          The best place for web3 developers to explore smart contracts from
          world-class web3 protocols & engineers — all deployable with one
          click.
        </p>

        <div className="h-10" />

        <div className="flex flex-col gap-14">
          {props.categories.map((category, idx) => (
            <Fragment key={category.id}>
              {Math.floor(props.categories.length / 2) === idx && (
                <PublishUpsellCard />
              )}
              <ContractRow category={category} />
            </Fragment>
          ))}
        </div>

        <div className="h-16" />
        <DeployUpsellCard />
      </div>
    </>
  );
};

// const AppLayout = dynamic(
//   async () => (await import("components/app-layouts/app")).AppLayout,
// );

ExplorePage.getLayout = (page, props) => (
  <AppLayout {...props} noSEOOverride hasSidebar>
    <ContractsSidebar activePage="explore" />
    <PublisherSDKContext>{page}</PublisherSDKContext>
  </AppLayout>
);

ExplorePage.pageId = PageId.Explore;

export default ExplorePage;

interface ExplorePageProps {
  categories: ExploreCategory[];
}

export const getStaticProps: GetStaticProps<ExplorePageProps> = async () => {
  const categories = EXPLORE_PAGE_DATA;

  // pre load the data as well
  const queryClient = new QueryClient();
  await Promise.all(categories.map((c) => prefetchCategory(c, queryClient)));

  return {
    props: { categories, dehydratedState: dehydrate(queryClient) },
  };
};
