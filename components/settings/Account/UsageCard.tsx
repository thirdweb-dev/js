import {
  Box,
  Icon,
  Progress,
  Tooltip,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { FiHelpCircle } from "react-icons/fi";
import { Heading, Card, Text } from "tw-components";
import { toUSD } from "utils/number";

interface UsageCardProps {
  name: string;
  overage?: number;
  title?: string;
  total?: string | number | JSX.Element;
  progress?: number;
  tooltip?: string;
}

const getProgressColor = (percent: number) => {
  if (percent > 90) {
    return "red";
  } else if (percent > 50) {
    return "yellow";
  }
  return "blue";
};

export const UsageCard: React.FC<UsageCardProps> = ({
  name,
  title,
  total,
  overage,
  progress,
  tooltip,
}) => {
  const bg = useColorModeValue("backgroundCardHighlight", "transparent");

  return (
    <Card minH={36} p={6} bg={bg}>
      <VStack gap={6} alignItems="flex-start">
        <Heading as="h3" size="label.lg">
          {name}

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

        <VStack gap={2} alignItems="flex-start" w="full">
          {title && (
            <Text size="body.md" mb={2}>
              {title}
            </Text>
          )}

          {total !== undefined && (
            <Text
              size="body.md"
              mb={2}
              color={typeof total === "number" ? "bgBlack" : undefined}
            >
              {typeof total === "number" ? toUSD(total) : total}
            </Text>
          )}

          {progress !== undefined && (
            <Progress
              w="full"
              size="xs"
              value={progress}
              rounded="full"
              colorScheme={getProgressColor(progress)}
            />
          )}

          {overage && (
            <Text size="body.md" mt={2}>
              Additional overage fees to your next invoice will be{" "}
              <Text as="span" size="label.sm" color="bgBlack">
                {toUSD(overage)}
              </Text>
              .
            </Text>
          )}
        </VStack>
      </VStack>
    </Card>
  );
};
