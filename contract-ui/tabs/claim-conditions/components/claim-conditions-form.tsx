import { ClaimConditionsProps } from "./claim-conditions";
import { PriceInput } from "./price-input";
import { QuantityInputWithUnlimited } from "./quality-input-with-unlimited";
import { AdminOnly } from "@3rdweb-sdk/react/components/roles/admin-only";
import { useIsAdmin } from "@3rdweb-sdk/react/hooks/useContractRoles";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Divider,
  Flex,
  FormControl,
  Icon,
  IconButton,
  Input,
  Select,
  Spinner,
} from "@chakra-ui/react";
import {
  TokenContract,
  useClaimConditions,
  useSetClaimConditions,
  useTokenDecimals,
} from "@thirdweb-dev/react";
import {
  ClaimConditionInput,
  ClaimConditionInputArray,
  NATIVE_TOKEN_ADDRESS,
  ValidContractInstance,
} from "@thirdweb-dev/sdk/evm";
import { TransactionButton } from "components/buttons/TransactionButton";
import { detectFeatures } from "components/contract-components/utils";
import { BigNumberInput } from "components/shared/BigNumberInput";
import { CurrencySelector } from "components/shared/CurrencySelector";
import { SnapshotUpload } from "contract-ui/tabs/claim-conditions/components/snapshot-upload";
import { constants } from "ethers";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import {
  hasLegacyClaimConditions,
  hasMultiphaseClaimConditions,
} from "lib/claimcondition-utils";
import React, { useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { BsCircleFill } from "react-icons/bs";
import { FiPlus, FiTrash, FiUpload } from "react-icons/fi";
import {
  Button,
  Card,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Text,
} from "tw-components";
import { toDateTimeLocal } from "utils/date-utils";
import * as z from "zod";
import { ZodError } from "zod";

const DEFAULT_PHASE = {
  startTime: new Date(),
  maxClaimableSupply: "unlimited",
  maxClaimablePerWallet: "unlimited",
  waitInSeconds: "0",
  price: 0,
  currencyAddress: NATIVE_TOKEN_ADDRESS,
  snapshot: undefined,
  merkleRootHash: undefined,
  metadata: {
    name: "",
  },
};

const ClaimConditionsSchema = z.object({
  phases: ClaimConditionInputArray,
});
export const ClaimConditionsForm: React.FC<ClaimConditionsProps> = ({
  contract,
  tokenId,
  isColumn,
}) => {
  const trackEvent = useTrack();
  const [resetFlag, setResetFlag] = useState(false);
  const isAdmin = useIsAdmin(contract);

  const query = useClaimConditions(contract, tokenId, {
    withAllowList: true,
  });
  const mutation = useSetClaimConditions(contract, tokenId);
  const isErc20 = detectFeatures<TokenContract>(contract, ["ERC20"]);

  const tokenDecimals = useTokenDecimals(isErc20 ? contract : undefined);

  const decimals = tokenDecimals.data ?? 0;
  const nftsOrToken = isErc20 ? "tokens" : "NFTs";

  const transformedQueryData = useMemo(() => {
    return (query.data || [])
      .map((phase, idx) => ({
        ...phase,
        price: Number(phase.currencyMetadata.displayValue),
        maxClaimableSupply: phase.maxClaimableSupply?.toString() || "0",
        currencyMetadata: {
          ...phase.currencyMetadata,
          value: phase.currencyMetadata.value?.toString() || "0",
        },
        currencyAddress: phase.currencyAddress?.toLowerCase() || "0",
        maxClaimablePerWallet: phase.maxClaimablePerWallet?.toString() || "0",
        waitInSeconds: phase.waitInSeconds?.toString() || "0",
        startTime: new Date(phase.startTime),
        snapshot: phase.snapshot?.map(
          ({ address, maxClaimable, price, currencyAddress }) => ({
            address,
            maxClaimable: maxClaimable || "0",
            price: price || undefined,
            currencyAddress: currencyAddress || undefined,
          }),
        ),
        metadata: {
          ...phase.metadata,
          name: phase?.metadata?.name || `Phase ${idx + 1}`,
        },
      }))
      .filter((phase) => phase.maxClaimableSupply !== "0");
  }, [query.data]);

  const form = useForm<z.input<typeof ClaimConditionsSchema>>({
    defaultValues: { phases: transformedQueryData },
    values: { phases: transformedQueryData },
    resetOptions: {
      keepDirty: true,
      keepDirtyValues: true,
    },
  });

  const [openIndex, setOpenIndex] = useState<number>(-1);

  const { append, remove, fields } = useFieldArray({
    control: form.control,
    name: "phases",
  });

  const addPhase = () => {
    append({
      ...DEFAULT_PHASE,
      metadata: { name: `Phase ${fields.length + 1}` },
    });
  };
  const removePhase = (index: number) => {
    remove(index);
  };

  const watchFieldArray = form.watch("phases");
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    };
  });

  const { onSuccess, onError } = useTxNotifications(
    "Saved claim phases",
    "Failed to save claim phases",
  );

  const isMultiPhase = hasMultiphaseClaimConditions(contract);
  const canEdit = useIsAdmin(contract) && !mutation.isLoading;

  if (!contract) {
    return null;
  }

  const isClaimPhaseV1 = hasLegacyClaimConditions(contract);

  const canEditPhaseTitle = !isClaimPhaseV1;

  return (
    <>
      {query.isRefetching && (
        <Spinner
          color="primary"
          size="xs"
          position="absolute"
          top={2}
          right={4}
        />
      )}
      <Flex
        onSubmit={form.handleSubmit(async (d) => {
          trackEvent({
            category: isErc20 ? "token" : "nft",
            action: "set-claim-conditions",
            label: "attempt",
          });
          try {
            await mutation.mutateAsync({
              phases: d.phases as ClaimConditionInput[],
              reset: resetFlag,
            });
            trackEvent({
              category: isErc20 ? "token" : "nft",
              action: "set-claim-conditions",
              label: "success",
            });
            onSuccess();
          } catch (error) {
            trackEvent({
              category: isErc20 ? "token" : "nft",
              action: "set-claim-conditions",
              label: "error",
            });
            if (error instanceof ZodError) {
              error.errors.forEach((e) => {
                const path = `phases.${e.path.join(".")}`;
                form.setError(path as any, e);
              });
            } else {
              onError(error);
            }
          }
        })}
        direction="column"
        as="form"
        gap={10}
      >
        <Flex
          direction={"column"}
          gap={4}
          px={isColumn ? 6 : { base: 6, md: 10 }}
        >
          {controlledFields.map((field, index) => {
            const dropType: "any" | "specific" | "overrides" = field.snapshot
              ? isClaimPhaseV1
                ? "specific"
                : field.maxClaimablePerWallet?.toString() === "0"
                ? "specific"
                : "overrides"
              : "any";

            return (
              <React.Fragment key={`snapshot_${field.id}_${index}`}>
                <SnapshotUpload
                  dropType={dropType}
                  isV1ClaimCondition={isClaimPhaseV1}
                  isOpen={openIndex === index}
                  onClose={() => setOpenIndex(-1)}
                  value={field.snapshot?.map((v) =>
                    typeof v === "string"
                      ? {
                          address: v,
                          maxClaimable: "unlimited",
                          currencyAddress: constants.AddressZero,
                          price: "unlimited",
                        }
                      : {
                          ...v,
                          maxClaimable:
                            v?.maxClaimable?.toString() || "unlimited",
                          currencyAddress:
                            v?.currencyAddress || constants.AddressZero,
                          price: v?.price?.toString() || "unlimited",
                        },
                  )}
                  setSnapshot={(snapshot) =>
                    form.setValue(`phases.${index}.snapshot`, snapshot)
                  }
                  isDisabled={!canEdit}
                />
                <Card position="relative">
                  <Flex direction="column" gap={8}>
                    <Flex align="flex-start" justify="space-between">
                      {isMultiPhase ? (
                        canEditPhaseTitle ? (
                          <FormControl>
                            <Heading as={FormLabel} size="label.md">
                              Name
                            </Heading>
                            <Input
                              w="auto"
                              isDisabled={!canEdit}
                              // size="sm"
                              // borderColor="borderColor"
                              // variant="outline"
                              // w="auto"
                              type="text"
                              value={field.metadata?.name}
                              placeholder={`Phase ${index + 1}`}
                              onChange={(e) => {
                                form.setValue(
                                  `phases.${index}.metadata.name`,
                                  e.target.value,
                                );
                              }}
                            />
                            <FormHelperText>
                              This does not affect how your claim phase
                              functions and is for organizational purposes only.
                            </FormHelperText>
                          </FormControl>
                        ) : (
                          <Heading size="label.lg">
                            {field.metadata?.name || `Phase ${index + 1}`}
                          </Heading>
                        )
                      ) : (
                        <Heading size="label.lg">Claim Conditions</Heading>
                      )}
                      <AdminOnly contract={contract as ValidContractInstance}>
                        <IconButton
                          size="sm"
                          variant="ghost"
                          aria-label="Delete Claim Phase"
                          colorScheme="red"
                          icon={<Icon as={FiTrash} />}
                          isDisabled={mutation.isLoading}
                          onClick={() => {
                            removePhase(index);
                            if (!isMultiPhase) {
                              setResetFlag(true);
                            }
                          }}
                        />
                      </AdminOnly>
                    </Flex>

                    <Flex
                      direction={{
                        base: "column",
                        md: isColumn ? "column" : "row",
                      }}
                      gap={4}
                    >
                      <FormControl
                        isDisabled={!canEdit}
                        isInvalid={
                          !!form.getFieldState(
                            `phases.${index}.startTime`,
                            form.formState,
                          ).error
                        }
                      >
                        <Heading as={FormLabel} size="label.md">
                          When will this phase start?
                        </Heading>
                        <Input
                          type="datetime-local"
                          value={toDateTimeLocal(field.startTime)}
                          onChange={(e) =>
                            form.setValue(
                              `phases.${index}.startTime`,
                              new Date(e.target.value),
                            )
                          }
                        />
                        <FormErrorMessage>
                          {
                            form.getFieldState(
                              `phases.${index}.startTime`,
                              form.formState,
                            ).error?.message
                          }
                        </FormErrorMessage>
                        <FormHelperText>
                          This time is in your local timezone.
                        </FormHelperText>
                      </FormControl>

                      <FormControl
                        isDisabled={!canEdit}
                        isInvalid={
                          !!form.getFieldState(
                            `phases.${index}.maxClaimableSupply`,
                            form.formState,
                          ).error
                        }
                      >
                        <Heading as={FormLabel} size="label.md">
                          How many {nftsOrToken} will you drop in this phase?
                        </Heading>

                        <QuantityInputWithUnlimited
                          isRequired
                          isDisabled={!canEdit}
                          decimals={decimals}
                          value={field.maxClaimableSupply?.toString() || "0"}
                          onChange={(value) =>
                            form.setValue(
                              `phases.${index}.maxClaimableSupply`,
                              value.toString(),
                            )
                          }
                        />

                        <FormErrorMessage>
                          {
                            form.getFieldState(
                              `phases.${index}.maxClaimableSupply`,
                              form.formState,
                            ).error?.message
                          }
                        </FormErrorMessage>
                      </FormControl>
                    </Flex>

                    <Flex
                      direction={{
                        base: "column",
                        md: isColumn ? "column" : "row",
                      }}
                      gap={4}
                    >
                      <FormControl
                        isDisabled={!canEdit}
                        isInvalid={
                          !!form.getFieldState(
                            `phases.${index}.price`,
                            form.formState,
                          ).error
                        }
                      >
                        <Heading as={FormLabel} size="label.md">
                          How much do you want to charge to claim each{" "}
                          {isErc20 ? "token" : "NFT"}?
                        </Heading>
                        <PriceInput
                          value={parseFloat(field.price?.toString() || "0")}
                          onChange={(val) =>
                            form.setValue(`phases.${index}.price`, val)
                          }
                        />
                        <FormErrorMessage>
                          {
                            form.getFieldState(
                              `phases.${index}.price`,
                              form.formState,
                            ).error?.message
                          }
                        </FormErrorMessage>
                      </FormControl>

                      <FormControl
                        isDisabled={!canEdit}
                        isInvalid={
                          !!form.getFieldState(
                            `phases.${index}.currencyAddress`,
                            form.formState,
                          ).error
                        }
                      >
                        <Heading
                          as={FormLabel}
                          size="label.md"
                          maxWidth={{ base: "50%", md: "100%" }}
                        >
                          What currency do you want to use?
                        </Heading>
                        <CurrencySelector
                          isDisabled={!canEdit}
                          value={field?.currencyAddress || NATIVE_TOKEN_ADDRESS}
                          onChange={(e) =>
                            form.setValue(
                              `phases.${index}.currencyAddress`,
                              e.target.value,
                            )
                          }
                        />
                        <FormErrorMessage>
                          {
                            form.getFieldState(
                              `phases.${index}.currencyAddress`,
                              form.formState,
                            ).error?.message
                          }
                        </FormErrorMessage>
                      </FormControl>
                    </Flex>

                    <FormControl
                      isDisabled={!canEdit}
                      isInvalid={
                        !!form.getFieldState(
                          `phases.${index}.snapshot`,
                          form.formState,
                        ).error
                      }
                    >
                      <Heading as={FormLabel} size="label.md">
                        Who can claim {nftsOrToken} during this phase?
                      </Heading>
                      <Flex direction={{ base: "column", md: "row" }} gap={4}>
                        <Select
                          isDisabled={!canEdit}
                          w={{ base: "100%", md: "50%" }}
                          value={dropType}
                          onChange={(e) => {
                            const val = e.currentTarget.value as
                              | "any"
                              | "specific"
                              | "overrides";

                            if (val === "any") {
                              form.setValue(
                                `phases.${index}.snapshot`,
                                undefined,
                              );
                            } else {
                              if (val === "specific" && !isClaimPhaseV1) {
                                form.setValue(
                                  `phases.${index}.maxClaimablePerWallet`,
                                  0,
                                );
                              }
                              if (
                                val === "overrides" &&
                                !isClaimPhaseV1 &&
                                field.maxClaimablePerWallet !== 1
                              ) {
                                form.setValue(
                                  `phases.${index}.maxClaimablePerWallet`,
                                  1,
                                );
                              }
                              form.setValue(`phases.${index}.snapshot`, []);
                              setOpenIndex(index);
                            }
                          }}
                        >
                          <option value="any">Any wallet</option>
                          {!isClaimPhaseV1 ? (
                            <option value="overrides">
                              Any wallet (with overrides)
                            </option>
                          ) : null}
                          <option value="specific">
                            Only specific wallets
                          </option>
                        </Select>
                        {/* snapshot below */}
                        {field.snapshot ? (
                          <Flex
                            w={{ base: "100%", md: "50%" }}
                            direction={{
                              base: "column",
                              md: isColumn ? "column" : "row",
                            }}
                            align="center"
                            gap={1.5}
                          >
                            <Button
                              colorScheme="purple"
                              borderRadius="md"
                              onClick={() => setOpenIndex(index)}
                              rightIcon={<Icon as={FiUpload} />}
                            >
                              {isAdmin ? "Edit" : "See"} Claimer Snapshot
                            </Button>

                            <Flex
                              gap={2}
                              direction="row"
                              align="center"
                              justify="center"
                              color={
                                field.snapshot?.length === 0
                                  ? "red.400"
                                  : "green.400"
                              }
                              _light={{
                                color:
                                  field.snapshot?.length === 0
                                    ? "red.500"
                                    : "green.500",
                              }}
                            >
                              <Icon as={BsCircleFill} boxSize={2} />
                              <Text size="body.sm" color="inherit">
                                <strong>
                                  {field.snapshot?.length} addresses
                                </strong>{" "}
                                in snapshot
                              </Text>
                            </Flex>
                          </Flex>
                        ) : (
                          <Box
                            w={{ base: "100%", md: "50%" }}
                            display={{ base: "none", md: "block" }}
                          />
                        )}
                      </Flex>
                      {isClaimPhaseV1 ? (
                        <FormHelperText>
                          Snapshot spots are one-time-use! Once a wallet has
                          claimed the drop, it cannot claim again, even if it
                          did not claim the entire amount assigned to it in the
                          snapshot.
                        </FormHelperText>
                      ) : (
                        <FormHelperText>
                          {dropType === "specific" ? (
                            <>
                              <b>Only</b> wallets on the <b>allowlist</b> can
                              claim.
                            </>
                          ) : dropType === "any" ? (
                            <>
                              <b>Anyone</b> can claim based on the rules defined
                              in this phase. (&quot;Public Mint&quot;)
                            </>
                          ) : (
                            <>
                              <b>Anyone</b> can claim based on the rules defined
                              in this phase.
                              <br />
                              <b>Wallets in the snapshot</b> can claim with
                              special rules defined in the snapshot.
                            </>
                          )}
                        </FormHelperText>
                      )}
                      <FormErrorMessage>
                        {
                          form.getFieldState(
                            `phases.${index}.snapshot`,
                            form.formState,
                          ).error?.message
                        }
                      </FormErrorMessage>
                    </FormControl>
                    <Flex
                      gap={4}
                      direction={{
                        base: "column",
                        md: isColumn ? "column" : "row",
                      }}
                    >
                      <FormControl
                        isDisabled={!canEdit}
                        isInvalid={
                          !!form.getFieldState(
                            `phases.${index}.maxClaimablePerWallet`,
                            form.formState,
                          ).error
                        }
                      >
                        <Heading as={FormLabel} size="label.md">
                          How many {nftsOrToken} can be claimed per{" "}
                          {isClaimPhaseV1 ? "transaction" : "wallet"}?
                        </Heading>
                        <QuantityInputWithUnlimited
                          isRequired
                          decimals={decimals}
                          isDisabled={
                            (!isClaimPhaseV1 && dropType === "specific") ||
                            !canEdit
                          }
                          value={
                            field?.maxClaimablePerWallet?.toString() || "0"
                          }
                          onChange={(value) =>
                            form.setValue(
                              `phases.${index}.maxClaimablePerWallet`,
                              value.toString(),
                            )
                          }
                        />
                        {!isClaimPhaseV1 && (
                          <FormHelperText>
                            This value applies for <strong>all</strong> wallets,
                            and can be overriden for specific wallets in the
                            snapshot.
                          </FormHelperText>
                        )}
                        <FormErrorMessage>
                          {
                            form.getFieldState(
                              `phases.${index}.maxClaimablePerWallet`,
                              form.formState,
                            ).error?.message
                          }
                        </FormErrorMessage>
                      </FormControl>
                      {isClaimPhaseV1 ? (
                        <FormControl
                          isDisabled={!canEdit}
                          isInvalid={
                            !!form.getFieldState(
                              `phases.${index}.waitInSeconds`,
                              form.formState,
                            ).error
                          }
                        >
                          <Heading as={FormLabel} size="label.md">
                            How many seconds do wallets have to wait in-between
                            claiming?
                          </Heading>
                          <BigNumberInput
                            isRequired
                            isDisabled={!canEdit}
                            value={field.waitInSeconds?.toString() || "0"}
                            onChange={(value) =>
                              form.setValue(
                                `phases.${index}.waitInSeconds`,
                                value.toString(),
                              )
                            }
                          />
                          <FormHelperText>
                            Set this to &quot;Unlimited&quot; to only allow one
                            claim transaction per wallet.
                          </FormHelperText>
                          <FormErrorMessage>
                            {
                              form.getFieldState(
                                `phases.${index}.waitInSeconds`,
                                form.formState,
                              ).error?.message
                            }
                          </FormErrorMessage>
                        </FormControl>
                      ) : (
                        <Box w="100%" display={{ base: "none", md: "block" }} />
                      )}
                    </Flex>
                  </Flex>
                </Card>
              </React.Fragment>
            );
          })}

          {watchFieldArray?.length === 0 && (
            <Alert status="warning" borderRadius="md">
              <AlertIcon />
              <Flex direction="column">
                <AlertTitle as={Heading} size="label.lg">
                  {isMultiPhase
                    ? "Missing Claim Phases"
                    : "Missing Claim Conditions"}
                </AlertTitle>
                <AlertDescription as={Text}>
                  {isMultiPhase
                    ? "While no Claim Phase is defined no-one will be able to claim this drop."
                    : "While no Claim Conditions are defined no-one will be able to claim this drop."}
                </AlertDescription>
              </Flex>
            </Alert>
          )}
          <AdminOnly contract={contract as ValidContractInstance}>
            {isMultiPhase ? (
              <Button
                colorScheme={watchFieldArray?.length > 0 ? "primary" : "purple"}
                variant={watchFieldArray?.length > 0 ? "outline" : "solid"}
                borderRadius="md"
                leftIcon={<Icon as={FiPlus} />}
                onClick={addPhase}
                isDisabled={mutation.isLoading}
              >
                Add {watchFieldArray?.length > 0 ? "Additional " : "Initial "}
                Claim Phase
              </Button>
            ) : (
              watchFieldArray?.length === 0 && (
                <Button
                  colorScheme="purple"
                  variant="solid"
                  borderRadius="md"
                  leftIcon={<Icon as={FiPlus} />}
                  onClick={addPhase}
                  isDisabled={mutation.isLoading}
                >
                  Add Claim Condition
                </Button>
              )
            )}
          </AdminOnly>
        </Flex>
        <AdminOnly
          contract={contract as ValidContractInstance}
          fallback={<Box pb={5} />}
        >
          <>
            <Divider />
            <TransactionButton
              colorScheme="primary"
              transactionCount={1}
              isDisabled={query.isLoading}
              type="submit"
              isLoading={mutation.isLoading}
              loadingText="Saving..."
              size="md"
              borderRadius="xl"
              borderTopLeftRadius="0"
              borderTopRightRadius="0"
            >
              Save Claim Phases
            </TransactionButton>
          </>
        </AdminOnly>
      </Flex>
    </>
  );
};
