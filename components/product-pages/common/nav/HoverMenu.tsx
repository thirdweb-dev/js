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
import { useEffect, useRef, useState } from "react";

interface HoverMenuProps {
  title: string;
  items: SectionItemProps[];
  columns?: 1 | 2;
}

const DEFAULT_OFFSET = -32;

export const HoverMenu: React.FC<HoverMenuProps> = ({
  title,
  items,
  columns = 1,
}) => {
  const { onOpen, isOpen, onClose } = useDisclosure();
  const [offset, setOffset] = useState(DEFAULT_OFFSET);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const width = columns === 2 ? 660 : 336;

  const updateOffset = () => {
    const el = triggerRef.current;

    if (el && isOpen) {
      const { right } = el.getBoundingClientRect();
      const isOverflowing = right + width > window.innerWidth;
      const newOffset = isOverflowing
        ? window.innerWidth - (right + width - 48)
        : DEFAULT_OFFSET;
      setOffset(newOffset);
    }
  };

  useEffect(() => {
    updateOffset();

    if (typeof window !== "undefined") {
      window.addEventListener("resize", updateOffset);

      return () => {
        window.removeEventListener("resize", updateOffset);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Box onMouseLeave={onClose}>
      <div ref={triggerRef}>
        <Text
          color="white"
          fontSize="16px"
          cursor="pointer"
          py="10px"
          opacity={isOpen ? 0.8 : 1}
          transition="opacity 0.1s"
          onMouseEnter={onOpen}
        >
          {title}
        </Text>
      </div>

      <Box position="relative" display={isOpen ? "block" : "none"}>
        <Fade in={isOpen}>
          <Card
            p="16px"
            position="absolute"
            top={0}
            left={offset}
            borderColor="whiteAlpha.100"
            bg="black"
            borderWidth="2px"
            borderRadius="8px"
            width={width}
          >
            <Flex>
              <Stack>
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
