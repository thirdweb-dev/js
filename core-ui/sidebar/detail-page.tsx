import { SIDEBAR_WIDTH, SideBarTunnel } from "./tunnel";
import {
  Box,
  Divider,
  Flex,
  Icon,
  IconButton,
  Image,
  Skeleton,
  useDisclosure,
} from "@chakra-ui/react";
import type { useContractMetadata } from "@thirdweb-dev/react/evm";
import type { useProgramMetadata } from "@thirdweb-dev/react/solana";
import type { ExtensionDetectedState } from "components/buttons/ExtensionDetectButton";
import { EnhancedRoute } from "contract-ui/types/types";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { FiMenu } from "react-icons/fi";
import { Heading, Link, Text } from "tw-components";
import { ComponentWithChildren } from "types/component-with-children";
import { shortenIfAddress } from "utils/usedapp-external";

type ContractSidebarProps = {
  address: string;
  metadataQuery:
    | ReturnType<typeof useContractMetadata>
    | ReturnType<typeof useProgramMetadata>;
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
    <SideBarTunnel>
      <>
        <Box
          zIndex="sticky"
          position="sticky"
          top={0}
          p={{ base: 0, md: 8 }}
          w={{ base: "full", md: SIDEBAR_WIDTH }}
        >
          <Flex
            display={{ base: "flex", md: "none" }}
            align="center"
            justify="space-between"
            p={3}
          >
            <NavLink
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                openState.onToggle();
              }}
              href={activeRoute?.path?.replace("overview", "") || ""}
              extensionDetectedState={activeRoute?.isEnabled}
            >
              {activeRoute?.title}
            </NavLink>

            <IconButton
              onClick={() => {
                openState.onToggle();
              }}
              aria-label="toggle menu"
              size="sm"
              variant="ghost"
              icon={<Icon as={FiMenu} />}
            />
          </Flex>
          <Box
            position={{ base: "absolute", md: "relative" }}
            maxH={{ base: openState.isOpen ? "100vh" : "0px", md: "100%" }}
            bg="backgroundHighlight"
            transition="max-height 0.2s ease-in-out"
            overflow={{ base: "hidden", md: "visible" }}
            w="full"
            mb={{ base: 3, md: 0 }}
            px={{ base: 3, md: 0 }}
            mt={0}
          >
            <Divider mb={3} display={{ base: "block", md: "none" }} />
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
                  extensionDetectedState: r.isEnabled,
                  onClick: () => {
                    openState.onClose();
                  },
                }))}
            />
          </Box>
        </Box>
        <Box
          display={{ base: "block", md: "none" }}
          position={openState.isOpen ? "fixed" : "absolute"}
          top="200px"
          bottom={0}
          right={0}
          left={0}
          backdropFilter={openState.isOpen ? "blur(5px)" : undefined}
          transition="backdrop-filter 0.2s ease-in-out"
        />
      </>
    </SideBarTunnel>
  );
};

type NavLinkSectionprops = {
  title: JSX.Element | string;
  icon?: JSX.Element;
  links: Array<{
    href: string;
    title: string;
    extensionDetectedState?: ExtensionDetectedState;
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  }>;
};

const NavLinkSection: React.FC<NavLinkSectionprops> = ({
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
        <NavLink key={link.href} {...link}>
          {link.title}
        </NavLink>
      ))}
    </Flex>
  );
};

type NavLinkProps = {
  href: string;
  extensionDetectedState?: ExtensionDetectedState;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

const NavLink: ComponentWithChildren<NavLinkProps> = ({
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

  const isActive = tabHref === href.replace("/", "");

  if (extensionDetectedState === "disabled") {
    return null;
  }
  return (
    <Link
      onClick={onClick}
      pointerEvents={extensionDetectedState === "loading" ? "none" : "auto"}
      href={computedBasePath + href}
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
      textDecor="none!important"
      role="group"
      height={7}
      display="grid"
      alignItems="center"
    >
      <Skeleton isLoaded={extensionDetectedState !== "loading"}>
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
