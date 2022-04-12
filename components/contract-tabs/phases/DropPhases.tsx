import { SnapshotUpload } from "../settings/shared/SnapshotUpload";
import { AdminOnly } from "@3rdweb-sdk/react";
import {
  useClaimPhases,
  useClaimPhasesMutation,
  useResetEligibilityMutation,
} from "@3rdweb-sdk/react/hooks/useClaimPhases";
import {
  Box,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputProps,
  Select,
  Spinner,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { MaxUint256 } from "@ethersproject/constants";
import {
  ClaimConditionInput,
  ClaimConditionInputArray,
  EditionDrop,
  NATIVE_TOKEN_ADDRESS,
  NFTDrop,
} from "@thirdweb-dev/sdk";
import { Button } from "components/buttons/Button";
import { TransactionButton } from "components/buttons/TransactionButton";
import { Card } from "components/layout/Card";
import { BigNumberInput } from "components/shared/BigNumberInput";
import { CurrencySelector } from "components/shared/CurrencySelector";
import { useTxNotifications } from "hooks/useTxNotifications";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { BsCircleFill } from "react-icons/bs";
import { FiPlus, FiTrash, FiUpload } from "react-icons/fi";
import { toDateTimeLocal } from "utils/date-utils";
import { parseErrorToMessage } from "utils/errorParser";
import * as z from "zod";
import { ZodError } from "zod";

interface DropPhases {
  contract?: NFTDrop | EditionDrop;
  tokenId?: string;
}

export const DropPhases: React.FC<DropPhases> = ({ contract, tokenId }) => {
  const mutation = useResetEligibilityMutation(contract, tokenId);
  const txNotifications = useTxNotifications(
    "Succesfully reset claim eligibility",
    "Failed to reset claim eligibility",
  );

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
              <Heading size="title.md">Claim Phases</Heading>
              <Text size="body.md" fontStyle="italic">
                Add different phases to control when you drop your NFTs, how
                much they cost, and more.
              </Text>
            </Flex>
          </Flex>
          <Divider />
          <DropPhasesForm contract={contract} tokenId={tokenId} />
        </Flex>
      </Card>
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
                This contracts claim eligibility stores who has already claimed
                NFTs from this contract and carries across claim phases.
                Resetting claim eligibility will reset this state permanently,
                and people who have already claimed to their limit will be able
                to claim again.
              </Text>
            </Flex>
          </Flex>

          <AdminOnly contract={contract} fallback={<Box pb={5} />}>
            <TransactionButton
              colorScheme="primary"
              transactionCount={1}
              type="submit"
              isLoading={mutation.isLoading}
              onClick={() => {
                mutation.mutate(undefined, txNotifications);
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
    </Stack>
  );
};

const DropPhasesSchema = z.object({
  phases: ClaimConditionInputArray,
});
const DropPhasesForm: React.FC<DropPhases> = ({ contract, tokenId }) => {
  const query = useClaimPhases(contract, tokenId);
  const mutation = useClaimPhasesMutation(contract, tokenId);

  const form = useForm<z.input<typeof DropPhasesSchema>>({
    defaultValues: query.data
      ? {
          phases: query.data.map((phase) => ({
            ...phase,
            price: phase.currencyMetadata.displayValue,
            maxQuantity: phase.maxQuantity.toString(),
            quantityLimitPerTransaction:
              phase.quantityLimitPerTransaction.toString(),
            waitInSeconds: phase.waitInSeconds.toString(),
            startTime: new Date(phase.startTime),
          })),
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
      !form.getValues("phases").length
    ) {
      form.reset({
        phases: query.data.map((phase) => ({
          ...phase,
          price: phase.currencyMetadata.displayValue,
          maxQuantity: phase.maxQuantity.toString(),
          quantityLimitPerTransaction:
            phase.quantityLimitPerTransaction.toString(),
          waitInSeconds: phase.waitInSeconds.toString(),
          startTime: new Date(phase.startTime),
        })),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data, form.formState.isDirty]);
  const addPhase = () => {
    append({
      startTime: new Date(),
      maxQuantity: MaxUint256.toString(),
      quantityLimitPerTransaction: MaxUint256.toString(),
      waitInSeconds: "0",
      price: 0,
      currencyAddress: NATIVE_TOKEN_ADDRESS,
      snapshot: undefined,
      merkleRootHash: undefined,
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

  const toast = useToast();

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
        onSubmit={form.handleSubmit((d) =>
          mutation
            .mutateAsync(d.phases as ClaimConditionInput[], {
              onSuccess: (_data, variables) => {
                form.reset({ phases: variables });
                toast({
                  title: "Success",
                  description: "Saved claim phases",
                  status: "success",
                  duration: 5000,
                  isClosable: true,
                });
              },
            })
            .catch((error) => {
              if (error instanceof ZodError) {
                error.errors.forEach((e) => {
                  const path = `phases.${e.path.join(".")}`;
                  form.setError(path as any, e);
                });
              } else {
                toast({
                  title: "Error saving claim phases",
                  description: parseErrorToMessage(error),
                  status: "error",
                  duration: 9000,
                  isClosable: true,
                });
              }
            }),
        )}
        direction="column"
        as="form"
        gap={10}
      >
        <Flex direction={"column"} gap={4} px={{ base: 6, md: 10 }}>
          {controlledFields.map((field, index) => {
            return (
              <React.Fragment key={`snapshot_${field.id}`}>
                <SnapshotUpload
                  isOpen={openIndex === index}
                  onClose={() => setOpenIndex(-1)}
                  value={field.snapshot?.map((v) =>
                    typeof v === "string"
                      ? { address: v, maxClaimable: "0" }
                      : { ...v, maxClaimable: "0" },
                  )}
                  setAddresses={(addresses) =>
                    form.setValue(`phases.${index}.snapshot`, addresses)
                  }
                />
                <Card position="relative">
                  <Icon
                    color="red.500"
                    as={FiTrash}
                    boxSize={5}
                    top="16px"
                    right="16px"
                    position="absolute"
                    cursor="pointer"
                    _hover={{ color: "red.400" }}
                    onClick={() => removePhase(index)}
                  />

                  <Flex direction="column" gap={8}>
                    <Heading size="label.lg">Phase {index + 1}</Heading>

                    <Flex direction={{ base: "column", md: "row" }} gap={4}>
                      <FormControl
                        isInvalid={
                          form.getFieldState(
                            `phases.${index}.startTime`,
                            form.formState,
                          ).invalid
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
                          This time is in your timezone.
                        </FormHelperText>
                      </FormControl>

                      <FormControl
                        isInvalid={
                          form.getFieldState(
                            `phases.${index}.maxQuantity`,
                            form.formState,
                          ).invalid
                        }
                      >
                        <Heading as={FormLabel} size="label.md">
                          How many NFTs will you drop in this phase?
                        </Heading>

                        <BigNumberInput
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

                    <Flex direction={{ base: "column", md: "row" }} gap={4}>
                      <FormControl
                        isInvalid={
                          form.getFieldState(
                            `phases.${index}.price`,
                            form.formState,
                          ).invalid
                        }
                      >
                        <Heading as={FormLabel} size="label.md">
                          How much do you want to charge to claim the NFTs?
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
                          form.getFieldState(
                            `phases.${index}.currencyAddress`,
                            form.formState,
                          ).invalid
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
                        form.getFieldState(
                          `phases.${index}.snapshot`,
                          form.formState,
                        ).invalid
                      }
                    >
                      <Heading as={FormLabel} size="label.md">
                        Who can claim NFTs during this phase?
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
                            direction="row"
                            align="center"
                            gap={4}
                          >
                            <Button
                              colorScheme="purple"
                              borderRadius="md"
                              onClick={() => setOpenIndex(index)}
                              rightIcon={<Icon as={FiUpload} />}
                            >
                              Edit Claimer Snapshot
                            </Button>

                            <Flex
                              gap={2}
                              direction="row"
                              align="center"
                              justify="center"
                              color={
                                field.snapshot.length === 0
                                  ? "orange.500"
                                  : "green.500"
                              }
                            >
                              <Icon as={BsCircleFill} boxSize={2} />
                              <Text size="body.sm" color="inherit">
                                <strong>
                                  {field.snapshot.length} addresses
                                </strong>{" "}
                                in snapshot
                              </Text>
                            </Flex>
                          </Flex>
                        )}
                      </Flex>
                      <FormErrorMessage>
                        {
                          form.getFieldState(
                            `phases.${index}.snapshot`,
                            form.formState,
                          ).error?.message
                        }
                      </FormErrorMessage>
                    </FormControl>
                    <Flex gap={4} direction={{ base: "column", md: "row" }}>
                      <FormControl
                        isInvalid={
                          form.getFieldState(
                            `phases.${index}.quantityLimitPerTransaction`,
                            form.formState,
                          ).invalid
                        }
                      >
                        <Heading as={FormLabel} size="label.md">
                          How many NFTs can be claimed per transaction?
                        </Heading>
                        <BigNumberInput
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
                          form.getFieldState(
                            `phases.${index}.waitInSeconds`,
                            form.formState,
                          ).invalid
                        }
                      >
                        <Heading as={FormLabel} size="label.md">
                          How many seconds do wallets have to wait in-between
                          claiming?
                        </Heading>
                        <BigNumberInput
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

          <Button
            colorScheme="primary"
            variant="outline"
            borderRadius="md"
            leftIcon={<Icon as={FiPlus} />}
            onClick={addPhase}
          >
            Add Phase
          </Button>
        </Flex>
        <AdminOnly contract={contract} fallback={<Box pb={5} />}>
          <>
            <Divider />
            <TransactionButton
              colorScheme="primary"
              transactionCount={1}
              isDisabled={
                query.isLoading ||
                form.getFieldState("phases", form.formState).isTouched
              }
              type="submit"
              isLoading={mutation.isLoading}
              loadingText="Saving..."
              size="md"
              borderRadius="xl"
              borderTopLeftRadius="0"
              borderTopRightRadius="0"
            >
              Update Claim Phases
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
