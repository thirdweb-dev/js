import {
  Alert,
  AlertIcon,
  Box,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { TransactionButton } from "components/buttons/TransactionButton";
import { FaRegTrashAlt } from "react-icons/fa";
import {
  type ContractOptions,
  sendTransaction,
  waitForReceipt,
} from "thirdweb";
import { uninstallExtensionByProxy } from "thirdweb/extensions/modular";
import type { Account } from "thirdweb/wallets";
import { Button, Heading, Text } from "tw-components";
import { AddressCopyButton } from "tw-components/AddressCopyButton";
import { useExtensionContractInfo } from "./extensionContractInfo";

export const InstalledExtensionsTable = (props: {
  contract: ContractOptions;
  installedExtensions: {
    data?: string[];
    isLoading: boolean;
  };
  refetchExtensions: () => void;
  ownerAccount?: Account;
}) => {
  const { installedExtensions, ownerAccount } = props;

  if (
    !installedExtensions.isLoading &&
    installedExtensions.data?.length === 0
  ) {
    return (
      <>
        <Heading as="h2" size="title.md">
          Installed Extensions
        </Heading>
        <Alert
          status="error"
          fontSize={"small"}
          borderRadius="md"
          p={3}
          bg="alertBg"
        >
          <AlertIcon />
          <Flex direction="column" gap={0.5} ml={1}>
            <Text color="heading" size="body.lg" fontWeight={500}>
              No extensions installed
            </Text>
          </Flex>
        </Alert>
      </>
    );
  }

  return (
    <>
      <Heading as="h2" size="title.md">
        Installed Extensions
      </Heading>
      <TableContainer
        rounded={"lg"}
        overflowX={{ base: "auto", md: "initial" }}
      >
        <Table position="relative">
          <Thead>
            <TableHeading> Extension Name </TableHeading>
            <TableHeading> Description </TableHeading>
            <TableHeading> Publisher Address </TableHeading>
            <TableHeading> Extension Address </TableHeading>
            <TableHeading> Version </TableHeading>
            {ownerAccount && <TableHeading> Remove </TableHeading>}
          </Thead>

          <Tbody>
            {installedExtensions.isLoading ? (
              <>
                <SkeletonRow ownerAccount={ownerAccount} />
                <SkeletonRow ownerAccount={ownerAccount} />
                <SkeletonRow ownerAccount={ownerAccount} />
              </>
            ) : (
              <>
                {installedExtensions.data?.map((e, i) => (
                  <ExtensionRow
                    // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
                    key={i}
                    extensionAddress={e}
                    contract={props.contract}
                    onRemoveExtension={props.refetchExtensions}
                    ownerAccount={ownerAccount}
                  />
                ))}
              </>
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

function SkeletonRow(props: { ownerAccount?: Account }) {
  return (
    <Tr borderBottomWidth={1} _last={{ borderBottomWidth: 0 }}>
      <TableData>
        <Skeleton height="24px" rounded="xl" />
      </TableData>
      <TableData>
        <Skeleton height="24px" rounded="xl" />
      </TableData>
      <TableData>
        <Skeleton height="24px" rounded="xl" />
      </TableData>
      <TableData>
        <Skeleton height="24px" rounded="xl" />
      </TableData>

      {/* Version */}
      <TableData>
        <Skeleton height="24px" rounded="xl" />
      </TableData>

      {/* Remove */}
      {props.ownerAccount && (
        <TableData>
          <Skeleton height="24px" rounded="xl" />
        </TableData>
      )}
    </Tr>
  );
}

function ExtensionRow(props: {
  extensionAddress: string;
  contract: ContractOptions;
  onRemoveExtension: () => void;
  ownerAccount?: Account;
}) {
  const { contract, extensionAddress, ownerAccount } = props;
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const contractInfo = useExtensionContractInfo(props.extensionAddress);

  const uninstallMutation = useMutation({
    mutationFn: async (account: Account) => {
      const uninstallTransaction = uninstallExtensionByProxy({
        contract,
        chain: contract.chain,
        client: contract.client,
        extensionProxyAddress: extensionAddress,
        extensionData: "0x",
      });

      const txResult = await sendTransaction({
        transaction: uninstallTransaction,
        account,
      });

      await waitForReceipt(txResult);
    },
    onSuccess() {
      toast({
        variant: "solid",
        position: "bottom",
        title: "Extension Removed successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      props.onRemoveExtension();
    },
    onError(error) {
      toast({
        variant: "solid",
        position: "bottom",
        title: "Failed to remove extension",
        status: "error",
        duration: 5000,
        isClosable: true,
      });

      console.error("Error during uninstallation:", error);
    },
  });

  const handleRemove = async () => {
    if (!ownerAccount) {
      return;
    }

    onClose();
    uninstallMutation.mutate(ownerAccount);
  };

  if (!contractInfo) {
    return <SkeletonRow ownerAccount={ownerAccount} />;
  }

  return (
    <Tr borderBottomWidth={1} _last={{ borderBottomWidth: 0 }}>
      <TableData>
        <Text color="heading">{contractInfo.name}</Text>
      </TableData>
      <TableData>
        <Text>{contractInfo.description || "..."}</Text>
      </TableData>
      <TableData>
        <AddressCopyButton size="xs" address={contractInfo.publisher} />
      </TableData>
      <TableData>
        <AddressCopyButton size="xs" address={extensionAddress} />
      </TableData>

      {/* Version */}
      <TableData>
        <Text>{contractInfo.version}</Text>
      </TableData>

      {/* Remove */}
      {ownerAccount && (
        <TableData>
          <Flex>
            <Tooltip
              label="Remove"
              bg="backgroundHighlight"
              border="1px solid"
              borderColor="borderColor"
              color="accent.500"
              rounded="xl"
              placement="top"
              fontSize="small"
              px={3}
              py={2}
            >
              <Button
                isLoading={uninstallMutation.isLoading}
                onClick={onOpen}
                color="red.500"
                variant="outline"
                _hover={{
                  bg: "accent.100",
                }}
                rounded={"xl"}
                p={2}
              >
                <FaRegTrashAlt
                  style={{
                    width: "16px",
                    height: "16px",
                  }}
                />
              </Button>
            </Tooltip>
          </Flex>
        </TableData>
      )}

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRemove();
            }}
          >
            <ModalHeader fontSize={"larger"} pb={1}>
              Uninstall Extension
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              Are you sure you want to uninstall{" "}
              <Box as="span" fontWeight={500} color="heading">
                {contractInfo.name}
              </Box>{" "}
              ?
            </ModalBody>

            <ModalFooter pt={10} gap={3}>
              <Button
                type="button"
                mr={3}
                m={0}
                onClick={onClose}
                variant="outline"
              >
                Cancel
              </Button>

              <TransactionButton
                transactionCount={1}
                isLoading={uninstallMutation.isLoading}
                type="submit"
                colorScheme="red"
                alignSelf="flex-end"
                mr={3}
                m={0}
              >
                Uninstall
              </TransactionButton>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Tr>
  );
}

function TableData(props: { children: React.ReactNode }) {
  return (
    <Td borderBottomWidth="inherit" borderBottomColor="borderColor" py={5}>
      {props.children}
    </Td>
  );
}

function TableHeading(props: { children: React.ReactNode }) {
  return (
    <Th border="none" color="faded">
      {props.children}
    </Th>
  );
}
