"use client";

import {
  Button as ChakraButton,
  type ButtonProps as ChakraButtonProps,
  IconButton,
  type IconButtonProps,
  LightMode,
  Link,
  forwardRef,
  useButtonGroup,
} from "@chakra-ui/react";
import { useClipboard } from "hooks/useClipboard";
import { CheckIcon, CopyIcon, ExternalLinkIcon } from "lucide-react";
import { forwardRef as reactForwardRef } from "react";
import { fontWeights, letterSpacings, lineHeights } from "theme/typography";
import { ChakraNextLink } from "./link";
import { convertFontSizeToCSSVar } from "./utils/typography";

const buttonSizesMap = {
  xs: "sm",
  sm: "md",
  md: "lg",
  lg: "xl",
} as const;

type PossibleButtonSize = keyof typeof buttonSizesMap;

export interface ButtonProps extends Omit<ChakraButtonProps, "size"> {
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
    if (
      props.colorScheme &&
      props.variant !== "outline" &&
      props.variant !== "ghost"
    ) {
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

    return (
      <ChakraButton
        {...props}
        fontWeight={fontWeights.label}
        lineHeight={lineHeights.label}
        letterSpacing={letterSpacings.label}
        ref={ref}
      />
    );
  },
);

interface LinkButtonProps extends ButtonProps {
  href: string;
  isExternal?: boolean;
  noIcon?: true;
}

export const LinkButton = reactForwardRef<HTMLButtonElement, LinkButtonProps>(
  ({ href, isExternal, noIcon, children, ...restButtonProps }, ref) => {
    if (isExternal) {
      return (
        <Button
          as={Link}
          href={href}
          isExternal
          ref={ref}
          textDecoration="none!important"
          rightIcon={
            noIcon ? undefined : <ExternalLinkIcon className="size-4" />
          }
          {...restButtonProps}
        >
          {children}
        </Button>
      );
    }

    return (
      <Button
        as={ChakraNextLink}
        href={href}
        ref={ref}
        {...restButtonProps}
        textDecoration="none!important"
      >
        {children}
      </Button>
    );
  },
);

LinkButton.displayName = "LinkButton";

interface Legacy_CopyButtonProps extends IconButtonProps {
  value: string;
}

export const Legacy_CopyButton = forwardRef<Legacy_CopyButtonProps, "button">(
  ({ value, ...restButtonProps }, ref) => {
    const { onCopy, hasCopied } = useClipboard(value);

    const copy = (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();
      onCopy();
    };

    return (
      <IconButton
        ref={ref}
        borderRadius="md"
        variant="ghost"
        colorScheme="whiteAlpha"
        size="sm"
        onClick={copy}
        icon={
          hasCopied ? <CheckIcon className="text-success-text" /> : <CopyIcon />
        }
        {...restButtonProps}
      />
    );
  },
);

Legacy_CopyButton.displayName = "Legacy_CopyButton";
