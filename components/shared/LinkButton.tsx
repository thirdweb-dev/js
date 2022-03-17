import { ButtonProps, Icon, Link } from "@chakra-ui/react";
import { Button } from "components/buttons/Button";
import NextLink, { LinkProps } from "next/link";
import React from "react";
import { FiExternalLink } from "react-icons/fi";

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
