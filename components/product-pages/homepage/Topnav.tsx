import { LandingMenu } from "./LandingMenu";
import {
  Box,
  Container,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  Stack,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import { Logo } from "components/logo";
import React, { useState } from "react";
import { SiDiscord, SiTwitter, SiYoutube } from "react-icons/si";
import {
  LinkButton,
  MenuItem,
  Text,
  TrackedIconButton,
  TrackedLink,
} from "tw-components";

export const HomepageTopNav: React.FC<{}> = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [isScrolled, setIsScrolled] = useState(false);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const {
    isOpen: isResourcesOpen,
    onOpen: onResourcesOpen,
    onClose: onResourcesClose,
  } = useDisclosure();

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
            <Menu isOpen={isOpen} onClose={onClose}>
              <MenuButton
                onMouseEnter={onOpen}
                onMouseLeave={onClose}
                py="12px"
              >
                <Text color="white" fontWeight="bold" fontSize="16px">
                  Products
                </Text>
              </MenuButton>
              <MenuList
                onMouseEnter={onOpen}
                onMouseLeave={onClose}
                mt="-12px"
                bgColor="black"
                color="white"
                borderColor="rgba(255, 255, 255, 0.1)"
                overflow="hidden"
              >
                <MenuItem
                  as={TrackedLink}
                  href="https://portal.thirdweb.com/smart-contracts"
                  category="topnav"
                  label="contracts"
                  isExternal
                >
                  Contracts
                </MenuItem>
                <MenuItem
                  as={TrackedLink}
                  href="https://portal.thirdweb.com/building-web3-apps/setting-up-the-sdk"
                  category="topnav"
                  label="developers"
                  isExternal
                >
                  SDKs
                </MenuItem>
                <MenuItem
                  as={TrackedLink}
                  href="https://thirdweb.com/dashboard"
                  category="topnav"
                  label="dashboard"
                >
                  Dashboard
                </MenuItem>
                <MenuItem
                  as={TrackedLink}
                  href="/authentication"
                  category="topnav"
                  label="authentication"
                >
                  Authentication
                </MenuItem>
              </MenuList>
            </Menu>

            <Menu isOpen={isResourcesOpen} onClose={onResourcesClose}>
              <MenuButton
                onMouseEnter={onResourcesOpen}
                onMouseLeave={onResourcesClose}
                py="12px"
              >
                <Text color="white" fontWeight="bold" fontSize="16px">
                  Resources
                </Text>
              </MenuButton>
              <MenuList
                onMouseEnter={onResourcesOpen}
                onMouseLeave={onResourcesClose}
                mt="-12px"
                bgColor="black"
                color="white"
                borderColor="rgba(255, 255, 255, 0.1)"
                overflow="hidden"
              >
                <MenuItem
                  as={TrackedLink}
                  href="https://portal.thirdweb.com"
                  category="topnav"
                  label="docs"
                  target="_blank"
                >
                  Docs
                </MenuItem>
                <MenuItem
                  as={TrackedLink}
                  href="https://portal.thirdweb.com/guides"
                  category="topnav"
                  label="guides"
                  target="_blank"
                >
                  Guides
                </MenuItem>
                <MenuItem
                  as={TrackedLink}
                  href="https://blog.thirdweb.com"
                  category="topnav"
                  label="blog"
                  target="_blank"
                >
                  Blog
                </MenuItem>
              </MenuList>
            </Menu>
          </Stack>

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
          </Flex>

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
