import { Box, DarkMode, Flex, Image, List, ListItem } from "@chakra-ui/react";
import { ClientOnly } from "components/ClientOnly/ClientOnly";
import { ChakraNextImage } from "components/Image";
import { HomepageFooter } from "components/footer/Footer";
import { AvatarShowcase } from "components/hackathon/common/AvatarShowcase";
import { ScheduleSection } from "components/hackathon/common/ScheduleSection";
import { Sponsors } from "components/hackathon/common/Sponsors";
import { CTAFooter } from "components/hackathon/gaming/CTAFooter";
import { FaqSection } from "components/hackathon/gaming/FAQSection";
import { GameShowcase } from "components/hackathon/gaming/GameShowcase";
import { Resources } from "components/hackathon/gaming/Resources";
import { HomepageTopNav } from "components/product-pages/common/Topnav";
import { HomepageSection } from "components/product-pages/homepage/HomepageSection";
import { isAfter } from "date-fns/isAfter";
import { useTrack } from "hooks/analytics/useTrack";
import { NextSeo } from "next-seo";
import dynamic from "next/dynamic";
import { PageId } from "page-id";
import { Heading, Link, LinkButton, Text } from "tw-components";
import { ThirdwebNextPage } from "utils/types";

const Timer = dynamic(() => import("components/hackathon/common/Timer"), {
  ssr: false,
});

const metadata = {
  title:
    "Join the 'Ready Player 3' Hackathon and Transform the Gaming World with Web3 and Unity!",
  description:
    "Unleash your full potential as a game dev and build the future of gaming with thirdweb's 'Ready Player 3' Hackathon. Supported by Coinbase Cloud and more.",
};

const sponsors = [
  {
    name: "Coinbase",
    logo: "/assets/investors/coinbase-cloud-white.svg",
    link: "https://www.coinbase.com/",
  },
  {
    name: "AWS activate",
    logo: "/assets/hackathon/sponsors/aws.svg",
    link: "https://aws.amazon.com/",
  },
  {
    name: "Scenario",
    logo: "/assets/hackathon/sponsors/scenario.png",
    link: "https://scenario.gg/",
  },
  {
    name: "Consensus",
    logo: "/assets/hackathon/sponsors/consensus.png",
    link: "https://www.coindesk.com/consensus/",
  },
  {
    name: "Spindl",
    logo: "/assets/hackathon/sponsors/spindl.png",
    link: "https://www.spindl.xyz/",
  },
  // {
  //   name: "Optimism",
  //   logo: "/assets/hackathon/sponsors/optimism.png",
  //   link: "https://www.optimism.io/",
  // },
  {
    name: "Fractal",
    logo: "/assets/hackathon/sponsors/fractal.png",
    link: "https://www.fractal.is/",
  },
];

const judges = [
  {
    name: "Antonio Garcia Martinez",
    twitter: "antoniogm",
    image: "/assets/landingpage/antonio-garcia.jpg",
    company: "Spindl",
  },
  {
    name: "Justin Kan",
    twitter: "justinkan",
    image: "/assets/landingpage/justin-kan.jpg",
    company: "Fractal",
  },
  {
    name: "Emmanuel de Maistre",
    twitter: "emmanuel_2m",
    image: "/assets/landingpage/emmanuel.jpg",
    company: "Scenario",
  },
  {
    name: "Kevin DeGods",
    twitter: "kevindegods",
    image: "/assets/landingpage/kevin-degods.png",
    company: "Dust Labs",
  },
  {
    name: "Sam Frankel",
    twitter: "sfrankel9",
    image: "/assets/landingpage/sam-frankel.jpg",
    company: "Coinbase",
  },
];

const mentors = [
  {
    name: "Drew Falkman",
    twitter: "drewfalkman",
    image: "/assets/landingpage/drew-falkman2.jpg",
    company: "frens",
  },
  {
    name: "Daniel Eugene Botha",
    twitter: "hashlipsnft",
    image: "/assets/landingpage/hashlips.jpg",
    company: "Hashlips & Edenlans",
  },
  {
    name: "Joaquim Verges",
    twitter: "joenrv",
    image: "/assets/landingpage/joaquim-verges.png",
    company: "thirdweb",
  },
  {
    name: "Hubert Thieblot",
    twitter: "hthieblot",
    image: "/assets/landingpage/hubert-thieblot.jpg",
    company: "Founders, Inc.",
  },
  {
    name: "Shai Perednik",
    twitter: "shaiss",
    image: "/assets/landingpage/shai-perednik.jpeg",
    company: "AWS",
  },
  {
    name: "Leanne Bats",
    twitter: "leannebats",
    image: "/assets/landingpage/leannebats.jpg",
    company: "Tres Cool",
  },
];

const scheduleItems = [
  {
    day: 16,
    month: "jan",
    title: "Hackathon Kickoff + Intro to Gaming",
    href: "https://lu.ma/rp3kickoff",
  },
  {
    day: 17,
    month: "jan",
    title: "Getting started with thirdweb",
    href: "https://lu.ma/rp3gettingstarted",
  },
  {
    day: 18,
    month: "jan",
    title: "Create AI-Generated in-game NFT Assets with Scenario.gg",
    href: "https://lu.ma/rp3scenario",
  },
  {
    day: 23,
    month: "jan",
    title: "Workshop with Spindl",
    href: "https://lu.ma/rp3spindl",
  },
  {
    day: 24,
    month: "jan",
    title: "Fireside Chat with Fractal",
    href: "https://lu.ma/rp3fractal",
  },
  {
    day: 25,
    month: "jan",
    title: "thirdweb & Coinbase Cloud Code-Along: Build With Gaming",
    href: "https://lu.ma/rp3gamecodealong",
  },
  {
    day: 6,
    month: "feb",
    title: "How To Create Your Hackathon Submission on DevPost + Q&A",
    href: "https://lu.ma/rp3submissions",
  },
  {
    day: 17,
    month: "feb",
    title: "Hackathon Closing Ceremony + Winners Announcement",
    href: "https://lu.ma/rp3closing",
  },
];

const ReadyPlayer3Landing: ThirdwebNextPage = () => {
  const trackEvent = useTrack();

  return (
    <DarkMode>
      <NextSeo
        title={metadata.title}
        description={metadata.description}
        openGraph={{
          title: metadata.title,
          url: "https://thirdweb.com/hackathon/readyplayer3",
          description: metadata.description,
          images: [
            {
              url: "https://thirdweb.com/assets/og-image/readyplayer3.png",
              width: 1440,
              height: 880,
              alt: "Ready Player 3 hackathon",
            },
          ],
        }}
      />

      <Flex
        overflow={"hidden"}
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
        position="relative"
      >
        <HomepageTopNav />

        {/* Hero Auroras */}
        <Box
          pointerEvents={"none"}
          width={{ base: "1000px", md: "2000px" }}
          height={{ base: "1000px", md: "2000px" }}
          position="absolute"
          zIndex={1}
          top="300px"
          left="30%"
          transform="translate(-50%, -50%)"
          backgroundImage={`radial-gradient(ellipse at center, hsl(300deg 100% 50% / 20%), transparent 60%)`}
        ></Box>

        <Box
          pointerEvents={"none"}
          width="2000px"
          height="2000px"
          position="absolute"
          zIndex={1}
          top="300px"
          left="70%"
          transform="translate(-50%, -50%)"
          backgroundImage={`radial-gradient(ellipse at center, hsl(276deg 100% 50% / 20%), transparent 60%)`}
        ></Box>

        <Box maxW="100vw" overflowX="hidden">
          {/* Hero */}
          <HomepageSection id="header" bottomPattern>
            <Flex flexDir="column" align="center" mt={{ base: 12, md: 24 }}>
              <Box filter="grayScale(1) brightness(3) contrast(1.3)" mb={14}>
                <ChakraNextImage
                  src="/assets/hackathon/readyplayer3.png"
                  alt="Ready Player 3"
                  width={200}
                  height={50}
                />
              </Box>

              <Heading
                fontSize={{ base: "32px", md: "72px" }}
                letterSpacing="-0.05em"
                size="display.lg"
                textAlign="center"
              >
                Build the Future of Gaming.
              </Heading>

              {/* Price */}
              <Box
                fontSize={{ base: "24px", md: "42px" }}
                textAlign="center"
                letterSpacing="-0.03em"
                mb={12}
                fontWeight={800}
              >
                <Text
                  as="span"
                  bgImage="linear-gradient(80deg, #e984f3, #b541ff)"
                  letterSpacing="inherit"
                  bgClip="text"
                  fontSize="1.2em"
                  fontWeight="inherit"
                >
                  $100,000
                </Text>
                <span> in Prizes & Perks. </span>
              </Box>

              {/* Time  */}
              <Text
                fontSize={{ base: "20px", md: "24px" }}
                textAlign="center"
                fontWeight={700}
                color="white"
                mb={4}
              >
                Jan 16th - Feb 17th
              </Text>

              <ClientOnly fadeInDuration={400} ssr={<Box height="220px"></Box>}>
                <Flex alignItems={"center"} flexDirection="column">
                  {isAfter(new Date(), new Date("2021-01-16T00:00:00.000Z")) ? (
                    <>
                      <Timer date="2023-02-13T23:59:59-05:00" />
                      <LinkButton
                        href="https://readyplayer3.devpost.com/"
                        onClick={() =>
                          trackEvent({
                            category: "readyplayer3",
                            action: "click",
                            label: "register-now",
                          })
                        }
                        px={14}
                        py={7}
                        fontSize="20px"
                        minW="320px"
                        // leftIcon={<Icon as={ImMagicWand} />}
                        // color="black"
                        flexShrink={0}
                        background="white"
                        _hover={{
                          background: "white !important",
                          boxShadow: "0 0 50px rgb(251 26 164 / 30%)",
                        }}
                        boxShadow="0 0 40px hwb(277deg 26% 0% / 30%)"
                        isExternal
                        noIcon
                        mt={20}
                        gap={2}
                        color="black"
                      >
                        Register now
                      </LinkButton>
                    </>
                  ) : (
                    <LinkButton
                      href="https://readyplayer3.devpost.com/"
                      onClick={() =>
                        trackEvent({
                          category: "readyplayer3",
                          action: "click",
                          label: "submit-project",
                        })
                      }
                      px={14}
                      py={7}
                      fontSize="20px"
                      minW="320px"
                      // leftIcon={<Icon as={ImMagicWand} />}
                      color="black"
                      flexShrink={0}
                      background="white"
                      _hover={{
                        background: "white !important",
                      }}
                      isExternal
                      noIcon
                      mt={8}
                      // isDisabled
                    >
                      Submit Your Project
                    </LinkButton>
                  )}
                </Flex>
              </ClientOnly>
            </Flex>
          </HomepageSection>

          {/* Partners */}
          <HomepageSection
            filter="grayScale(1) brightness(2)"
            mt={40}
            mb={40}
            zIndex={10}
          >
            <Sponsors sponsors={sponsors} hackathonName="ready-player-3" />
          </HomepageSection>

          {/* Prizes  */}
          <HomepageSection mt={40}>
            <Flex flexDir="column">
              <Heading size="title.2xl" textAlign="center">
                Prizes & Perks
              </Heading>
              <Image
                src="/assets/hackathon/prizes.png"
                alt="prizes"
                mt={8}
                mx="auto"
                maxW="100%"
                h={{ base: "auto", md: "400px" }}
                w={{ base: "100%", md: "auto" }}
              />
              <Flex
                flexDir="column"
                gap={4}
                margin="0 auto"
                maxW={700}
                textAlign="center"
              >
                <Text size="body.lg" color="#e984f3" mb={4}>
                  In addition to these prizes, participating teams also have an
                  opportunity to receive:
                </Text>
                <Box fontSize="body.lg" color="white">
                  <List spacing={4}>
                    <ListItem>
                      Top 3 teams of {`"`}Main Build Track{`"`} will receive Pro
                      Tickets ($1,700 value each) to Consensus 2023 Presented by
                      CoinDesk
                    </ListItem>
                    <ListItem>
                      Top 3 teams receive a complimentary 1-Year Subscription to{" "}
                      <Link
                        href="https://www.scenario.gg/"
                        isExternal
                        textDecor={"underline"}
                        pb={1}
                        textDecorationThickness="1px"
                        textUnderlineOffset="4px"
                        style={{
                          textDecorationSkipInk: "none",
                        }}
                      >
                        Scenario.gg
                      </Link>
                    </ListItem>
                    <ListItem>
                      All participating teams with a submitted project are
                      eligible for up to $5,000 in AWS credits (as long as
                      they&apos;ve not previously been an AWS credit recipient)
                    </ListItem>
                    <ListItem>
                      All participating teams with a project submitted will
                      receive 1-month free of Scenario.gg
                    </ListItem>
                  </List>
                </Box>
              </Flex>
            </Flex>

            <Box
              pointerEvents={"none"}
              width="2400px"
              height="2400px"
              position="absolute"
              zIndex={-1}
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              backgroundImage={`radial-gradient(ellipse at center, hsl(300deg 100% 50% / 12%), transparent 60%)`}
            ></Box>
          </HomepageSection>

          {/* Judges */}
          <HomepageSection my={40}>
            <AvatarShowcase
              title="Judges"
              trackingCategory="readyplayer3"
              avatars={judges}
            />
          </HomepageSection>

          {/* Mentors */}
          <HomepageSection my={40}>
            <AvatarShowcase
              title="Mentors"
              trackingCategory="readyplayer3"
              avatars={mentors}
            />
          </HomepageSection>

          {/* Schedule */}
          <HomepageSection zIndex={1} my={20}>
            <ScheduleSection
              TRACKING_CATEGORY="readyplayer3"
              scheduleItems={scheduleItems}
            />

            <Box
              pointerEvents={"none"}
              width={{ base: "1000px", md: "2200px" }}
              height={{ base: "1400px", md: "2200px" }}
              position="absolute"
              zIndex={-1}
              top="55%"
              left="50%"
              transform="translate(-50%, -50%)"
              backgroundImage={`radial-gradient(ellipse at center, hsl(300deg 90% 50% / 15%), transparent 60%)`}
            ></Box>
          </HomepageSection>

          {/* Games showcase */}
          <HomepageSection my={40}>
            <GameShowcase />
            <Box
              pointerEvents={"none"}
              width={{ base: "1400px", md: "2200px" }}
              height={{ base: "2200px", md: "1200px" }}
              position="absolute"
              zIndex={-1}
              top={{ base: "50%", md: "80%" }}
              left="50%"
              transform="translate(-50%, -50%)"
              backgroundImage={{
                base: `radial-gradient(ellipse at center, hsl(300deg 100% 60% / 30%), transparent 60%)`,
                md: `radial-gradient(ellipse at center, hsl(300deg 100% 60% / 15%), transparent 60%)`,
              }}
            ></Box>
          </HomepageSection>

          {/* Resources */}
          <HomepageSection my={20}>
            <Resources />
          </HomepageSection>

          {/* FAQ */}
          <HomepageSection my={{ base: 20, md: 40 }}>
            <FaqSection />
          </HomepageSection>

          {/* CTA #2 */}
          <CTAFooter />

          {/* Footer */}
          <Box zIndex={1000} position="relative">
            <HomepageFooter />
          </Box>
        </Box>
      </Flex>
    </DarkMode>
  );
};

ReadyPlayer3Landing.pageId = PageId.ReadyPlayer3Landing;

export default ReadyPlayer3Landing;
