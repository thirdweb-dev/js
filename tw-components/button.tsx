import { Text } from "./text";
import {
  Button as ChakraButton,
  ButtonProps as ChakraButtonprops,
  Icon,
  LightMode,
  Link,
  Tooltip,
  forwardRef,
  useBreakpointValue,
  useButtonGroup,
  useClipboard,
  useToast,
} from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import NextLink, { LinkProps } from "next/link";
import React from "react";
import { FiExternalLink } from "react-icons/fi";
import { ImCopy } from "react-icons/im";
import {
  baseFontSizes,
  fontWeights,
  letterSpacings,
  lineHeights,
  mdFontSizes,
} from "theme/typography";
import { shortenIfAddress } from "utils/usedapp-external";

const mapToOneBigger = { xs: "sm", sm: "md", md: "lg", lg: "xl" } as const;

type PossibleButtonSize = keyof typeof mapToOneBigger;

export interface ButtonProps extends Omit<ChakraButtonprops, "size"> {
  size?: PossibleButtonSize;
}

export const Button = forwardRef<ButtonProps, "button">(
  ({ size, ...restButtonprops }, ref) => {
    const { size: groupSize, ...buttonGroupContext } = useButtonGroup() || {};
    let _size: PossibleButtonSize = (size ||
      groupSize ||
      "md") as PossibleButtonSize;
    if (!(_size in mapToOneBigger)) {
      _size = "md";
    }
    const fontSizeMap =
      useBreakpointValue({
        base: baseFontSizes,
        md: mdFontSizes,
      }) || mdFontSizes;

    const props: ButtonProps = {
      fontWeight: fontWeights.label,
      lineHeight: lineHeights.label,
      letterSpacing: letterSpacings.label,
      fontSize: fontSizeMap.label[mapToOneBigger[_size]],
      size: _size,
      ...buttonGroupContext,
      ...restButtonprops,
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

interface ILinkButtonProps extends ButtonProps {
  href: string | LinkProps["href"];
  isExternal?: boolean;
  noIcon?: true;
}

export const LinkButton = React.forwardRef<HTMLButtonElement, ILinkButtonProps>(
  ({ href, isExternal, noIcon, children, ...restButtonprops }, ref) => {
    if (isExternal) {
      return (
        <Button
          as={Link}
          href={href}
          isExternal
          ref={ref}
          textDecoration="none!important"
          rightIcon={noIcon ? undefined : <Icon as={FiExternalLink} />}
          {...restButtonprops}
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
          {...restButtonprops}
          textDecoration="none!important"
        >
          {children}
        </Button>
      </NextLink>
    );
  },
);

LinkButton.displayName = "LinkButton";

interface IAddressCopyButton extends Omit<ButtonProps, "onClick" | "size"> {
  address?: string;
  noIcon?: boolean;
  size?: "sm" | "md" | "lg";
}

export const AddressCopyButton: React.VFC<IAddressCopyButton> = ({
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
    <Tooltip hasArrow label="Copy address to clipboard">
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
            title: "Address copied.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          trackEvent({ category: "address_button", action: "copy", address });
        }}
        leftIcon={noIcon ? undefined : <Icon boxSize={3} as={ImCopy} />}
        fontFamily="mono"
      >
        <Text size={`label.${mapToOneBigger[size]}`}>
          {shortenIfAddress(address)}
        </Text>
      </Button>
    </Tooltip>
  );
};
