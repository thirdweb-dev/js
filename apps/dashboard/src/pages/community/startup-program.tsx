import { useForceDarkTheme } from "@/components/theme-provider";
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
  {
    maxWidth: "200px",
    src: require("../../../public/assets/startup-program/ava1anche_logo.png"),
  },
  {
    maxWidth: "150px",
    src: require("../../../public/assets/startup-program/powered-by-aws-white.png"),
  },
];

const gradientSecond = {
  src: require("../../../public/assets/startup-program/gradient-2.png"),
};

const gradientFive = {
  src: require("../../../public/assets/startup-program/gradient-5.png"),
};

const cubeTop = {
  src: require("../../../public/assets/startup-program/cube-top.png"),
};

const cubeRight = {
  src: require("../../../public/assets/startup-program/cube-topright.png"),
};

const cubeBottom = {
  src: require("../../../public/assets/startup-program/cube-bottom.png"),
};

const StartupProgram: ThirdwebNextPage = () => {
  useForceDarkTheme();
  return (
    <>
      <NextSeo {...SEO} />
      <HomepageTopNav />

      <Box overflow={"hidden"} position="relative">
        {/* Image placed on the top top */}
        <Box position="absolute" top="0" left="0" zIndex="1">
          <ChakraNextImage src={gradientSecond.src} alt="description" />
        </Box>

        {/* Cube Top */}
        <Box
          position="absolute"
          top="-150px"
          left="50%"
          transform="translateX(-50%)"
          zIndex="1"
          display={{ base: "none", md: "block" }}
        >
          <ChakraNextImage src={cubeTop.src} alt="description" maxW="500px" />
        </Box>

        {/* Cube Topright */}
        <Box
          position="absolute"
          top={{ base: "420px", md: "50px" }}
          right={{ base: "0px", md: "-200px" }}
          zIndex="1"
        >
          <ChakraNextImage
            src={cubeRight.src}
            alt="description"
            maxW={{ base: "400px", md: "600px" }}
          />
        </Box>

        <HomepageSection overflow={"hidden"}>
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
              zIndex="1000"
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
            overflow="hidden"
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
            </Flex>

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
                zIndex="1000"
              >
                Apply Now
              </TrackedLinkButton>
            </Flex>
            {/* Gradient Box */}
            <Box
              position="absolute"
              bottom="-280px"
              left={{ base: 0, md: "150px" }}
              zIndex="-1"
            >
              <ChakraNextImage
                src={gradientFive.src}
                alt="description"
                maxW="800px"
                opacity={0.6}
              />
            </Box>
            {/* Cube Top */}
            <Box
              position="absolute"
              bottom="-450px"
              left="60%"
              transform="translateX(-50%)"
              zIndex="1"
            >
              <ChakraNextImage
                src={cubeBottom.src}
                alt="description"
                maxW="500px"
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
