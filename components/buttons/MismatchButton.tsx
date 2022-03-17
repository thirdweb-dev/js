import { Button } from "./Button";
import { ConnectWallet, useWeb3 } from "@3rdweb-sdk/react";
import { ButtonProps, Tooltip } from "@chakra-ui/react";
import { useNetworkMismatch } from "hooks/useNetworkMismatch";
import React from "react";

export const MismatchButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, isDisabled, onClick, loadingText, type, ...props }, ref) => {
    const { address } = useWeb3();
    const networksMismatch = useNetworkMismatch();
    if (!address) {
      return (
        <ConnectWallet borderRadius="full" colorScheme="primary" {...props} />
      );
    }

    return (
      <Tooltip
        isDisabled={!networksMismatch}
        label="To do this please switch yout wallet network."
        hasArrow
        shouldWrapChildren
      >
        <Button
          w="full"
          {...props}
          type={type}
          loadingText={loadingText}
          onClick={onClick}
          ref={ref}
          isDisabled={networksMismatch || isDisabled}
        >
          {children}
        </Button>
      </Tooltip>
    );
  },
);

MismatchButton.displayName = "MismatchButton";
