import { Box, Container, Flex } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { LandingDynamicSelector } from "components/landing-pages/dynamic-selector";
import { LandingEndCTA } from "components/landing-pages/end-cta";
import { LandingGuidesShowcase } from "components/landing-pages/guide-showcase";
import { LandingHeroWithSideImage } from "components/landing-pages/hero-with-side-image";
import { LandingShowcaseImage } from "components/landing-pages/showcase-image";
import type { Metadata } from "next";
import { Heading, Text } from "tw-components";
// images
import smartWalletMiniImage from "../../../../public/assets/product-icons/smart-wallet.png";
import accountAbstractionImage from "../../../../public/assets/product-pages/smart-wallet/account-abstraction.png";
import batchTxImage from "../../../../public/assets/product-pages/smart-wallet/batch-txns.png";
import dashboardImage from "../../../../public/assets/product-pages/smart-wallet/dashboard.png";
import desktopHero from "../../../../public/assets/product-pages/smart-wallet/desktop-hero.png";
import fullyProgrammaticImage from "../../../../public/assets/product-pages/smart-wallet/full-programmability.png";
import getStartedImage from "../../../../public/assets/product-pages/smart-wallet/get-started.png";
import invisibleWalletsImage from "../../../../public/assets/product-pages/smart-wallet/invisible-wallet.png";
import managedInfrastructureImage from "../../../../public/assets/product-pages/smart-wallet/managed-infrastructure.png";
import mobileHero from "../../../../public/assets/product-pages/smart-wallet/mobile-hero.png";
import pairAnyWalletImage from "../../../../public/assets/product-pages/smart-wallet/pair-any-wallet.png";
import smartContractsImage from "../../../../public/assets/product-pages/smart-wallet/smart-contracts.png";
import uiComponentsImage from "../../../../public/assets/product-pages/smart-wallet/ui-components.png";
import chooseContractImage from "../../../../public/assets/product-pages/smart-wallet/which-contract.png";
import { getAbsoluteUrl } from "../../../lib/vercel-utils";

const GUIDES = [
  {
    title: "The Quick-Start Guide to Account Abstraction",
    image: getStartedImage,
    link: "https://portal.thirdweb.com/wallets/smart-wallet/get-started",
  },
  {
    title: "Choosing Between Simple, Managed, & Dynamic Smart Accounts",
    image: chooseContractImage,
    link: "https://blog.thirdweb.com/smart-contract-deep-dive-building-smart-wallets-for-individuals-and-teams/",
  },
  {
    title: "How to Enable Batch Transactions with Account Abstraction",
    image: batchTxImage,
    link: "https://blog.thirdweb.com/guides/how-to-batch-transactions-with-the-thirdweb-sdk/",
  },
];

const TRACKING_CATEGORY = "smart-wallet-landing";

const title = "The Complete Account Abstraction Toolkit";
const description =
  "Add account abstraction to your web3 app & unlock powerful features for seamless onboarding, customizable transactions, & maximum security. Learn more.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    images: [
      {
        url: `${getAbsoluteUrl()}/assets/og-image/smart-wallet.png`,
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function Page() {
  return (
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
        ctaLink="https://portal.thirdweb.com/connect/account-abstraction/overview"
        contactUsTitle="Book Demo"
        gradient="linear(to-r, #4490FF, #4490FF)"
        image={desktopHero}
        mobileImage={mobileHero}
        miniImage={smartWalletMiniImage}
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
                src={invisibleWalletsImage}
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
                src={pairAnyWalletImage}
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
                src={fullyProgrammaticImage}
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
        <Text textAlign="center" size="body.xl" w={{ base: "100%", md: "60%" }}>
          Implement account abstraction into any web3 app — with a best-in-class
          SDK, full wallet customizability, and managed infrastructure.
        </Text>
      </Flex>
      <LandingShowcaseImage
        miniTitle="Smart Contracts"
        titleWithGradient="Fast Account Abstraction"
        title="factory deployment."
        gradient="linear(to-r, #3385FF, #7BB0FF)"
        description="Pre-built, audited, & customizable factory contracts with options for simple, managed, or dynamic permissions — deployable to any EVM network."
        image={smartContractsImage}
      />
      <LandingShowcaseImage
        miniTitle="SDK"
        titleWithGradient="Integrate account abstraction"
        title="into your web3 apps."
        gradient="linear(to-r, #3385FF, #7BB0FF)"
        description="A best-in-class SDK with everything you need to build apps powered by account abstraction & generate accounts for your users — with full ERC-4337 compatibility."
        image={accountAbstractionImage}
        imagePosition="left"
      />
      <LandingShowcaseImage
        miniTitle="UI Components"
        titleWithGradient="Drag and drop"
        title="UI Components."
        gradient="linear(to-r, #3385FF, #7BB0FF)"
        description="The easiest way to give accounts to your users with account abstraction — with UI components that are purpose-built for account abstraction & compatible with any existing ERC-4337 account, out of the box."
        image={uiComponentsImage}
      />
      <LandingShowcaseImage
        miniTitle="Managed Infrastructure"
        titleWithGradient="Support millions"
        title="of users."
        gradient="linear(to-r, #3385FF, #7BB0FF)"
        description="Managed infrastructure with everything you need to scale to millions of users — handling bundlers, paymasters, & all of the complexity so you can focus on building your app."
        image={managedInfrastructureImage}
        imagePosition="left"
      />
      <LandingShowcaseImage
        miniTitle="Dashboard & Analytics"
        titleWithGradient="Manage accounts"
        title="& view onchain analytics."
        gradient="linear(to-r, #3385FF, #7BB0FF)"
        description="A single source of truth to view accounts, manage signers, and view balances for your web3 app — complete with onchain analytics."
        image={dashboardImage}
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
        ctaLink="https://portal.thirdweb.com/connect/account-abstraction/overview"
        gradient="linear(to-r, #3385FF, #7BB0FF)"
      />
    </Container>
  );
}
