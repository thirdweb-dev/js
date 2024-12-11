import { useForceDarkTheme } from "@/components/theme-provider";
import { Box, Container, Flex, SimpleGrid } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { HomepageFooter } from "components/footer/Footer";
import HeroSection from "components/grant/superchain/HeroSection";
import { LandingGridSection } from "components/landing-pages/grid-section";
import { LandingIconSectionItem } from "components/landing-pages/icon-section-item";
import { HomepageTopNav } from "components/product-pages/common/Topnav";
import { HomepageSection } from "components/product-pages/homepage/HomepageSection";
import { getAbsoluteUrl } from "lib/vercel-utils";
import { NextSeo } from "next-seo";
import { PageId } from "page-id";
import { useRef } from "react";
import {
  Card,
  Heading,
  Text,
  TrackedLink,
  TrackedLinkButton,
} from "tw-components";

const TRACKING_CATEGORY = "grant-superchain";

const title = "Superchain App Accelerator | Apply for Credits";

const description =
  "The Superchain App Accelerator is a $3M fund for developers to build seamless onchain apps — powered by Optimism and thirdweb. Apply for credits.";

const superchains = [
  {
    id: "optimism",
    name: "OP Mainnet",
    link: "/optimism?switch",
    src: require("../../../public/assets/grant/superchain/icon-op.png"),
  },
  {
    id: "fraxtal",
    name: "Fraxtal",
    link: "/fraxtal?switch",
    src: require("../../../public/assets/grant/superchain/icon-fraxtal.png"),
  },
  {
    id: "base",
    name: "Base",
    link: "/base?switch",
    src: require("../../../public/assets/grant/superchain/icon-base.png"),
  },
  {
    id: "zora",
    name: "Zora",
    link: "/zora?switch",
    src: require("../../../public/assets/grant/superchain/icon-zora.png"),
  },
  {
    id: "mode",
    name: "Mode",
    link: "/mode?switch",
    src: require("../../../public/assets/grant/superchain/icon-mode.png"),
  },
  {
    id: "cyber",
    name: "Cyber",
    link: "/cyber?switch",
    src: require("../../../public/assets/grant/superchain/icon-cyber.png"),
  },
  {
    id: "redstone",
    name: "Redstone",
    link: "/redstone?switch",
    src: require("../../../public/assets/grant/superchain/icon-redstone.png"),
  },
  {
    id: "ancient8",
    name: "Ancient8",
    link: "/ancient8?switch",
    src: require("../../../public/assets/grant/superchain/icon-ancient8.png"),
  },
  {
    id: "donatuz",
    name: "Donatuz",
    link: "/donatuz?switch",
    src: require("../../../public/assets/grant/superchain/icon-donatuz.png"),
  },
  {
    id: "mantle",
    name: "Mantle",
    link: "/mantle?switch",
    src: require("../../../public/assets/grant/superchain/mantle-icon.png"),
  },
  {
    id: "soneium",
    name: "Soneium",
    link: "/soneium-minato?switch",
    src: require("../../../public/assets/grant/superchain/soneium-icon.png"),
  },
  {
    id: "lisk",
    name: "Lisk",
    link: "/lisk",
    src: require("../../../public/assets/grant/superchain/icon-lisk.png"),
  },
  {
    id: "Arena-Z",
    name: "ArenaZ",
    link: "/arena-z",
    src: require("../../../public/assets/grant/superchain/icon-arena-z.png"),
    isComingSoon: false,
  },
  {
    id: "campNetworkv2",
    name: "CampNetworkV2",
    link: "/camp-network-testnet-v2?switch",
    src: require("../../../public/assets/grant/superchain/campNetwork-icon.jpg"),
    isComingSoon: true,
  },
];

const GrantSuperChain = () => {
  const mySectionRef = useRef<HTMLDivElement>(null);
  useForceDarkTheme();

  // Function to scroll to the section
  const scrollToSection = () => {
    if (mySectionRef.current) {
      mySectionRef.current.scrollIntoView?.({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <>
      <NextSeo
        title={title}
        description={description}
        openGraph={{
          title,
          url: `${getAbsoluteUrl()}/grant/superchain`,
          description,
          images: [
            {
              url: `${getAbsoluteUrl()}/assets/og-image/superchain.png`,
              width: 1200,
              height: 630,
              alt: title,
            },
          ],
        }}
      />

      <Flex
        justify="center"
        flexDir="column"
        as="main"
        sx={{
          // overwrite the theme colors because the home page is *always* in "dark mode"
          "--chakra-colors-heading": "#F2F2F7",
          "--chakra-colors-paragraph": "#AEAEB2",
          "--chakra-colors-borderColor": "rgba(255,255,255,0.1)",
        }}
      >
        <HomepageTopNav />
        <HeroSection
          trackingCategory={TRACKING_CATEGORY}
          scrollToSection={scrollToSection}
        />

        <HomepageSection id="header" mb="120px">
          <Flex flexDir="column" gap={{ base: "80px", md: "120px" }}>
            <Flex flexDir="column" gap="56px">
              <Container maxW={907} mt={28}>
                <Heading as="h1" size="title.2xl" mb={6} textAlign="center">
                  What do I receive?
                </Heading>

                <Flex flexDir="column" gap={8}>
                  <Text
                    textAlign="center"
                    size="body.xl"
                    color="rgba(255, 255, 255, 0.70)"
                    lineHeight="36px"
                  >
                    The Superchain App Accelerator is a $3M fund for developers
                    to build seamless apps on any Superchain network — created
                    in partnership with Optimism.
                  </Text>
                </Flex>
              </Container>

              <LandingGridSection>
                <LandingIconSectionItem
                  icon={require("../../../public/assets/grant/superchain/icon-smart-wallet.svg")}
                  title="Empower users with smart accounts"
                  description="Create seamless user experiences — we will sponsor end user transactions with smart accounts. Now live."
                />
                <LandingIconSectionItem
                  icon={require("../../../public/assets/grant/superchain/icon-dashboard.svg")}
                  title="Use our dashboard for free"
                  description="Deploy smart contracts, mint NFTs, & perform any onchain action on the thirdweb Dashboard — for free. Coming soon."
                />
                <LandingIconSectionItem
                  icon={require("../../../public/assets/grant/superchain/icon-tool.svg")}
                  title="Use our full-stack web3 dev tools"
                  description="Build your app without any friction with frontend, backend, and onchain tools. Coming soon."
                />
              </LandingGridSection>
            </Flex>

            <Flex
              flexDir="column"
              alignItems="center"
              gap="56px"
              ref={mySectionRef}
              pt={{ base: 0, md: 16 }}
            >
              <Container maxW={907} mt={20}>
                <Heading as="h1" size="title.2xl" mb={6} textAlign="center">
                  How do I apply?
                </Heading>

                <Text
                  textAlign="center"
                  size="body.xl"
                  color="rgba(255, 255, 255, 0.70)"
                  lineHeight="36px"
                >
                  Select the chain you want to build on, connect your wallet,
                  and apply for credits.
                </Text>
              </Container>

              <Flex
                position="relative"
                px={{ base: 6, lg: 12 }}
                flexDir="column"
                alignItems="center"
                gap="27px"
              >
                <SimpleGrid
                  columns={{ base: 1, sm: 2, md: 4 }}
                  placeItems="start"
                  gap="27px"
                >
                  {superchains
                    .slice(0, 4)
                    .map(({ id, name, src, link, isComingSoon }) => {
                      return (
                        <TrackedLink
                          key={id}
                          href={link}
                          category={TRACKING_CATEGORY}
                          label={id}
                          textDecor="none!important"
                          isExternal
                          pointerEvents={isComingSoon ? "none" : "all"}
                          w="full"
                        >
                          <Card
                            as={Flex}
                            flexDir="column"
                            alignItems="center"
                            justifyContent="center"
                            padding="14px"
                            transition="border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease"
                            _hover={{
                              borderColor: "blue.500",
                              boxShadow: "0 0 16px hsl(215deg 100% 60% / 30%)",
                              transform: "scale(1.01)",
                            }}
                            opacity={isComingSoon ? 0.6 : 1}
                          >
                            <ChakraNextImage
                              src={src}
                              alt={id}
                              w="74px"
                              h="74px"
                            />

                            <Flex
                              justifyContent="center"
                              alignItems="center"
                              gap="6px"
                              mt="16px"
                            >
                              <Text
                                textAlign="center"
                                fontSize="14px"
                                fontWeight={500}
                                color="#fff"
                              >
                                {name}
                              </Text>

                              {!isComingSoon && (
                                <ChakraNextImage
                                  src={require("../../../public/assets/grant/superchain/link.svg")}
                                  alt="arrow"
                                  height="18px"
                                  width="18px"
                                />
                              )}
                            </Flex>
                          </Card>

                          {isComingSoon && (
                            <Text
                              textAlign="center"
                              fontSize="14px"
                              fontWeight={400}
                              color="rgba(255, 255, 255, 0.70)"
                              mt="8px"
                            >
                              Coming soon
                            </Text>
                          )}
                        </TrackedLink>
                      );
                    })}
                </SimpleGrid>

                <SimpleGrid
                  columns={{ base: 1, sm: 2, md: 4 }}
                  placeItems="start"
                  gap="27px"
                  w="full"
                  margin="0 auto"
                >
                  {superchains
                    .slice(4)
                    .map(({ id, name, src, link, isComingSoon }) => {
                      return (
                        <TrackedLink
                          key={`two-${id}`}
                          href={link}
                          category={TRACKING_CATEGORY}
                          label={id}
                          textDecor="none!important"
                          isExternal
                          pointerEvents={isComingSoon ? "none" : "all"}
                          w="full"
                        >
                          <Card
                            as={Flex}
                            flexDir="column"
                            alignItems="center"
                            justifyContent="center"
                            padding="14px"
                            transition="border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease"
                            _hover={{
                              borderColor: "blue.500",
                              boxShadow: "0 0 16px hsl(215deg 100% 60% / 30%)",
                              transform: "scale(1.01)",
                            }}
                            opacity={isComingSoon ? 0.6 : 1}
                          >
                            <ChakraNextImage
                              src={src}
                              alt={id}
                              w="74px"
                              h="74px"
                            />

                            <Flex
                              justifyContent="center"
                              alignItems="center"
                              gap="6px"
                              mt="16px"
                            >
                              <Text
                                textAlign="center"
                                fontSize="14px"
                                fontWeight={500}
                                color="#fff"
                              >
                                {name}
                              </Text>

                              {!isComingSoon && (
                                <ChakraNextImage
                                  src={require("../../../public/assets/grant/superchain/link.svg")}
                                  alt="arrow"
                                  height="18px"
                                  width="18px"
                                />
                              )}
                            </Flex>
                          </Card>

                          {isComingSoon && (
                            <Text
                              textAlign="center"
                              fontSize="14px"
                              fontWeight={400}
                              color="rgba(255, 255, 255, 0.70)"
                              mt="8px"
                            >
                              Coming soon
                            </Text>
                          )}
                        </TrackedLink>
                      );
                    })}
                </SimpleGrid>
              </Flex>
            </Flex>

            <Flex
              flexDir="column"
              alignItems="center"
              mt={{ base: "0", lg: "60px" }}
            >
              <Box
                borderRadius="12px"
                position="relative"
                padding="45px"
                minHeight={{ base: "auto", md: "360px" }}
                width="full"
                bg="black"
                border="1px solid #26282f"
                mt={16}
              >
                <ChakraNextImage
                  userSelect="none"
                  position="absolute"
                  borderRadius="12px"
                  top="0"
                  left="0"
                  right="0"
                  bottom="0"
                  width="100%"
                  height="100%"
                  objectFit="cover"
                  alt=""
                  src={require("../../../public/assets/grant/superchain/blog-background.png")}
                  display={{ base: "none", md: "flex" }}
                />

                <Box position="relative" zIndex="2">
                  <Flex
                    flexDir="column"
                    gap="27px"
                    maxWidth="600px"
                    alignItems={{ base: "center", md: "flex-start" }}
                  >
                    <ChakraNextImage
                      src={require("../../../public/assets/grant/superchain/logo-dashboard.png")}
                      alt="logo"
                      mb={{ base: 5, md: "16px" }}
                      w="full"
                      maxW={{ base: "230px", md: "133px" }}
                    />

                    <Heading
                      fontWeight="600"
                      color="white"
                      textAlign={{ base: "center", md: "left" }}
                      as="h1"
                      size="title.lg"
                      maxW="md"
                    >
                      Accelerating the Superchain with Optimism
                    </Heading>
                    <Text
                      fontSize={{ base: "16px", md: "18px" }}
                      fontWeight="400"
                      color="white"
                      textAlign={{ base: "center", md: "left" }}
                      maxW="md"
                    >
                      Learn more about the Superchain App Accelerator in our
                      announcement blog.
                    </Text>
                    <TrackedLinkButton
                      variant="outline"
                      isExternal
                      bgColor="#FFF"
                      color="#000"
                      border="none"
                      _hover={{
                        opacity: 0.9,
                      }}
                      py={6}
                      category={TRACKING_CATEGORY}
                      label="production-ready-launch"
                      href="https://blog.thirdweb.com/accelerating-the-superchain-with-optimism"
                      maxW="fit-content"
                    >
                      Read the blog
                    </TrackedLinkButton>
                  </Flex>
                </Box>
              </Box>
            </Flex>
          </Flex>
        </HomepageSection>

        <HomepageFooter />
      </Flex>
    </>
  );
};

GrantSuperChain.pageId = PageId.GrantSuperChain;

export default GrantSuperChain;
