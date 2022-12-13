import { ChakraNextLink } from "./link";
import { convertFontSizeToCSSVar } from "./utils/typography";
import {
  Button as ChakraButton,
  ButtonProps as ChakraButtonprops,
  Icon,
  IconButton,
  IconButtonProps,
  LightMode,
  Link,
  forwardRef,
  useButtonGroup,
} from "@chakra-ui/react";
import { Link as LocationLink, useMatch } from "@tanstack/react-location";
import { useTrack } from "hooks/analytics/useTrack";
import React from "react";
import { FiExternalLink } from "react-icons/fi";
import { fontWeights, letterSpacings, lineHeights } from "theme/typography";

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
    return <ChakraButton {...props} ref={ref} />;
  },
);

export interface LinkButtonProps extends ButtonProps {
  href: string;
  isExternal?: boolean;
  noIcon?: true;
  noMatch?: true;
}

export const LinkButton = React.forwardRef<HTMLButtonElement, LinkButtonProps>(
  (
    { href, isExternal, noIcon, noMatch, children, ...restButtonProps },
    ref,
  ) => {
    const match = useMatch();

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

    // we're in a react location context, so we can use that
    if (match && !noMatch) {
      return (
        <LocationLink to={href}>
          <Button
            {...restButtonProps}
            ref={ref}
            textDecoration="none!important"
          >
            {children}
          </Button>
        </LocationLink>
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

export interface TrackedIconButtonProps extends IconButtonProps {
  category: string;
  label?: string;
}

export const TrackedIconButton = forwardRef<TrackedIconButtonProps, "button">(
  ({ category, label, ...restButtonProps }, ref) => {
    const trackEvent = useTrack();
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
