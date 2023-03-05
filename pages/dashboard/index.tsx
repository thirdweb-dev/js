import {
  Flex,
  GridItem,
  LinkBox,
  LinkOverlay,
  SimpleGrid,
  useColorMode,
} from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAddress } from "@thirdweb-dev/react";
import { ClientOnly } from "components/ClientOnly/ClientOnly";
import { FTUX } from "components/FTUX/FTUX";
import { ChakraNextImage } from "components/Image";
import { AppLayout } from "components/app-layouts/app";
import { Changelog, ChangelogItem } from "components/dashboard/Changelog";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { PageId } from "page-id";
import { useEffect, useState } from "react";
import { Card, Heading, Text, TrackedLink } from "tw-components";
import { ThirdwebNextPage } from "utils/types";

const TRACKING_CATEGORY = "dashboard";

const GET_STARTED_SECTIONS = [
  {
    title: "View contracts",
    description:
      "View smart contracts that you deployed or added to your dashboard.",
    image: require("public/assets/dashboard/home-view.png"),
    lightImage: require("public/assets/dashboard/home-view-light.png"),
    href: "/dashboard/contracts",
  },
  {
    title: "Browse contracts",
    description:
      "Explore contracts from world-class web3 protocols & engineers- all deployable with 1-click.",
    image: require("public/assets/dashboard/home-browse.png"),
    lightImage: require("public/assets/dashboard/home-browse-light.png"),
    href: "/explore",
  },
  {
    title: "Browse templates",
    description:
      "Get inspired and start building your own web3 apps on top of our templates.",
    image: require("public/assets/dashboard/home-templates.png"),
    lightImage: require("public/assets/dashboard/home-templates-light.png"),
    href: "https://portal.thirdweb.com/templates",
    isExternal: true,
  },
  {
    title: "Visit the docs",
    description:
      "Find guides, references and resources that will help you build with thirdweb.",
    image: require("public/assets/dashboard/home-docs.png"),
    lightImage: require("public/assets/dashboard/home-docs-light.png"),
    href: "https://portal.thirdweb.com",
    isExternal: true,
  },
];

const Dashboard: ThirdwebNextPage = (
  props: InferGetStaticPropsType<typeof getStaticProps>,
) => {
  const { colorMode } = useColorMode();
  const address = useAddress();
  const { publicKey } = useWallet();

  /** put the component is loading state for sometime to avoid layout shift */
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 200);
  }, []);

  return (
    <SimpleGrid columns={{ base: 1, lg: 4 }} gap={16} mt={{ base: 2, md: 10 }}>
      <GridItem colSpan={{ lg: 3 }}>
        <ClientOnly fadeInDuration={600} ssr={null}>
          {!isLoading && (
            <>
              <Heading mb={8}>Get started quickly</Heading>
              {(address || publicKey) && (
                <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                  {GET_STARTED_SECTIONS.map(
                    ({
                      title,
                      description,
                      lightImage,
                      image,
                      href,
                      isExternal,
                    }) => (
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
                        >
                          <Flex direction="column" gap={3} p={6}>
                            <LinkOverlay
                              as={TrackedLink}
                              category={TRACKING_CATEGORY}
                              label={title}
                              href={href}
                              isExternal={isExternal}
                              _hover={{ textDecor: "none" }}
                            >
                              <Heading
                                size="title.xs"
                                _groupHover={{ color: "blue.500" }}
                                transitionDuration="200ms"
                              >
                                {title}{" "}
                                <Text
                                  fontWeight="inherit"
                                  fontSize="inherit"
                                  color="inherit"
                                  as="span"
                                >
                                  {"->"}
                                </Text>
                              </Heading>
                            </LinkOverlay>
                            <Text>{description}</Text>
                          </Flex>
                          <Flex justifyContent="center" px={6}>
                            <ChakraNextImage
                              pointerEvents="none"
                              sizes="(max-width: 768px) 100vw,
                            (max-width: 1200px) 50vw,
                            33vw"
                              src={colorMode === "light" ? lightImage : image}
                              alt=""
                            />
                          </Flex>
                        </Card>
                      </LinkBox>
                    ),
                  )}
                </SimpleGrid>
              )}

              {!address && !publicKey && <FTUX />}
            </>
          )}
        </ClientOnly>
      </GridItem>
      <GridItem as={Flex} direction="column" gap={6}>
        <Heading size="title.sm">Latest changes</Heading>
        <Changelog changelog={props.changelog} />
      </GridItem>
    </SimpleGrid>
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
