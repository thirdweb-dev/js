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

interface UsageCardProps {
  name: string;
  metrics: {
    title: string;
    total: string | JSX.Element;
    progress?: number;
  }[];
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
  metrics,
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

        <VStack gap={6} alignItems="flex-start" w="full">
          {metrics.map(({ total, title, progress }, i) => {
            return (
              <VStack
                key={`metric-${i}`}
                gap={2}
                alignItems="flex-start"
                w="full"
              >
                <Text size="body.md">{title}</Text>
                <Heading size="label.md" fontWeight="normal" mb={2}>
                  {total}
                </Heading>
                {progress !== undefined && (
                  <Progress
                    w="full"
                    size="xs"
                    value={progress}
                    rounded="full"
                    colorScheme={getProgressColor(progress)}
                  />
                )}
              </VStack>
            );
          })}
        </VStack>
      </VStack>
    </Card>
  );
};
