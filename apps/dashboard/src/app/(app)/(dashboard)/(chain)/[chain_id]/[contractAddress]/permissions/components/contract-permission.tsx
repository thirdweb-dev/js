import { Flex, Select, Spinner } from "@chakra-ui/react";
import { InfoIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { type ThirdwebContract, ZERO_ADDRESS } from "thirdweb";
import { Card } from "@/components/ui/card";
import { useIsAdmin } from "@/hooks/useContractRoles";
import { PermissionEditor } from "./permissions-editor";

interface ContractPermissionProps {
  role: string;
  description: string;
  isPending: boolean;
  contract: ThirdwebContract;
}

export const ContractPermission: React.FC<ContractPermissionProps> = ({
  role,
  description,
  isPending,
  contract,
}) => {
  const {
    watch,
    setValue,
    formState: { isSubmitting },
  } = useFormContext();

  const roleMembers: string[] = watch()?.[role] || [];
  const isRestricted =
    !roleMembers.includes(ZERO_ADDRESS) ||
    (role !== "transfer" && role !== "lister" && role !== "asset");
  const isAdmin = useIsAdmin(contract);

  return (
    <Card className="relative p-4">
      <Flex direction="column" gap={3}>
        <div className="mb-3 flex flex-col gap-2">
          <div className="flex flex-row">
            <div className="flex grow flex-col gap-1">
              <p className="font-semibold text-base capitalize">
                {role === "minter" ? "Minter / Creator" : role}
              </p>
              <p className="text-muted-foreground">{description}</p>
            </div>

            {role === "transfer" && (
              <Flex align="center" flexGrow={0} flexShrink={0} justify="center">
                {isPending || isSubmitting ? (
                  <Flex align="center" gap={2} px={2}>
                    <Spinner size="sm" />
                    <p>{isPending ? "Loading ..." : "Updating ..."}</p>
                  </Flex>
                ) : (
                  <Select
                    isDisabled={!isAdmin}
                    onChange={(e) => {
                      if (e.target.value === "1") {
                        setValue(
                          role,
                          roleMembers.filter(
                            (address) => address !== ZERO_ADDRESS,
                          ),
                          { shouldDirty: true },
                        );
                      } else {
                        setValue(role, [ZERO_ADDRESS, ...roleMembers], {
                          shouldDirty: true,
                        });
                      }
                    }}
                    value={isRestricted ? 1 : 0}
                    variant="filled"
                  >
                    <option value={1}>Non-Transferable</option>
                    <option value={0}>Transferable</option>
                  </Select>
                )}
              </Flex>
            )}

            {role === "lister" && (
              <Flex align="center" flexGrow={0} flexShrink={0} justify="center">
                {isPending || isSubmitting ? (
                  <Flex align="center" gap={2} px={2}>
                    <Spinner size="sm" />
                    <p>{isPending ? "Loading ..." : "Updating ..."}</p>
                  </Flex>
                ) : (
                  <Select
                    isDisabled={!isAdmin}
                    onChange={(e) => {
                      if (e.target.value === "1") {
                        setValue(
                          role,
                          roleMembers.filter(
                            (address) => address !== ZERO_ADDRESS,
                          ),
                          { shouldDirty: true },
                        );
                      } else {
                        setValue(role, [ZERO_ADDRESS, ...roleMembers], {
                          shouldDirty: true,
                        });
                      }
                    }}
                    value={isRestricted ? 1 : 0}
                    variant="filled"
                  >
                    <option value={1}>Only specific wallets</option>
                    <option value={0}>Any wallet</option>
                  </Select>
                )}
              </Flex>
            )}

            {role === "asset" && (
              <Flex align="center" flexGrow={0} flexShrink={0} justify="center">
                {isPending || isSubmitting ? (
                  <Flex align="center" gap={2} px={2}>
                    <Spinner size="sm" />
                    <p>{isPending ? "Loading ..." : "Updating ..."}</p>
                  </Flex>
                ) : (
                  <Select
                    isDisabled={!isAdmin}
                    onChange={(e) => {
                      if (e.target.value === "1") {
                        setValue(
                          role,
                          roleMembers.filter(
                            (address) => address !== ZERO_ADDRESS,
                          ),
                          { shouldDirty: true },
                        );
                      } else {
                        setValue(role, [ZERO_ADDRESS, ...roleMembers], {
                          shouldDirty: true,
                        });
                      }
                    }}
                    value={isRestricted ? 1 : 0}
                    variant="filled"
                  >
                    <option value={1}>Only specific assets</option>
                    <option value={0}>Any asset</option>
                  </Select>
                )}
              </Flex>
            )}
          </div>

          {role === "transfer" && (
            <Flex
              _dark={{
                bg: "primary.800",
                borderColor: "primary.800",
              }}
              align="center"
              bg="primary.50"
              borderColor="primary.100"
              borderRadius="md"
              borderWidth="1px"
              direction="row"
              gap={3}
              padding="10px"
            >
              <InfoIcon className="size-6 text-primary hover:opacity-10 dark:text-primary-foreground" />
              <p className="text-primary dark:text-primary-foreground">
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
              </p>
            </Flex>
          )}

          {role === "lister" && (
            <Flex
              _dark={{
                bg: "primary.800",
                borderColor: "primary.800",
              }}
              align="center"
              bg="primary.50"
              borderColor="primary.100"
              borderRadius="md"
              borderWidth="1px"
              direction="row"
              gap={3}
              padding="10px"
            >
              <InfoIcon className="size-6 text-primary hover:opacity-10 dark:text-primary-foreground" />
              <p className="text-primary dark:text-primary-foreground">
                {isRestricted
                  ? "Currently, only addresses specified below will be able to create listings on this marketplace."
                  : "This marketplace is open for anyone to create listings."}
              </p>
            </Flex>
          )}

          {role === "asset" && (
            <Flex
              _dark={{
                bg: "primary.800",
                borderColor: "primary.800",
              }}
              align="center"
              bg="primary.50"
              borderColor="primary.100"
              borderRadius="md"
              borderWidth="1px"
              direction="row"
              gap={3}
              padding="10px"
            >
              <InfoIcon className="size-6 text-primary hover:opacity-10 dark:text-primary-foreground" />
              <p className="text-primary dark:text-primary-foreground">
                {isRestricted
                  ? "Currently, only assets from the contracts specified below will be able to be used on this contract."
                  : "This contract is open for people to list assets from any contract."}
              </p>
            </Flex>
          )}

          {isPending ? (
            <Spinner />
          ) : (
            isRestricted &&
            role && <PermissionEditor contract={contract} role={role} />
          )}
        </div>
      </Flex>
    </Card>
  );
};
