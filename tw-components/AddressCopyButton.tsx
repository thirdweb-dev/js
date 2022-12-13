import {
  Button,
  ButtonProps,
  PossibleButtonSize,
  buttonSizesMap,
} from "./button";
import { Card } from "./card";
import { Text } from "./text";
import { Icon, Tooltip, useClipboard, useToast } from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import React, { useEffect } from "react";
import { FiCopy } from "react-icons/fi";

/**
 * 📝 @TODO
 * Write a custom alternative to `shortenIfAddress` function
 * Why? - it imports a lot of other stuff which can not be tree-shaken
 */
import { shortenIfAddress } from "utils/usedapp-external";

/**
 * ❗️❗️❗️ @DANGER
 * Importing this component will result in a HUGE bundle size because of `shortenIfAddress`
 */

interface AddressCopyButtonProps extends Omit<ButtonProps, "onClick" | "size"> {
  address?: string;
  noIcon?: boolean;
  size?: PossibleButtonSize;
  tokenId?: boolean;
}

export const AddressCopyButton: React.FC<AddressCopyButtonProps> = ({
  address,
  noIcon,
  flexGrow = 0,
  size = "sm",
  borderRadius = "md",
  variant = "outline",
  tokenId,
  ...restButtonProps
}) => {
  const { onCopy, setValue } = useClipboard(address || "");

  useEffect(() => {
    if (address) {
      setValue(address);
    }
  }, [address, setValue]);

  const trackEvent = useTrack();
  const toast = useToast();

  return (
    <Tooltip
      p={0}
      bg="transparent"
      boxShadow="none"
      label={
        <Card py={2} px={4}>
          <Text size="label.sm">
            Copy {tokenId ? "Token ID" : "address"} to clipboard
          </Text>
        </Card>
      }
    >
      <Button
        flexGrow={flexGrow}
        size={size}
        borderRadius={borderRadius}
        variant={variant}
        {...restButtonProps}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onCopy();
          toast({
            variant: "solid",
            position: "bottom",
            title: `${tokenId ? "Token ID" : "Address"} copied.`,
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          if (tokenId) {
            trackEvent({
              category: "tokenid_button",
              action: "copy",
              tokenId: address,
            });
          } else {
            trackEvent({ category: "address_button", action: "copy", address });
          }
        }}
        leftIcon={noIcon ? undefined : <Icon boxSize={3} as={FiCopy} />}
        fontFamily="mono"
      >
        <Text size={`label.${buttonSizesMap[size]}`}>
          {shortenIfAddress(address)}
        </Text>
      </Button>
    </Tooltip>
  );
};
