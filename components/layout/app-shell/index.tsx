import { ConnectWallet } from "@3rdweb-sdk/react/components/connect-wallet";
import {
  ButtonGroup,
  Container,
  Flex,
  Grid,
  GridItem,
  Icon,
} from "@chakra-ui/react";
import { Ethereum, Solana } from "@thirdweb-dev/chain-icons";
import { CmdKSearch } from "components/cmd-k-search";
import { ColorModeToggle } from "components/color-mode/color-mode-toggle";
import { Logo } from "components/logo";
import { SIDEBAR_TUNNEL_ID } from "core-ui/sidebar/tunnel";
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
}

export const AppShell: ComponentWithChildren<AppShellProps> = ({
  children,
  layout,
  ecosystem,
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
      />
      <GridItem
        minH={{ base: "100vh", md: "unset" }}
        py={8}
        as="main"
        colSpan={{ base: 2, md: 1 }}
        rowSpan={1}
      >
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
            href="/explore"
            category="header"
            label="docs"
            flexDir="row"
            gap={1.5}
            mx={1}
            alignItems="center"
            display={{ base: "none", md: "flex" }}
          >
            <Icon as={FiGlobe} />
            <Heading
              display={{ base: "none", md: "inline-flex" }}
              as="h4"
              size="label.md"
            >
              Explore
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
            leftIcon={<Icon as={Ethereum} />}
            href="/dashboard/contracts"
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
            leftIcon={<Icon as={Solana} />}
            href="/dashboard/programs"
            isActive={
              pathname === "/dashboard/programs" ||
              route === "/[networkOrAddress]/[...catchAll]"
            }
            _active={{
              bg: "bgBlack",
              color: "bgWhite",
            }}
            rounded="lg"
          >
            Programs
          </LinkButton>
          <LinkButton
            href="/dashboard/storage"
            isActive={pathname === "/dashboard/storage"}
            _active={{
              bg: "bgBlack",
              color: "bgWhite",
            }}
            rounded="lg"
          >
            Storage
          </LinkButton>
          <LinkButton
            href="/dashboard/rpc"
            isActive={pathname === "/dashboard/rpc"}
            _active={{
              bg: "bgBlack",
              color: "bgWhite",
            }}
            rounded="lg"
          >
            RPC
          </LinkButton>
          <LinkButton
            href="/dashboard/wallet"
            isActive={pathname === "/dashboard/wallet"}
            _active={{
              bg: "bgBlack",
              color: "bgWhite",
            }}
            rounded="lg"
          >
            Wallet
          </LinkButton>
          <LinkButton
            href="/dashboard/api-keys"
            isActive={pathname === "/dashboard/api-keys"}
            _active={{
              bg: "bgBlack",
              color: "bgWhite",
            }}
            rounded="lg"
          >
            API Keys
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
