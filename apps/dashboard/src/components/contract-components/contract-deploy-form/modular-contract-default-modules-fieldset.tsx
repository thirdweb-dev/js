import { FormControl } from "@chakra-ui/react";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import { useMemo } from "react";
import type { FetchDeployMetadataResult } from "thirdweb/contract";
import { FormErrorMessage, FormLabel } from "tw-components";
import type { CustomContractDeploymentForm } from "./custom-contract";
import { PrimarySaleFieldset } from "./primary-sale-fieldset";
import { RoyaltyFieldset } from "./royalty-fieldset";
import { SequentialTokenIdFieldset } from "./sequential-token-id-fieldset";

export function getModuleInstallParams(mod: FetchDeployMetadataResult) {
  return (
    mod.abi
      .filter((a) => a.type === "function")
      .find((f) => f.name === "encodeBytesOnInstall")?.inputs || []
  );
}

export function ModularContractDefaultModulesFieldset(props: {
  modules: FetchDeployMetadataResult[];
  form: CustomContractDeploymentForm;
  isTWPublisher: boolean;
}) {
  return (
    <div className="py-4">
      <div className="flex flex-col gap-4">
        {props.modules.map((mod) => {
          return (
            <RenderModule
              key={mod.name}
              module={mod}
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
  module: FetchDeployMetadataResult;
  form: CustomContractDeploymentForm;
  isTWPublisher: boolean;
}) {
  const { module, form } = props;

  const params = useMemo(() => getModuleInstallParams(module), [module]);

  if (params.length === 0) {
    // if a module has no params, don't render anything
    return null;
  }

  // only consider mapping if published by thirdweb, else show the generic form
  if (props.isTWPublisher) {
    const paramNames = params.map((p) => p.name).filter((n) => n !== undefined);

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

    if (showSequentialTokenIdFieldset(paramNames)) {
      return (
        <RenderSequentialTokenIdFieldset
          module={module}
          form={form}
          isTWPublisher
        />
      );
    }
  }

  return (
    <div>
      <h3 className="mb-2 font-medium text-lg text-muted-foreground">
        {module.name}
      </h3>
      <div className="flex flex-col gap-3">
        {params.map((param) => {
          const formFieldKey =
            `moduleData.${module.name}.${param.name}` as const;

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
                // @ts-expect-error - old types, need to update
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
  module: FetchDeployMetadataResult;
  form: CustomContractDeploymentForm;
  isTWPublisher: boolean;
}) {
  const { module, form } = prosp;

  const primarySaleRecipientPath =
    `moduleData.${module.name}.primarySaleRecipient` as const;

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

function RenderSequentialTokenIdFieldset(prosp: {
  module: FetchDeployMetadataResult;
  form: CustomContractDeploymentForm;
  isTWPublisher: boolean;
}) {
  const { module, form } = prosp;

  const startTokenIdPath = `moduleData.${module.name}.startTokenId` as const;

  return (
    <SequentialTokenIdFieldset
      isInvalid={!!form.getFieldState(startTokenIdPath, form.formState).error}
      register={form.register(startTokenIdPath)}
      errorMessage={
        form.getFieldState(startTokenIdPath, form.formState).error?.message
      }
    />
  );
}

function RenderRoyaltyFieldset(props: {
  module: FetchDeployMetadataResult;
  form: CustomContractDeploymentForm;
  isTWPublisher: boolean;
}) {
  const { module, form } = props;

  const royaltyRecipientPath =
    `moduleData.${module.name}.royaltyRecipient` as const;

  const royaltyBpsPath = `moduleData.${module.name}.royaltyBps` as const;

  const transferValidatorPath =
    `moduleData.${module.name}.transferValidator` as const;

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
      transferValidator={{
        isInvalid: !!form.getFieldState(transferValidatorPath, form.formState)
          .error,
        register: form.register(transferValidatorPath, {
          required: "Required",
        }),
        errorMessage: form.getFieldState(transferValidatorPath, form.formState)
          .error?.message,
      }}
    />
  );
}

export function showRoyaltyFieldset(paramNames: string[]) {
  return (
    paramNames.length === 3 &&
    paramNames.includes("royaltyRecipient") &&
    paramNames.includes("royaltyBps") &&
    paramNames.includes("transferValidator")
  );
}

export function showPrimarySaleFiedset(paramNames: string[]) {
  return paramNames.length === 1 && paramNames.includes("primarySaleRecipient");
}

export function showSuperchainBridgeFieldset(paramNames: string[]) {
  return paramNames.length === 1 && paramNames.includes("superchainBridge");
}

function showSequentialTokenIdFieldset(paramNames: string[]) {
  return paramNames.length === 1 && paramNames.includes("startTokenId");
}
