"use client";

import { InlineCode } from "@/components/ui/inline-code";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { ButtonGroup, Divider, Flex } from "@chakra-ui/react";
import type { ThirdwebContract } from "thirdweb";
import { Card, Heading, Link, LinkButton, Text } from "tw-components";
import { Permissions } from "./components";

interface ContractPermissionsPageProps {
  contract: ThirdwebContract;
  detectedPermissionEnumerable: boolean;
  chainSlug: string;
  twAccount: Account | undefined;
}

export const ContractPermissionsPage: React.FC<
  ContractPermissionsPageProps
> = ({ contract, detectedPermissionEnumerable, chainSlug, twAccount }) => {
  useIsomorphicLayoutEffect(() => {
    window?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const explorerHref = `/${chainSlug}/${contract.address}/explorer`;

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
      <Permissions contract={contract} twAccount={twAccount} />
    </Flex>
  );
};
