import {
  LinkBox,
  Flex,
  LinkOverlay,
  useColorMode,
  Box,
} from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { BsArrowRight } from "react-icons/bs";
import { TrackedLink, Heading, Card, Text, Badge } from "tw-components";

interface NavigationCardProps {
  title: string;
  description: string;
  badge?: string;
  badgeColor?: string;
  lightImage?: StaticImport;
  image: StaticImport;
  href: string;
  TRACKING_CATEGORY: string;
}

export const NavigationCard: React.FC<NavigationCardProps> = ({
  title,
  description,
  badge,
  badgeColor,
  lightImage,
  image,
  href,
  TRACKING_CATEGORY,
}) => {
  const { colorMode } = useColorMode();

  return (
    <LinkBox role="group" overflow="hidden" position="relative">
      <Card
        p={0}
        overflow="hidden"
        _groupHover={{
          borderColor: "blue.500",
        }}
        transitionDuration="200ms"
        as={Flex}
        flexDir="column"
        padding={0}
        h="full"
      >
        <ChakraNextImage
          pointerEvents="none"
          sizes="(max-width: 768px) 100vw,
                            (max-width: 1200px) 50vw,
                            33vw"
          src={colorMode === "light" && lightImage ? lightImage : image}
          alt=""
          position="relative"
        />
        <Flex
          flexDir="column"
          gap={4}
          p={6}
          h="full"
          position="absolute"
          zIndex={10}
          top={0}
          right={0}
          bottom={0}
          left={0}
        >
          {badge && badgeColor && (
            <Box>
              <Badge
                borderRadius="md"
                bgColor={badgeColor}
                px={2}
                textTransform="none"
                color="white"
                py={1}
              >
                {badge}
              </Badge>
            </Box>
          )}
          <Flex flexDir="column" gap={2}>
            <LinkOverlay
              as={TrackedLink}
              category={TRACKING_CATEGORY}
              label={title}
              href={href}
              isExternal={!href.startsWith("/")}
              _hover={{ textDecor: "none" }}
            >
              <Heading
                size="title.sm"
                _groupHover={{ color: "blue.500" }}
                transitionDuration="200ms"
                display="flex"
                alignItems="center"
                gap="0.5em"
              >
                {title} <BsArrowRight />
              </Heading>
            </LinkOverlay>
            <Text size="body.md">{description}</Text>
          </Flex>
        </Flex>
      </Card>
    </LinkBox>
  );
};
