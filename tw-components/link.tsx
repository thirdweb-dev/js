import {
  Link as ChakraLink,
  LinkProps as ChakraLinkProps,
} from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import _NextLink, { LinkProps as _NextLinkProps } from "next/link";
import React, { useCallback } from "react";

interface LinkProps
  extends Omit<ChakraLinkProps, "href">,
    Pick<_NextLinkProps, "href"> {
  isExternal?: boolean;
  noIcon?: true;
  href: string;
}

/**
 * A link component that can be used to navigate to other pages.
 * Combines the `NextLink` and Chakra `Link` components.
 */
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (props, ref) => {
    const { href, isExternal, children, ...restLinkProps } = props;
    if (isExternal) {
      return (
        <ChakraLink isExternal href={href} ref={ref} {...restLinkProps}>
          {children}
        </ChakraLink>
      );
    }
    return (
      <_NextLink href={href} passHref>
        <ChakraLink ref={ref} _focus={{ boxShadow: "none" }} {...restLinkProps}>
          {children}
        </ChakraLink>
      </_NextLink>
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
export const TrackedLink: React.FC<TrackedLinkProps> = ({
  category,
  label,
  ...props
}) => {
  const { trackEvent } = useTrack();

  const onClick = useCallback(() => {
    trackEvent({ category, action: "click", label });
  }, [trackEvent, category, label]);

  return <Link onClick={onClick} {...props} />;
};

/**
 * @deprecated Use {@link Link} instead.
 */
export const NextLink = Link;
