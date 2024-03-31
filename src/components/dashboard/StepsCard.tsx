import { Box, Flex, Progress, useColorModeValue } from "@chakra-ui/react";
import { DelayedDisplay } from "components/delayed-display/delayed-display";
import { useMemo, useState } from "react";
import { FiCheck, FiChevronUp } from "react-icons/fi";
import { Card, Heading, Text } from "tw-components";

type Step = {
  title: string | JSX.Element;
  description?: string;
  completed: boolean;
  children: React.ReactNode;
  showCompletedChildren?: boolean;
};

interface StepsCardProps {
  title: string;
  description?: string;
  steps: Step[];
  delay?: number;
}

export const StepsCard: React.FC<StepsCardProps> = ({
  title,
  description,
  steps,
  delay = 500,
}) => {
  const firstIncomplete = steps.findIndex((step) => !step.completed);
  const lastStepCompleted =
    firstIncomplete === -1 ? steps.length - 1 : firstIncomplete - 1;
  const percentage = ((lastStepCompleted + 1) / steps.length) * 100;
  const isComplete = useMemo(() => firstIncomplete === -1, [firstIncomplete]);
  const [isOpen, setIsOpen] = useState(true);
  const bg = useColorModeValue(
    "white",
    "linear-gradient(158.84deg, rgba(255, 255, 255, 0.05) 13.95%, rgba(255, 255, 255, 0) 38.68%)",
  );

  if (steps.length === 0 || isComplete) {
    return null;
  }

  return (
    <DelayedDisplay delay={delay}>
      <Card
        flexDir="column"
        p={8}
        gap={4}
        position="relative"
        cursor={isComplete ? (isOpen ? "default" : "pointer") : undefined}
        onClick={isComplete ? () => !isOpen && setIsOpen(true) : undefined}
        bg={bg}
      >
        <Flex
          w="full"
          as={isComplete ? "button" : undefined}
          type={isComplete ? "button" : undefined}
          alignItems="center"
          justifyContent="space-between"
          gap={4}
          onClick={isComplete ? () => setIsOpen((prev) => !prev) : undefined}
        >
          {title && (
            <Heading size="label.lg" textAlign="left" mb={4}>
              {title}
            </Heading>
          )}
          {isComplete && (
            <Flex alignItems="center">
              <Heading size="subtitle.xs" mr="2">
                <Box position="relative">
                  <Box visibility="hidden" as="span" opacity="0" aria-hidden>
                    Collapse
                  </Box>
                  <Box
                    position="absolute"
                    right={0}
                    as="span"
                    display="inline-block"
                    transform={isOpen ? "translateY(0px)" : "translateY(-10px)"}
                    opacity={isOpen ? 1 : 0}
                    transition="all 0.33s"
                    transitionDelay={!isOpen ? "0s" : "0.05s"}
                    aria-hidden={isOpen}
                  >
                    Collapse
                  </Box>
                  <Box
                    position="absolute"
                    right={0}
                    display="inline-block"
                    as="span"
                    transform={isOpen ? "translateY(10px)" : "translateY(0px)"}
                    opacity={isOpen ? 0 : 1}
                    transition="all 0.33s"
                    transitionDelay={isOpen ? "0s" : "0.05s"}
                    aria-hidden={!isOpen}
                  >
                    Expand
                  </Box>
                </Box>
              </Heading>
              <Box
                transition="transform 0.33s"
                transform={`rotateX(${isOpen ? "0" : "180"}deg)`}
              >
                <FiChevronUp />
              </Box>
            </Flex>
          )}
        </Flex>
        <Flex
          maxH={isOpen ? "1000px" : "0px"}
          transform={isOpen ? "translateY(0px)" : "translateY(-10px)"}
          opacity={isOpen ? 1 : 0}
          transition="all 0.2s"
          willChange="max-height, opacity, transform"
          gap={0}
          direction="column"
        >
          {description && <Text mt={4}>{description}</Text>}
          <Progress value={percentage} mt={2} mb={2} rounded="full" size="sm" />
          <Text size="body.md" color="gray.700">
            {lastStepCompleted + 1}/{steps.length} tasks completed
          </Text>

          {steps.map(({ children, ...step }, index) => {
            const stepCompleted = index === lastStepCompleted + 1;

            return (
              <Flex
                flexDir={{ base: "column", md: "row" }}
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
                  mt={-1}
                >
                  {step.completed ? (
                    <FiCheck />
                  ) : (
                    <Text size="label.sm">{index + 1}</Text>
                  )}
                </Flex>
                <Flex flexDir="column" w="full">
                  {typeof step.title === "string" ? (
                    <Heading size="label.md" opacity={stepCompleted ? 1 : 0.6}>
                      {step.title}
                    </Heading>
                  ) : (
                    step.title
                  )}
                  {(step.showCompletedChildren || stepCompleted) && (
                    <>
                      {step.description && (
                        <Text my={2} color="gray.700">
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
        </Flex>
      </Card>
    </DelayedDisplay>
  );
};
