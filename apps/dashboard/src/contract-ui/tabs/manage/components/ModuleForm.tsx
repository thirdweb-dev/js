import { Spinner } from "@/components/ui/Spinner/Spinner";
import { thirdwebClient } from "@/constants/client";
import { FormControl, Input, Select, Skeleton, Spacer } from "@chakra-ui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { compatibleModules } from "@thirdweb-dev/sdk";
import { TransactionButton } from "components/buttons/TransactionButton";
import {
  useAllVersions,
  usePublishedContractsQuery,
} from "components/contract-components/hooks";
import { FormProvider, type UseFormReturn, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  type ContractOptions,
  sendTransaction,
  waitForReceipt,
} from "thirdweb";
import { installPublishedModule } from "thirdweb/extensions/modular";
import { download } from "thirdweb/storage";
import { encodeAbiParameters, resolveImplementation } from "thirdweb/utils";
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

export type InstallModuleFormProps = {
  contract: ContractOptions;
  refetchModules: () => void;
  account: Account;
  installedModules: {
    data?: string[];
    isLoading: boolean;
  };
};

export type InstallModuleForm = UseFormReturn<FormData>;

export const InstallModuleForm = (props: InstallModuleFormProps) => {
  const form = useForm<FormData>({
    defaultValues: {
      version: "latest",
    },
  });
  const { register, watch, formState, resetField, reset } = form;
  const { contract, account } = props;
  const { errors } = formState;

  const publishedContractsQuery = usePublishedContractsQuery(
    watch("publisherAddress"),
    "ModularModule",
  );
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
        chain: contract.chain,
        client: contract.client,
        account,
        moduleName: watch("moduleContract"),
        publisherAddress: watch("publisherAddress"),
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

  const selectedModule = publishedContractsQuery.data?.find(
    (x) => x.id === watch("moduleContract"),
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
            client: thirdwebClient,
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
      selectedModule,
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
          chainId: contract.chain.id,
        },
        moduleInfo: {
          bytecodeUri: selectedModule.metadata.bytecodeUri,
        },
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
              !!errors.moduleContract || isModuleCompatibleQuery.data === false
            }
            isRequired={true}
          >
            <FormLabel>Module Name</FormLabel>
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
                {...moduleContractInputProps}
                onChange={(e) => {
                  // reset version when module changes
                  resetField("version");
                  moduleContractInputProps.onChange(e);
                }}
                placeholder={
                  publishedContractsQuery.data?.length === 0
                    ? "No modules"
                    : "Select module"
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
              {!isModuleCompatibleQuery.isFetching &&
                isModuleCompatibleQuery.data === false &&
                "Module is not compatible"}
              {errors.moduleContract?.message}
            </FormErrorMessage>

            {isModuleCompatibleQuery.isFetching && selectedModule && (
              <div className="flex items-center gap-1.5 mt-2 text-link-foreground">
                <p className="font-medium text-sm">Checking Compatibility</p>
                <Spinner className="size-3" />
              </div>
            )}

            {isModuleCompatibleQuery.isError && (
              <div className="flex items-center gap-1.5 mt-2">
                <p className="text-yellow-600 text-sm">
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
                  allVersions.isLoading ||
                  isModuleCompatibleQuery.data === false ||
                  installMutation.isLoading ||
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
          <Skeleton h={"80px"} mt={4} />
        ) : (
          moduleInstallParams.data &&
          !isModuleCompatibleQuery.isFetching &&
          moduleInstallParams.data.params.length > 0 && (
            <ModuleInstallParams
              installParams={moduleInstallParams.data}
              form={form}
              disableInputs={installMutation.isLoading}
            />
          )
        )}

        <Spacer h={5} />

        {/* Submit */}
        <div className="flex justify-end">
          <TransactionButton
            transactionCount={1}
            isLoading={installMutation.isLoading}
            type="submit"
            colorScheme="primary"
            alignSelf="flex-end"
            isDisabled={
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
    chainId: number;
  };
  moduleInfo: {
    bytecodeUri: string;
  };
}) {
  // 1. get module's bytecode
  const res = await download({
    client: thirdwebClient,
    uri: options.moduleInfo.bytecodeUri,
  });

  const moduleBytecode = await res.text();

  // 2. check compatibility with core and installed modules
  try {
    const isCompatible = await compatibleModules(
      options.contractInfo.bytecode,
      [...options.contractInfo.installedModuleBytecodes, moduleBytecode],
      options.contractInfo.chainId,
    );

    return isCompatible;
  } catch (e) {
    console.error("Error during compatibility check:", e);
    throw e;
  }
}
