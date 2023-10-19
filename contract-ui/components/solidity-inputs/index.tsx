import { SolidityAddressInput } from "./address-input";
import { SolidityBoolInput } from "./bool-input";
import { SolidityBytesInput } from "./bytes-input";
import { SolidityIntInput } from "./int-input";
import { SolidityRawInput } from "./raw-input";
import { SolidityStringInput } from "./string-input";
import { SolidityTupleInput } from "./tuple-input";
import { Input, InputProps } from "@chakra-ui/react";
import React from "react";
import { UseFormReturn, useFormContext } from "react-hook-form";

export interface SolidityInputProps extends InputProps {
  formContext: UseFormReturn<any, any>;
}
export interface SolidityInputWithTypeProps extends SolidityInputProps {
  solidityType: string;
  solidityName?: string;
  solidityComponents?:
    | {
        [x: string]: any;
        type: string;
        name: string;
      }[]
    | undefined;
  functionName?: string;
}
export interface SolidityInputPropsOptionalFormProps extends InputProps {
  solidityType: string;
  solidityName?: string;
  solidityComponents?:
    | {
        [x: string]: any;
        type: string;
        name: string;
      }[]
    | undefined;
  formContext?: UseFormReturn<any, any>;
  functionName?: string;
}

// has to be forwardref otherwise we get react runtime errors
export const SolidityInput = React.forwardRef<
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

  /* if (solidityType === "address[]") {
    return (
      <SolidityArrayInput
        formContext={form}
        solidityType={solidityType}
        {...inputProps}
      />
    );
  } else */
  if (solidityType?.endsWith("[]")) {
    return (
      <SolidityRawInput
        formContext={form}
        solidityType={solidityType}
        solidityComponents={solidityComponents}
        {...inputProps}
      />
    );
  } else if (
    solidityType?.startsWith("uint") ||
    solidityType?.startsWith("int")
  ) {
    return (
      <SolidityIntInput
        formContext={form}
        solidityType={solidityType}
        {...inputProps}
      />
    );
  } else if (solidityType === "tuple") {
    return (
      <SolidityTupleInput
        solidityType={solidityType}
        solidityComponents={solidityComponents}
        formContext={form}
        {...inputProps}
      />
    );
  } else if (solidityType === "address") {
    return <SolidityAddressInput formContext={form} {...inputProps} />;
  } else if (solidityType === "string") {
    return (
      <SolidityStringInput
        formContext={form}
        solidityType={solidityType}
        solidityName={solidityName}
        {...inputProps}
      />
    );
  } else if (solidityType.startsWith("byte")) {
    return (
      <SolidityBytesInput
        formContext={form}
        solidityType={solidityType}
        {...inputProps}
      />
    );
  } else if (solidityType === "bool") {
    return <SolidityBoolInput formContext={form} {...inputProps} />;
  }
  return <Input {...inputProps} />;
});

SolidityInput.displayName = "SolidityInput";
