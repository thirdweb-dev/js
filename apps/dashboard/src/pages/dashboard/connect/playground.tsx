import { Box, Flex, Grid, Icon, SlideFade, Spacer } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { AppLayout } from "components/app-layouts/app";
import { ConnectWalletPlayground } from "components/wallets/ConnectWalletPlayground/Playground";
import { SupportedPlatformLink } from "components/wallets/SupportedPlatformLink";
import { ConnectSidebar } from "core-ui/sidebar/connect";
import { getAbsoluteUrl } from "lib/vercel-utils";
import { NextSeo } from "next-seo";
import { PageId } from "page-id";
import { useEffect, useState } from "react";
import { AiOutlineArrowRight } from "react-icons/ai";
import { Button, Card, Heading, Text, TrackedLink } from "tw-components";
import type { ThirdwebNextPage } from "utils/types";

const TRACKING_CATEGORY = "connect-playground";

const seo = {
  title: "Build Your Own Connect Wallet Modal | Connect",
  desc: "Onboard your users to web3 with a beautiful Connect Wallet modal, customizable auth flows, and sign-in for web2 & web3 — in a few lines of code.",
};

const DashboardConnectPlayground: ThirdwebNextPage = () => {
  return (
    <Box>
      <NextSeo
        title={seo.title}
        description={seo.desc}
        openGraph={{
          title: seo.title,
          description: seo.desc,
          images: [
            {
              url: `${getAbsoluteUrl()}/assets/og-image/connect-wallet.png`,
              width: 1200,
              height: 630,
              alt: seo.title,
            },
          ],
        }}
      />

      <Heading size="title.xl" as="h1">
        Playground
      </Heading>
      <Spacer height={4} />
      <Text fontWeight={500}>
        A complete toolkit for connecting wallets to apps, UI components that
        work out of the box, and hooks that let you build custom Connect Wallet
        experiences.
      </Text>

      <Spacer height={5} />
      <Flex alignItems="center" gap={2}>
        <Text mr={2} display={["none", "block"]} fontSize={12}>
          Supports
        </Text>
        <SupportedPlatformLink
          trackingCategory={TRACKING_CATEGORY}
          size="sm"
          platform="React"
          href="https://portal.thirdweb.com/typescript/v5/react/components/ConnectButton"
        />
        <SupportedPlatformLink
          trackingCategory={TRACKING_CATEGORY}
          size="sm"
          platform="React Native"
          href="https://portal.thirdweb.com/react-native/latest/components/ConnectWallet"
        />
        <SupportedPlatformLink
          trackingCategory={TRACKING_CATEGORY}
          size="sm"
          platform="Unity"
          href="https://portal.thirdweb.com/unity/wallets/prefab"
        />
      </Flex>
      <Spacer height={12} />

      <ConnectWalletPlayground trackingCategory={TRACKING_CATEGORY} />

      <Spacer height={20} />
      <BuildCustomBanner />
      <Spacer height={20} />

      <FooterSection />
    </Box>
  );
};

function FooterSection() {
  return (
    <Grid templateColumns={["1fr", "1fr 1fr"]} gap={5}>
      <ViewDocs />
      <RelevantGuides />
    </Grid>
  );
}

function ViewDocs() {
  return (
    <Card p={5}>
      <Flex gap={2} alignItems="center">
        <Heading fontSize={16} as="h3">
          View Docs
        </Heading>
        <Icon as={AiOutlineArrowRight} width={5} height={5} />
      </Flex>

      <Spacer height={6} />

      <Grid templateColumns={"1fr 1fr"} gap={3} maxW="400px">
        <SupportedPlatformLink
          trackingCategory={TRACKING_CATEGORY}
          size="md"
          noBorder
          platform="React"
          href="https://portal.thirdweb.com/typescript/v5/react/components/ConnectButton"
        />

        <SupportedPlatformLink
          trackingCategory={TRACKING_CATEGORY}
          noBorder
          size="md"
          platform="Unity"
          href="https://portal.thirdweb.com/unity/wallets/prefab"
        />
        <SupportedPlatformLink
          trackingCategory={TRACKING_CATEGORY}
          noBorder
          size="md"
          platform="React Native"
          href="https://portal.thirdweb.com/react-native/latest/components/ConnectWallet"
        />
        <SupportedPlatformLink
          trackingCategory={TRACKING_CATEGORY}
          noBorder
          size="md"
          platform="TypeScript"
          href="https://portal.thirdweb.com/typescript/v5/connecting-wallets"
        />
      </Grid>
    </Card>
  );
}

function RelevantGuides() {
  return (
    <Card p={5}>
      <Flex gap={2} alignItems="center">
        <Heading fontSize={16} as="h3">
          Relevant Guides
        </Heading>
        <Icon as={AiOutlineArrowRight} width={5} height={5} />
      </Flex>

      <Spacer height={5} />

      <Flex gap={3} flexDirection="column">
        <GuideLink
          href="https://blog.thirdweb.com/web3-wallet/"
          label="what-is-web3-wallet"
        >
          What is a web3 wallet?
        </GuideLink>

        <GuideLink
          href="https://portal.thirdweb.com/typescript/v5"
          label="sdk-v5-get-started"
        >
          Get started with thirdweb SDK
        </GuideLink>

        <GuideLink
          href="https://portal.thirdweb.com/typescript/v5/react/components/ConnectButton"
          label="add-connect-wallet"
        >
          How to Add a Connect Wallet Button to Your Website
        </GuideLink>

        <GuideLink
          href="https://portal.thirdweb.com/connect/in-app-wallet/how-to/enable-gasless"
          label="gasless-tx"
        >
          Enable Gasless Transactions
        </GuideLink>
      </Flex>
    </Card>
  );
}

function GuideLink(props: {
  label: string;
  children: React.ReactNode;
  href: string;
}) {
  return (
    <TrackedLink
      category={TRACKING_CATEGORY}
      label={"guide"}
      trackingProps={{
        guide: props.label,
      }}
      href={props.href}
      color="paragraph"
      isExternal
      _hover={{
        color: "blue.500",
      }}
    >
      {props.children}
    </TrackedLink>
  );
}

const bannerPosters = [
  {
    img: require("../../../../public/assets/connect/pixels-cw.png"),
    position: "flex-end",
    padding: 0,
  },
  {
    img: require("../../../../public/assets/connect/w3w-cw.png"),
    position: "center",
    padding: 4,
  },
  {
    img: require("../../../../public/assets/connect/lv-cw.png"),
    position: "flex-end",
    padding: 0,
  },
];

function BuildCustomBanner() {
  const [bannerImageIndex, setBannerImageIndex] = useState(1);

  // update banner image every 3 seconds
  // legitimate use-case
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    const interval = setInterval(() => {
      setBannerImageIndex((prev) => {
        const nextIndex = prev + 1;
        if (nextIndex === bannerPosters.length) {
          return 0;
        }
        return nextIndex;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      as="article"
      bg="bgWhite"
      border="1px solid"
      borderColor="borderColor"
      borderRadius="lg"
      overflow="hidden"
    >
      <Grid templateColumns={["1fr", "1fr 1fr"]}>
        {/* Left */}
        <Box px={["6", "14"]} py="8">
          <Text color="faded">Hooks & Functions</Text>
          <Spacer h={2} />
          <Heading fontSize={32} letterSpacing={"-0.02em"}>
            Build a completely custom onboarding experience.
          </Heading>

          <Spacer h={6} />
          <Flex alignItems="center" gap={2} flexWrap="wrap">
            <SupportedPlatformLink
              trackingCategory={TRACKING_CATEGORY}
              size="sm"
              platform="React"
              href="https://portal.thirdweb.com/typescript/v5/react/components/ConnectButton"
            />
            <SupportedPlatformLink
              trackingCategory={TRACKING_CATEGORY}
              size="sm"
              platform="React Native"
              href="https://portal.thirdweb.com/react-native/latest/components/ConnectWallet"
            />
            <SupportedPlatformLink
              trackingCategory={TRACKING_CATEGORY}
              size="sm"
              platform="Unity"
              href="https://portal.thirdweb.com/unity/wallets/prefab"
            />
            <SupportedPlatformLink
              trackingCategory={TRACKING_CATEGORY}
              size="sm"
              platform="TypeScript"
              href="https://portal.thirdweb.com/wallet-sdk/latest/usage"
            />
          </Flex>

          <Spacer h={6} />
          <Flex justifyContent={["center", "flex-start"]}>
            <Button
              w={["100%", "auto"]}
              as={TrackedLink}
              isExternal
              category={TRACKING_CATEGORY}
              label="custom-ui-cta"
              href="https://portal.thirdweb.com/typescript/v5/react/connecting-wallets"
              bg="bgBlack"
              color="bgWhite"
              minW="180px"
              p={6}
              _hover={{
                textDecor: "none",
              }}
            >
              Get Started
            </Button>
          </Flex>
        </Box>
        {/* Right */}
        <Box>
          {/* Preload images */}
          <Box visibility="hidden" w={0} h={0}>
            {bannerPosters.map((poster) => {
              return (
                <ChakraNextImage
                  priority={true}
                  src={bannerPosters[0].img}
                  alt=""
                  key={poster.img}
                />
              );
            })}
          </Box>

          <SlideFade
            in
            offsetY={80}
            key={bannerImageIndex}
            transition={{
              enter: {
                duration: 0.3,
              },
            }}
          >
            <Flex
              h={["220px", "320px"]}
              justifyContent="center"
              alignItems={bannerPosters[bannerImageIndex].position}
              p={bannerPosters[bannerImageIndex].padding}
            >
              <ChakraNextImage
                alt=""
                w={["calc(100% - 20px)", "80%"]}
                maxH="100%"
                src={bannerPosters[bannerImageIndex].img}
              />
            </Flex>
          </SlideFade>
        </Box>
      </Grid>
    </Box>
  );
}

DashboardConnectPlayground.getLayout = (page, props) => (
  <AppLayout {...props} hasSidebar={true} noOverflowX={true}>
    <ConnectSidebar activePage="playground" />
    {page}
  </AppLayout>
);

DashboardConnectPlayground.pageId = PageId.DashboardConnectPlayground;

export default DashboardConnectPlayground;
