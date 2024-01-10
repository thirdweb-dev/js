import { useEnginePermissions } from "@3rdweb-sdk/react/hooks/useEngine";
import { Flex } from "@chakra-ui/react";
import { AddAdminButton } from "./add-admin-button";
import { Heading, Link, Text } from "tw-components";
import { AdminsTable } from "./admins-table";

interface PermissionsAdminProps {
  instance: string;
}

export const PermissionsAdmin: React.FC<PermissionsAdminProps> = ({
  instance,
}) => {
  const admins = useEnginePermissions(instance);

  return (
    <Flex flexDir="column" gap={4}>
      <Flex flexDir="column" gap={2}>
        <Heading size="title.md">Admins</Heading>
        <Text>
          Admins are allowed to manage your Engine instance from the dashboard.{" "}
          <Link
            href="https://portal.thirdweb.com/infrastructure/engine/features/authentication"
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
        instanceUrl={instance}
        admins={admins.data || []}
        isLoading={admins.isLoading}
        isFetched={admins.isFetched}
      />
      <AddAdminButton instance={instance} />
    </Flex>
  );
};
