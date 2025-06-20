"use client";

import { useEnginePermissions } from "@3rdweb-sdk/react/hooks/useEngine";
import type { ThirdwebClient } from "thirdweb";
import { Heading, Link, Text } from "tw-components";
import { AddAdminButton } from "./add-admin-button";
import { AdminsTable } from "./admins-table";

interface EngineAdminsProps {
  instanceUrl: string;
  authToken: string;
  client: ThirdwebClient;
}

export const EngineAdmins: React.FC<EngineAdminsProps> = ({
  instanceUrl,
  authToken,
  client,
}) => {
  const admins = useEnginePermissions({
    authToken,
    instanceUrl,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Heading size="title.md">Admins</Heading>
        <Text>
          Admins are allowed to manage your Engine instance from the dashboard.{" "}
          <Link
            color="primary.500"
            href="https://portal.thirdweb.com/engine/features/admins"
            isExternal
          >
            Learn more about admins
          </Link>
          .
        </Text>
      </div>
      <AdminsTable
        admins={admins.data || []}
        authToken={authToken}
        client={client}
        instanceUrl={instanceUrl}
        isFetched={admins.isFetched}
        isPending={admins.isPending}
      />
      <AddAdminButton authToken={authToken} instanceUrl={instanceUrl} />
    </div>
  );
};
