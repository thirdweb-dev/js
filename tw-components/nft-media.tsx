import { Text } from "./text";
import { Box, Center, Flex, Icon, PropsOf, chakra } from "@chakra-ui/react";
import { ThirdwebNftMedia, ThirdwebNftMediaProps } from "@thirdweb-dev/react";
import { FiImage } from "react-icons/fi";

export const NFTMedia = chakra(ThirdwebNftMedia, {
  shouldForwardProp: (prop) => ["width", "height", "metadata"].includes(prop),
});

export const NFTMediaWithEmptyState: React.FC<
  PropsOf<typeof NFTMedia> & ThirdwebNftMediaProps
> = (props) => {
  if (!(props.metadata.image || props.metadata.animation_url)) {
    return (
      <Center
        borderRadius="lg"
        width={props.width}
        height={props.height}
        borderColor="accent.300"
        borderWidth="1px"
        boxSize={props.boxSize}
      >
        <Flex direction="column" align="center" gap={1.5}>
          <Icon boxSize={6} as={FiImage} color="accent.300" />
          <Text as="span" size="label.sm" color="accent.300">
            No Media
          </Text>
        </Flex>
      </Center>
    );
  }
  return (
    <Box
      boxSize={props.boxSize}
      width={props.width}
      height={props.height}
      borderRadius="lg"
    >
      <NFTMedia {...props} width="100%" height="100%" />
    </Box>
  );
};
