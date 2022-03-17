import { Link, LinkProps } from "@chakra-ui/react";
import _NextLink, { LinkProps as _LinkProps } from "next/link";
import React from "react";

interface INextLinkProps
  extends Omit<LinkProps, "href">,
    Pick<_LinkProps, "href"> {
  isExternal?: boolean;
  noIcon?: true;
  href: string;
}

export const NextLink = React.forwardRef<HTMLAnchorElement, INextLinkProps>(
  (props, ref) => {
    const { href, isExternal, children, ...restLinkProps } = props;
    if (isExternal) {
      return (
        <Link isExternal href={href} ref={ref} {...restLinkProps}>
          {children}
        </Link>
      );
    }
    return (
      <_NextLink href={href} passHref>
        <Link ref={ref} _focus={{ boxShadow: "none" }} {...restLinkProps}>
          {children}
        </Link>
      </_NextLink>
    );
  },
);

NextLink.displayName = "NextLink";
