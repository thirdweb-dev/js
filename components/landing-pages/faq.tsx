import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Flex,
  Box,
} from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { HeadingSizes } from "theme/typography";
import { Heading, Text } from "tw-components";

interface LandingFAQProps {
  TRACKING_CATEGORY: string;
  title: string;
  hideMarginTop?: boolean;
  titleSize?: HeadingSizes;
  faqs: {
    title: string;
    description: React.ReactNode;
  }[];
}

export const LandingFAQ: React.FC<LandingFAQProps> = ({
  TRACKING_CATEGORY,
  title = "FAQ",
  hideMarginTop,
  titleSize,
  faqs,
}) => {
  const trackEvent = useTrack();
  const trackToggleFAQ = (faqTitle: string) => {
    trackEvent({
      category: TRACKING_CATEGORY,
      action: "toggle",
      label: "faq",
      faqTitle,
    });
  };

  return (
    <Flex
      mt={hideMarginTop ? 0 : 12}
      flexDirection="column"
      w="full"
      maxW={{
        base: "100%",
        lg: "container.md",
      }}
    >
      {title && (
        <Heading size={titleSize || "title.md"} alignSelf="center">
          {title}
        </Heading>
      )}
      <Accordion mt={8} allowMultiple rounded="xl">
        {faqs.map((faq) => (
          <AccordionItem key={faq.title} borderColor="borderColor">
            <Text fontSize="1rem">
              <AccordionButton
                p={4}
                onClick={() => trackToggleFAQ(faq.title)}
                fontWeight="medium"
              >
                <Box as="span" flex="1" textAlign="left">
                  {faq.title}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </Text>
            <AccordionPanel pb={6}>
              <Flex direction="column" gap={4}>
                {faq.description}
              </Flex>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Flex>
  );
};
