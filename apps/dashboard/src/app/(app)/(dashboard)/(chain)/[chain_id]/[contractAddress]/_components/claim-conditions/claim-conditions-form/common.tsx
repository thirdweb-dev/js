import { Flex, FormControl } from "@chakra-ui/react";
import { FormErrorMessage, FormHelperText, FormLabel } from "chakra/form";
import type { FieldError } from "react-hook-form";
import type { ComponentWithChildren } from "@/types/component-with-children";
import { useClaimConditionsFormContext } from ".";

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
      <FormLabel className="font-bold">{props.label}</FormLabel>

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
