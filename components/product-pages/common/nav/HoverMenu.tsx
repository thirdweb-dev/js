import { NavCard, NavCardProps } from "./NavCard";
import {
  Box,
  Fade,
  Flex,
  SimpleGrid,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { Card, Text } from "tw-components";

interface HoverMenuProps {
  title: string;
  items: NavCardProps[];
  columns?: 1 | 2;
}

export const HoverMenu: React.FC<HoverMenuProps> = ({
  title,
  items,
  columns = 1,
}) => {
  const { onOpen, isOpen, onClose } = useDisclosure();

  return (
    <Box onMouseLeave={onClose}>
      <Text
        color="white"
        fontWeight="bold"
        fontSize="16px"
        cursor="pointer"
        py={3}
        opacity={isOpen ? 0.8 : 1}
        transition="opacity 0.1s"
        onMouseEnter={onOpen}
      >
        {title}
      </Text>

      <Box position="relative" display={isOpen ? "block" : "none"}>
        <Fade in={isOpen}>
          <Card
            p="20px"
            position="absolute"
            top={0}
            left={columns === 2 ? "-280px" : "-124px"}
            borderColor="whiteAlpha.100"
            bg="black"
            borderWidth="2px"
          >
            <Flex>
              <Stack width={columns === 2 ? "660px" : "300px"}>
                <SimpleGrid columns={columns}>
                  {items.map((item) => (
                    <NavCard key={item.label} {...item} />
                  ))}
                </SimpleGrid>
              </Stack>
            </Flex>
          </Card>
        </Fade>
      </Box>
    </Box>
  );
};
