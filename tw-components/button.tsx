import { Card } from "./card";
import { Text } from "./text";
import { convertFontSizeToCSSVar } from "./utils/typography";
import {
  Button as ChakraButton,
  ButtonProps as ChakraButtonprops,
  Icon,
  IconButton,
  IconButtonProps,
  LightMode,
  Link,
  Tooltip,
  forwardRef,
  useButtonGroup,
  useClipboard,
  useToast,
} from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import NextLink, { LinkProps } from "next/link";
import React from "react";
import { FiCopy, FiExternalLink } from "react-icons/fi";
import { fontWeights, letterSpacings, lineHeights } from "theme/typography";
import { shortenIfAddress } from "utils/usedapp-external";

export const buttonSizesMap = {
  xs: "sm",
  sm: "md",
  md: "lg",
  lg: "xl",
} as const;

export type PossibleButtonSize = keyof typeof buttonSizesMap;

export interface ButtonProps extends Omit<ChakraButtonprops, "size"> {
  size?: PossibleButtonSize;
  fromcolor?: string;
  tocolor?: string;
}

export const Button = forwardRef<ButtonProps, "button">(
  ({ size, ...restButtonProps }, ref) => {
    const { size: groupSize, ...buttonGroupContext } = useButtonGroup() || {};
    let _size: PossibleButtonSize = (size ||
      groupSize ||
      "md") as PossibleButtonSize;
    if (!(_size in buttonSizesMap)) {
      _size = "md";
    }

    const props: ButtonProps = {
      fontWeight: fontWeights.label,
      lineHeight: lineHeights.label,
      letterSpacing: letterSpacings.label,
      fontSize: convertFontSizeToCSSVar(`label.${buttonSizesMap[_size]}`),
      size: _size,
      ...buttonGroupContext,
      ...restButtonProps,
    };
    if (props.colorScheme && props.variant !== "outline") {
      return (
        <LightMode>
          <ChakraButton
            fontWeight={fontWeights.label}
            lineHeight={lineHeights.label}
            letterSpacing={letterSpacings.label}
            {...props}
            ref={ref}
          />
        </LightMode>
      );
    }
    return <ChakraButton {...props} ref={ref} />;
  },
);

Button.displayName = "Button";

export interface LinkButtonProps extends ButtonProps {
  href: string | LinkProps["href"];
  isExternal?: boolean;
  noIcon?: true;
}

export const LinkButton = React.forwardRef<HTMLButtonElement, LinkButtonProps>(
  ({ href, isExternal, noIcon, children, ...restButtonProps }, ref) => {
    if (isExternal) {
      return (
        <Button
          as={Link}
          href={href}
          isExternal
          ref={ref}
          textDecoration="none!important"
          rightIcon={noIcon ? undefined : <Icon as={FiExternalLink} />}
          {...restButtonProps}
        >
          {children}
        </Button>
      );
    }

    return (
      <NextLink href={href} passHref>
        <Button
          as={Link}
          ref={ref}
          {...restButtonProps}
          textDecoration="none!important"
        >
          {children}
        </Button>
      </NextLink>
    );
  },
);

LinkButton.displayName = "LinkButton";

export interface TrackedIconButtonProps extends IconButtonProps {
  category: string;
  label?: string;
}

export const TrackedIconButton = forwardRef<TrackedIconButtonProps, "button">(
  ({ category, label, ...restButtonProps }, ref) => {
    const { trackEvent } = useTrack();
    return (
      <IconButton
        ref={ref}
        onClick={() =>
          trackEvent({
            category,
            action: "click",
            label,
          })
        }
        {...restButtonProps}
      />
    );
  },
);

TrackedIconButton.displayName = "TrackedIconButton";

interface AddressCopyButtonProps extends Omit<ButtonProps, "onClick" | "size"> {
  address?: string;
  noIcon?: boolean;
  size?: PossibleButtonSize;
}

export const AddressCopyButton: React.FC<AddressCopyButtonProps> = ({
  address,
  noIcon,
  flexGrow = 0,
  size = "sm",
  borderRadius = "md",
  variant = "outline",
  ...restButtonProps
}) => {
  const { onCopy } = useClipboard(address || "");
  const { trackEvent } = useTrack();
  const toast = useToast();

  return (
    <Tooltip
      p={0}
      bg="transparent"
      boxShadow="none"
      label={
        <Card py={2} px={4}>
          <Text size="label.sm">Copy address to clipboard</Text>
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
            title: "Address copied.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          trackEvent({ category: "address_button", action: "copy", address });
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
