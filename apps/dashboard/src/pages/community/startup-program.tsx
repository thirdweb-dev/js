import { Box, Container, Flex, SimpleGrid } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { HomepageFooter } from "components/footer/Footer";
import { Aurora } from "components/homepage/Aurora";
import { LandingImages } from "components/landing-pages/card-with-image";
import { LandingSectionHeading } from "components/landing-pages/section-heading";
import { HomepageTopNav } from "components/product-pages/common/Topnav";
import { HomepageSection } from "components/product-pages/homepage/HomepageSection";
import { NextSeo } from "next-seo";
import { PageId } from "page-id";
import { Heading, Text, TrackedLinkButton } from "tw-components";
import type { ThirdwebNextPage } from "utils/types";
import ThreeBoxLayout from "./three-box-layout";

const TRACKING_CATEGORY = "startup-program";

const SEO = {
  title: "Startup program",
  description:
    "The next wave of web3 mass adoption is already happening. If you want to be one of the next big crypto apps, the time to build is now!",
};

// const judges = [
//   {
//     name: "Jason Hitchcock",
//     twitter: "JasonHitchcock",
//     description: "Head of Ecosystem",
//     image: "/assets/landingpage/james.png",
//   },
//   {
//     name: "Phil Ho",
//     twitter: "arcoraven",
//     description: "Engineering Lead, Engine",
//     image: "/assets/landingpage/phil.png",
//   },
//   {
//     name: "Samina Kabir",
//     twitter: "saminacodes",
//     description: "Product Manager, Developer Experience",
//     image: "/assets/landingpage/samina.png",
//   },
//   {
//     name: "Atif Khan",
//     twitter: "atifkhan31",
//     description: "VP, Business",
//     image: "/assets/landingpage/atif.png",
//   },
//   {
//     name: "Mike Shin",
//     twitter: "mdjshin",
//     description: "Head of Business Operations",
//     image: "/assets/landingpage/mike.png",
//   },
// ];

const trustedCompanies = [
  {
    title: "Coinbase",
    height: 74,
    width: 74,
    src: require("../../../public/assets/partners/coinbase.png"),
  },
  {
    title: "Treasure",
    height: 74,
    width: 74,
    src: require("../../../public/assets/partners/treasure.png"),
  },
  {
    title: "Layer3",
    height: 74,
    width: 74,
    src: require("../../../public/assets/partners/layer3.png"),
  },
  {
    title: "Courtyard",
    height: 74,
    width: 74,
    src: require("../../../public/assets/partners/courtyard.png"),
  },
  {
    title: "Rarible",
    height: 74,
    width: 74,
    src: require("../../../public/assets/partners/rarible.png"),
  },
];

/* const faqs = [
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
  {
    title: "How much is Engine through the startup program?",
    description:
      "First 90 days free, $99/month thereafter per engine instance.",
  },
  {
    title: "How much is the Growth plan through the startup program?",
    description: "First 90 days free, $99 per month after credits expire.",
  },
]; */

const partnersCompanies = [
  { maxWidth: "99px", src: require("../../../public/assets/partners/cpg.png") },
  {
    maxWidth: "252px",
    src: require("../../../public/assets/partners/coinbaseventures.png"),
  },
  {
    maxWidth: "256px",
    src: require("../../../public/assets/partners/finc.png"),
  },
  {
    maxWidth: "180px",
    src: require("../../../public/assets/partners/optimism.png"),
  },
  {
    maxWidth: "207px",
    src: require("../../../public/assets/partners/polygon.png"),
  },
  {
    maxWidth: "180px",
    src: require("../../../public/assets/partners/techstars.png"),
  },
  {
    maxWidth: "207px",
    src: require("../../../public/assets/partners/haun.png"),
  },
  {
    maxWidth: "207px",
    src: require("../../../public/assets/partners/monad.png"),
  },
  {
    maxWidth: "256px",
    src: require("../../../public/assets/partners/bitkraft.png"),
  },
  {
    maxWidth: "256",
    src: require("../../../public/assets/partners/helika.png"),
  },

  {
    maxWidth: "99px",
    src: require("../../../public/assets/partners/play.png"),
  },
];

const gradientSecond = {
  src: require("../../../public/assets/startup-program/gradient-2.png"),
  title: "We help you get in front of key industry partners, mentors & VCs.",
  text: "Get connected to experts in the ecosystem, including proven founders, operators, VCs, angel investors and mentors who help founders in our program navigate challenges and opportunities.",
};

const gradientThree = {
  src: require("../../../public/assets/startup-program/gradient-3.png"),
  title: "We help you get in front of key industry partners, mentors & VCs.",
  text: "Get connected to experts in the ecosystem, including proven founders, operators, VCs, angel investors and mentors who help founders in our program navigate challenges and opportunities.",
};

const gradientFive = {
  src: require("../../../public/assets/startup-program/gradient-5.png"),
  title: "We help you get in front of key industry partners, mentors & VCs.",
  text: "Get connected to experts in the ecosystem, including proven founders, operators, VCs, angel investors and mentors who help founders in our program navigate challenges and opportunities.",
};

const StartupProgram: ThirdwebNextPage = () => {
  return (
    <>
      <NextSeo {...SEO} />
      <HomepageTopNav />

      <Box mt="-180px" pt="100px" overflowX="hidden">
        {/* Image placed on the top top */}
        <Box position="absolute" top="0" left="0" zIndex="1">
          <ChakraNextImage src={gradientSecond.src} alt="description" />
        </Box>

        {/* Gradient Box */}
        <Box position="absolute" top="150px" right="0" zIndex="1">
          <ChakraNextImage
            src={gradientThree.src}
            alt="description"
            maxW="500px"
            opacity={0.5}
          />
        </Box>

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
            <Heading
              fontSize={{ base: "48px", md: "80px" }}
              textAlign="center"
              mt={46}
            >
              Startup Program
            </Heading>

            <Flex flexDir="column" alignItems="center" gap={8} paddingTop={10}>
              <Text
                textAlign="center"
                size="body.xl"
                color="white"
                maxW="800px"
              >
                We help web3 startups accelerate
                <br />
                their progress at every stage.
              </Text>
            </Flex>

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
            <ThreeBoxLayout />

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
                    // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
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
                    // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
                    key={idx}
                    maxW={partner.maxWidth}
                    src={partner.src}
                    alt="partner"
                  />
                ))}
              </SimpleGrid>
              <Box textAlign="center" mt="64px">
                <Text
                  textAlign="center"
                  size="body.xl"
                  color="white"
                  maxW="800px"
                >
                  Are you a chain or an investor looking to get involved?
                </Text>
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
                  mt="2rem"
                >
                  Contact us
                </TrackedLinkButton>
              </Box>
            </Flex>

            {/*   <Flex flexDir="column" alignItems="center">
              <LandingFAQ
                hideMarginTop
                TRACKING_CATEGORY={TRACKING_CATEGORY}
                title={"FAQ"}
                faqs={faqs}
                titleSize="title.2xl"
              />
            </Flex> */}

            <Flex
              flexDir="column"
              alignItems="center"
              mt={{ base: 20, md: 140 }}
              width="100%"
              px="20px"
            >
              <Heading
                fontSize={{ base: "48px", md: "80px" }}
                textAlign="center"
              >
                We put founders first.
              </Heading>

              <Flex
                flexDir="column"
                alignItems="center"
                gap={8}
                paddingTop={10}
              >
                <Text
                  textAlign="center"
                  size="body.xl"
                  color="white"
                  maxW="800px"
                >
                  The program is only for startups. We don&apos;t take any
                  equity in your company. We don&apos;t take weeks/months to
                  decide. We don&apos;t charge any fees. We don&apos;t tell you
                  what to do. We don&apos;t require decks, business plans, or
                  MBAs.
                </Text>
              </Flex>

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
            {/* Gradient Box */}
            <Box
              position="absolute"
              bottom="-250px"
              left={{ base: 0, md: "250px" }}
              zIndex="-1"
            >
              <ChakraNextImage
                src={gradientFive.src}
                alt="description"
                maxW="600px"
                opacity={0.6}
              />
            </Box>
          </Container>
        </HomepageSection>

        <HomepageFooter />
      </Box>
    </>
  );
};

StartupProgram.pageId = PageId.StartupProgram;

export default StartupProgram;
