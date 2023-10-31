import {
  DarkMode,
  Flex,
  GridItem,
  SimpleGrid,
  VStack,
  useColorMode,
} from "@chakra-ui/react";
import { useConnectionStatus } from "@thirdweb-dev/react";
import { ClientOnly } from "components/ClientOnly/ClientOnly";
import { FTUX } from "components/FTUX/FTUX";
import { AppLayout } from "components/app-layouts/app";
import { Changelog, ChangelogItem } from "components/dashboard/Changelog";
import { NavigationCard } from "components/dashboard/NavigationCard";
import { OnboardingSteps } from "components/onboarding/Steps";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { PageId } from "page-id";
import { Heading } from "tw-components";
import { ThirdwebNextPage } from "utils/types";

const TRACKING_CATEGORY = "dashboard";

const GET_STARTED_SECTIONS = [
  {
    title: "Deploy a contract",
    description:
      "Explore contracts from world-class web3 protocols & engineers- all deployable with 1-click to any chain.",
    image: require("public/assets/dashboard/home-contracts.png"),
    href: "/dashboard/contracts/deploy",
    badge: "Contracts",
    badgeColor: "#6820CB",
  },
  {
    title: "Onboard users",
    description:
      "A complete toolkit for connecting wallets to apps. UI components that work out of the box.",
    image: require("public/assets/dashboard/home-wallets.png"),
    href: "/dashboard/wallets/connect",
    badge: "Wallets",
    badgeColor: "blue.500",
  },
  {
    title: "Create a checkout link",
    description:
      "Create pre-built checkout links or embedded checkouts to sell NFTs.",
    image: require("public/assets/dashboard/home-payments.png"),
    href: "https://withpaper.com/product/checkouts",
    badge: "Payments",
    badgeColor: "green.500",
  },
  {
    title: "Run Engine",
    description:
      "Engine is a backend HTTP server that calls smart contracts with your managed backend wallets.",
    badge: "Web3 Backend",
    badgeColor: "gray.700",
    image: require("public/assets/dashboard/home-infra.png"),
    href: "/dashboard/engine",
  },
];

const Dashboard: ThirdwebNextPage = (
  props: InferGetStaticPropsType<typeof getStaticProps>,
) => {
  const connectionStatus = useConnectionStatus();
  const { colorMode } = useColorMode();

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
                  <DarkMode>
                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                      {GET_STARTED_SECTIONS.map(
                        ({
                          title,
                          description,
                          badge,
                          badgeColor,
                          image,
                          href,
                        }) => (
                          <NavigationCard
                            key={title}
                            title={title}
                            description={description}
                            badge={badge}
                            badgeColor={badgeColor}
                            image={image}
                            href={href}
                            TRACKING_CATEGORY={TRACKING_CATEGORY}
                            colorMode={colorMode}
                          />
                        ),
                      )}
                    </SimpleGrid>
                  </DarkMode>
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
