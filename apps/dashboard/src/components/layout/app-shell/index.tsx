import { AppFooter } from "@/components/blocks/app-footer";
import { CustomConnectWallet } from "@3rdweb-sdk/react/components/connect-wallet";
import {
  ButtonGroup,
  Container,
  Flex,
  Grid,
  GridItem,
  Icon,
} from "@chakra-ui/react";
import { CmdKSearch } from "components/cmd-k-search";
import { ColorModeToggle } from "components/color-mode/color-mode-toggle";
import { Logo } from "components/logo";
import { CreditsButton } from "components/settings/Account/Billing/CreditsButton";
import { UpgradeButton } from "components/settings/Account/Billing/UpgradeButton";
import { BillingAlerts } from "components/settings/Account/Billing/alerts/Alert";
import { SIDEBAR_TUNNEL_ID, SIDEBAR_WIDTH } from "core-ui/sidebar/tunnel";
import { useRouter } from "next/router";
import { FiHelpCircle } from "react-icons/fi";
import {
  Button,
  Link,
  LinkButton,
  TrackedIconButton,
  TrackedLink,
} from "tw-components";
import type { ComponentWithChildren } from "types/component-with-children";

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
      templateColumns={"auto 1fr"}
      templateRows={{ base: "auto auto 1fr auto", md: "auto 1fr auto" }}
      backgroundColor="backgroundBody"
    >
      <AppHeader />

      <GridItem
        id={SIDEBAR_TUNNEL_ID}
        colSpan={{ base: 2, md: 1 }}
        rowSpan={{ base: 1, md: 2 }}
        as="aside"
        position="sticky"
        top={0}
        zIndex="sticky"
        borderRight="1px solid"
        borderColor="borderColor"
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
          <BillingAlerts />
        </Container>

        {layout === "custom-contract" ? (
          children
        ) : (
          <Container maxW="container.page">{children}</Container>
        )}
      </GridItem>

      {/* the z index is necessary to "overlay" the dashboard sidebar tunnel */}
      <AppFooter className="col-span-2 z-[10000]" />
    </Grid>
  );
};

const AppHeader: React.FC = () => {
  const { pathname, route } = useRouter();

  return (
    <GridItem
      colSpan={{ base: 2, md: 2 }}
      rowSpan={1}
      zIndex="sticky"
      boxShadow="sm"
      borderBottom="1px solid"
      borderColor="borderColor"
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
          <Flex display={{ base: "none", md: "flex" }} gap={2}>
            <CreditsButton />
            <UpgradeButton />
          </Flex>
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
          <Button
            as={TrackedLink}
            variant="link"
            href="/support"
            category="header"
            label="docs"
            color="bgBlack"
            display={{ base: "none", md: "block" }}
            size="sm"
            mx={1.5}
          >
            Support
          </Button>

          <Flex display={{ base: "flex", md: "none" }}>
            <TrackedIconButton
              bg="transparent"
              size="sm"
              aria-label="get-help"
              icon={<Icon as={FiHelpCircle} />}
              category="header"
              label="support"
              as={LinkButton}
              href="/support"
            />
          </Flex>

          <ColorModeToggle />

          <div className="md:ml-2">
            <CustomConnectWallet />
          </div>
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
            href="/dashboard/connect/playground"
            isActive={
              pathname.startsWith("/dashboard/connect") ||
              pathname.startsWith("/dashboard/payments")
            }
            _active={{
              bg: "bgBlack",
              color: "bgWhite",
            }}
            rounded="lg"
          >
            Connect
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
            href="/dashboard/settings/api-keys"
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
