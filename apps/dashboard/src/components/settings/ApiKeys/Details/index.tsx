import { ApiKey } from "@3rdweb-sdk/react/hooks/useApi";
import { Flex } from "@chakra-ui/react";
import { Button } from "tw-components";
import { ApiKeyHeader } from "../Header";
import { GeneralDetails } from "./General";
import { ServicesDetails } from "./Services";
import { RevokeApiKeyButton } from "../RevokeButton";

interface ApiKeyDetailsProps {
  apiKey: ApiKey;
  onEdit: () => void;
}
export const ApiKeyDetails: React.FC<ApiKeyDetailsProps> = ({
  apiKey,
  onEdit,
}) => {
  return (
    <Flex flexDir="column" gap={10}>
      <ApiKeyHeader
        apiKey={apiKey}
        actions={
          <>
            <RevokeApiKeyButton id={apiKey.id} name={apiKey.name} />
            <Button
              type="button"
              colorScheme="primary"
              onClick={onEdit}
              minW={20}
            >
              Edit
            </Button>
          </>
        }
      />

      <Flex flexDir="column" gap={10}>
        <GeneralDetails apiKey={apiKey} />
        <ServicesDetails apiKey={apiKey} />
      </Flex>
    </Flex>
  );
};
