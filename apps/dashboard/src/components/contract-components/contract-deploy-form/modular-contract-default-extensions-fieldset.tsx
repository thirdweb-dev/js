import { FormControl } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import { getExtensionInstalledParams } from "contract-ui/tabs/manage/components/getExtensionInstalledParams";
import invariant from "tiny-invariant";
import { FormErrorMessage, FormLabel } from "tw-components";
import type { CustomContractDeploymentForm } from "./custom-contract";

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

export function ModularContractDefaultExtensionsFieldset(props: {
  installParams: NonNullable<
    UseModularContractsDefaultExtensionsInstallParams["data"]
  >;
  form: CustomContractDeploymentForm;
}) {
  const { form } = props;

  // save the index of the extension before filtering out
  const installParams = props.installParams
    .map((v, i) => ({
      ...v,
      extensionIndex: i,
    }))
    .filter((v) => v.params.length > 0);

  return (
    <div className="py-4">
      <div className="flex flex-col gap-6">
        {installParams.map((ext) => {
          return (
            <div key={ext.extensionName}>
              <h3 className="text-lg mb-4">{ext.extensionName}</h3>
              <div className="flex flex-col gap-3">
                {ext.params.map((param) => {
                  const formFieldKey =
                    `modularContractDefaultExtensionsInstallParams.${ext.extensionIndex}.${param.name}` as const;

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
        })}
      </div>
    </div>
  );
}
