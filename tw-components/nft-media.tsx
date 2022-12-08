import { Text } from "./text";
import { Center, Flex, Icon, PropsOf, chakra } from "@chakra-ui/react";
import { ThirdwebNftMedia, ThirdwebNftMediaProps } from "@thirdweb-dev/react";
import { FiImage } from "react-icons/fi";

export const NFTMedia = chakra(ThirdwebNftMedia);

export const NFTMediaWithEmptyState: React.FC<
  PropsOf<typeof NFTMedia> & ThirdwebNftMediaProps & { boxSize: number }
> = (props) => {
  if (
    !props.metadata.uri ||
    !(props.metadata.image || props.metadata.animation_url)
  ) {
    return (
      <Center
        borderRadius="lg"
        boxSize={props.boxSize}
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
  return <NFTMedia {...props} />;
};
