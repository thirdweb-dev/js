import { LandingMenu } from "./LandingMenu";
import {
  Box,
  Container,
  Flex,
  Icon,
  Stack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import { Logo } from "components/logo";
import React, { useState } from "react";
import { FiExternalLink } from "react-icons/fi";
import { SiDiscord, SiGithub, SiTwitter, SiYoutube } from "react-icons/si";
import { LinkButton, TrackedIconButton, TrackedLink } from "tw-components";

export const HomepageTopNav: React.FC<{}> = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [isScrolled, setIsScrolled] = useState(false);
  useScrollPosition(
    ({ currPos }) => {
      if (currPos.y < -5) {
        setIsScrolled(true);
      } else if (currPos.y >= -5) {
        setIsScrolled(false);
      }
    },
    [isMobile],
    undefined,
    false,
    33,
  );

  return (
    <>
      <Box
        transition="all 100ms ease"
        position="fixed"
        top={0}
        left={0}
        w="100%"
        zIndex="overlay"
        as="header"
        boxShadow={isScrolled ? "md" : undefined}
        bg={isScrolled ? "blackAlpha.900" : "transparent"}
        backdropFilter="blur(10px)"
      >
        <Container
          as={Flex}
          py={4}
          maxW="container.page"
          justify="space-between"
          align="center"
          flexDir="row"
        >
          <TrackedLink href="/" category="topnav" label="home">
            <Logo color="#fff" />
          </TrackedLink>
          <Stack
            display={["none", "none", "flex"]}
            direction="row"
            alignItems="center"
            color="gray.50"
            fontWeight="bold"
            spacing={10}
            as="nav"
          >
            <TrackedLink
              href="#developers"
              category="topnav"
              label="developers"
            >
              Developers
            </TrackedLink>
            <TrackedLink href="#features" category="topnav" label="features">
              Features
            </TrackedLink>
            <TrackedLink href="#fees" category="topnav" label="fees">
              Pricing
            </TrackedLink>
            <TrackedLink
              href="https://portal.thirdweb.com"
              variant="link"
              color="inherit"
              fontWeight="inherit"
              textDecoration={undefined}
              isExternal
              category="topnav"
              label="portal"
            >
              <Flex alignItems="center">
                Docs
                <Icon ml={1.5} as={FiExternalLink} />
              </Flex>
            </TrackedLink>
            <Flex
              display={{ base: "none", lg: "flex" }}
              direction="row"
              align="center"
            >
              <TrackedIconButton
                as={LinkButton}
                isExternal
                noIcon
                href="https://twitter.com/thirdweb_"
                color="gray.50"
                bg="transparent"
                aria-label="twitter"
                icon={<Icon boxSize="1rem" as={SiTwitter} />}
                category="topnav"
                label="twitter"
              />
              <TrackedIconButton
                as={LinkButton}
                isExternal
                noIcon
                href="https://discord.gg/thirdweb"
                bg="transparent"
                color="gray.50"
                aria-label="discord"
                icon={<Icon boxSize="1rem" as={SiDiscord} />}
                category="topnav"
                label="discord"
              />
              <TrackedIconButton
                as={LinkButton}
                isExternal
                noIcon
                href="https://www.youtube.com/channel/UCdzMx7Zhy5va5End1-XJFbA"
                bg="transparent"
                color="gray.50"
                aria-label="YouTube"
                icon={<Icon boxSize="1rem" as={SiYoutube} />}
                category="topnav"
                label="youtube"
              />
              <TrackedIconButton
                as={LinkButton}
                isExternal
                noIcon
                href="https://github.com/thirdweb-dev"
                bg="transparent"
                color="gray.50"
                aria-label="github"
                icon={<Icon boxSize="1rem" as={SiGithub} />}
                category="topnav"
                label="github"
              />
            </Flex>
          </Stack>
          <LandingMenu
            aria-label="Homepage Menu"
            display={{ base: "inherit", md: "none" }}
          />
        </Container>
      </Box>
      <Box h="35px" w="100%" display={["block", "block", "none"]} />
    </>
  );
};
