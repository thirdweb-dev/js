import { PRODUCTS } from "./DesktopMenu";
import {
  Divider,
  IconButton,
  IconButtonProps,
  Menu,
  MenuButton,
  MenuList,
} from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";
import { MenuGroup, MenuItem, TrackedLink } from "tw-components";

export const MobileMenu: React.FC<IconButtonProps> = (props) => {
  return (
    <Menu>
      <MenuButton
        {...props}
        as={IconButton}
        aria-label="Menu"
        icon={<FiMenu />}
        variant="outline"
      />
      <MenuList bgColor="black" color="white">
        <MenuGroup title={<>Products</>} ml="12px">
          {PRODUCTS.map((product) => (
            <MenuItem
              key={product.label}
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
            href="https://blog.thirdweb.com/guides"
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

        <Divider mt={2} opacity="0.3" />

        <MenuGroup title={<>Solutions</>} ml="12px">
          <MenuItem
            as={TrackedLink}
            href="/solutions/commerce"
            category="topnav"
            label="commerce"
          >
            Commerce
          </MenuItem>
        </MenuGroup>

        <Divider mt={2} opacity="0.3" />

        <MenuGroup title={<>Networks</>} ml="12px">
          <MenuItem
            as={TrackedLink}
            href="/network/solana"
            category="topnav"
            label="network-solana"
          >
            Solana
          </MenuItem>
        </MenuGroup>

        <Divider mt={2} opacity="0.3" />

        <MenuGroup title={<>Faucets</>} ml="12px">
          <MenuItem
            as={TrackedLink}
            href="/faucet/solana"
            category="topnav"
            label="faucet-solana"
          >
            Solana
          </MenuItem>
        </MenuGroup>
      </MenuList>
    </Menu>
  );
};
