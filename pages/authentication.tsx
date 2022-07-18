import {
  Box,
  Center,
  DarkMode,
  Flex,
  LightMode,
  SimpleGrid,
} from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { AuthenticationCode } from "components/product-pages/authentication/AuthenticationCode";
import { AuthenticationExamples } from "components/product-pages/authentication/AuthenticationExamples";
import { HomepageSection } from "components/product-pages/common/Section";
import { HomepageFooter } from "components/product-pages/homepage/Footer";
import { HomepageTopNav } from "components/product-pages/homepage/Topnav";
import { GeneralCta } from "components/shared/GeneralCta";
import { useTrack } from "hooks/analytics/useTrack";
import WhiteLogo from "public/assets/landingpage/white-logo.png";
import Hero from "public/assets/product-pages/authentication/auth.png";
import { Heading, Text, TrackedLink } from "tw-components";

export default function Authentication() {
  const { Track } = useTrack({ page: "authentication" });

  return (
    <DarkMode>
      <Track>
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
          <HomepageSection topGradient bottomPattern>
            <SimpleGrid
              pt={{
                base: 24,
                md: 48,
              }}
              columns={{ base: 1, md: 2 }}
              spacing={{ base: 6, md: 8 }}
            >
              <Flex
                alignSelf="center"
                flexDir="column"
                gap={{ base: 6, md: 8 }}
                align={{ base: "initial", md: "start" }}
              >
                <Heading
                  as="h2"
                  size="display.sm"
                  textAlign={{ base: "center", md: "left" }}
                >
                  Simple wallet sign-in for your apps
                </Heading>
                <Heading
                  as="h3"
                  size="subtitle.md"
                  textAlign={{ base: "center", md: "left" }}
                >
                  Authenticate users with just their wallet. Add web3
                  functionality to any application.
                </Heading>
                <LightMode>
                  <GeneralCta
                    title="Get started"
                    size="lg"
                    href="https://portal.thirdweb.com/building-web3-apps/authenticating-users"
                    w={{ base: "full", md: "inherit" }}
                  />
                </LightMode>
              </Flex>
              <Flex
                display={{ base: "none", md: "flex" }}
                justifyContent="flex-end"
              >
                <ChakraNextImage
                  alt=""
                  maxW={96}
                  w={96}
                  mt={8}
                  src={Hero}
                  mr={12}
                />
              </Flex>
              <Flex
                display={{ base: "flex", md: "none" }}
                justifyContent="center"
              >
                <ChakraNextImage
                  alt=""
                  maxW={96}
                  w={96}
                  mt={8}
                  px={4}
                  src={Hero}
                />
              </Flex>
            </SimpleGrid>
          </HomepageSection>

          <HomepageSection bottomGradient overflow="hidden">
            <SimpleGrid
              flexDir="column"
              justifyContent="space-between"
              w="100%"
              columns={{ base: 1, md: 3 }}
              gap={{ base: 12, md: 6 }}
              py={48}
              px={{ base: 6, md: 0 }}
            >
              <SimpleGrid
                borderRadius="2xl"
                border="1px solid"
                borderColor="#ffffff26"
                overflow="hidden"
                columns={1}
              >
                <Flex
                  flexShrink={0}
                  flexGrow={0}
                  flexDir="column"
                  p={{ base: 4, md: 8 }}
                  gap={4}
                  bgColor="blackAlpha.300"
                >
                  <ChakraNextImage
                    src={require("/public/assets/product-pages/authentication/sign-in.png")}
                    placeholder="empty"
                    alt=""
                    w={12}
                  />
                  <Heading size="title.sm">Sign-in with just a wallet</Heading>
                  <Text size="body.lg">
                    Let users login to your apps with just their connected
                    wallet and instantly get access to your services.
                  </Text>
                </Flex>
              </SimpleGrid>

              <SimpleGrid
                borderRadius="2xl"
                border="1px solid"
                borderColor="#ffffff26"
                overflow="hidden"
                columns={1}
              >
                <Flex
                  flexShrink={0}
                  flexGrow={0}
                  flexDir="column"
                  p={{ base: 4, md: 8 }}
                  gap={4}
                  bgColor="blackAlpha.300"
                >
                  <ChakraNextImage
                    src={require("/public/assets/product-pages/authentication/verify.png")}
                    placeholder="empty"
                    alt=""
                    w={12}
                  />
                  <Heading size="title.sm">Verify on-chain identities</Heading>
                  <Text size="body.lg">
                    Securely verify the on-chain identities of your existing
                    users by using a{" "}
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
                  </Text>
                </Flex>
              </SimpleGrid>

              <SimpleGrid
                borderRadius="2xl"
                border="1px solid"
                borderColor="#ffffff26"
                overflow="hidden"
                columns={1}
              >
                <Flex
                  flexShrink={0}
                  flexGrow={0}
                  flexDir="column"
                  p={{ base: 4, md: 8 }}
                  gap={4}
                  bgColor="blackAlpha.300"
                >
                  <ChakraNextImage
                    src={require("/public/assets/product-pages/authentication/authenticate.png")}
                    placeholder="empty"
                    alt=""
                    w={12}
                  />
                  <Heading size="title.sm">Secure token authentication</Heading>
                  <Text size="body.lg">
                    Secure your backend with a web3-compatible authentication
                    system compliant with the widely used{" "}
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
                  </Text>
                </Flex>
              </SimpleGrid>
            </SimpleGrid>
          </HomepageSection>

          <HomepageSection middleGradient overflow="hidden">
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
          </HomepageSection>

          <HomepageSection
            id="developers"
            bottomPattern
            middleGradient
            overflow="hidden"
          >
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
                Integrate authentication with a few lines of code in your
                favorite languages.
              </Heading>

              <AuthenticationCode />
            </Flex>
          </HomepageSection>

          <HomepageSection bottomPattern bottomGradient overflow="hidden">
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
                Get started with authentication
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
                  href="https://portal.thirdweb.com/building-web3-apps/authenticating-users"
                  w={{ base: "full", md: "inherit" }}
                />
              </LightMode>
            </Flex>
          </HomepageSection>

          <HomepageFooter />
        </Flex>
      </Track>
    </DarkMode>
  );
}
