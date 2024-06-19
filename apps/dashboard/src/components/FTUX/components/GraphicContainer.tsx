import { SlideStateProps } from "../shared";
import { slides } from "../slides";
import { AspectRatio, Center } from "@chakra-ui/react";
import { motion } from "framer-motion";

interface BackgroundVariant {
  background: string;
}

const backgroundVariants: Record<string, BackgroundVariant> = {};
slides.forEach((slide, slideIndex) => {
  backgroundVariants[`slide-${slideIndex}`] = {
    background: slide.background,
  };
});

export const GraphicContainer: React.FC<SlideStateProps> = ({
  slideIndex,
  setSlideIndex,
}) => {
  const Graphic = slides[slideIndex].graphic;

  return (
    <AspectRatio ratio={{ base: 16 / 9, md: 1 }} w="100%" position="relative">
      <Center
        as={motion.div}
        initial={`slide-${slideIndex}`}
        animate={`slide-${slideIndex}`}
        variants={backgroundVariants}
        w="100%"
        h="100%"
        p={6}
      >
        <Graphic slideIndex={slideIndex} setSlideIndex={setSlideIndex} />
      </Center>
    </AspectRatio>
  );
};
