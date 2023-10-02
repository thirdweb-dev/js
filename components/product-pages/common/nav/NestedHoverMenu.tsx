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
import { ProductNavCard } from "./ProductNavCard";
import { useEffect, useRef, useState } from "react";
import { SectionItemProps, SectionProps } from "./types";

interface NestedHoverMenuProps {
  title: string;
  items: SectionItemProps[];
  sections: SectionProps[];
  initialSection: string;
}

const WIDTH = 672;
const DEFAULT_OFFSET = -32;

export const NestedHoverMenu: React.FC<NestedHoverMenuProps> = ({
  title,
  items,
  sections,
  initialSection,
}) => {
  const { onOpen, isOpen, onClose } = useDisclosure();
  const [offset, setOffset] = useState(DEFAULT_OFFSET);
  const [hoveredSection, setHoveredSection] = useState<string>(initialSection);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (label: string) => {
    // Clear any pending close actions
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
    }

    hoverTimeout.current = setTimeout(() => {
      setHoveredSection(label);
      onOpen();
    }, 100);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
    }
  };

  const handleBoxLeave = () => {
    closeTimeout.current = setTimeout(() => {
      // We just check if the menu is open, and if so, close it.
      if (isOpen) {
        onClose();
        setHoveredSection(initialSection);
      }
    }, 100);
  };

  const updateOffset = () => {
    const el = triggerRef.current;

    if (el && isOpen) {
      const { right } = el.getBoundingClientRect();
      const isOverflowing = right + WIDTH > window.innerWidth;
      const newOffset = isOverflowing
        ? window.innerWidth - (right + WIDTH)
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
    <Box onMouseLeave={handleBoxLeave}>
      <div ref={triggerRef}>
        <Text
          color="white"
          fontSize="16px"
          cursor="pointer"
          opacity={isOpen ? 0.8 : 1}
          transition="opacity 0.1s"
          onMouseEnter={onOpen}
          py="10px"
        >
          {title}
        </Text>
      </div>

      <Box position="relative" visibility={isOpen ? "visible" : "hidden"}>
        <Fade in={isOpen}>
          <Card
            p={0}
            position="absolute"
            top={0}
            left={offset}
            borderColor="whiteAlpha.100"
            bg="black"
            borderWidth="2px"
            overflow="hidden"
            borderRadius="8px"
            width={WIDTH}
          >
            <Flex>
              <Flex
                flexDir="column"
                borderRight="1px"
                borderRightColor="gray.900"
              >
                {sections.map((section) => (
                  <Stack
                    key={section.name}
                    onMouseEnter={() => handleMouseEnter(section.label)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <SimpleGrid columns={1}>
                      <ProductNavCard
                        key={section.label}
                        selected={hoveredSection === section.label}
                        {...section}
                      />
                    </SimpleGrid>
                  </Stack>
                ))}
              </Flex>
              <Flex p={4} bg="#0E0F11">
                <Stack width="328px">
                  <SimpleGrid columns={1} gap={2}>
                    {items
                      .filter((item) => item.section === hoveredSection)
                      .map((item) => (
                        <NavCard key={item.label} {...item} />
                      ))}
                  </SimpleGrid>
                </Stack>
              </Flex>
            </Flex>
          </Card>
        </Fade>
      </Box>
    </Box>
  );
};
