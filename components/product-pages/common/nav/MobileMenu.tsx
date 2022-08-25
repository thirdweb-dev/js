import { PRODUCTS } from "./Products";
import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Divider,
  IconButton,
  IconButtonProps,
  Menu,
  MenuButton,
  MenuList,
} from "@chakra-ui/react";
import { MenuGroup, MenuItem, TrackedLink } from "tw-components";

export const MobileMenu: React.FC<IconButtonProps> = (props) => {
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
        <MenuGroup title={<>Products</>} ml="12px">
          {PRODUCTS.map((product, id) => (
            <MenuItem
              key={id}
              as={TrackedLink}
              href={product.link}
              category="topnav"
              label={product.label}
            >
              {product.name}
            </MenuItem>
          ))}
        </MenuGroup>

        <Divider mt={2} opacity="0.3" />

        <MenuGroup title={<>Resources</>} ml="12px">
          <MenuItem
            as={TrackedLink}
            href="https://portal.thirdweb.com"
            category="topnav"
            label="docs"
            target="_blank"
          >
            Docs
          </MenuItem>
          <MenuItem
            as={TrackedLink}
            href="https://portal.thirdweb.com/guides"
            category="topnav"
            label="guides"
            target="_blank"
          >
            Guides
          </MenuItem>
          <MenuItem
            as={TrackedLink}
            href="https://blog.thirdweb.com"
            category="topnav"
            label="blog"
            target="_blank"
          >
            Blog
          </MenuItem>
          <MenuItem
            as={TrackedLink}
            href="https://careers.thirdweb.com"
            category="topnav"
            label="blog"
            target="_blank"
          >
            Careers
          </MenuItem>
        </MenuGroup>
      </MenuList>
    </Menu>
  );
};
