import { Center } from "@chakra-ui/react";
import { motion } from "framer-motion";
import type { SlideStateProps } from "../shared";
import { slides } from "../slides";

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
    <div className="relative aspect-[16/9] w-full md:aspect-square">
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
    </div>
  );
};
