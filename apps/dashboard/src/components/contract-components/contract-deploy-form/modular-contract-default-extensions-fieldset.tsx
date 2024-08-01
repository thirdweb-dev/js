import { FormControl } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import { getExtensionInstalledParams } from "contract-ui/tabs/manage/components/getExtensionInstalledParams";
import invariant from "tiny-invariant";
import { FormErrorMessage, FormLabel } from "tw-components";
import type { CustomContractDeploymentForm } from "./custom-contract";
import { PrimarySaleFieldset } from "./primary-sale-fieldset";
import { RoyaltyFieldset } from "./royalty-fieldset";

type ExtensionMeta = {
  extensionName: string;
  extensionVersion: string;
  publisherAddress: string;
};

/**
 * Get the install params for all given extensions
 */
export function useModularContractsDefaultExtensionsInstallParams(props: {
  defaultExtensions?: ExtensionMeta[];
  isQueryEnabled: boolean;
}) {
  const { defaultExtensions, isQueryEnabled } = props;
  return useQuery({
    queryKey: [
      "useModularContractsDefaultExtensionsInstallParams",
      defaultExtensions,
    ],
    queryFn: async () => {
      invariant(defaultExtensions, "defaultExtensions must be defined");
      return Promise.all(defaultExtensions.map(getExtensionInstalledParams));
    },
    enabled: !!(isQueryEnabled && defaultExtensions),
    refetchOnWindowFocus: false,
  });
}

export type UseModularContractsDefaultExtensionsInstallParams = ReturnType<
  typeof useModularContractsDefaultExtensionsInstallParams
>;

type Extensions = NonNullable<
  UseModularContractsDefaultExtensionsInstallParams["data"]
>;

type ExtensionWithIndex = Extensions[number] & { extensionIndex: number };

export function ModularContractDefaultExtensionsFieldset(props: {
  extensions: Extensions;
  form: CustomContractDeploymentForm;
  isTWPublisher: boolean;
}) {
  // save the index of the extension before filtering out
  const extensionsWithIndex: ExtensionWithIndex[] = props.extensions
    .map((v, i) => ({
      ...v,
      extensionIndex: i,
    }))
    .filter((v) => v.params.length > 0);

  return (
    <div className="py-4">
      <div className="flex flex-col gap-4">
        {extensionsWithIndex.map((ext) => {
          return (
            <RenderExtension
              key={ext.extensionName}
              extension={ext}
              isTWPublisher={props.isTWPublisher}
              form={props.form}
            />
          );
        })}
      </div>
    </div>
  );
}

function RenderExtension(props: {
  extension: ExtensionWithIndex;
  form: CustomContractDeploymentForm;
  isTWPublisher: boolean;
}) {
  const { extension, form } = props;

  // only consider mapping if published by thirdweb, else show the generic form
  if (props.isTWPublisher) {
    const paramNames = extension.params.map((param) => param.name);

    if (showRoyaltyFieldset(paramNames)) {
      return (
        <RenderRoyaltyFieldset
          extension={extension}
          form={form}
          isTWPublisher
        />
      );
    }

    if (showPrimarySaleFiedset(paramNames)) {
      return (
        <RenderPrimarySaleFieldset
          extension={extension}
          form={form}
          isTWPublisher
        />
      );
    }
  }

  return (
    <div>
      <h3 className="text-lg mb-2 text-secondary-foreground font-medium">
        {extension.extensionName}
      </h3>
      <div className="flex flex-col gap-3">
        {extension.params.map((param) => {
          const formFieldKey =
            `modularContractDefaultExtensionsInstallParams.${extension.extensionIndex}.${param.name}` as const;

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
  extension: ExtensionWithIndex;
  form: CustomContractDeploymentForm;
  isTWPublisher: boolean;
}) {
  const { extension, form } = prosp;

  const primarySaleRecipientPath =
    `modularContractDefaultExtensionsInstallParams.${extension.extensionIndex}.primarySaleRecipient` as const;

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
  extension: ExtensionWithIndex;
  form: CustomContractDeploymentForm;
  isTWPublisher: boolean;
}) {
  const { extension: ext, form } = props;

  const royaltyRecipientPath =
    `modularContractDefaultExtensionsInstallParams.${ext.extensionIndex}.royaltyRecipient` as const;

  const royaltyBpsPath =
    `modularContractDefaultExtensionsInstallParams.${ext.extensionIndex}.royaltyBps` as const;

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
