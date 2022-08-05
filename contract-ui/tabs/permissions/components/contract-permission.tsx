import { PermissionEditor } from "./permissions-editor";
import { Flex, Spinner, Stack } from "@chakra-ui/react";
import { Card, Heading, Text } from "tw-components";

interface IContractPermission {
  role: string;
  description: string;
  isLoading: boolean;
}

export const ContractPermission: React.FC<IContractPermission> = ({
  role,
  description,
  isLoading,
}) => {
  return (
    <Card position="relative">
      <Flex direction="column" gap={3}>
        <Stack spacing={2} mb="12px">
          <Stack spacing={1} flexGrow={1}>
            <Heading size="subtitle.sm" textTransform="capitalize">
              {role === "minter" ? "Creator" : role}
            </Heading>
            <Text>{description}</Text>
          </Stack>

          {isLoading ? <Spinner /> : <PermissionEditor role={role} />}
        </Stack>
      </Flex>
    </Card>
  );
};
