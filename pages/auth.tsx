import { ThirdwebNextPage } from "./_app";
import { Box, Center, Flex, LightMode, SimpleGrid } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { AuthenticationExamples } from "components/product-pages/authentication/AuthenticationExamples";
import { Hero } from "components/product-pages/common/Hero";
import { ProductCard } from "components/product-pages/common/ProductCard";
import { ProductPage } from "components/product-pages/common/ProductPage";
import { ProductSection } from "components/product-pages/common/ProductSection";
import { CodeSelector } from "components/product-pages/homepage/CodeSelector";
import { GeneralCta } from "components/shared/GeneralCta";
import { PageId } from "page-id";
import WhiteLogo from "public/assets/landingpage/white-logo.png";
import { Heading, TrackedLink } from "tw-components";

const Authentication: ThirdwebNextPage = () => {
  return (
    <ProductPage
      seo={{
        title: "Auth",
        description:
          "Simple wallet based sign-in and authentication for any app.",
      }}
    >
      <Hero
        trackingCategory="auth"
        name="Auth"
        title="Simple wallet sign-in for your apps"
        description="Authenticate users with just their wallet. Add web3 functionality to any application."
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
            title="Sign-in with just a wallet"
            icon={require("/public/assets/product-pages/authentication/sign-in.png")}
          >
            Let users login to your apps with just their connected wallet and
            instantly get access to your services.
          </ProductCard>
          <ProductCard
            title="Verify on-chain identities"
            icon={require("/public/assets/product-pages/authentication/verify.png")}
          >
            Securely verify the on-chain identities of your existing users by
            using a{" "}
            <TrackedLink
              color="white"
              fontWeight="medium"
              href="https://eips.ethereum.org/EIPS/eip-4361"
              category="authentication"
              label="sign-in-with-ethereum"
              isExternal
            >
              Sign-in with Ethereum
            </TrackedLink>{" "}
            compliant flow.
          </ProductCard>
          <ProductCard
            title="Secure token authentication"
            icon={require("/public/assets/product-pages/authentication/authenticate.png")}
          >
            Secure your backend with a web3-compatible authentication system
            compliant with the widely used{" "}
            <TrackedLink
              color="white"
              fontWeight="medium"
              href="https://jwt.io"
              category="authentication"
              label="jwt"
              isExternal
            >
              JSON Web Token
            </TrackedLink>{" "}
            standard.
          </ProductCard>
        </SimpleGrid>
      </Hero>

      <ProductSection overflow="hidden">
        <Flex
          flexDir="column"
          py={{ base: 24, lg: 48 }}
          align="center"
          gap={{ base: 12, lg: 24 }}
        >
          <Heading
            as="h2"
            bgGradient="linear(to-r, #907EFF, #C5D8FF)"
            bgClip="text"
            size="display.sm"
            fontWeight={700}
            textAlign="center"
          >
            What can you build?
          </Heading>
          <AuthenticationExamples />
        </Flex>
      </ProductSection>

      <ProductSection id="developers" overflow="hidden">
        <Flex
          flexDir="column"
          py={{ base: 12, lg: 24 }}
          align="center"
          gap={{ base: 6, md: 8 }}
        >
          <Heading
            as="h2"
            size="display.sm"
            fontWeight={700}
            textAlign="center"
          >
            Plug-and-play authentication SDKs
          </Heading>
          <Heading
            as="h3"
            maxW="600px"
            textAlign="center"
            color="whiteAlpha.600"
            size="subtitle.md"
          >
            Integrate authentication with a few lines of code in your favorite
            languages.
          </Heading>

          <CodeSelector
            snippets="auth"
            docs="https://portal.thirdweb.com/auth"
          />
        </Flex>
      </ProductSection>

      <ProductSection showPattern overflow="hidden">
        <Flex
          flexDir="column"
          pt={{ base: 12, lg: 24 }}
          pb={{ base: 24, lg: 0 }}
          align="center"
          gap={{ base: 6, md: 8 }}
        >
          <Center mb={6} pt={{ base: 8, lg: 24 }}>
            <Center p={2} position="relative" mb={6}>
              <Box
                position="absolute"
                bgGradient="linear(to-r, #F213A4, #040BBF)"
                top={0}
                left={0}
                bottom={0}
                right={0}
                borderRadius="3xl"
                overflow="visible"
                filter="blur(15px)"
              />

              <ChakraNextImage
                alt=""
                boxSize={{ base: 24, md: 32 }}
                placeholder="empty"
                src={WhiteLogo}
              />
            </Center>
          </Center>
          <Heading as="h2" size="display.sm" textAlign="center">
            Get started with auth
          </Heading>
          <Heading
            as="h3"
            maxW="600px"
            textAlign="center"
            color="whiteAlpha.600"
            size="subtitle.md"
          >
            Explore our documentation to learn how you can integrate wallet
            authentication into your applications today.
          </Heading>
          <LightMode>
            <GeneralCta
              size="lg"
              href="https://portal.thirdweb.com/auth"
              w={{ base: "full", md: "inherit" }}
            />
          </LightMode>
        </Flex>
      </ProductSection>
    </ProductPage>
  );
};

Authentication.pageId = PageId.AuthenticationLanding;

export default Authentication;
