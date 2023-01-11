import { Aurora } from "../Aurora";
import { Box, Center, Flex, Icon, SimpleGrid } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { HomepageSection } from "components/product-pages/homepage/HomepageSection";
import React from "react";
import { FiArrowRight } from "react-icons/fi";
import { Heading, Text, TrackedLink } from "tw-components";

const sections = [
  {
    title: "Create.",
    description:
      "Bootstrap your contracts or web3 powered apps with one command.",
    link: "https://portal.thirdweb.com/create",
    img: require("/public/assets/landingpage/cli-create.png"),
  },
  {
    title: "Release.",
    description:
      "Publish contracts to the on-chain registry to enable one-click deployment for everyone.",
    link: "https://portal.thirdweb.com/release",
    img: require("/public/assets/landingpage/cli-release.png"),
  },
  {
    title: "Deploy.",
    description: "Deploy any smart contract with a single command.",
    link: "https://portal.thirdweb.com/deploy",
    img: require("/public/assets/landingpage/cli-deploy.png"),
  },
] as const;

/**
 * Highlights 3 Core Feature of the ThirdWeb CLI: Create, Release, Deploy
 */
export const CLISection = () => {
  return (
    <HomepageSection id="developers" my={40}>
      <Flex direction="column" w="full" gap={12}>
        {sections.map((activeSection, idx) => {
          return (
            <React.Fragment key={activeSection.title}>
              <SimpleGrid
                position="relative"
                columns={{ base: 1, md: 2 }}
                alignItems="center"
                justifyItems="stretch"
                gap={4}
                w="full"
              >
                <Aurora
                  pos={{ left: "75%", top: "60%" }}
                  size={{ width: "1100px", height: "1100px" }}
                  color="hsl(280deg 78% 35% / 25%)"
                />

                <Flex direction="column">
                  <Heading
                    fontWeight={700}
                    fontSize={{ base: "56px", lg: "72px" }}
                    letterSpacing="-0.04em"
                    bg="linear-gradient(180deg,#fff,hsla(0,0%,100%,.75))"
                    bgClip={"text"}
                    textAlign={{ base: "center", md: "left" }}
                    mb={6}
                  >
                    {activeSection.title}
                  </Heading>

                  <Text
                    fontSize={{ base: "16px", md: "20px" }}
                    color="whiteAlpha.700"
                    maxW={{ base: "full", md: "75%" }}
                    mr="auto"
                    mb={4}
                    textAlign={{ base: "center", md: "left" }}
                  >
                    {activeSection.description}
                  </Text>

                  <TrackedLink
                    href={activeSection.link}
                    category="cli-section"
                    label={activeSection.title.toLowerCase()}
                    display="flex"
                    alignItems="center"
                    justifyContent={{ base: "center", md: "flex-start" }}
                    gap={2}
                    size="label.lg"
                    isExternal
                    mb={4}
                  >
                    <span>Learn More</span> <Icon as={FiArrowRight} />
                  </TrackedLink>
                </Flex>

                <ChakraNextImage
                  src={activeSection.img}
                  alt=""
                  w="100%"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading="lazy"
                  borderRadius={"18px"}
                  boxShadow="0 0 0 1px hsl(0deg 0% 100% / 15%)"
                />
              </SimpleGrid>
              {idx !== sections.length - 1 && (
                <SimpleGrid
                  columns={{ base: 1, md: 2 }}
                  alignItems="center"
                  justifyItems="stretch"
                  gap={4}
                  w="full"
                >
                  <Box display={{ base: "none", md: "block" }} />
                  <Center>
                    <ChakraNextImage
                      src={require("/public/assets/landingpage/cli-down-arrow.png")}
                      alt=""
                      boxSize={8}
                    />
                  </Center>
                </SimpleGrid>
              )}
            </React.Fragment>
          );
        })}
      </Flex>
    </HomepageSection>
  );
};
