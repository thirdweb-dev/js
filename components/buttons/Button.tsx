import {
  ButtonProps,
  Button as ChakraButton,
  LightMode,
  forwardRef,
} from "@chakra-ui/react";
import React from "react";

export const Button = forwardRef<ButtonProps, "button">((props, ref) => {
  if (props.colorScheme && props.variant !== "outline") {
    return (
      <LightMode>
        <ChakraButton {...props} ref={ref} />
      </LightMode>
    );
  }
  return <ChakraButton {...props} ref={ref} />;
});

Button.displayName = "Button";
