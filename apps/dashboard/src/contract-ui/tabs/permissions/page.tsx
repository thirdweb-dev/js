"use client";

import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { ButtonGroup, Code, Divider, Flex } from "@chakra-ui/react";
import { useTabHref } from "contract-ui/utils";
import type { ThirdwebContract } from "thirdweb";
import { Card, Heading, Link, LinkButton, Text } from "tw-components";
import { Permissions } from "./components";

interface ContractPermissionsPageProps {
  contract: ThirdwebContract;
  detectedPermissionEnumerable: boolean;
}

export const ContractPermissionsPage: React.FC<
  ContractPermissionsPageProps
> = ({ contract, detectedPermissionEnumerable }) => {
  useIsomorphicLayoutEffect(() => {
    window?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const explorerHref = useTabHref("explorer");

  if (!detectedPermissionEnumerable) {
    return (
      <Card as={Flex} flexDir="column" gap={3}>
        {/* TODO  extract this out into it's own component and make it better */}
        <Heading size="subtitle.md">
          Missing PermissionsEnumerable Extension
        </Heading>
        <Text>
          This contract does not support the <Code>PermissionsEnumerable</Code>{" "}
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
      <Permissions contract={contract} />
    </Flex>
  );
};
