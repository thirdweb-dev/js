import { useForceDarkTheme } from "@/components/theme-provider";
import { Flex, SimpleGrid } from "@chakra-ui/react";
import { AmbassadorCard } from "components/devRelEvents/AmbassadorCards";
import { ProductCard } from "components/product-pages/common/ProductCard";
import { ProductPage } from "components/product-pages/common/ProductPage";
import { HomepageSection } from "components/product-pages/homepage/HomepageSection";
import { useTrack } from "hooks/analytics/useTrack";
import { PageId } from "page-id";
import { Heading, LinkButton, Text, TrackedLink } from "tw-components";
import { MaskedAvatar } from "tw-components/masked-avatar";
import type { ThirdwebNextPage } from "utils/types";

const TRACKING_CATEGORY = "ambassadors_page";

const ambassadors = [
  {
    name: "Bankk",
    twitter: "bankkroll_eth",
    profileImage: "/assets/ambassadors/bank.jpg",
  },
  {
    name: "Danny Roberts",
    twitter: "danny_roberts",
    profileImage: "/assets/ambassadors/danny.jpeg",
  },
  {
    name: "Frank Ramos",
    twitter: "frankramosdev",
    profileImage: "/assets/ambassadors/frankramos.jpeg",
  },
  {
    name: "Creative Owls",
    twitter: "MyCreativeOwls",
    profileImage: "/assets/ambassadors/myCreativeOwl.jpg",
  },
  {
    name: "Matt Wong",
    twitter: "mattwong_ca",
    profileImage: "/assets/ambassadors/matt.png",
  },
  {
    name: "Myk",
    twitter: "mykcryptodev",
    profileImage: "/assets/ambassadors/myk.png",
  },
  {
    name: "Naman Garg",
    twitter: "namn_grg",
    profileImage: "/assets/ambassadors/naman.jpg",
  },
  {
    name: "Paula Signo",
    twitter: "codewithpau",
    profileImage: "/assets/ambassadors/paula.png",
  },
  {
    name: "Gi",
    twitter: "Gi_Chacon",
    profileImage: "/assets/ambassadors/gi.jpg",
  },
  {
    name: "Rexan",
    twitter: "rexan_wong",
    profileImage: "/assets/ambassadors/rexan.jpg",
  },
  {
    name: "Tanay Patel",
    twitter: "tonydoteth",
    profileImage: "/assets/ambassadors/tanay.png",
  },
  {
    name: "Samu ​​Sarmiento",
    twitter: "SamuSarmiento_",
    profileImage: "/assets/ambassadors/samu.jpeg",
  },
  {
    name: "Takaji",
    twitter: "taka_miraki",
    profileImage: "/assets/ambassadors/takaji.jpg",
  },
  {
    name: "Alfredo",
    twitter: "brolag",
    profileImage: "/assets/ambassadors/brolag.jpg",
  },
  {
    name: "Yuki",
    twitter: "stand_english",
    profileImage: "/assets/ambassadors/yuki.png",
  },
].sort((a, b) => a.name.localeCompare(b.name));

const Ambassadors: ThirdwebNextPage = () => {
  const trackEvent = useTrack();
  useForceDarkTheme();

  return (
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
      <ProductPage
        seo={{
          title: "Ambassadors",
          description:
            "Join thirdweb's ambassador program to build decentralized technologies, empower developer communities, and build your own brand.",
        }}
      >
        {/* Header Section */}
        <HomepageSection pt="80px" pb={16}>
          <Flex
            pt={24}
            flexDir="column"
            gap={{ base: 6, md: 8 }}
            align={{ base: "initial", md: "center" }}
          >
            <Flex flexDir="column" gap={0}>
              <Heading as="h1" size="display.lg" mb={4} textAlign="center">
                Become a{" "}
                <Heading
                  size="display.lg"
                  as="span"
                  bgGradient="linear-gradient(243.9deg, #BFA3DA 21.81%, #84309C 48.81%, #C735B0 86.61%);"
                  bgClip={"text"}
                >
                  thirdweb <br /> Architect.
                </Heading>
              </Heading>
              <Heading
                as="h3"
                size="subtitle.md"
                textAlign="center"
                maxW="container.sm"
              >
                Ignite, Influence, Innovate
              </Heading>
            </Flex>
            <Flex
              flexDir={{ base: "column", md: "row" }}
              gap={3}
              minW={300}
              maxW={{ base: 320, md: "unset" }}
              justify="center"
              align="center"
              marginInline="auto"
            >
              <LinkButton
                href="https://docs.google.com/forms/d/e/1FAIpQLSfuhnYtA-CMo5PT1jF4vzzPy0jVS_DNRMSOayV4FNxx7rpKKQ/viewform"
                isExternal
                onClick={() =>
                  trackEvent({
                    category: TRACKING_CATEGORY,
                    action: "click",
                    label: "ambassador",
                    title: "apply_now",
                  })
                }
                px={4}
                py={7}
                fontSize="20px"
                color="black"
                flexGrow={1}
                background="rgba(255,255,255,1)"
                _hover={{
                  background: "rgba(255,255,255,0.9)!important",
                }}
                zIndex={12}
                noIcon
                minW={{ base: 300, md: "unset" }}
              >
                Apply now
              </LinkButton>
              <LinkButton
                href="https://discord.gg/thirdweb"
                isExternal
                onClick={() =>
                  trackEvent({
                    category: TRACKING_CATEGORY,
                    action: "click",
                    label: "join_the_community",
                  })
                }
                px={4}
                py={7}
                fontSize="20px"
                color="white"
                variant="outline"
                flexGrow={1}
                background="rgba(0,0,0,1)"
                _hover={{
                  background: "rgba(0,0,0,0.9)!important",
                }}
                zIndex={12}
                noIcon
                minW={{ base: 300, md: "unset" }}
              >
                Join the community
              </LinkButton>
            </Flex>
          </Flex>
        </HomepageSection>

        {/* thirdweb mission */}
        <HomepageSection pb={16}>
          <Flex
            pt={24}
            // mb={{ base: 24, md: -24 }}
            flexDir="column"
            gap={{ base: 6, md: 8 }}
            align={{ base: "initial", md: "center" }}
          >
            <Flex flexDir="column" justify="center" align="center">
              <Heading
                as="h2"
                size="display.md"
                mb={4}
                textAlign="center"
                bgGradient="linear-gradient(243.9deg, #3385FF
                    21.81%, #91B7F0 48.81%, #95BBF2 86.61%);"
                bgClip={"text"}
              >
                Forge the future internet
              </Heading>

              <Heading
                as="h3"
                size="subtitle.md"
                textAlign={{ base: "center" }}
                maxW={800}
                pb={32}
              >
                thirdweb is on a mission to make the internet more open and
                valuable for both builders and users. Be part of a curated group
                of builders, with access to the latest tools and features,
                bringing awareness on a global scale.
              </Heading>
            </Flex>
          </Flex>
        </HomepageSection>

        {/* Characteristics Seciton*/}
        <HomepageSection pb={32}>
          <Flex
            pt={24}
            // mb={{ base: 24, md: -24 }}
            flexDir="column"
            gap={{ base: 6, md: 8 }}
            align={{ base: "initial", md: "center" }}
          >
            <Heading
              as="h2"
              size="display.md"
              mb={4}
              textAlign="center"
              bgGradient="linear-gradient(243.9deg, #BFA3DA 21.81%, #84309C 48.81%, #C735B0 86.61%);"
              bgClip={"text"}
            >
              Architect Characteristics
            </Heading>

            <Flex flexDir="row" alignItems="center">
              <SimpleGrid
                // justifyContent="center"
                // justify="center"
                w="100%"
                columns={{ base: 1, md: 4 }}
                gap={{ base: 6, md: 12 }}
                placeItems="center"
              >
                <AmbassadorCard
                  icon={require("/public/assets/ambassadors/card-1-icon.svg")}
                >
                  You are insatiably curious about new web3 tools.
                </AmbassadorCard>
                <AmbassadorCard
                  icon={require("/public/assets/ambassadors/card-2-icon.svg")}
                >
                  You revel in creating and sharing web3 content.
                </AmbassadorCard>
                <AmbassadorCard
                  icon={require("/public/assets/ambassadors/connections.svg")}
                >
                  You forge lasting connections with others.
                </AmbassadorCard>
                <AmbassadorCard
                  icon={require("/public/assets/ambassadors/card-3-icon.svg")}
                >
                  {/* You are approachable and adept at forging connections across contexts. */}
                  {/* Update image for this one ToDO  */}
                  You are a passionate builder.
                </AmbassadorCard>
              </SimpleGrid>
            </Flex>
          </Flex>
        </HomepageSection>

        {/* Architect responsibilites Seciton */}
        <HomepageSection pb={16}>
          <Flex
            pt={24}
            // mb={{ base: 24, md: -24 }}
            flexDir="column"
            gap={{ base: 6, md: 8 }}
            align={{ base: "initial", md: "center" }}
          >
            <Flex flexDir="column" justify="center" align="center">
              <Heading
                as="h2"
                size="display.md"
                mb={4}
                textAlign="center"
                bgGradient="linear-gradient(243.9deg, #3385FF
                    21.81%, #91B7F0 48.81%, #95BBF2 86.61%);"
                bgClip={"text"}
              >
                Architect Responsibilities
              </Heading>
            </Flex>

            <Flex flexDir="row" alignItems="center">
              <SimpleGrid
                justifyContent="center"
                w="100%"
                columns={{ sm: 3, base: 1, md: 4 }}
                gap={{ base: 12, md: 6 }}
              >
                <ProductCard
                  title="Be a thirdweb brand ambassador"
                  icon={require("/public/assets/ambassadors/recognition-icon.svg")}
                >
                  Advocate for thirdweb&apos;s toolset and its role in web3.
                </ProductCard>
                <ProductCard
                  title="Build your projcts. Share the results."
                  icon={require("/public/assets/ambassadors/mentorship-icon.svg")}
                >
                  Showcase your projects built using thirdweb through your
                  favorite social media
                </ProductCard>
                <ProductCard
                  title="Support the newcomers"
                  icon={require("/public/assets/ambassadors/merch-icon.svg")}
                >
                  Assist community members by answering questions,
                  troubleshooting issues, and providing guidance.
                </ProductCard>
                <ProductCard
                  title="Network"
                  icon={require("/public/assets/ambassadors/network-icon.svg")}
                >
                  {/* TODO, rethink the reaching out to potential individuals */}
                  Grow the community by welcoming new members, initiating
                  discussions, and reaching out to potential individuals.
                </ProductCard>
                {/* <ProductCard
                    title="Access"
                    icon={require("/public/assets/ambassadors/access-icon.svg")}
                  >
                    Insider access to the team, roadmap, events.
                  </ProductCard> */}
              </SimpleGrid>
            </Flex>
          </Flex>
        </HomepageSection>

        {/* Ignite Seciton*/}
        <HomepageSection pb={32}>
          <Flex
            pt={24}
            // mb={{ base: 24, md: -24 }}
            flexDir="column"
            gap={{ base: 6, md: 8 }}
            align={{ base: "initial", md: "center" }}
          >
            <Heading
              as="h2"
              size="display.md"
              mb={4}
              textAlign="center"
              bgGradient="linear-gradient(243.9deg, #BFA3DA 21.81%, #84309C 48.81%, #C735B0 86.61%);"
              bgClip={"text"}
            >
              Ignite
            </Heading>
            <Heading
              as="h3"
              size="subtitle.md"
              textAlign={{ base: "center" }}
              maxW={800}
            >
              Ignite your tech passion and contribute to the future of the web,
              all while enjoying exclusive rewards tailored to your dedication.
            </Heading>
            <Flex flexDir="row" alignItems="center">
              <SimpleGrid
                // justifyContent="center"
                // justify="center"
                w="100%"
                columns={{ base: 1, md: 3 }}
                gap={{ base: 6, md: 12 }}
                placeItems="center"
              >
                <AmbassadorCard
                  icon={require("/public/assets/ambassadors/learn.svg")}
                >
                  Enhance your skills with exclusive workshops and the latest in
                  web3.
                </AmbassadorCard>
                <AmbassadorCard
                  icon={require("/public/assets/ambassadors/oss.svg")}
                >
                  Fuel your web3 passion with a platform to explore, create and
                  innovate.
                </AmbassadorCard>
                <AmbassadorCard
                  icon={require("/public/assets/ambassadors/card-3-icon.svg")}
                >
                  Get rewarded with exclusive benefits such as free thirdweb
                  credits.
                </AmbassadorCard>
              </SimpleGrid>
            </Flex>
          </Flex>
        </HomepageSection>

        {/* Influence Section */}
        <HomepageSection pb={32}>
          <Flex
            pt={24}
            // mb={{ base: 24, md: -24 }}
            flexDir="column"
            gap={{ base: 6, md: 8 }}
            align={{ base: "initial", md: "center" }}
          >
            <Flex flexDir="column" justify="center" align="center">
              <Heading
                bgGradient="linear-gradient(243.9deg, #3385FF
                    21.81%, #91B7F0 48.81%, #95BBF2 86.61%);"
                bgClip={"text"}
                size="label.xl"
                mb={4}
              />
              <Heading
                as="h2"
                size="display.md"
                mb={4}
                textAlign="center"
                bgGradient="linear-gradient(243.9deg, #3385FF
                    21.81%, #91B7F0 48.81%, #95BBF2 86.61%);"
                bgClip={"text"}
              >
                Influence <br />
              </Heading>

              <Heading
                as="h3"
                size="subtitle.md"
                textAlign={{ base: "center" }}
                maxW={800}
              >
                Influce the web3 community, inspire engagement, advocate for
                open internet, and shape the future of the web3 ecosystem.
              </Heading>
            </Flex>

            <Flex flexDir="row" alignItems="center">
              <SimpleGrid
                justifyContent="center"
                w="100%"
                columns={{ sm: 3, base: 1, md: 5 }}
                gap={{ base: 12, md: 6 }}
              >
                <ProductCard
                  title="Recognition"
                  icon={require("/public/assets/ambassadors/recognition-icon.svg")}
                >
                  Grow your personal brand from recognition on our pages.
                </ProductCard>
                <ProductCard
                  title="Mentorship"
                  icon={require("/public/assets/ambassadors/mentorship-icon.svg")}
                >
                  Learn directly from experts on web3 development and related
                  topics.
                </ProductCard>
                <ProductCard
                  title="Feedback Sessions"
                  icon={require("/public/assets/ambassadors/merch-icon.svg")}
                >
                  Participate in feedback sessions that have a direct impact on
                  the thirdweb toolset
                </ProductCard>
                <ProductCard
                  title="Network"
                  icon={require("/public/assets/ambassadors/network-icon.svg")}
                >
                  Meet like-minded individuals and grow your network in web3.
                </ProductCard>
                <ProductCard
                  title="Become A Thought Leader"
                  icon={require("/public/assets/ambassadors/access-icon.svg")}
                >
                  Establish yourself as a thought leader in the web3 industry.
                </ProductCard>
              </SimpleGrid>
            </Flex>
          </Flex>
        </HomepageSection>

        {/* Innovate Section */}
        <HomepageSection pb={32}>
          <Flex
            pt={24}
            // mb={{ base: 24, md: -24 }}
            flexDir="column"
            gap={{ base: 6, md: 8 }}
            align={{ base: "initial", md: "center" }}
          >
            <Flex flexDir="column" justify="center" align="center">
              <Heading
                as="h2"
                size="display.md"
                mb={4}
                textAlign="center"
                bgGradient="linear-gradient(243.9deg, #BFA3DA 21.81%, #84309C 48.81%, #C735B0 86.61%);"
                bgClip={"text"}
              >
                Innovate
              </Heading>
              <Heading
                as="h3"
                size="subtitle.md"
                textAlign={{ base: "center" }}
                maxW={800}
              >
                Innovate through the latest tools and contribute to an ever
                evolving codebase.
              </Heading>
            </Flex>

            <Flex flexDir="row" alignItems="center">
              <SimpleGrid
                // justifyContent="center"
                // justify="center"
                w="100%"
                columns={{ base: 1, md: 4 }}
                gap={{ base: 6, md: 12 }}
                placeItems="center"
              >
                <AmbassadorCard
                  icon={require("/public/assets/ambassadors/hackathon.svg")}
                >
                  Gain early access to the latest tools and experiment with
                  cutting edge technology.
                </AmbassadorCard>
                <AmbassadorCard
                  icon={require("/public/assets/ambassadors/card-2-icon.svg")}
                >
                  Build brand new experienes with the thirdweb toolset.
                </AmbassadorCard>
                <AmbassadorCard
                  icon={require("/public/assets/ambassadors/office-hours.svg")}
                >
                  Be involved in stages of product design and direction.
                </AmbassadorCard>
                <AmbassadorCard
                  icon={require("/public/assets/ambassadors/card-3-icon.svg")}
                >
                  Push the boundary of what&apos;s possible in web3 with
                  thirdweb.
                </AmbassadorCard>
              </SimpleGrid>
            </Flex>
          </Flex>
        </HomepageSection>

        {/* Meet the Ambassadors Section */}
        <HomepageSection pb={32}>
          <Flex
            pt={24}
            mb={{ base: 24, md: -24 }}
            flexDir="column"
            gap={{ base: 6, md: 8 }}
            align={{ base: "initial", md: "center" }}
          >
            <Heading as="h2" size="display.md" mb={4} textAlign="center">
              Meet the{" "}
              <Heading
                size="display.md"
                as="span"
                bgGradient="linear-gradient(243.9deg, #BFA3DA 21.81%, #84309C 48.81%, #C735B0 86.61%);"
                bgClip={"text"}
              >
                Ambassadors.
              </Heading>
            </Heading>
            <Flex flexDir="row" flexWrap="wrap" gap={8} justify="center">
              {ambassadors.map((ambassador) => (
                <Flex
                  key={ambassador.name}
                  flexDir="row"
                  align="center"
                  gap={4}
                  w={228}
                >
                  <MaskedAvatar
                    src={ambassador.profileImage}
                    alt=""
                    boxSize={20}
                  />
                  <Flex flexDir="column" gap={1}>
                    <Heading size="title.sm">{ambassador.name}</Heading>
                    {ambassador.twitter ? (
                      <TrackedLink
                        href={`https://twitter.com/${ambassador.twitter}`}
                        isExternal
                        category={TRACKING_CATEGORY}
                        label={ambassador.name}
                      >
                        <Text size="label.md" color="gray.500">
                          @{ambassador.twitter}
                        </Text>
                      </TrackedLink>
                    ) : (
                      <Text
                        size="label.md"
                        color="gray.700"
                        fontWeight={400}
                        fontStyle="italic"
                      >
                        no twitter
                      </Text>
                    )}
                  </Flex>
                </Flex>
              ))}
            </Flex>
          </Flex>
        </HomepageSection>

        {/* Join Today */}
        <HomepageSection pb={32}>
          <Flex
            pt={{ base: "0", md: "32" }}
            // mb={{ base: 24, md: -24 }}
            flexDir="column"
            gap={{ base: 6, md: 8 }}
            align={{ base: "initial", md: "center" }}
          >
            <Flex flexDir="column" gap={0}>
              <Heading as="h2" size="display.md" mb={4} textAlign="center">
                Ready to{" "}
                <Heading
                  size="display.md"
                  as="span"
                  bgGradient="linear-gradient(243.9deg, #BFA3DA 21.81%, #84309C 48.81%, #C735B0 86.61%);"
                  bgClip={"text"}
                >
                  forge?
                </Heading>
              </Heading>
              <Heading
                as="h3"
                size="subtitle.md"
                textAlign={{ base: "center" }}
                maxW="container.lg"
              >
                Tell us about yourself by filling out the form below and we’ll
                be in touch soon!
              </Heading>
            </Flex>
            <LinkButton
              href="https://docs.google.com/forms/d/e/1FAIpQLSfuhnYtA-CMo5PT1jF4vzzPy0jVS_DNRMSOayV4FNxx7rpKKQ/viewform"
              isExternal
              onClick={() =>
                trackEvent({
                  category: TRACKING_CATEGORY,
                  action: "click",
                  label: "apply_now",
                })
              }
              px={4}
              py={7}
              fontSize="20px"
              color="black"
              flexShrink={0}
              background="rgba(255,255,255,1)"
              _hover={{
                background: "rgba(255,255,255,0.9)!important",
              }}
              zIndex={12}
            >
              Apply now
            </LinkButton>
          </Flex>
        </HomepageSection>
      </ProductPage>
    </Flex>
  );
};

Ambassadors.pageId = PageId.Ambassadors;

export default Ambassadors;
