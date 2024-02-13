import {
  Box,
  Center,
  Container,
  DarkMode,
  Flex,
  Icon,
  SimpleGrid,
} from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { CommunityCard } from "components/community/CommunityCard";
import { HomepageFooter } from "components/footer/Footer";
import { Aurora } from "components/homepage/Aurora";
import { HomepageTopNav } from "components/product-pages/common/Topnav";
import { useTrack } from "hooks/analytics/useTrack";
import { NextSeo } from "next-seo";
import { PageId } from "page-id";
import { BsLightningCharge } from "react-icons/bs";
import { Heading, LinkButton, Text } from "tw-components";
import { ThirdwebNextPage } from "utils/types";

const TRACKING_CATEGORY = "community";

const SEO = {
  title: "Join the Best Web3 Community | Learn, Build, Grow",
  description:
    "Join the thirdweb community and share your web3 journey alongside 35,000+ other builders. Learn, build, & grow with thirdweb.",
};

const communitySections = [
  {
    title1: "Learn",
    title2: "web3 development",
    description:
      "Our mission is to foster a community of web3 enthusiasts to drive innovation together through learning and development efforts.",
    cards: [
      {
        image: "/assets/community/home/learn.svg",
        link: "/learn",
        title: "thirdweb learn",
        description: "",
      },
      {
        image: "/assets/community/home/events.svg",
        link: "/events",
        title: "Events",
        description: "",
      },
      {
        image: "/assets/community/home/office-hours.svg",
        link: "https://lu.ma/tw-office-hours",
        title: "Office Hours",
        description: "",
      },
    ],
  },
  {
    title1: "Build",
    title2: "innovative projects",
    description:
      "From hackathons to bounties, open source to community projects, there are so many ways to build no matter your level of contribution. ",
    cards: [
      {
        image: "/assets/community/home/hackathon.svg",
        link: "/events",
        title: "Hackathons",
        description: "",
      },
      {
        image: "/assets/community/home/bug-bounty.svg",
        link: "https://thirdweb.notion.site/thirdweb-Bug-Bounty-Program-f78d1db776ab4f0e974c9da176fcf706",
        title: "Bug Bounty",
        description: "",
      },
      {
        image: "/assets/community/home/oss.svg",
        link: "/open-source",
        title: "Open Source",
        description: "",
      },
    ],
  },
  {
    title1: "Join",
    title2: "the community",
    description:
      "Explore programs to educate, host events, and showcase your achievements - together, we can take the web3 community to new heights!",
    cards: [
      {
        image: "/assets/community/home/ambassadors.svg",
        link: "/ambassadors",
        title: "Ambassadors",
        description: "",
      },

      {
        image: "/assets/community/home/discord.png",
        link: "https://discord.gg/thirdweb",
        title: "Join Discord",
        description: "",
      },
    ],
  },
];

const Community: ThirdwebNextPage = () => {
  const trackEvent = useTrack();

  return (
    <DarkMode>
      <NextSeo {...SEO} />
      <Flex
        sx={{
          // overwrite the theme colors because the home page is *always* in "dark mode"
          "--chakra-colors-heading": "#F2F2F7",
          "--chakra-colors-paragraph": "#AEAEB2",
          "--chakra-colors-borderColor": "rgba(255,255,255,0.1)",
          "--product-accent-color": "rgba(24, 67, 78, 0.8)",
        }}
        justify="center"
        flexDir="column"
        as="main"
        bg="#000"
      >
        <HomepageTopNav />
        <Box maxW="100vw" mt="-100px" py="100px" overflowX="hidden">
          <Container zIndex={1} position="relative" maxW="container.page">
            <Aurora
              pos={{ left: "50%", top: "50%" }}
              size={{ width: "2000px", height: "2000px" }}
              color="hsl(280deg 78% 30% / 30%)"
            />

            <Center
              py={{ base: 12, md: 24 }}
              px={{ base: 4, md: 8 }}
              flexDir="column"
            >
              <Heading mt={8} textAlign="center" size="title.2xl">
                A decentralized internet begins
                <br /> with{" "}
                <Box
                  as="span"
                  bgGradient="linear(to-r, #BFA3DA, #C735B0)"
                  bgClip="text"
                >
                  decentralized talent.
                </Box>
              </Heading>

              <Flex
                mt={8}
                justify="center"
                align="center"
                gap={4}
                flexDir={{ base: "column", md: "row" }}
              >
                <LinkButton
                  href="https://discord.gg/thirdweb"
                  size="lg"
                  onClick={() =>
                    trackEvent({
                      category: TRACKING_CATEGORY,
                      action: "click",
                      title: "join-the-community",
                    })
                  }
                  background="white"
                  _hover={{
                    background: "white",
                    color: "#000",
                  }}
                  color="#000"
                  fontSize="larger"
                  leftIcon={<Icon as={BsLightningCharge} />}
                  isExternal
                  noIcon
                >
                  Join the community
                </LinkButton>

                <LinkButton
                  href="/contact-us"
                  size="lg"
                  onClick={() =>
                    trackEvent({
                      category: TRACKING_CATEGORY,
                      action: "click",
                      title: "partner-with-us",
                    })
                  }
                  variant="outline"
                  fontSize="larger"
                  h={12}
                >
                  Get In Touch
                </LinkButton>
              </Flex>
            </Center>
          </Container>

          {communitySections.map(
            ({ title1, title2, cards, description }, i) => (
              <Box
                w="100%"
                as="section"
                zIndex={2}
                position="relative"
                key={title1}
              >
                <Box
                  h="1px"
                  bg="#3F3F3F"
                  opacity="0.8"
                  maxW="container.page"
                  display={i === 0 ? "none" : "block"}
                  mx="auto"
                />

                <Container
                  maxW="container.page"
                  position="relative"
                  py={{ base: 12, md: 24 }}
                >
                  <Heading
                    as="h2"
                    textAlign="left"
                    size="title.2xl"
                    color="#ECECEC"
                  >
                    {title1}{" "}
                    <Box
                      as="span"
                      bgGradient="linear(to-r, #BFA3DA, #C735B0)"
                      bgClip="text"
                    >
                      {title2}
                    </Box>
                  </Heading>

                  <Text
                    mt={2}
                    textAlign="left"
                    size="body.xl"
                    color="white"
                    opacity={0.7}
                    maxW="container.md"
                  >
                    {description}
                  </Text>

                  <SimpleGrid
                    columns={{ base: 1, sm: 2, md: 4 }}
                    gap={{ base: 4, md: 6 }}
                    py={{ base: 4, md: 8 }}
                  >
                    {cards.map(
                      ({
                        image,
                        title: cardTitle,
                        link,
                        description: cardDescription,
                      }) => (
                        <CommunityCard
                          key={cardTitle}
                          image={image}
                          title={cardTitle}
                          link={link}
                          description={cardDescription}
                        />
                      ),
                    )}
                  </SimpleGrid>
                </Container>
              </Box>
            ),
          )}

          <Box
            h="1px"
            bg="#3F3F3F"
            opacity="0.8"
            maxW="container.page"
            mx="auto"
          />
        </Box>

        <Container maxW="container.page" position="relative" py={12}>
          <Heading as="h2" size="title.2xl" textAlign="center" mb={4}>
            and most importantly...{" "}
            <Box
              as="span"
              bgGradient="linear(to-r, #BFA3DA, #C735B0)"
              bgClip="text"
            >
              have fun!
            </Box>
          </Heading>

          <SimpleGrid
            columns={{ base: 1, sm: 2, md: 3 }}
            gap={{ base: 12, md: 6 }}
            py={{ base: 12, md: 8 }}
          >
            {Array.from({ length: 9 }).map((_, i) => (
              <ChakraNextImage
                key={i}
                src={require(
                  `../../public/assets/community/gallery/${i + 1}.png`,
                )}
                alt="thirdweb gallery image"
                width="350"
                height="350"
                objectFit="cover"
              />
            ))}
          </SimpleGrid>
        </Container>

        <Center
          px={{ base: 4, md: 8 }}
          flexDir="column"
          my={{ base: 12, md: 24 }}
        >
          <Heading mt={8} size="display.md">
            Start
            <Box
              as="span"
              bgGradient="linear(to-r, #BFA3DA, #C735B0)"
              bgClip="text"
            >
              {" "}
              building{" "}
            </Box>
            today.
          </Heading>

          <Flex
            mt={8}
            mb={12}
            justify="center"
            align="center"
            gap={4}
            flexDir={{ base: "column", md: "row" }}
          >
            <LinkButton
              href="https://discord.gg/thirdweb"
              size="lg"
              onClick={() =>
                trackEvent({
                  category: TRACKING_CATEGORY,
                  action: "click",
                  title: "join-the-community",
                })
              }
              background="white"
              _hover={{
                background: "white",
                color: "#000",
              }}
              color="#000"
              fontSize="larger"
              leftIcon={<Icon as={BsLightningCharge} />}
              isExternal
              noIcon
            >
              Join the community
            </LinkButton>

            <LinkButton
              href="/contact-us"
              size="lg"
              onClick={() =>
                trackEvent({
                  category: TRACKING_CATEGORY,
                  action: "click",
                  title: "partner-with-us",
                })
              }
              variant="outline"
              fontSize="larger"
              h={12}
            >
              Get In Touch
            </LinkButton>
          </Flex>
        </Center>

        <HomepageFooter />
      </Flex>
    </DarkMode>
  );
};

Community.pageId = PageId.Community;

export default Community;
