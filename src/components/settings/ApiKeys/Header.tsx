import { ApiKey } from "@3rdweb-sdk/react/hooks/useApi";
import { HStack, Icon } from "@chakra-ui/react";
import { ReactNode } from "react";
import { FiChevronRight } from "react-icons/fi";
import { Text, Link } from "tw-components";

interface EditApiKeyFormProps {
  apiKey: ApiKey;
  actions: ReactNode;
}

export const ApiKeyHeader: React.FC<EditApiKeyFormProps> = ({
  apiKey,
  actions,
}) => {
  return (
    <HStack alignItems="center" justifyContent="space-between">
      <HStack gap={1} alignItems="center">
        <Link href="/dashboard/settings/api-keys" color="blue.500">
          <Text size="body.lg" color="blue.500">
            API Keys
          </Text>
        </Link>
        <Icon as={FiChevronRight} />
        <Text size="body.lg">{apiKey.name}</Text>
      </HStack>

      <HStack gap={3}>{actions}</HStack>
    </HStack>
  );
};
