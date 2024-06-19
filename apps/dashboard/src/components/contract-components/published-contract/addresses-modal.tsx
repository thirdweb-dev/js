import { Flex, Link, useDisclosure } from "@chakra-ui/react";
import { THIRDWEB_DOMAIN } from "constants/urls";
import { useAllChainsData } from "hooks/chains/allChains";
import { Drawer, Heading, Text } from "tw-components";

interface AddressesModalProps {
  chainAddressRecord: Record<string, string>;
  buttonTitle: string;
  modalTitle: string;
}

export const AddressesModal: React.FC<AddressesModalProps> = ({
  chainAddressRecord,
  buttonTitle,
  modalTitle,
}) => {
  const { chainIdToChainRecord } = useAllChainsData();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Text size="body.md" lineHeight={1.2}>
        <Link
          onClick={onOpen}
          _dark={{
            color: "blue.400",
            _hover: { color: "blue.500" },
          }}
          _light={{
            color: "blue.500",
            _hover: { color: "blue.500" },
          }}
        >
          {buttonTitle}
        </Link>
      </Text>

      {chainIdToChainRecord && (
        <Drawer
          size="lg"
          allowPinchZoom
          isOpen={isOpen}
          onClose={onClose}
          header={{
            children: (
              <Heading as="h3" size="title.sm">
                {modalTitle}
              </Heading>
            ),
          }}
        >
          <Flex flexDir="column" gap={{ base: 2, md: 1 }}>
            {Object.entries(chainAddressRecord).map(([chainId, address]) =>
              !address ? null : (
                <Flex
                  key={chainId}
                  flexDir={{ base: "column", md: "row" }}
                  alignItems={{ base: "auto", md: "center" }}
                  justifyContent="space-between"
                >
                  <Text size="body.md">
                    {chainIdToChainRecord[parseInt(chainId)]?.name}
                  </Text>
                  <Link
                    href={`${THIRDWEB_DOMAIN}/${chainId}/${address}`}
                    isExternal
                    color="blue.500"
                  >
                    <Text color="inherit" fontFamily="mono">
                      {address}
                    </Text>
                  </Link>
                </Flex>
              ),
            )}
          </Flex>
        </Drawer>
      )}
    </>
  );
};
