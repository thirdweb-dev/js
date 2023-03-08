import { Flex, Image, Skeleton } from "@chakra-ui/react";
import { StaticImageData } from "next/image";
import { Heading, Text } from "tw-components";
import { AddressCopyButton } from "tw-components/AddressCopyButton";

interface MetadataHeaderProps {
  isLoaded: boolean;
  isError?: boolean;
  address?: string;
  contractTypeImage?: StaticImageData;
  data?: {
    name?: string | number | null;
    description?: string | null;
    image?: string | null;
  };
  ecosystem?: "solana" | "evm";
}

export const MetadataHeader: React.FC<MetadataHeaderProps> = ({
  isLoaded,
  isError,
  address,
  data,
  ecosystem,
}) => {
  return (
    <Flex align={{ base: "flex-start", md: "center" }} gap={4}>
      {(data?.image || !isLoaded) && !isError ? (
        <Skeleton
          isLoaded={isLoaded}
          flexShrink={0}
          borderRadius="lg"
          overflow="hidden"
          boxSize={{ base: 16, md: 24 }}
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
          ) : null}
        </Skeleton>
      ) : null}

      <Flex direction="column" gap={2} align="flex-start">
        {isError ? (
          <Heading size="title.md">
            No {ecosystem === "solana" ? "Program" : "Contract"} Metadata
            Detected
          </Heading>
        ) : (
          <Skeleton isLoaded={isLoaded}>
            <Heading size="title.md">{data?.name ? data?.name : ""}</Heading>
          </Skeleton>
        )}
        {isError ? (
          <Text maxW="lg" size="body.sm" noOfLines={3}>
            This {ecosystem === "solana" ? "program" : "contract"} does not
            implement any standards that can be used to retrieve metadata. All
            other functionality is still available.
          </Text>
        ) : (
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
        )}
        <Flex gap={2}>
          <AddressCopyButton size="xs" address={address} />
        </Flex>
      </Flex>
    </Flex>
  );
};
