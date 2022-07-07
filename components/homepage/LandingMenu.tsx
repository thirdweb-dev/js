import { HamburgerIcon } from "@chakra-ui/icons";
import {
  IconButton,
  IconButtonProps,
  Menu,
  MenuButton,
  MenuList,
} from "@chakra-ui/react";
import { MenuItem, TrackedLink } from "tw-components";

export const LandingMenu: React.FC<IconButtonProps> = (props) => {
  return (
    <Menu>
      <MenuButton
        {...props}
        as={IconButton}
        aria-label="Menu"
        icon={<HamburgerIcon />}
        variant="outline"
      />
      <MenuList bgColor="black" color="white">
        <MenuItem
          as={TrackedLink}
          href="#contracts"
          category="mobile-menu"
          label="contracts"
        >
          Contracts
        </MenuItem>
        <MenuItem
          as={TrackedLink}
          href="#developers"
          category="mobile-menu"
          label="developers"
        >
          SDKs
        </MenuItem>
        <MenuItem
          as={TrackedLink}
          href="#dashboards"
          category="mobile-menu"
          label="dashboards"
        >
          Dashboards
        </MenuItem>
        <MenuItem
          as={TrackedLink}
          href="https://portal.thirdweb.com"
          category="mobile-menu"
          label="portal"
        >
          Docs
        </MenuItem>
        <MenuItem
          as={TrackedLink}
          href="#fees"
          category="mobile-menu"
          label="fees"
        >
          Pricing
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
