import { useForceDarkTheme } from "@/components/theme-provider";
import { Box, Divider, Flex } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import EarnReasonSection from "components/hackathon/EarnReasonSection";
import FAQEarn from "components/hackathon/FAQEarn";
import { HackathonEarnFooter } from "components/hackathon/HacakthonEarnFooter";
import { JudgesEarn } from "components/hackathon/JudgesEarn";
import { ScheduleSectionEarn } from "components/hackathon/ScheduleSectionEarn";
import { Aurora } from "components/homepage/Aurora";
import { HomepageTopNav } from "components/product-pages/common/Topnav";
import { HomepageSection } from "components/product-pages/homepage/HomepageSection";
import { useTrack } from "hooks/analytics/useTrack";
import { getAbsoluteUrl } from "lib/vercel-utils";
import { WandIcon } from "lucide-react";
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

const TRACKING_CATEGORY = "earn-thirdweb-hacakthon";

const title =
  "Game Developers Hackathon: Web3 Gaming Innovation at GDC 2024 | Earn Alliance & Thirdweb";

const description =
  "Game developers, join the Pixel Pioneers Hackathon at GDC 2024, hosted by Earn Alliance & ThirdWeb. Dive into Web3 game development for a 400K+ gamer community and lead blockchain gaming innovation. Sign Up Here.";

const HackathonEarn = () => {
  const trackEvent = useTrack();
  useForceDarkTheme();

  return (
    <>
      <NextSeo
        title={title}
        description={description}
        openGraph={{
          title,
          url: `${getAbsoluteUrl()}/hackathon/earn`,
          description,
          images: [
            {
              url: `${getAbsoluteUrl()}/assets/og-image/earn-hackathon.png`,
              width: 1200,
              height: 630,
              alt: "Earn Alliance & Thirdweb Hackathon",
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
              src={require("../../../public/assets/landingpage/block-left.png")}
              alt="hackathon-block-left"
              maxW="md"
              position="absolute"
              left={-375}
              top={0}
              display={{ base: "none", lg: "flex" }}
            />

            <ChakraNextImage
              src={require("../../../public/assets/landingpage/block-transparent.png")}
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
              src={require("../../../public/assets/landingpage/earnxtw.svg")}
              alt="Hackathon"
              w="full"
              maxW={{ base: "full", lg: "5xl" }}
            />

            <Heading
              size="title.xl"
              color="white"
              letterSpacing={5}
              textAlign="center"
            >
              GDC HACKATHON
            </Heading>

            <Heading
              size="title.sm"
              color="white"
              opacity={0.7}
              letterSpacing={5}
              textAlign="center"
            >
              FEBRUARY 27 — MARCH 16
            </Heading>

            <Flex minH="81px">
              <Timer dateStr="2024-03-17T12:00:00-08:00" />
            </Flex>

            <LinkButton
              href="https://hackathons.deform.cc/thirdweb"
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
              leftIcon={<WandIcon className="size-6" />}
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

        <Divider mt={16} />

        <Flex flexDir="column" gap={{ base: 100, md: 180 }} overflowX="hidden">
          <EarnReasonSection />

          <HomepageSection>
            <ScheduleSectionEarn />
          </HomepageSection>

          <HomepageSection>
            <Flex flexDir="column" alignItems="center" gap={8}>
              <Heading size="title.2xl" textStyle="center">
                Prizes & Benefits
              </Heading>
              <Flex
                flexDir="column"
                w="full"
                gap={4}
                maxW={707}
                fontSize={{ base: "18px", md: "20px" }}
                padding="0 22px"
              >
                <List color="white" styleType="none" spacing={3}>
                  <li>
                    100,000 $ALLY tokens to the top 3 projects
                    <List paddingLeft={4} styleType="disc" ml={3}>
                      <li className="mt-2">Grand Prize 50K $Ally Token</li>
                      <li className="mt-2">1st Place 30k $Ally Token</li>
                      <li className="mt-2">2nd Place 20K $Ally Token</li>
                    </List>
                  </li>
                  <li>Featured prototypes on Earn Alliance for 30 days.</li>
                  <li>
                    3 months free access to thirdweb Engine + Growth Plan.
                  </li>
                  <li>Social media amplification to over 200K+ followers.</li>
                </List>
              </Flex>
            </Flex>
          </HomepageSection>

          <HomepageSection>
            <Flex flexDir="column" alignItems="center" gap={8} padding="0 22px">
              <Heading size="title.2xl" textAlign="center">
                Guidelines
              </Heading>
              <Flex flexDir="column" gap={4} maxW={907}>
                <Text size="body.xl" color="white" fontWeight="bold">
                  Participants must:
                </Text>
                <Flex fontSize={{ base: "18px", md: "20px" }}>
                  <List color="white" styleType="none" spacing={3}>
                    <li>
                      Design a Unity 3D web mini-game with simple, engaging
                      tasks and crypto rewards.
                    </li>
                    <li>
                      Leverage thirdweb&apos;s developer tools for blockchain
                      tech
                    </li>
                    <li>Optionally, include NFT or crypto game rewards</li>
                    <li>
                      Integrate at least one challenge using the Earn Alliance
                      platform&apos;s events API
                    </li>
                  </List>
                </Flex>
              </Flex>
            </Flex>
          </HomepageSection>

          <HomepageSection>
            <Flex
              flexDir="column"
              alignItems="center"
              gap={8}
              position="relative"
              padding="0 22px"
            >
              <Box
                pointerEvents="none"
                width="100vw"
                height={{ base: "800px", md: "1000px" }}
                position="absolute"
                zIndex={-1}
                top="55%"
                left="50%"
                transform="translate(-50%, -50%)"
                backgroundImage="radial-gradient(ellipse at center, hsl(300deg 90% 50% / 15%), transparent 60%)"
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
                  Submissions will be evaluated on:
                </Text>

                <Flex fontSize={{ base: "18px", md: "20px" }}>
                  <List color="white" styleType="none" maxW={807} spacing={3}>
                    <li>
                      User Experience / Playability: How intuitive and easy is
                      the game?
                    </li>
                    <li>
                      Ecosystem impact: How impactful, useful, and creative does
                      the game leverage web3 technology to impact the web3 game
                      ecosystem as a whole?
                    </li>
                    <li>
                      Originality/innovation: How fun and novel is the game
                      versus existing web3 games
                    </li>
                  </List>
                </Flex>
              </Flex>
            </Flex>
          </HomepageSection>

          <HomepageSection>
            <Flex
              flexDir="column"
              alignItems="center"
              gap={8}
              position="relative"
            >
              <Box
                pointerEvents="none"
                width="100vw"
                height={{ base: "800px", md: "1000px" }}
                position="absolute"
                zIndex={-1}
                top="55%"
                left="50%"
                transform="translate(-50%, -50%)"
                backgroundImage="radial-gradient(ellipse at center, hsl(300deg 90% 50% / 15%), transparent 60%)"
              />
              <Heading size="title.2xl" textStyle="center">
                Event Details
              </Heading>
              <Flex flexDir="column" gap={4}>
                <Flex
                  flexDir="column"
                  gap={4}
                  maxW={907}
                  fontSize={{ base: "18px", md: "20px" }}
                  padding="0 22px"
                >
                  <List color="white" styleType="none" maxW={807} spacing={3}>
                    <li>Dates: February 27th — March 16th, 2024</li>
                    <li>
                      Remote Hackathon + In-person presentations and awards @
                      thirdweb&apos;s San Francisco offices on March 17th
                      <List paddingLeft={4} styleType="disc" ml={3} mt={2}>
                        <li>You can present remotely via discord</li>
                      </List>
                    </li>
                    <li>
                      Open to all skill levels, from beginners to experienced
                      developers
                    </li>
                    <li>
                      Team size: 1 to 4 members, all must be registered to
                      participate
                    </li>
                  </List>
                </Flex>
              </Flex>
            </Flex>
          </HomepageSection>

          <JudgesEarn />

          <FAQEarn TRACKING_CATEGORY={TRACKING_CATEGORY} />

          <HackathonEarnFooter TRACKING_CATEGORY={TRACKING_CATEGORY} />
        </Flex>
      </Flex>
    </>
  );
};

HackathonEarn.pageId = PageId.HackathonEarnLanding;

export default HackathonEarn;
