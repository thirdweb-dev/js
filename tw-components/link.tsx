import {
  Link as ChakraLink,
  LinkProps as ChakraLinkProps,
  forwardRef,
} from "@chakra-ui/react";
import { Link as LocationLink, useMatch } from "@tanstack/react-location";
import { useTrack } from "hooks/analytics/useTrack";
import _NextLink, { LinkProps as _NextLinkProps } from "next/link";
import React, { useCallback } from "react";

export type ChakraNextLinkProps = Omit<ChakraLinkProps, "as"> &
  Omit<_NextLinkProps, "as">;
export const ChakraNextLink = forwardRef<ChakraNextLinkProps, "a">(
  (props, ref) => <ChakraLink as={_NextLink} {...props} ref={ref} />,
);

export type ChakraLocationLinkProps = Omit<ChakraLinkProps, "as">;
export const ChakraLocationLink = forwardRef<ChakraLocationLinkProps, "a">(
  (props, ref) => <ChakraLink as={LocationLink} {...props} ref={ref} />,
);

interface LinkProps
  extends Omit<ChakraLinkProps, "href">,
    Pick<_NextLinkProps, "href"> {
  isExternal?: boolean;
  noIcon?: true;
  href: string;
  noMatch?: true;
  scroll?: true;
}

/**
 * A link component that can be used to navigate to other pages.
 * Combines the `NextLink` and Chakra `Link` components.
 */
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, isExternal, children, noMatch, scroll, ...restLinkProps }, ref) => {
    const match = useMatch();

    if (isExternal) {
      return (
        <ChakraLink isExternal href={href} ref={ref} {...restLinkProps}>
          {children}
        </ChakraLink>
      );
    }

    // we're in a react location context, so we can use that
    if (match && !noMatch) {
      return (
        <ChakraLocationLink to={href} {...restLinkProps}>
          {children}
        </ChakraLocationLink>
      );
    }
    return (
      <ChakraNextLink
        href={href}
        scroll={scroll}
        scrollBehavior="smooth"
        ref={ref}
        _focus={{ boxShadow: "none" }}
        {...restLinkProps}
      >
        {children}
      </ChakraNextLink>
    );
  },
);

Link.displayName = "Link";

interface TrackedLinkProps extends LinkProps {
  category: string;
  label?: string;
}

/**
 * A link component extends the `Link` component and adds tracking.
 */
export const TrackedLink = React.forwardRef<
  HTMLAnchorElement,
  TrackedLinkProps
>(({ category, label, ...props }, ref) => {
  const trackEvent = useTrack();

  const onClick = useCallback(() => {
    trackEvent({ category, action: "click", label });
  }, [trackEvent, category, label]);

  return <Link ref={ref} onClick={onClick} {...props} />;
});

TrackedLink.displayName = "TrackedLink";
