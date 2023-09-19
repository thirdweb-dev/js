import { Flex, Icon } from "@chakra-ui/react";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { TrackedLinkButton } from "tw-components";

interface LandingCTAButtonsProps {
  ctaLink: string;
  ctaText?: string;
  contactUsTitle?: string;
  noContactUs?: boolean;
  trackingCategory: string;
  alignLeft?: boolean;
}

export const LandingCTAButtons: React.FC<LandingCTAButtonsProps> = ({
  ctaLink,
  ctaText = "Get Started",
  contactUsTitle = "Contact Us",
  noContactUs,
  trackingCategory,
  alignLeft,
}) => {
  return (
    <Flex gap={{ base: 4, md: 6 }} mx={alignLeft ? "inherit" : "auto"}>
      <TrackedLinkButton
        leftIcon={<Icon as={BsFillLightningChargeFill} boxSize={4} />}
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
        fontWeight="bold"
      >
        {ctaText}
      </TrackedLinkButton>
      {!noContactUs && (
        <TrackedLinkButton
          variant="outline"
          py={6}
          px={8}
          href="/contact-us"
          category={trackingCategory}
          label="contact-us"
        >
          {contactUsTitle}
        </TrackedLinkButton>
      )}
    </Flex>
  );
};
