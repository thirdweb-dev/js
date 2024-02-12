import {
  Link as ChakraLink,
  LinkProps as ChakraLinkProps,
  LinkOverlay,
  forwardRef,
} from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import _NextLink, { LinkProps as _NextLinkProps } from "next/link";
import React, { useCallback } from "react";

export type ChakraNextLinkProps = Omit<ChakraLinkProps, "as"> &
  Omit<_NextLinkProps, "as">;
export const ChakraNextLink = forwardRef<ChakraNextLinkProps, "a">(
  (props, ref) => (
    <ChakraLink as={_NextLink} {...props} ref={ref} prefetch={false} />
  ),
);

interface LinkProps
  extends Omit<ChakraLinkProps, "href">,
    Pick<_NextLinkProps, "href"> {
  isExternal?: boolean;
  noIcon?: true;
  href: string;

  scroll?: true;
}

/**
 * A link component that can be used to navigate to other pages.
 * Combines the `NextLink` and Chakra `Link` components.
 */
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, isExternal, children, scroll, ...restLinkProps }, ref) => {
    if (isExternal) {
      return (
        <ChakraLink isExternal href={href} ref={ref} {...restLinkProps}>
          {children}
        </ChakraLink>
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

export interface TrackedLinkProps extends LinkProps {
  category: string;
  label?: string;
  trackingProps?: Record<string, string>;
}

/**
 * A link component extends the `Link` component and adds tracking.
 */
export const TrackedLink = React.forwardRef<
  HTMLAnchorElement,
  TrackedLinkProps
>(({ category, label, trackingProps, ...props }, ref) => {
  const trackEvent = useTrack();

  const onClick = useCallback(() => {
    trackEvent({ category, action: "click", label, ...trackingProps });
  }, [trackEvent, category, label, trackingProps]);

  return <Link ref={ref} onClick={onClick} {...props} />;
});

TrackedLink.displayName = "TrackedLink";

/**
 * A link component extends the `LinkOverlay` component and adds tracking.
 */
export const TrackedLinkOverlay = React.forwardRef<
  HTMLAnchorElement,
  TrackedLinkProps
>(({ category, label, trackingProps, ...props }, ref) => {
  const trackEvent = useTrack();

  const onClick = useCallback(() => {
    trackEvent({ category, action: "click", label, ...trackingProps });
  }, [trackEvent, category, label, trackingProps]);

  return <LinkOverlay ref={ref} onClick={onClick} {...props} />;
});

TrackedLinkOverlay.displayName = "TrackedLinkOverlay";
