import { Breadcrumbs } from "./Breadcrumbs";
import { ConnectWallet } from "@3rdweb-sdk/react";
import {
  Box,
  ButtonGroup,
  Container,
  Divider,
  Flex,
  Icon,
  Stack,
} from "@chakra-ui/react";
import { ColorModeToggle } from "components/color-mode/color-mode-toggle";
import { Logo } from "components/logo";
import { InsufficientFunds } from "components/notices/InsufficientFunds";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import React from "react";
import { RiGasStationFill } from "react-icons/ri";
import { SiDiscord, SiGithub, SiTwitter, SiYoutube } from "react-icons/si";
import {
  Link,
  LinkButton,
  Text,
  TrackedIconButton,
  TrackedLink,
} from "tw-components";
import { ComponentWithChildren } from "types/component-with-children";

export const AppShell: ComponentWithChildren = ({ children }) => {
  const { pathname } = useRouter();

  const isCustomContractLayout =
    pathname === "/[wallet]/[network]/[...customContract]";

  return (
    <Flex
      h="calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))"
      w="calc(100vw - env(safe-area-inset-left) - env(safe-area-inset-right))"
      position="relative"
      overflow="hidden"
      backgroundColor="backgroundBody"
    >
      <NextSeo
        title="Dashboard"
        openGraph={{
          title: "Dashboard | thirdweb",
          url: `https://thirdweb.com/dashboard`,
        }}
      />
      <Flex
        transition="margin 350ms ease"
        zIndex="docked"
        width="100%"
        flexGrow={1}
        flexShrink={0}
        flexDir="column"
        overflowY="auto"
        id="tw-scroll-container"
      >
        <Box
          background="backgroundHighlight"
          zIndex="banner"
          shadow={isCustomContractLayout ? undefined : "sm"}
          position={isCustomContractLayout ? undefined : "sticky"}
          top={isCustomContractLayout ? undefined : 0}
        >
          <Container
            maxW="container.page"
            display="flex"
            py={2}
            as="header"
            alignItems="center"
          >
            <Link href="/dashboard">
              <Logo />
            </Link>
            <Stack
              direction="row"
              align="center"
              spacing={{ base: 3, md: 4 }}
              marginLeft="auto"
            >
              <Link
                href="https://portal.thirdweb.com/guides"
                isExternal
                variant="link"
                color="inherit"
                fontWeight="inherit"
                textDecoration={undefined}
                display={{ base: "none", md: "block" }}
              >
                Guides
              </Link>
              <ButtonGroup
                variant="ghost"
                display={{ base: "none", md: "block" }}
              >
                <TrackedIconButton
                  as={LinkButton}
                  isExternal
                  noIcon
                  href="https://twitter.com/thirdweb_"
                  bg="transparent"
                  aria-label="twitter"
                  icon={<Icon boxSize="1rem" as={SiTwitter} />}
                  category="header"
                  label="twitter"
                />
                <TrackedIconButton
                  as={LinkButton}
                  isExternal
                  noIcon
                  href="https://discord.gg/thirdweb"
                  bg="transparent"
                  aria-label="discord"
                  icon={<Icon boxSize="1rem" as={SiDiscord} />}
                  category="header"
                  label="discord"
                />
                <TrackedIconButton
                  as={LinkButton}
                  isExternal
                  noIcon
                  href="https://www.youtube.com/channel/UCdzMx7Zhy5va5End1-XJFbA"
                  bg="transparent"
                  aria-label="YouTube"
                  icon={<Icon boxSize="1rem" as={SiYoutube} />}
                  category="header"
                  label="youtube"
                />
                <TrackedIconButton
                  as={LinkButton}
                  isExternal
                  noIcon
                  href="https://github.com/thirdweb-dev"
                  bg="transparent"
                  aria-label="github"
                  icon={<Icon boxSize="1rem" as={SiGithub} />}
                  category="header"
                  label="github"
                />

                <TrackedIconButton
                  as={LinkButton}
                  noIcon
                  href="/gas"
                  bg="transparent"
                  aria-label="gas-estimator"
                  icon={<Icon boxSize="1rem" as={RiGasStationFill} />}
                  category="header"
                  label="gas-estimator"
                />
              </ButtonGroup>
              <ColorModeToggle />
              <ConnectWallet borderRadius="full" colorScheme="primary" />
            </Stack>
          </Container>
        </Box>
        {isCustomContractLayout ? (
          <Box as="main" flexGrow={1}>
            {children}
          </Box>
        ) : (
          <Container flexGrow={1} as="main" maxW="container.page" py={8}>
            <Breadcrumbs />
            {children}
          </Container>
        )}
        <Divider />
        <Container as="footer" maxW="container.page" w="100%" py={4}>
          <Stack>
            <Stack direction="row" spacing="4" align="center" justify="center">
              <Text alignSelf="center">
                thirdweb &copy; {new Date().getFullYear()}
              </Text>
              <TrackedLink
                isExternal
                href="https://feedback.thirdweb.com"
                category="footer"
                label="feedback"
              >
                Feedback
              </TrackedLink>
              <TrackedLink
                isExternal
                href="/privacy"
                category="footer"
                label="privacy"
              >
                Privacy Policy
              </TrackedLink>
              <TrackedLink
                isExternal
                href="/tos"
                category="footer"
                label="terms"
              >
                Terms of Service
              </TrackedLink>
            </Stack>
          </Stack>
        </Container>
        {pathname !== "/dashboard" && (
          <>
            <InsufficientFunds />
          </>
        )}
      </Flex>
    </Flex>
  );
};
