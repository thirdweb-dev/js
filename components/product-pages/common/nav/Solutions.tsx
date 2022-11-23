import { NavCard, NavCardProps } from "./NavCard";
import { Box, Fade, Flex, Stack, useDisclosure } from "@chakra-ui/react";
import { FiShoppingCart } from "react-icons/fi";
import { IoGameControllerOutline } from "react-icons/io5";
import { Card, Text } from "tw-components";

export const SOLUTIONS: NavCardProps[] = [
  {
    name: "Commerce",
    label: "commerce",
    description: "Integrate web3 into commerce apps",
    link: "/solutions/commerce",
    iconType: FiShoppingCart,
  },
  {
    name: "Gaming",
    label: "gaming",
    description: "Integrate web3 into games",
    link: "/solutions/gaming",
    iconType: IoGameControllerOutline,
    comingSoon: true,
  },
];

export const Solutions: React.FC = () => {
  const { onOpen, isOpen, onClose } = useDisclosure();

  return (
    <Box onMouseEnter={onOpen} onMouseLeave={onClose} zIndex={isOpen ? 10 : 1}>
      <Text
        color="white"
        fontWeight="bold"
        fontSize="16px"
        cursor="pointer"
        py={3}
        opacity={isOpen ? 0.8 : 1}
        transition="opacity 0.1s"
      >
        Solutions
      </Text>

      <Box position="relative">
        <Fade in={isOpen}>
          <Card
            pointerEvents={isOpen ? "all" : "none"}
            p="20px"
            onMouseEnter={onOpen}
            position="absolute"
            top={0}
            left="-280px"
            borderColor="whiteAlpha.100"
            bg="black"
            borderWidth="2px"
          >
            <Flex>
              <Stack width="300px">
                {SOLUTIONS.slice(0, Math.ceil(SOLUTIONS.length / 2)).map(
                  (solution, id) => (
                    <NavCard key={id} {...solution} />
                  ),
                )}
              </Stack>
              <Stack width="300px">
                {SOLUTIONS.slice(
                  Math.ceil(SOLUTIONS.length / 2),
                  SOLUTIONS.length,
                ).map((product, id) => (
                  <NavCard key={id} {...product} />
                ))}
              </Stack>
            </Flex>
          </Card>
        </Fade>
      </Box>
    </Box>
  );
};
