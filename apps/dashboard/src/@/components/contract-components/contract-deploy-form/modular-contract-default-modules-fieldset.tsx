import { useMemo } from "react";
import type { ThirdwebClient } from "thirdweb";
import type { FetchDeployMetadataResult } from "thirdweb/contract";
import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { SolidityInput } from "@/components/solidity-inputs";
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
  client: ThirdwebClient;
}) {
  return (
    <div className="flex flex-col gap-8">
      {props.modules.map((mod) => {
        return (
          <RenderModule
            client={props.client}
            form={props.form}
            isTWPublisher={props.isTWPublisher}
            key={mod.name}
            module={mod}
          />
        );
      })}
    </div>
  );
}

function RenderModule(props: {
  module: FetchDeployMetadataResult;
  form: CustomContractDeploymentForm;
  isTWPublisher: boolean;
  client: ThirdwebClient;
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
        <RenderRoyaltyFieldset
          client={props.client}
          form={form}
          isTWPublisher
          module={module}
        />
      );
    }

    if (showPrimarySaleFieldset(paramNames)) {
      return (
        <RenderPrimarySaleFieldset
          client={props.client}
          form={form}
          isTWPublisher
          module={module}
        />
      );
    }

    if (showSequentialTokenIdFieldset(paramNames)) {
      return (
        <RenderSequentialTokenIdFieldset
          client={props.client}
          form={form}
          isTWPublisher
          module={module}
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
            <FormFieldSetup
              key={formFieldKey}
              htmlFor={formFieldKey}
              label={param.name}
              isRequired={true}
              errorMessage={
                form.getFieldState(formFieldKey, form.formState).error?.message
              }
            >
              <SolidityInput
                client={props.client}
                // @ts-expect-error - old types, need to update
                solidityComponents={param.components}
                solidityType={param.type}
                {...form.register(formFieldKey)}
              />
            </FormFieldSetup>
          );
        })}
      </div>
    </div>
  );
}

function RenderPrimarySaleFieldset(props: {
  module: FetchDeployMetadataResult;
  form: CustomContractDeploymentForm;
  isTWPublisher: boolean;
  client: ThirdwebClient;
}) {
  const { module, form, client } = props;

  const primarySaleRecipientPath =
    `moduleData.${module.name}.primarySaleRecipient` as const;

  return (
    <PrimarySaleFieldset
      client={client}
      errorMessage={
        form.getFieldState(primarySaleRecipientPath, form.formState).error
          ?.message
      }
      isInvalid={
        !!form.getFieldState(primarySaleRecipientPath, form.formState).error
      }
      register={form.register(primarySaleRecipientPath)}
    />
  );
}

function RenderSequentialTokenIdFieldset(props: {
  module: FetchDeployMetadataResult;
  form: CustomContractDeploymentForm;
  isTWPublisher: boolean;
  client: ThirdwebClient;
}) {
  const { module, form, client } = props;

  const startTokenIdPath = `moduleData.${module.name}.startTokenId` as const;

  return (
    <SequentialTokenIdFieldset
      client={client}
      errorMessage={
        form.getFieldState(startTokenIdPath, form.formState).error?.message
      }
      isInvalid={!!form.getFieldState(startTokenIdPath, form.formState).error}
      register={form.register(startTokenIdPath)}
    />
  );
}

function RenderRoyaltyFieldset(props: {
  module: FetchDeployMetadataResult;
  form: CustomContractDeploymentForm;
  isTWPublisher: boolean;
  client: ThirdwebClient;
}) {
  const { module, form } = props;

  const royaltyRecipientPath =
    `moduleData.${module.name}.royaltyRecipient` as const;

  const royaltyBpsPath = `moduleData.${module.name}.royaltyBps` as const;

  const transferValidatorPath =
    `moduleData.${module.name}.transferValidator` as const;

  return (
    <RoyaltyFieldset
      client={props.client}
      royaltyBps={{
        errorMessage: form.getFieldState(royaltyBpsPath, form.formState).error
          ?.message,
        isInvalid: !!form.getFieldState(royaltyBpsPath, form.formState).error,
        setValue: (value) =>
          form.setValue(royaltyBpsPath, value, {
            shouldTouch: true,
          }),
        value: form.watch(royaltyBpsPath) || "0",
      }}
      royaltyRecipient={{
        errorMessage: form.getFieldState(royaltyRecipientPath, form.formState)
          .error?.message,
        isInvalid: !!form.getFieldState(royaltyRecipientPath, form.formState)
          .error,
        register: form.register(royaltyRecipientPath, {
          required: "Required",
        }),
      }}
      transferValidator={{
        errorMessage: form.getFieldState(transferValidatorPath, form.formState)
          .error?.message,
        isInvalid: !!form.getFieldState(transferValidatorPath, form.formState)
          .error,
        register: form.register(transferValidatorPath, {
          required: "Required",
        }),
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

export function showPrimarySaleFieldset(paramNames: string[]) {
  return paramNames.length === 1 && paramNames.includes("primarySaleRecipient");
}

function showSequentialTokenIdFieldset(paramNames: string[]) {
  return paramNames.length === 1 && paramNames.includes("startTokenId");
}

export function showSuperchainBridgeFieldset(paramNames: string[]) {
  return paramNames.length === 1 && paramNames.includes("superchainBridge");
}
