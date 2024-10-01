import { AppFooter } from "@/components/blocks/app-footer";
import { cn } from "@/lib/utils";
import { Container } from "@chakra-ui/react";
import { BillingAlerts } from "components/settings/Account/Billing/alerts/Alert";
import type { ComponentWithChildren } from "types/component-with-children";
import { DashboardHeader } from "../../../app/components/Header/DashboardHeader";

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
      <DashboardHeader />
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
