import { Box, Flex } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { Heading, Text } from "tw-components";

const StartupCard = () => {
  const credits = {
    maxWidth: "252px",
    src: require("../../../public/assets/startup-program/buildandscale-image.png"),
    title: "We give you credits to help you test, build and scale.",
    text: "Get 3 months of Engine & Growth Plan for free. This gives you access to a full stack web3 development platform with production grade infrastructure, guaranteed supported response time, and generous usage credits for wallets, RPCs, and storage.",
  };

  const community = {
    maxWidth: "252px",
    src: require("../../../public/assets/startup-program/community-image.png"),
    title: "We help you find a community to build and grow together.",
    text: "Join a cohort of like-minded founders in the ecosystem with weekly speaker sessions, office hours and community events. Access the network of alumni in the program who can provide advice and intros.",
  };

  const partners = {
    maxWidth: "252px",
    src: require("../../../public/assets/startup-program/mentorsandVCs-image.png"),
    title: "We help you get in front of key industry partners, mentors & VCs.",
    text: "Get connected to experts in the ecosystem, including proven founders, operators, VCs, angel investors and mentors who help founders in our program navigate challenges and opportunities.",
  };

  const cubeTopleft = {
    src: require("../../../public/assets/startup-program/cube-topleft.png"),
  };

  const gradientPink = {
    src: require("../../../public/assets/startup-program/gradient-1.png"),
  };

  return (
    <Flex direction={{ base: "column", md: "row" }} wrap="wrap" gap={4} p={4}>
      {/* Cube topleft */}
      <Box
        position="absolute"
        top="600px"
        left="-280"
        zIndex="-1"
        display={{ base: "none", lg: "block" }}
      >
        <ChakraNextImage src={cubeTopleft.src} alt="description" maxW="500px" />
      </Box>

      <Flex
        direction="column"
        flex={{ base: "none", md: "1" }}
        width={{ base: "100%", md: "50%" }}
        gap={4}
        alignItems={{ base: "stretch", md: "stretch" }}
        minWidth={{ base: "100%", md: "415px" }}
      >
        {/* pink gradient */}
        <Box
          position="absolute"
          top="-20%"
          left="-30%"
          zIndex="-1"
          display={{ base: "none", lg: "block" }}
        >
          <ChakraNextImage
            src={gradientPink.src}
            maxW="100%"
            height="auto"
            objectFit="contain"
            alt="gradient"
            opacity={0.4}
          />
        </Box>

        {/* Credits Box */}
        <Box
          display="flex"
          flexDirection={{ base: "column", lg: "row" }}
          alignItems="center"
          justifyContent="space-between"
          bg="#131418"
          borderRadius="8px"
          border="1px solid"
          borderColor="#26282F"
          overflow="hidden"
          minHeight={{ base: "auto", lg: "361px" }}
          width="100%"
        >
          <Flex
            direction="column"
            flex="1"
            justify="center"
            textAlign="left"
            alignSelf="flex-end"
            p={6}
          >
            <Heading
              fontSize={{ base: "22px", lg: "24px" }}
              fontWeight="bold"
              letterSpacing="-0.025em"
            >
              {credits.title}
            </Heading>
            <Text
              mt={4}
              fontSize="14px"
              opacity={0.7}
              color="#fff"
              fontWeight="medium"
            >
              {credits.text}
            </Text>
          </Flex>

          <Box
            flex="1"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <ChakraNextImage
              width={{ base: "80%", lg: "250px" }}
              height={{ base: "auto", lg: "361px" }}
              src={credits.src}
              alt="credits"
            />
          </Box>
        </Box>

        {/* Community Box */}
        <Box
          display="flex"
          flexDirection={{ base: "column", lg: "row" }}
          alignItems="center"
          justifyContent="space-between"
          bg="#131418"
          borderRadius="8px"
          border="1px solid"
          borderColor="#26282F"
          overflow="hidden"
          minHeight={{ base: "auto", lg: "361px" }}
          width="100%"
        >
          <Flex
            direction="column"
            flex="1"
            justify="center"
            alignSelf="flex-end"
            textAlign="left"
            p={6}
          >
            <Heading
              fontSize={{ base: "22px", lg: "24px" }}
              fontWeight="bold"
              letterSpacing="-0.025em"
            >
              {community.title}
            </Heading>
            <Text
              mt={4}
              fontSize="14px"
              opacity={0.7}
              color="#fff"
              fontWeight="medium"
            >
              {community.text}
            </Text>
          </Flex>

          <Box
            flex="1"
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            <ChakraNextImage
              width="100%"
              height="100%"
              objectFit="cover"
              src={community.src}
              alt="community"
            />
          </Box>
        </Box>
      </Flex>

      {/* Third Box (Partners) */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="flex-start"
        bg="#131418"
        borderRadius="8px"
        border="1px solid"
        borderColor="#26282F"
        width={{ base: "100%", md: "100%", lg: "491px" }}
        minHeight={{ base: "auto", md: "auto", lg: "361px" }}
        borderTopLeftRadius="8px"
      >
        <Flex
          direction="column"
          width="100%"
          flexDirection={{ base: "column", md: "column" }}
        >
          <Box
            width="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
            overflow="hidden"
            borderTopLeftRadius="8px"
            borderTopRightRadius="8px"
            order={{ base: 1, md: 0 }}
          >
            <ChakraNextImage
              width="100%"
              height="auto"
              objectFit="cover"
              src={partners.src}
              alt="partners"
            />
          </Box>

          <Box p={6} width="100%" mt={{ base: "0px", md: "30px" }}>
            <Heading
              fontSize={{ base: "22px", md: "24px" }}
              fontWeight="bold"
              letterSpacing="-0.025em"
            >
              {partners.title}
            </Heading>
            <Text
              mt={4}
              fontSize="14px"
              opacity={0.7}
              color="#fff"
              fontWeight="medium"
            >
              {partners.text}
            </Text>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
};

export default StartupCard;
