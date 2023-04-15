import { Flex } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { Text } from "tw-components";

interface GradientMapping {
  [key: string]: string;
}

type PrizeProps = {
  prize: {
    id: number;
    name: string;
    rarity: string;
    src: string;
    multiple: boolean;
    alt: string;
  };
};

export const gradientMapping: GradientMapping = {
  legendary: "linear(to-r, #B74AA4, #E173C7)",
  rare: "linear(to-r, #4830A4, #9786DF)",
  common: "linear(to-r, #743F9E, #BFA3DA)",
};

export const Prize: React.FC<PrizeProps> = ({
  prize: { name, src, multiple, alt, rarity },
}) => {
  return (
    <Flex direction="column" alignItems="center" maxW="325px" rounded="lg">
      <Flex
        direction="column"
        alignItems="center"
        gap={4}
        p={4}
        w="full"
        h="full"
        roundedBottom="xl"
      >
        <Text textAlign="center" fontSize="32px" fontWeight="bold">
          {name}
        </Text>
        <Text
          textTransform="uppercase"
          bgGradient={gradientMapping[rarity] || gradientMapping.rare}
          bgClip="text"
          fontSize="14px"
          fontWeight="bold"
        >
          {rarity} {multiple ? "prizes" : "prize"}
        </Text>
      </Flex>
      <ChakraNextImage src={src} alt={alt} px={12} mt={6} />
    </Flex>
  );
};
