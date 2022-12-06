import { Box, Center, Flex, Icon, SimpleGrid } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { HomepageSection } from "components/product-pages/homepage/HomepageSection";
import React from "react";
import { FiArrowRight } from "react-icons/fi";
import { Heading, Text, TrackedLink } from "tw-components";

const sections = [
  {
    title: "Create",
    description:
      "Bootstrap your contracts or web3 powered apps with one command.",
    link: "https://portal.thirdweb.com/create",
    img: require("/public/assets/landingpage/cli-create.png"),
    gradient: "linear-gradient(90.78deg, #486AC2 5.13%, #E41CA7 44.51%)",
  },
  {
    title: "Release",
    description:
      "Publish contracts to the on-chain registry to enable one-click deployment for everyone.",
    link: "https://portal.thirdweb.com/release",
    img: require("/public/assets/landingpage/cli-release.png"),
    gradient: "linear-gradient(90.12deg, #6941DA 6.29%, #FFE768 47.27%)",
  },
  {
    title: "Deploy",
    description: "Deploy any smart contract with a single command.",
    link: "https://portal.thirdweb.com/deploy",
    img: require("/public/assets/landingpage/cli-deploy.png"),
    gradient: "linear-gradient(128deg, #410AB6 -9.03%, #5CFFE1 98.25%)",
  },
] as const;

/**
 * Highlights 3 Core Feature of the ThirdWeb CLI: Create, Release, Deploy
 */
export const CLISection = () => {
  return (
    <HomepageSection
      id="developers"
      py={{ base: 24, md: 48 }}
      middleGradient
      bottomGradient
    >
      <Flex
        flexDir="column"
        // pt={{ base: 12, lg: 1 }}
        align="center"
        gap={{ base: 6, md: 8 }}
      >
        <Heading as="h2" size="display.sm" textAlign="center" mb={24}>
          For developers, by developers.
        </Heading>
        <Flex direction="column" w="full" gap={12}>
          {sections.map((activeSection, idx) => {
            return (
              <React.Fragment key={activeSection.title}>
                <SimpleGrid
                  columns={{ base: 1, md: 2 }}
                  alignItems="center"
                  justifyItems="stretch"
                  gap={4}
                  w="full"
                >
                  <Flex direction="column" gap={8}>
                    <Heading
                      bgClip="text"
                      bgImage={activeSection.gradient}
                      size="display.sm"
                      mr="auto"
                      pr="100px"
                    >
                      {activeSection.title}
                    </Heading>

                    <Text
                      size="body.xl"
                      color="rgba(255, 255, 255, 0.8)"
                      maxW={{ base: "full", md: "75%" }}
                      mr="auto"
                    >
                      {activeSection.description}
                    </Text>

                    <TrackedLink
                      href={activeSection.link}
                      category="cli-section"
                      label={activeSection.title.toLowerCase()}
                      display="flex"
                      alignItems="center"
                      gap={2}
                      size="label.lg"
                      fontWeight="600"
                      mr="auto"
                      isExternal
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
      </Flex>
    </HomepageSection>
  );
};
