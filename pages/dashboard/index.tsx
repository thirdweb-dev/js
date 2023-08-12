import {
  Flex,
  GridItem,
  LinkBox,
  LinkOverlay,
  SimpleGrid,
  useColorMode,
} from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAddress, useConnectionStatus } from "@thirdweb-dev/react";
import { ClientOnly } from "components/ClientOnly/ClientOnly";
import { FTUX } from "components/FTUX/FTUX";
import { ChakraNextImage } from "components/Image";
import { AppLayout } from "components/app-layouts/app";
import { Changelog, ChangelogItem } from "components/dashboard/Changelog";
import { AnnouncementCard } from "components/notices/AnnouncementCard";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { PageId } from "page-id";
import { BsArrowRight } from "react-icons/bs";
import { Card, Heading, Text, TrackedLink } from "tw-components";
import { ThirdwebNextPage } from "utils/types";

const TRACKING_CATEGORY = "dashboard";

const GET_STARTED_SECTIONS = [
  {
    title: "Wallets",
    description:
      "Onboard, authenticate, and manage users. Connect any wallets to your app and games.",
    image: require("public/assets/dashboard/home-wallets.png"),
    lightImage: require("public/assets/dashboard/home-wallets.png"),
    href: "/dashboard/wallet",
  },
  {
    title: "Contracts",
    description:
      "Create, deploy, and manage smart contracts on any EVM network.",
    image: require("public/assets/dashboard/home-contracts.png"),
    lightImage: require("public/assets/dashboard/home-contracts.png"),
    href: "/dashboard/contracts",
  },
  {
    title: "Storage",
    description:
      "Store and retrieve files from decentralized storage at high speed.",
    image: require("public/assets/dashboard/home-storage.png"),
    lightImage: require("public/assets/dashboard/home-storage.png"),
    href: "/dashboard/storage",
  },
  {
    title: "RPC Edge",
    description:
      "Connect to over 900 networks with a fast and reliable RPC Edge service.",
    image: require("public/assets/dashboard/home-rpc.png"),
    lightImage: require("public/assets/dashboard/home-rpc.png"),
    href: "/dashboard/rpc",
  },
];

const Dashboard: ThirdwebNextPage = (
  props: InferGetStaticPropsType<typeof getStaticProps>,
) => {
  const { colorMode } = useColorMode();
  const address = useAddress();
  const { publicKey } = useWallet();
  const connectionStatus = useConnectionStatus();
  const isLoading =
    connectionStatus === "unknown" || connectionStatus === "connecting";
  return (
    <Flex flexDir="column" gap={4}>
      <AnnouncementCard />
      <SimpleGrid
        columns={{ base: 1, lg: 4 }}
        gap={16}
        mt={{ base: 2, md: 10 }}
      >
        <GridItem colSpan={{ lg: 3 }}>
          <ClientOnly fadeInDuration={600} ssr={null}>
            {!isLoading && (
              <>
                <Heading mb={8}>Get started quickly</Heading>
                {(address || publicKey) && (
                  <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                    {GET_STARTED_SECTIONS.map(
                      ({ title, description, lightImage, image, href }) => (
                        <LinkBox
                          key={title}
                          role="group"
                          overflow="hidden"
                          position="relative"
                        >
                          <Card
                            p={0}
                            overflow="hidden"
                            bg="linear-gradient(158.84deg, rgba(255, 255, 255, 0.05) 13.95%, rgba(255, 255, 255, 0) 38.68%)"
                            _groupHover={{
                              borderColor: "blue.500",
                            }}
                            transitionDuration="200ms"
                            as={Flex}
                            flexDir="column"
                            padding={0}
                          >
                            <ChakraNextImage
                              pointerEvents="none"
                              sizes="(max-width: 768px) 100vw,
                            (max-width: 1200px) 50vw,
                            33vw"
                              src={colorMode === "light" ? lightImage : image}
                              alt=""
                            />
                            <Flex
                              flexDir="column"
                              gap={6}
                              p={7}
                              justifyContent="space-between"
                              h="full"
                            >
                              <LinkOverlay
                                as={TrackedLink}
                                category={TRACKING_CATEGORY}
                                label={title}
                                href={href}
                                _hover={{ textDecor: "none" }}
                              >
                                <Heading
                                  size="title.md"
                                  _groupHover={{ color: "blue.500" }}
                                  transitionDuration="200ms"
                                  display="flex"
                                  alignItems="center"
                                  gap="0.5em"
                                >
                                  {title} <BsArrowRight />
                                </Heading>
                              </LinkOverlay>
                              <Text>{description}</Text>
                            </Flex>
                          </Card>
                        </LinkBox>
                      ),
                    )}
                  </SimpleGrid>
                )}

                {connectionStatus === "disconnected" && !publicKey && <FTUX />}
              </>
            )}
          </ClientOnly>
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
