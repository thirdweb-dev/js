"use client";

import {
  Button as ChakraButton,
  type ButtonProps as ChakraButtonProps,
  forwardRef,
  IconButton,
  type IconButtonProps,
  LightMode,
  Link,
  useButtonGroup,
} from "@chakra-ui/react";
import {
  fontWeights,
  letterSpacings,
  lineHeights,
} from "chakra/theme/typography";
import { CheckIcon, CopyIcon, ExternalLinkIcon } from "lucide-react";
import { forwardRef as reactForwardRef } from "react";
import { useClipboard } from "@/hooks/useClipboard";
import { ChakraNextLink } from "./link";
import { convertFontSizeToCSSVar } from "./utils/typography";

const buttonSizesMap = {
  lg: "xl",
  md: "lg",
  sm: "md",
  xs: "sm",
} as const;

type PossibleButtonSize = keyof typeof buttonSizesMap;

interface ButtonProps extends Omit<ChakraButtonProps, "size"> {
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
      fontSize: convertFontSizeToCSSVar(`label.${buttonSizesMap[_size]}`),
      fontWeight: fontWeights.label,
      letterSpacing: letterSpacings.label,
      lineHeight: lineHeights.label,
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
            letterSpacing={letterSpacings.label}
            lineHeight={lineHeights.label}
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
        letterSpacing={letterSpacings.label}
        lineHeight={lineHeights.label}
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
          rightIcon={
            noIcon ? undefined : <ExternalLinkIcon className="size-4" />
          }
          textDecoration="none!important"
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
        borderRadius="md"
        colorScheme="whiteAlpha"
        icon={
          hasCopied ? <CheckIcon className="text-success-text" /> : <CopyIcon />
        }
        onClick={copy}
        ref={ref}
        size="sm"
        variant="ghost"
        {...restButtonProps}
      />
    );
  },
);

Legacy_CopyButton.displayName = "Legacy_CopyButton";
