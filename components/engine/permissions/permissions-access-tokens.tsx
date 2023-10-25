import { useEngineAccessTokens } from "@3rdweb-sdk/react/hooks/useEngine";
import { Flex } from "@chakra-ui/react";
import { Heading } from "tw-components";
import { AddAccessTokenButton } from "./add-access-token-button";
import { AccessTokensTable } from "./access-tokens-table";

interface PermissionsAccessTokensProps {
  instance: string;
}

export const PermissionsAccessTokens: React.FC<
  PermissionsAccessTokensProps
> = ({ instance }) => {
  const accessTokens = useEngineAccessTokens(instance);

  return (
    <Flex flexDir="column" gap={4}>
      <Heading size="title.md">Access Tokens</Heading>
      <AccessTokensTable
        instance={instance}
        accessTokens={accessTokens.data || []}
        isLoading={accessTokens.isLoading}
        isFetched={accessTokens.isFetched}
      />
      <AddAccessTokenButton instance={instance} />
    </Flex>
  );
};
