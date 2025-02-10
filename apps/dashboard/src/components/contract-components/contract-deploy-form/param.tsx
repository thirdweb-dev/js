import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import { camelToTitle } from "contract-ui/components/solidity-inputs/helpers";
import { useFormContext } from "react-hook-form";

interface ParamProps {
  paramKey: string;
  isRequired: boolean;
  inputClassName?: string;
  extraMetadataParam?: {
    displayName?: string;
    description?: string;
  };
  deployParam?: {
    type: string;
    name?: string;
  };
}

export const Param: React.FC<ParamProps> = ({
  paramKey,
  extraMetadataParam,
  deployParam,
  isRequired,
  inputClassName,
}) => {
  const form = useFormContext();

  if (!deployParam) {
    return null;
  }

  return (
    <FormFieldSetup
      isRequired={isRequired}
      key={paramKey}
      errorMessage={
        form.getFieldState(`deployParams.${paramKey}`, form.formState).error
          ?.message
      }
      className="relative"
      label={
        <span className="inline-flex gap-1 align-baseline">
          {extraMetadataParam?.displayName
            ? extraMetadataParam.displayName
            : paramKey === "*"
              ? "Unnamed"
              : camelToTitle(paramKey)}
          <span className="font-normal text-muted-foreground">
            ({paramKey})
          </span>
        </span>
      }
      helperText={extraMetadataParam?.description}
    >
      <span className="absolute top-0.5 right-0 text-muted-foreground text-sm">
        {deployParam.type}
      </span>
      <SolidityInput
        solidityType={deployParam.type}
        className={inputClassName}
        {...form.register(`deployParams.${paramKey}`)}
      />
    </FormFieldSetup>
  );
};
