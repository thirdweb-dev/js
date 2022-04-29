import { Text } from "./text";
import {
  BadgeProps,
  Badge as ChakraBadge,
  LightMode,
  forwardRef,
} from "@chakra-ui/react";
import React from "react";

export const Badge = forwardRef<BadgeProps, "span">(
  ({ py = 1, children, ...props }, ref) => {
    if (props.colorScheme) {
      return (
        <LightMode>
          <ChakraBadge py={py} {...props} ref={ref}>
            <Text color="inherit" size="label.md">
              {children}
            </Text>
          </ChakraBadge>
        </LightMode>
      );
    }
    return (
      <ChakraBadge py={py} {...props} ref={ref}>
        <Text color="inherit" size="label.md">
          {children}
        </Text>
      </ChakraBadge>
    );
  },
);

Badge.displayName = "Badge";
