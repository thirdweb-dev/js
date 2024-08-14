import { FormControl } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import { getModuleInstalledParams } from "contract-ui/tabs/manage/components/getModuleInstalledParams";
import invariant from "tiny-invariant";
import { FormErrorMessage, FormLabel } from "tw-components";
import type { CustomContractDeploymentForm } from "./custom-contract";
import { PrimarySaleFieldset } from "./primary-sale-fieldset";
import { RoyaltyFieldset } from "./royalty-fieldset";

type ModuleMeta = {
  moduleName: string;
  moduleVersion: string;
  publisherAddress: string;
};

/**
 * Get the install params for all given modules
 */
export function useModularContractsDefaultModulesInstallParams(props: {
  defaultModules?: ModuleMeta[];
  isQueryEnabled: boolean;
}) {
  const { defaultModules, isQueryEnabled } = props;
  return useQuery({
    queryKey: [
      "useModularContractsDefaultModulesInstallParams",
      defaultModules,
    ],
    queryFn: async () => {
      invariant(defaultModules, "defaultModules must be defined");
      return Promise.all(defaultModules.map(getModuleInstalledParams));
    },
    enabled: !!(isQueryEnabled && defaultModules),
    refetchOnWindowFocus: false,
  });
}

export type UseModularContractsDefaultModulesInstallParams = ReturnType<
  typeof useModularContractsDefaultModulesInstallParams
>;

type Modules = NonNullable<
  UseModularContractsDefaultModulesInstallParams["data"]
>;

type ModuleWithIndex = Modules[number] & { moduleIndex: number };

export function ModularContractDefaultModulesFieldset(props: {
  modules: Modules;
  form: CustomContractDeploymentForm;
  isTWPublisher: boolean;
}) {
  // save the index of the module before filtering out
  const modulesWithIndex: ModuleWithIndex[] = props.modules
    .map((v, i) => ({
      ...v,
      moduleIndex: i,
    }))
    .filter((v) => v.params.length > 0);

  return (
    <div className="py-4">
      <div className="flex flex-col gap-4">
        {modulesWithIndex.map((ext) => {
          return (
            <RenderModule
              key={ext.moduleName}
              module={ext}
              isTWPublisher={props.isTWPublisher}
              form={props.form}
            />
          );
        })}
      </div>
    </div>
  );
}

function RenderModule(props: {
  module: ModuleWithIndex;
  form: CustomContractDeploymentForm;
  isTWPublisher: boolean;
}) {
  const { module, form } = props;

  // only consider mapping if published by thirdweb, else show the generic form
  if (props.isTWPublisher) {
    const paramNames = module.params.map((param) => param.name);

    if (showRoyaltyFieldset(paramNames)) {
      return (
        <RenderRoyaltyFieldset module={module} form={form} isTWPublisher />
      );
    }

    if (showPrimarySaleFiedset(paramNames)) {
      return (
        <RenderPrimarySaleFieldset module={module} form={form} isTWPublisher />
      );
    }
  }

  return (
    <div>
      <h3 className="text-lg mb-2 text-secondary-foreground font-medium">
        {module.moduleName}
      </h3>
      <div className="flex flex-col gap-3">
        {module.params.map((param) => {
          const formFieldKey =
            `modularContractDefaultModulesInstallParams.${module.moduleIndex}.${param.name}` as const;

          return (
            <FormControl
              key={formFieldKey}
              isRequired
              isInvalid={
                !!form.getFieldState(formFieldKey, form.formState).error
              }
            >
              <FormLabel> {param.name}</FormLabel>
              <SolidityInput
                solidityType={param.type}
                solidityComponents={param.components}
                variant="filled"
                {...form.register(formFieldKey)}
              />
              <FormErrorMessage>
                {
                  form.getFieldState(formFieldKey, form.formState).error
                    ?.message
                }
              </FormErrorMessage>
            </FormControl>
          );
        })}
      </div>
    </div>
  );
}

function RenderPrimarySaleFieldset(prosp: {
  module: ModuleWithIndex;
  form: CustomContractDeploymentForm;
  isTWPublisher: boolean;
}) {
  const { module, form } = prosp;

  const primarySaleRecipientPath =
    `modularContractDefaultModulesInstallParams.${module.moduleIndex}.primarySaleRecipient` as const;

  return (
    <PrimarySaleFieldset
      isInvalid={
        !!form.getFieldState(primarySaleRecipientPath, form.formState).error
      }
      register={form.register(primarySaleRecipientPath)}
      errorMessage={
        form.getFieldState(primarySaleRecipientPath, form.formState).error
          ?.message
      }
    />
  );
}

function RenderRoyaltyFieldset(props: {
  module: ModuleWithIndex;
  form: CustomContractDeploymentForm;
  isTWPublisher: boolean;
}) {
  const { module: ext, form } = props;

  const royaltyRecipientPath =
    `modularContractDefaultModulesInstallParams.${ext.moduleIndex}.royaltyRecipient` as const;

  const royaltyBpsPath =
    `modularContractDefaultModulesInstallParams.${ext.moduleIndex}.royaltyBps` as const;

  return (
    <RoyaltyFieldset
      royaltyRecipient={{
        isInvalid: !!form.getFieldState(royaltyRecipientPath, form.formState)
          .error,
        register: form.register(royaltyRecipientPath, {
          required: "Required",
        }),
        errorMessage: form.getFieldState(royaltyRecipientPath, form.formState)
          .error?.message,
      }}
      royaltyBps={{
        isInvalid: !!form.getFieldState(royaltyBpsPath, form.formState).error,
        value: form.watch(royaltyBpsPath) || "0",
        setValue: (value) =>
          form.setValue(royaltyBpsPath, value, {
            shouldTouch: true,
          }),
        errorMessage: form.getFieldState(royaltyBpsPath, form.formState).error
          ?.message,
      }}
    />
  );
}

export function showRoyaltyFieldset(paramNames: string[]) {
  return (
    paramNames.length === 2 &&
    paramNames.includes("royaltyRecipient") &&
    paramNames.includes("royaltyBps")
  );
}

export function showPrimarySaleFiedset(paramNames: string[]) {
  return paramNames.length === 1 && paramNames.includes("primarySaleRecipient");
}
