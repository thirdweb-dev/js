import {
  Flex,
  type FlexProps,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { MenuIcon } from "lucide-react";
import { Drawer, Heading, TrackedLink, TrackedLinkButton } from "tw-components";
import {
  DEVELOPER_RESOURCES,
  MOBILE_PRODUCTS_SECTIONS,
  SOLUTIONS,
} from "./data";
import type { SectionItemProps } from "./types";

export const MobileMenu: React.FC<FlexProps> = (props) => {
  const disclosure = useDisclosure();

  return (
    <Flex gap={2} {...props} alignItems="center">
      <TrackedLinkButton
        bgColor="white"
        _hover={{
          bgColor: "white",
          opacity: 0.8,
        }}
        size="sm"
        color="black"
        href="/contact-us"
        category="landing-page"
        label="contact-us"
      >
        Contact Us
      </TrackedLinkButton>
      <IconButton
        aria-label="Homepage Menu"
        icon={<MenuIcon className="size-4" />}
        variant="ghost"
        onClick={disclosure.onOpen}
      />
      <Drawer
        drawerBodyProps={{ bg: "#111315" }}
        isOpen={disclosure.isOpen}
        onClose={disclosure.onClose}
        customPlacement="right"
        closeOnOverlayClick={true}
        noTopBorderRadius={true}
      >
        <Flex gap={6} direction="column">
          <MobileNavSection
            title="Products"
            links={MOBILE_PRODUCTS_SECTIONS}
            onItemClick={disclosure.onClose}
          />
          <MobileNavSection
            title="Solutions"
            links={SOLUTIONS}
            onItemClick={disclosure.onClose}
          />
          <MobileNavSection
            title="Developer"
            links={DEVELOPER_RESOURCES}
            onItemClick={disclosure.onClose}
          />
        </Flex>
      </Drawer>
    </Flex>
  );
};

type MobileNavSectionProps = {
  title: string;
  links: SectionItemProps[];
  onItemClick: () => void;
};

const MobileNavSection: React.FC<MobileNavSectionProps> = ({
  title,
  links,
  onItemClick,
}) => {
  return (
    <Flex gap={2} direction="column">
      <Heading size="label.sm" as="label" textTransform="uppercase">
        {title}
      </Heading>
      <ul className="ml-1.5 list-none gap-1.5">
        {links.map((link) => (
          <li className="min-h-5" key={link.label}>
            <Heading
              as={TrackedLink}
              display="flex"
              alignItems="center"
              gap={2}
              title={link.name}
              {...{
                category: "topnav",
                label: link.label,
                href: link.link,
                isExternal: link.link.startsWith("http"),
              }}
              size="label.md"
              onClick={onItemClick}
            >
              {link.icon && (
                <ChakraNextImage
                  alt=""
                  boxSize={5}
                  src={link.icon}
                  sizes="40px"
                  w={5}
                />
              )}
              {link.name}
            </Heading>
          </li>
        ))}
      </ul>
    </Flex>
  );
};
