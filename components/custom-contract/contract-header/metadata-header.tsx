import { Flex, Image, Skeleton } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { StaticImageData } from "next/image";
import { AddressCopyButton, Heading, Text } from "tw-components";

interface MetadataHeaderProps {
  isLoaded: boolean;
  address?: string;
  contractTypeImage?: StaticImageData;
  data?: {
    name?: string | number | null;
    description?: string | null;
    image?: string | null;
  };
}

export const MetadataHeader: React.FC<MetadataHeaderProps> = ({
  isLoaded,
  contractTypeImage,
  address,
  data,
}) => {
  return (
    <Flex align="center" gap={4}>
      <Skeleton isLoaded={isLoaded}>
        {data?.image ? (
          <Image
            objectFit="contain"
            boxSize="64px"
            src={data.image}
            alt={data?.name?.toString() || ""}
          />
        ) : contractTypeImage ? (
          <ChakraNextImage
            boxSize="64px"
            src={contractTypeImage}
            alt={data?.name?.toString() || ""}
          />
        ) : null}
      </Skeleton>
      <Flex direction="column" gap={1} align="flex-start">
        <Skeleton isLoaded={isLoaded}>
          <Heading size="title.md">{data?.name ? data?.name : ""}</Heading>
        </Skeleton>
        <Skeleton isLoaded={isLoaded}>
          <Text size="body.md" noOfLines={3}>
            {isLoaded ? data?.description : ""}
          </Text>
        </Skeleton>
        <AddressCopyButton size="xs" address={address} />
      </Flex>
    </Flex>
  );
};
