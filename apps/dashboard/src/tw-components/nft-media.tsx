import {
  Box,
  Center,
  Flex,
  Icon,
  type PropsOf,
  chakra,
} from "@chakra-ui/react";
import {
  ThirdwebNftMedia,
  type ThirdwebNftMediaProps,
} from "@thirdweb-dev/react";
import { FiImage } from "react-icons/fi";
import { Text } from "./text";

const NFTMedia = chakra(ThirdwebNftMedia, {
  shouldForwardProp: (prop) =>
    ["width", "height", "metadata", "requireInteraction", "controls"].includes(
      prop,
    ),
});

export const NFTMediaWithEmptyState: React.FC<
  PropsOf<typeof NFTMedia> & ThirdwebNftMediaProps
> = (props) => {
  if (!(props.metadata.image || props.metadata.animation_url)) {
    return (
      <Center
        borderRadius="xl"
        width={props.width}
        height={props.height}
        borderColor="accent.300"
        borderWidth="1px"
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
      width={props.width}
      height={props.height}
      borderRadius="xl"
      overflow="hidden"
      objectFit="contain"
      flexShrink={0}
    >
      <NFTMedia {...props} width="100%" height="100%" />
    </Box>
  );
};
