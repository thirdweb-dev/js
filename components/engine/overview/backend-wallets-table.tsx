import {
  BackendWallet,
  useEngineBackendWalletBalance,
  useEngineSendTokens,
  useEngineUpdateBackendWallet,
} from "@3rdweb-sdk/react/hooks/useEngine";
import {
  Flex,
  FormControl,
  Image,
  Input,
  InputGroup,
  InputRightAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  UseDisclosureReturn,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { shortenString, useChain } from "@thirdweb-dev/react";
import { TWTable } from "components/shared/TWTable";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useEffect, useState } from "react";
import { BiExport, BiImport, BiPencil } from "react-icons/bi";
import {
  Badge,
  Button,
  FormHelperText,
  FormLabel,
  LinkButton,
  Text,
} from "tw-components";
import { AddressCopyButton } from "tw-components/AddressCopyButton";
import QRCode from "qrcode";
import { ChainIcon } from "components/icons/ChainIcon";
import { useForm } from "react-hook-form";
import { prettyPrintCurrency } from "../utils";

interface BackendWalletsTableProps {
  wallets: BackendWallet[];
  instanceUrl: string;
  isLoading: boolean;
  isFetched: boolean;
}

interface BackendWalletDashboard extends BackendWallet {
  balance: string;
}

const columnHelper = createColumnHelper<BackendWalletDashboard>();

const setColumns = (instanceUrl: string) => [
  columnHelper.accessor("address", {
    header: "Address",
    cell: (cell) => {
      const address = cell.getValue();
      return (
        <AddressCopyButton address={address} shortenAddress={false} size="xs" />
      );
    },
  }),
  columnHelper.accessor("label", {
    header: "Label",
    cell: (cell) => {
      return (
        <Text isTruncated maxW={300}>
          {cell.getValue()}
        </Text>
      );
    },
  }),
  columnHelper.accessor("type", {
    header: "Type",
    cell: (cell) => {
      return (
        <Badge
          borderRadius="full"
          size="label.sm"
          variant="subtle"
          px={3}
          py={1.5}
          colorScheme="black"
        >
          {cell.getValue()}
        </Badge>
      );
    },
  }),
  columnHelper.accessor("address", {
    header: "Balance",
    cell: (cell) => {
      const address = cell.getValue();
      return (
        <BackendWalletBalanceCell instance={instanceUrl} address={address} />
      );
    },
    id: "balance",
  }),
];

interface BackendWalletBalanceCellProps {
  instance: string;
  address: string;
}

const BackendWalletBalanceCell: React.FC<BackendWalletBalanceCellProps> = ({
  instance,
  address,
}) => {
  const { data: backendWalletBalance } = useEngineBackendWalletBalance(
    instance,
    address,
  );
  const chain = useChain();
  if (!chain || !backendWalletBalance) {
    return;
  }

  const balanceDisplay = prettyPrintCurrency({
    amount: backendWalletBalance.displayValue,
    symbol: backendWalletBalance.symbol,
  });

  const balanceComponent = (
    <Text fontWeight={backendWalletBalance.value === "0" ? "light" : "bold"}>
      {balanceDisplay}
    </Text>
  );

  const explorer = chain.explorers?.[0];
  if (!explorer) {
    return balanceComponent;
  }

  return (
    <LinkButton
      variant="ghost"
      isExternal
      size="xs"
      href={`${explorer.url}/address/${address}`}
    >
      {balanceComponent}
    </LinkButton>
  );
};

export const BackendWalletsTable: React.FC<BackendWalletsTableProps> = ({
  wallets,
  instanceUrl,
  isLoading,
  isFetched,
}) => {
  const editDisclosure = useDisclosure();
  const receiveDisclosure = useDisclosure();
  const sendDisclosure = useDisclosure();
  const columns = setColumns(instanceUrl);
  const [selectedBackendWallet, setSelectedBackendWallet] =
    useState<BackendWallet>();

  return (
    <>
      <TWTable
        title="backend wallets"
        data={wallets}
        columns={columns as ColumnDef<BackendWallet, string>[]}
        isLoading={isLoading}
        isFetched={isFetched}
        onMenuClick={[
          {
            icon: BiPencil,
            text: "Edit",
            onClick: (wallet) => {
              setSelectedBackendWallet(wallet);
              editDisclosure.onOpen();
            },
          },
          {
            icon: BiImport,
            text: "Receive funds",
            onClick: (wallet) => {
              setSelectedBackendWallet(wallet);
              receiveDisclosure.onOpen();
            },
          },
          {
            icon: BiExport,
            text: "Send funds",
            onClick: (wallet) => {
              setSelectedBackendWallet(wallet);
              sendDisclosure.onOpen();
            },
          },
        ]}
      />

      {selectedBackendWallet && editDisclosure.isOpen && (
        <EditModal
          backendWallet={selectedBackendWallet}
          disclosure={editDisclosure}
          instanceUrl={instanceUrl}
        />
      )}
      {selectedBackendWallet && receiveDisclosure.isOpen && (
        <ReceiveFundsModal
          backendWallet={selectedBackendWallet}
          disclosure={receiveDisclosure}
        />
      )}
      {selectedBackendWallet && sendDisclosure.isOpen && (
        <SendFundsModal
          fromWallet={selectedBackendWallet}
          backendWallets={wallets}
          disclosure={sendDisclosure}
          instanceUrl={instanceUrl}
        />
      )}
    </>
  );
};

const EditModal = ({
  backendWallet,
  disclosure,
  instanceUrl,
}: {
  backendWallet: BackendWallet;
  disclosure: UseDisclosureReturn;
  instanceUrl: string;
}) => {
  const { mutate: updatePermissions } =
    useEngineUpdateBackendWallet(instanceUrl);
  const trackEvent = useTrack();
  const { onSuccess, onError } = useTxNotifications(
    "Successfully updated backend wallet",
    "Failed to update backend wallet",
  );

  const [label, setLabel] = useState(backendWallet.label ?? "");

  const onClick = () => {
    updatePermissions(
      {
        walletAddress: backendWallet.address,
        label,
      },
      {
        onSuccess: () => {
          onSuccess();
          disclosure.onClose();
          trackEvent({
            category: "engine",
            action: "update-backend-wallet",
            label: "success",
            instance: instanceUrl,
          });
        },
        onError: (error) => {
          onError(error);
          trackEvent({
            category: "engine",
            action: "update-backend-wallet",
            label: "error",
            instance: instanceUrl,
            error,
          });
        },
      },
    );
  };

  return (
    <Modal isOpen={disclosure.isOpen} onClose={disclosure.onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Update Backend Wallet</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Wallet Address</FormLabel>
              <Text>{backendWallet.address}</Text>
            </FormControl>
            <FormControl>
              <FormLabel>Label</FormLabel>
              <Input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Enter a description for this backend wallet"
              />
            </FormControl>
          </Stack>
        </ModalBody>

        <ModalFooter as={Flex} gap={3}>
          <Button type="button" onClick={disclosure.onClose} variant="ghost">
            Cancel
          </Button>
          <Button type="submit" colorScheme="blue" onClick={onClick}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const ReceiveFundsModal = ({
  backendWallet,
  disclosure,
}: {
  backendWallet: BackendWallet;
  disclosure: UseDisclosureReturn;
}) => {
  const [dataBase64, setDataBase64] = useState("");

  useEffect(() => {
    QRCode.toDataURL(backendWallet.address, (error: any, dataUrl: string) => {
      console.error("error", error);
      setDataBase64(dataUrl);
    });
  }, [backendWallet]);

  return (
    <Modal isOpen={disclosure.isOpen} onClose={disclosure.onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Receive Funds</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} pb={8}>
            <Text w="full" textAlign="left">
              Fund this address or QR code:
            </Text>
            <AddressCopyButton
              address={backendWallet.address}
              shortenAddress={false}
              size="sm"
            />
            <Image
              src={dataBase64}
              alt="Receive funds to your backend wallet"
              rounded="lg"
              w={200}
            />
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

interface SendFundsInput {
  toAddress: string;
  amount: number;
}

const SendFundsModal = ({
  fromWallet,
  backendWallets,
  disclosure,
  instanceUrl,
}: {
  fromWallet: BackendWallet;
  backendWallets: BackendWallet[];
  disclosure: UseDisclosureReturn;
  instanceUrl: string;
}) => {
  const chain = useChain();
  const form = useForm<SendFundsInput>();
  const { mutate: sendTokens } = useEngineSendTokens(instanceUrl);
  const { data: backendWalletBalance } = useEngineBackendWalletBalance(
    instanceUrl,
    fromWallet.address,
  );
  const { onSuccess, onError } = useTxNotifications(
    "Successfully sent a request to send funds",
    "Failed to send tokens",
  );

  const onSubmit = async (data: SendFundsInput) => {
    if (!chain) {
      return;
    }

    try {
      await sendTokens({
        chainId: chain.chainId,
        fromAddress: fromWallet.address,
        toAddress: data.toAddress,
        amount: data.amount,
      });
      onSuccess();
      disclosure.onClose();
    } catch (e) {
      onError(e);
    }
  };

  if (!backendWalletBalance) {
    return null;
  }

  return (
    <Modal isOpen={disclosure.isOpen} onClose={disclosure.onClose} isCentered>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={form.handleSubmit(onSubmit)}>
        <ModalHeader>Send Funds</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>From</FormLabel>
              <Text>{fromWallet.address}</Text>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>To</FormLabel>
              <Select {...form.register("toAddress", { required: true })}>
                <option value="" disabled selected hidden>
                  Select a backend wallet to send funds to
                </option>
                {backendWallets
                  .filter((wallet) => wallet.address !== fromWallet.address)
                  .map((wallet) => (
                    <option key={wallet.address} value={wallet.address}>
                      {shortenString(wallet.address, false)}
                      {wallet.label && ` (${wallet.label})`}
                    </option>
                  ))}
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Amount</FormLabel>
              <InputGroup>
                <Input
                  type="number"
                  placeholder="Enter the amount to send"
                  step="any"
                  max={backendWalletBalance.displayValue}
                  {...form.register("amount", { required: true })}
                />
                <InputRightAddon children={chain?.nativeCurrency.symbol} />
              </InputGroup>
              <FormHelperText textAlign="right">
                Current amount:{" "}
                {prettyPrintCurrency({
                  amount: backendWalletBalance.displayValue,
                  symbol: backendWalletBalance.symbol,
                })}
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>Chain</FormLabel>
              <Flex align="center" gap={2}>
                <ChainIcon size={12} ipfsSrc={chain?.icon?.url} />
                <Text>{chain?.name}</Text>
              </Flex>
            </FormControl>
          </Stack>
        </ModalBody>

        <ModalFooter as={Flex} gap={3}>
          <Button type="button" onClick={disclosure.onClose} variant="ghost">
            Cancel
          </Button>
          <Button
            type="submit"
            colorScheme="blue"
            isDisabled={!form.formState.isValid}
          >
            Send
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
