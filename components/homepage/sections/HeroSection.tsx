import { CLICommand } from "../CLICommand";
import { Flex, Icon, LightMode, SimpleGrid } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { HomepageSection } from "components/product-pages/homepage/HomepageSection";
import { useTrack } from "hooks/analytics/useTrack";
import Hero from "public/assets/landingpage/hero.png";
import MobileHero from "public/assets/landingpage/mobile-hero.png";
import { BsLightningCharge } from "react-icons/bs";
import { Heading, Link, LinkButton, Text } from "tw-components";

export function HeroSection() {
  const trackEvent = useTrack();
  return (
    <HomepageSection id="home" topGradient bottomPattern>
      <SimpleGrid
        pt={{
          base: 0,
          md: 16,
          lg: 24,
        }}
        columns={{ base: 1, md: 2 }}
        spacing={{ base: 6, md: 8 }}
      >
        <Flex
          flexDir="column"
          gap={{ base: 6, md: 8 }}
          align={{ base: "initial", md: "start" }}
        >
          <Heading
            as="h2"
            size="display.sm"
            textAlign={{ base: "center", md: "left" }}
          >
            The complete web3 development framework.
          </Heading>
          <Heading
            as="h3"
            size="subtitle.md"
            textAlign={{ base: "center", md: "left" }}
          >
            Everything you need to connect your apps or games to decentralized
            networks. Powerful tools that simplify web3 development.
          </Heading>

          <Flex direction="column">
            <LightMode>
              <Flex
                direction={{ base: "column", lg: "row" }}
                align="center"
                gap={6}
              >
                <Flex flexDir="column" gap={3}>
                  <LinkButton
                    href="/dashboard"
                    onClick={() =>
                      trackEvent({
                        category: "cta-button",
                        action: "click",
                        label: "start",
                        title: "Start building",
                      })
                    }
                    h="68px"
                    w={{ base: "100%", md: "290px" }}
                    fontSize="20px"
                    leftIcon={
                      <Icon as={BsLightningCharge} color="yellow.500" />
                    }
                    color="black"
                    flexShrink={0}
                    background="rgba(255,255,255,1)"
                    _hover={{
                      background: "rgba(255,255,255,0.9)!important",
                    }}
                  >
                    Start building
                  </LinkButton>
                  <Link href="#pricing">
                    <Text
                      color="gray.600"
                      size="label.sm"
                      fontStyle="italic"
                      textAlign="center"
                    >
                      Completely free to use. No hidden fees.
                    </Text>
                  </Link>
                </Flex>
                <CLICommand text="npx thirdweb@latest" />
              </Flex>
            </LightMode>
          </Flex>
        </Flex>
        <Flex display={{ base: "none", md: "flex" }} justifyContent="flex-end">
          <ChakraNextImage
            alt=""
            maxW={96}
            w={96}
            mt={8}
            src={Hero}
            mr={12}
            priority
          />
        </Flex>
        <Flex display={{ base: "flex", md: "none" }} justifyContent="center">
          <ChakraNextImage
            alt=""
            maxW={96}
            w={96}
            mt={8}
            px={4}
            src={MobileHero}
          />
        </Flex>
      </SimpleGrid>
    </HomepageSection>
  );
}
