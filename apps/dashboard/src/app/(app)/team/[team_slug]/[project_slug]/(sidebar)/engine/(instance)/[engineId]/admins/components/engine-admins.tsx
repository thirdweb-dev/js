"use client";

import type { ThirdwebClient } from "thirdweb";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
import { useEnginePermissions } from "@/hooks/useEngine";
import { AddAdminButton } from "./add-admin-button";
import { AdminsTable } from "./admins-table";

export function EngineAdmins({
  instanceUrl,
  authToken,
  client,
}: {
  instanceUrl: string;
  authToken: string;
  client: ThirdwebClient;
}) {
  const admins = useEnginePermissions({
    authToken,
    instanceUrl,
  });

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight mb-1">Admins</h2>
      <p className="text-muted-foreground text-sm mb-5">
        Admins are allowed to manage your Engine instance from the dashboard.{" "}
        <UnderlineLink
          href="https://portal.thirdweb.com/engine/features/admins"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn more about admins
        </UnderlineLink>
        .
      </p>

      <AdminsTable
        admins={admins.data || []}
        authToken={authToken}
        client={client}
        instanceUrl={instanceUrl}
        isFetched={admins.isFetched}
        isPending={admins.isPending}
      />

      <div className="mt-4 flex justify-end">
        <AddAdminButton authToken={authToken} instanceUrl={instanceUrl} />
      </div>
    </div>
  );
}
