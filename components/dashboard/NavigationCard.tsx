import { LinkBox, Flex, LinkOverlay, useColorMode } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { BsArrowRight } from "react-icons/bs";
import { TrackedLink, Heading, Card, Text } from "tw-components";

interface NavigationCardProps {
  title: string;
  description: string;
  lightImage?: StaticImport;
  image: StaticImport;
  href: string;
  TRACKING_CATEGORY: string;
}

export const NavigationCard: React.FC<NavigationCardProps> = ({
  title,
  description,
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
        bg="linear-gradient(158.84deg, rgba(255, 255, 255, 0.05) 13.95%, rgba(255, 255, 255, 0) 38.68%)"
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
        />
        <Flex
          flexDir="column"
          gap={6}
          p={7}
          justifyContent="space-between"
          h="full"
        >
          <LinkOverlay
            as={TrackedLink}
            category={TRACKING_CATEGORY}
            label={title}
            href={href}
            _hover={{ textDecor: "none" }}
          >
            <Heading
              size="title.md"
              _groupHover={{ color: "blue.500" }}
              transitionDuration="200ms"
              display="flex"
              alignItems="center"
              gap="0.5em"
            >
              {title} <BsArrowRight />
            </Heading>
          </LinkOverlay>
          <Text>{description}</Text>
        </Flex>
      </Card>
    </LinkBox>
  );
};
