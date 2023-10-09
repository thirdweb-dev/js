import { SidebarNav } from "./nav";
import { NavLink } from "./nav-link";
import { Box, Flex, Image, Skeleton, useDisclosure } from "@chakra-ui/react";
import type { useContractMetadata } from "@thirdweb-dev/react/evm";
import type { ExtensionDetectedState } from "components/buttons/ExtensionDetectButton";
import { EnhancedRoute } from "contract-ui/types/types";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { Badge, Text } from "tw-components";
import { ComponentWithChildren } from "types/component-with-children";
import { shortenIfAddress } from "utils/usedapp-external";

type ContractSidebarProps = {
  address: string;
  metadataQuery: ReturnType<typeof useContractMetadata>;
  routes: EnhancedRoute[];
  activeRoute?: EnhancedRoute;
};

export const ContractProgramSidebar: React.FC<ContractSidebarProps> = ({
  address,
  metadataQuery,
  routes,
  activeRoute,
}) => {
  const openState = useDisclosure();
  return (
    <SidebarNav
      zIndex="banner"
      navLink={
        <DetailNavLink
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            openState.onToggle();
          }}
          href={activeRoute?.path?.replace("overview", "") || ""}
          extensionDetectedState={activeRoute?.isEnabled}
        >
          {activeRoute?.title}
        </DetailNavLink>
      }
      sections={
        <>
          <NavLinkSection
            title={
              <Skeleton
                as="span"
                isLoaded={metadataQuery.isSuccess || metadataQuery.isError}
              >
                {metadataQuery.data?.name || shortenIfAddress(address)}
              </Skeleton>
            }
            links={routes
              .filter((r) => r.isDefault)
              .map((r) => ({
                title: r.title,
                href: `/${r.path.replace("overview", "")}`,
                isBeta: r.isBeta,
                onClick: () => {
                  openState.onClose();
                },
              }))}
          />
          <NavLinkSection
            title={"Extensions"}
            icon={
              <Image
                src="/assets/dashboard/extension-check.svg"
                alt="Extension"
                objectFit="contain"
              />
            }
            links={routes
              .filter((r) => !r.isDefault)
              .map((r) => ({
                title: r.title,
                href: `/${r.path}`,
                isBeta: r.isBeta,
                extensionDetectedState: r.isEnabled,
                onClick: () => {
                  openState.onClose();
                },
              }))}
          />
        </>
      }
    />
  );
};

type NavLinkSectionProps = {
  title: JSX.Element | string;
  icon?: JSX.Element;
  links: Array<{
    href: string;
    title: string;
    isBeta?: true;
    extensionDetectedState?: ExtensionDetectedState;
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  }>;
};

const NavLinkSection: React.FC<NavLinkSectionProps> = ({
  icon,
  title,
  links,
}) => {
  const filteredLinks = links.filter(
    (link) => link.extensionDetectedState !== "disabled",
  );
  if (filteredLinks.length === 0) {
    return null;
  }

  return (
    <Flex direction="column" mb={4}>
      <Flex mb={2} gap={2} align="center">
        {icon && <Box ml={-1.5}>{icon}</Box>}
        <Text noOfLines={1} as="label" size="body.md" color="faded">
          {title}
        </Text>
      </Flex>
      {filteredLinks.map((link) => (
        <Flex gap={2} key={link.href}>
          <DetailNavLink key={link.href} {...link}>
            {link.title}
          </DetailNavLink>
          {link.isBeta && (
            <Box>
              <Badge colorScheme="green" variant="subtle">
                Beta
              </Badge>
            </Box>
          )}
        </Flex>
      ))}
    </Flex>
  );
};

type DetailNavLinkProps = {
  href: string;
  extensionDetectedState?: ExtensionDetectedState;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

const DetailNavLink: ComponentWithChildren<DetailNavLinkProps> = ({
  children,
  href,
  extensionDetectedState,
  onClick,
}) => {
  const { query } = useRouter();
  const [computedBasePath, tabHref] = useMemo(() => {
    const [network, address, tab = ""] = [
      ...new Set(((query.paths as string[]) || []).filter((c) => c !== "evm")),
    ];

    return [`/${network}/${address}`, tab] as const;
  }, [query.paths]);

  if (extensionDetectedState === "disabled") {
    return null;
  }
  return (
    <NavLink
      onClick={onClick}
      href={computedBasePath + href}
      loading={extensionDetectedState === "loading"}
      active={tabHref === href.replace("/", "")}
    >
      {children}
    </NavLink>
  );
};
