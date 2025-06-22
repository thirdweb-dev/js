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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { FormHelperText, FormLabel } from "chakra/form";
import { Text } from "chakra/text";
import {
  DownloadIcon,
  ExternalLinkIcon,
  PencilIcon,
  RefreshCcwIcon,
  TrashIcon,
  TriangleAlertIcon,
  UploadIcon,
} from "lucide-react";
import Link from "next/link";
import QRCode from "qrcode";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { getAddress, type ThirdwebClient } from "thirdweb";
import { shortenAddress } from "thirdweb/utils";
import { TWTable } from "@/components/blocks/TWTable";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox, CheckboxWithLabel } from "@/components/ui/checkbox";
import { FormItem } from "@/components/ui/form";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { EngineBackendWalletOptions } from "@/constants/engine";
import { useAllChainsData } from "@/hooks/chains/allChains";
import { useV5DashboardChain } from "@/hooks/chains/v5-adapter";
import {
  type BackendWallet,
  useEngineBackendWalletBalance,
  useEngineDeleteBackendWallet,
  useEngineSendTokens,
  useEngineUpdateBackendWallet,
} from "@/hooks/useEngine";
import { ChainIconClient } from "@/icons/ChainIcon";
import { engineKeys } from "@/query-keys/cache-keys";
import { prettyPrintCurrency } from "./utils";

interface BackendWalletsTableProps {
  wallets: BackendWallet[];
  instanceUrl: string;
  isPending: boolean;
  isFetched: boolean;
  authToken: string;
  chainId: number;
  client: ThirdwebClient;
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
  chainId: number;
  client: ThirdwebClient;
}

const BackendWalletBalanceCell: React.FC<BackendWalletBalanceCellProps> = ({
  instanceUrl,
  address,
  authToken,
  chainId,
}) => {
  const { data: backendWalletBalance, isFetching } =
    useEngineBackendWalletBalance({
      address,
      authToken,
      chainId,
      instanceUrl: instanceUrl,
    });
  const chain = useV5DashboardChain(chainId);

  if (!backendWalletBalance || isFetching) {
    return <Skeleton className="h-6 w-36 rounded-lg" />;
  }

  const balanceDisplay = prettyPrintCurrency({
    amount: backendWalletBalance.displayValue,
    symbol: backendWalletBalance.symbol || chain.nativeCurrency?.symbol,
  });

  const balanceComponent = <span>{balanceDisplay}</span>;

  const explorer = chain.blockExplorers?.[0];
  if (!explorer) {
    return balanceComponent;
  }

  return (
    <Link
      className="inline-flex items-center gap-2.5 rounded-lg px-2 py-1 text-muted-foreground hover:bg-muted hover:text-foreground"
      href={`${explorer.url}/address/${address}`}
      rel="noopener noreferrer"
      target="_blank"
    >
      {balanceComponent}
      <ExternalLinkIcon className="size-4" />
    </Link>
  );
};

export const BackendWalletsTable: React.FC<BackendWalletsTableProps> = ({
  wallets,
  instanceUrl,
  isPending,
  isFetched,
  authToken,
  chainId,
  client,
}) => {
  const editDisclosure = useDisclosure();
  const receiveDisclosure = useDisclosure();
  const sendDisclosure = useDisclosure();
  const deleteDisclosure = useDisclosure();
  const queryClient = useQueryClient();

  const columns = useMemo(() => {
    return [
      columnHelper.accessor("address", {
        cell: (cell) => {
          const address = cell.getValue();
          return (
            <WalletAddress address={getAddress(address)} client={client} />
          );
        },
        header: "Address",
      }),
      columnHelper.accessor("label", {
        cell: (cell) => {
          return (
            <Text isTruncated maxW={300}>
              {cell.getValue()}
            </Text>
          );
        },
        header: "Label",
      }),
      columnHelper.accessor("type", {
        cell: (cell) => {
          return <Badge variant="outline">{cell.getValue()}</Badge>;
        },
        header: "Type",
      }),
      columnHelper.accessor("address", {
        cell: (cell) => {
          const address = cell.getValue();
          return (
            <BackendWalletBalanceCell
              address={address}
              authToken={authToken}
              chainId={chainId}
              client={client}
              instanceUrl={instanceUrl}
            />
          );
        },
        header: () => (
          <div className="flex w-[180px] items-center gap-1.5">
            Balance
            <ToolTipLabel
              contentClassName="capitalize font-normal tracking-normal leading-normal"
              label="Refresh Balance"
            >
              <Button
                className="z-20 h-auto p-1.5 [&[data-pending='true']_svg]:animate-spin"
                onClick={async (e) => {
                  const buttonEl = e.currentTarget;
                  buttonEl.setAttribute("data-pending", "true");
                  await queryClient.invalidateQueries({
                    queryKey: engineKeys.backendWalletBalanceAll(),
                  });
                  buttonEl.setAttribute("data-pending", "false");
                }}
                size="sm"
                variant="ghost"
              >
                <RefreshCcwIcon className="size-4" />
              </Button>
            </ToolTipLabel>
          </div>
        ),
        id: "balance",
      }),
    ];
  }, [instanceUrl, authToken, chainId, queryClient, client]);

  const [selectedBackendWallet, setSelectedBackendWallet] =
    useState<BackendWallet>();

  return (
    <>
      <TWTable
        columns={columns as ColumnDef<BackendWallet, string>[]}
        data={wallets}
        isFetched={isFetched}
        isPending={isPending}
        onMenuClick={[
          {
            icon: <PencilIcon className="size-4" />,
            onClick: (wallet) => {
              setSelectedBackendWallet(wallet);
              editDisclosure.onOpen();
            },
            text: "Edit",
          },
          {
            icon: <DownloadIcon className="size-4" />,
            onClick: (wallet) => {
              setSelectedBackendWallet(wallet);
              receiveDisclosure.onOpen();
            },
            text: "Receive funds",
          },
          {
            icon: <UploadIcon className="size-4" />,
            onClick: (wallet) => {
              setSelectedBackendWallet(wallet);
              sendDisclosure.onOpen();
            },
            text: "Send funds",
          },
          {
            icon: <TrashIcon className="size-4" />,
            isDestructive: true,
            onClick: (wallet) => {
              setSelectedBackendWallet(wallet);
              deleteDisclosure.onOpen();
            },
            text: "Delete",
          },
        ]}
        tableContainerClassName="border-x-0 rounded-t-none border-b-0"
        tableScrollableClassName="max-h-[1000px]"
        title="backend wallets"
      />

      {selectedBackendWallet && editDisclosure.isOpen && (
        <EditModal
          authToken={authToken}
          backendWallet={selectedBackendWallet}
          client={client}
          disclosure={editDisclosure}
          instanceUrl={instanceUrl}
        />
      )}
      {selectedBackendWallet && receiveDisclosure.isOpen && (
        <ReceiveFundsModal
          backendWallet={selectedBackendWallet}
          client={client}
          disclosure={receiveDisclosure}
        />
      )}
      {selectedBackendWallet && sendDisclosure.isOpen && (
        <SendFundsModal
          authToken={authToken}
          backendWallets={wallets}
          chainId={chainId}
          client={client}
          disclosure={sendDisclosure}
          fromWallet={selectedBackendWallet}
          instanceUrl={instanceUrl}
        />
      )}
      {selectedBackendWallet && deleteDisclosure.isOpen && (
        <DeleteModal
          authToken={authToken}
          backendWallet={selectedBackendWallet}
          client={client}
          disclosure={deleteDisclosure}
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
  authToken,
  client,
}: {
  backendWallet: BackendWallet;
  disclosure: UseDisclosureReturn;
  instanceUrl: string;
  authToken: string;
  client: ThirdwebClient;
}) => {
  const updateBackendWallet = useEngineUpdateBackendWallet({
    authToken,
    instanceUrl,
  });

  const [label, setLabel] = useState(backendWallet.label ?? "");

  const onClick = async () => {
    const promise = updateBackendWallet.mutateAsync(
      {
        label,
        walletAddress: backendWallet.address,
      },
      {
        onError: (error) => {
          console.error(error);
        },
        onSuccess: () => {
          disclosure.onClose();
        },
      },
    );

    toast.promise(promise, {
      error: "Failed to update backend wallet.",
      success: "Successfully updated backend wallet.",
    });
  };

  return (
    <Modal isCentered isOpen={disclosure.isOpen} onClose={disclosure.onClose}>
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
                client={client}
                shortenAddress={false}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Label</FormLabel>
              <Input
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Enter a description for this backend wallet"
                type="text"
                value={label}
              />
            </FormControl>
          </div>
        </ModalBody>

        <ModalFooter as={Flex} gap={3}>
          <Button onClick={disclosure.onClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={onClick} type="submit">
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
  client,
}: {
  backendWallet: BackendWallet;
  disclosure: UseDisclosureReturn;
  client: ThirdwebClient;
}) => {
  const qrCodeBase64Query = useQuery({
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
    queryKey: ["engine", "receive-funds-qr-code", backendWallet.address],
  });

  return (
    <Modal isCentered isOpen={disclosure.isOpen} onClose={disclosure.onClose}>
      <ModalOverlay />
      <ModalContent className="!bg-background rounded-lg border border-border">
        <ModalHeader>Receive Funds</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className="flex flex-col gap-4 pb-8">
            <Text textAlign="left" w="full">
              Fund this address or QR code:
            </Text>
            <WalletAddress
              address={backendWallet.address}
              client={client}
              shortenAddress={false}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="QR code for receiving funds"
              className="mx-auto flex w-[200px] rounded-lg"
              src={qrCodeBase64Query.data}
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
  chainId,
  client,
}: {
  fromWallet: BackendWallet;
  backendWallets: BackendWallet[];
  disclosure: UseDisclosureReturn;
  instanceUrl: string;
  authToken: string;
  chainId: number;
  client: ThirdwebClient;
}) => {
  const form = useForm<SendFundsInput>();
  const sendTokens = useEngineSendTokens({
    authToken,
    instanceUrl,
  });
  const { idToChain } = useAllChainsData();
  const { data: backendWalletBalance } = useEngineBackendWalletBalance({
    address: fromWallet.address,
    authToken,
    chainId: chainId,
    instanceUrl,
  });
  const chain = idToChain.get(chainId);
  const toWalletDisclosure = useDisclosure();

  if (!backendWalletBalance) {
    return null;
  }

  const onSubmit = async (data: SendFundsInput) => {
    const promise = sendTokens.mutateAsync(
      {
        amount: data.amount,
        chainId: chainId,
        fromAddress: fromWallet.address,
        toAddress: data.toAddress,
      },
      {
        onSuccess: () => {
          disclosure.onClose();
        },
      },
    );

    toast.promise(promise, {
      error: "Failed to send tokens.",
      success: "Successfully sent a request to send funds.",
    });
  };

  return (
    <Modal isCentered isOpen={disclosure.isOpen} onClose={disclosure.onClose}>
      <ModalOverlay />
      <ModalContent
        as="form"
        className="!bg-background rounded-lg border border-border"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <ModalHeader>Send Funds</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className="flex flex-col gap-4">
            <FormControl>
              <FormLabel>From</FormLabel>
              <WalletAddress
                address={fromWallet.address}
                client={client}
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
                  <option disabled hidden selected value="">
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
                  max={backendWalletBalance.displayValue}
                  placeholder="Enter the amount to send"
                  step="any"
                  type="number"
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
                <ChainIconClient
                  className="size-3"
                  client={client}
                  src={chain?.icon?.url}
                />
                <Text>{chain?.name}</Text>
              </Flex>
            </FormControl>
          </div>
        </ModalBody>

        <ModalFooter as={Flex} gap={3}>
          <Button onClick={disclosure.onClose} variant="outline">
            Cancel
          </Button>
          <Button disabled={!form.formState.isValid} type="submit">
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
  client,
}: {
  backendWallet: BackendWallet;
  disclosure: UseDisclosureReturn;
  instanceUrl: string;
  authToken: string;
  client: ThirdwebClient;
}) {
  const deleteBackendWallet = useEngineDeleteBackendWallet({
    authToken,
    instanceUrl,
  });

  const isLocalWallet =
    backendWallet.type === "local" || backendWallet.type === "smart:local";
  const [ackDeletion, setAckDeletion] = useState(false);

  const onClick = () => {
    const promise = deleteBackendWallet.mutateAsync(
      { walletAddress: backendWallet.address },
      {
        onError: (error) => {
          console.error(error);
        },
        onSuccess: () => {
          disclosure.onClose();
        },
      },
    );

    toast.promise(promise, {
      error: "Failed to delete backend wallet.",
      success: "Successfully deleted backend wallet.",
    });
  };

  return (
    <Modal isCentered isOpen={disclosure.isOpen} onClose={disclosure.onClose}>
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
                client={client}
                shortenAddress={false}
              />
            </FormItem>
          </div>

          {isLocalWallet && (
            <Alert className="mt-4" variant="warning">
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
            className="gap-2"
            disabled={isLocalWallet && !ackDeletion}
            onClick={onClick}
            type="submit"
            variant="destructive"
          >
            {deleteBackendWallet.isPending && <Spinner className="size-4" />}
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
