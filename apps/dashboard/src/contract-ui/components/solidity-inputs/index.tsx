import { Input } from "@/components/ui/input";
import { forwardRef } from "react";
import { type UseFormReturn, useFormContext } from "react-hook-form";
import { SolidityAddressInput } from "./address-input";
import { SolidityBoolInput } from "./bool-input";
import { SolidityBytesInput } from "./bytes-input";
import { SolidityIntInput } from "./int-input";
import { SolidityRawInput } from "./raw-input";
import { SolidityStringInput } from "./string-input";
import { SolidityTupleInput } from "./tuple-input";

type InputProps = React.ComponentProps<typeof Input>;

export interface SolidityInputProps extends InputProps {
  // biome-ignore lint/suspicious/noExplicitAny: FIXME
  formContext: UseFormReturn<any, any>;
}
export interface SolidityInputWithTypeProps extends SolidityInputProps {
  solidityType: string;
  solidityName?: string;
  solidityComponents?:
    | {
        // biome-ignore lint/suspicious/noExplicitAny: FIXME
        [x: string]: any;
        type: string;
        name: string;
      }[]
    | undefined;
  functionName?: string;
}
interface SolidityInputPropsOptionalFormProps extends InputProps {
  solidityType: string;
  solidityName?: string;
  solidityComponents?:
    | {
        // biome-ignore lint/suspicious/noExplicitAny: FIXME
        [x: string]: any;
        type: string;
        name: string;
      }[]
    | undefined;
  // biome-ignore lint/suspicious/noExplicitAny: FIXME
  formContext?: UseFormReturn<any, any>;
  functionName?: string;
}

// has to be forwardref otherwise we get react runtime errors
export const SolidityInput = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  SolidityInputPropsOptionalFormProps
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
>(({ solidityType, solidityName, solidityComponents, ...inputProps }, _ref) => {
  const formContext = useFormContext();

  const form = inputProps.formContext || formContext;

  if (!form) {
    throw new Error(
      "SolidityInput must be used within a form context provided by useFormContext or provide the formContext prop.",
    );
  }

  if (solidityType?.endsWith("[]")) {
    return (
      <SolidityRawInput
        formContext={form}
        solidityType={solidityType}
        solidityComponents={solidityComponents}
        {...inputProps}
      />
    );
  }
  if (solidityType?.startsWith("uint") || solidityType?.startsWith("int")) {
    return (
      <SolidityIntInput
        formContext={form}
        solidityType={solidityType}
        {...inputProps}
      />
    );
  }
  if (solidityType === "tuple") {
    return (
      <SolidityTupleInput
        solidityType={solidityType}
        solidityComponents={solidityComponents}
        formContext={form}
        {...inputProps}
      />
    );
  }
  if (solidityType === "address") {
    return <SolidityAddressInput formContext={form} {...inputProps} />;
  }
  if (solidityType === "string") {
    return (
      <SolidityStringInput
        formContext={form}
        solidityType={solidityType}
        solidityName={solidityName}
        {...inputProps}
      />
    );
  }
  if (solidityType.startsWith("byte")) {
    return (
      <SolidityBytesInput
        formContext={form}
        solidityType={solidityType}
        {...inputProps}
      />
    );
  }
  if (solidityType === "bool") {
    return <SolidityBoolInput formContext={form} {...inputProps} />;
  }
  return <Input {...inputProps} />;
});

SolidityInput.displayName = "SolidityInput";
