import { Box, Flex, Progress } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { FiCheck, FiChevronUp } from "react-icons/fi";
import { Card, Heading, Text } from "tw-components";

type Step = {
  title: string;
  description?: string;
  completed: boolean;
  children: React.ReactNode;
};

interface GetStartedProps {
  title: string;
  description: string;
  steps: Step[];
}

export const GetStarted: React.FC<GetStartedProps> = ({
  title,
  description,
  steps,
}) => {
  const firstIncomplete = steps.findIndex((step) => !step.completed);
  const lastStepCompleted =
    firstIncomplete === -1 ? steps.length - 1 : firstIncomplete - 1;
  const percentage = ((lastStepCompleted + 1) / steps.length) * 100;
  const isComplete = useMemo(() => firstIncomplete === -1, [firstIncomplete]);
  const [isOpen, setIsOpen] = useState(!isComplete);

  return (
    <Card
      flexDir="column"
      p={8}
      gap={4}
      position="relative"
      cursor={isOpen ? "default" : "pointer"}
      onClick={() => !isOpen && setIsOpen(true)}
    >
      <Flex
        w="full"
        as="button"
        type="button"
        alignItems="center"
        justifyContent="space-between"
        gap={4}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <Text size="label.xl" textAlign="left">
          {title}
        </Text>
        {isComplete && (
          <Flex alignItems="center">
            <Heading size="subtitle.xs" mr="2">
              {isOpen ? "Collapse" : "Expand"}
            </Heading>
            <Box
              transition="transform 0.2s"
              transform={`rotateX(${isOpen ? "0" : "180"}deg)`}
            >
              <FiChevronUp />
            </Box>
          </Flex>
        )}
      </Flex>
      {isOpen && (
        <>
          <Text mt={4}>{description}</Text>
          <Progress value={percentage} mt={8} mb={2} rounded="full" />
          <Text size="body.sm" mt={2} color="gray.700">
            {lastStepCompleted + 1}/{steps.length} Tasks Completed
          </Text>
          {steps.map(({ children, ...step }, index) => {
            return (
              <Flex
                flexDir={{ base: "column", md: "row" }}
                opacity={index === lastStepCompleted + 1 ? 1 : 0.6}
                key={index}
                mt={8}
                gap={4}
                w="full"
              >
                <Flex
                  w={6}
                  h={6}
                  shrink={0}
                  rounded="full"
                  alignItems="center"
                  justifyContent="center"
                  border="1px solid"
                  borderColor={step.completed ? "gray.500" : "gray.700"}
                >
                  {step.completed ? (
                    <FiCheck />
                  ) : (
                    <Text size="label.sm">{index + 1}</Text>
                  )}
                </Flex>
                <Flex flexDir="column" w="full">
                  <Text>{step.title}</Text>
                  {index === lastStepCompleted + 1 && (
                    <>
                      {step.description && (
                        <Text my={2} size="body.sm" color="gray.700">
                          {step.description}
                        </Text>
                      )}
                      <Box mt={4} w="full">
                        {children}
                      </Box>
                    </>
                  )}
                </Flex>
              </Flex>
            );
          })}
        </>
      )}
    </Card>
  );
};
