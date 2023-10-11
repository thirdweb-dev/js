import { Box, Flex, Grid, Icon, SlideFade, Spacer } from "@chakra-ui/react";
import { AppLayout } from "components/app-layouts/app";
import { ConnectWalletPlayground } from "components/wallets/ConnectWalletPlayground/Playground";
import { WalletsSidebar } from "core-ui/sidebar/wallets";
import { PageId } from "page-id";
import { ThirdwebNextPage } from "utils/types";
import { Button, Card, Heading, Text, TrackedLink } from "tw-components";
import { AiOutlineArrowRight } from "react-icons/ai";
import { SupportedPlatformLink } from "components/wallets/SupportedPlatformLink";
import { ChakraNextImage } from "components/Image";
import { useEffect, useState } from "react";

const TRACKING_CATEGORY = "connect-playground";

const DashboardWalletsConnect: ThirdwebNextPage = () => {
  return (
    <Box>
      <Heading size="title.xl" as="h1">
        Connect
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
          href="https://portal.thirdweb.com/react/react.connectwallet"
        />
        <SupportedPlatformLink
          trackingCategory={TRACKING_CATEGORY}
          size="sm"
          platform="React Native"
          href="https://portal.thirdweb.com/react-native/react-native.connectwallet"
        />
        <SupportedPlatformLink
          trackingCategory={TRACKING_CATEGORY}
          size="sm"
          platform="Unity"
          href="https://portal.thirdweb.com/unity/connectwallet"
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
      <Grid templateColumns="1fr" gap={5}>
        <ViewDocs />
        <ShareYourFeedback />
      </Grid>
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
          href="https://portal.thirdweb.com/react/react.connectwallet"
        />

        <SupportedPlatformLink
          trackingCategory={TRACKING_CATEGORY}
          noBorder
          size="md"
          platform="Unity"
          href="https://portal.thirdweb.com/unity/connectwallet"
        />
        <SupportedPlatformLink
          trackingCategory={TRACKING_CATEGORY}
          noBorder
          size="md"
          platform="React Native"
          href="https://portal.thirdweb.com/react-native/react-native.connectwallet"
        />
        <SupportedPlatformLink
          trackingCategory={TRACKING_CATEGORY}
          noBorder
          size="md"
          platform="TypeScript"
          href="https://portal.thirdweb.com/wallet/usage-with-typescript-sdk"
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
          href="https://portal.thirdweb.com/connect/usage-with-react-sdk"
          label="react-sdk-get-started"
        >
          Get started with React SDK
        </GuideLink>

        <GuideLink
          href="https://blog.thirdweb.com/guides/add-connectwallet-to-your-website/"
          label="add-connect-wallet"
        >
          How to Add a Connect Wallet Button to Your Website
        </GuideLink>

        <GuideLink
          href="https://portal.thirdweb.com/embedded-wallet/smart-wallet-and-embedded-wallet"
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
      label={`guide`}
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

function ShareYourFeedback() {
  return (
    <TrackedLink
      category={TRACKING_CATEGORY}
      label="feedback"
      href="https://docs.google.com/forms/d/e/1FAIpQLSdL6H8rscuWpKkwlRvwxsCN0u4sSSL4qh6KiBFmZwn19PGGIw/viewform"
      isExternal
      _hover={{
        textDecor: "none",
        color: "blue.500",
      }}
    >
      <Card
        p={5}
        _hover={{
          borderColor: "blue.500",
        }}
      >
        <Flex gap={2} alignItems="center">
          <Heading fontSize={16} as="h3" color="inherit">
            Share your feedback
          </Heading>
          <Icon as={AiOutlineArrowRight} width={5} height={5} />
        </Flex>
        <Spacer height={3} />
        <Text color="paragraph">
          Report bugs, echo your thoughts, and suggest improvements.
        </Text>
      </Card>
    </TrackedLink>
  );
}

function BuildCustomBanner() {
  const [bannerImageIndex, setBannerImageIndex] = useState(1);

  const bannerPosters = [
    {
      img: require("public/assets/connect/pixels-cw.png"),
      position: "flex-end",
      padding: 0,
    },
    {
      img: require("public/assets/connect/w3w-cw.png"),
      position: "center",
      padding: 4,
    },
    {
      img: require("public/assets/connect/lv-cw.png"),
      position: "flex-end",
      padding: 0,
    },
  ];

  // update banner image every 3 seconds
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
  }, [bannerPosters.length]);

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
              href="https://portal.thirdweb.com/react/react.connectwallet"
            />
            <SupportedPlatformLink
              trackingCategory={TRACKING_CATEGORY}
              size="sm"
              platform="React Native"
              href="https://portal.thirdweb.com/react-native/react-native.connectwallet"
            />
            <SupportedPlatformLink
              trackingCategory={TRACKING_CATEGORY}
              size="sm"
              platform="Unity"
              href="https://portal.thirdweb.com/unity/connectwallet"
            />
            <SupportedPlatformLink
              trackingCategory={TRACKING_CATEGORY}
              size="sm"
              platform="TypeScript"
              href="https://portal.thirdweb.com/wallet/usage-with-typescript-sdk"
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
              href="https://portal.thirdweb.com/react/connecting-wallets"
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

DashboardWalletsConnect.getLayout = (page, props) => (
  <AppLayout {...props} hasSidebar={true} noOverflowX={true}>
    <WalletsSidebar activePage="connect" />
    {page}
  </AppLayout>
);

DashboardWalletsConnect.pageId = PageId.DashboardWalletsConnect;

export default DashboardWalletsConnect;
