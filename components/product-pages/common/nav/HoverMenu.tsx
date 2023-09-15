import { NavCard } from "./NavCard";
import {
  Box,
  Fade,
  Flex,
  SimpleGrid,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { Card, Text } from "tw-components";
import { SectionItemProps } from "./types";

interface HoverMenuProps {
  title: string;
  items: SectionItemProps[];
  columns?: 1 | 2;
  leftOffset?: string;
}

export const HoverMenu: React.FC<HoverMenuProps> = ({
  title,
  items,
  columns = 1,
  leftOffset = "0px",
}) => {
  const { onOpen, isOpen, onClose } = useDisclosure();

  return (
    <Box onMouseLeave={onClose}>
      <Text
        color="white"
        fontSize="16px"
        cursor="pointer"
        py={4}
        opacity={isOpen ? 0.8 : 1}
        transition="opacity 0.1s"
        onMouseEnter={onOpen}
      >
        {title}
      </Text>

      <Box position="relative" display={isOpen ? "block" : "none"}>
        <Fade in={isOpen}>
          <Card
            p="16px"
            position="absolute"
            top={0}
            left={leftOffset}
            borderColor="whiteAlpha.100"
            bg="black"
            borderWidth="2px"
            borderRadius="8px"
          >
            <Flex>
              <Stack width={columns === 2 ? "660px" : "300px"}>
                <SimpleGrid columns={columns} gap={2}>
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
