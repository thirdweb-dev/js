import { Flex, GridItem, SimpleGrid } from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnectionStatus } from "@thirdweb-dev/react";
import { ClientOnly } from "components/ClientOnly/ClientOnly";
import { FTUX } from "components/FTUX/FTUX";
import { AppLayout } from "components/app-layouts/app";
import { Changelog, ChangelogItem } from "components/dashboard/Changelog";
import { NavigationCard } from "components/dashboard/NavigationCard";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { PageId } from "page-id";
import { Heading } from "tw-components";
import { ThirdwebNextPage } from "utils/types";

const TRACKING_CATEGORY = "dashboard";

const GET_STARTED_SECTIONS = [
  {
    title: "Wallets",
    description:
      "Onboard, authenticate, and manage users. Connect any wallets to your app and games.",
    image: require("public/assets/dashboard/home-wallets.png"),
    href: "/dashboard/wallets/connect",
  },
  {
    title: "Contracts",
    description:
      "Create, deploy, and manage smart contracts on any EVM network.",
    image: require("public/assets/dashboard/home-contracts.png"),
    href: "/dashboard/contracts/deploy",
  },
  {
    title: "Payments",
    description: "Facilitate financial transactions on the blockchain.",
    image: require("public/assets/dashboard/home-payments.png"),
    href: "https://withpaper.com/product/checkouts",
  },
  {
    title: "Infrastructure",
    description: "Connect your application to decentralized networks.",
    image: require("public/assets/dashboard/home-infrastructure.png"),
    href: "/dashboard/infrastructure/storage",
  },
];

const Dashboard: ThirdwebNextPage = (
  props: InferGetStaticPropsType<typeof getStaticProps>,
) => {
  const { publicKey } = useWallet();
  const connectionStatus = useConnectionStatus();
  const showFTUX =
    connectionStatus !== "connected" &&
    connectionStatus !== "connecting" &&
    !publicKey;
  const isLoading = connectionStatus === "unknown";

  return (
    <Flex flexDir="column" gap={4}>
      {/* Any announcements: <AnnouncementCard /> */}
      <SimpleGrid
        columns={{ base: 1, lg: 4 }}
        gap={16}
        mt={{ base: 2, md: 10 }}
      >
        <GridItem colSpan={{ lg: 3 }}>
          <Heading mb={8}>Get started quickly</Heading>
          {!isLoading && (
            <ClientOnly fadeInDuration={600} ssr={null}>
              {showFTUX ? (
                <FTUX />
              ) : (
                <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                  {GET_STARTED_SECTIONS.map(
                    ({ title, description, image, href }) => (
                      <NavigationCard
                        key={title}
                        title={title}
                        description={description}
                        image={image}
                        href={href}
                        TRACKING_CATEGORY={TRACKING_CATEGORY}
                      />
                    ),
                  )}
                </SimpleGrid>
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
