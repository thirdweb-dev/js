import {
  Checkbox as ChakraCheckbox,
  CheckboxProps,
  LightMode,
  forwardRef,
} from "@chakra-ui/react";

export const Checkbox = forwardRef<CheckboxProps, "input">(
  ({ ...props }, ref) => {
    if (props.colorScheme) {
      return (
        <LightMode>
          <ChakraCheckbox {...props} ref={ref} />
        </LightMode>
      );
    }
    return <ChakraCheckbox {...props} ref={ref} />;
  },
);

Checkbox.displayName = "Checkbox";
