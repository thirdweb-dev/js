import { AppFooter } from "@/components/blocks/app-footer";
import { cn } from "@/lib/utils";
import { Container } from "@chakra-ui/react";
import { BillingAlerts } from "components/settings/Account/Billing/alerts/Alert";
import type { ComponentWithChildren } from "types/component-with-children";
import { AccountHeaderClient } from "../../../app/account/components/account-header.client";

export interface AppShellProps {
  layout?: "custom-contract";
  noSEOOverride?: boolean;
  hasSidebar?: boolean;
  pageContainerClassName?: string;
  mainClassName?: string;
}

// TODO - remove AppShell entirely by moving the 3 pages that still use to app router / (dashboard) layout

export const AppShell: ComponentWithChildren<AppShellProps> = ({
  children,
  layout,
  pageContainerClassName,
  mainClassName,
}) => {
  return (
    <div className="bg-background">
      <div className="border-border border-b bg-muted/50">
        <AccountHeaderClient />
      </div>
      <main
        className={cn("min-h-screen py-6 md:pt-10 md:pb-20", mainClassName)}
      >
        <Container maxW="container.page">
          <BillingAlerts className="py-6" />
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
