import { Skeleton } from "@/components/ui/skeleton";
import type { Ecosystem } from "../../../../types";
import {
  IntegrationPermissionsToggle,
  IntegrationPermissionsToggleSkeleton,
} from "../client/integration-permissions-toggle.client";

export function IntegrationPermissionsSection({
  ecosystem,
}: { ecosystem?: Ecosystem }) {
  return (
    <section className="flex flex-col gap-4 md:gap-8">
      <div className="flex flex-col gap-1">
        <h4 className="text-2xl font-semibold text-foreground">
          Integration permissions
        </h4>
        {ecosystem ? (
          <p className="text-sm text-muted-foreground">
            {ecosystem.permission === "PARTNER_WHITELIST"
              ? "Your ecosystem has an allowlist. Only preset partners can add your wallet to their app."
              : "Your ecosystem is public. Anyone can add your wallet to their app."}
          </p>
        ) : (
          <Skeleton className="h-6 w-[300px]" />
        )}
      </div>
      {ecosystem ? (
        <IntegrationPermissionsToggle ecosystem={ecosystem} />
      ) : (
        <IntegrationPermissionsToggleSkeleton />
      )}
    </section>
  );
}
