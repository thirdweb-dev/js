import {
  type BackendWallet,
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
  type UseDisclosureReturn,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { shortenString } from "@thirdweb-dev/react";
import { ChainIcon } from "components/icons/ChainIcon";
import { TWTable } from "components/shared/TWTable";
import { utils } from "ethers";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import QRCode from "qrcode";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { useActiveChainAsDashboardChain } from "../../../lib/v5-adapter";
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
        <AddressCopyButton
          address={utils.getAddress(address)}
          shortenAddress={false}
          size="xs"
        />
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
        <BackendWalletBalanceCell instanceUrl={instanceUrl} address={address} />
      );
    },
    id: "balance",
  }),
];

interface BackendWalletBalanceCellProps {
  instanceUrl: string;
  address: string;
}

const BackendWalletBalanceCell: React.FC<BackendWalletBalanceCellProps> = ({
  instanceUrl,
  address,
}) => {
  const { data: backendWalletBalance } = useEngineBackendWalletBalance(
    instanceUrl,
    address,
  );
  const chain = useActiveChainAsDashboardChain();
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

  const explorer = chain?.explorers?.[0];
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
  const qrCodeBase64Query = useQuery({
    queryKey: ["engine", "receive-funds-qr-code", backendWallet.address],
    // only run this if we have a backendWallet address
    enabled: !!backendWallet.address,
    // start out with empty string
    initialData: "",
    queryFn: async () => {
      return new Promise<string>((resolve, reject) => {
        QRCode.toDataURL(
          backendWallet.address,
          // biome-ignore lint/suspicious/noExplicitAny: FIXME
          (error: any, dataUrl: string) => {
            if (error) {
              reject(error);
            } else {
              resolve(dataUrl);
            }
          },
        );
      });
    },
  });

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
              src={qrCodeBase64Query.data}
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
  const chain = useActiveChainAsDashboardChain();
  const form = useForm<SendFundsInput>();
  const { mutate: sendTokens } = useEngineSendTokens(instanceUrl);
  const { data: backendWalletBalance } = useEngineBackendWalletBalance(
    instanceUrl,
    fromWallet.address,
  );
  const { onSuccess, onError } = useTxNotifications(
    "Successfully sent a request to send funds.",
    "Failed to send tokens.",
  );
  const toWalletDisclosure = useDisclosure();

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
              <Text fontFamily="mono">{fromWallet.address}</Text>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>To</FormLabel>
              {toWalletDisclosure.isOpen ? (
                <Input
                  {...form.register("toAddress", { required: true })}
                  placeholder="Enter a wallet address"
                />
              ) : (
                <Select {...form.register("toAddress", { required: true })}>
                  <option value="" disabled selected hidden>
                    Select a backend wallet
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
              )}
              <FormHelperText textAlign="right">
                <Button
                  onClick={() => {
                    form.resetField("toAddress");
                    toWalletDisclosure.onToggle();
                  }}
                  variant="link"
                  size="xs"
                >
                  {toWalletDisclosure.isOpen
                    ? "Or send to a backend wallet"
                    : "Or send to a different wallet"}
                </Button>
              </FormHelperText>
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
                <InputRightAddon>
                  {chain?.nativeCurrency.symbol}
                </InputRightAddon>
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
