"use client";

import { useEnginePermissions } from "@3rdweb-sdk/react/hooks/useEngine";
import { Flex } from "@chakra-ui/react";
import { Heading, Link, Text } from "tw-components";
import { AddAdminButton } from "./add-admin-button";
import { AdminsTable } from "./admins-table";

interface EngineAdminsProps {
  instanceUrl: string;
}

export const EngineAdmins: React.FC<EngineAdminsProps> = ({ instanceUrl }) => {
  const admins = useEnginePermissions(instanceUrl);

  return (
    <Flex flexDir="column" gap={4}>
      <Flex flexDir="column" gap={2}>
        <Heading size="title.md">Admins</Heading>
        <Text>
          Admins are allowed to manage your Engine instance from the dashboard.{" "}
          <Link
            href="https://portal.thirdweb.com/engine/features/admins"
            color="primary.500"
            isExternal
          >
            {" "}
            Learn more about admins
          </Link>
          .
        </Text>
      </Flex>
      <AdminsTable
        instanceUrl={instanceUrl}
        admins={admins.data || []}
        isLoading={admins.isLoading}
        isFetched={admins.isFetched}
      />
      <AddAdminButton instanceUrl={instanceUrl} />
    </Flex>
  );
};
