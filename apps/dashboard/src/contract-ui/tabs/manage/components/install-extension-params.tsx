import { FormControl } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import invariant from "tiny-invariant";
import { FormErrorMessage, FormLabel } from "tw-components";
import { SolidityInput } from "../../../components/solidity-inputs";
import type { InstallExtensionForm } from "./ExtensionForm";
import { getExtensionInstalledParams } from "./getExtensionInstalledParams";

export type ExtensionMeta = {
  extensionName: string;
  extensionVersion: string;
  publisherAddress: string;
};

/**
 * Get the install params for the "encodeBytesOnInstall" function for all given extensions for a given modular contract
 * to render the form in deploy contract form
 */
export function useExtensionInstallParams(props: {
  extension?: ExtensionMeta;
  isQueryEnabled: boolean;
}) {
  const { extension, isQueryEnabled } = props;
  return useQuery({
    queryKey: ["useExtensionInstallParams", extension],
    queryFn: async () => {
      invariant(extension, "extension must be defined");
      return await getExtensionInstalledParams(extension);
    },
    enabled: !!(isQueryEnabled && extension),
    refetchOnWindowFocus: false,
  });
}

export function ExtensionInstallParams(props: {
  installParams: NonNullable<
    ReturnType<typeof useExtensionInstallParams>["data"]
  >;
  form: InstallExtensionForm;
  disableInputs: boolean;
}) {
  const { form } = props;

  return (
    <div className="py-4">
      <div className="flex flex-col gap-3">
        {props.installParams.params.map((param) => {
          const formFieldKey = `extensionIntallParams.${param.name}` as const;

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
