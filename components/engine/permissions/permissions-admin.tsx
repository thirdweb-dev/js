import { useEnginePermissions } from "@3rdweb-sdk/react/hooks/useEngine";
import { Flex } from "@chakra-ui/react";
import { AddAdminButton } from "./add-admin-button";
import { Heading } from "tw-components";
import { PermissionsTable } from "./permissions-table";

interface PermissionsAdminProps {
  instance: string;
}

export const PermissionsAdmin: React.FC<PermissionsAdminProps> = ({
  instance,
}) => {
  const permissionsItems = useEnginePermissions(instance);

  return (
    <Flex flexDir="column" gap={4}>
      <Heading size="title.md">Admin Wallets</Heading>
      <PermissionsTable
        instance={instance}
        permissionsItems={permissionsItems.data || []}
        isLoading={permissionsItems.isLoading}
        isFetched={permissionsItems.isFetched}
      />
      <AddAdminButton instance={instance} />
    </Flex>
  );
};
