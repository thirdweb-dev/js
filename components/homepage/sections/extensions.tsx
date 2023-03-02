import { AspectRatio, Box, Container, Flex, Image } from "@chakra-ui/react";
import { HomepageSection } from "components/product-pages/homepage/HomepageSection";
import { useEffect, useState } from "react";
import { Heading, Text } from "tw-components";

export const ExtensionsSection: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [mode, setMode] = useState<"erc721" | "permission">("erc721");

  useEffect(() => {
    if (isHovering) {
      return;
    }
    const int = setInterval(() => {
      setMode((prevMode) => (prevMode === "erc721" ? "permission" : "erc721"));
    }, 2500);
    return () => {
      clearInterval(int);
    };
  }, [isHovering]);

  return (
    <HomepageSection my={24}>
      <Flex align="center" gap={{ base: 0, md: 4 }} mb={12} direction="column">
        <Heading as="h3" size="title.2xl" color="white" textAlign="center">
          Extension driven framework
        </Heading>
        <Text
          maxW="container.sm"
          py={8}
          mb={4}
          as="h4"
          size="body.lg"
          color="whiteAlpha.700"
          textAlign="center"
          fontSize={{ base: "14px", md: "16px" }}
        >
          Our framework detects standards and common patterns in your contracts
          to unlock smarter SDKs, custom admin dashboards, and tailored data
          feeds.
        </Text>
      </Flex>
      <Container maxW="container.sm">
        <AspectRatio ratio={915 / 589} w="full">
          <Box
            onMouseOver={() => {
              setIsHovering(true);
            }}
            onMouseOut={() => {
              setIsHovering(false);
            }}
          >
            <Image
              opacity={mode === "erc721" ? 1 : 0}
              transition="opacity 0.5s ease-in-out"
              position="absolute"
              top={0}
              left={0}
              src="/assets/landingpage/extensions-erc721.png"
              alt="ERC721 extension"
              w="full"
              h="full"
              objectFit="contain"
            />
            <Image
              opacity={mode === "permission" ? 1 : 0}
              transition="opacity 0.5s ease-in-out"
              position="absolute"
              top={0}
              left={0}
              src="/assets/landingpage/extensions-permission.png"
              alt="ERC721 extension"
              w="full"
              h="full"
              objectFit="contain"
            />
          </Box>
        </AspectRatio>
      </Container>
    </HomepageSection>
  );
};
