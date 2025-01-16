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
import { useTrack } from "hooks/analytics/useTrack";
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

interface TrackedLinkButtonProps extends LinkButtonProps {
  category: string;
  label?: string;
}

export const TrackedLinkButton = forwardRef<TrackedLinkButtonProps, "button">(
  ({ category, label, ...restButtonProps }, ref) => {
    const trackEvent = useTrack();
    return (
      <LinkButton
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

TrackedLinkButton.displayName = "TrackedLinkButton";

interface TrackedIconButtonProps extends IconButtonProps {
  category: string;
  label?: string;
  trackingProps?: Record<string, string>;
}

export const TrackedIconButton = forwardRef<TrackedIconButtonProps, "button">(
  ({ category, label, trackingProps, ...restButtonProps }, ref) => {
    const trackEvent = useTrack();
    return (
      <IconButton
        className="text-muted-foreground"
        ref={ref}
        onClick={() =>
          trackEvent({
            category,
            action: "click",
            label,
            ...trackingProps,
          })
        }
        {...restButtonProps}
      />
    );
  },
);

TrackedIconButton.displayName = "TrackedIconButton";

interface TrackedCopyButtonProps extends TrackedIconButtonProps {
  value: string;
}

export const TrackedCopyButton = forwardRef<TrackedCopyButtonProps, "button">(
  ({ value, ...restButtonProps }, ref) => {
    const { onCopy, hasCopied } = useClipboard(value);

    const copy = (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();
      onCopy();
    };

    return (
      <TrackedIconButton
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

TrackedCopyButton.displayName = "TrackedCopyButton";
