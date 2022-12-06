import {
  Box,
  DarkMode,
  Divider,
  Flex,
  Icon,
  List,
  ListItem,
} from "@chakra-ui/react";
import { ImMagicWand } from "@react-icons/all-files/im/ImMagicWand";
import { HackathonFooter } from "components/hackathon/solana/HackathonFooter";
import { Judges } from "components/hackathon/solana/Judges";
import { PrizeSection } from "components/hackathon/solana/PrizeSection";
import { ScheduleSection } from "components/hackathon/solana/ScheduleSection";
import { Sponsors } from "components/hackathon/solana/Sponsors";
import { HomepageTopNav } from "components/product-pages/common/Topnav";
import { HomepageFooter } from "components/product-pages/homepage/Footer";
import { HomepageSection } from "components/product-pages/homepage/HomepageSection";
import { useTrack } from "hooks/analytics/useTrack";
import { NextSeo } from "next-seo";
// import dynamic from "next/dynamic";
import { PageId } from "page-id";
import { Heading, LinkButton, Text, TrackedLink } from "tw-components";
import { ThirdwebNextPage } from "utils/types";

// const Timer = dynamic(() => import("components/hackathon/solana/Timer"), {
//   ssr: false,
// });

const SolanaHackathon: ThirdwebNextPage = () => {
  const trackEvent = useTrack();
  return (
    <DarkMode>
      <NextSeo
        title="thirdweb Solanathon: October 19 - 26 | Build web3 apps, win $10,000"
        description="Join thirdweb's first-ever official hackathon! Solanathon is a 7-day event with $10,000 in prizes for inspiring web3 builders on Solana. Learn more."
        openGraph={{
          title:
            "thirdweb Solanathon: October 19 - 26 | Build web3 apps, win $10,000",
          url: "https://thirdweb.com/hackathon/solanathon",
          description:
            "Join thirdweb's first-ever official hackathon! Solanathon is a 7-day event with $10,000 in prizes for inspiring web3 builders on Solana. Learn more.",
          images: [
            {
              url: "https://thirdweb.com/assets/og-image/solanathon.jpg",
              width: 1200,
              height: 630,
              alt: "thirdweb Solanathon: October 19 - 26",
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
        bg="#000"
      >
        <HomepageTopNav />

        <Box maxW="100vw" mt="-100px" pt="100px" overflowX="hidden">
          <HomepageSection id="header" topGradient>
            <Flex
              flexDir="column"
              align="center"
              gap={12}
              mt={{ base: 12, md: 24 }}
            >
              {/* <ChakraNextImage
              src="/assets/hackathon/tw-solana.svg"
              alt="Solana Hackathon"
              width={300}
              height={30}
              w={{ base: "300px", md: "600px" }}
              objectFit="contain"
            /> */}
              <Flex flexDir="column" gap={2}>
                <Heading size="title.xl" textAlign="center">
                  Build Web3 apps on Solana
                </Heading>
                <Heading
                  bgImage="linear-gradient(128deg, #9945FF -9.03%, #14EE92 98.25%)"
                  bgClip="text"
                  size="display.lg"
                  textAlign="center"
                >
                  $10,000 in prizes
                </Heading>
                <Heading size="title.xl" textAlign="center">
                  Oct 19th - Oct 26th
                </Heading>
              </Flex>

              {/* <Timer /> */}

              <LinkButton
                href="https://thirdweb.typeform.com/to/jta0ye4M"
                onClick={() =>
                  trackEvent({
                    category: "solanathon",
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
                isDisabled
              >
                Submit Your Project
              </LinkButton>
            </Flex>
          </HomepageSection>

          <HomepageSection>
            <Sponsors />
          </HomepageSection>
          <Divider mt={16} />
          <PrizeSection />

          <HomepageSection>
            <ScheduleSection />
          </HomepageSection>

          <HomepageSection mt={{ base: 12, md: 24 }}>
            <Flex flexDir="column" alignItems="center" gap={8}>
              <Heading size="title.2xl" textStyle="center">
                Guidelines
              </Heading>
              <Flex flexDir="column" gap={4}>
                <Text size="body.lg">
                  In order to be eligible for the Hackathon, submissions must:
                </Text>
                <Text size="body.lg">
                  <List>
                    <ListItem>
                      - Use a thirdweb prebuilt program or an existing program
                      on Solana and interface with the thirdweb SDKs
                    </ListItem>
                    <ListItem>
                      - Project submissions must be open-source
                    </ListItem>
                    <ListItem>
                      - Be submitted through GitHub with a descriptive Readme
                      file detailing the project
                    </ListItem>
                    <ListItem>
                      - Be deployed to Solana mainnet or devnet
                    </ListItem>
                    <ListItem>
                      - Provide their GitHub repo and a link to their project on
                      thirdweb dashboard
                    </ListItem>
                    <ListItem>
                      - Include a written/video breakdown of the project to a
                      dev forum like Hashnode, dev.to or YouTube
                    </ListItem>
                  </List>
                </Text>
                <Text size="body.lg">
                  To submit, participants will link their decentralized app
                  repository from GitHub in the submission form by Oct 26th
                  22:00 UTC and indicate the corresponding track(s) that they
                  are competing for. Please don&apos;t hesitate to reach out to
                  our team in our{" "}
                  <TrackedLink
                    href="https://discord.gg/thirdweb"
                    category="solanathon"
                    label="discord"
                    textDecoration="underline"
                  >
                    discord
                  </TrackedLink>{" "}
                  if you have any questions.
                </Text>
              </Flex>
            </Flex>
          </HomepageSection>

          <Box
            w="full"
            h={{ base: "200px", md: "250px" }}
            background="linear-gradient(90deg, rgba(20, 253, 169, 0.4) 0%, rgba(47, 53, 201, 0.4) 36.52%, rgba(189, 17, 190, 0.4) 72.51%, rgba(65, 0, 172, 0.4) 100%)"
            filter="blur(100px)"
            transform="matrix(-1, 0, 0, 1, 0, 0)"
            mt="-150px"
          />
          <Judges />
          <HackathonFooter />
          <HomepageFooter />
        </Box>
      </Flex>
    </DarkMode>
  );
};

SolanaHackathon.pageId = PageId.SolanaHackathonLanding;

export default SolanaHackathon;
