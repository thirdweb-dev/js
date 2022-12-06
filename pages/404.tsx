import { Box, Center, DarkMode, Flex } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { HomepageSection } from "components/product-pages/homepage/HomepageSection";
import { PageId } from "page-id";
import NotFound from "public/assets/landingpage/not-found.png";
import { Heading, Text, TrackedLink } from "tw-components";
import { ThirdwebNextPage } from "utils/types";

const PageNotFound: ThirdwebNextPage = () => {
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
        justifyContent="center"
        alignItems="center"
        h="100vh"
        overflow="hidden"
      >
        <HomepageSection topGradient>
          <Center mb={6}>
            <Center p={2} position="relative" mb={6}>
              <Box
                position="absolute"
                bgGradient="linear(to-r, #F213A4, #040BBF)"
                top={0}
                left={0}
                bottom={0}
                right={0}
                borderRadius="3xl"
                overflow="visible"
                filter="blur(15px)"
              />

              <ChakraNextImage
                alt=""
                boxSize={{ base: 24, md: 32 }}
                placeholder="empty"
                src={NotFound}
              />
            </Center>
          </Center>
          <Heading textAlign="center" size="display.md">
            Uh oh.
            <br />
            Looks like web3
            <br />
            can&apos;t be found here.
          </Heading>
          <Text size="body.2xl" textAlign="center" mt={3}>
            Try our{" "}
            <TrackedLink
              category="page-not-found"
              label="homepage"
              href="/"
              color="blue.500"
            >
              homepage
            </TrackedLink>
            ,{" "}
            <TrackedLink
              category="page-not-found"
              label="homepage"
              href="/dashboard"
              color="blue.500"
            >
              dashboard
            </TrackedLink>{" "}
            or{" "}
            <TrackedLink
              category="page-not-found"
              label="portal"
              href="https://portal.thirdweb.com"
              color="blue.500"
            >
              developer portal
            </TrackedLink>{" "}
            instead.
          </Text>
        </HomepageSection>
      </Flex>
    </DarkMode>
  );
};

PageNotFound.pageId = PageId.PageNotFound;

export default PageNotFound;
