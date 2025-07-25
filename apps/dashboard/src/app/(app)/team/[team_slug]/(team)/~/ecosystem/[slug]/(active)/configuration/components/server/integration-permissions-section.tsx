import type { Ecosystem } from "@/api/ecosystems";
import {
  IntegrationPermissionsToggle,
  IntegrationPermissionsToggleSkeleton,
} from "../client/integration-permissions-toggle.client";

export function IntegrationPermissionsSection({
  ecosystem,
  authToken,
  teamId,
}: {
  ecosystem?: Ecosystem;
  authToken: string;
  teamId: string;
}) {
  return (
    <div className="relative rounded-lg border border-border bg-card px-4 py-6 lg:px-6">
      <h3 className="font-semibold text-xl tracking-tight">
        Integration Permissions
      </h3>

      {ecosystem && (
        <p className="mt-1.5 mb-4 text-foreground text-sm">
          {ecosystem.permission === "PARTNER_WHITELIST"
            ? "Your ecosystem has an allowlist. Only preset partners can add your wallet to their app."
            : "Your ecosystem is public. Anyone can add your wallet to their app."}
        </p>
      )}

      <section className="flex flex-col gap-4 md:gap-8">
        {ecosystem ? (
          <IntegrationPermissionsToggle
            authToken={authToken}
            ecosystem={ecosystem}
            teamId={teamId}
          />
        ) : (
          <IntegrationPermissionsToggleSkeleton />
        )}
      </section>
    </div>
  );
}
