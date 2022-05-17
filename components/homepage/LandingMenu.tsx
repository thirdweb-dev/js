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
          href="#developers"
          category="mobile-menu"
          label="developers"
        >
          Developers
        </MenuItem>
        <MenuItem
          as={TrackedLink}
          href="#features"
          category="mobile-menu"
          label="fees"
        >
          Features
        </MenuItem>
        <MenuItem
          as={TrackedLink}
          href="#fees"
          category="mobile-menu"
          label="fees"
        >
          Pricing
        </MenuItem>

        <MenuItem
          as={TrackedLink}
          href="https://portal.thirdweb.com"
          category="mobile-menu"
          label="portal"
        >
          Docs
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
