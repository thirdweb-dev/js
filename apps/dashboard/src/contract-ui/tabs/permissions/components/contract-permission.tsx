import { PermissionEditor } from "./permissions-editor";
import { useIsAdmin } from "@3rdweb-sdk/react/hooks/useContractRoles";
import { Flex, Icon, Select, Spinner, Stack } from "@chakra-ui/react";
import { ValidContractInstance } from "@thirdweb-dev/sdk";
import { constants } from "ethers";
import { useFormContext } from "react-hook-form";
import { FiInfo } from "react-icons/fi";
import { Card, Heading, Text } from "tw-components";

interface ContractPermissionProps {
  role: string;
  description: string;
  isLoading: boolean;
  isPrebuilt: boolean;
  contract: ValidContractInstance;
}

export const ContractPermission: React.FC<ContractPermissionProps> = ({
  role,
  description,
  isLoading,
  isPrebuilt,
  contract,
}) => {
  const {
    watch,
    setValue,
    formState: { isSubmitting },
  } = useFormContext();

  const roleMembers: string[] = (watch() || {})[role] || [];
  const isRestricted =
    !roleMembers.includes(constants.AddressZero) ||
    (role !== "transfer" && role !== "lister" && role !== "asset");

  const isAdmin = useIsAdmin(contract as ValidContractInstance);

  return (
    <Card position="relative">
      <Flex direction="column" gap={3}>
        <Stack spacing={2} mb="12px">
          <Flex>
            <Stack spacing={1} flexGrow={1}>
              <Heading size="subtitle.sm" textTransform="capitalize">
                {role === "minter" ? "Minter / Creator" : role}
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
                            (address) => address !== constants.AddressZero,
                          ),
                          { shouldDirty: true },
                        );
                      } else {
                        setValue(
                          role,
                          [constants.AddressZero, ...roleMembers],
                          {
                            shouldDirty: true,
                          },
                        );
                      }
                    }}
                  >
                    <option value={1}>Non-Transferable</option>
                    <option value={0}>Transferable</option>
                  </Select>
                )}
              </Flex>
            )}

            {role === "lister" && isPrebuilt && (
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
                            (address) => address !== constants.AddressZero,
                          ),
                          { shouldDirty: true },
                        );
                      } else {
                        setValue(
                          role,
                          [constants.AddressZero, ...roleMembers],
                          {
                            shouldDirty: true,
                          },
                        );
                      }
                    }}
                  >
                    <option value={1}>Only specific wallets</option>
                    <option value={0}>Any wallet</option>
                  </Select>
                )}
              </Flex>
            )}

            {role === "asset" && isPrebuilt && (
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
                            (address) => address !== constants.AddressZero,
                          ),
                          { shouldDirty: true },
                        );
                      } else {
                        setValue(
                          role,
                          [constants.AddressZero, ...roleMembers],
                          {
                            shouldDirty: true,
                          },
                        );
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
              bg="primary.50"
              borderColor="primary.100"
              _dark={{
                bg: "primary.800",
                borderColor: "primary.800",
              }}
              align="center"
              padding="10px"
              gap={3}
            >
              <Icon
                as={FiInfo}
                color="primary.800"
                _dark={{ color: "primary.100" }}
                boxSize={6}
              />
              <Text color="primary.800" _dark={{ color: "primary.100" }}>
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

          {role === "lister" && isPrebuilt && (
            <Flex
              direction="row"
              borderRadius="md"
              borderWidth="1px"
              bg="primary.50"
              borderColor="primary.100"
              _dark={{
                bg: "primary.800",
                borderColor: "primary.800",
              }}
              align="center"
              padding="10px"
              gap={3}
            >
              <Icon
                as={FiInfo}
                color="primary.800"
                _dark={{ color: "primary.100" }}
                boxSize={6}
              />
              <Text color="primary.800" _dark={{ color: "primary.100" }}>
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

          {role === "asset" && isPrebuilt && (
            <Flex
              direction="row"
              borderRadius="md"
              borderWidth="1px"
              bg="primary.50"
              borderColor="primary.100"
              _dark={{
                bg: "primary.800",
                borderColor: "primary.800",
              }}
              align="center"
              padding="10px"
              gap={3}
            >
              <Icon
                as={FiInfo}
                color="primary.800"
                _dark={{ color: "primary.100" }}
                boxSize={6}
              />
              <Text color="primary.800" _dark={{ color: "primary.100" }}>
                {isRestricted ? (
                  <>
                    Currently, only assets from the contracts specified below
                    will be able to be used on this contract.
                  </>
                ) : (
                  <>
                    This contract is open for people to list assets from any
                    contract.
                  </>
                )}
              </Text>
            </Flex>
          )}

          {isLoading ? (
            <Spinner />
          ) : (
            isRestricted &&
            role &&
            contract && <PermissionEditor role={role} contract={contract} />
          )}
        </Stack>
      </Flex>
    </Card>
  );
};
