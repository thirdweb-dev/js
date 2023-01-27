import { Box, Flex, SimpleGrid } from "@chakra-ui/react";
import { Aurora } from "components/homepage/Aurora";
import { NewsletterSection } from "components/homepage/sections/NewsletterSection";
import { SDKSection } from "components/homepage/sections/SDKSection";
import { AuthenticationExamples } from "components/product-pages/authentication/AuthenticationExamples";
import { GuidesShowcase } from "components/product-pages/common/GuideShowcase";
import { Hero } from "components/product-pages/common/Hero";
import { ProductCard } from "components/product-pages/common/ProductCard";
import { ProductPage } from "components/product-pages/common/ProductPage";
import { ProductSection } from "components/product-pages/common/ProductSection";
import { PageId } from "page-id";
import { Heading, TrackedLink } from "tw-components";
import { ThirdwebNextPage } from "utils/types";

const TRACKING_CATEGORY = "auth";

const GUIDES = [
  {
    title: "How to Create a Web3 Creator Platform with a Web2 Backend",
    image:
      "https://blog.thirdweb.com/content/images/size/w1000/2022/09/web3-creator-platform-bg.png",
    link: "https://blog.thirdweb.com/guides/how-to-create-a-web3-creator-platform/",
  },
  {
    title: "Create An NFT Gated Website",
    image:
      "https://blog.thirdweb.com/content/images/size/w1000/2022/08/thumbnail-31.png",
    link: "https://blog.thirdweb.com/guides/nft-gated-website/",
  },
  {
    title: "Accept Stripe Subscription Payments For Your Web3 App",
    image:
      "https://blog.thirdweb.com/content/images/size/w1000/2022/09/This-is-the-one-3.png",
    link: "https://blog.thirdweb.com/guides/add-stripe-subscriptions-with-web3-auth/",
  },
];

const Authentication: ThirdwebNextPage = () => {
  return (
    <ProductPage
      seo={{
        title: "Auth",
        description: "Authenticate users with their wallets",
      }}
    >
      {/* Hero */}
      <Hero
        trackingCategory={TRACKING_CATEGORY}
        name="Auth"
        title="Authenticate users with their wallets"
        description="Authenticate users with just their wallet. Build powerful web3 functionality into web2 experiences."
        buttonText="Get started"
        buttonLink="https://portal.thirdweb.com/auth"
        gradient="linear-gradient(147.15deg, #410AB6 30.17%, #FF8D5C 100.01%)"
        image={require("public/assets/product-pages/authentication/auth.png")}
      >
        <SimpleGrid
          justifyContent="flex-start"
          w="100%"
          columns={{ base: 1, md: 3 }}
          gap={{ base: 12, md: 6 }}
        >
          <ProductCard
            title="Simplify sign-in flow"
            icon={require("/public/assets/product-pages/authentication/sign-in.png")}
          >
            Simplify sign in flow by allowing any user to sign-in to any app
            using their web3 wallet.
          </ProductCard>
          <ProductCard
            title="Verify on-chain identities"
            icon={require("/public/assets/product-pages/authentication/verify.png")}
          >
            {/* span required for inline-context */}
            <span>
              Built on the SIWE{" ("}
              <TrackedLink
                color="white"
                fontWeight="medium"
                href="https://eips.ethereum.org/EIPS/eip-4361"
                category={TRACKING_CATEGORY}
                label="sign-in-with-ethereum"
                isExternal
              >
                Sign-in with Ethereum
              </TrackedLink>
              {") "}
              standard. Securely verify a user{`'`}s on-chain identity, without
              relying on a centralized database to verify their identity.
            </span>
          </ProductCard>
          <ProductCard
            title="Secure token authentication"
            icon={require("/public/assets/product-pages/authentication/authenticate.png")}
          >
            {/* span required for inline-context */}
            <span>
              Secure your backend with a web3-compatible authentication system
              compliant with the widely used{" "}
              <TrackedLink
                color="white"
                fontWeight="medium"
                href="https://jwt.io"
                category={TRACKING_CATEGORY}
                label="jwt"
                isExternal
              >
                JSON Web Token
              </TrackedLink>{" "}
              standard.
            </span>
          </ProductCard>
        </SimpleGrid>
      </Hero>

      {/* SDK */}
      <ProductSection
        id="developers"
        overflow="hidden"
        py={{ base: 12, lg: 24 }}
      >
        <SDKSection
          title="Integrate web3 into your apps and games"
          description="Powerful SDKs to integrate web3-compatible authentication into your apps and games. Works with any backend, framework, or service."
          codeSelectorProps={{
            snippets: "auth",
            docs: "https://portal.thirdweb.com/auth",
          }}
        />

        <Aurora
          pos={{ left: "50%", top: "40%" }}
          size={{ width: "2000px", height: "1300px" }}
          color={"hsl(223deg 40% 15%)"}
        />
      </ProductSection>

      {/* Use Cases */}
      <ProductSection overflow="hidden">
        <Flex
          flexDir="column"
          py={{ base: 24, lg: 48 }}
          align="center"
          gap={{ base: 12, lg: 24 }}
        >
          <Box>
            <Heading
              as="h2"
              bgGradient="linear(to-r, #907EFF, #C5D8FF)"
              bgClip="text"
              size="display.sm"
              fontWeight={700}
              textAlign="center"
              mb={6}
            >
              Auth for every use case
            </Heading>

            <Heading
              as="h3"
              size="subtitle.lg"
              textAlign="center"
              maxW="container.lg"
            >
              Explore use cases that require user{`'`}s wallet addresses on the
              backend.
            </Heading>
          </Box>

          <AuthenticationExamples />
        </Flex>
      </ProductSection>

      {/* Guides */}
      <GuidesShowcase
        title="Learn how to build"
        category={TRACKING_CATEGORY}
        description="Check out our guides to learn how to build with Auth"
        solution="Auth"
        guides={GUIDES}
      />

      <NewsletterSection />
    </ProductPage>
  );
};

Authentication.pageId = PageId.AuthenticationLanding;

export default Authentication;
