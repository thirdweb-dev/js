import React from "react";
import { VStack } from "@chakra-ui/react";
import { Heading, Text } from "tw-components";

interface OnboardingTitleProps {
  heading: string | JSX.Element;
  description?: string | JSX.Element;
}

export const OnboardingTitle: React.FC<OnboardingTitleProps> = ({
  heading,
  description,
}) => {
  return (
    <VStack alignItems="flex-start" gap={3}>
      <Heading size="title.sm">{heading}</Heading>

      {description && (
        <Text size="body.md" fontWeight="medium">
          {description}
        </Text>
      )}
    </VStack>
  );
};
