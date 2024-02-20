import { moveDown, moveUp } from "../animations";
import { SlideStateProps } from "../shared";
import { Center, Flex } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { motion } from "framer-motion";
import { Heading } from "tw-components";

export const Titles: React.FC<SlideStateProps> = ({
  slideIndex: step,
  setSlideIndex: setStep,
}) => {
  return (
    <motion.div {...moveUp} style={{ height: "100%" }}>
      <Flex
        gap={6}
        direction="column"
        justify="center"
        textAlign="center"
        h="100%"
      >
        {["Connect", "Contracts", "Engine"].map((heading, i) => (
          <Heading
            key={heading}
            cursor="pointer"
            onClick={() => setStep(i + 1)}
            size="title.2xl"
            transition="all 0.2s"
            color="white"
            {...(step === i + 1
              ? {
                  opacity: 1,
                  fontWeight: 700,
                  letterSpacing: "0em",
                }
              : {
                  opacity: 0.5,
                  fontWeight: 400,
                  letterSpacing: "0.02em",
                })}
          >
            {heading}
          </Heading>
        ))}
      </Flex>
    </motion.div>
  );
};

export const DashboardImage: React.FC = () => (
  <motion.div {...moveDown}>
    <Center>
      <ChakraNextImage
        priority
        w={{ base: "45%", md: "90%" }}
        src={require("public/assets/product-pages/dashboard/hero.png")}
        alt=""
      />
    </Center>
  </motion.div>
);

export const ConnectWalletImage: React.FC = () => (
  <motion.div {...moveDown}>
    <Center h="100%" w="100%">
      <ChakraNextImage
        alt=""
        boxSize="75px"
        src={require("/public/logos/wallet.png")}
      />
    </Center>
  </motion.div>
);
