import { Flex, GridItem, SimpleGrid, VStack } from "@chakra-ui/react";
import { useConnectionStatus } from "@thirdweb-dev/react";
import { ClientOnly } from "components/ClientOnly/ClientOnly";
import { FTUX } from "components/FTUX/FTUX";
import { AppLayout } from "components/app-layouts/app";
import { Changelog, ChangelogItem } from "components/dashboard/Changelog";
import { HomeProductCard } from "components/dashboard/HomeProductCard";
import { OnboardingSteps } from "components/onboarding/Steps";
import { PRODUCTS } from "components/product-pages/common/nav/data";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { PageId } from "page-id";
import { Heading } from "tw-components";
import { ThirdwebNextPage } from "utils/types";

const TRACKING_CATEGORY = "dashboard";

const Dashboard: ThirdwebNextPage = (
  props: InferGetStaticPropsType<typeof getStaticProps>,
) => {
  const connectionStatus = useConnectionStatus();

  const showFTUX =
    connectionStatus !== "connected" && connectionStatus !== "connecting";
  const isLoading = connectionStatus === "unknown";

  return (
    <Flex flexDir="column" gap={4}>
      {/* Any announcements: <AnnouncementCard /> */}
      <SimpleGrid columns={{ base: 1, lg: 4 }} gap={16}>
        <GridItem colSpan={{ lg: 3 }}>
          <Heading mb={10}>Get started quickly</Heading>
          {!isLoading && (
            <ClientOnly fadeInDuration={600} ssr={null}>
              {showFTUX ? (
                <FTUX />
              ) : (
                <VStack gap={10}>
                  <OnboardingSteps />
                  <Flex flexDir="column" gap={10}>
                    {["wallets", "contracts", "infrastructure", "payments"].map(
                      (section) => {
                        const products = PRODUCTS.filter(
                          (p) => p.section === section && !!p.dashboardLink,
                        );

                        return (
                          <Flex key={section} gap={4} flexDir="column">
                            <Heading
                              size="title.sm"
                              textTransform="capitalize"
                              color="faded"
                            >
                              {section}
                            </Heading>
                            <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                              {products.map((product) => (
                                <HomeProductCard
                                  key={product.name}
                                  product={product}
                                  TRACKING_CATEGORY={TRACKING_CATEGORY}
                                />
                              ))}
                            </SimpleGrid>
                          </Flex>
                        );
                      },
                    )}
                  </Flex>
                </VStack>
              )}
            </ClientOnly>
          )}
        </GridItem>
        <GridItem as={Flex} direction="column" gap={6}>
          <Heading size="title.sm">Latest changes</Heading>
          <Changelog changelog={props.changelog} />
        </GridItem>
      </SimpleGrid>
    </Flex>
  );
};

Dashboard.getLayout = (page, props) => <AppLayout {...props}>{page}</AppLayout>;
Dashboard.pageId = PageId.Dashboard;

// server-side
type DashboardProps = {
  changelog: ChangelogItem[];
};

export const getStaticProps: GetStaticProps<DashboardProps> = async () => {
  const res = await fetch(
    "https://thirdweb.ghost.io/ghost/api/content/posts/?key=49c62b5137df1c17ab6b9e46e3&fields=title,url,published_at&filter=tag:changelog&visibility:public&limit=5",
  );
  const json = await res.json();

  return {
    props: { changelog: json.posts },
    // revalidate once an hour
    revalidate: 3600,
  };
};

export default Dashboard;
