import { Flex } from "@chakra-ui/react";
import { ZapIcon } from "lucide-react";
import { TrackedLinkButton, type TrackedLinkProps } from "tw-components";

interface LandingCTAButtonsProps {
  ctaLink?: string;
  ctaText?: string;
  contactUsTitle?: string;
  noCta?: boolean;
  noContactUs?: boolean;
  contactUsLink?: string;
  trackingCategory: string;
  alignLeft?: boolean;
  contactUsBg?: TrackedLinkProps["bg"];
  contactUsHover?: TrackedLinkProps["_hover"];
  contactUsBorder?: TrackedLinkProps["border"];
}

export const LandingCTAButtons: React.FC<LandingCTAButtonsProps> = ({
  ctaLink = "/team",
  ctaText = "Get Started",
  contactUsTitle = "Contact Us",
  contactUsBg,
  contactUsHover,
  contactUsBorder,
  noCta,
  noContactUs,
  contactUsLink,
  trackingCategory,
  alignLeft,
}) => {
  return (
    <Flex gap={{ base: 4, md: 6 }} mx={alignLeft ? "inherit" : "auto"}>
      {!noCta && (
        <TrackedLinkButton
          leftIcon={<ZapIcon className="size-4 fill-inherit" />}
          py={6}
          px={8}
          bgColor="white"
          _hover={{
            bgColor: "white",
            opacity: 0.8,
          }}
          color="black"
          href={ctaLink}
          category={trackingCategory}
          label={ctaText.replaceAll(" ", "-").toLowerCase()}
          fontWeight="bo
          ld"
        >
          {ctaText}
        </TrackedLinkButton>
      )}
      {!noContactUs && (
        <TrackedLinkButton
          variant="outline"
          py={6}
          px={8}
          href={contactUsLink || "/contact-us"}
          category={trackingCategory}
          label="contact-us"
          bg={contactUsBg}
          border={contactUsBorder}
          _hover={contactUsHover}
        >
          {contactUsTitle}
        </TrackedLinkButton>
      )}
    </Flex>
  );
};
