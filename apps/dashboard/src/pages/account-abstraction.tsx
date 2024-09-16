import { Box, Container, Flex } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { LandingDynamicSelector } from "components/landing-pages/dynamic-selector";
import { LandingEndCTA } from "components/landing-pages/end-cta";
import { LandingGuidesShowcase } from "components/landing-pages/guide-showcase";
import { LandingHeroWithSideImage } from "components/landing-pages/hero-with-side-image";
import { LandingLayout } from "components/landing-pages/layout";
import { LandingShowcaseImage } from "components/landing-pages/showcase-image";
import { getAbsoluteUrl } from "lib/vercel-utils";
import { PageId } from "page-id";
import { Heading, Text } from "tw-components";
import type { ThirdwebNextPage } from "utils/types";

const TRACKING_CATEGORY = "smart-wallet-landing";

const GUIDES = [
  {
    title: "The Quick-Start Guide to Account Abstraction",
    image: require("../../public/assets/product-pages/smart-wallet/get-started.png"),
    link: "https://portal.thirdweb.com/wallets/smart-wallet/get-started",
  },
  {
    title: "Choosing Between Simple, Managed, & Dynamic Smart Accounts",
    image: require("../../public/assets/product-pages/smart-wallet/which-contract.png"),
    link: "https://blog.thirdweb.com/smart-contract-deep-dive-building-smart-wallets-for-individuals-and-teams/",
  },
  {
    title: "How to Enable Batch Transactions with Account Abstraction",
    image: require("../../public/assets/product-pages/smart-wallet/batch-txns.png"),
    link: "https://blog.thirdweb.com/guides/how-to-batch-transactions-with-the-thirdweb-sdk/",
  },
];

const SmartWallet: ThirdwebNextPage = () => {
  return (
    <LandingLayout
      bgColor="#0F0F0F"
      seo={{
        title: "The Complete Account Abstraction Toolkit",
        description:
          "Add account abstraction to your web3 app & unlock powerful features for seamless onboarding, customizable transactions, & maximum security. Learn more.",
        openGraph: {
          images: [
            {
              url: `${getAbsoluteUrl()}/assets/og-image/smart-wallet.png`,
              width: 1200,
              height: 630,
              alt: "Account Abstraction ERC-4337",
            },
          ],
        },
      }}
    >
      <Container
        maxW="container.page"
        as={Flex}
        flexDir="column"
        gap={{ base: "80px", md: "120px" }}
      >
        <LandingHeroWithSideImage
          miniTitle="Powered by ERC-4337"
          title="The complete toolkit for"
          titleWithGradient="Account Abstraction"
          subtitle="Transform your app's user experience with signless transactions, multi-signature security, account recovery and more."
          trackingCategory={TRACKING_CATEGORY}
          ctaLink="/dashboard/connect/account-abstraction"
          contactUsTitle="Book Demo"
          gradient="linear(to-r, #4490FF, #4490FF)"
          image={require("../../public/assets/product-pages/smart-wallet/desktop-hero.png")}
          mobileImage={require("../../public/assets/product-pages/smart-wallet/mobile-hero.png")}
          miniImage={require("../../public/assets/product-icons/smart-wallet.png")}
        />
        <LandingDynamicSelector
          title="What can you build with account abstraction?"
          blackToWhiteTitle=""
          TRACKING_CATEGORY={TRACKING_CATEGORY}
          items={[
            {
              title: "Transform your apps UX",
              description:
                "Infinitely-customizable wallet transactions — with spend limits, batch transactions, and a signless & gasless combo for web2 users.",
              Component: (
                <ChakraNextImage
                  src={require("../../public/assets/product-pages/smart-wallet/invisible-wallet.png")}
                  alt=""
                  borderRadius="lg"
                />
              ),
            },
            {
              title: "Instant onboarding for every user",
              description:
                "Auth for the most popular web3 wallets and web2 login flows — with just an email, phone number, social account, or passkeys.",
              Component: (
                <ChakraNextImage
                  src={require("../../public/assets/product-pages/smart-wallet/pair-any-wallet.png")}
                  alt=""
                  borderRadius="lg"
                />
              ),
            },
            {
              title: "Enterprise-grade security",
              description:
                "Wallet recovery, 2FA, and multi-signature support for ultimate peace of mind — for users & teams.",
              Component: (
                <ChakraNextImage
                  src={require("../../public/assets/product-pages/smart-wallet/full-programmability.png")}
                  alt=""
                  borderRadius="lg"
                />
              ),
            },
          ]}
        />
        <Flex flexDir="column" gap={6} alignItems="center">
          <Heading
            as="h2"
            size="display.md"
            textAlign="center"
            px={{ base: 2, md: 0 }}
          >
            An all-in-one solution for
            <Box bgGradient="linear(to-r, #3385FF, #7BB0FF)" bgClip="text">
              Account Abstraction
            </Box>
          </Heading>
          <Text
            textAlign="center"
            size="body.xl"
            w={{ base: "100%", md: "60%" }}
          >
            Implement account abstraction into any web3 app — with a
            best-in-class SDK, full wallet customizability, and managed
            infrastructure.
          </Text>
        </Flex>
        <LandingShowcaseImage
          miniTitle="Smart Contracts"
          titleWithGradient="Fast Account Abstraction"
          title="factory deployment."
          gradient="linear(to-r, #3385FF, #7BB0FF)"
          description="Pre-built, audited, & customizable factory contracts with options for simple, managed, or dynamic permissions — deployable to any EVM network."
          image={require("../../public/assets/product-pages/smart-wallet/smart-contracts.png")}
        />
        <LandingShowcaseImage
          miniTitle="SDK"
          titleWithGradient="Integrate account abstraction"
          title="into your web3 apps."
          gradient="linear(to-r, #3385FF, #7BB0FF)"
          description="A best-in-class SDK with everything you need to build apps powered by account abstraction & generate accounts for your users — with full ERC-4337 compatibility."
          image={require("../../public/assets/product-pages/smart-wallet/account-abstraction.png")}
          imagePosition="left"
        />
        <LandingShowcaseImage
          miniTitle="UI Components"
          titleWithGradient="Drag and drop"
          title="UI Components."
          gradient="linear(to-r, #3385FF, #7BB0FF)"
          description="The easiest way to give accounts to your users with account abstraction — with UI components that are purpose-built for account abstraction & compatible with any existing ERC-4337 account, out of the box."
          image={require("../../public/assets/product-pages/smart-wallet/ui-components.png")}
        />
        <LandingShowcaseImage
          miniTitle="Managed Infrastructure"
          titleWithGradient="Support millions"
          title="of users."
          gradient="linear(to-r, #3385FF, #7BB0FF)"
          description="Managed infrastructure with everything you need to scale to millions of users — handling bundlers, paymasters, & all of the complexity so you can focus on building your app."
          image={require("../../public/assets/product-pages/smart-wallet/managed-infrastructure.png")}
          imagePosition="left"
        />
        <LandingShowcaseImage
          miniTitle="Dashboard & Analytics"
          titleWithGradient="Manage accouunts"
          title="& view onchain analytics."
          gradient="linear(to-r, #3385FF, #7BB0FF)"
          description="A single source of truth to view accounts, manage signers, and view balances for your web3 app — complete with onchain analytics."
          image={require("../../public/assets/product-pages/smart-wallet/dashboard.png")}
        />
        <LandingGuidesShowcase
          title="Get started with Account Abstraction"
          category={TRACKING_CATEGORY}
          description="See our quick-start guides to implement account abstraction into your web3 app"
          solution="Account Abstraction"
          guides={GUIDES}
        />

        <LandingEndCTA
          title="Add account abstraction"
          titleWithGradient="to your web3 app."
          trackingCategory={TRACKING_CATEGORY}
          ctaLink="/dashboard/connect/account-abstraction"
          gradient="linear(to-r, #3385FF, #7BB0FF)"
        />
      </Container>
    </LandingLayout>
  );
};

SmartWallet.pageId = PageId.SmartWalletLanding;

export default SmartWallet;
