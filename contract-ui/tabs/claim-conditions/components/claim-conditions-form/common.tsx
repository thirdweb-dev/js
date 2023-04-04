import { useClaimConditionsFormContext } from ".";
import { Flex, FormControl } from "@chakra-ui/react";
import React from "react";
import { FieldError } from "react-hook-form";
import {
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
} from "tw-components";
import { ComponentWithChildren } from "types/component-with-children";

interface CustomFormControlProps {
  disabled: boolean;
  label: string;
  error?: FieldError;
  helperText?: React.ReactNode;
}

export const CustomFormControl: ComponentWithChildren<
  CustomFormControlProps
> = (props) => {
  return (
    <FormControl isDisabled={props.disabled} isInvalid={!!props.error}>
      {/* label */}
      <Heading as={FormLabel} size="label.md">
        {props.label}
      </Heading>

      {/* input */}
      {props.children}

      {/* error message */}
      {props.error && (
        <FormErrorMessage>{props.error.message}</FormErrorMessage>
      )}

      {/* helper text */}
      {props.helperText && <FormHelperText>{props.helperText}</FormHelperText>}
    </FormControl>
  );
};

export const CustomFormGroup: ComponentWithChildren = ({ children }) => {
  const { isColumn } = useClaimConditionsFormContext();
  return (
    <Flex
      direction={{
        base: "column",
        md: isColumn ? "column" : "row",
      }}
      gap={4}
    >
      {children}
    </Flex>
  );
};
