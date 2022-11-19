import { ProgramCurrencySelector } from "./program-currency-selector";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Divider,
  Flex,
  FormControl,
  Icon,
  Input,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import {
  useClaimConditions,
  useProgram,
  useSetClaimConditions,
} from "@thirdweb-dev/react/solana";
import { NFTDropUpdateableConditionsInputSchema } from "@thirdweb-dev/sdk/solana";
import { TransactionButton } from "components/buttons/TransactionButton";
import { BasisPointsInput } from "components/inputs/BasisPointsInput";
import {
  PriceInput,
  QuantityInputWithUnlimited,
} from "contract-ui/tabs/claim-conditions/components/claim-conditions";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { FiPlus } from "react-icons/fi";
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
import { z } from "zod";

export const ProgramClaimConditionsTab: React.FC<{ address: string }> = ({
  address,
}) => {
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
                Control when the NFTs get dropped, how much they cost, and more.
              </Text>
            </Flex>
          </Flex>
          <Divider />
          <ClaimConditionsProgramForm address={address} />
        </Flex>
      </Card>
    </Stack>
  );
};

const ClaimConditionsProgramForm: React.FC<{ address: string }> = ({
  address,
}) => {
  const trackEvent = useTrack();
  const program = useProgram(address, "nft-drop");
  const query = useClaimConditions(program.data);
  const mutation = useSetClaimConditions(program.data);
  const [seeForm, setSeeForm] = useState(query.data?.maxClaimable !== "0");

  const transformedQueryData = useMemo(() => {
    const data = query.data;

    if (!data) {
      return undefined;
    }
    return {
      startTime: data.startTime ? new Date(data.startTime) : new Date(),
      price: data.price.displayValue,
      currencyAddress: data.currencyAddress || "SOLANA_NATIVE_TOKEN",
      primarySaleRecipient: data.primarySaleRecipient,
      sellerFeeBasisPoints: data.sellerFeeBasisPoints,
      maxClaimable: data.maxClaimable,
    };
  }, [query.data]);

  const {
    register,
    setValue,
    getFieldState,
    formState,
    watch,
    handleSubmit,
    reset,
  } = useForm<z.input<typeof NFTDropUpdateableConditionsInputSchema>>({
    defaultValues: transformedQueryData,
  });

  useEffect(() => {
    if (query.data && !formState.isDirty) {
      reset(transformedQueryData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data, formState.isDirty]);

  const { onSuccess, onError } = useTxNotifications(
    "Saved claim conditions",
    "Failed to save claim conditions",
  );

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
        onSubmit={handleSubmit(async (d) => {
          trackEvent({
            category: "nft",
            action: "set-claim-conditions",
            label: "attempt",
          });
          try {
            await mutation.mutateAsync({
              primarySaleRecipient: d.primarySaleRecipient,
              sellerFeeBasisPoints: d.sellerFeeBasisPoints,
              startTime: d.startTime,
              maxClaimable: d.maxClaimable,
              price: d.price,
              currencyAddress:
                d.currencyAddress === "SOLANA_NATIVE_TOKEN"
                  ? null
                  : d.currencyAddress,
            });
            trackEvent({
              category: "nft",
              action: "set-claim-conditions",
              label: "success",
            });
            onSuccess();
          } catch (error) {
            trackEvent({
              category: "nft",
              action: "set-claim-conditions",
              label: "error",
            });
            onError(error);
          }
        })}
        direction="column"
        as="form"
        gap={10}
      >
        <Flex direction={"column"} gap={4} px={{ base: 6, md: 10 }}>
          {seeForm ? (
            <Card position="relative">
              <Flex direction="column" gap={8}>
                <Flex
                  direction={{
                    base: "column",
                    md: "row",
                  }}
                  gap={4}
                >
                  <FormControl
                    isInvalid={!!getFieldState(`startTime`, formState).error}
                  >
                    <Heading as={FormLabel} size="label.md">
                      When will this drop start?
                    </Heading>
                    <Input
                      type="datetime-local"
                      value={toDateTimeLocal(watch("startTime"))}
                      onChange={(e) =>
                        setValue(`startTime`, new Date(e.target.value))
                      }
                    />
                    <FormErrorMessage>
                      {getFieldState(`startTime`, formState).error?.message}
                    </FormErrorMessage>
                    <FormHelperText>
                      This time is in your local timezone.
                    </FormHelperText>
                  </FormControl>
                  <FormControl
                    isInvalid={!!getFieldState(`maxClaimable`, formState).error}
                  >
                    <Heading as={FormLabel} size="label.md">
                      How many total NFTs can be claimed?
                    </Heading>

                    <QuantityInputWithUnlimited
                      isRequired
                      decimals={9}
                      value={watch("maxClaimable")?.toString() || "0"}
                      onChange={(value) =>
                        setValue(`maxClaimable`, value.toString())
                      }
                    />

                    <FormErrorMessage>
                      {getFieldState(`maxClaimable`, formState).error?.message}
                    </FormErrorMessage>
                    <FormHelperText>
                      This number includes NFTs that have already been claimed.
                    </FormHelperText>
                  </FormControl>
                </Flex>

                <Flex
                  direction={{
                    base: "column",
                    md: "row",
                  }}
                  gap={4}
                >
                  <FormControl
                    isInvalid={!!getFieldState(`price`, formState).error}
                  >
                    <Heading as={FormLabel} size="label.md">
                      How much do you want to charge to claim each NFT?
                    </Heading>
                    <PriceInput
                      value={parseFloat(watch("price")?.toString() || "0")}
                      onChange={(val) => setValue(`price`, val)}
                    />
                    <FormErrorMessage>
                      {getFieldState(`price`, formState).error?.message}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl
                    isInvalid={
                      !!getFieldState(`currencyAddress`, formState).error
                    }
                  >
                    <Heading
                      as={FormLabel}
                      size="label.md"
                      maxWidth={{ base: "50%", md: "100%" }}
                    >
                      What currency do you want to use?
                    </Heading>
                    <ProgramCurrencySelector
                      value={watch("currencyAddress") || "SOLANA_NATIVE_TOKEN"}
                      onChange={(e) =>
                        setValue(`currencyAddress`, e.target.value)
                      }
                      activeCurrency={
                        transformedQueryData?.currencyAddress !==
                        "SOLANA_NATIVE_TOKEN"
                          ? transformedQueryData?.currencyAddress
                          : undefined
                      }
                    />
                    {/*                     <CurrencySelector
                      // TODO get native_token_address
                                                value={currencyAddress || NATIVE_TOKEN_ADDRESS}
                      value={watch("currencyAddress") || ""}
                      onChange={(e) =>
                        setValue(`currencyAddress`, e.target.value)
                      }
                    /> */}
                    <FormErrorMessage>
                      {
                        getFieldState(`currencyAddress`, formState).error
                          ?.message
                      }
                    </FormErrorMessage>
                  </FormControl>
                </Flex>

                <Flex
                  gap={4}
                  direction={{
                    base: "column",
                    md: "row",
                  }}
                >
                  <FormControl
                    isInvalid={
                      !!getFieldState(`primarySaleRecipient`, formState).error
                    }
                  >
                    <Heading as={FormLabel} size="label.md">
                      Primary Sales
                    </Heading>
                    <Input
                      variant="filled"
                      {...register("primarySaleRecipient")}
                    />
                    <FormHelperText>
                      Determine the address that should receive the revenue from
                      initial sales of the assets.
                    </FormHelperText>
                    <FormErrorMessage>
                      {
                        getFieldState("primarySaleRecipient", formState).error
                          ?.message
                      }
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl
                    isInvalid={
                      !!getFieldState(`sellerFeeBasisPoints`, formState).error
                    }
                  >
                    <Heading as={FormLabel} size="label.md">
                      Royalties
                    </Heading>
                    <BasisPointsInput
                      variant="filled"
                      value={watch("sellerFeeBasisPoints")}
                      onChange={(value) =>
                        setValue("sellerFeeBasisPoints", value, {
                          shouldTouch: true,
                        })
                      }
                    />
                    <FormHelperText>
                      Determine the address that should receive the revenue from
                      royalties earned from secondary sales of the assets.
                    </FormHelperText>
                    <FormErrorMessage>
                      {
                        getFieldState("sellerFeeBasisPoints", formState).error
                          ?.message
                      }
                    </FormErrorMessage>
                  </FormControl>
                </Flex>
              </Flex>
            </Card>
          ) : (
            <>
              <Alert status="warning" borderRadius="md">
                <AlertIcon />
                <Flex direction="column">
                  <AlertTitle>No claim conditions set.</AlertTitle>
                  <AlertDescription>
                    Without claim conditions no-one will be able to claim this
                    drop.
                  </AlertDescription>
                </Flex>
              </Alert>

              <Button
                colorScheme="purple"
                variant="solid"
                borderRadius="md"
                leftIcon={<Icon as={FiPlus} />}
                onClick={() => setSeeForm(true)}
                isDisabled={mutation.isLoading}
              >
                Add Claim Conditions
              </Button>
            </>
          )}
        </Flex>

        <Divider />
        <TransactionButton
          ecosystem="solana"
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
          Save Claim Conditions
        </TransactionButton>
      </Flex>
    </>
  );
};
