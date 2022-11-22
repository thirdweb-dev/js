import { Box, Flex, Icon, Image, Link, VStack } from "@chakra-ui/react";
import { ImMagicWand } from "@react-icons/all-files/im/ImMagicWand";
import { useTrack } from "hooks/analytics/useTrack";
import type { FC } from "react";
import { FiArrowRightCircle } from "react-icons/fi";
import { Heading, LinkButton } from "tw-components";

export const HackathonFooter: FC = () => {
  const trackEvent = useTrack();

  return (
    <VStack bgColor="#152238" py={0} gap={0} borderTopRadius="50px">
      <Heading
        size="title.2xl"
        textAlign="center"
        textShadow="3px 3px #fc5dea"
        paddingTop={10}
      >
        HACKATHON WINNERS
      </Heading>
      <Box
        display={{ md: "flex" }}
        alignItems={{ lg: "center" }}
        justifyContent={{ lg: "space-between" }}
        p={2}
        columnGap={10}
      >
        {/* 2nd Plce */}
        <Flex marginTop={40}>
          <Box padding={5}>
            <Heading size="title.xl" textAlign="center">
              RareLabs
            </Heading>
            <Heading
              size="title.lg"
              color="green.300"
              textAlign="center"
              margin={4}
            >
              2nd Place
            </Heading>
            <Box
              maxWidth="500px"
              boxShadow="4px 4px 0px 4px #fc5dea"
              border="1px solid white"
            >
              <Image
                src="/assets/hackathon/secondplace.jpeg"
                alt="Solana Hackathon"
                w={{ base: "300px", md: "500px" }}
                objectFit="contain"
              />
            </Box>
            <Link
              href="https://fredoist.hashnode.dev/solanathon"
              fontWeight="bold"
              display="flex"
              padding={5}
              fontSize="16px"
              flexShrink={0}
              textTransform="uppercase"
              alignItems="center"
              justifyContent="center"
              justifyItems="center"
            >
              View Project
              <Icon as={FiArrowRightCircle} ml="1" />
            </Link>
          </Box>
        </Flex>

        {/* 1st place */}
        <Flex>
          <Box padding={3}>
            <Heading size="title.xl" textAlign="center">
              Dungeon3
            </Heading>
            <Heading
              size="title.lg"
              color="green.300"
              textAlign="center"
              margin={4}
            >
              1st Place
            </Heading>
            <Box
              maxWidth="500px"
              boxShadow="4px 4px 0px 4px #fc5dea"
              border="1px solid white"
            >
              <Image
                src="/assets/hackathon/firstplace.jpeg"
                alt="Solana Hackathon"
                w={{ base: "300px", md: "500px" }}
                objectFit="contain"
              />
            </Box>
            <Link
              href="https://metamake.hashnode.dev/build-an-rpg-game-on-solana"
              fontWeight="bold"
              display="flex"
              padding={5}
              fontSize="16px"
              flexShrink={0}
              textTransform="uppercase"
              alignItems="center"
              justifyContent="center"
              justifyItems="center"
            >
              View Project
              <Icon as={FiArrowRightCircle} ml="1" />
            </Link>
          </Box>
        </Flex>

        {/* 3rd Place */}
        <Flex marginTop={{ md: "60" }}>
          <Box padding={3}>
            <Heading size="title.xl" textAlign="center">
              Rukugaki
            </Heading>
            <Heading
              size="title.lg"
              color="green.300"
              textAlign="center"
              margin={4}
            >
              3rd Place
            </Heading>
            <Box
              maxWidth="500px"
              boxShadow="4px 4px 0px 4px #fc5dea"
              border="1px solid white"
            >
              <Image
                src="/assets/hackathon/thirdplace.jpeg"
                alt="Solana Hackathon"
                w={{ base: "300px", md: "500px" }}
                objectFit="contain"
              />
            </Box>
            <Link
              href="https://2022-solanathon-submission.vercel.app/"
              fontWeight="bold"
              display="flex"
              padding={5}
              fontSize="16px"
              flexShrink={0}
              textTransform="uppercase"
              alignItems="center"
              justifyContent="center"
              justifyItems="center"
            >
              View Project
              <Icon as={FiArrowRightCircle} ml="1" />
            </Link>
          </Box>
        </Flex>
      </Box>
    </VStack>
  );
};
