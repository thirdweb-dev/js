import {
  Box,
  Container,
  Flex,
  List,
  ListItem,
  SimpleGrid,
} from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { HomepageFooter } from "components/footer/Footer";
import { Aurora } from "components/homepage/Aurora";
import { LandingImages } from "components/landing-pages/card-with-image";
import { LandingDesktopMobileImage } from "components/landing-pages/desktop-mobile-image";
import { LandingFAQ } from "components/landing-pages/faq";
import { LandingGridSection } from "components/landing-pages/grid-section";
import { LandingIconSectionItem } from "components/landing-pages/icon-section-item";
import { LandingSectionHeading } from "components/landing-pages/section-heading";
import { HomepageTopNav } from "components/product-pages/common/Topnav";
import { HomepageSection } from "components/product-pages/homepage/HomepageSection";
import { NextSeo } from "next-seo";
import { PageId } from "page-id";
import { Heading, Text, TrackedLink, TrackedLinkButton } from "tw-components";
import { MaskedAvatar } from "tw-components/masked-avatar";
import { ThirdwebNextPage } from "utils/types";

const TRACKING_CATEGORY = "startup-program";

const SEO = {
  title: "Startup program",
  description:
    "The next wave of web3 mass adoption is already happening. If you want to be one of the next big crypto apps, the time to build is now!",
};

const judges = [
  {
    name: "Jason Hitchcock",
    twitter: "JasonHitchcock",
    description: "Head of Ecosystem",
    image: "/assets/landingpage/james.png",
  },
  {
    name: "Phil Ho",
    twitter: "arcoraven",
    description: "Engineering Lead, Engine",
    image: "/assets/landingpage/phil.png",
  },
  {
    name: "Samina Kabir",
    twitter: "saminacodes",
    description: "Product Manager, Developer Experience",
    image: "/assets/landingpage/samina.png",
  },
  {
    name: "Atif Khan",
    twitter: "atifkhan31",
    description: "VP, Business",
    image: "/assets/landingpage/atif.png",
  },
  {
    name: "Mike Shin",
    twitter: "mdjshin",
    description: "Head of Business Operations",
    image: "/assets/landingpage/mike.png",
  },
];

const trustedCompanies = [
  {
    title: "Coinbase",
    height: 74,
    width: 74,
    src: require("public/assets/partners/coinbase.png"),
  },
  {
    title: "Treasure",
    height: 74,
    width: 74,
    src: require("public/assets/partners/treasure.png"),
  },
  {
    title: "Layer3",
    height: 74,
    width: 74,
    src: require("public/assets/partners/layer3.png"),
  },
  {
    title: "Courtyard",
    height: 74,
    width: 74,
    src: require("public/assets/partners/courtyard.png"),
  },
  {
    title: "Rarible",
    height: 74,
    width: 74,
    src: require("public/assets/partners/rarible.png"),
  },
];

const faqs = [
  {
    title: "Who can join the thirdweb Startup Program?",
    description:
      "This program is for startups. You will need to be incorporated, have a website, complete a call with the thirdweb's startup team to demonstrate you're a real startup. This program is for startups who have raised less than $1m in total funding to date.",
  },
  {
    title: "What are the benefits of the program?",
    description:
      "Qualified startups gain access to an array of benefits including credits, prioritized support, co-marketing opportunities, educational resources, ecosystem connections, and more.",
  },
  {
    title: "How do I apply?",
    description:
      "You can apply in less than 2 minutes by filling out the application form and scheduling a call with our team.",
  },
  {
    title: "How do I get approved for credits?",
    description: (
      <span>
        Apply through{" "}
        <TrackedLink
          href="https://share.hsforms.com/1WCgMOvmuQqmCjdEqtu1NdAea58c"
          label="apply_faq"
          category={TRACKING_CATEGORY}
          color="primary.500"
          textDecoration="underline"
        >
          this
        </TrackedLink>{" "}
        link. Tell us about your project, any partner affiliations, and
        we&apos;ll schedule an onboarding call to get you started.
      </span>
    ),
  },
  {
    title: "Are current thirdweb customers eligible?",
    description:
      "Current customers and developers affiliated with a partner can also access benefits. Customers who've already received credits are not eligible for additional credits.",
  },
  {
    title: "How can I use my credits?",
    description:
      "Credits can be applied towards annual Growth plans and thirdweb Engine instances and usage.",
  },
];

const partnersCompanies = [
  { maxWidth: "99px", src: require("public/assets/partners/cpg.png") },
  {
    maxWidth: "252px",
    src: require("public/assets/partners/coinbaseventures.png"),
  },
  { maxWidth: "256px", src: require("public/assets/partners/finc.png") },
  { maxWidth: "180px", src: require("public/assets/partners/optimism.png") },
  { maxWidth: "207px", src: require("public/assets/partners/polygon.png") },
  { maxWidth: "168px", src: require("public/assets/partners/shopify.png") },
  { maxWidth: "180px", src: require("public/assets/partners/techstars.png") },
  { maxWidth: "208px", src: require("public/assets/partners/zksync.png") },
];

const StartupProgram: ThirdwebNextPage = () => {
  return (
    <>
      <NextSeo {...SEO} />
      <HomepageTopNav />
      <Box mt="-180px" pt="100px" overflowX="hidden">
        <HomepageSection isOverflowXHidden>
          {/* top */}
          <Aurora
            pos={{ left: "50%", top: "0%" }}
            size={{ width: "2400px", height: "1400px" }}
            color="hsl(260deg 78% 35% / 20%)"
          />

          <Flex
            flexDir="column"
            alignItems="center"
            mt={{ base: 20, md: 140 }}
            width="100%"
            pt="50px"
            px="20px"
          >
            <LandingDesktopMobileImage
              image={require("public/assets/landingpage/desktop/xl-logo.png")}
              mobileImage={require("public/assets/landingpage/mobile/xl-logo.png")}
              alt="thirdweb"
              maxW="279px"
              w="full"
            />

            <Heading
              fontSize={{ base: "48px", md: "80px" }}
              textAlign="center"
              mt={46}
            >
              Startup Program
            </Heading>

            <TrackedLinkButton
              py={6}
              px={8}
              bgColor="white"
              _hover={{
                bgColor: "white",
                opacity: 0.8,
              }}
              color="black"
              href="https://share.hsforms.com/1WCgMOvmuQqmCjdEqtu1NdAea58c"
              category={TRACKING_CATEGORY}
              label="apply"
              fontWeight="bold"
              mt={46}
            >
              Apply Now
            </TrackedLinkButton>
          </Flex>

          <Container
            maxW="container.page"
            as={Flex}
            flexDir="column"
            gap={{ base: "80px", md: "190px" }}
            mt={{ base: "120px", md: "170px" }}
            mb={60}
          >
            <Flex flexDir="column" alignItems="center" gap={8}>
              <Heading as="h1" size="title.2xl" textAlign="center">
                Why?
              </Heading>
              <Text
                textAlign="center"
                size="body.xl"
                color="white"
                maxW="549px"
              >
                The next wave of web3 mass adoption is already happening. If you
                want to be one of the next big crypto apps, the time to build is
                now!
              </Text>
            </Flex>

            <LandingGridSection desktopColumns={3}>
              <LandingIconSectionItem
                icon={require("public/assets/solutions-pages/loyalty/icon-7.png")}
                title="Supercharge your Growth"
                customDescription={
                  <List listStyleType="inherit" ml="20px" opacity={0.7}>
                    <ListItem>
                      Growth plan <b>free for 90 days</b>
                    </ListItem>
                    <ListItem margin="4px 0">
                      Engine <b>free for 90 days</b>
                    </ListItem>
                    <ListItem>
                      <b>$100 in thirdweb usage credits</b> for Embedded
                      wallets, RPC, Storage
                    </ListItem>
                  </List>
                }
              />
              <LandingIconSectionItem
                icon={require("public/assets/solutions-pages/loyalty/icon-2.svg")}
                title="Invites to our exclusive events and Community hackathons in SF and NYC"
                customDescription={
                  <List listStyleType="inherit" ml="20px" opacity={0.7}>
                    <ListItem>Get prioritized support</ListItem>
                    <ListItem margin="4px 0">
                      Access to monthly office hours
                    </ListItem>
                    <ListItem>
                      1:1 time with Customer Success Engineers and Mentors
                    </ListItem>
                  </List>
                }
              />
              <LandingIconSectionItem
                icon={require("public/assets/solutions-pages/loyalty/icon-1.png")}
                title="Increase Network with Ecosystem Leaders"
                customDescription={
                  <List listStyleType="inherit" ml="20px" opacity={0.7}>
                    <ListItem>Access to top accelerators and VCs</ListItem>
                    <ListItem margin="4px 0">
                      Invites to our invite-only events and Community hackathons
                      in SF and NYC
                    </ListItem>
                  </List>
                }
              />
            </LandingGridSection>

            <LandingImages
              title={
                <LandingSectionHeading
                  title="Trusted by the best"
                  blackToWhiteTitle=""
                />
              }
              gap="44px"
              images={trustedCompanies}
            />

            <Flex flexDir="column" alignItems="center">
              <LandingDesktopMobileImage
                image={require("public/assets/landingpage/desktop/hero-homepage.png")}
                mobileImage={require("public/assets/landingpage/mobile/hero-homepage.png")}
                w="full"
                maxW="499px"
              />
            </Flex>

            <Flex flexDir="column" alignItems="center">
              <Heading size="title.2xl">Startup Program Mentors</Heading>
              <SimpleGrid
                columns={{ base: 1, lg: 3 }}
                gap={{ base: 8, md: 24 }}
                px={4}
                w="full"
                mt="58px"
              >
                {judges.slice(0, 3).map((judge) => (
                  <Flex
                    key={judge.name}
                    flexDir="column"
                    gap={2}
                    alignItems="center"
                  >
                    <MaskedAvatar
                      boxSize={40}
                      objectFit="cover"
                      src={judge.image}
                      alt={judge.name}
                      borderRadius="full"
                    />
                    <Heading size="title.sm" mt={4} textAlign="center">
                      {judge.name}
                    </Heading>
                    <Text size="body.md" textAlign="center">
                      {judge.description}
                    </Text>
                    <TrackedLink
                      href={`https://twitter.com/${judge.twitter}`}
                      isExternal
                      category={TRACKING_CATEGORY}
                      label={judge.name}
                      textAlign="center"
                    >
                      <Text size="label.md" color="gray.500">
                        @{judge.twitter}
                      </Text>
                    </TrackedLink>
                  </Flex>
                ))}
              </SimpleGrid>

              <SimpleGrid
                columns={{ base: 1, lg: 2 }}
                gap={{ base: 8, md: 24 }}
                px={4}
                w="full"
                mt={{ base: 8, md: "90px" }}
                placeItems="center"
                maxW="600px"
              >
                {judges.slice(3, 5).map((judge) => (
                  <Flex
                    key={judge.name}
                    flexDir="column"
                    gap={2}
                    alignItems="center"
                  >
                    <MaskedAvatar
                      boxSize={40}
                      objectFit="cover"
                      src={judge.image}
                      alt={judge.name}
                      borderRadius="full"
                    />
                    <Heading size="title.sm" mt={4} textAlign="center">
                      {judge.name}
                    </Heading>
                    <Text size="body.md" textAlign="center">
                      {judge.description}
                    </Text>
                    <TrackedLink
                      href={`https://twitter.com/${judge.twitter}`}
                      isExternal
                      category={TRACKING_CATEGORY}
                      label={judge.name}
                      textAlign="center"
                    >
                      <Text size="label.md" color="gray.500">
                        @{judge.twitter}
                      </Text>
                    </TrackedLink>
                  </Flex>
                ))}
              </SimpleGrid>
            </Flex>

            <Flex flexDir="column" alignItems="center" w="full">
              <Heading
                fontSize={{ base: "32px", md: "48px" }}
                textAlign="center"
                mt={46}
              >
                Partners
              </Heading>

              <SimpleGrid
                columns={{ base: 1, lg: 4 }}
                gap={{ base: 16, md: 24 }}
                w="full"
                placeItems="center"
                mb={{ base: 16, md: "61px" }}
                mt="57px"
              >
                {partnersCompanies.slice(0, 4).map((partner, idx) => (
                  <ChakraNextImage
                    key={idx}
                    maxW={partner.maxWidth}
                    src={partner.src}
                    alt="partner"
                  />
                ))}
              </SimpleGrid>

              <SimpleGrid
                columns={{ base: 1, lg: 4 }}
                gap={{ base: 16, md: 24 }}
                w="full"
                placeItems="center"
              >
                {partnersCompanies.slice(4).map((partner, idx) => (
                  <ChakraNextImage
                    key={idx}
                    maxW={partner.maxWidth}
                    src={partner.src}
                    alt="partner"
                  />
                ))}
              </SimpleGrid>
            </Flex>

            <Flex flexDir="column" alignItems="center">
              <LandingFAQ
                hideMarginTop
                TRACKING_CATEGORY={TRACKING_CATEGORY}
                title={"FAQ"}
                faqs={faqs}
                titleSize="title.2xl"
              />
            </Flex>
          </Container>
        </HomepageSection>
        <HomepageFooter />
      </Box>
    </>
  );
};

StartupProgram.pageId = PageId.StartupProgram;

export default StartupProgram;
