import { WalletAddress } from "@/components/blocks/wallet-address";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox, CheckboxWithLabel } from "@/components/ui/checkbox";
import { FormItem } from "@/components/ui/form";
import {
  type BackendWallet,
  useEngineBackendWalletBalance,
  useEngineDeleteBackendWallet,
  useEngineSendTokens,
  useEngineUpdateBackendWallet,
} from "@3rdweb-sdk/react/hooks/useEngine";
import {
  Flex,
  FormControl,
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
  type UseDisclosureReturn,
  useDisclosure,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { ChainIcon } from "components/icons/ChainIcon";
import { TWTable } from "components/shared/TWTable";
import { useTrack } from "hooks/analytics/useTrack";
import { EngineBackendWalletOptions } from "lib/engine";
import { useActiveChainAsDashboardChain } from "lib/v5-adapter";
import {
  DownloadIcon,
  PencilIcon,
  TrashIcon,
  TriangleAlertIcon,
  UploadIcon,
} from "lucide-react";
import QRCode from "qrcode";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { getAddress } from "thirdweb";
import { shortenAddress } from "thirdweb/utils";
import invariant from "tiny-invariant";
import { FormHelperText, FormLabel, LinkButton, Text } from "tw-components";
import { prettyPrintCurrency } from "./utils";

interface BackendWalletsTableProps {
  wallets: BackendWallet[];
  instanceUrl: string;
  isPending: boolean;
  isFetched: boolean;
  authToken: string;
}

interface BackendWalletDashboard extends BackendWallet {
  balance: string;
  authToken: string;
}

const columnHelper = createColumnHelper<BackendWalletDashboard>();

interface BackendWalletBalanceCellProps {
  instanceUrl: string;
  address: string;
  authToken: string;
}

const BackendWalletBalanceCell: React.FC<BackendWalletBalanceCellProps> = ({
  instanceUrl,
  address,
  authToken,
}) => {
  const { data: backendWalletBalance } = useEngineBackendWalletBalance({
    instanceUrl: instanceUrl,
    address,
    authToken,
  });
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
  isPending,
  isFetched,
  authToken,
}) => {
  const editDisclosure = useDisclosure();
  const receiveDisclosure = useDisclosure();
  const sendDisclosure = useDisclosure();
  const deleteDisclosure = useDisclosure();

  const columns = useMemo(() => {
    return [
      columnHelper.accessor("address", {
        header: "Address",
        cell: (cell) => {
          const address = cell.getValue();
          return <WalletAddress address={getAddress(address)} />;
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
          return <Badge variant="outline">{cell.getValue()}</Badge>;
        },
      }),
      columnHelper.accessor("address", {
        header: "Balance",
        cell: (cell) => {
          const address = cell.getValue();
          return (
            <BackendWalletBalanceCell
              instanceUrl={instanceUrl}
              address={address}
              authToken={authToken}
            />
          );
        },
        id: "balance",
      }),
    ];
  }, [instanceUrl, authToken]);

  const [selectedBackendWallet, setSelectedBackendWallet] =
    useState<BackendWallet>();

  return (
    <>
      <TWTable
        title="backend wallets"
        data={wallets}
        columns={columns as ColumnDef<BackendWallet, string>[]}
        isPending={isPending}
        isFetched={isFetched}
        onMenuClick={[
          {
            icon: <PencilIcon className="size-4" />,
            text: "Edit",
            onClick: (wallet) => {
              setSelectedBackendWallet(wallet);
              editDisclosure.onOpen();
            },
          },
          {
            icon: <DownloadIcon className="size-4" />,
            text: "Receive funds",
            onClick: (wallet) => {
              setSelectedBackendWallet(wallet);
              receiveDisclosure.onOpen();
            },
          },
          {
            icon: <UploadIcon className="size-4" />,
            text: "Send funds",
            onClick: (wallet) => {
              setSelectedBackendWallet(wallet);
              sendDisclosure.onOpen();
            },
          },
          {
            icon: <TrashIcon className="size-4" />,
            text: "Delete",
            onClick: (wallet) => {
              setSelectedBackendWallet(wallet);
              deleteDisclosure.onOpen();
            },
            isDestructive: true,
          },
        ]}
      />

      {selectedBackendWallet && editDisclosure.isOpen && (
        <EditModal
          backendWallet={selectedBackendWallet}
          disclosure={editDisclosure}
          instanceUrl={instanceUrl}
          authToken={authToken}
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
          authToken={authToken}
        />
      )}
      {selectedBackendWallet && deleteDisclosure.isOpen && (
        <DeleteModal
          backendWallet={selectedBackendWallet}
          disclosure={deleteDisclosure}
          instanceUrl={instanceUrl}
          authToken={authToken}
        />
      )}
    </>
  );
};

const EditModal = ({
  backendWallet,
  disclosure,
  instanceUrl,
  authToken,
}: {
  backendWallet: BackendWallet;
  disclosure: UseDisclosureReturn;
  instanceUrl: string;
  authToken: string;
}) => {
  const updateBackendWallet = useEngineUpdateBackendWallet({
    instanceUrl,
    authToken,
  });
  const trackEvent = useTrack();

  const [label, setLabel] = useState(backendWallet.label ?? "");

  const onClick = async () => {
    const promise = updateBackendWallet.mutateAsync(
      {
        walletAddress: backendWallet.address,
        label,
      },
      {
        onSuccess: () => {
          disclosure.onClose();
          trackEvent({
            category: "engine",
            action: "update-backend-wallet",
            label: "success",
            instance: instanceUrl,
          });
        },
        onError: (error) => {
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

    toast.promise(promise, {
      success: "Successfully updated backend wallet.",
      error: "Failed to update backend wallet.",
    });
  };

  return (
    <Modal isOpen={disclosure.isOpen} onClose={disclosure.onClose} isCentered>
      <ModalOverlay />
      <ModalContent className="!bg-background rounded-lg border border-border">
        <ModalHeader>Update Backend Wallet</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className="flex flex-col gap-4">
            <FormControl>
              <FormLabel>Wallet Address</FormLabel>
              <WalletAddress
                address={backendWallet.address}
                shortenAddress={false}
              />
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
          </div>
        </ModalBody>

        <ModalFooter as={Flex} gap={3}>
          <Button onClick={disclosure.onClose} variant="outline">
            Cancel
          </Button>
          <Button type="submit" onClick={onClick}>
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
    placeholderData: "",
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
      <ModalContent className="!bg-background rounded-lg border border-border">
        <ModalHeader>Receive Funds</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className="flex flex-col gap-4 pb-8">
            <Text w="full" textAlign="left">
              Fund this address or QR code:
            </Text>
            <WalletAddress
              address={backendWallet.address}
              shortenAddress={false}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrCodeBase64Query.data}
              alt="QR code for receiving funds"
              className="mx-auto flex w-[200px] rounded-lg"
            />
          </div>
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
  authToken,
}: {
  fromWallet: BackendWallet;
  backendWallets: BackendWallet[];
  disclosure: UseDisclosureReturn;
  instanceUrl: string;
  authToken: string;
}) => {
  const chain = useActiveChainAsDashboardChain();
  const form = useForm<SendFundsInput>();
  const sendTokens = useEngineSendTokens({
    instanceUrl,
    authToken,
  });
  const { data: backendWalletBalance } = useEngineBackendWalletBalance({
    instanceUrl,
    address: fromWallet.address,
    authToken,
  });
  const toWalletDisclosure = useDisclosure();

  if (!backendWalletBalance) {
    return null;
  }

  const onSubmit = async (data: SendFundsInput) => {
    invariant(chain, "chain is required");

    const promise = sendTokens.mutateAsync(
      {
        chainId: chain.chainId,
        fromAddress: fromWallet.address,
        toAddress: data.toAddress,
        amount: data.amount,
      },
      {
        onSuccess: () => {
          disclosure.onClose();
        },
      },
    );

    toast.promise(promise, {
      success: "Successfully sent a request to send funds.",
      error: "Failed to send tokens.",
    });
  };

  return (
    <Modal isOpen={disclosure.isOpen} onClose={disclosure.onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        as="form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="!bg-background rounded-lg border border-border"
      >
        <ModalHeader>Send Funds</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className="flex flex-col gap-4">
            <FormControl>
              <FormLabel>From</FormLabel>
              <WalletAddress
                address={fromWallet.address}
                shortenAddress={false}
              />
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
                        {shortenAddress(wallet.address)}
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
                <ChainIcon className="size-3" ipfsSrc={chain?.icon?.url} />
                <Text>{chain?.name}</Text>
              </Flex>
            </FormControl>
          </div>
        </ModalBody>

        <ModalFooter as={Flex} gap={3}>
          <Button onClick={disclosure.onClose} variant="outline">
            Cancel
          </Button>
          <Button type="submit" disabled={!form.formState.isValid}>
            Send
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

function DeleteModal({
  backendWallet,
  disclosure,
  instanceUrl,
  authToken,
}: {
  backendWallet: BackendWallet;
  disclosure: UseDisclosureReturn;
  instanceUrl: string;
  authToken: string;
}) {
  const deleteBackendWallet = useEngineDeleteBackendWallet({
    instanceUrl,
    authToken,
  });
  const trackEvent = useTrack();

  const isLocalWallet =
    backendWallet.type === "local" || backendWallet.type === "smart:local";
  const [ackDeletion, setAckDeletion] = useState(false);

  const onClick = () => {
    const promise = deleteBackendWallet.mutateAsync(
      { walletAddress: backendWallet.address },
      {
        onSuccess: () => {
          disclosure.onClose();
          trackEvent({
            category: "engine",
            action: "delete-backend-wallet",
            label: "success",
            instance: instanceUrl,
          });
        },
        onError: (error) => {
          trackEvent({
            category: "engine",
            action: "delete-backend-wallet",
            label: "error",
            instance: instanceUrl,
            error,
          });
        },
      },
    );

    toast.promise(promise, {
      success: "Successfully deleted backend wallet.",
      error: "Failed to delete backend wallet.",
    });
  };

  return (
    <Modal isOpen={disclosure.isOpen} onClose={disclosure.onClose} isCentered>
      <ModalOverlay />
      <ModalContent className="!bg-background rounded-lg border border-border">
        <ModalHeader>Delete Backend Wallet</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className="flex flex-col gap-4">
            <FormItem>
              <FormLabel>Wallet Type</FormLabel>
              <div>
                {
                  EngineBackendWalletOptions.find(
                    (opt) => opt.key === backendWallet.type,
                  )?.name
                }
              </div>
            </FormItem>
            <FormItem>
              <FormLabel>Wallet Address</FormLabel>
              <WalletAddress
                address={backendWallet.address}
                shortenAddress={false}
              />
            </FormItem>
          </div>

          {isLocalWallet && (
            <Alert variant="warning" className="mt-4">
              <TriangleAlertIcon className="!text-warning-text size-4" />
              <AlertTitle>This action is irreversible.</AlertTitle>

              <AlertDescription className="!pl-0 pt-2">
                <CheckboxWithLabel>
                  <Checkbox
                    checked={ackDeletion}
                    onCheckedChange={(checked) => setAckDeletion(!!checked)}
                  />
                  I understand that access to this backend wallet and any
                  remaining funds will be lost.
                </CheckboxWithLabel>
              </AlertDescription>
            </Alert>
          )}
        </ModalBody>

        <ModalFooter as={Flex} gap={3}>
          <Button onClick={disclosure.onClose} variant="outline">
            Close
          </Button>
          <Button
            type="submit"
            variant="destructive"
            onClick={onClick}
            disabled={isLocalWallet && !ackDeletion}
          >
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
