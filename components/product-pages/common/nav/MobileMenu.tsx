import { PRODUCTS, RESOURCES, SOLUTIONS } from "./DesktopMenu";
import type { NavCardProps } from "./NavCard";
import {
  Flex,
  Icon,
  IconButton,
  IconButtonProps,
  ListItem,
  UnorderedList,
  useDisclosure,
} from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { FiMenu } from "react-icons/fi";
import { Drawer, Heading, TrackedLink } from "tw-components";

export const MobileMenu: React.FC<IconButtonProps> = (props) => {
  const disclosure = useDisclosure();

  return (
    <>
      <IconButton
        {...props}
        aria-label="Menu"
        icon={<FiMenu />}
        variant="ghost"
        onClick={disclosure.onOpen}
      />
      <Drawer
        drawerBodyProps={{ bg: "#111315" }}
        isOpen={disclosure.isOpen}
        onClose={disclosure.onClose}
      >
        <Flex gap={6} direction="column">
          <MobileNavSection
            title="Products"
            links={PRODUCTS}
            onItemClick={disclosure.onClose}
          />
          <MobileNavSection
            title="Resources"
            links={RESOURCES}
            onItemClick={disclosure.onClose}
          />
          <MobileNavSection
            title="Solutions"
            links={SOLUTIONS}
            onItemClick={disclosure.onClose}
          />
        </Flex>
      </Drawer>
    </>
  );
};

type MobileNavSectionProps = {
  title: string;
  links: NavCardProps[];
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
      <UnorderedList listStyleType="none" ml={1.5} spacing={1.5}>
        {links.map((link) => (
          <ListItem key={link.label} minH={5}>
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
              {link.icon ? (
                <ChakraNextImage
                  alt=""
                  boxSize={5}
                  src={link.icon}
                  sizes="40px"
                  w={5}
                />
              ) : link.iconType ? (
                <Icon as={link.iconType} h={4} w={5} />
              ) : null}
              {link.name}
            </Heading>
          </ListItem>
        ))}
      </UnorderedList>
    </Flex>
  );
};
