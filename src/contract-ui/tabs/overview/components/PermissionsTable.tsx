import {
  Box,
  Center,
  Flex,
  Icon,
  List,
  SimpleGrid,
  Stack,
  Tag,
  Tooltip,
  useClipboard,
  useToast,
} from "@chakra-ui/react";
import { useAllRoleMembers } from "@thirdweb-dev/react";
import { SmartContract } from "@thirdweb-dev/sdk";
import { useTabHref } from "contract-ui/utils";
import { constants } from "ethers";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import { FiCopy } from "react-icons/fi";
import {
  Button,
  Card,
  Heading,
  Text,
  TrackedLink,
  TrackedLinkProps,
} from "tw-components";
import { shortenIfAddress } from "utils/usedapp-external";

interface PermissionsTableProps {
  contract: SmartContract;
  trackingCategory: TrackedLinkProps["category"];
}

export const PermissionsTable: React.FC<PermissionsTableProps> = ({
  contract,
  trackingCategory,
}) => {
  const allRoleMembers = useAllRoleMembers(contract);
  const permissionsHref = useTabHref("permissions");

  const members = useMemo(() => {
    return (
      Object.entries(allRoleMembers.data || {}).reduce(
        (acc, [role, roleMembers]) => {
          roleMembers.forEach((member) => {
            return !acc.find((m) => m.member === member)
              ? acc.push({ member, roles: [role] })
              : acc[acc.findIndex((m) => m.member === member)].roles.push(role);
          });

          return acc;
        },
        [] as { member: string; roles: string[] }[],
      ) || []
    ).filter((m) => m.member !== constants.AddressZero);
  }, [allRoleMembers.data]);

  return (
    <Flex gap={6} flexDirection="column">
      <Flex align="center" justify="space-between" w="full">
        <Heading flexShrink={0} size="title.sm">
          Permissions
        </Heading>
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
              <Center py={4}>
                <Flex align="center" gap={2}>
                  <Text size="body.md" fontStyle="italic">
                    {allRoleMembers.isLoading
                      ? "loading permissions"
                      : "no permissions found"}
                  </Text>
                </Flex>
              </Center>
            )}
            <AnimatePresence initial={false}>
              {members.map((e) => (
                <PermissionsItem key={e.member} data={e} />
              ))}
            </AnimatePresence>
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
  const toast = useToast();
  const { onCopy, setValue } = useClipboard(data.member);

  useEffect(() => {
    if (data.member) {
      setValue(data.member);
    }
  }, [data.member, setValue]);

  return (
    <Box>
      <SimpleGrid
        columns={9}
        gap={2}
        as={motion.li}
        initial={{
          y: -30,
          opacity: 0,
          paddingTop: 0,
          paddingBottom: 0,
          height: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
          height: "auto",
          paddingTop: "var(--chakra-space-3)",
          paddingBottom: "var(--chakra-space-3)",
          transition: { duration: 0.15 },
        }}
        exit={{
          y: 30,
          opacity: 0,
          paddingTop: 0,
          paddingBottom: 0,
          height: 0,
          transition: { duration: 0.3 },
        }}
        willChange="opacity, height, paddingTop, paddingBottom"
        borderBottomWidth="1px"
        borderColor="borderColor"
        padding={4}
        overflow="hidden"
        alignItems="center"
        _last={{ borderBottomWidth: 0 }}
      >
        <Box gridColumn="span 2">
          <Stack direction="row" align="center" spacing={3}>
            <Tooltip
              p={0}
              bg="transparent"
              boxShadow="none"
              label={
                <Card py={2} px={4} bgColor="backgroundHighlight">
                  <Text size="label.sm">Copy address to clipboard</Text>
                </Card>
              }
            >
              <Button
                size="sm"
                bg="transparent"
                onClick={() => {
                  onCopy();
                  toast({
                    variant: "solid",
                    position: "bottom",
                    title: "Address copied.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                  });
                }}
              >
                <Icon as={FiCopy} boxSize={3} />
              </Button>
            </Tooltip>
            <Text fontFamily="mono" noOfLines={1}>
              {shortenIfAddress(data.member)}
            </Text>
          </Stack>
        </Box>

        <Box gridColumn="span 1" />

        <Flex gridColumn="span 6" flexWrap="wrap" gap={2}>
          {data.roles.slice(0, 3).map((role, idx) => (
            <Tag key={idx}>
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
    </Box>
  );
};
