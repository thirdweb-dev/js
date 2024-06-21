import { Box, SimpleGrid } from "@chakra-ui/react";
import { AnimatePresence, MotionConfig } from "framer-motion";
import { useState } from "react";
import { Card } from "tw-components";
import { ContentContainer } from "./components/ContentContainer";
import { GraphicContainer } from "./components/GraphicContainer";

/**
 * FTUX (First Time User Experience)
 * It is rendered when user is not connected to any wallet
 */

export const FTUX: React.FC = () => {
  const [slideIndex, setSlideIndex] = useState(0);

  return (
    <section>
      <MotionConfig transition={{ duration: 0.3 }}>
        <AnimatePresence initial={slideIndex !== 0}>
          {/* slide */}
          <Box maxW={900} marginInline="auto" marginBlock={8}>
            <Card padding={0} overflow="hidden">
              <SimpleGrid
                overflow="hidden"
                columns={{ base: 1, md: 2 }}
                placeItems="center"
                p={0}
              >
                <GraphicContainer
                  slideIndex={slideIndex}
                  setSlideIndex={setSlideIndex}
                />
                <ContentContainer
                  slideIndex={slideIndex}
                  setSlideIndex={setSlideIndex}
                />
              </SimpleGrid>
            </Card>
          </Box>
        </AnimatePresence>
      </MotionConfig>
    </section>
  );
};
