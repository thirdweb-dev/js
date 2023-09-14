// import { GuidesShowcase } from "../components/product-pages/common/GuideShowcase";
import { ProductSection } from "../components/product-pages/common/ProductSection";
import {
  Box,
  Flex,
  GridItem,
  LinkBox,
  LinkOverlay,
  SimpleGrid,
} from "@chakra-ui/react";
import { ConnectWallet, ThirdwebProvider } from "@thirdweb-dev/react";
import { ChakraNextImage } from "components/Image";
import { ChainIcon } from "components/icons/ChainIcon";
import { GuidesShowcase } from "components/product-pages/common/GuideShowcase";
import { Hero } from "components/product-pages/common/Hero";
import { HighlightedButton } from "components/product-pages/common/HighlightedButton";
import { ProductCard } from "components/product-pages/common/ProductCard";
import { ProductPage } from "components/product-pages/common/ProductPage";
import { ProductValueWithHighlight } from "components/product-pages/common/ProductValueWithHighlight";
import { getAbsoluteUrl } from "lib/vercel-utils";
import { PageId } from "page-id";
import React, { useState } from "react";
import { Card, Heading, Link, Text, TrackedLink } from "tw-components";
import { ThirdwebNextPage } from "utils/types";
import { dashboardSupportedWallets } from "components/app-layouts/providers";

const GRIDS = {
  "invisible-wallet-experience": (
    <SimpleGrid columns={12} spacing={12} mt={24}>
      <GridItem colSpan={{ base: 8, md: 3 }} mt={12}>
        <ProductValueWithHighlight circleLabel="1">
          User logs into mobile web3 game as “guest”
        </ProductValueWithHighlight>
      </GridItem>
      <GridItem colSpan={{ base: 8, md: 3 }} mt={12}>
        <ProductValueWithHighlight circleLabel="2">
          Developer generates a local wallet for user
        </ProductValueWithHighlight>
      </GridItem>
      <GridItem colSpan={{ base: 8, md: 3 }} mt={12}>
        <ProductValueWithHighlight circleLabel="3">
          User receives digital assets as they play game
        </ProductValueWithHighlight>
      </GridItem>
      <GridItem colSpan={{ base: 8, md: 3 }} mt={12}>
        <ProductValueWithHighlight circleLabel="4">
          Later on, user can upgrade local wallet to a non-custodial wallet so
          they can have full control of their digital assets
        </ProductValueWithHighlight>
      </GridItem>
    </SimpleGrid>
  ),
  "email-sign-in": (
    <SimpleGrid columns={12} spacing={12} mt={24}>
      <GridItem
        display={{
          base: "none",
          md: "block",
        }}
        colSpan={{ md: 2 }}
      />
      {/* Empty GridItem for centering */}
      <GridItem colSpan={{ base: 8, md: 3 }} mt={12}>
        <ProductValueWithHighlight circleLabel="1">
          User logs into app with their email address
        </ProductValueWithHighlight>
      </GridItem>
      <GridItem colSpan={{ base: 8, md: 3 }} mt={12}>
        <ProductValueWithHighlight circleLabel="2">
          A MPC wallet is generated for the user
        </ProductValueWithHighlight>
      </GridItem>
      <GridItem colSpan={{ base: 8, md: 3 }} mt={12}>
        <ProductValueWithHighlight circleLabel="3">
          User selects “claim digital asset” in app with no transaction signing
          required
        </ProductValueWithHighlight>
      </GridItem>
      <GridItem
        display={{
          base: "none",
          md: "block",
        }}
        colSpan={{ md: 1 }}
      />
      {/* Empty GridItem for centering */}
    </SimpleGrid>
  ),
  "smart-wallet": (
    <SimpleGrid columns={12} spacing={12} mt={24}>
      <GridItem
        display={{
          base: "none",
          md: "block",
        }}
        colSpan={{ md: 2 }}
      />
      <GridItem colSpan={{ base: 8, md: 3 }} mt={12}>
        <ProductValueWithHighlight circleLabel="1">
          User logs into app to buy digital assets from marketplace
        </ProductValueWithHighlight>
      </GridItem>
      <GridItem colSpan={{ base: 8, md: 3 }} mt={12}>
        <ProductValueWithHighlight circleLabel="2">
          A smart contract wallet is deployed for the user
        </ProductValueWithHighlight>
      </GridItem>
      <GridItem colSpan={{ base: 8, md: 3 }} mt={12}>
        <ProductValueWithHighlight circleLabel="3">
          User can execute multiple onchain actions with one click using batched
          transactions
        </ProductValueWithHighlight>
      </GridItem>
      <GridItem
        display={{
          base: "none",
          md: "block",
        }}
        colSpan={{ md: 1 }}
      />
      {/* Empty GridItem for centering */}
    </SimpleGrid>
  ),
};

const WALLETS = [
  {
    name: "Smart Wallet",
    description: "Deploy smart contract wallets for your users",
    iconUrl:
      "ipfs://QmeAJVqn17aDNQhjEU3kcWVZCFBrfta8LzaDGkS8Egdiyk/smart-wallet.svg",
    link: "https://portal.thirdweb.com/wallet/smart-wallet",
  },
  {
    name: "Local Wallet",
    description: "Generate wallets for new users on the fly",
    iconUrl:
      "ipfs://QmeAJVqn17aDNQhjEU3kcWVZCFBrfta8LzaDGkS8Egdiyk/local-wallet-desktop.svg",
    link: "https://portal.thirdweb.com/wallet/local-wallet",
  },
  {
    name: "Coinbase Wallet",
    description: "Connect with Coinbase Wallet",
    iconUrl:
      "ipfs://QmcJBHopbwfJcLqJpX2xEufSS84aLbF7bHavYhaXUcrLaH/coinbase.svg",
    link: "https://portal.thirdweb.com/wallet/coinbase-wallet",
  },
  {
    name: "MetaMask",
    description: "Connect with MetaMask",
    iconUrl:
      "ipfs://QmZZHcw7zcXursywnLDAyY6Hfxzqop5GKgwoq8NB9jjrkN/metamask.svg",
    link: "https://portal.thirdweb.com/wallet/metamask",
  },
  {
    name: "Paper",
    description: "Connect with email via Paper",
    iconUrl:
      "ipfs://QmNrLXtPoFrh4yjZbXui39zUMozS1oetpgU8dvZhFAxfRa/paper-logo-icon.svg",
    link: "https://portal.thirdweb.com/wallet/paper",
  },
  {
    name: "Ethers.js",
    description: "Connect any ethers.js compatible wallet",
    iconUrl: "ipfs://QmTWXcv6XnRqwUwEQxWp21oCrXZJ5QomiSTVBjKPQAv92k/ethers.png",
    link: "https://portal.thirdweb.com/wallet",
  },
  {
    name: "Private Key",
    description: "Connect a wallet directly by private key",
    iconUrl:
      "ipfs://QmNrycnX15y8EwxDPrwSxnwQgTBWRxUgwSirmhAFoGSod7/private-key.png",
    link: "https://portal.thirdweb.com/wallet",
  },
  {
    name: "AWS KMS",
    description: "Connect with AWS Key Management Service",
    iconUrl:
      "ipfs://QmVuWYpq5CaMfmbB1qMXXgc4dtUUGY31xiG6sxwvNafoZg/aws-kms.png",
    link: "https://portal.thirdweb.com/wallet",
  },
  {
    name: "AWS Secrets Manager",
    description: "Connect with AWS Secrets Manager",
    iconUrl:
      "ipfs://QmVuWYpq5CaMfmbB1qMXXgc4dtUUGY31xiG6sxwvNafoZg/aws-secrets-manager.png",
    link: "https://portal.thirdweb.com/wallet",
  },
  {
    name: "WalletConnect",
    description: "Connect with WalletConnect",
    iconUrl:
      "ipfs://QmX58KPRaTC9JYZ7KriuBzeoEaV2P9eZcA3qbFnTHZazKw/wallet-connect.svg",
    link: "https://portal.thirdweb.com/wallet/wallet-connect-v2",
  },
  {
    name: "Safe",
    description: "Connect to multi-sig wallets via Safe",
    iconUrl:
      "ipfs://QmbbyxDDmmLQh8DzzeUR6X6B75bESsNUFmbdvS3ZsQ2pN1/SafeToken.svg",
    link: "https://portal.thirdweb.com/wallet/safe",
  },
  {
    name: "Magic Link",
    description: "Connect with email or phone number via Magic",
    iconUrl:
      "ipfs://QmUMBFZGXxBpgDmZzZAHhbcCL5nYvZnVaYLTajsNjLcxMU/1-Icon_Magic_Color.svg",
    link: "https://portal.thirdweb.com/wallet",
  },
];

const GUIDES = [
  {
    title: "How to Add a Connect Wallet Button to Your Website",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2023/03/Add-a-connect-wallet-button-to-your-website-2.png",
    link: "https://blog.thirdweb.com/guides/add-connectwallet-to-your-website/",
  },
  {
    title: "How to use ERC-4337 Smart Wallets",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2023/05/How-to-use-smart-wallet-.png",
    link: "https://blog.thirdweb.com/guides/how-to-use-erc4337-smart-wallets/",
  },
  {
    title: "How to use Local Wallets",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2023/05/How-to-use-paper-wallet-with-thirdweb.png",
    link: "https://blog.thirdweb.com/guides/how-to-use-local-wallets/",
  },
];

const TRACKING_CATEGORY = "wallet-sdk";

const WalletSDK: ThirdwebNextPage = () => {
  const [selectedTab, setSelectedTab] = useState<
    "invisible-wallet-experience" | "email-sign-in" | "smart-wallet"
  >("invisible-wallet-experience");

  const descriptions = {
    "invisible-wallet-experience":
      "Improve your onboarding with an invisible web3 wallet experience",
    "email-sign-in":
      "Increase user activation rates with familiar web2 email sign-in flows",
    "smart-wallet":
      "Programmable wallets to enable 1-click batch transactions user experience",
  };

  return (
    <ProductPage
      seo={{
        title: "Wallet SDK: The Complete Web3 Wallet Toolkit",
        description:
          "Build any web3 wallet experience with thirdweb's Wallet SDK for Ethereum. Connect Wallet UI, ERC-4337 smart accounts, local wallets, and more.",
        openGraph: {
          images: [
            {
              url: `${getAbsoluteUrl()}/assets/og-image/wallet-sdk.png`,
              width: 2334,
              height: 1260,
              alt: "Wallet SDK: The Complete Web3 Wallet Toolkit",
            },
          ],
        },
      }}
    >
      <Hero
        trackingCategory={TRACKING_CATEGORY}
        name="Wallet SDK"
        title="Connect any wallet"
        description="Connect any wallet to your apps, from custodial wallets to non-custodial wallets."
        buttonText="Get started"
        buttonLink="/dashboard/wallets/wallet-sdk"
        image={require("public/assets/product-pages/wallet-sdk/hero.png")}
        gradient="linear-gradient(147.15deg, #410AB6 30.17%, #B4F1FF 100.01%)"
        imageHeight="650px"
        secondaryButton={{
          text: "Get In Touch",
          link: "/contact-us",
        }}
      >
        <SimpleGrid
          justifyContent="flex-start"
          w="100%"
          columns={{ base: 1, md: 3 }}
          gap={{ base: 12, md: 6 }}
          mb={{
            base: 12,
            md: 24,
          }}
        >
          <ProductCard
            title="Complete"
            icon={require("/public/assets/product-pages/dashboard/hero-icon-1.png")}
          >
            Build any wallet experience, including support for: non-custodial
            wallets, custodial wallets, MPC wallets, email wallets, and more.
            Cross-platform support (Web, Mobile, Unity).
          </ProductCard>
          <ProductCard
            title="Simple"
            icon={require("/public/assets/product-pages/dashboard/hero-icon-2.png")}
          >
            We’ve made the entire web3 wallet development simple. Out-of-the-box
            UI components for ConnectWallet button. SDK to connect with any
            wallet providers with our Connectors. Ready-to-deploy starter bases
            for smart wallets.
          </ProductCard>
          <ProductCard
            title="Composable"
            icon={require("/public/assets/product-pages/dashboard/hero-icon-3.png")}
          >
            <Text fontSize="lg">
              Use{" "}
              <TrackedLink
                href="https://portal.thirdweb.com/wallet"
                category={TRACKING_CATEGORY}
                textDecoration="underline"
                color="blue.200"
                target="_blank"
              >
                Wallet SDK
              </TrackedLink>{" "}
              as a turnkey out-of-the box solution or bring your own
              provider/solutions to complement with parts of our Wallet SDK.
            </Text>
          </ProductCard>
        </SimpleGrid>

        {/* Connect Wallet Button */}
        <ProductSection py={{ base: 12, lg: 24 }}>
          <Heading
            as="h2"
            size="display.sm"
            fontWeight={700}
            textAlign="center"
          >
            Connect Wallet Button
          </Heading>
          <ThirdwebProvider
            activeChain="goerli"
            supportedWallets={dashboardSupportedWallets}
          >
            <Flex flexDir="column" gap={12} mt={{ base: 2, md: 6 }}>
              <Flex
                direction={"column"}
                gap={4}
                justifyContent="center"
                alignItems="center"
              >
                <Text>
                  One line of code to add a{" "}
                  <Link
                    href="https://portal.thirdweb.com/react/react.connectwallet"
                    color="blue.400"
                    isExternal
                  >
                    Connect Wallet UI component
                  </Link>{" "}
                  to React, React Native and Unity apps.
                </Text>
                <Text>
                  Access the largest catalog of wallets, from custodial to MPC
                  to smart contracts.{" "}
                </Text>
                <Flex direction="row" justifyContent={"left"} mt={4}>
                  <Box
                    _hover={{
                      transition: "all 0.2s ease-in-out",
                      transform: "scale(1.05)",
                    }}
                  >
                    <ConnectWallet
                      theme="dark"
                      btnTitle="Try Connect Wallet"
                      auth={{
                        loginOptional: true,
                      }}
                    />
                  </Box>
                </Flex>
              </Flex>

              <Flex direction={"column"} gap={4}>
                <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                  {WALLETS.map((wallet) => (
                    <LinkBox key={wallet.name} position="relative" role="group">
                      <LinkOverlay href={wallet.link} isExternal>
                        <Card
                          as={Flex}
                          flexDir="column"
                          gap={3}
                          p={6}
                          _groupHover={{ borderColor: "blue.500" }}
                          position="relative"
                        >
                          <Flex justifyContent="space-between">
                            <Flex alignItems="center" gap={3}>
                              <ChainIcon size={25} ipfsSrc={wallet.iconUrl} />
                              <Heading size="subtitle.sm" as="h3" noOfLines={1}>
                                {wallet.name}
                              </Heading>
                            </Flex>
                          </Flex>
                          <Flex>
                            <Flex flexDir="column" gap={1} w="full">
                              <Text opacity={0.6}>{wallet.description}</Text>
                            </Flex>
                          </Flex>
                        </Card>
                      </LinkOverlay>
                    </LinkBox>
                  ))}
                </SimpleGrid>
              </Flex>
            </Flex>
          </ThirdwebProvider>
        </ProductSection>

        {/* Products */}
        <ProductSection py={{ base: 12, lg: 24 }}>
          <Heading
            as="h2"
            size="display.sm"
            fontWeight={700}
            textAlign="center"
            mb={{ base: 8, lg: 16 }}
          >
            How it works
          </Heading>
          <ChakraNextImage
            src={require("/public/assets/product-pages/wallet-sdk/how-it-works.png")}
            alt="How it works"
            mb={16}
            mx="auto"
            maxH="700px"
          />
          <SimpleGrid
            justifyContent="flex-start"
            w="100%"
            columns={{ base: 1, md: 3 }}
            gap={{ base: 12, md: 6 }}
          >
            <ProductCard
              title="Connect Wallet"
              icon={require("/public/assets/product-pages/wallet-sdk/connect-wallet.png")}
            >
              <Text fontSize="lg">
                Out-of-the-box UI components to easily integrate into your apps
                and games with cross-platform support (Unity, React,
                ReactNative).
              </Text>
              <Text fontSize="lg" mt={4}>
                Enable end users to connect with popular wallets (170+
                supported) across all types of wallets. Includes Safe multi-sig
                support.
              </Text>
            </ProductCard>
            <ProductCard
              title="Local Wallet"
              icon={require("/public/assets/product-pages/wallet-sdk/local-wallet.png")}
            >
              <Text fontSize="lg">
                Powerful tool with raw capabilities to build your own fully
                featured wallet solution
              </Text>
              <Text fontSize="lg" mt={4}>
                Everything you need to build your own fully featured wallet—
                from generating wallets on the backend to managing wallets
                (importing & exporting keys, save keys to secure storage, and
                private key recovery).
              </Text>
            </ProductCard>
            <ProductCard
              title="Smart Wallet"
              icon={require("/public/assets/product-pages/wallet-sdk/smart-wallet.png")}
            >
              <Text fontSize="lg">
                Deploy and manage ERC-4337{" "}
                <TrackedLink
                  href="https://portal.thirdweb.com/wallet/smart-wallet"
                  category={TRACKING_CATEGORY}
                  textDecoration="underline"
                  color="blue.200"
                  target="_blank"
                >
                  smart contract wallets
                </TrackedLink>{" "}
                for you users. Unlock fully programmable wallets with
                transaction batching, multiple owners, conditional gasless and
                your own custom functionality.
              </Text>
            </ProductCard>
          </SimpleGrid>
        </ProductSection>

        {/* Use cases */}
        <ProductSection py={{ base: 12, lg: 24 }}>
          <Heading
            as="h2"
            size="display.sm"
            fontWeight={700}
            textAlign="center"
            mb={{ base: 16, lg: 24 }}
          >
            What you can build with Wallet SDK
          </Heading>
          <Flex
            direction={{
              base: "column",
              md: "row",
            }}
            justifyContent="center"
            gap={{ base: 4, md: 8 }}
            mb={{ base: 8, md: 16 }}
          >
            <HighlightedButton
              isHighlighted={selectedTab === "invisible-wallet-experience"}
              title="Invisible wallet"
              minHeight="63px"
              width={{
                base: "full",
                md: "236px",
              }}
              onClick={() => {
                setSelectedTab("invisible-wallet-experience");
              }}
            />
            <HighlightedButton
              isHighlighted={selectedTab === "email-sign-in"}
              title="Email sign-in"
              minHeight="63px"
              width={{
                base: "full",
                md: "236px",
              }}
              onClick={() => {
                setSelectedTab("email-sign-in");
              }}
            />
            <HighlightedButton
              isHighlighted={selectedTab === "smart-wallet"}
              title="Smart wallet"
              minHeight="63px"
              width={{
                base: "full",
                md: "236px",
              }}
              onClick={() => {
                setSelectedTab("smart-wallet");
              }}
            />
          </Flex>
          <Text
            alignSelf="center"
            textAlign="center"
            mb={24}
            color="white"
            fontWeight="bold"
            fontSize="xl"
          >
            {descriptions[selectedTab]}
          </Text>
          <ChakraNextImage
            mx="auto"
            alt="invisible-wallet-experience"
            src={require(`/public/assets/product-pages/wallet-sdk/${selectedTab}.svg`)}
          />
          {GRIDS[selectedTab]}
        </ProductSection>
      </Hero>
      <GuidesShowcase
        title="Learn how to build"
        category={TRACKING_CATEGORY}
        description="Check out our Wallet SDK guides to start building"
        solution="Wallet"
        guides={GUIDES}
      />
    </ProductPage>
  );
};

WalletSDK.pageId = PageId.WalletSDKLanding;

export default WalletSDK;
