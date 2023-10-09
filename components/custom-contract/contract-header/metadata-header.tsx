import {
  Center,
  Flex,
  Image,
  Skeleton,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Chain } from "@thirdweb-dev/chains";
import { ChainIcon } from "components/icons/ChainIcon";
import { Heading, LinkButton, Text } from "tw-components";
import { AddressCopyButton } from "tw-components/AddressCopyButton";

interface MetadataHeaderProps {
  isLoaded: boolean;
  isError?: boolean;
  address?: string;

  data?: {
    name?: string | number | null;
    description?: string | null;
    image?: string | null;
  };
  chain?: Chain;
}

export const MetadataHeader: React.FC<MetadataHeaderProps> = ({
  isLoaded,
  isError,
  address,
  data,
  chain,
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const cleanedChainName = chain?.name?.replace("Mainnet", "").trim();
  const validBlockExplorers = chain?.explorers
    ?.filter((e) => e.standard === "EIP3091")
    ?.slice(0, isMobile ? 1 : 2);

  return (
    <Flex align={{ base: "flex-start", md: "center" }} gap={4}>
      {(data?.image || !isLoaded) && !isError ? (
        <Skeleton
          isLoaded={isLoaded}
          flexShrink={0}
          borderRadius="lg"
          overflow="hidden"
          boxSize={{ base: 16, md: 36 }}
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

      <Flex direction="column" gap={2} align="flex-start" w="full">
        {isError ? (
          <Heading size="title.md">No Contract Metadata Detected</Heading>
        ) : (
          <Flex
            gap={4}
            align="center"
            justify={{ base: "space-between", md: "flex-start" }}
            w="full"
          >
            <Skeleton isLoaded={isLoaded}>
              {/* contract name is the primary h1 */}
              <Heading size="title.md" as="h1">
                {data?.name ? data?.name : ""}
              </Heading>
            </Skeleton>
            {chain && (
              <Flex
                borderRadius="full"
                bg="backgroundCardHighlight"
                align="center"
                border="1px solid"
                borderColor="borderColor"
                overflow="hidden"
                flexShrink={0}
                py={{ base: 1.5, md: 1 }}
                px={{ base: 1.5, md: 2 }}
                gap={3}
              >
                {chain.icon?.url && (
                  <Center
                    boxSize={5}
                    mr={{ base: 0, md: -0.5 }}
                    borderRadius="full"
                  >
                    <ChainIcon ipfsSrc={chain.icon.url} size={24} />
                  </Center>
                )}
                <Heading
                  display={{
                    base: chain.icon?.url ? "none" : "initial",
                    md: "initial",
                  }}
                  size="label.sm"
                  as="label"
                >
                  {cleanedChainName}
                </Heading>
              </Flex>
            )}
          </Flex>
        )}
        {isError ? (
          <Text maxW="lg" size="body.sm" noOfLines={3}>
            This contract does not implement any standards that can be used to
            retrieve metadata. All other functionality is still available.
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
          {validBlockExplorers &&
            validBlockExplorers.map((validBlockExplorer) => (
              <LinkButton
                key={validBlockExplorer.name}
                variant="ghost"
                isExternal
                size="xs"
                href={`${validBlockExplorer.url}/address/${address}`}
              >
                {validBlockExplorer.name}
              </LinkButton>
            ))}
        </Flex>
      </Flex>
    </Flex>
  );
};
