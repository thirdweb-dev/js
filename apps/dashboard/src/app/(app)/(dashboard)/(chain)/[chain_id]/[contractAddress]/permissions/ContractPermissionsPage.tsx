"use client";

import { InlineCode } from "@/components/ui/inline-code";
import { ButtonGroup, Divider, Flex } from "@chakra-ui/react";
import type { ThirdwebContract } from "thirdweb";
import { Card, Heading, Link, LinkButton, Text } from "tw-components";
import type { ProjectMeta } from "../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/types";
import { buildContractPagePath } from "../_utils/contract-page-path";
import { Permissions } from "./components";

interface ContractPermissionsPageProps {
  contract: ThirdwebContract;
  detectedPermissionEnumerable: boolean;
  chainSlug: string;
  isLoggedIn: boolean;
  projectMeta: ProjectMeta | undefined;
}

export const ContractPermissionsPage: React.FC<
  ContractPermissionsPageProps
> = ({
  contract,
  detectedPermissionEnumerable,
  chainSlug,
  isLoggedIn,
  projectMeta,
}) => {
  const explorerHref = buildContractPagePath({
    projectMeta,
    chainIdOrSlug: chainSlug,
    contractAddress: contract.address,
    subpath: "/explorer",
  });

  if (!detectedPermissionEnumerable) {
    return (
      <Card as={Flex} flexDir="column" gap={3}>
        {/* TODO  extract this out into it's own component and make it better */}
        <Heading size="subtitle.md">
          Missing PermissionsEnumerable Extension
        </Heading>
        <Text>
          This contract does not support the{" "}
          <InlineCode code="PermissionsEnumerable" />
          extension.
          <br />
          As a result, you can only view and manage basic permissions via the{" "}
          <Link href={explorerHref} color="primary.500">
            Explorer
          </Link>{" "}
          at the moment.
        </Text>

        <Divider my={1} />
        <Flex gap={4} align="center">
          <Heading size="label.md">Learn more: </Heading>
          <ButtonGroup colorScheme="purple" size="sm" variant="solid">
            <LinkButton
              isExternal
              href="https://portal.thirdweb.com/contracts/build/extensions/general/Permissions"
            >
              Permissions
            </LinkButton>
          </ButtonGroup>
        </Flex>
      </Card>
    );
  }

  return (
    <Flex direction="column" gap={6}>
      <Permissions contract={contract} isLoggedIn={isLoggedIn} />
    </Flex>
  );
};
