import {
  Box,
  Icon,
  Tooltip,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { FiHelpCircle } from "react-icons/fi";
import { Heading, Card, Text } from "tw-components";

interface UsageCardProps {
  title: string;
  description: string;
  total: string | JSX.Element;
  tooltip?: string;
}

export const UsageCard: React.FC<UsageCardProps> = ({
  title,
  description,
  total,
  tooltip,
}) => {
  const bg = useColorModeValue("backgroundCardHighlight", "transparent");

  return (
    <Card minH={36} p={6} bg={bg}>
      <VStack gap={6} alignItems="flex-start">
        <Heading as="h3" size="label.lg">
          {title}

          {tooltip && (
            <Tooltip
              p={0}
              bg="transparent"
              boxShadow={"none"}
              label={
                <Card py={2} px={4} bgColor="backgroundHighlight">
                  <Text size="body.md">{tooltip}</Text>
                </Card>
              }
            >
              <Box as="span" display="relative">
                <Icon
                  opacity={0.5}
                  as={FiHelpCircle}
                  position="absolute"
                  ml={1}
                />
              </Box>
            </Tooltip>
          )}
        </Heading>

        <VStack gap={1} alignItems="flex-start">
          <Text size="body.md">{description}</Text>
          <Heading size="label.lg" fontWeight="normal">
            {total}
          </Heading>
        </VStack>
      </VStack>
    </Card>
  );
};
