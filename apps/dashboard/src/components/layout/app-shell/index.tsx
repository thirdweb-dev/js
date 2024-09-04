import { AppFooter } from "@/components/blocks/app-footer";
import { CustomConnectWallet } from "@3rdweb-sdk/react/components/connect-wallet";
import { Container, Flex, Grid, GridItem, Icon } from "@chakra-ui/react";
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
import { TabLinks } from "../../../@/components/ui/tabs";

export interface AppShellProps {
  layout?: "custom-contract";
  noSEOOverride?: boolean;
  hasSidebar?: boolean;
  noOverflowX?: boolean;
  pageContainerClassName?: string;
  mainClassName?: string;
}

export const AppShell: ComponentWithChildren<AppShellProps> = ({
  children,
  layout,
  hasSidebar,
  noOverflowX,
  pageContainerClassName,
  mainClassName,
}) => {
  return (
    <div className="bg-background">
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
          zIndex="sticky"
          w={{ md: hasSidebar ? SIDEBAR_WIDTH : "auto" }}
          className="top-0 bg-background border-b md:border-b-0 md:border-r border-border"
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
          className={mainClassName}
        >
          <Container maxW="container.page">
            <BillingAlerts />
          </Container>

          {layout === "custom-contract" ? (
            children
          ) : (
            <Container maxW="container.page" className={pageContainerClassName}>
              {children}
            </Container>
          )}
        </GridItem>
      </Grid>
      <AppFooter className="col-span-2" />
    </div>
  );
};

const AppHeader: React.FC = () => {
  const { pathname } = useRouter();

  return (
    <GridItem
      colSpan={{ base: 2, md: 2 }}
      rowSpan={1}
      zIndex="sticky"
      className="bg-muted/50"
    >
      <Container
        maxW="100%"
        display="flex"
        py={3}
        as="header"
        alignItems="center"
        className="!px-4 lg:!px-6"
      >
        <Flex align="center" gap={4}>
          <Link href="/dashboard">
            <Logo hideWordmark />
          </Link>
          <CmdKSearch />
        </Flex>

        <Flex align="center" gap={[2, 4]} marginLeft="auto">
          <Flex display={{ base: "none", md: "flex" }} gap={2}>
            <CreditsButton />
            <UpgradeButton />
          </Flex>
          <Button
            as={TrackedLink}
            variant="link"
            href="/chainlist"
            category="header"
            label="chainlist"
            color="bgBlack"
            display={{ base: "none", md: "block" }}
            size="sm"
            mx={1.5}
          >
            Chainlist
          </Button>
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

      {/* Tabs */}
      <TabLinks
        className="w-full"
        tabContainerClassName="px-4 lg:px-6"
        links={[
          {
            href: "/dashboard",
            name: "Home",
            isActive: pathname === "/dashboard",
          },
          {
            href: "/dashboard/connect",
            name: "Connect",
            isActive: pathname.startsWith("/dashboard/connect"),
          },
          {
            href: "/dashboard/contracts/deploy",
            name: "Contracts",
            isActive:
              pathname.startsWith("/dashboard/contracts") ||
              pathname === "/explore",
          },
          {
            href: "/dashboard/engine",
            name: "Engine",
            isActive: pathname.startsWith("/dashboard/engine"),
          },
          {
            href: "/dashboard/settings/api-keys",
            name: "Settings",
            isActive: pathname.startsWith("/dashboard/settings"),
          },
        ]}
      />
    </GridItem>
  );
};
