import { useThirdwebClient } from "@/constants/thirdweb.client";
import { FormControl } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import invariant from "tiny-invariant";
import { FormErrorMessage, FormLabel } from "tw-components";
import type { InstallModuleForm } from "./ModuleForm";
import { getModuleInstalledParams } from "./getModuleInstalledParams";

export type ModuleMeta = {
  moduleName: string;
  moduleVersion: string;
  publisherAddress: string;
};

/**
 * Get the install params for the "encodeBytesOnInstall" function for all given modules for a given modular contract
 * to render the form in deploy contract form
 */
export function useModuleInstallParams(props: {
  module?: ModuleMeta;
  isQueryEnabled: boolean;
}) {
  const client = useThirdwebClient();
  const { module, isQueryEnabled } = props;
  return useQuery({
    queryKey: ["useModuleInstallParams", module],
    queryFn: async () => {
      invariant(module, "module must be defined");
      return await getModuleInstalledParams(module, client);
    },
    enabled: !!(isQueryEnabled && module),
    refetchOnWindowFocus: false,
  });
}

export function ModuleInstallParams(props: {
  installParams: NonNullable<ReturnType<typeof useModuleInstallParams>["data"]>;
  form: InstallModuleForm;
  disableInputs: boolean;
}) {
  const { form } = props;

  return (
    <div className="py-4">
      <div className="flex flex-col gap-3">
        {props.installParams.params.map((param) => {
          const formFieldKey = `moduleInstallFormParams.${param.name}` as const;

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
                solidityComponents={
                  "components" in param ? param.components : undefined
                }
                variant="filled"
                {...form.register(formFieldKey)}
                isDisabled={props.disableInputs}
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
