import { HoverMenu } from "./HoverMenu";
import { Flex, Stack } from "@chakra-ui/react";
import { TrackedLink, TrackedLinkButton } from "tw-components";
import { NestedHoverMenu } from "./NestedHoverMenu";
import {
  DEVELOPER_RESOURCES,
  DEVELOPER_SECTIONS,
  PRODUCTS,
  PRODUCT_SECTIONS,
  COMPANY,
  SOLUTIONS,
} from "./data";

export const DesktopMenu: React.FC = () => {
  return (
    <Flex gap={8}>
      <Stack
        display={["none", "none", "flex"]}
        direction="row"
        alignItems="center"
        color="gray.50"
        fontWeight="bold"
        spacing={10}
        as="nav"
      >
        <NestedHoverMenu
          title="Products"
          initialSection="contracts"
          sections={PRODUCT_SECTIONS}
          items={PRODUCTS}
        />
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
          display={{ base: "none", xl: "flex" }}
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
      </Stack>
    </Flex>
  );
};
