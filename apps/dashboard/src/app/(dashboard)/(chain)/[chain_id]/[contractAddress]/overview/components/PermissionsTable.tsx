"use client";

import { ToolTipLabel } from "@/components/ui/tooltip";
import { Box, Flex, List, SimpleGrid, Tag } from "@chakra-ui/react";
import { getAllRoleMembers } from "contract-ui/hooks/permissions";
import { useClipboard } from "hooks/useClipboard";
import { CopyIcon } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";
import { type ThirdwebContract, ZERO_ADDRESS } from "thirdweb";
import { useReadContract } from "thirdweb/react";
import { Button } from "tw-components/button";
import { Card } from "tw-components/card";
import { Heading } from "tw-components/heading";
import { TrackedLink, type TrackedLinkProps } from "tw-components/link";
import { Text } from "tw-components/text";
import { shortenIfAddress } from "utils/usedapp-external";

interface PermissionsTableProps {
  contract: ThirdwebContract;
  trackingCategory: TrackedLinkProps["category"];
  chainSlug: string;
}

export const PermissionsTable: React.FC<PermissionsTableProps> = ({
  contract,
  trackingCategory,
  chainSlug,
}) => {
  const allRoleMembers = useReadContract(getAllRoleMembers, {
    contract,
  });
  const permissionsHref = `/${chainSlug}/${contract.address}/permissions`;
  const members = useMemo(() => {
    return (
      Object.entries(allRoleMembers.data || {}).reduce(
        (acc, [role, roleMembers]) => {
          // biome-ignore lint/complexity/noForEach: FIXME
          roleMembers.forEach((member) => {
            return !acc.find((m) => m.member === member)
              ? acc.push({ member, roles: [role] })
              : acc[acc.findIndex((m) => m.member === member)]?.roles.push(
                  role,
                );
          });

          return acc;
        },
        [] as { member: string; roles: string[] }[],
      ) || []
    ).filter((m) => m.member !== ZERO_ADDRESS);
  }, [allRoleMembers.data]);

  return (
    <Flex gap={6} flexDirection="column">
      <Flex align="center" justify="space-between" w="full">
        <h2 className="font-semibold text-2xl tracking-tight">Permissions</h2>
        <TrackedLink
          category={trackingCategory}
          label="view_all_permissions"
          color="blue.400"
          _light={{
            color: "blue.600",
          }}
          gap={4}
          href={permissionsHref}
        >
          View all -&gt;
        </TrackedLink>
      </Flex>
      {contract && (
        <Card p={0} overflow="hidden">
          <SimpleGrid
            gap={2}
            columns={9}
            borderBottomWidth="1px"
            borderColor="borderColor"
            padding={4}
            bg="blackAlpha.50"
            _dark={{ bg: "whiteAlpha.50" }}
          >
            <Heading gridColumn="span 3" size="label.md">
              Member
            </Heading>
            <Heading gridColumn="span 6" size="label.md">
              Roles
            </Heading>
          </SimpleGrid>

          <List overflow="auto">
            {members.length === 0 && (
              <div className="flex items-center justify-center py-4">
                <Flex align="center" gap={2}>
                  <Text size="body.md" fontStyle="italic">
                    {allRoleMembers.isPending
                      ? "loading permissions"
                      : "no permissions found"}
                  </Text>
                </Flex>
              </div>
            )}
            <div>
              {members.map((e) => (
                <PermissionsItem key={e.member} data={e} />
              ))}
            </div>
          </List>
        </Card>
      )}
    </Flex>
  );
};

interface PermissionsItemProps {
  data: { member: string; roles: string[] };
}

const PermissionsItem: React.FC<PermissionsItemProps> = ({ data }) => {
  const { onCopy } = useClipboard(data.member);

  return (
    <div>
      <SimpleGrid
        columns={9}
        gap={2}
        as="li"
        borderBottomWidth="1px"
        borderColor="borderColor"
        padding={4}
        overflow="hidden"
        alignItems="center"
        _last={{ borderBottomWidth: 0 }}
      >
        <Box gridColumn="span 2">
          <div className="flex flex-row items-center gap-3">
            <ToolTipLabel label="Copy address to clipboard">
              <Button
                size="sm"
                bg="transparent"
                onClick={() => {
                  onCopy();
                  toast.info("Address copied.");
                }}
              >
                <CopyIcon className="size-3" />
              </Button>
            </ToolTipLabel>
            <Text fontFamily="mono" noOfLines={1}>
              {shortenIfAddress(data.member)}
            </Text>
          </div>
        </Box>

        <Box gridColumn="span 1" />

        <Flex gridColumn="span 6" flexWrap="wrap" gap={2}>
          {data.roles.slice(0, 3).map((role) => (
            <Tag key={role}>
              <Text size="body.md" fontWeight="medium">
                {role}
              </Text>
            </Tag>
          ))}
          {data.roles.length > 3 && (
            <Tag
              border="2px solid"
              borderColor="var(--badge-bg)"
              bg="transparent"
            >
              <Text size="body.md" fontWeight="medium">
                + {data.roles.length - 3}
              </Text>
            </Tag>
          )}
        </Flex>
      </SimpleGrid>
    </div>
  );
};
