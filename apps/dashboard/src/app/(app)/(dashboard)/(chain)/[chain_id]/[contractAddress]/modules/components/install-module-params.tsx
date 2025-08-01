import { useQuery } from "@tanstack/react-query";
import type { ThirdwebClient } from "thirdweb";
import invariant from "tiny-invariant";
import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { SolidityInput } from "@/components/solidity-inputs";
import { getModuleInstalledParams } from "./getModuleInstalledParams";
import type { InstallModuleForm } from "./ModuleForm";

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
  client: ThirdwebClient;
}) {
  const { module, isQueryEnabled, client } = props;
  return useQuery({
    enabled: !!(isQueryEnabled && module),
    queryFn: async () => {
      invariant(module, "module must be defined");
      return await getModuleInstalledParams(module, client);
    },
    queryKey: ["useModuleInstallParams", module],
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
            <FormFieldSetup
              key={formFieldKey}
              isRequired
              label={param.name}
              errorMessage={
                form.getFieldState(formFieldKey, form.formState).error?.message
              }
            >
              <SolidityInput
                // @ts-expect-error - old types, need to update
                solidityComponents={
                  "components" in param ? param.components : undefined
                }
                solidityType={param.type}
                variant="filled"
                {...form.register(formFieldKey)}
                isDisabled={props.disableInputs}
              />
            </FormFieldSetup>
          );
        })}
      </div>
    </div>
  );
}
