import { ChakraNextLink } from "./link";
import { convertFontSizeToCSSVar } from "./utils/typography";
import {
  Button as ChakraButton,
  ButtonProps as ChakraButtonProps,
  Icon,
  IconButton,
  IconButtonProps,
  LightMode,
  Link,
  forwardRef,
  useButtonGroup,
  useClipboard,
} from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import React, { useEffect } from "react";
import { FiCheck, FiCopy, FiExternalLink } from "react-icons/fi";
import { fontWeights, letterSpacings, lineHeights } from "theme/typography";

export const buttonSizesMap = {
  xs: "sm",
  sm: "md",
  md: "lg",
  lg: "xl",
} as const;

export type PossibleButtonSize = keyof typeof buttonSizesMap;

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

export interface LinkButtonProps extends ButtonProps {
  href: string;
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

export interface TrackedLinkButtonProps extends LinkButtonProps {
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

export interface TrackedIconButtonProps extends IconButtonProps {
  category: string;
  label?: string;
  trackingProps?: Record<string, string>;
}

export const TrackedIconButton = forwardRef<TrackedIconButtonProps, "button">(
  ({ category, label, trackingProps, ...restButtonProps }, ref) => {
    const trackEvent = useTrack();
    return (
      <IconButton
        _light={{
          color: "gray.700",
        }}
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
    const { onCopy, hasCopied, setValue } = useClipboard(value);

    const copy = (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();
      onCopy();
    };

    useEffect(() => {
      if (value) {
        setValue(value);
      }
    }, [value, setValue]);

    return (
      <TrackedIconButton
        ref={ref}
        borderRadius="md"
        variant="ghost"
        colorScheme="whiteAlpha"
        size="sm"
        onClick={copy}
        icon={
          hasCopied ? (
            <Icon
              color="green.400"
              _light={{ color: "green.600" }}
              as={FiCheck}
            />
          ) : (
            <Icon as={FiCopy} />
          )
        }
        {...restButtonProps}
      />
    );
  },
);

TrackedCopyButton.displayName = "TrackedCopyButton";
