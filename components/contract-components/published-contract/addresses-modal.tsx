import {
  Flex,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { Heading, Text } from "tw-components";

interface AddressesModalProps {
  chainAddressRecord: Record<string, string>;
  title: string;
}

export const AddressesModal: React.FC<AddressesModalProps> = ({
  chainAddressRecord,
  title,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Text onClick={onOpen} color="blue.500" cursor="pointer">
        {title}
      </Text>
      <Modal
        size="xl"
        closeOnEsc={false}
        allowPinchZoom
        closeOnOverlayClick={false}
        isCentered
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent p={{ base: 0, md: 3 }}>
          <ModalHeader mt={{ base: 4, md: 0 }}>
            <Heading size="title.md">{title} Addresses</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex flexDir="column" gap={{ base: 2, md: 1 }}>
              {Object.entries(chainAddressRecord).map(([chainId, address]) =>
                !address ? null : (
                  <Flex
                    key={chainId}
                    flexDir={{ base: "column", md: "row" }}
                    alignItems={{ base: "auto", md: "center" }}
                    justifyContent="space-between"
                  >
                    <Text size="body.sm">{chainId}</Text>
                    <Link
                      href={`https://thirdweb.com/${chainId}/${address}`}
                      isExternal
                      _hover={{
                        textDecoration: "none",
                        opacity: 0.8,
                      }}
                    >
                      <Text color="blue.500" size="body.sm" fontFamily="mono">
                        {address}
                      </Text>
                    </Link>
                  </Flex>
                ),
              )}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
