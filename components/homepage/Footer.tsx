import {
  Box,
  Container,
  Flex,
  Heading,
  Icon,
  IconButton,
  Stack,
} from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { GeneralCta } from "components/shared/GeneralCta";
import { LinkButton } from "components/shared/LinkButton";
import triangleGradient from "public/assets/gradient-triangle.png";
import React from "react";
import { SiDiscord, SiTwitter } from "react-icons/si";

export const HomepageFooter: React.FC = () => {
  return (
    <Flex
      position="relative"
      as="footer"
      bg="backgroundDark"
      mixBlendMode="multiply"
      overflow="hidden"
    >
      <Box
        zIndex={-1}
        pointerEvents="none"
        position="absolute"
        w={{ base: "200vw", md: "1920px" }}
        bottom="-10px"
        left="50%"
        transform="translateX(-50%)"
      >
        <ChakraNextImage
          alt=""
          layout="responsive"
          objectFit="cover"
          src={triangleGradient}
        />
      </Box>
      <Container
        maxW="container.page"
        position="relative"
        py={["75px", "75px", "150px"]}
      >
        <Stack
          w="100%"
          align="center"
          spacing={{ base: "2.5rem", md: "5.5rem" }}
        >
          <Container maxW="container.lg" px={0}>
            <Heading
              color="#F2FBFF"
              w="100%"
              as="h2"
              textAlign="center"
              size="display.md"
            >
              Add NFTs and other web3 features to your project today.
            </Heading>
          </Container>
          <GeneralCta size="lg" />
          <Stack direction="row">
            <IconButton
              as={LinkButton}
              isExternal
              noIcon
              href="https://twitter.com/thirdweb_"
              size="lg"
              colorScheme="whiteAlpha"
              color="rgba(242, 251, 255, 0.8)"
              variant="ghost"
              aria-label="twitter"
              icon={<Icon boxSize="1.5rem" as={SiTwitter} />}
            />
            <IconButton
              as={LinkButton}
              isExternal
              noIcon
              href="https://discord.gg/thirdweb"
              size="lg"
              colorScheme="whiteAlpha"
              color="rgba(242, 251, 255, 0.8)"
              variant="ghost"
              aria-label="discord"
              icon={<Icon boxSize="1.5rem" as={SiDiscord} />}
            />
          </Stack>
        </Stack>
      </Container>
    </Flex>
  );
};
