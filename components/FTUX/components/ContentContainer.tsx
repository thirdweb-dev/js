import { textAnimation, titleAnimation } from "../animations";
import { SlideStateProps, TRACK_CATEGORY } from "../shared";
import { lastSlideIndex, slides } from "../slides";
import { CustomConnectWallet } from "@3rdweb-sdk/react/components/connect-wallet";
import { Box, ButtonGroup, Center, Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useTrack } from "hooks/analytics/useTrack";
import React from "react";
import { FiArrowRight } from "react-icons/fi";
import { Button, Heading } from "tw-components";

interface SlideContentProps {
  slideIndex: number;
  title: React.ReactNode;
  content: React.ReactNode;
}

const SlideContent: React.FC<SlideContentProps> = ({
  slideIndex,
  title,
  content,
}) => {
  return (
    <Flex
      gap={4}
      as={motion.div}
      direction="column"
      key={`slide-${slideIndex}`}
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      // set minHeight on mobile to keep the next button at the bottom in same position
      minHeight={{ base: "220px", md: "auto" }}
    >
      <motion.div {...titleAnimation}>
        <Heading size="title.md" mb={2}>
          {title}
        </Heading>
      </motion.div>
      <motion.div {...textAnimation}>{content}</motion.div>
    </Flex>
  );
};

export const ContentContainer: React.FC<SlideStateProps> = ({
  slideIndex,
  setSlideIndex,
}) => {
  const track = useTrack();

  const goToNextStep = () => {
    const nextSlideIndex = slideIndex + 1;
    setSlideIndex(nextSlideIndex);

    // next clicked
    track({
      category: TRACK_CATEGORY,
      action: "click",
      label: "next",
      currentStep: slideIndex,
    });

    // complete
    if (nextSlideIndex === lastSlideIndex) {
      track({
        category: TRACK_CATEGORY,
        action: "click",
        label: "complete",
      });
    }
  };

  const goToPreviousStep = () => {
    setSlideIndex(slideIndex - 1);

    // previous clicked
    track({
      category: TRACK_CATEGORY,
      action: "click",
      label: "back",
      currentStep: slideIndex,
    });
  };

  const isLastSlide = slideIndex === lastSlideIndex;

  return (
    <Flex
      direction="column"
      gap={4}
      p={6}
      w="100%"
      h="100%"
      justify="space-between"
    >
      <Center flexGrow={1} position="relative">
        <Flex gap={8} direction="column" height="100%" width={"100%"}>
          <Box position="relative" w="full" mt="auto">
            <SlideContent
              slideIndex={slideIndex}
              title={slides[slideIndex].title}
              content={slides[slideIndex].content}
            />
          </Box>

          <ButtonGroup variant="solid" gap={1} mt={"auto"}>
            <Button onClick={goToPreviousStep} isDisabled={slideIndex === 0}>
              Back
            </Button>

            {isLastSlide ? (
              <CustomConnectWallet />
            ) : (
              <Button
                autoFocus
                onClick={goToNextStep}
                rightIcon={isLastSlide ? undefined : <FiArrowRight />}
                colorScheme="blue"
                isDisabled={isLastSlide}
              >
                {isLastSlide ? "Start Now" : "Next"}
              </Button>
            )}
          </ButtonGroup>
        </Flex>
      </Center>
    </Flex>
  );
};
