"use client";

import { useEnginePermissions } from "@3rdweb-sdk/react/hooks/useEngine";
import { Heading, Link, Text } from "tw-components";
import { AddAdminButton } from "./add-admin-button";
import { AdminsTable } from "./admins-table";

interface EngineAdminsProps {
  instanceUrl: string;
  authToken: string;
}

export const EngineAdmins: React.FC<EngineAdminsProps> = ({
  instanceUrl,
  authToken,
}) => {
  const admins = useEnginePermissions({
    instanceUrl,
    authToken,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Heading size="title.md">Admins</Heading>
        <Text>
          Admins are allowed to manage your Engine instance from the dashboard.{" "}
          <Link
            href="https://portal.thirdweb.com/engine/features/admins"
            color="primary.500"
            isExternal
          >
            Learn more about admins
          </Link>
          .
        </Text>
      </div>
      <AdminsTable
        instanceUrl={instanceUrl}
        admins={admins.data || []}
        isPending={admins.isPending}
        isFetched={admins.isFetched}
        authToken={authToken}
      />
      <AddAdminButton instanceUrl={instanceUrl} authToken={authToken} />
    </div>
  );
};
