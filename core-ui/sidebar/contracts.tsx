import { ComponentWithChildren } from "../../types/component-with-children";
import { SIDEBAR_WIDTH, SideBarTunnel } from "./tunnel";
import {
  Box,
  Divider,
  Flex,
  Icon,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FiMenu } from "react-icons/fi";
import { Heading, Link, Text } from "tw-components";

type ContractsSidebarProps = {
  activePage: "deployed" | "published";
};

type Route = {
  path: string;
  title: string;
};

const links: Route[] = [
  { path: "/dashboard/contracts", title: "Deployed" },
  { path: "/dashboard/contracts/published", title: "Published" },
];

export const ContractsSidebar: React.FC<ContractsSidebarProps> = ({
  activePage,
}) => {
  const openState = useDisclosure();

  const activeLink = links.find(
    (tab) => tab.title.toLowerCase() === activePage,
  ) as Route;

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
                e.stopPropagation();
                e.preventDefault();
                openState.onClose();
              }}
              href={activeLink.path}
            >
              {activeLink.title}
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
            <Flex direction="column" mb={4}>
              <Flex mb={2} gap={2} align="center">
                <Text noOfLines={1} as="label" size="body.md" color="faded">
                  Contracts
                </Text>
              </Flex>
              {links.map(({ path, title }) => (
                <NavLink key={path} href={path}>
                  {title}
                </NavLink>
              ))}
            </Flex>
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

type NavLinkProps = {
  onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  href: string;
};

const NavLink: ComponentWithChildren<NavLinkProps> = ({
  href,
  onClick,
  children,
}) => {
  const router = useRouter();

  const isActive = router.pathname === href;

  return (
    <Link
      textAlign="left"
      position="relative"
      pl={3}
      borderLeftWidth="2px"
      display="flex"
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
      height={7}
      alignItems="center"
      href={href}
      onClick={onClick}
    >
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
    </Link>
  );
};
