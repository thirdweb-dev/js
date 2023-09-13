import { DarkMode, Flex, SimpleGrid } from "@chakra-ui/react";
import { AmbassadorCard } from "components/devRelEvents/AmbassadorCards";
import { ProductCard } from "components/product-pages/common/ProductCard";
import { ProductPage } from "components/product-pages/common/ProductPage";
import { HomepageSection } from "components/product-pages/homepage/HomepageSection";
import { useTrack } from "hooks/analytics/useTrack";
import { PageId } from "page-id";
import { Heading, LinkButton, Text, TrackedLink } from "tw-components";
import { MaskedAvatar } from "tw-components/masked-avatar";
import { ThirdwebNextPage } from "utils/types";

const TRACKING_CATEGORY = "ambassadors_page";

const ambassadors = [
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
    profileImage: "/assets/ambassadors/naman.jpeg",
  },
  {
    name: "Paula Signo",
    twitter: "codewithpau",
    profileImage: "/assets/ambassadors/paula.png",
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
    name: "Yuki",
    twitter: "stand_english",
    profileImage: "/assets/ambassadors/yuki.png",
  },
].sort((a, b) => a.name.localeCompare(b.name));

const Ambassadors: ThirdwebNextPage = () => {
  const trackEvent = useTrack();

  return (
    <DarkMode>
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
                    thirdweb <br /> Ambassador.
                  </Heading>
                </Heading>
                <Heading
                  as="h3"
                  size="subtitle.md"
                  textAlign="center"
                  maxW="container.sm"
                >
                  Are you a builder, believer in decentralized technologies,
                  want to empower the developer community, and build your own
                  brand?
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
          <HomepageSection pb={32}>
            <Flex
              pt={24}
              // mb={{ base: 24, md: -24 }}
              flexDir="column"
              gap={{ base: 6, md: 8 }}
              align={{ base: "initial", md: "center" }}
            >
              <Flex flexDir="column" justify="center" align="center">
                <Text
                  size="label.xl"
                  bgGradient="linear-gradient(243.9deg, #BFA3DA 21.81%, #84309C 48.81%, #C735B0 86.61%);"
                  bgClip={"text"}
                  mb={4}
                >
                  Our Goal
                </Text>
                <Heading as="h2" size="display.md" mb={4} textAlign="center">
                  We are{" "}
                  <Heading
                    size="display.md"
                    as="span"
                    bgGradient="linear-gradient(243.9deg, #BFA3DA 21.81%, #84309C 48.81%, #C735B0 86.61%);"
                    bgClip={"text"}
                  >
                    developer obsessed.
                  </Heading>
                </Heading>
                <Heading
                  as="h3"
                  size="subtitle.md"
                  textAlign={{ base: "center" }}
                  maxW={800}
                >
                  Providing incredible experiences for the developer community
                  is one of the most rewarding things we do. Join us in our
                  mission to grow web3 development.
                </Heading>
              </Flex>

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
                    icon={require("/public/assets/ambassadors/card-1-icon.svg")}
                  >
                    Share your knowledge on new groundbreaking web3 tools.
                  </AmbassadorCard>
                  <AmbassadorCard
                    icon={require("/public/assets/ambassadors/card-2-icon.svg")}
                  >
                    Have fun creating and sharing the type of content you love
                    the most.
                  </AmbassadorCard>
                  <AmbassadorCard
                    icon={require("/public/assets/ambassadors/card-3-icon.svg")}
                  >
                    Get rewarded with benefits exclusive to ambassadors.
                  </AmbassadorCard>
                </SimpleGrid>
              </Flex>
            </Flex>
          </HomepageSection>
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
                >
                  Benefits & Rewards
                </Heading>
                <Heading as="h2" size="display.md" mb={4} textAlign="center">
                  <Heading
                    size="display.md"
                    as="span"
                    bgGradient="linear-gradient(243.9deg, #3385FF
                    21.81%, #91B7F0 48.81%, #95BBF2 86.61%);"
                    bgClip={"text"}
                  >
                    Exclusive benefits <br />
                  </Heading>
                  for Ambassadors.
                </Heading>
              </Flex>

              <Flex flexDir="row" alignItems="center">
                <SimpleGrid
                  justifyContent="flex-start"
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
                    title="Merch & Swag"
                    icon={require("/public/assets/ambassadors/merch-icon.svg")}
                  >
                    Receive exclusive thirdweb merch that identifies you as part
                    of the team.
                  </ProductCard>
                  <ProductCard
                    title="Network"
                    icon={require("/public/assets/ambassadors/network-icon.svg")}
                  >
                    Meet like-minded individuals and grow your network in web3.
                  </ProductCard>
                  <ProductCard
                    title="Access"
                    icon={require("/public/assets/ambassadors/access-icon.svg")}
                  >
                    Insider access to the team, roadmap, events.
                  </ProductCard>
                </SimpleGrid>
              </Flex>
            </Flex>
          </HomepageSection>
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
                  Become an{" "}
                  <Heading
                    size="display.md"
                    as="span"
                    bgGradient="linear-gradient(243.9deg, #BFA3DA 21.81%, #84309C 48.81%, #C735B0 86.61%);"
                    bgClip={"text"}
                  >
                    Ambassador today.
                  </Heading>
                </Heading>
                <Heading
                  as="h3"
                  size="subtitle.md"
                  textAlign={{ base: "center" }}
                  maxW="container.lg"
                >
                  Tell us about yourself by filling out the form below and we’ll
                  be in touch soon! <br /> We require ambassadors to be 18 years
                  old or over.
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
    </DarkMode>
  );
};

Ambassadors.pageId = PageId.Ambassadors;

export default Ambassadors;
