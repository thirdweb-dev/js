import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Flex, IconButton } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { MenuIcon } from "lucide-react";
import { useState } from "react";
import { Heading, TrackedLink, TrackedLinkButton } from "tw-components";
import {
  DEVELOPER_RESOURCES,
  MOBILE_PRODUCTS_SECTIONS,
  SOLUTIONS,
} from "./data";
import type { SectionItemProps } from "./types";

export const MobileMenu: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <Flex gap={2} display={{ base: "inherit", xl: "none" }} alignItems="center">
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
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <IconButton
            aria-label="Homepage Menu"
            icon={<MenuIcon className="size-6" />}
            variant="ghost"
          />
        </SheetTrigger>

        <SheetContent className="z-[1300] flex max-w-[320px] flex-col gap-6 overflow-y-auto bg-[#111315]">
          <MobileNavSection
            title="Products"
            links={MOBILE_PRODUCTS_SECTIONS}
            onItemClick={() => setOpen(false)}
          />
          <MobileNavSection
            title="Solutions"
            links={SOLUTIONS}
            onItemClick={() => setOpen(false)}
          />
          <MobileNavSection
            title="Developer"
            links={DEVELOPER_RESOURCES}
            onItemClick={() => setOpen(false)}
          />
        </SheetContent>
      </Sheet>
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
          <li className="min-h-5 py-2" key={link.label}>
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
