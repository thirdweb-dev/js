import { ContractIdImage } from "../contract-table/cells/image";
import { useContractPublishMetadataFromURI } from "../hooks";
import { useDeploy } from "@3rdweb-sdk/react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Divider,
  Flex,
  FormControl,
  IconButton,
  Input,
  LinkBox,
  LinkOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  SimpleGrid,
  Skeleton,
  Textarea,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAddress } from "@thirdweb-dev/react";
import {
  ContractType,
  KNOWN_CONTRACTS_MAP,
  SUPPORTED_CHAIN_ID,
  ValidContractClass,
} from "@thirdweb-dev/sdk";
import { ChakraNextImage } from "components/Image";
import { TransactionButton } from "components/buttons/TransactionButton";
import { RecipientForm } from "components/deployment/splits/recipients";
import { BasisPointsInput } from "components/inputs/BasisPointsInput";
import { SupportedNetworkSelect } from "components/selects/SupportedNetworkSelect";
import { FileInput } from "components/shared/FileInput";
import {
  BuiltinContractMap,
  DisabledChainsMap,
  UrlMap,
} from "constants/mappings";
import { constants, utils } from "ethers";
import { useTrack } from "hooks/analytics/useTrack";
import { useImageFileOrUrl } from "hooks/useImageFileOrUrl";
import { useSingleQueryParam } from "hooks/useQueryParam";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useRouter } from "next/router";
import twAudited from "public/brand/thirdweb-audited-2.png";
import { useEffect, useMemo } from "react";
import {
  FieldPath,
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { FiChevronLeft } from "react-icons/fi";
import {
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  LinkButton,
  Text,
  TrackedLink,
} from "tw-components";
import {
  NetworkToBlockTimeMap,
  SupportedChainIdToNetworkMap,
} from "utils/network";
import { pushToPreviousRoute } from "utils/pushToPreviousRoute";
import { z } from "zod";

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

interface BuiltinContractFormProps {
  contractType: ContractType;
  selectedChain: SUPPORTED_CHAIN_ID | undefined;
  onChainSelect: (chainId: SUPPORTED_CHAIN_ID) => void;
}

const BuiltinContractForm: React.FC<BuiltinContractFormProps> = ({
  contractType,
  selectedChain,
  onChainSelect,
}) => {
  const publishMetadata = useContractPublishMetadataFromURI(contractType);

  const contract =
    KNOWN_CONTRACTS_MAP[contractType as keyof typeof KNOWN_CONTRACTS_MAP];

  const form = useDeployForm(contract.schema.deploy);

  const {
    handleSubmit,
    getFieldState,
    formState,
    watch,
    register,
    setValue,
    resetField,
  } = form;

  const address = useAddress();

  const hasPrimarySaleMechanic = useMemo(
    () => "primary_sale_recipient" in contract.schema.deploy.shape,
    [contract],
  );

  const hasPlatformFeeMechanic = useMemo(
    () =>
      "platform_fee_recipient" in contract.schema.deploy.shape &&
      "platform_fee_basis_points" in contract.schema.deploy.shape,
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

  const hasVoteMechanic = useMemo(
    () => "voting_token_address" in contract.schema.deploy.shape,
    [contract],
  );

  const hasSplitsMechanic = useMemo(
    () => "recipients" in contract.schema.deploy.shape,
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

  const seconds = selectedChain && NetworkToBlockTimeMap[selectedChain];

  const deploy = useDeploy(contract.contractType);

  const { onSuccess, onError } = useTxNotifications(
    "Succesfully deployed contract",
    "Failed to deploy contract",
  );

  const wallet = useSingleQueryParam("wallet") || "dashboard";

  const { trackEvent } = useTrack();
  const router = useRouter();

  const audit = BuiltinContractMap[contractType]?.audit;

  return (
    <FormProvider {...form}>
      <Flex
        flexGrow={1}
        minH="full"
        gap={4}
        direction="column"
        as="form"
        onSubmit={handleSubmit((d) => {
          if (!selectedChain) {
            return;
          }
          const deployData = {
            contractType,
            contractMetadata: d,
            publishMetadata: publishMetadata.data,
            chainId: selectedChain,
          };
          trackEvent({
            category: "builtin-contract",
            action: "deploy",
            label: "attempt",
            deployData,
          });
          deploy.mutate(d, {
            onSuccess: ({ contractAddress }) => {
              console.info("contract deployed:", {
                chainId: selectedChain,
                address: contractAddress,
              });
              trackEvent({
                category: "builtin-contract",
                action: "deploy",
                label: "success",
                deployData,
                contractAddress,
              });
              onSuccess();
              router.push(
                `/${wallet}/${SupportedChainIdToNetworkMap[selectedChain]}/${UrlMap[contractType]}/${contractAddress}`,
              );
            },
            onError: (err) => {
              trackEvent({
                category: "builtin-contract",
                action: "deploy",
                label: "error",
                deployData,
                error: err,
              });
              onError(err);
            },
          });
        })}
      >
        <Flex
          justifyContent="space-between"
          direction={{ base: "column", md: "row" }}
          gap={6}
        >
          <Flex gap={4} align="center">
            <IconButton
              onClick={() => pushToPreviousRoute(router)}
              size="sm"
              aria-label="back"
              icon={<FiChevronLeft />}
            />
            <ContractIdImage boxSize={12} contractId={contractType} />
            <Flex direction="column">
              <Skeleton isLoaded={publishMetadata.isSuccess}>
                <Flex gap={2}>
                  <Heading minW="60px" size="subtitle.lg">
                    {publishMetadata.data?.name}
                  </Heading>
                  {audit && (
                    <Flex
                      justifyContent="center"
                      alignItems="center"
                      as={LinkBox}
                    >
                      <LinkOverlay
                        isExternal
                        href={`${process.env.NEXT_PUBLIC_IPFS_GATEWAY_URL}/${audit}`}
                        onClick={() =>
                          trackEvent({
                            category: "visit-audit",
                            action: "click",
                            label: contractType,
                          })
                        }
                        width={20}
                      >
                        <ChakraNextImage src={twAudited} alt="audited" />
                      </LinkOverlay>
                    </Flex>
                  )}
                </Flex>
              </Skeleton>
              <Skeleton isLoaded={publishMetadata.isSuccess}>
                <Text maxW="xs" fontStyle="italic" noOfLines={2}>
                  {publishMetadata.data?.description || "No description"}
                </Text>
              </Skeleton>
            </Flex>
          </Flex>
          <Flex gap={2}>
            <LinkButton
              variant="outline"
              isExternal
              href={`https://portal.thirdweb.com/pre-built-contracts/${contractType}`}
              onClick={() =>
                trackEvent({
                  category: "learn-more-deploy",
                  action: "click",
                  label: contractType,
                })
              }
            >
              Learn more about this contract
            </LinkButton>
          </Flex>
        </Flex>
        <Divider />
        <Flex direction="column">
          <Heading size="subtitle.md">Contract Metadata</Heading>
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
              isRequired={isRequired("image")}
              isDisabled={!publishMetadata.isSuccess}
              display="flex"
              flexDirection="column"
              isInvalid={!!getFieldState("image", formState).error}
            >
              <FormLabel>Image</FormLabel>
              <FileInput
                accept={{ "image/*": [] }}
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

          <Flex direction="column" gap={4} flexGrow={1} justify="space-between">
            <Flex gap={4} direction={{ base: "column", md: "row" }}>
              <FormControl
                isDisabled={!publishMetadata.isSuccess}
                isRequired={isRequired("name")}
                isInvalid={!!getFieldState("name", formState).error}
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
                  isInvalid={!!getFieldState("symbol", formState).error}
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
              isDisabled={!publishMetadata.isSuccess}
              isInvalid={!!getFieldState("description", formState).error}
            >
              <FormLabel>Description</FormLabel>
              <Textarea variant="filled" {...register("description")} />
              <FormErrorMessage>
                {getFieldState("description", formState).error?.message}
              </FormErrorMessage>
            </FormControl>
          </Flex>
        </Flex>
        {/* payout settings */}
        {(hasPrimarySaleMechanic ||
          hasPlatformFeeMechanic ||
          hasRoyaltyMechanic) && (
          <>
            <Divider />
            <Flex as="section" direction="column" gap={4}>
              <Flex direction="column">
                <Heading size="subtitle.md">Payout Settings</Heading>
                <Text size="body.md" fontStyle="italic">
                  Where should any funds generated by this contract flow to.
                </Text>
              </Flex>
              {hasPrimarySaleMechanic && (
                <Flex pb={4} direction="column" gap={2}>
                  <Heading size="label.lg">Primary Sales</Heading>
                  <Text size="body.md" fontStyle="italic">
                    Determine the address that should receive the revenue from
                    initial sales of the assets.
                  </Text>
                  <Flex gap={4} direction={{ base: "column", md: "row" }}>
                    <FormControl
                      isRequired={isRequired("primary_sale_recipient")}
                      isInvalid={
                        !!getFieldState("primary_sale_recipient", formState)
                          .error
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
                  <Heading size="label.lg">Royalties</Heading>
                  <Text size="body.md" fontStyle="italic">
                    Determine the address that should receive the revenue from
                    royalties earned from secondary sales of the assets.
                  </Text>
                  <Flex gap={4} direction={{ base: "column", md: "row" }}>
                    <FormControl
                      isRequired={isRequired("fee_recipient")}
                      isInvalid={
                        !!getFieldState("fee_recipient", formState).error
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
                          .error
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
                <Accordion allowToggle>
                  <AccordionItem borderColor="borderColor">
                    <AccordionButton px={0}>
                      <Heading size="subtitle.md" flex="1" textAlign="left">
                        Advanced Configuration
                      </Heading>

                      <AccordionIcon />
                    </AccordionButton>

                    <AccordionPanel py={4} px={0}>
                      <Flex pb={4} direction="column" gap={2}>
                        <Heading size="label.lg">Platform fees</Heading>
                        <Text size="body.md" fontStyle="italic">
                          Get additional fees for all primary sales that happen
                          on this contract. (This is useful if you are deploying
                          this contract for a 3rd party and want to take fees
                          for your service.)
                        </Text>
                        <Flex gap={4} direction={{ base: "column", md: "row" }}>
                          <FormControl
                            isRequired={isRequired("platform_fee_recipient")}
                            isInvalid={
                              !!getFieldState(
                                "platform_fee_recipient",
                                formState,
                              ).error
                            }
                          >
                            <FormLabel>Recipient Address</FormLabel>
                            <Input
                              variant="filled"
                              {...register("platform_fee_recipient")}
                            />
                            <FormErrorMessage>
                              {
                                getFieldState(
                                  "platform_fee_recipient",
                                  formState,
                                ).error?.message
                              }
                            </FormErrorMessage>
                          </FormControl>
                          <FormControl
                            maxW={{ base: "100%", md: "200px" }}
                            isRequired={isRequired("platform_fee_basis_points")}
                            isInvalid={
                              !!getFieldState(
                                "platform_fee_basis_points",
                                formState,
                              ).error
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
                                getFieldState(
                                  "platform_fee_basis_points",
                                  formState,
                                ).error?.message
                              }
                            </FormErrorMessage>
                          </FormControl>
                        </Flex>
                      </Flex>
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              )}
            </Flex>
          </>
        )}
        {/* payout settings end */}
        {/* vote settings start */}
        {hasVoteMechanic && (
          <>
            <Divider />
            <Flex as="section" direction="column" gap={4}>
              <Flex direction="column">
                <Heading size="subtitle.md">Vote Settings</Heading>
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
                    !!getFieldState("voting_token_address", formState).error ||
                    (watch("voting_token_address")
                      ? !utils.isAddress(watch("voting_token_address"))
                      : false)
                  }
                >
                  <FormLabel>Governance Token Address</FormLabel>
                  <Input
                    placeholder={constants.AddressZero}
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
                        !utils.isAddress(watch("voting_token_address")) &&
                        "Please enter a valid address.")}
                  </FormErrorMessage>
                </FormControl>
                <FormControl
                  isRequired={isRequired("proposal_token_threshold")}
                  isInvalid={
                    !!getFieldState("proposal_token_threshold", formState).error
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
                    !!getFieldState("voting_delay_in_blocks", formState).error
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
                    !!getFieldState("voting_period_in_blocks", formState).error
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
                    !!getFieldState("voting_quorum_fraction", formState).error
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
                    step={1}
                    max={100}
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
                    power is sufficient, whereas a value of 100 indicates that
                    the entirety of voting power must vote for a proposal to
                    pass.
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
        {/* vote settings end */}
        {/* splits start */}
        {hasSplitsMechanic && <RecipientForm />}
        {/* splits end */}
        <Divider mt="auto" />
        <Flex direction="column">
          <Heading size="subtitle.md">Network / Chain</Heading>
          <Text size="body.md" fontStyle="italic">
            Select a network to deploy this contract on. We recommend starting
            with a testnet.{" "}
            <TrackedLink
              href="https://portal.thirdweb.com/guides/which-network-should-you-use"
              color="primary.600"
              category="deploy"
              label="learn-networks"
              isExternal
            >
              Learn more about the different networks.
            </TrackedLink>
          </Text>
        </Flex>
        <Flex gap={4} direction={{ base: "column", md: "row" }}>
          <FormControl>
            <SupportedNetworkSelect
              isDisabled={deploy.isLoading || !publishMetadata.isSuccess}
              value={
                !DisabledChainsMap[contractType as ContractType].find(
                  (chain) => chain === selectedChain,
                )
                  ? selectedChain
                  : undefined
              }
              onChange={(e) =>
                onChainSelect(
                  parseInt(e.currentTarget.value) as SUPPORTED_CHAIN_ID,
                )
              }
              disabledChainIds={DisabledChainsMap[contractType as ContractType]}
              disabledChainIdText="Coming Soon"
            />
          </FormControl>
          <TransactionButton
            flexShrink={0}
            type="submit"
            isLoading={deploy.isLoading}
            isDisabled={!publishMetadata.isSuccess || !selectedChain}
            colorScheme="primary"
            transactionCount={1}
          >
            Deploy Now
          </TransactionButton>
        </Flex>
      </Flex>
    </FormProvider>
  );
};

export default BuiltinContractForm;
