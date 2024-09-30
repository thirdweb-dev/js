import { AppFooter } from "@/components/blocks/app-footer";
import { TabLinks } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { CustomConnectWallet } from "@3rdweb-sdk/react/components/connect-wallet";
import { Container, Flex, GridItem, Icon } from "@chakra-ui/react";
import { CmdKSearch } from "components/cmd-k-search";
import { ColorModeToggle } from "components/color-mode/color-mode-toggle";
import { Logo } from "components/logo";
import { CreditsButton } from "components/settings/Account/Billing/CreditsButton";
import { UpgradeButton } from "components/settings/Account/Billing/UpgradeButton";
import { BillingAlerts } from "components/settings/Account/Billing/alerts/Alert";
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
  pageContainerClassName?: string;
  mainClassName?: string;
}

export const AppShell: ComponentWithChildren<AppShellProps> = ({
  children,
  layout,
  pageContainerClassName,
  mainClassName,
}) => {
  return (
    <div className="bg-background">
      <AppHeader />
      <main
        className={cn("min-h-screen py-6 md:pt-10 md:pb-20", mainClassName)}
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
      </main>
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
        shadowColor="transparent"
        links={[
          {
            href: "/dashboard",
            name: "Home",
            isActive: pathname === "/dashboard",
          },
          {
            href: "/dashboard/connect/analytics",
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
