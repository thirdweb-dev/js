import { Box, DarkMode, Divider, Flex, Icon, ListItem } from "@chakra-ui/react";
import { ImMagicWand } from "@react-icons/all-files/im/ImMagicWand";
import { ChakraNextImage } from "components/Image";
import FAQ from "components/hackathon/FAQ";
import { HackathonFooter } from "components/hackathon/HackathonFooter";
import { Judges } from "components/hackathon/Judges";
import Reason from "components/hackathon/Reason";
import { ScheduleSection } from "components/hackathon/ScheduleSection";
import { Sponsors } from "components/hackathon/Sponsors";
import { Aurora } from "components/homepage/Aurora";
import { HomepageTopNav } from "components/product-pages/common/Topnav";
import { HomepageSection } from "components/product-pages/homepage/HomepageSection";
import { useTrack } from "hooks/analytics/useTrack";
import { getAbsoluteUrl } from "lib/vercel-utils";
import { NextSeo } from "next-seo";
import dynamic from "next/dynamic";
import { PageId } from "page-id";
import { Heading, LinkButton, Text } from "tw-components";

const List = dynamic(
  () => import("@chakra-ui/react").then((result) => result.List),
  {
    ssr: false,
  },
);

const Timer = dynamic(() => import("components/hackathon/Timer"), {
  ssr: false,
});

const TRACKING_CATEGORY = "caldera-thirdweb-hacakthon";

const Hackathon = () => {
  const trackEvent = useTrack();
  return (
    <DarkMode>
      <NextSeo
        title="Consumer Crypto Hackathon | Presented by Caldera & thirdweb"
        description="Join the Consumer Crypto Hackathon and build the next billion-dollar consumer web3 app — presented by Caldera & thirdweb. Learn more & sign up here."
        openGraph={{
          title: "Consumer Crypto Hackathon | Presented by thirdweb",
          url: "https://thirdweb.com/hackathon/consumer-crypto",
          description:
            "Join the Consumer Crypto Hackathon and build the next billion-dollar consumer web3 app — presented by thirdweb. Learn more & sign up here.",
          images: [
            {
              url: `${getAbsoluteUrl()}/assets/og-image/hackathon.png`,
              width: 1200,
              height: 630,
              alt: "Consumer Crypto Hackathon | Presented by thirdweb",
            },
          ],
        }}
      />

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
      >
        <HomepageTopNav />
        <HomepageSection id="header" overflowY="hidden" isOverflowXHidden>
          <Flex
            flexDir="column"
            align="center"
            gap={10}
            mt={{ base: 12, md: 24 }}
            zIndex={2}
            position="relative"
          >
            <ChakraNextImage
              src={require("public/assets/landingpage/block-left.png")}
              alt="hackathon-block-left"
              maxW="xl"
              position="absolute"
              left={-375}
              top={0}
              display={{ base: "none", lg: "flex" }}
            />

            <ChakraNextImage
              src={require("public/assets/landingpage/block-transparent.png")}
              alt="hackathon-block-left"
              maxW="230"
              position="absolute"
              right={200}
              top={-100}
              display={{ base: "none", lg: "flex" }}
            />

            {/* right */}
            <Aurora
              pos={{ left: "50%", top: "0" }}
              size={{ width: "100vw", height: "1000px" }}
              color="hsl(260deg 100% 55% / 30%)"
            />

            <ChakraNextImage
              src={require("public/assets/landingpage/thirdwebw.svg")}
              alt="Hackathon"
              maxW={{ base: "full", md: "xl" }}
            />

            <ChakraNextImage
              src={require("public/assets/landingpage/consumer-crypto-logo.svg")}
              alt="Hackathon"
              maxW={{ base: "full", lg: "5xl" }}
            />
            <Heading
              size="title.sm"
              color="white"
              opacity={0.7}
              letterSpacing={5}
              textAlign="center"
            >
              FEBRUARY 16 - 18
            </Heading>

            <Timer dateStr="2024-02-16T09:00:00-08:00" />

            <LinkButton
              href="https://forms.gle/e7rsvAR2zbfimar78"
              onClick={() =>
                trackEvent({
                  category: "hackathon",
                  action: "click",
                  label: "register-now",
                })
              }
              h="68px"
              w={{ base: "100%", md: 96 }}
              fontSize="20px"
              leftIcon={<Icon as={ImMagicWand} />}
              color="black"
              flexShrink={0}
              background="rgba(255,255,255,1)"
              _hover={{
                background: "rgba(255,255,255,0.9)!important",
              }}
              isExternal
              noIcon
            >
              Register now
            </LinkButton>
          </Flex>
        </HomepageSection>
        <HomepageSection>
          <Sponsors TRACKING_CATEGORY={TRACKING_CATEGORY} />
        </HomepageSection>
        <Divider mt={16} />

        <Flex
          flexDir={"column"}
          gap={{ base: 100, md: 180 }}
          overflowX="hidden"
        >
          <Reason />

          <HomepageSection>
            <ScheduleSection />
          </HomepageSection>

          <HomepageSection>
            <Flex flexDir="column" alignItems="center" gap={8}>
              <Heading size="title.2xl" textStyle="center">
                Prizes & Benefits
              </Heading>
              <Flex flexDir="column" gap={4} maxW={907}>
                <Text size="body.xl">
                  <List color="white">
                    <ListItem>
                      • $10,000 in thirdweb credits — $5K for 1st place, $3K for
                      2nd place, $2K for 3rd place
                    </ListItem>
                    <ListItem>• 1 ETH for 1st Place</ListItem>
                    <ListItem>
                      • Meet & present to builders, operators, & investors in
                      crypto — from Caldera, Pantera Capital, Founders Inc, and
                      Haun Ventures
                    </ListItem>
                    <ListItem>
                      • Amplification to 70k+ followers on thirdweb&apos;s
                      social channels
                    </ListItem>
                    <ListItem>
                      • $50 Gas Sponsorship for every hackathon builder
                    </ListItem>
                  </List>
                </Text>
              </Flex>
            </Flex>
          </HomepageSection>

          <HomepageSection>
            <Flex flexDir="column" alignItems="center" gap={8}>
              <Heading size="title.2xl" textAlign="center">
                Guidelines
              </Heading>
              <Flex flexDir="column" gap={4} maxW={907}>
                <Text size="body.xl" color="white" fontWeight="bold">
                  To be eligible to win the hackathon, submitted projects must
                  fulfill the following requirements:
                </Text>
                <Text size="body.xl">
                  <List color="white">
                    <ListItem>
                      • Built using any of the following thirdweb products:
                      Engine, Embedded Wallets, and/or Account Abstraction
                    </ListItem>
                    <ListItem>• Code must be open-source</ListItem>
                    <ListItem>
                      • Project must be submitted through GitHub, with a
                      descriptive README file detailing what the project is,
                      what its goals are, and how you built it
                    </ListItem>
                  </List>
                </Text>
                <Text size="body.xl" color="white">
                  Participants will be able to submit their project to the form
                  in the hackathon landing page before the deadline, on{" "}
                  <b>February 18th at 9:00am PST</b>.
                </Text>
              </Flex>
            </Flex>
          </HomepageSection>

          <HomepageSection>
            <Flex
              flexDir="column"
              alignItems="center"
              gap={8}
              position={"relative"}
            >
              <Box
                pointerEvents={"none"}
                width="100vw"
                height={{ base: "800px", md: "1000px" }}
                position="absolute"
                zIndex={-1}
                top="55%"
                left="50%"
                transform="translate(-50%, -50%)"
                backgroundImage={`radial-gradient(ellipse at center, hsl(300deg 90% 50% / 15%), transparent 60%)`}
              />
              <Heading size="title.2xl" textStyle="center">
                Judging Criteria
              </Heading>
              <Flex flexDir="column" gap={4}>
                <Text
                  size="body.xl"
                  color="white"
                  fontWeight="bold"
                  textAlign="left"
                >
                  Our judges will grade submissions across 3 equally-weighted
                  categories:
                </Text>
                <Text size="body.xl" color="white">
                  <List>
                    <ListItem>
                      <b>1. Usability:</b> How useful or valuable is the
                      product? How feasible is the idea?
                    </ListItem>
                    <ListItem>
                      <b>2. Ecosystem Impact:</b> How impactful and useful is
                      this app in the web3 ecosystem as a whole?
                    </ListItem>
                    <ListItem>
                      <b>3. Originality, Creativity, and Innovation:</b> How
                      novel is the project versus existing technologies?
                    </ListItem>
                  </List>
                </Text>
              </Flex>
            </Flex>
          </HomepageSection>

          <Judges TRACKING_CATEGORY={TRACKING_CATEGORY} />

          <FAQ TRACKING_CATEGORY={TRACKING_CATEGORY} />

          <HackathonFooter TRACKING_CATEGORY={TRACKING_CATEGORY} />
        </Flex>
      </Flex>
    </DarkMode>
  );
};

Hackathon.pageId = PageId.HackathonLanding;

export default Hackathon;
