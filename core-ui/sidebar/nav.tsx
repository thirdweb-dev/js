import { NavLink } from "./nav-link";
import { SIDEBAR_WIDTH, SideBarTunnel } from "./tunnel";
import { Route } from "./types";
import {
  Box,
  Divider,
  Flex,
  Icon,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { FiMenu } from "react-icons/fi";
import { Text } from "tw-components";

type SidebarNavProps = {
  title?: string;
  activePage?: string;
  links?: Route[];
  zIndex?: string;
  navLink?: JSX.Element;
  sections?: JSX.Element;
};

export const SidebarNav: React.FC<SidebarNavProps> = ({
  title,
  activePage,
  navLink,
  sections,
  links = [],
  zIndex = "sticky",
}) => {
  const openState = useDisclosure();

  const activeLink = useMemo(
    () =>
      links.find((tab) =>
        Array.isArray(tab.name)
          ? tab.name.find((t) => t === activePage)
          : tab.name === activePage,
      ),
    [activePage, links],
  ) as Route;

  const handleMenuToggle = () => {
    if (openState.isOpen) {
      openState.onClose();
    } else {
      openState.onOpen();
    }
  };

  return (
    <SideBarTunnel>
      <>
        <Box
          zIndex={zIndex}
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
            {navLink ? (
              navLink
            ) : activeLink ? (
              <NavLink onClick={handleMenuToggle} href={activeLink.path}>
                {activeLink.title}
              </NavLink>
            ) : null}
            <IconButton
              onClick={handleMenuToggle}
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

            {!sections ? (
              <Flex direction="column" mb={4}>
                <Flex mb={2} gap={2} align="center">
                  <Text noOfLines={1} as="label" size="body.md" color="faded">
                    {title}
                  </Text>
                </Flex>
                {!navLink
                  ? links.map(({ path, subActivePath, title: linkTitle }) => (
                      <NavLink
                        key={path}
                        href={path}
                        subActivePath={subActivePath}
                      >
                        {linkTitle}
                      </NavLink>
                    ))
                  : null}
              </Flex>
            ) : (
              sections
            )}
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
