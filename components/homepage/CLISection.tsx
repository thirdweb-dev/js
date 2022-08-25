import { Box, BoxProps, Flex, Icon, SimpleGrid } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { Card, Heading, Text, TrackedLink } from "tw-components";
import { ComponentWithChildren } from "types/component-with-children";

const sections = [
  {
    title: "Create",
    command: "create",
    description:
      "Bootstrap your contracts or web3 powered apps with one command.",
    link: "https://portal.thirdweb.com/cli#create",
  },
  {
    title: "Deploy",
    command: "deploy",
    description: "Deploy any smart contract with a single command.",
    link: "https://portal.thirdweb.com/cli#deploy",
  },
  {
    title: "Release",
    command: "release",
    description:
      "Publish contracts to the on-chain registry to enable 1-click deployment for everyone.",
    link: "https://portal.thirdweb.com/cli#release",
  },
] as const;

const MotionFlex = motion(Flex);

export const CLISection: React.FC = () => {
  const [sectionId, setSectionId] = useState(0);

  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) {
      return;
    }
    const interval = setInterval(
      () => setSectionId((sId) => (sId + 1) % sections.length),
      5000,
    );
    return () => {
      clearInterval(interval);
    };
  }, [isHovered]);

  const activeSection = sections[sectionId];

  return (
    <SimpleGrid
      columns={{ base: 1, md: 2 }}
      alignItems="center"
      justifyItems="stretch"
      gap={4}
      w="full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      overflow={{ base: "hidden", md: "visible" }}
    >
      <Flex
        direction="column"
        mr={{ base: undefined, md: "auto" }}
        align={{ base: "center", md: "flex-start" }}
        gap={6}
      >
        <AnimatePresence exitBeforeEnter>
          <MotionFlex
            key={activeSection.command}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            direction="column"
            mr={{ base: undefined, md: "auto" }}
            align={{ base: "center", md: "flex-start" }}
            textAlign={{ base: "center", md: "left" }}
            gap={6}
          >
            <Heading
              bgClip="text"
              bgImage="linear-gradient(90.78deg, #486AC2 5.13%, #E41CA7 44.51%)"
              size="title.lg"
              mr={{ base: undefined, md: "auto" }}
              pr={{ base: undefined, md: "33%" }}
            >
              {activeSection.title}
            </Heading>

            <Text
              size="body.xl"
              color="rgba(255, 255, 255, 0.8)"
              maxW={{ base: "100%", md: "75%" }}
            >
              {activeSection.description}
            </Text>
          </MotionFlex>
        </AnimatePresence>
        <TrackedLink
          href={activeSection.link}
          category="cli-section"
          label={activeSection.command}
          display="flex"
          alignItems="center"
          gap={2}
          size="label.lg"
          fontWeight="600"
          isExternal
          noIcon
        >
          <span>Learn More</span> <Icon as={FiArrowRight} />
        </TrackedLink>
      </Flex>

      <Flex direction="column" gap={4}>
        <Card
          height="100%"
          bg="rgba(0,0,0,.5)"
          border="none"
          as={Flex}
          gap={6}
          flexDir="column"
        >
          <Flex gap={1.5}>
            <Box boxSize="10px" bg="#FF5F57" borderRadius="50%" />
            <Box boxSize="10px" bg="#FEBC2E" borderRadius="50%" />
            <Box boxSize="10px" bg="#27BF3E" borderRadius="50%" />
          </Flex>
          <Terminal
            minH="120px"
            bg="black"
            borderRadius="md"
            flexGrow={1}
            py={2}
            px={4}
          >
            $ npx thirdweb{" "}
            <AnimatePresence exitBeforeEnter>
              <motion.div
                style={{ display: "inline-block" }}
                key={activeSection.command}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {activeSection.command}
              </motion.div>
            </AnimatePresence>
          </Terminal>
        </Card>
        <Flex gap={1.5} mx="auto">
          <Box
            boxSize={3}
            bg={`rgba(255,255,255,${sectionId === 0 ? "1" : "0.3"})`}
            _hover={{
              bg: "rgba(255,255,255,.8)",
            }}
            cursor="pointer"
            onClick={() => setSectionId(0)}
            borderRadius="50%"
          />
          <Box
            boxSize={3}
            bg={`rgba(255,255,255,${sectionId === 1 ? "1" : "0.3"})`}
            _hover={{
              bg: "rgba(255,255,255,.8)",
            }}
            cursor="pointer"
            onClick={() => setSectionId(1)}
            borderRadius="50%"
          />
          <Box
            boxSize={3}
            bg={`rgba(255,255,255,${sectionId === 2 ? "1" : "0.3"})`}
            _hover={{
              bg: "rgba(255,255,255,.8)",
            }}
            cursor="pointer"
            onClick={() => setSectionId(2)}
            borderRadius="50%"
          />
        </Flex>
      </Flex>
    </SimpleGrid>
  );
};

interface TerminalProps extends BoxProps {}

const Terminal: ComponentWithChildren<TerminalProps> = ({
  children,
  ...restBoxProps
}) => {
  return (
    <Box {...restBoxProps} fontFamily="mono">
      {children}
    </Box>
  );
};
