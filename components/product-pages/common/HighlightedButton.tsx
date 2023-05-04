import { useColorModeValue, useStyleConfig } from "@chakra-ui/react";
import React from "react";
import { Button, ButtonProps } from "tw-components";

interface HighlightedButtonProps extends ButtonProps {
  title: string;
  isHighlighted?: boolean;
  fullCircle?: boolean;
}

export const HighlightedButton = React.forwardRef<
  HTMLButtonElement,
  HighlightedButtonProps
>(({ title, isHighlighted, fullCircle = false, ...rest }, ref) => {
  const boxShadow = useColorModeValue(
    isHighlighted ? "0 0 10px 2px rgba(51, 133, 255, 1)" : "none",
    isHighlighted ? "0 0 10px 2px rgba(51, 133, 255, 1)" : "none",
  );

  const styles = useStyleConfig("Button", {
    variant: "highlighted",
    fullCircle,
  });

  return (
    <Button ref={ref} {...rest} boxShadow={boxShadow} sx={styles}>
      {title}
    </Button>
  );
});

HighlightedButton.displayName = "HighlightedButton";
