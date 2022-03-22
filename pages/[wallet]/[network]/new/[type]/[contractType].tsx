import { useActiveChainId, useDeploy, useWeb3 } from "@3rdweb-sdk/react";
import {
  AspectRatio,
  Box,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  IconButton,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  SimpleGrid,
  Text,
  Textarea,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { AddressZero } from "@ethersproject/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CONTRACTS_MAP,
  ContractType,
  ValidContractClass,
} from "@thirdweb-dev/sdk";
import { ChakraNextImage } from "components/Image";
import { AppLayout } from "components/app-layouts/app";
import { TransactionButton } from "components/buttons/TransactionButton";
import { RecipientForm } from "components/deployment/splits/recipients";
import { BasisPointsInput } from "components/inputs/BasisPointsInput";
import { Card } from "components/layout/Card";
import { FileInput } from "components/shared/FileInput";
import {
  CONTRACT_TYPE_NAME_MAP,
  FeatureIconMap,
  TYPE_CONTRACT_MAP,
  UrlMap,
} from "constants/mappings";
import { BigNumber } from "ethers";
import { isAddress } from "ethers/lib/utils";
import { useImageFileOrUrl } from "hooks/useImageFileOrUrl";
import { useSingleQueryParam } from "hooks/useQueryParam";
import { useRouter } from "next/router";
import { ConsolePage } from "pages/_app";
import React, { useEffect, useMemo } from "react";
import {
  FieldPath,
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { FiChevronLeft } from "react-icons/fi";
import { parseErrorToMessage } from "utils/errorParser";
import { NetworkToBlockTimeMap } from "utils/network";
import { z } from "zod";

const DeployContractContract: ConsolePage = () => {
  const router = useRouter();
  const contractType = useSingleQueryParam("contractType") as
    | ContractType
    | undefined;
  const contract = CONTRACTS_MAP[contractType as keyof typeof CONTRACTS_MAP];

  return (
    <Card p={0}>
      <Flex direction="column" gap={8} p={10}>
        <Flex align="center" justify="space-between" gap={4}>
          <IconButton
            onClick={() => router.back()}
            size="sm"
            aria-label="back"
            icon={<FiChevronLeft />}
          />
          {contractType && (
            <Flex gap={2} align="center">
              <AspectRatio ratio={1} w="50px" flexShrink={0}>
                <Box>
                  <ChakraNextImage
                    src={FeatureIconMap[contractType]}
                    alt={contractType}
                    w="100%"
                  />
                </Box>
              </AspectRatio>

              <Heading size="title.lg">
                Deploy new {CONTRACT_TYPE_NAME_MAP[contractType]} contract
              </Heading>
            </Flex>
          )}
          <Box />
        </Flex>
      </Flex>
      <Divider />
      <Box pt={10}>
        {contract && contractType ? (
          <ContractDeployForm contract={contract} contractType={contractType} />
        ) : null}
      </Box>
    </Card>
  );
};

DeployContractContract.Layout = AppLayout;

export default DeployContractContract;

function useDeployForm<TContract extends ValidContractClass>(
  deploySchema: TContract["schema"]["deploy"],
) {
  const { handleSubmit: _handleSubmit, ...restForm } = useForm<
    z.infer<typeof deploySchema>
  >({
    resolver: zodResolver(deploySchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    criteriaMode: "all",
  });

  function handleSubmit(
    onValid: SubmitHandler<z.infer<typeof deploySchema>>,
    onInvalid?: SubmitErrorHandler<z.infer<typeof deploySchema>>,
  ) {
    return _handleSubmit((d) => {
      onValid(stripNullishKeys(d));
    }, onInvalid);
  }

  return { ...restForm, handleSubmit };
}

function stripNullishKeys<T extends object>(obj: T) {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value || value === 0) {
      acc[key as keyof T] = value;
    }
    return acc;
  }, {} as T);
}

const ContractDeployForm = <TContract extends ValidContractClass>({
  contract,
  contractType,
}: {
  contract: TContract;
  contractType: ContractType;
}) => {
  const activeChainId = useActiveChainId();
  const type = useSingleQueryParam("type");
  const wallet = useSingleQueryParam("wallet") || "dashboard";
  const network = useSingleQueryParam("network");
  const { push } = useRouter();
  const { address, balance } = useWeb3();
  const deployMutation = useDeploy(contract.contractType);
  const form = useDeployForm(contract.schema.deploy);
  const {
    getFieldState,
    watch,
    setValue,
    register,
    handleSubmit,
    resetField,
    formState,
  } = form;

  const hasPrimarySaleMechanic = useMemo(
    () => "primary_sale_recipient" in contract.schema.deploy.shape,
    [contract],
  );
  const hasPlatformFeeMechanic = useMemo(
    () =>
      "platform_fee_recipient" in contract.schema.deploy.shape &&
      "platform_fee_basis_points" in contract.schema.deploy.shape &&
      false,
    [contract],
  );
  const hasRoyaltyMechanic = useMemo(
    () =>
      "fee_recipient" in contract.schema.deploy.shape &&
      "seller_fee_basis_points" in contract.schema.deploy.shape,
    [contract],
  );

  const hasSymbol = useMemo(
    () => "symbol" in contract.schema.deploy.shape,
    [contract],
  );

  useEffect(() => {
    if (
      hasPrimarySaleMechanic &&
      !getFieldState("primary_sale_recipient").isTouched &&
      address
    ) {
      resetField("primary_sale_recipient", { defaultValue: address });
    }

    if (
      hasPlatformFeeMechanic &&
      !getFieldState("platform_fee_recipient").isTouched
    ) {
      resetField("platform_fee_recipient", { defaultValue: address });
    }

    if (
      hasRoyaltyMechanic &&
      !getFieldState("fee_recipient").isTouched &&
      address
    ) {
      resetField("fee_recipient", { defaultValue: address });
    }
  }, [
    address,
    getFieldState,
    hasPlatformFeeMechanic,
    hasPrimarySaleMechanic,
    hasRoyaltyMechanic,
    resetField,
  ]);

  function isRequired<
    TFieldName extends
      | FieldPath<z.infer<typeof contract.schema.deploy>>
      | string,
  >(name: TFieldName): boolean {
    return name in contract.schema.deploy.shape
      ? !contract.schema.deploy.shape[
          name as keyof typeof contract.schema.deploy.shape
        ].isOptional()
      : true;
  }

  const hasVoteMechanic = useMemo(
    () => "voting_token_address" in contract.schema.deploy.shape,
    [contract],
  );

  const hasSplitsMechanic = useMemo(
    () => "recipients" in contract.schema.deploy.shape,
    [contract],
  );

  const seconds = activeChainId && NetworkToBlockTimeMap[activeChainId];

  const toast = useToast();

  return (
    <FormProvider {...form}>
      <Flex
        borderColor="inherit"
        as="form"
        onSubmit={handleSubmit((d) => {
          deployMutation.mutate(d, {
            onSuccess: ({ contractAddress }) => {
              push(
                `/${wallet}/${network}/${UrlMap[contractType]}/${contractAddress}`,
              );
            },
            onError: (err) => {
              toast({
                title: `Failed to deploy contract`,
                description: parseErrorToMessage(err),
                status: "error",
                duration: 9000,
                isClosable: true,
              });
            },
          });
        })}
        direction="column"
        gap={8}
      >
        <Flex px={10} as="section" direction="column" gap={4}>
          <Flex direction="column">
            <Heading size="title.md">General Settings</Heading>
            <Text size="body.md" fontStyle="italic">
              Settings to organize and distinguish between your different
              contracts.
            </Text>
          </Flex>
          <Flex gap={4} direction={{ base: "column", md: "row" }}>
            <Flex
              flexShrink={0}
              flexGrow={1}
              maxW={{ base: "100%", md: "160px" }}
            >
              <FormControl
                display="flex"
                flexDirection="column"
                isRequired={isRequired("image")}
                isInvalid={getFieldState("image", formState).invalid}
              >
                <FormLabel>Image</FormLabel>
                <FileInput
                  accept="image/*"
                  value={useImageFileOrUrl(watch("image"))}
                  setValue={(file) =>
                    setValue("image", file, { shouldTouch: true })
                  }
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                  transition="all 200ms ease"
                />
                <FormErrorMessage>
                  {getFieldState("image", formState).error?.message}
                </FormErrorMessage>
              </FormControl>
            </Flex>

            <Flex
              direction="column"
              gap={4}
              flexGrow={1}
              justify="space-between"
            >
              <Flex gap={4} direction={{ base: "column", md: "row" }}>
                <FormControl
                  isRequired={isRequired("name")}
                  isInvalid={getFieldState("name", formState).invalid}
                >
                  <FormLabel>Name</FormLabel>
                  <Input autoFocus variant="filled" {...register("name")} />
                  <FormErrorMessage>
                    {getFieldState("name", formState).error?.message}
                  </FormErrorMessage>
                </FormControl>
                {hasSymbol && (
                  <FormControl
                    maxW={{ base: "100%", md: "200px" }}
                    isRequired={isRequired("symbol")}
                    isInvalid={getFieldState("symbol", formState).invalid}
                  >
                    <FormLabel>Symbol</FormLabel>
                    <Input variant="filled" {...register("symbol")} />
                    <FormErrorMessage>
                      {getFieldState("symbol", formState).error?.message}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Flex>

              <FormControl
                isRequired={isRequired("description")}
                isInvalid={getFieldState("description", formState).invalid}
              >
                <FormLabel>Description</FormLabel>
                <Textarea variant="filled" {...register("description")} />
                <FormErrorMessage>
                  {getFieldState("description", formState).error?.message}
                </FormErrorMessage>
              </FormControl>
            </Flex>
          </Flex>
        </Flex>

        {(hasPrimarySaleMechanic ||
          hasPlatformFeeMechanic ||
          hasRoyaltyMechanic) && (
          <>
            <Divider />
            <Flex px={10} as="section" direction="column" gap={4}>
              <Flex direction="column">
                <Heading size="title.md">Payout Settings</Heading>
                <Text size="body.md" fontStyle="italic">
                  Where should any funds generated by this contract flow to.
                </Text>
              </Flex>
              {hasPrimarySaleMechanic && (
                <Flex pb={4} direction="column" gap={2}>
                  <Heading size="title.sm">Primary Sales</Heading>
                  <Text size="body.md" fontStyle="italic">
                    Determine the address that should receive the revenue from
                    initial sales of the assets.
                  </Text>
                  <Flex gap={4} direction={{ base: "column", md: "row" }}>
                    <FormControl
                      isRequired={isRequired("primary_sale_recipient")}
                      isInvalid={
                        getFieldState("primary_sale_recipient", formState)
                          .invalid
                      }
                    >
                      <FormLabel>Recipient Address</FormLabel>
                      <Input
                        variant="filled"
                        {...register("primary_sale_recipient")}
                      />
                      <FormErrorMessage>
                        {
                          getFieldState("primary_sale_recipient", formState)
                            .error?.message
                        }
                      </FormErrorMessage>
                    </FormControl>
                  </Flex>
                </Flex>
              )}

              {hasRoyaltyMechanic && (
                <Flex pb={4} direction="column" gap={2}>
                  <Heading size="title.sm">Royalties</Heading>
                  <Text size="body.md" fontStyle="italic">
                    Determine the address that should receive the revenue from
                    royalties earned from secondary sales of the assets.
                  </Text>
                  <Flex gap={4} direction={{ base: "column", md: "row" }}>
                    <FormControl
                      isRequired={isRequired("fee_recipient")}
                      isInvalid={
                        !!getFieldState("fee_recipient", formState).invalid
                      }
                    >
                      <FormLabel>Recipient Address</FormLabel>
                      <Input variant="filled" {...register("fee_recipient")} />
                      <FormErrorMessage>
                        {
                          getFieldState("fee_recipient", formState).error
                            ?.message
                        }
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl
                      maxW={{ base: "100%", md: "200px" }}
                      isRequired={isRequired("seller_fee_basis_points")}
                      isInvalid={
                        !!getFieldState("seller_fee_basis_points", formState)
                          .invalid
                      }
                    >
                      <FormLabel>Percentage</FormLabel>
                      <BasisPointsInput
                        variant="filled"
                        value={watch("seller_fee_basis_points")}
                        onChange={(value) =>
                          setValue("seller_fee_basis_points", value, {
                            shouldTouch: true,
                          })
                        }
                      />
                      <FormErrorMessage>
                        {
                          getFieldState("seller_fee_basis_points", formState)
                            .error?.message
                        }
                      </FormErrorMessage>
                    </FormControl>
                  </Flex>
                </Flex>
              )}
              {hasPlatformFeeMechanic && (
                <Flex pb={4} direction="column" gap={2}>
                  <Heading size="title.sm">Platform fees</Heading>
                  <Flex gap={4} direction={{ base: "column", md: "row" }}>
                    <FormControl
                      isRequired={isRequired("platform_fee_recipient")}
                      isInvalid={
                        getFieldState("platform_fee_recipient", formState)
                          .invalid
                      }
                    >
                      <FormLabel>Recipient Address</FormLabel>
                      <Input
                        variant="filled"
                        {...register("platform_fee_recipient")}
                      />
                      <FormErrorMessage>
                        {
                          getFieldState("platform_fee_recipient", formState)
                            .error?.message
                        }
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl
                      maxW={{ base: "100%", md: "200px" }}
                      isRequired={isRequired("platform_fee_basis_points")}
                      isInvalid={
                        getFieldState("platform_fee_basis_points", formState)
                          .invalid
                      }
                    >
                      <FormLabel>Percentage</FormLabel>
                      <BasisPointsInput
                        variant="filled"
                        value={watch("platform_fee_basis_points")}
                        onChange={(value) =>
                          setValue("platform_fee_basis_points", value, {
                            shouldTouch: true,
                          })
                        }
                      />
                      <FormErrorMessage>
                        {
                          getFieldState("platform_fee_basis_points", formState)
                            .error?.message
                        }
                      </FormErrorMessage>
                    </FormControl>
                  </Flex>
                </Flex>
              )}
            </Flex>
          </>
        )}
        {hasVoteMechanic && (
          <>
            <Divider />
            <Flex px={10} as="section" direction="column" gap={4}>
              <Flex direction="column">
                <Heading size="title.md">Vote Settings</Heading>
                <Text size="body.md" fontStyle="italic">
                  These settings will determine the voting process of this
                  contract. Once you create this contract, you won&apos;t be
                  able to update these settings without having token holders
                  vote for a change.
                </Text>
              </Flex>
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                <FormControl
                  isRequired={isRequired("voting_token_address")}
                  isInvalid={
                    getFieldState("voting_token_address", formState).invalid ||
                    (watch("voting_token_address")
                      ? !isAddress(watch("voting_token_address"))
                      : false)
                  }
                >
                  <FormLabel>Governance Token Address</FormLabel>
                  <Input
                    placeholder={AddressZero}
                    variant="filled"
                    {...register("voting_token_address")}
                  />
                  <FormHelperText>
                    The address of the token that will be used to vote on this
                    contract.
                  </FormHelperText>
                  <FormErrorMessage>
                    {getFieldState("voting_token_address", formState).error
                      ?.message ||
                      (watch("voting_token_address") &&
                        !isAddress(watch("voting_token_address")) &&
                        "Please enter a valid address.")}
                  </FormErrorMessage>
                </FormControl>
                <FormControl
                  isRequired={isRequired("proposal_token_threshold")}
                  isInvalid={
                    getFieldState("proposal_token_threshold", formState).invalid
                  }
                >
                  <FormLabel>Proposal Token Threshold</FormLabel>
                  <NumberInput
                    variant="filled"
                    value={watch("proposal_token_threshold")}
                    onChange={(stringValue) =>
                      setValue("proposal_token_threshold", stringValue, {
                        shouldTouch: true,
                      })
                    }
                    defaultValue={1}
                    min={1}
                    step={1}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <FormHelperText>
                    The minimum number of voting tokens a wallet needs in order
                    to create proposals.
                  </FormHelperText>
                  <FormErrorMessage>
                    {
                      getFieldState("proposal_token_threshold", formState).error
                        ?.message
                    }
                  </FormErrorMessage>
                </FormControl>
                <FormControl
                  isRequired={isRequired("voting_delay_in_blocks")}
                  isInvalid={
                    getFieldState("voting_delay_in_blocks", formState).invalid
                  }
                >
                  <FormLabel>Voting Delay</FormLabel>
                  <NumberInput
                    variant="filled"
                    value={watch("voting_delay_in_blocks")}
                    onChange={(_stringValue, numberValue) =>
                      setValue("voting_delay_in_blocks", numberValue, {
                        shouldTouch: true,
                      })
                    }
                    defaultValue={0}
                    min={0}
                    step={1}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <FormHelperText>
                    The number of blocks after a proposal is created that voting
                    on the proposal starts. A block is a series of blockchain
                    transactions and occurs every ~{seconds} seconds.
                  </FormHelperText>
                  <FormErrorMessage>
                    {
                      getFieldState("voting_delay_in_blocks", formState).error
                        ?.message
                    }
                  </FormErrorMessage>
                </FormControl>
                <FormControl
                  isRequired={isRequired("voting_period_in_blocks")}
                  isInvalid={
                    getFieldState("voting_period_in_blocks", formState).invalid
                  }
                >
                  <FormLabel>Voting Period</FormLabel>
                  <NumberInput
                    variant="filled"
                    value={watch("voting_period_in_blocks")}
                    onChange={(_stringValue, numberValue) =>
                      setValue("voting_period_in_blocks", numberValue, {
                        shouldTouch: true,
                      })
                    }
                    defaultValue={0}
                    min={0}
                    step={1}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <FormHelperText>
                    The number of blocks that voters have to vote on any new
                    proposal. A block is a series of blockchain transactions and
                    occurs every ~{seconds} seconds.
                  </FormHelperText>
                  <FormErrorMessage>
                    {
                      getFieldState("voting_period_in_blocks", formState).error
                        ?.message
                    }
                  </FormErrorMessage>
                </FormControl>
                <FormControl
                  isRequired={isRequired("voting_quorum_fraction")}
                  isInvalid={
                    getFieldState("voting_quorum_fraction", formState).invalid
                  }
                >
                  <FormLabel>Voting Quorum</FormLabel>
                  <NumberInput
                    variant="filled"
                    value={watch("voting_quorum_fraction")}
                    onChange={(_stringValue, numberValue) =>
                      setValue("voting_quorum_fraction", numberValue, {
                        shouldTouch: true,
                      })
                    }
                    defaultValue={0}
                    min={0}
                    step={0.01}
                    max={1}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <FormHelperText>
                    The fraction of the total voting power that is required for
                    a proposal to pass. A value of 0 indicates that no voting
                    power is sufficient, whereas a value of 1 indicates that the
                    entirety of voting power must vote for a proposal to pass.
                  </FormHelperText>
                  <FormErrorMessage>
                    {
                      getFieldState("voting_quorum_fraction", formState).error
                        ?.message
                    }
                  </FormErrorMessage>
                </FormControl>
              </SimpleGrid>
            </Flex>
          </>
        )}
        {hasSplitsMechanic && <RecipientForm />}

        <TransactionButton
          colorScheme="primary"
          transactionCount={1}
          isDisabled={
            !Object.keys(formState.touchedFields).length ||
            !BigNumber.from(balance?.data?.value || 0)?.gt(0) ||
            TYPE_CONTRACT_MAP[type as keyof typeof TYPE_CONTRACT_MAP].find(
              (c) => c.contractType === contractType,
            )?.comingSoon
          }
          type="submit"
          isLoading={deployMutation.isLoading}
          loadingText="Deploying Contract..."
          size="lg"
          borderRadius="xl"
          borderTopLeftRadius="0"
          borderTopRightRadius="0"
        >
          Deploy now
        </TransactionButton>
      </Flex>
    </FormProvider>
  );
};
