import type { ApiKey } from "@3rdweb-sdk/react/hooks/useApi";
import { Divider, Flex, Spinner } from "@chakra-ui/react";
import { CodeBlock, Text } from "tw-components";
import { FieldAlert } from "../Alerts";
import { DetailsRow } from "../DetailsRow";

interface CreateKeysProps {
  isLoading: boolean;
  apiKey: ApiKey;
}

export const CreateKeys: React.FC<CreateKeysProps> = ({
  apiKey,
  isLoading,
}) => {
  return (
    <Flex flexDir="column" gap={4}>
      <DetailsRow
        title="Client ID"
        content={
          isLoading ? (
            <Spinner size="sm" />
          ) : apiKey?.key ? (
            <CodeBlock codeValue={apiKey.key} code={apiKey.key} />
          ) : (
            <Text>Error generating keys</Text>
          )
        }
        description="Identifies your application."
      />

      <Divider />

      <DetailsRow
        title="Secret Key"
        content={
          isLoading ? (
            <Spinner size="sm" />
          ) : apiKey?.secret ? (
            <CodeBlock codeValue={apiKey.secret} code={apiKey.secret} />
          ) : (
            <Text>Error generating keys</Text>
          )
        }
        description="Identifies and authenticates your application from a backend."
      />

      <FieldAlert message="SecretKey" />
    </Flex>
  );
};
