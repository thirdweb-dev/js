import { ConnectWallet } from "@3rdweb-sdk/react/components/connect-wallet";
import {
  ButtonGroup,
  Container,
  Flex,
  Grid,
  GridItem,
  Icon,
} from "@chakra-ui/react";
// import { Ethereum } from "@thirdweb-dev/chain-icons";
import { CmdKSearch } from "components/cmd-k-search";
import { ColorModeToggle } from "components/color-mode/color-mode-toggle";
import { Logo } from "components/logo";
import { BillingAlert } from "components/settings/Account/BillingAlert";
import { SIDEBAR_TUNNEL_ID, SIDEBAR_WIDTH } from "core-ui/sidebar/tunnel";
import { useRouter } from "next/router";
import { FiFile, FiGlobe, FiHelpCircle } from "react-icons/fi";
import {
  Button,
  Heading,
  Link,
  LinkButton,
  Text,
  TrackedLink,
} from "tw-components";
import { ComponentWithChildren } from "types/component-with-children";

export interface AppShellProps {
  layout?: "custom-contract";
  ecosystem?: "evm" | "solana" | "either";
  noSEOOverride?: boolean;
  hasSidebar?: boolean;
}

export const AppShell: ComponentWithChildren<AppShellProps> = ({
  children,
  layout,
  ecosystem,
  hasSidebar,
}) => {
  return (
    <Grid
      minH="calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))"
      templateColumns={`auto 1fr`}
      templateRows={{ base: "auto auto 1fr auto", md: "auto 1fr auto" }}
      backgroundColor="backgroundBody"
    >
      <AppHeader ecosystem={ecosystem} />

      <GridItem
        id={SIDEBAR_TUNNEL_ID}
        bg="backgroundHighlight"
        colSpan={{ base: 2, md: 1 }}
        rowSpan={{ base: 1, md: 2 }}
        as="aside"
        position="sticky"
        top={0}
        zIndex="sticky"
        boxShadow="md"
        w={{ md: hasSidebar ? SIDEBAR_WIDTH : "auto" }}
      >
        {" "}
      </GridItem>
      <GridItem
        minH={{ base: "100vh", md: "unset" }}
        py={8}
        as="main"
        colSpan={{ base: 2, md: 1 }}
        rowSpan={1}
        overflowX="auto"
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

const AppHeader: React.FC<Pick<AppShellProps, "ecosystem">> = ({
  ecosystem,
}) => {
  const { pathname, route } = useRouter();

  return (
    <GridItem
      colSpan={{ base: 2, md: 2 }}
      rowSpan={1}
      background="backgroundHighlight"
      zIndex="sticky"
      boxShadow="md"
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
        <Flex
          align="center"
          gap={3}
          marginLeft="auto"
          minH={{
            base: "auto",
            md: "60px",
          }}
        >
          <Button
            as={TrackedLink}
            variant="link"
            href="/pricing"
            category="header"
            label="pricing"
            flexDir="row"
            gap={1.5}
            mx={1}
            alignItems="center"
            display={{ base: "none", md: "flex" }}
            isExternal
          >
            <Icon as={FiGlobe} />
            <Heading
              display={{ base: "none", md: "inline-flex" }}
              as="h4"
              size="label.md"
            >
              Pricing
            </Heading>
          </Button>
          <Button
            as={TrackedLink}
            variant="link"
            href="https://portal.thirdweb.com"
            isExternal
            category="header"
            label="docs"
            flexDir="row"
            gap={1.5}
            mx={1}
            alignItems="center"
            display={{ base: "none", md: "flex" }}
          >
            <Icon as={FiFile} />
            <Heading
              as="h4"
              size="label.md"
              display={{ base: "none", md: "inline-flex" }}
            >
              Docs
            </Heading>
          </Button>
          <Button
            as={TrackedLink}
            variant="link"
            href="https://support.thirdweb.com"
            isExternal
            category="header"
            label="support"
            flexDir="row"
            gap={1.5}
            mx={1}
            alignItems="center"
            display={{ base: "none", md: "flex" }}
          >
            <Icon as={FiHelpCircle} />
            <Heading
              as="h4"
              size="label.md"
              display={{ base: "none", md: "inline-flex" }}
            >
              Support
            </Heading>
          </Button>

          <ColorModeToggle />

          <ConnectWallet
            ml={{ base: 0, md: 2 }}
            colorScheme="blue"
            ecosystem={ecosystem}
          />
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
            href="https://withpaper.com/product/checkouts"
            rounded="lg"
            isExternal
            noIcon
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
        Feedback
      </TrackedLink>
      <TrackedLink isExternal href="/privacy" category="footer" label="privacy">
        Privacy Policy
      </TrackedLink>
      <TrackedLink isExternal href="/tos" category="footer" label="terms">
        Terms of Service
      </TrackedLink>

      <TrackedLink
        href="/gas"
        bg="transparent"
        category="footer"
        display={{ base: "none", md: "flex" }}
        label="gas-estimator"
      >
        Gas Estimator
      </TrackedLink>
      <TrackedLink
        href="/chainlist"
        bg="transparent"
        category="footer"
        display={{ base: "none", md: "flex" }}
        label="chains"
      >
        Chainlist
      </TrackedLink>
      <Text alignSelf="center" order={{ base: 2, md: 0 }}>
        thirdweb &copy; {new Date().getFullYear()}
      </Text>
    </GridItem>
  );
};
