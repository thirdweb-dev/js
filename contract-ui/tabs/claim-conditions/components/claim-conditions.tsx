import { AdminOnly, useIsAdmin } from "@3rdweb-sdk/react";
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
  InputGroup,
  InputProps,
  InputRightElement,
  Select,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import {
  NFTContract,
  useClaimConditions,
  useContract,
  useContractType,
  useResetClaimConditions,
  useSetClaimConditions,
} from "@thirdweb-dev/react";
import {
  ClaimConditionInput,
  ClaimConditionInputArray,
  Erc20,
  Erc1155,
  NATIVE_TOKEN_ADDRESS,
  ValidContractInstance,
} from "@thirdweb-dev/sdk";
import { TransactionButton } from "components/buttons/TransactionButton";
import { BigNumberInput } from "components/shared/BigNumberInput";
import { CurrencySelector } from "components/shared/CurrencySelector";
import { SnapshotUpload } from "contract-ui/tabs/claim-conditions/components/snapshot-upload";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import React, { useEffect, useMemo, useState } from "react";
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

interface ClaimConditionsProps {
  contract?: NFTContract;
  tokenId?: string;
  isColumn?: true;
}
export const ClaimConditions: React.FC<ClaimConditionsProps> = ({
  contract,
  tokenId,
  isColumn,
}) => {
  const trackEvent = useTrack();
  const resetClaimConditions = useResetClaimConditions(
    contract as Erc1155,
    tokenId,
  );
  const { onSuccess, onError } = useTxNotifications(
    "Succesfully reset claim eligibility",
    "Failed to reset claim eligibility",
  );

  const { contract: actualContract } = useContract(contract?.getAddress());

  const nftsOrToken = contract instanceof Erc20 ? "tokens" : "NFTs";

  return (
    <Stack spacing={8}>
      <Card p={0} position="relative">
        <Flex pt={{ base: 6, md: 10 }} direction="column" gap={8}>
          <Flex
            px={{ base: 6, md: 10 }}
            as="section"
            direction="column"
            gap={4}
          >
            <Flex direction="column">
              <Heading size="title.md">Set Claim Conditions</Heading>
              <Text size="body.md" fontStyle="italic">
                Control when the {nftsOrToken} get dropped, how much they cost,
                and more.
              </Text>
            </Flex>
          </Flex>
          <Divider />
          <ClaimConditionsForm
            contract={contract}
            tokenId={tokenId}
            isColumn={isColumn}
          />
        </Flex>
      </Card>
      <AdminOnly contract={actualContract as unknown as ValidContractInstance}>
        <Card p={0} position="relative">
          <Flex pt={{ base: 6, md: 10 }} direction="column" gap={8}>
            <Flex
              px={{ base: 6, md: 10 }}
              as="section"
              direction="column"
              gap={4}
            >
              <Flex direction="column">
                <Heading size="title.md">Claim Eligibility</Heading>
                <Text size="body.md" fontStyle="italic">
                  This contracts claim eligibility stores who has already
                  claimed {nftsOrToken} from this contract and carries across
                  claim phases. Resetting claim eligibility will reset this
                  state permanently, and people who have already claimed to
                  their limit will be able to claim again.
                </Text>
              </Flex>
            </Flex>

            <AdminOnly
              contract={actualContract as unknown as ValidContractInstance}
              fallback={<Box pb={5} />}
            >
              <TransactionButton
                colorScheme="primary"
                transactionCount={1}
                type="submit"
                isLoading={resetClaimConditions.isLoading}
                onClick={() => {
                  trackEvent({
                    category: contract instanceof Erc20 ? "token" : "nft",
                    action: "reset-claim-conditions",
                    label: "attempt",
                  });
                  resetClaimConditions.mutate(undefined, {
                    onSuccess: () => {
                      trackEvent({
                        category: contract instanceof Erc20 ? "token" : "nft",
                        action: "reset-claim-conditions",
                        label: "success",
                      });
                      onSuccess();
                    },
                    onError: (error) => {
                      trackEvent({
                        category: contract instanceof Erc20 ? "token" : "nft",
                        action: "reset-claim-conditions",
                        label: "error",
                        error,
                      });
                      onError(error);
                    },
                  });
                }}
                loadingText="Resetting..."
                size="md"
                borderRadius="xl"
                borderTopLeftRadius="0"
                borderTopRightRadius="0"
              >
                Reset Claim Eligibility
              </TransactionButton>
            </AdminOnly>
          </Flex>
        </Card>
      </AdminOnly>
    </Stack>
  );
};

const DEFAULT_PHASE = {
  startTime: new Date(),
  maxQuantity: "unlimited",
  quantityLimitPerTransaction: "unlimited",
  waitInSeconds: "0",
  price: 0,
  currencyAddress: NATIVE_TOKEN_ADDRESS,
  snapshot: undefined,
  merkleRootHash: undefined,
};
const ClaimConditionsSchema = z.object({
  phases: ClaimConditionInputArray,
});
const ClaimConditionsForm: React.FC<ClaimConditionsProps> = ({
  contract,
  tokenId,
  isColumn,
}) => {
  const trackEvent = useTrack();
  const [resetFlag, setResetFlag] = useState(false);
  const isAdmin = useIsAdmin(contract as ValidContractInstance);

  // We're setting it as Erc1155 so TypeScript doesn't complain that we don't have a tokenId.
  const query = useClaimConditions(contract as Erc1155, tokenId);
  const mutation = useSetClaimConditions(contract as Erc1155, tokenId);
  /*   const decimals = useDecimals(contract); */
  const decimals = 0;

  const transformedQueryData = useMemo(() => {
    return (query.data || [])
      .map((phase) => ({
        ...phase,
        price: Number(phase.currencyMetadata.displayValue),
        maxQuantity: phase.maxQuantity.toString(),
        currencyMetadata: {
          ...phase.currencyMetadata,
          value: phase.currencyMetadata.value.toString(),
        },
        currencyAddress: phase.currencyAddress.toLowerCase(),
        quantityLimitPerTransaction:
          phase.quantityLimitPerTransaction.toString(),
        waitInSeconds: phase.waitInSeconds.toString(),
        startTime: new Date(phase.startTime),
        snapshot: phase.snapshot?.map(({ address, maxClaimable }) => ({
          address,
          maxClaimable: maxClaimable || "0",
        })),
      }))
      .filter((phase) => phase.maxQuantity !== "0");
  }, [query.data]);

  const nftsOrToken = contract instanceof Erc20 ? "tokens" : "NFTs";

  const form = useForm<z.input<typeof ClaimConditionsSchema>>({
    defaultValues: query.data
      ? {
          phases: transformedQueryData,
        }
      : undefined,
  });

  const [openIndex, setOpenIndex] = useState<number>(-1);

  const { append, remove, fields } = useFieldArray({
    control: form.control,
    name: "phases",
  });

  useEffect(() => {
    if (
      query.data?.length &&
      !form.formState.isDirty &&
      !form.getValues("phases")?.length
    ) {
      form.reset({
        phases: transformedQueryData,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data, form.formState.isDirty]);

  const addPhase = () => {
    append(DEFAULT_PHASE);
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

  const { data: contractType } = useContractType(contract?.getAddress());
  const isMultiPhase = useMemo(
    () =>
      contractType === "nft-drop" ||
      contractType === "edition-drop" ||
      contractType === "token-drop",
    [contractType],
  );

  const { contract: actualContract } = useContract(contract?.getAddress());
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
        onSubmit={form.handleSubmit((d) => {
          trackEvent({
            category: contract instanceof Erc20 ? "token" : "nft",
            action: "set-claim-conditions",
            label: "attempt",
          });
          mutation
            .mutateAsync(
              { phases: d.phases as ClaimConditionInput[], reset: resetFlag },
              {
                onSuccess: (_data, variables) => {
                  trackEvent({
                    category: contract instanceof Erc20 ? "token" : "nft",
                    action: "set-claim-conditions",
                    label: "success",
                  });
                  form.reset({ phases: variables.phases });
                  onSuccess();
                },
                onError: (error) => {
                  trackEvent({
                    category: contract instanceof Erc20 ? "token" : "nft",
                    action: "set-claim-conditions",
                    label: "attempt",
                  });
                  onError(error);
                },
              },
            )
            .catch((error) => {
              if (error instanceof ZodError) {
                error.errors.forEach((e) => {
                  const path = `phases.${e.path.join(".")}`;
                  form.setError(path as any, e);
                });
              } else {
                onError(error);
              }
            });
        })}
        direction="column"
        as="form"
        gap={10}
      >
        <Flex direction={"column"} gap={4} px={{ base: 6, md: 10 }}>
          {controlledFields.map((field, index) => {
            return (
              <React.Fragment key={`snapshot_${field.id}_${index}`}>
                <SnapshotUpload
                  isOpen={openIndex === index}
                  onClose={() => setOpenIndex(-1)}
                  value={field.snapshot?.map((v) =>
                    typeof v === "string"
                      ? { address: v, maxClaimable: "0" }
                      : {
                          ...v,
                          maxClaimable: v?.maxClaimable?.toString() || "0",
                        },
                  )}
                  setSnapshot={(snapshot) =>
                    form.setValue(`phases.${index}.snapshot`, snapshot)
                  }
                />
                <Card position="relative">
                  <AdminOnly
                    contract={
                      actualContract as unknown as ValidContractInstance
                    }
                  >
                    <IconButton
                      variant="ghost"
                      aria-label="Delete Claim Phase"
                      colorScheme="red"
                      icon={<Icon as={FiTrash} />}
                      top="16px"
                      right="16px"
                      position="absolute"
                      isDisabled={mutation.isLoading}
                      onClick={() => {
                        removePhase(index);
                        if (!isMultiPhase) {
                          setResetFlag(true);
                        }
                      }}
                    />
                  </AdminOnly>

                  <Flex direction="column" gap={8}>
                    <Heading size="label.lg">Phase {index + 1}</Heading>

                    <Flex
                      direction={{
                        base: "column",
                        md: isColumn ? "column" : "row",
                      }}
                      gap={4}
                    >
                      <FormControl
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
                        isInvalid={
                          !!form.getFieldState(
                            `phases.${index}.maxQuantity`,
                            form.formState,
                          ).error
                        }
                      >
                        <Heading as={FormLabel} size="label.md">
                          How many {nftsOrToken} will you drop in this phase?
                        </Heading>

                        <QuantityInputWithUnlimited
                          isRequired
                          decimals={decimals}
                          value={field.maxQuantity?.toString() || "0"}
                          onChange={(value) =>
                            form.setValue(
                              `phases.${index}.maxQuantity`,
                              value.toString(),
                            )
                          }
                        />

                        <FormErrorMessage>
                          {
                            form.getFieldState(
                              `phases.${index}.maxQuantity`,
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
                        isInvalid={
                          !!form.getFieldState(
                            `phases.${index}.price`,
                            form.formState,
                          ).error
                        }
                      >
                        <Heading as={FormLabel} size="label.md">
                          How much do you want to charge to claim each{" "}
                          {contract instanceof Erc20 ? "token" : "NFT"}?
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
                          w={{ base: "100%", md: "50%" }}
                          value={
                            Array.isArray(field.snapshot) ? "specific" : "any"
                          }
                          onChange={(e) => {
                            const val = e.currentTarget.value;
                            if (val === "any") {
                              form.setValue(
                                `phases.${index}.snapshot`,
                                undefined,
                              );
                            } else {
                              form.setValue(`phases.${index}.snapshot`, []);
                              setOpenIndex(index);
                            }
                          }}
                        >
                          <option value="any">Any wallet</option>
                          <option value="specific">
                            Only specific wallets
                          </option>
                        </Select>
                        {/* snapshot below */}
                        {field.snapshot && (
                          <Flex
                            w={{ base: "100%", md: "50%" }}
                            direction={{
                              base: "column",
                              md: isColumn ? "column" : "row",
                            }}
                            align="center"
                            gap={4}
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
                                  ? "orange.500"
                                  : "green.500"
                              }
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
                        )}
                      </Flex>
                      <FormHelperText>
                        Snapshot spots are one-time-use! Once a wallet has
                        claimed the drop, it cannot claim again, even if it did
                        not claim the entire amount assigned to it in the
                        snapshot.
                      </FormHelperText>
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
                        isInvalid={
                          !!form.getFieldState(
                            `phases.${index}.quantityLimitPerTransaction`,
                            form.formState,
                          ).error
                        }
                      >
                        <Heading as={FormLabel} size="label.md">
                          How many {nftsOrToken} can be claimed per transaction?
                        </Heading>
                        <QuantityInputWithUnlimited
                          isRequired
                          decimals={decimals}
                          value={
                            field?.quantityLimitPerTransaction?.toString() ||
                            "0"
                          }
                          onChange={(value) =>
                            form.setValue(
                              `phases.${index}.quantityLimitPerTransaction`,
                              value.toString(),
                            )
                          }
                        />
                        <FormErrorMessage>
                          {
                            form.getFieldState(
                              `phases.${index}.quantityLimitPerTransaction`,
                              form.formState,
                            ).error?.message
                          }
                        </FormErrorMessage>
                      </FormControl>
                      <FormControl
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
                <AlertTitle>No claim phases set.</AlertTitle>
                <AlertDescription>
                  Without a claim phase no-one will be able to claim this drop.
                </AlertDescription>
              </Flex>
            </Alert>
          )}
          <AdminOnly
            contract={actualContract as unknown as ValidContractInstance}
          >
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
                  Add Claim Phase
                </Button>
              )
            )}
          </AdminOnly>
        </Flex>
        <AdminOnly
          contract={actualContract as unknown as ValidContractInstance}
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

interface PriceInputProps
  extends Omit<InputProps, "onChange" | "value" | "onBlur" | "max" | "min"> {
  value: number;
  onChange: (value: number) => void;
}

export const PriceInput: React.FC<PriceInputProps> = ({
  value = 0,
  onChange,
  ...restInputProps
}) => {
  const [stringValue, setStringValue] = useState<string>(
    isNaN(value) ? "0" : value.toString(),
  );

  useEffect(() => {
    if (value !== undefined) {
      setStringValue(value.toString());
    }
  }, [value]);
  useEffect(() => {
    const parsed = parseFloat(stringValue);
    if (!isNaN(parsed)) {
      onChange(parsed);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stringValue]);

  return (
    <InputGroup {...restInputProps}>
      <Input
        value={stringValue}
        onChange={(e) => setStringValue(e.target.value)}
        onBlur={() => {
          if (!isNaN(value)) {
            setStringValue(value.toString());
          } else {
            setStringValue("0");
          }
        }}
      />
    </InputGroup>
  );
};

interface QuantityInputWithUnlimitedProps
  extends Omit<InputProps, "onChange" | "value" | "onBlur" | "max" | "min"> {
  value: string;
  onChange: (value: string) => void;
  hideMaxButton?: true;
  decimals?: number;
}

export const QuantityInputWithUnlimited: React.FC<
  QuantityInputWithUnlimitedProps
> = ({
  value = "0",
  onChange,
  hideMaxButton,
  isDisabled,
  decimals,
  ...restInputProps
}) => {
  const [stringValue, setStringValue] = useState<string>(
    isNaN(Number(value)) ? "0" : value.toString(),
  );

  useEffect(() => {
    if (value !== undefined) {
      setStringValue(value.toString());
    }
  }, [value]);

  const updateValue = (_value: string) => {
    if (_value === "") {
      onChange(_value);
      setStringValue(_value);
      return;
    }

    setStringValue(_value);
    onChange(_value);
  };

  return (
    <InputGroup {...restInputProps} isDisabled={decimals === undefined}>
      <Input
        value={stringValue === "unlimited" ? "Unlimited" : stringValue}
        onChange={(e) => updateValue(e.currentTarget.value)}
        onBlur={() => {
          if (value === "unlimited") {
            setStringValue("unlimited");
          } else if (!isNaN(Number(value))) {
            setStringValue(Number(Number(value).toFixed(decimals)).toString());
          } else {
            setStringValue("0");
          }
        }}
      />
      {hideMaxButton ? null : (
        <InputRightElement w="auto">
          <Button
            isDisabled={isDisabled}
            colorScheme="primary"
            variant="ghost"
            size="sm"
            mr={1}
            onClick={() => {
              updateValue("unlimited");
            }}
          >
            Unlimited
          </Button>
        </InputRightElement>
      )}
    </InputGroup>
  );
};
