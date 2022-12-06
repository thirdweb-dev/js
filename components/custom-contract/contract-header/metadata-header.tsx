import { Flex, Image, Skeleton } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { ContractBadge } from "components/badges/contract-badge";
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
    <Flex align={{ base: "flex-start", md: "center" }} gap={4}>
      <Skeleton
        isLoaded={isLoaded}
        flexShrink={0}
        borderRadius="lg"
        overflow="hidden"
        boxSize={{ base: 16, md: 32 }}
        position="relative"
      >
        {data?.image ? (
          <Image
            position="absolute"
            top={0}
            bottom={0}
            right={0}
            left={0}
            objectFit="contain"
            src={data.image}
            alt={data?.name?.toString() || ""}
          />
        ) : contractTypeImage ? (
          <ChakraNextImage
            position="absolute"
            top={0}
            bottom={0}
            right={0}
            left={0}
            src={contractTypeImage}
            alt={data?.name?.toString() || ""}
          />
        ) : null}
      </Skeleton>

      <Flex direction="column" gap={2} align="flex-start">
        <Skeleton isLoaded={isLoaded}>
          <Heading size="title.md">{data?.name ? data?.name : ""}</Heading>
        </Skeleton>
        <Skeleton isLoaded={isLoaded}>
          <Text
            maxW="2xl"
            title={data?.description || undefined}
            size="body.sm"
            noOfLines={3}
          >
            {isLoaded ? data?.description : ""}
          </Text>
        </Skeleton>

        <Flex gap={2} direction="row">
          <AddressCopyButton size="xs" address={address} />
          {address && <ContractBadge address={address} />}
        </Flex>
      </Flex>
    </Flex>
  );
};
