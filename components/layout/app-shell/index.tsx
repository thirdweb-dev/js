import { CustomConnectWallet } from "@3rdweb-sdk/react/components/connect-wallet";
import {
  Box,
  ButtonGroup,
  Container,
  Flex,
  Grid,
  GridItem,
  Icon,
  IconButton,
} from "@chakra-ui/react";
import { CmdKSearch } from "components/cmd-k-search";
import { ColorModeToggle } from "components/color-mode/color-mode-toggle";
import { Logo } from "components/logo";
import { BillingAlert } from "components/settings/Account/Billing/Alert";
import { UpgradeButton } from "components/settings/Account/Billing/UpgradeButton";
import { SIDEBAR_TUNNEL_ID, SIDEBAR_WIDTH } from "core-ui/sidebar/tunnel";
import { useTrack } from "hooks/analytics/useTrack";
import { useRouter } from "next/router";
import { FiHelpCircle } from "react-icons/fi";
import { Button, Link, LinkButton, Text, TrackedLink } from "tw-components";
import { ComponentWithChildren } from "types/component-with-children";

export interface AppShellProps {
  layout?: "custom-contract";
  noSEOOverride?: boolean;
  hasSidebar?: boolean;
  noOverflowX?: boolean;
}

export const AppShell: ComponentWithChildren<AppShellProps> = ({
  children,
  layout,
  hasSidebar,
  noOverflowX,
}) => {
  return (
    <Grid
      minH="calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))"
      templateColumns={`auto 1fr`}
      templateRows={{ base: "auto auto 1fr auto", md: "auto 1fr auto" }}
      backgroundColor="backgroundBody"
    >
      <AppHeader />

      <GridItem
        id={SIDEBAR_TUNNEL_ID}
        bg="backgroundHighlight"
        colSpan={{ base: 2, md: 1 }}
        rowSpan={{ base: 1, md: 2 }}
        as="aside"
        position="sticky"
        top={0}
        zIndex="sticky"
        boxShadow="sm"
        w={{ md: hasSidebar ? SIDEBAR_WIDTH : "auto" }}
      >
        {" "}
      </GridItem>
      <GridItem
        minH={{ base: "100vh", md: "unset" }}
        pt={{ base: 6, md: 10 }}
        pb={{ base: 6, md: 20 }}
        as="main"
        colSpan={{ base: 2, md: 1 }}
        rowSpan={1}
        overflowX={noOverflowX ? undefined : "auto"}
      >
        <Container maxW="container.page">
          <BillingAlert />
        </Container>

        {layout === "custom-contract" ? (
          children
        ) : (
          <Container maxW="container.page">{children}</Container>
        )}
      </GridItem>

      <AppFooter />
    </Grid>
  );
};

const AppHeader: React.FC = () => {
  const { pathname, route } = useRouter();
  const trackEvent = useTrack();

  return (
    <GridItem
      colSpan={{ base: 2, md: 2 }}
      rowSpan={1}
      background="backgroundHighlight"
      zIndex="sticky"
      boxShadow="sm"
      pb={2}
    >
      <Container
        maxW="100%"
        display="flex"
        py={3}
        as="header"
        alignItems="center"
      >
        <Flex align="center" gap={4}>
          <Link href="/dashboard">
            <Logo hideWordmark />
          </Link>
          <CmdKSearch />
        </Flex>
        <Flex align="center" gap={4} marginLeft="auto">
          <Box display={{ base: "none", md: "block" }}>
            <UpgradeButton />
          </Box>
          <Button
            as={TrackedLink}
            variant="link"
            href="https://portal.thirdweb.com"
            isExternal
            category="header"
            label="docs"
            color="bgBlack"
            display={{ base: "none", md: "block" }}
            size="sm"
            mx={1.5}
          >
            Docs
          </Button>

          <IconButton
            bg="transparent"
            size="sm"
            aria-label="get-help"
            icon={<Icon as={FiHelpCircle} />}
            onClick={() => {
              trackEvent({
                category: "header",
                action: "click",
                label: "support",
              });

              window.open("https://support.thirdweb.com", "_blank");
            }}
          />

          <ColorModeToggle />

          <CustomConnectWallet ml={{ base: 0, md: 2 }} colorScheme="blue" />
        </Flex>
      </Container>
      <Container
        maxW="100%"
        display="flex"
        py={2}
        as="nav"
        alignItems="center"
        overflowX={{ base: "auto", md: "hidden" }}
      >
        <ButtonGroup size="sm" variant="ghost" spacing={{ base: 0.5, md: 2 }}>
          <LinkButton
            href="/dashboard"
            isActive={pathname === "/dashboard"}
            _active={{
              bg: "bgBlack",
              color: "bgWhite",
            }}
            rounded="lg"
          >
            Home
          </LinkButton>
          <LinkButton
            href="/dashboard/wallets/connect"
            isActive={pathname.startsWith("/dashboard/wallets")}
            _active={{
              bg: "bgBlack",
              color: "bgWhite",
            }}
            rounded="lg"
          >
            Wallets
          </LinkButton>
          <LinkButton
            href="/dashboard/contracts/deploy"
            isActive={
              pathname.startsWith("/dashboard/contracts") ||
              route === "/[networkOrAddress]/[...catchAll]"
            }
            _active={{
              bg: "bgBlack",
              color: "bgWhite",
            }}
            rounded="lg"
          >
            Contracts
          </LinkButton>
          <LinkButton
            href="/dashboard/payments/contracts"
            rounded="lg"
            isActive={pathname.startsWith("/dashboard/payments")}
            _active={{
              bg: "bgBlack",
              color: "bgWhite",
            }}
          >
            Payments
          </LinkButton>
          <LinkButton
            href="/dashboard/infrastructure/storage"
            isActive={pathname.startsWith("/dashboard/infrastructure")}
            _active={{
              bg: "bgBlack",
              color: "bgWhite",
            }}
            rounded="lg"
          >
            Infrastructure
          </LinkButton>
          <LinkButton
            href="/dashboard/engine"
            isActive={pathname.startsWith("/dashboard/engine")}
            _active={{
              bg: "bgBlack",
              color: "bgWhite",
            }}
            rounded="lg"
          >
            Engine
          </LinkButton>
          <LinkButton
            href="/dashboard/settings"
            isActive={pathname.startsWith("/dashboard/settings")}
            _active={{
              bg: "bgBlack",
              color: "bgWhite",
            }}
            rounded="lg"
          >
            Settings
          </LinkButton>
        </ButtonGroup>
      </Container>
    </GridItem>
  );
};

const AppFooter: React.FC = () => {
  return (
    <GridItem
      display="flex"
      colSpan={2}
      rowSpan={1}
      as="footer"
      w="full"
      py={4}
      gap={4}
      alignItems="center"
      flexDir={{ base: "column", md: "row" }}
      justifyContent="center"
      bg="backgroundHighlight"
      zIndex="sticky"
    >
      <TrackedLink
        isExternal
        href="https://feedback.thirdweb.com"
        category="footer"
        label="feedback"
      >
        <Text>Feedback</Text>
      </TrackedLink>
      <TrackedLink isExternal href="/privacy" category="footer" label="privacy">
        <Text>Privacy Policy</Text>
      </TrackedLink>
      <TrackedLink isExternal href="/tos" category="footer" label="terms">
        <Text>Terms of Service</Text>
      </TrackedLink>

      <TrackedLink
        href="/gas"
        bg="transparent"
        category="footer"
        display={{ base: "none", md: "flex" }}
        label="gas-estimator"
      >
        <Text>Gas Estimator</Text>
      </TrackedLink>
      <TrackedLink
        href="/chainlist"
        bg="transparent"
        category="footer"
        display={{ base: "none", md: "flex" }}
        label="chains"
      >
        <Text>Chainlist</Text>
      </TrackedLink>
      <Text alignSelf="center" order={{ base: 2, md: 0 }} opacity={0.5}>
        thirdweb &copy; {new Date().getFullYear()}
      </Text>
    </GridItem>
  );
};
