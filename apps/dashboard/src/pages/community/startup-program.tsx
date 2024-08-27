import { useForceDarkTheme } from "@/components/theme-provider";
import { Box, Flex, Grid } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import FastTrackChains from "components/community/FastTrackChains";
import PartnersSection from "components/community/PartnersSection";
import StartupCard from "components/community/StartupCards";
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

const TRACKING_CATEGORY = "startup-program";

const SEO = {
  title: "Startup program",
  description:
    "The next wave of web3 mass adoption is already happening. If you want to be one of the next big crypto apps, the time to build is now!",
};

const trustedCompanies = [
  {
    title: "Rug Radio",
    height: 74,
    width: 74,
    src: require("../../../public/assets/startup-program/logo-rugradio.png"),
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
    title: "CoolCats",
    height: 74,
    width: 74,
    src: require("../../../public/assets/startup-program/rarible-icon.png"),
  },
  {
    title: "Fnatic",
    height: 74,
    width: 74,
    src: require("../../../public/assets/startup-program/treasure-icon.png"),
  },
  {
    title: "Mynaswap",
    height: 74,
    width: 74,
    src: require("../../../public/assets/startup-program/layer3-icon.png"),
  },
  {
    title: "XAI",
    height: 74,
    width: 74,
    src: require("../../../public/assets/startup-program/courtyard-icon.png"),
  },
];

const gradientSecond = {
  src: require("../../../public/assets/startup-program/gradient-2.png"),
};

const gradientFive = {
  src: require("../../../public/assets/startup-program/gradient-5.png"),
};

const ellipse = {
  src: require("../../../public/assets/startup-program/ellipse-track.png"),
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

const leftColumnItems = [
  { id: "1", text: "The program is only for startups." },
  { id: "2", text: "We don't take any equity in your company." },
  { id: "3", text: "We don't take weeks/months to decide." },
];

const rightColumnItems = [
  { id: "4", text: "We don't charge any fees." },
  { id: "5", text: "We don't tell you what to do." },
  { id: "6", text: "We don't require decks, business plans, or MBAs." },
];

const StartupProgram: ThirdwebNextPage = () => {
  useForceDarkTheme();

  return (
    <>
      <NextSeo {...SEO} />
      <HomepageTopNav />

      {/* Image placed on the top top */}
      <Box position="absolute" top="0" left="0" zIndex="1">
        <ChakraNextImage
          src={gradientSecond.src}
          width="100%"
          height="auto"
          objectFit="contain"
          alt="description"
        />
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

      {/* Aurora gradient */}
      <HomepageSection overflow={"hidden"}>
        {/* top */}
        <Aurora
          pos={{ left: "50%", top: "0%" }}
          size={{ width: "2400px", height: "1400px" }}
          color="hsl(260deg 78% 35% / 20%)"
        />
      </HomepageSection>

      {/* CTA hero */}
      <HomepageSection pb={6} overflowX="hidden" position="relative">
        <Flex flexDir="column" align={{ base: "initial", md: "center" }}>
          <Flex
            flexDir="column"
            alignItems={{ base: "center", md: "flex-start" }}
            width="100%"
            pt="50px"
            px="30px"
            position="relative"
          >
            <Heading
              fontSize={{ base: "48px", md: "80px" }}
              textAlign={{ base: "center", md: "left" }}
              mt={46}
            >
              Join our Startup <br />
              Program
            </Heading>

            <Flex
              flexDir="column"
              alignItems={{ base: "center", md: "flex-start" }}
              gap={8}
              paddingTop={10}
            >
              <Text
                textAlign={{ base: "center", md: "left" }}
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

          {/* Cube Image */}
          <Box
            position="absolute"
            top={0}
            right={0}
            zIndex="-1"
            display={{ base: "none", lg: "block" }}
            width="60%"
            maxWidth="500px"
          >
            <ChakraNextImage
              src={cubeRight.src}
              alt="description"
              objectFit="contain"
              objectPosition="right"
            />
          </Box>
        </Flex>
      </HomepageSection>

      {/* Boxes Layout */}
      <HomepageSection pb={32} overflowX="hidden">
        <Flex
          pt={24}
          flexDir="column"
          gap={{ base: 6, md: 8 }}
          align={{ base: "initial", md: "center" }}
        >
          <StartupCard />
        </Flex>
      </HomepageSection>

      {/* Startups logos */}
      <HomepageSection pb={32} overflow={"hidden"}>
        <Flex
          pt={24}
          flexDir="column"
          gap={{ base: 6, md: 8 }}
          align={{ base: "initial", md: "center" }}
        >
          <LandingImages
            title={
              <Box maxW={"700px"}>
                <LandingSectionHeading
                  title="The best startups launch with thirdweb"
                  blackToWhiteTitle=""
                />
              </Box>
            }
            gap="44px"
            images={trustedCompanies}
          />
        </Flex>
      </HomepageSection>

      {/* Partners */}
      <HomepageSection pb={32} overflow={"hidden"}>
        <Flex
          pt={24}
          flexDir="column"
          gap={{ base: 6, md: 8 }}
          align={{ base: "initial", md: "center" }}
        >
          <Flex
            flexDir="column"
            alignItems="center"
            w="full"
            mb={{ base: "150px", xl: "300px" }}
          >
            <Heading
              fontSize={{ base: "32px", md: "48px" }}
              textAlign="center"
              mt={46}
            >
              Partners
            </Heading>

            <PartnersSection />
          </Flex>
        </Flex>
      </HomepageSection>

      {/* Ellipse fast track */}
      <Flex display={{ base: "none", lg: "block" }}>
        <Box width="100%" mx="auto">
          <ChakraNextImage
            src={ellipse.src}
            alt="description"
            width="100%"
            height="auto"
            objectFit="cover"
          />
        </Box>
      </Flex>

      {/* Fast Track */}
      <HomepageSection pb={32} overflow={"hidden"}>
        <Flex
          pt={24}
          flexDir="column"
          gap={{ base: 6, md: 8 }}
          align={{ base: "initial", md: "center" }}
        >
          <Flex
            flexDir="column"
            alignItems="center"
            justifyContent="center"
            width="100%"
            position="relative"
            my="40px"
          >
            <FastTrackChains />
          </Flex>
        </Flex>
      </HomepageSection>

      {/* CTA Founders */}
      <HomepageSection pb={32} overflow={"hidden"}>
        <Box position="relative" mb="20">
          <ChakraNextImage
            src={gradientFive.src}
            alt="description"
            width="100%"
            opacity={0.6}
            position="absolute"
            bottom={0}
            left="50%"
            top="10%"
            transform="translateX(-50%)"
            zIndex={0}
          />
          <ChakraNextImage
            src={cubeBottom.src}
            alt="description"
            maxW="500px"
            position="absolute"
            left="60%"
            bottom="-100%"
            transform="translateX(-50%)"
            zIndex={1}
            display={{ base: "none", lg: "block" }}
          />

          <Flex
            pt={14}
            flexDir="column"
            gap={{ base: 6, md: 8 }}
            align={{ base: "initial", md: "center" }}
            zIndex={1}
            position="relative"
          >
            <Flex flexDir="column" alignItems="center" width="100%" px="20px">
              <Heading
                fontSize={{ base: "48px", md: "80px" }}
                textAlign="center"
                mb="20px"
              >
                We put founders first.
              </Heading>

              <Flex
                flexDir="column"
                alignItems="center"
                gap={8}
                paddingTop={10}
                pt={{ base: 0, md: 6 }}
              >
                <Grid
                  templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                  gap={{ base: 0, md: 6 }}
                  w="full"
                >
                  {/* Left Column */}
                  <Box flex="1">
                    {leftColumnItems.map((item) => (
                      <Text
                        key={item.id}
                        as="li"
                        mb={{ base: 0, md: 4 }}
                        color="white"
                        fontSize={{ base: "14px", md: "20px" }}
                        fontWeight="medium"
                      >
                        {item.text}
                      </Text>
                    ))}
                  </Box>

                  {/* Right Column */}
                  <Box flex="1">
                    {rightColumnItems.map((item) => (
                      <Text
                        key={item.id}
                        as="li"
                        mb={{ base: 0, md: 4 }}
                        color="white"
                        fontSize={{ base: "14px", md: "20px" }}
                        fontWeight="medium"
                      >
                        {item.text}
                      </Text>
                    ))}
                  </Box>
                </Grid>
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
          </Flex>
        </Box>
      </HomepageSection>

      <HomepageFooter />
    </>
  );
};

StartupProgram.pageId = PageId.StartupProgram;

export default StartupProgram;
