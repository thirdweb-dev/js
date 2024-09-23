import { type BoxProps, Flex } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import type { StaticImageData } from "next/image";
import { useRouter } from "next/router";
import { Card, Text } from "tw-components";

interface PlaygroundMenuProps extends BoxProps {
  title: string;
  description: string;
  href: string;
  isSelected: boolean;
  onClick: () => void;
  image: StaticImageData;
}

export const PlaygroundMenu: React.FC<PlaygroundMenuProps> = ({
  title,
  description,
  href,
  image,
  isSelected,
  onClick,
  ...rest
}) => {
  const router = useRouter();

  return (
    <Card
      w="full"
      maxW="100%%"
      p="26px 20px"
      overflow="hidden"
      bgColor="backgroundCardHighlight"
      borderWidth={1}
      borderColor={isSelected ? "#3385FF" : "borderColor"}
      transition="border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease"
      _hover={{
        borderColor: "#3385FF",
        boxShadow: "0 0 16px hsl(215deg 100% 60% / 30%)",
        transform: "scale(1.01)",
      }}
      cursor="pointer"
      height="full"
      onClick={() => {
        onClick();
        router.push(href);
      }}
      {...rest}
    >
      <Flex flexDir="column">
        <Flex gap={2} alignItems="center">
          <ChakraNextImage alt="" boxSize={6} src={image} maxW="fit-content" />
          <Text
            fontSize={{ base: "18px", md: "22px" }}
            ml="11px"
            my={0}
            fontWeight={600}
            color="#fff"
            wordBreak="break-word"
          >
            {title}
          </Text>
        </Flex>
        <Text
          mt={3}
          color="#fff"
          fontSize="14px"
          opacity={0.7}
          maxW="fit-content"
          textAlign="left"
          wordBreak="break-word"
        >
          {description}
        </Text>

        <Text
          mt={3}
          color="#fff"
          fontSize="14px"
          maxW="fit-content"
          textAlign="left"
        >
          Learn more →
        </Text>
      </Flex>
    </Card>
  );
};
