import {
  AspectRatio,
  Box,
  DarkMode,
  Flex,
  FlexProps,
  GridItem,
  LinkBox,
  LinkOverlay,
  SimpleGrid,
} from "@chakra-ui/react";
import { SiGithub } from "@react-icons/all-files/si/SiGithub";
import { ChakraNextImage } from "components/Image";
import { HomepageFooter } from "components/footer/Footer";
import { HomepageTopNav } from "components/product-pages/common/Topnav";
import { landingSnippets } from "components/product-pages/homepage/CodeSelector";
import { YoutubeEmbed } from "components/video-embed/YoutubeEmbed";
import Image from "next/image";
import { PageId } from "page-id";
import { themes } from "prism-react-renderer";
import { Suspense } from "react";
import {
  Card,
  CodeBlock,
  CodeBlockProps,
  Heading,
  Link,
  LinkButton,
  Text,
  TrackedLink,
} from "tw-components";
import { ComponentWithChildren } from "types/component-with-children";
import { ThirdwebNextPage } from "utils/types";

const darkTheme = themes.dracula;

type SDKCardProps = {
  title: string;
  image: string;
  links: { text: string; href: string }[];
  code: CodeBlockProps;
};

const TRACKING_CATEGORY = "build_base";

const SDKCard: ComponentWithChildren<SDKCardProps> = ({
  title,
  image,
  links,
  code,
  children,
}) => {
  return (
    <Card
      as={Flex}
      flexDir="column"
      bg="#0F0F0F"
      border="none"
      p={10}
      alignItems="flex-start"
    >
      <>
        <Flex
          alignItems="center"
          justifyContent="center"
          w={20}
          h={20}
          border="1px solid #A7BFFA1A"
          rounded="lg"
        >
          <ChakraNextImage src={image} alt="" width={12} height={12} />
        </Flex>
        <Heading mt={4} size="title.lg">
          {title}
        </Heading>
        {children && (
          <Box w="full" mt={10}>
            {children}
          </Box>
        )}
        <CodeBlock
          my={8}
          darkTheme={darkTheme}
          color="white"
          fontSize={{ base: "12px", md: "14px" }}
          {...code}
        />
        {links.map(({ text, href }) => (
          <Link
            key={href}
            mt={4}
            href={href}
            color="blue.500"
            _hover={{ textDecoration: "underline" }}
          >
            {text} &gt;
          </Link>
        ))}
      </>
    </Card>
  );
};

const Base: ThirdwebNextPage = () => {
  return (
    <DarkMode>
      <Flex
        sx={{
          // overwrite the theme colors because the home page is *always* in "dark mode"
          "--chakra-colors-heading": "#F2F2F7",
          "--chakra-colors-paragraph": "#AEAEB2",
          "--chakra-colors-borderColor": "rgba(255,255,255,0.1)",
        }}
        justify="center"
        flexDir="column"
        as="main"
        bg="#000"
      >
        <HomepageTopNav />
        <Box mt="-80px" pt="80px" overflowX="hidden">
          <SimpleGrid
            maxW={{ base: "3xl", md: "8xl" }}
            mx="auto"
            columns={{ base: 1, md: 2 }}
            h={{ md: "calc(100vh - 80px)" }}
            maxH={1080}
            alignItems="center"
          >
            <GridItem py={{ base: 12, md: 0 }}>
              <Image
                src="/assets/build/base/base.png"
                alt="Base"
                width={757}
                height={380}
              />
            </GridItem>
            <GridItem p={{ base: 4, md: 12 }}>
              <Heading as="h1" size="title.xl">
                Secure, low-cost, developer-friendly Ethereum L2.
              </Heading>
              <Heading as="h2" size="title.xl" my={{ base: 4, md: 10 }}>
                Built to bring the next billion users to web3.
              </Heading>
              <Link
                href="https://base.org/"
                color="#245CF1"
                textDecoration="none"
                fontSize="2rem"
                fontWeight={700}
                _hover={{
                  textDecoration: "underline",
                }}
              >
                Check out Base &rarr;
              </Link>
            </GridItem>
          </SimpleGrid>
          <Flex
            flexDir="column"
            alignItems="center"
            maxW="3xl"
            mx="auto"
            pt={24}
            pb={12}
            px={{ base: 4, md: 8 }}
          >
            <Heading
              as="h3"
              size="title.xl"
              textAlign="center"
              letterSpacing="-0.02em"
            >
              <Box
                as="span"
                background="linear-gradient(0deg, #A854F3 69.94%, #EEB2F9 93.45%)"
                bgClip="text"
              >
                thirdweb
              </Box>{" "}
              brings your web3 ideas to production in record time.
            </Heading>
            <CatAttackCard trackingCategory={TRACKING_CATEGORY} />
          </Flex>
          <Flex
            flexDir="column"
            alignItems="center"
            maxW="3xl"
            mx="auto"
            px={{ base: 4, md: 8 }}
          >
            <Heading
              as="h3"
              maxW="xl"
              textAlign="center"
              size="title.xl"
              letterSpacing="-0.02em"
              background="linear-gradient(0deg, #A854F3 69.94%, #EEB2F9 93.45%)"
              bgClip="text"
            >
              Built with thirdweb in 2 days.
            </Heading>
            <Heading
              mt={4}
              as="h3"
              maxW="md"
              textAlign="center"
              size="title.xl"
              letterSpacing="-0.02em"
            >
              stats, only 48 hours after launch...
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} w="full" gap={6} mt={8}>
              {[
                { title: "100k+", label: "players" },
                { title: "1 Million+", label: "Base contract transactions" },
              ].map(({ title, label }) => (
                <Card
                  key={title}
                  as={GridItem}
                  bg="#0F0F0F"
                  border="0"
                  display="flex"
                  flexDir="column"
                  alignItems="center"
                  p={8}
                >
                  <Heading
                    size="title.2xl"
                    background="linear-gradient(0deg, #A854F3 69.94%, #EEB2F9 93.45%)"
                    bgClip="text"
                    textAlign="center"
                    letterSpacing="-0.02em"
                  >
                    {title}
                  </Heading>
                  <Heading
                    color="whiteAlpha.500"
                    size="title.xs"
                    mt={3}
                    textAlign="center"
                    letterSpacing="-0.02em"
                  >
                    {label}
                  </Heading>
                </Card>
              ))}
            </SimpleGrid>
          </Flex>
          <Flex
            flexDir="column"
            alignItems="center"
            maxW="5xl"
            mx="auto"
            py={12}
            px={{ base: 4, md: 8 }}
          >
            <Heading
              maxW="3xl"
              size="title.sm"
              bg="linear-gradient(0, #6891F7 -18.75%, #A7BFFA 100%)"
              bgClip="text"
              letterSpacing="-0.02em"
              textAlign="center"
            >
              You could be the next hit on Base.
            </Heading>
            <Heading
              maxW="3xl"
              size="title.2xl"
              letterSpacing="-0.02em"
              textAlign="center"
              mt={4}
              mb={12}
            >
              Learn how to build your own web3 apps or games.
            </Heading>
            <YoutubeEmbed
              maxWidth={1080}
              videoId="fED_zrE0HLY"
              aspectRatio={16 / 9}
              title="How to build a Web3 game on Base with thirdweb"
            />
          </Flex>
          <Flex
            flexDir="column"
            alignItems="center"
            maxW="6xl"
            mx="auto"
            py={24}
            gap={6}
            px={{ base: 4, md: 8 }}
          >
            <Heading
              maxW="xl"
              size="title.2xl"
              letterSpacing="-0.02em"
              textAlign="center"
            >
              <Box
                as="span"
                bg="linear-gradient(0, #6891F7 -18.75%, #A7BFFA 100%)"
                bgClip="text"
              >
                Start building
              </Box>{" "}
              with
            </Heading>
            <Flex
              align="center"
              gap={4}
              flexDir={{ base: "column", md: "row" }}
            >
              <ChakraNextImage
                width="190"
                height="34"
                src="/assets/build/base/coinbase.png"
                alt="coinbase"
              />
              <Text size="body.2xl" color="#595959" transform="rotate(45deg)">
                +
              </Text>
              <Image
                width="225"
                height="36"
                src="/assets/build/base/thirdweb.png"
                alt="thirdweb"
              />
              <Text size="body.2xl" color="#595959" transform="rotate(45deg)">
                +
              </Text>
              <Image
                width="231"
                height="20"
                src="/assets/build/base/google.png"
                alt="google cloud"
              />
            </Flex>
            <SimpleGrid columns={{ base: 1, md: 3 }} mt={12} gap={6} w="full">
              {[
                {
                  title: "Wallet",
                  href: "https://www.coinbase.com/wallet",
                  image: "/assets/build/base/coinbase-wallet.png",
                  flexDir: "row",
                  width: 81,
                  height: 81,
                },
                {
                  title: "Wallet as a Service",
                  href: "https://www.coinbase.com/cloud/products/waas",
                  image: "/assets/build/base/coinbase-waas.png",
                  flexDir: "row",
                  width: 81,
                  height: 81,
                },
                {
                  title: "Payments",
                  href: "https://www.coinbase.com/cloud/products/pay-sdk",
                  image: "/assets/build/base/coinbase-pay.png",
                  flexDir: "column",
                  width: 133,
                  height: 53,
                },
              ].map(({ title, href, image, flexDir, width, height }) => (
                <LinkBox
                  key={title}
                  as={Card}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  bg="#0F0F0F"
                  border="3px solid transparent"
                  transitionProperty="border"
                  transitionDuration="slow"
                  _hover={{ borderColor: "#2151F5" }}
                  py={10}
                  px={6}
                >
                  <Flex
                    alignItems="center"
                    justifyContent="center"
                    flexDir={flexDir as FlexProps["flexDir"]}
                    gap={flexDir === "row" ? 10 : 4}
                  >
                    <ChakraNextImage
                      width={width}
                      height={height}
                      src={image}
                      alt=""
                    />
                    <Heading
                      textAlign="center"
                      size="title.lg"
                      letterSpacing="-0.02em"
                      background="linear-gradient(80deg, #6891F7, #C0D2FF, #6891F7)"
                      backgroundClip="text"
                      backgroundSize="200% 200%"
                      transitionProperty="background-position, transform"
                      transitionDuration="slower"
                      _hover={{
                        backgroundPosition: "bottom right",
                      }}
                      {...{ as: LinkOverlay, href, isExternal: true }}
                    >
                      {title}
                    </Heading>
                  </Flex>
                </LinkBox>
              ))}
            </SimpleGrid>
            <LinkBox
              as={Card}
              w="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg="#0F0F0F"
              border="3px solid transparent"
              transitionProperty="border"
              transitionDuration="slow"
              _hover={{ borderColor: "#2151F5" }}
              py={10}
              px={6}
            >
              <Flex
                alignItems="center"
                justifyContent="center"
                flexDir={{ base: "column", sm: "row" }}
                gap={{ base: 2, sm: 10 }}
                textAlign={{ base: "center", sm: "left" }}
              >
                <ChakraNextImage
                  width="136"
                  height="110"
                  src="/assets/build/base/google-cloud.png"
                  alt=""
                />
                <Box>
                  <Heading
                    size="title.lg"
                    letterSpacing="-0.02em"
                    background="linear-gradient(80deg, #6891F7, #C0D2FF, #6891F7)"
                    backgroundClip="text"
                    backgroundSize="200% 200%"
                    transitionProperty="background-position, transform"
                    transitionDuration="slower"
                    _hover={{
                      backgroundPosition: "bottom right",
                    }}
                    {...{
                      as: LinkOverlay,
                      href: "https://cloud.google.com/web3",
                      isExternal: true,
                    }}
                  >
                    Google Cloud for web3
                  </Heading>
                  <Text mt={2}>
                    Secure tools and infrastructure for web3 --&gt;
                  </Text>
                </Box>
              </Flex>
            </LinkBox>
            <SimpleGrid columns={{ base: 1, md: 2 }} w="100%" gap={6}>
              <GridItem as={Flex} flexDir="column" gap={6}>
                {(
                  [
                    {
                      title: "Deploy Contracts",
                      image: "/assets/build/base/contracts.svg",
                      code: {
                        code: "npx thirdweb deploy",
                        language: "bash",
                      },
                      links: [
                        {
                          text: "Browse docs",
                          href: "https://portal.thirdweb.com/contracts/deploy/overview",
                        },
                      ],
                      children: (
                        <LinkButton
                          href="/explore"
                          bg="white"
                          _hover={{ bg: "whiteAlpha.800" }}
                        >
                          <Text as="span" size="label.lg" color="black">
                            Deploy a contract
                          </Text>
                        </LinkButton>
                      ),
                    },
                    {
                      title: "Build Web3 Mobile apps",
                      image: "/assets/build/base/apps.svg",
                      code: {
                        code: landingSnippets["react"].replace(
                          "/react",
                          "/react-native",
                        ),
                        language: "jsx",
                      },
                      links: [
                        {
                          text: "Browse docs",
                          href: "https://portal.thirdweb.com/react-native/latest",
                        },
                        {
                          text: "Browse templates",
                          href: "/templates",
                        },
                      ],
                    },
                  ] as SDKCardProps[]
                ).map((props) => (
                  <SDKCard key={props.title} {...props} />
                ))}
              </GridItem>
              <GridItem as={Flex} flexDir="column" gap={6}>
                {(
                  [
                    {
                      title: "Build Web3 Websites",
                      image: "/assets/build/base/websites.svg",
                      code: {
                        code: landingSnippets["react"],
                        language: "jsx",
                      },
                      links: [
                        {
                          text: "Browse docs",
                          href: "https://portal.thirdweb.com/react/latest",
                        },
                        {
                          text: "Browse templates",
                          href: "/templates",
                        },
                      ],
                    },
                    {
                      title: "Build Web3 Unity games",
                      image: "/assets/build/base/games.svg",
                      code: {
                        code: landingSnippets["unity"],
                        language: "cpp",
                      },
                      links: [
                        {
                          text: "Browse docs",
                          href: "https://portal.thirdweb.com/unity",
                        },
                        {
                          text: "Browse templates",
                          href: "/templates",
                        },
                      ],
                    },
                  ] as SDKCardProps[]
                ).map((props) => (
                  <SDKCard key={props.title} {...props} />
                ))}
              </GridItem>
            </SimpleGrid>
          </Flex>
          <Suspense>
            <HomepageFooter />
          </Suspense>
        </Box>
      </Flex>
    </DarkMode>
  );
};

Base.pageId = PageId.BuildBaseLanding;

export default Base;

export type CatAttackCardProps = {
  hideGithub?: boolean;
  trackingCategory: string;
};

export const CatAttackCard: React.FC<CatAttackCardProps> = ({
  hideGithub,
  trackingCategory,
}) => {
  return (
    <Card p={0} w="full" mt={14} bg="#0F0F0F" border="0" overflow="hidden">
      <Flex flexDir="column" alignItems="center" p={12}>
        <AspectRatio ratio={400 / 320} w="200px">
          <ChakraNextImage
            src={require("/public/assets/solutions-pages/gaming/catattack.png")}
            alt="Cat Attack"
          />
        </AspectRatio>
        <Heading
          size="title.2xl"
          background="linear-gradient(0deg, #A854F3 69.94%, #EEB2F9 93.45%)"
          bgClip="text"
          textAlign="center"
          letterSpacing="-0.02em"
        >
          CatAttack
        </Heading>
        <Heading
          size="title.lg"
          mt={4}
          textAlign="center"
          letterSpacing="-0.02em"
        >
          The first game built on Base.
        </Heading>
        <TrackedLink
          as={LinkButton}
          category={trackingCategory}
          my={8}
          px={6}
          h={14}
          href="https://catattack.thirdweb.com"
          bg="white"
          label="play_cat_attack"
          _hover={{ bg: "whiteAlpha.800" }}
          isExternal
        >
          <Heading as="span" size="title.md" color="black">
            Play the game
          </Heading>
        </TrackedLink>
        {!hideGithub && (
          <>
            <Heading
              my={4}
              size="title.sm"
              fontSize="16px"
              color="whiteAlpha.600"
            >
              Clone the code
            </Heading>
            <SimpleGrid columns={{ sm: 2 }} gap={4}>
              {[
                {
                  title: "Web",
                  href: "https://github.com/thirdweb-example/catattacknft",
                  trackingLabel: "clone_cat_attack_web",
                },
                {
                  title: "Mobile",
                  href: "https://github.com/thirdweb-example/catattacknft-react-native",
                  trackingLabel: "clone_cat_attack_mobile",
                },
              ].map(({ title, href, trackingLabel }) => (
                <TrackedLink
                  category={trackingCategory}
                  label={trackingLabel}
                  key={title}
                  p={1}
                  rounded="lg"
                  background="linear-gradient(-45deg, #A854F3, #EEB2F9, #A854F3)"
                  backgroundSize="200% 200%"
                  href={href}
                  transitionProperty="background-position, transform"
                  transitionDuration="slower"
                  isExternal
                  _hover={{
                    backgroundPosition: "bottom right",
                  }}
                  _active={{
                    transform: "scale(0.95)",
                  }}
                >
                  <Flex
                    p={4}
                    rounded="lg"
                    bg="backgroundDark"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <SiGithub />
                    <Text ml={2} color="white" size="label.lg">
                      {title}
                    </Text>
                  </Flex>
                </TrackedLink>
              ))}
            </SimpleGrid>
          </>
        )}
      </Flex>
      <Image
        width="862"
        height="238"
        src="/assets/build/base/cats.png"
        alt=""
      />
    </Card>
  );
};
