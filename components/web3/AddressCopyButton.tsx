import {
  ButtonProps,
  Icon,
  Text,
  Tooltip,
  useClipboard,
  useToast,
} from "@chakra-ui/react";
import { Button } from "components/buttons/Button";
import { useTrack } from "hooks/analytics/useTrack";
import React from "react";
import { ImCopy } from "react-icons/im";
import { shortenIfAddress } from "utils/usedapp-external";

interface IAddressCopyButton extends Omit<ButtonProps, "onClick"> {
  address?: string;
  noIcon?: boolean;
}

export const AddressCopyButton: React.FC<IAddressCopyButton> = ({
  address,
  noIcon,
  ...restButtonProps
}) => {
  const { onCopy } = useClipboard(address || "");
  const { trackEvent } = useTrack();
  const toast = useToast();

  const defaultProps: ButtonProps = {
    flexGrow: 0,
    size: "sm",
    borderRadius: "md",
    variant: "outline",
  };

  const combinedProps = { ...defaultProps, ...restButtonProps };

  return (
    <Tooltip hasArrow label="Copy address to clipboard">
      <Button
        {...combinedProps}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onCopy();
          toast({
            title: "Address copied.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          trackEvent({ category: "address_button", action: "copy", address });
        }}
        leftIcon={noIcon ? undefined : <Icon boxSize={3} as={ImCopy} />}
      >
        <Text
          color="inherit"
          fontFamily="mono"
          size={`label.${combinedProps.size || "sm"}`}
        >
          {shortenIfAddress(address)}
        </Text>
      </Button>
    </Tooltip>
  );
};
