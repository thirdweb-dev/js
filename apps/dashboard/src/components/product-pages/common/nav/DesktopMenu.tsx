import { Flex } from "@chakra-ui/react";
import { TrackedLink, TrackedLinkButton } from "tw-components";
import { HoverMenu } from "./HoverMenu";
import { NestedHoverMenu } from "./NestedHoverMenu";
import {
  COMPANY,
  DEVELOPER_RESOURCES,
  DEVELOPER_SECTIONS,
  PRODUCT_SECTIONS,
  SOLUTIONS,
} from "./data";

export const DesktopMenu: React.FC = () => {
  return (
    <Flex gap={8} display={{ base: "none", xl: "flex" }}>
      <nav className="flex flex-row items-center gap-10 font-bold text-gray-50">
        <HoverMenu title="Products" items={PRODUCT_SECTIONS} />
        <HoverMenu title="Solutions" items={SOLUTIONS} />

        <TrackedLink
          fontWeight={400}
          href="/pricing"
          category="landing-page"
          label="pricing"
          _hover={{
            textDecor: "none",
            opacity: 0.8,
          }}
        >
          Pricing
        </TrackedLink>
        <NestedHoverMenu
          title="Developer"
          initialSection="resources"
          sections={DEVELOPER_SECTIONS}
          items={DEVELOPER_RESOURCES}
        />
        <HoverMenu title="Company" items={COMPANY} />
        <TrackedLinkButton
          display="flex"
          bgColor="white"
          _hover={{
            bgColor: "white",
            opacity: 0.8,
          }}
          color="black"
          href="/contact-us"
          category="landing-page"
          label="contact-us"
          size="sm"
        >
          Contact Us
        </TrackedLinkButton>
      </nav>
    </Flex>
  );
};
