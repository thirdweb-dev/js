"use client";

import { Spinner } from "@/components/ui/Spinner/Spinner";
import { useThirdwebClient } from "@/constants/thirdweb.client";
import { FormControl, Input, Select, Skeleton, Spacer } from "@chakra-ui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { TransactionButton } from "components/buttons/TransactionButton";
import {
  useAllVersions,
  usePublishedContractsQuery,
} from "components/contract-components/hooks";
import { useMemo } from "react";
import { FormProvider, type UseFormReturn, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  type Chain,
  type ContractOptions,
  type ThirdwebClient,
  sendTransaction,
  waitForReceipt,
} from "thirdweb";
import {
  checkModulesCompatibility,
  installPublishedModule,
  isGetModuleConfigSupported,
} from "thirdweb/modules";
import { download } from "thirdweb/storage";
import {
  encodeAbiParameters,
  resolveImplementation,
  toFunctionSelector,
} from "thirdweb/utils";
import type { Account } from "thirdweb/wallets";
import { FormErrorMessage, FormLabel } from "tw-components";
import {
  ModuleInstallParams,
  useModuleInstallParams,
} from "./install-module-params";

type FormData = {
  publisherAddress: string;
  moduleContract: string;
  version: string;
  // install params of modules to be installed
  moduleInstallFormParams?: Record<string, string>;
};

type InstallModuleFormProps = {
  contract: ContractOptions;
  refetchModules: () => void;
  account: Account;
  installedModules: {
    data?: string[];
    isPending: boolean;
  };
};

export type InstallModuleForm = UseFormReturn<FormData>;

export const InstallModuleForm = (props: InstallModuleFormProps) => {
  const client = useThirdwebClient();
  const form = useForm<FormData>({
    defaultValues: {
      publisherAddress: "0xdd99b75f095d0c4d5112aCe938e4e6ed962fb024", // thirdweb publisher address
      version: "latest",
    },
  });
  const { register, watch, formState, resetField, reset } = form;
  const { contract, account } = props;
  const { errors } = formState;

  const { data, isPending, isFetching } = usePublishedContractsQuery(
    watch("publisherAddress"),
  );

  // filter out all the contracts that AREN'T modules
  const modulesOnly = useMemo(() => {
    return (
      data?.filter((contract) => {
        const fnSelectors = contract.metadata.abi
          .filter((fn) => fn.type === "function")
          .map((fn) => toFunctionSelector(fn));
        return isGetModuleConfigSupported(fnSelectors);
      }) || []
    );
  }, [data]);

  const allVersions = useAllVersions(
    watch("publisherAddress"),
    watch("moduleContract"),
  );

  const installMutation = useMutation({
    mutationFn: async () => {
      const moduleInstallFormParams = watch("moduleInstallFormParams");
      let moduleData: `0x${string}` | undefined;

      if (moduleInstallFormParams && moduleInstallParams.data) {
        moduleData = encodeAbiParameters(
          moduleInstallParams.data.params.map((p) => ({
            name: p.name,
            type: p.type,
          })),
          Object.values(moduleInstallFormParams),
        );
      }

      const installTransaction = installPublishedModule({
        contract,
        account,
        moduleName: watch("moduleContract"),
        publisher: watch("publisherAddress"),
        version: watch("version"),
        moduleData,
      });

      const txResult = await sendTransaction({
        transaction: installTransaction,
        account,
      });

      await waitForReceipt(txResult);
    },
    onSuccess() {
      props.refetchModules();
      toast.success("Module installed successfully");
      // clear form
      reset({
        publisherAddress: "",
        moduleContract: "",
        version: "latest",
        moduleInstallFormParams: undefined,
      });
    },
    onError(err) {
      toast.error("Failed to install module");
      console.error("Error during installation:", err);
    },
  });

  const onSubmit = async () => {
    installMutation.mutate();
  };

  const moduleContractInputProps = register("moduleContract", {
    required: "Module name is required",
  });

  const selectedModule = modulesOnly?.find(
    (x) => x.contractId === watch("moduleContract"),
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

  // Get Installed module bytecodes
  const installedModuleBytecodesQuery = useQuery({
    queryKey: [
      "installedModuleBytecodes",
      contract.address,
      contract.chain.id,
      props.installedModules.data,
    ],
    queryFn: async () => {
      const moduleAddress = props.installedModules.data;
      if (!moduleAddress) {
        return [];
      }

      return Promise.all(
        moduleAddress.map(async (address) => {
          const result = await resolveImplementation({
            client,
            address,
            chain: contract.chain,
          });

          if (!result) {
            throw new Error("Failed to fetch bytecode for module");
          }

          return result.bytecode;
        }),
      );
    },
    enabled: !!props.installedModules.data,
    retry: false,
    // 30 minutes
    staleTime: 1000 * 60 * 30,
  });

  // check if selected module is compatible with the core contract and installed modules
  const isModuleCompatibleQuery = useQuery({
    queryKey: [
      "isModuleCompatible",
      contract.address,
      contract.chain.id,
      installedModuleBytecodesQuery.data,
      coreContractByteCodeQuery.data,
      selectedModule?.contractId,
      selectedModule?.bytecodeHash,
    ],
    queryFn: async () => {
      if (
        !coreContractByteCodeQuery.data ||
        !installedModuleBytecodesQuery.data ||
        !selectedModule
      ) {
        throw new Error("Unexpected error");
      }

      return isModuleCompatible({
        contractInfo: {
          bytecode: coreContractByteCodeQuery.data,
          installedModuleBytecodes: installedModuleBytecodesQuery.data,
          chain: contract.chain,
        },
        moduleInfo: {
          bytecodeUri: selectedModule.metadata.bytecodeUri,
        },
        client,
      });
    },
    retry: false,
    // 30 minutes
    staleTime: 1000 * 60 * 30,
    enabled:
      !!selectedModule &&
      !!coreContractByteCodeQuery.data &&
      !!installedModuleBytecodesQuery.data,
  });

  const selectedModuleMeta =
    watch("moduleContract") && watch("version") && watch("publisherAddress")
      ? {
          moduleName: watch("moduleContract"),
          moduleVersion: watch("version"),
          publisherAddress: watch("publisherAddress"),
        }
      : undefined;

  const moduleInstallParams = useModuleInstallParams({
    module: selectedModuleMeta,
    isQueryEnabled: !!selectedModule && !!isModuleCompatibleQuery.data,
  });

  return (
    <FormProvider {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <FormControl isInvalid={!!errors.publisherAddress}>
            <FormLabel>Publisher</FormLabel>
            <Input
              disabled={installMutation.isPending}
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
              !!errors.moduleContract || isModuleCompatibleQuery.data === false
            }
            isRequired={true}
          >
            <FormLabel>Module Name</FormLabel>
            <Skeleton
              isLoaded={!!modulesOnly.length || !isFetching}
              borderRadius="lg"
            >
              <Select
                disabled={
                  installMutation.isPending ||
                  modulesOnly?.length === 0 ||
                  isPending
                }
                bg="backgroundHighlight"
                {...moduleContractInputProps}
                onChange={(e) => {
                  // reset version when module changes
                  resetField("version");
                  moduleContractInputProps.onChange(e);
                }}
                placeholder={
                  modulesOnly.length === 0 ? "No modules" : "Select module"
                }
              >
                {modulesOnly.map(({ contractId }) => (
                  <option key={contractId} value={contractId}>
                    {contractId}
                  </option>
                ))}
              </Select>
            </Skeleton>
            <FormErrorMessage fontWeight={500}>
              {!isModuleCompatibleQuery.isFetching &&
                isModuleCompatibleQuery.data === false &&
                "Module is not compatible"}
              {errors.moduleContract?.message}
            </FormErrorMessage>

            {isModuleCompatibleQuery.isFetching && selectedModule && (
              <div className="mt-2 flex items-center gap-1.5 text-link-foreground">
                <p className="font-medium text-sm">Checking Compatibility</p>
                <Spinner className="size-3" />
              </div>
            )}

            {isModuleCompatibleQuery.isError && (
              <div className="mt-2 flex items-center gap-1.5">
                <p className="text-sm text-yellow-600">
                  Module may not be compatible
                </p>
              </div>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.version} isRequired={true}>
            <FormLabel>Module Version</FormLabel>
            <Skeleton isLoaded={!allVersions.isFetching} borderRadius="lg">
              <Select
                disabled={
                  !allVersions.data ||
                  allVersions.isPending ||
                  isModuleCompatibleQuery.data === false ||
                  installMutation.isPending ||
                  isModuleCompatibleQuery.isFetching
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
        </div>

        {moduleInstallParams.isFetching ? (
          <Skeleton h="80px" mt={4} />
        ) : (
          moduleInstallParams.data &&
          !isModuleCompatibleQuery.isFetching &&
          moduleInstallParams.data.params.length > 0 && (
            <ModuleInstallParams
              installParams={moduleInstallParams.data}
              form={form}
              disableInputs={installMutation.isPending}
            />
          )
        )}

        <Spacer h={5} />

        {/* Submit */}
        <div className="flex justify-end">
          <TransactionButton
            txChainID={contract.chain.id}
            transactionCount={1}
            isPending={installMutation.isPending}
            type="submit"
            className="self-end"
            disabled={
              !formState.isValid ||
              isModuleCompatibleQuery.data === false ||
              isModuleCompatibleQuery.isFetching
            }
          >
            Install
          </TransactionButton>
        </div>
      </form>
    </FormProvider>
  );
};

async function isModuleCompatible(options: {
  contractInfo: {
    bytecode: string;
    installedModuleBytecodes: string[];
    chain: Chain;
  };
  moduleInfo: {
    bytecodeUri: string;
  };
  client: ThirdwebClient;
}) {
  // 1. get module's bytecode
  const res = await download({
    client: options.client,
    uri: options.moduleInfo.bytecodeUri,
  });

  const moduleBytecode = await res.text();

  // 2. check compatibility with core and installed modules
  try {
    const isCompatible = await checkModulesCompatibility({
      chain: options.contractInfo.chain,
      coreBytecode: options.contractInfo.bytecode,
      client: options.client,
      moduleBytecodes: [
        moduleBytecode,
        ...options.contractInfo.installedModuleBytecodes,
      ],
    });

    return isCompatible;
  } catch (e) {
    console.error("Error during compatibility check:", e);
    throw e;
  }
}
