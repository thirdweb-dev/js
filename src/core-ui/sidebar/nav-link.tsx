import { Skeleton } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { Heading, Link } from "tw-components";
import { ComponentWithChildren } from "types/component-with-children";

type NavLinkProps = {
  onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  href: string;
  subActivePath?: boolean;
  active?: boolean | undefined;
  loading?: boolean;
};

export const NavLink: ComponentWithChildren<NavLinkProps> = ({
  href,
  onClick,
  children,
  active,
  subActivePath = false,
  loading = false,
}) => {
  const router = useRouter();

  const isActive = useMemo(() => {
    if (active !== undefined) {
      return active;
    }

    return !subActivePath
      ? router.pathname === href
      : router.pathname.includes(href);
  }, [active, router.pathname, href, subActivePath]);

  return (
    <Link
      onClick={onClick}
      pointerEvents={loading ? "none" : "auto"}
      href={href}
      position="relative"
      pl={3}
      borderLeftWidth="2px"
      _dark={{
        borderColor: isActive ? "primary.500" : "rgba(255,255,255,.07)",
        _hover: {
          borderColor: isActive ? "primary.500" : "rgba(255,255,255,.7)",
        },
      }}
      _light={{
        borderColor: isActive ? "primary.500" : "rgba(0,0,0,.07)",
        _hover: {
          borderColor: isActive ? "primary.500" : "rgba(0,0,0,.3)",
        },
      }}
      role="group"
      textDecor="none!important"
      height={7}
      display="flex"
      alignItems="center"
    >
      <Skeleton isLoaded={!loading}>
        <Heading
          noOfLines={1}
          p={0}
          m={0}
          as="span"
          lineHeight={1.5}
          fontSize="14px"
          size="label.md"
          transition="opacity 0.2s"
          fontWeight={isActive ? 700 : 400}
          opacity={isActive ? 1 : 0.7}
          _groupHover={{
            opacity: 1,
          }}
        >
          {children}
        </Heading>
      </Skeleton>
    </Link>
  );
};
