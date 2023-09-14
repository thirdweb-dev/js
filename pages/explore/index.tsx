import { Flex } from "@chakra-ui/react";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { AppLayout } from "components/app-layouts/app";
import { ContractRow } from "components/explore/contract-row";
import { DeployUpsellCard } from "components/explore/upsells/deploy-your-own";
import { PublishUpsellCard } from "components/explore/upsells/publish-submit";
import { PublisherSDKContext } from "contexts/custom-sdk-context";
import { ContractsSidebar } from "core-ui/sidebar/contracts";
import {
  EXPLORE_PAGE_DATA,
  ExploreCategory,
  prefetchCategory,
} from "data/explore";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { NextSeo } from "next-seo";
// import dynamic from "next/dynamic";
import { PageId } from "page-id";
import React from "react";
import { Heading, Text } from "tw-components";
import { ThirdwebNextPage } from "utils/types";

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

      <Flex direction="column" gap={{ base: 12, md: 16 }}>
        <Flex direction="column" gap={2}>
          <Heading as="h1" size="display.md">
            Explore
          </Heading>
          <Text size="body.xl" maxW="container.md">
            The best place for web3 developers to explore smart contracts from
            world-class web3 protocols & engineers — all deployable with one
            click.
          </Text>
        </Flex>
        {props.categories.map((category, idx) => (
          <React.Fragment key={category.id}>
            {Math.floor(props.categories.length / 2) === idx && (
              <PublishUpsellCard />
            )}
            <ContractRow category={category} />
          </React.Fragment>
        ))}
        <DeployUpsellCard />
      </Flex>
    </>
  );
};

// const AppLayout = dynamic(
//   async () => (await import("components/app-layouts/app")).AppLayout,
// );

ExplorePage.getLayout = (page, props) => (
  <AppLayout {...props} noSEOOverride>
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
