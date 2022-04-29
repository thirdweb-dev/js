import { PermissionEditor } from "./PermissionsEditor";
import { ContractWithRolesInstance, useIsAdmin } from "@3rdweb-sdk/react";
import { Flex, Icon, Select, Spinner, Stack } from "@chakra-ui/react";
import { AddressZero } from "@ethersproject/constants";
import { Role } from "@thirdweb-dev/sdk";
import { useFormContext } from "react-hook-form";
import { FiInfo } from "react-icons/fi";
import { Card, Heading, Text } from "tw-components";

interface IContractPermission {
  role: Role;
  description: string;
  contract: ContractWithRolesInstance;
  isLoading: boolean;
}

export const ContractPermission: React.FC<IContractPermission> = ({
  role,
  description,
  contract,
  isLoading,
}) => {
  const {
    watch,
    setValue,
    formState: { isSubmitting },
  } = useFormContext();
  const isAdmin = useIsAdmin(contract);

  const roleMembers: string[] = (watch() || {})[role] || [];
  const isRestricted =
    !roleMembers.includes(AddressZero) ||
    (role !== "transfer" && role !== "lister" && role !== "asset");

  return (
    <Card position="relative">
      <Flex direction="column" gap={3}>
        <Stack spacing={2} mb="12px">
          <Flex>
            <Stack spacing={1} flexGrow={1}>
              <Heading size="subtitle.sm" textTransform="capitalize">
                {role === "minter" ? "Creator" : role}
              </Heading>
              <Text>{description}</Text>
            </Stack>

            {role === "transfer" && (
              <Flex align="center" justify="center" flexGrow={0} flexShrink={0}>
                {isLoading || isSubmitting ? (
                  <Flex align="center" gap={2} px={2}>
                    <Spinner size="sm" />
                    <Text>{isLoading ? "Loading ..." : "Updating ..."}</Text>
                  </Flex>
                ) : (
                  <Select
                    isDisabled={!isAdmin}
                    variant="filled"
                    value={isRestricted ? 1 : 0}
                    onChange={(e) => {
                      if (e.target.value === "1") {
                        setValue(
                          role,
                          roleMembers.filter(
                            (address) => address !== AddressZero,
                          ),
                          { shouldDirty: true },
                        );
                      } else {
                        setValue(role, [AddressZero, ...roleMembers], {
                          shouldDirty: true,
                        });
                      }
                    }}
                  >
                    <option value={1}>Non-Transferable</option>
                    <option value={0}>Transferable</option>
                  </Select>
                )}
              </Flex>
            )}

            {role === "lister" && (
              <Flex align="center" justify="center" flexGrow={0} flexShrink={0}>
                {isLoading || isSubmitting ? (
                  <Flex align="center" gap={2} px={2}>
                    <Spinner size="sm" />
                    <Text>{isLoading ? "Loading ..." : "Updating ..."}</Text>
                  </Flex>
                ) : (
                  <Select
                    isDisabled={!isAdmin}
                    variant="filled"
                    value={isRestricted ? 1 : 0}
                    onChange={(e) => {
                      if (e.target.value === "1") {
                        setValue(
                          role,
                          roleMembers.filter(
                            (address) => address !== AddressZero,
                          ),
                          { shouldDirty: true },
                        );
                      } else {
                        setValue(role, [AddressZero, ...roleMembers], {
                          shouldDirty: true,
                        });
                      }
                    }}
                  >
                    <option value={1}>Only specific wallets</option>
                    <option value={0}>Any wallet</option>
                  </Select>
                )}
              </Flex>
            )}

            {role === "asset" && (
              <Flex align="center" justify="center" flexGrow={0} flexShrink={0}>
                {isLoading || isSubmitting ? (
                  <Flex align="center" gap={2} px={2}>
                    <Spinner size="sm" />
                    <Text>{isLoading ? "Loading ..." : "Updating ..."}</Text>
                  </Flex>
                ) : (
                  <Select
                    isDisabled={!isAdmin}
                    variant="filled"
                    value={isRestricted ? 1 : 0}
                    onChange={(e) => {
                      if (e.target.value === "1") {
                        setValue(
                          role,
                          roleMembers.filter(
                            (address) => address !== AddressZero,
                          ),
                          { shouldDirty: true },
                        );
                      } else {
                        setValue(role, [AddressZero, ...roleMembers], {
                          shouldDirty: true,
                        });
                      }
                    }}
                  >
                    <option value={1}>Only specific assets</option>
                    <option value={0}>Any asset</option>
                  </Select>
                )}
              </Flex>
            )}
          </Flex>

          {role === "transfer" && (
            <Flex
              direction="row"
              borderRadius="md"
              borderWidth="1px"
              bg="blue.50"
              borderColor="blue.100"
              _dark={{
                bg: "blue.800",
                borderColor: "blue.800",
              }}
              align="center"
              padding="10px"
              gap={3}
            >
              <Icon
                as={FiInfo}
                color="blue.800"
                _dark={{ color: "blue.100" }}
                boxSize={6}
              />
              <Text color="blue.800" _dark={{ color: "blue.100" }}>
                {isRestricted ? (
                  <>
                    The tokens in this contract are currently{" "}
                    <strong>non-transferable</strong>. Only wallets that you
                    explicitly add to the list below will be able to transfer
                    tokens.
                  </>
                ) : (
                  <>
                    Transferring tokens in this contract is currently{" "}
                    <strong>not restricted</strong>. Everyone is free to
                    transfer their tokens.
                  </>
                )}
              </Text>
            </Flex>
          )}

          {role === "lister" && (
            <Flex
              direction="row"
              borderRadius="md"
              borderWidth="1px"
              bg="blue.50"
              borderColor="blue.100"
              _dark={{
                bg: "blue.800",
                borderColor: "blue.800",
              }}
              align="center"
              padding="10px"
              gap={3}
            >
              <Icon
                as={FiInfo}
                color="blue.800"
                _dark={{ color: "blue.100" }}
                boxSize={6}
              />
              <Text color="blue.800" _dark={{ color: "blue.100" }}>
                {isRestricted ? (
                  <>
                    Currently, only addresses specified below will be able to
                    create listings on this marketplace.
                  </>
                ) : (
                  <>This marketplace is open for anyone to create listings.</>
                )}
              </Text>
            </Flex>
          )}

          {role === "asset" && (
            <Flex
              direction="row"
              borderRadius="md"
              borderWidth="1px"
              bg="blue.50"
              borderColor="blue.100"
              _dark={{
                bg: "blue.800",
                borderColor: "blue.800",
              }}
              align="center"
              padding="10px"
              gap={3}
            >
              <Icon
                as={FiInfo}
                color="blue.800"
                _dark={{ color: "blue.100" }}
                boxSize={6}
              />
              <Text color="blue.800" _dark={{ color: "blue.100" }}>
                {isRestricted ? (
                  <>
                    Currently, only assets from the contracts specified below
                    will be able to be listed on this marketplace.
                  </>
                ) : (
                  <>
                    This marketplace is open for people to list assets from any
                    contract.
                  </>
                )}
              </Text>
            </Flex>
          )}
        </Stack>

        {isLoading ? (
          <Spinner />
        ) : (
          isRestricted && <PermissionEditor role={role} contract={contract} />
        )}
      </Flex>
    </Card>
  );
};
