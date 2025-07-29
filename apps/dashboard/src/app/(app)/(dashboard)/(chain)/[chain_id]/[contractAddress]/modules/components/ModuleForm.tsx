"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { FormProvider, type UseFormReturn, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  type Chain,
  getContract,
  sendTransaction,
  type ThirdwebClient,
  type ThirdwebContract,
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
import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { TransactionButton } from "@/components/tx-button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAllVersions,
  usePublishedContractsQuery,
} from "@/hooks/contract-hooks";
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
  contract: ThirdwebContract;
  refetchModules: () => void;
  account: Account;
  installedModules: {
    data?: string[];
    isPending: boolean;
  };
  isLoggedIn: boolean;
};

export type InstallModuleForm = UseFormReturn<FormData>;

export const InstallModuleForm = (props: InstallModuleFormProps) => {
  const form = useForm<FormData>({
    defaultValues: {
      publisherAddress: "0xdd99b75f095d0c4d5112aCe938e4e6ed962fb024", // thirdweb publisher address
      version: "latest",
    },
  });
  const { register, watch, formState, resetField, reset, setValue } = form;
  const { contract, account } = props;
  const { errors } = formState;

  const { data, isPending, isFetching } = usePublishedContractsQuery({
    address: watch("publisherAddress"),
    client: contract.client,
  });

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
    contract.client,
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
        account,
        contract,
        moduleData,
        moduleName: watch("moduleContract"),
        publisher: watch("publisherAddress"),
        version: watch("version"),
      });

      const txResult = await sendTransaction({
        account,
        transaction: installTransaction,
      });

      await waitForReceipt(txResult);
    },
    onError(err) {
      toast.error("Failed to install module");
      console.error("Error during installation:", err);
    },
    onSuccess() {
      props.refetchModules();
      toast.success("Module installed successfully");
      // clear form
      reset({
        moduleContract: "",
        moduleInstallFormParams: undefined,
        publisherAddress: "",
        version: "latest",
      });
    },
  });

  const onSubmit = async () => {
    installMutation.mutate();
  };

  const selectedModule = modulesOnly?.find(
    (x) => x.contractId === watch("moduleContract"),
  );

  // Get core contract bytecode
  const coreContractByteCodeQuery = useQuery({
    queryFn: async () => {
      const coreImplementation = await resolveImplementation(contract);
      return coreImplementation.bytecode;
    },
    queryKey: ["getBytecode", contract.address, contract.chain.id],
    retry: false,
    // 30 minutes
    // staleTime: 1000 * 60 * 30,
  });

  // Get Installed module bytecodes
  const installedModuleBytecodesQuery = useQuery({
    enabled: !!props.installedModules.data,
    queryFn: async () => {
      const moduleAddress = props.installedModules.data;
      if (!moduleAddress) {
        return [];
      }

      return Promise.all(
        moduleAddress.map(async (address) => {
          const result = await resolveImplementation(
            getContract({
              address,
              chain: contract.chain,
              client: contract.client,
            }),
          );

          if (!result) {
            throw new Error("Failed to fetch bytecode for module");
          }

          return result.bytecode;
        }),
      );
    },
    queryKey: [
      "installedModuleBytecodes",
      contract.address,
      contract.chain.id,
      props.installedModules.data,
    ],
    retry: false,
    // 30 minutes
    staleTime: 1000 * 60 * 30,
  });

  // check if selected module is compatible with the core contract and installed modules
  const isModuleCompatibleQuery = useQuery({
    enabled:
      !!selectedModule &&
      !!coreContractByteCodeQuery.data &&
      !!installedModuleBytecodesQuery.data,
    queryFn: async () => {
      if (
        !coreContractByteCodeQuery.data ||
        !installedModuleBytecodesQuery.data ||
        !selectedModule
      ) {
        throw new Error("Unexpected error");
      }

      return isModuleCompatible({
        client: contract.client,
        contractInfo: {
          bytecode: coreContractByteCodeQuery.data,
          chain: contract.chain,
          installedModuleBytecodes: installedModuleBytecodesQuery.data,
        },
        moduleInfo: {
          bytecodeUri: selectedModule.metadata.bytecodeUri,
        },
      });
    },
    queryKey: [
      "isModuleCompatible",
      contract.address,
      contract.chain.id,
      installedModuleBytecodesQuery.data,
      coreContractByteCodeQuery.data,
      selectedModule?.contractId,
      selectedModule?.bytecodeHash,
    ],
    retry: false,
    // 30 minutes
    staleTime: 1000 * 60 * 30,
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
    client: contract.client,
    isQueryEnabled: !!selectedModule && !!isModuleCompatibleQuery.data,
    module: selectedModuleMeta,
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
          <FormFieldSetup
            htmlFor="publisherAddress"
            label="Publisher"
            errorMessage={errors.publisherAddress?.message}
            isRequired={true}
          >
            <Input
              id="publisherAddress"
              disabled={installMutation.isPending}
              placeholder="Publisher address"
              {...register("publisherAddress", {
                required: "Publisher address is required",
              })}
            />
          </FormFieldSetup>

          <FormFieldSetup
            htmlFor="moduleContract"
            label="Module Name"
            errorMessage={
              !isModuleCompatibleQuery.isFetching &&
              isModuleCompatibleQuery.data === false
                ? "Module is not compatible"
                : errors.moduleContract?.message
            }
            isRequired={true}
          >
            {!modulesOnly.length && isFetching ? (
              <Skeleton className="h-10 w-full rounded-md" />
            ) : (
              <Select
                disabled={
                  installMutation.isPending ||
                  modulesOnly?.length === 0 ||
                  isPending
                }
                value={watch("moduleContract")}
                onValueChange={(value) => {
                  setValue("moduleContract", value);
                  // reset version when module changes
                  resetField("version");
                }}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      modulesOnly.length === 0 ? "No modules" : "Select module"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {modulesOnly.map(({ contractId }) => (
                    <SelectItem key={contractId} value={contractId}>
                      {contractId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

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
          </FormFieldSetup>

          <FormFieldSetup
            htmlFor="version"
            label="Module Version"
            errorMessage={errors.version?.message}
            isRequired={true}
          >
            {allVersions.isFetching ? (
              <Skeleton className="h-10 w-full rounded-md" />
            ) : (
              <Select
                disabled={
                  !allVersions.data ||
                  allVersions.isPending ||
                  isModuleCompatibleQuery.data === false ||
                  installMutation.isPending ||
                  isModuleCompatibleQuery.isFetching
                }
                value={watch("version")}
                onValueChange={(value) => setValue("version", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select version" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest</SelectItem>
                  {allVersions?.data?.map(({ version }) => {
                    if (!version) {
                      return null;
                    }

                    return (
                      <SelectItem key={version} value={version}>
                        {version}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )}
          </FormFieldSetup>
        </div>

        {moduleInstallParams.isFetching ? (
          <Skeleton className="h-20 w-full mt-4" />
        ) : (
          moduleInstallParams.data &&
          !isModuleCompatibleQuery.isFetching &&
          moduleInstallParams.data.params.length > 0 && (
            <ModuleInstallParams
              disableInputs={installMutation.isPending}
              form={form}
              installParams={moduleInstallParams.data}
            />
          )
        )}

        <div className="h-5" />

        {/* Submit */}
        <div className="flex justify-end">
          <TransactionButton
            className="self-end"
            client={contract.client}
            disabled={
              !formState.isValid ||
              isModuleCompatibleQuery.data === false ||
              isModuleCompatibleQuery.isFetching
            }
            isLoggedIn={props.isLoggedIn}
            isPending={installMutation.isPending}
            transactionCount={1}
            txChainID={contract.chain.id}
            type="submit"
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
      client: options.client,
      coreBytecode: options.contractInfo.bytecode,
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
