import {
  Flex,
  FormControl,
  Grid,
  Input,
  Select,
  Skeleton,
  Spacer,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { compatibleExtensions } from "@thirdweb-dev/sdk";
import { TransactionButton } from "components/buttons/TransactionButton";
import {
  useAllVersions,
  usePublishedContractsQuery,
} from "components/contract-components/hooks";
import { useForm } from "react-hook-form";
import {
  type ContractOptions,
  sendTransaction,
  waitForReceipt,
} from "thirdweb";
import { installPublishedExtension } from "thirdweb/extensions/modular";
import { download } from "thirdweb/storage";
import { resolveImplementation } from "thirdweb/utils";
import type { Account } from "thirdweb/wallets";
import { FormErrorMessage, FormLabel, Text } from "tw-components";
import { thirdwebClient } from "../../../../@/constants/client";

type FormData = {
  publisherAddress: string;
  extensionContract: string;
  version: string;
};

type InstallExtensionFormProps = {
  contract: ContractOptions;
  refetchExtensions: () => void;
  account: Account;
  installedExtensions: {
    data?: string[];
    isLoading: boolean;
  };
};

export const InstallExtensionForm = (props: InstallExtensionFormProps) => {
  const { register, watch, formState, resetField, reset } = useForm<FormData>({
    defaultValues: {
      version: "latest",
    },
  });
  const toast = useToast();
  const { contract, account } = props;
  const { errors } = formState;

  const publishedContractsQuery = usePublishedContractsQuery(
    watch("publisherAddress"),
    "ModularExtension",
  );
  const allVersions = useAllVersions(
    watch("publisherAddress"),
    watch("extensionContract"),
  );

  const installMutation = useMutation({
    mutationFn: async () => {
      const installTransaction = installPublishedExtension({
        contract,
        chain: contract.chain,
        client: contract.client,
        account,
        extensionName: watch("extensionContract"),
        publisherAddress: watch("publisherAddress"),
        version: watch("version"),
      });

      const txResult = await sendTransaction({
        transaction: installTransaction,
        account,
      });

      await waitForReceipt(txResult);
    },
    onSuccess() {
      props.refetchExtensions();

      toast({
        variant: "solid",
        position: "bottom",
        title: "Extension installed successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // clear form
      reset({
        publisherAddress: "",
        extensionContract: "",
        version: "latest",
      });
    },
    onError(err) {
      toast({
        variant: "solid",
        position: "bottom",
        title: "Failed to install extension",
        status: "error",
        duration: 5000,
        isClosable: true,
      });

      console.error("Error during installation:", err);
    },
  });

  const onSubmit = async () => {
    installMutation.mutate();
  };

  const extensionContractInputProps = register("extensionContract", {
    required: "Extension name is required",
  });

  const selectedExtension = publishedContractsQuery.data?.find(
    (x) => x.id === watch("extensionContract"),
  );

  // Get core contract bytecode
  const coreContractByteCodeQuery = useQuery({
    queryKey: ["getBytecode", contract.address, contract.chain.id],
    queryFn: async () => {
      const coreImplementation = await resolveImplementation(contract);
      return coreImplementation.bytecode;
    },
    retry: false,
    // 30 minutes
    // staleTime: 1000 * 60 * 30,
  });

  // Get Installed extension bytecodes
  const installedExtensionBytecodesQuery = useQuery({
    queryKey: [
      "installedExtensionBytecodes",
      contract.address,
      contract.chain.id,
      props.installedExtensions.data,
    ],
    queryFn: async () => {
      const extensionAddress = props.installedExtensions.data;
      if (!extensionAddress) {
        return [];
      }

      return Promise.all(
        extensionAddress.map(async (address) => {
          const result = await resolveImplementation({
            client: thirdwebClient,
            address,
            chain: contract.chain,
          });

          if (!result) {
            throw new Error("Failed to fetch bytecode for extension");
          }

          return result.bytecode;
        }),
      );
    },
    enabled: !!props.installedExtensions.data,
    retry: false,
    // 30 minutes
    staleTime: 1000 * 60 * 30,
  });

  // check if selected extension is compatible with the core contract and installed extensions
  const isExtensionCompatibleQuery = useQuery({
    queryKey: [
      "isExtensionCompatible",
      contract.address,
      contract.chain.id,
      installedExtensionBytecodesQuery.data,
      coreContractByteCodeQuery.data,
      selectedExtension,
    ],
    queryFn: async () => {
      if (
        !coreContractByteCodeQuery.data ||
        !installedExtensionBytecodesQuery.data ||
        !selectedExtension
      ) {
        throw new Error("Unexpected error");
      }

      return isExtensionCompatible({
        contractInfo: {
          bytecode: coreContractByteCodeQuery.data,
          installedExtensionBytecodes: installedExtensionBytecodesQuery.data,
          chainId: contract.chain.id,
        },
        extensionInfo: {
          bytecodeUri: selectedExtension.metadata.bytecodeUri,
        },
      });
    },
    retry: false,
    // 30 minutes
    staleTime: 1000 * 60 * 30,
    enabled:
      !!selectedExtension &&
      !!coreContractByteCodeQuery.data &&
      !!installedExtensionBytecodesQuery.data,
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <Grid
        gap={4}
        gridTemplateColumns={{
          base: "1fr",
          md: "1fr 1fr",
          lg: "1fr 1fr 1fr",
        }}
      >
        <FormControl isInvalid={!!errors.publisherAddress}>
          <FormLabel>Publisher</FormLabel>
          <Input
            disabled={installMutation.isLoading}
            bg="backgroundHighlight"
            placeholder="Publisher address"
            {...register("publisherAddress", {
              required: "Publisher address is required",
            })}
          />
          <FormErrorMessage>
            {errors.publisherAddress?.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl
          isInvalid={
            !!errors.extensionContract ||
            isExtensionCompatibleQuery.data === false
          }
          isRequired={true}
        >
          <FormLabel>Extension Name</FormLabel>
          <Skeleton
            isLoaded={
              !!publishedContractsQuery.data ||
              !publishedContractsQuery.isFetching
            }
            borderRadius="lg"
          >
            <Select
              disabled={
                installMutation.isLoading ||
                publishedContractsQuery?.data?.length === 0 ||
                publishedContractsQuery.isLoading
              }
              bg="backgroundHighlight"
              {...extensionContractInputProps}
              onChange={(e) => {
                // reset version when extension changes
                resetField("version");
                extensionContractInputProps.onChange(e);
              }}
              placeholder={
                publishedContractsQuery.data?.length === 0
                  ? "No extensions"
                  : "Select extension"
              }
            >
              {publishedContractsQuery?.data?.map(({ id }) => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
            </Select>
          </Skeleton>
          <FormErrorMessage fontWeight={500}>
            {!isExtensionCompatibleQuery.isFetching &&
              isExtensionCompatibleQuery.data === false &&
              "Extension is not compatible"}
            {errors.extensionContract?.message}
          </FormErrorMessage>

          {isExtensionCompatibleQuery.isFetching && selectedExtension && (
            <Flex alignItems="center" gap={1.5} mt={2}>
              <Text size="body.sm" fontWeight={500} color="blue.500">
                Checking Compatibility
              </Text>
              <Spinner size={"xs"} color="blue.500" />
            </Flex>
          )}

          {isExtensionCompatibleQuery.isError && (
            <Flex alignItems="center" gap={2} mt={2}>
              <Text
                fontWeight={500}
                size="body.sm"
                _dark={{
                  color: "yellow.500",
                }}
                _light={{
                  color: "yellow.700",
                }}
              >
                Extension may not be compatible
              </Text>
            </Flex>
          )}
        </FormControl>

        <FormControl isInvalid={!!errors.version} isRequired={true}>
          <FormLabel>Extension Version</FormLabel>
          <Skeleton isLoaded={!allVersions.isFetching} borderRadius="lg">
            <Select
              disabled={
                !allVersions.data ||
                allVersions.isLoading ||
                isExtensionCompatibleQuery.data === false ||
                installMutation.isLoading ||
                isExtensionCompatibleQuery.isFetching
              }
              bg="backgroundHighlight"
              w="full"
              {...register("version", {
                required: "Version is required",
              })}
            >
              <option value="latest">Latest</option>
              {allVersions?.data?.map(({ version }) => (
                <option key={version} value={version}>
                  {version}
                </option>
              ))}
            </Select>
          </Skeleton>
          <FormErrorMessage>{errors.version?.message}</FormErrorMessage>
        </FormControl>
      </Grid>

      <Spacer h={5} />

      {/* Submit */}
      <Flex justify={"flex-end"}>
        <TransactionButton
          transactionCount={1}
          isLoading={installMutation.isLoading}
          type="submit"
          colorScheme="primary"
          alignSelf="flex-end"
          isDisabled={
            !formState.isValid ||
            isExtensionCompatibleQuery.data === false ||
            isExtensionCompatibleQuery.isFetching
          }
        >
          Install
        </TransactionButton>
      </Flex>
    </form>
  );
};

async function isExtensionCompatible(options: {
  contractInfo: {
    bytecode: string;
    installedExtensionBytecodes: string[];
    chainId: number;
  };
  extensionInfo: {
    bytecodeUri: string;
  };
}) {
  // 1. get extension's bytecode
  const res = await download({
    client: thirdwebClient,
    uri: options.extensionInfo.bytecodeUri,
  });

  const extensionBytecode = await res.text();

  // 2. check compatibility with core and installed extensions
  try {
    const isCompatible = await compatibleExtensions(
      options.contractInfo.bytecode,
      [...options.contractInfo.installedExtensionBytecodes, extensionBytecode],
      options.contractInfo.chainId,
    );

    return isCompatible;
  } catch (e) {
    console.error("Error during compatibility check:", e);
    throw e;
  }
}
