import { AnimatedCLICommand } from "../AnimatedCLICommand/AnimatedCLICommand";
import { Aurora } from "../Aurora";
import { Flex, Grid, Icon, LightMode } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { HomepageSection } from "components/product-pages/homepage/HomepageSection";
import { useTrack } from "hooks/analytics/useTrack";
import Hero from "public/assets/landingpage/hero.png";
import { BsLightningCharge } from "react-icons/bs";
import { Heading, Link, LinkButton, Text } from "tw-components";

export const HeroSection = () => {
  const trackEvent = useTrack();
  return (
    <HomepageSection id="home" bottomPattern>
      {/* right */}
      <Aurora
        pos={{ left: "80%", top: "40%" }}
        size={{ width: "1400px", height: "1400px" }}
        color="hsl(260deg 78% 35% / 30%)"
      />

      {/* left */}
      <Aurora
        pos={{ left: "30%", top: "20%" }}
        size={{ width: "1800px", height: "1800px" }}
        color="hsl(290deg 92% 54% / 30%)"
      />

      <Grid
        pt={{
          base: 8,
          md: 16,
          lg: 24,
        }}
        templateColumns={{ base: "1fr", lg: "1fr auto" }}
        gap={{ base: 6, lg: 8 }}
        mb={{ base: 8, md: 0 }}
      >
        <Flex
          flexDir="column"
          gap={{ base: 6, md: 8 }}
          align={{ base: "center", lg: "start" }}
        >
          <Heading
            as="h2"
            letterSpacing="-0.04em"
            lineHeight={1.1}
            fontWeight={700}
            fontSize={{ base: "36px", md: "52px", lg: "64px" }}
            textAlign={{ base: "center", lg: "left" }}
          >
            The complete <br /> web3 development framework.
          </Heading>
          <Heading
            as="h3"
            size="subtitle.md"
            textAlign={{ base: "center", lg: "left" }}
            maxW="500px"
          >
            Leverage our powerful SDKs, CLI and robust dashboard to streamline
            your web3 app development. <br />
            <br /> Who said making a web3 app was supposed to be hard?
          </Heading>

          <LightMode>
            <Flex
              flexDirection={{ base: "column", md: "row" }}
              gap={4}
              mt={{ base: 8, md: 0 }}
            >
              <Flex flexDir="column" gap={3} flexGrow={1} minW={300}>
                <LinkButton
                  href="/dashboard"
                  onClick={() =>
                    trackEvent({
                      category: "cta-button",
                      action: "click",
                      label: "start",
                      title: "Start building",
                      experiment: "open_dashboard",
                    })
                  }
                  px={4}
                  py={7}
                  // h={{ base: "48px", md: "68px" }}
                  fontSize="20px"
                  leftIcon={<Icon as={BsLightningCharge} color="black" />}
                  color="black"
                  flexShrink={0}
                  background="rgba(255,255,255,1)"
                  _hover={{
                    background: "rgba(255,255,255,0.9)!important",
                  }}
                >
                  Go to Dashboard
                </LinkButton>
                <Link
                  href="#pricing"
                  onClick={(e) => {
                    const el = document.getElementById("pricing");
                    if (el) {
                      e.preventDefault();
                      el.scrollIntoView();
                    }
                  }}
                >
                  <Text
                    color="whiteAlpha.700"
                    size="label.sm"
                    fontStyle="italic"
                    textAlign="center"
                    whiteSpace={"nowrap"}
                  >
                    Completely free to use. No hidden fees.
                  </Text>
                </Link>
              </Flex>
              <AnimatedCLICommand />
            </Flex>
          </LightMode>
        </Flex>

        <ChakraNextImage
          display={{ base: "none", lg: "flex" }}
          alt=""
          maxW="100%"
          w={96}
          mt={8}
          src={Hero}
          priority
          quality={95}
          justifySelf="flex-end"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 30vw"
        />
      </Grid>
    </HomepageSection>
  );
};
