import { DynamicHeight } from "@/components/ui/DynamicHeight";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button as ButtonShadcn } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { thirdwebClient } from "@/constants/client";
import { cn } from "@/lib/utils";
import { useDashboardEVMChainId } from "@3rdweb-sdk/react";
import { CustomConnectWallet } from "@3rdweb-sdk/react/components/connect-wallet";
import {
  Box,
  Flex,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { AiOutlineWarning } from "@react-icons/all-files/ai/AiOutlineWarning";
import { useQuery } from "@tanstack/react-query";
import { FaucetButton } from "app/(dashboard)/(chain)/[chain_id]/(chainPage)/components/client/FaucetButton";
import { GiftIcon } from "app/(dashboard)/(chain)/[chain_id]/(chainPage)/components/icons/GiftIcon";
import type {
  ChainMetadataWithServices,
  ChainServices,
} from "app/(dashboard)/(chain)/types/chain";
import { getSDKTheme } from "app/components/sdk-component-theme";
import { LOCAL_NODE_PKEY } from "constants/misc";
import { useTrack } from "hooks/analytics/useTrack";
import { useSupportedChain } from "hooks/chains/configureChains";
import { ExternalLinkIcon } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { forwardRef, useCallback, useMemo, useRef, useState } from "react";
import { VscDebugDisconnect } from "react-icons/vsc";
import { toast } from "sonner";
import { prepareTransaction, sendTransaction, toWei } from "thirdweb";
import { type Chain, type ChainMetadata, localhost } from "thirdweb/chains";
import {
  PayEmbed,
  useActiveAccount,
  useActiveWallet,
  useActiveWalletChain,
  useActiveWalletConnectionStatus,
  useSwitchActiveWalletChain,
  useWalletBalance,
} from "thirdweb/react";
import { privateKeyToAccount } from "thirdweb/wallets";
import { Button, type ButtonProps, Card, Heading, Text } from "tw-components";
import { THIRDWEB_API_HOST } from "../../constants/urls";
import { useV5DashboardChain } from "../../lib/v5-adapter";

const GAS_FREE_CHAINS = [
  75513, // Geek verse testnet
  75512, // Geek verse mainnet
];

function useNetworkMismatchAdapter() {
  const walletChainId = useActiveWalletChain()?.id;
  const v4SDKChainId = useDashboardEVMChainId();
  if (!walletChainId || !v4SDKChainId) {
    // simply not ready yet, assume false
    return false;
  }
  // otherwise, compare the chain ids
  return walletChainId !== v4SDKChainId;
}

export const MismatchButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, isDisabled, onClick, loadingText, type, ...props }, ref) => {
    const account = useActiveAccount();
    const wallet = useActiveWallet();
    const activeWalletChain = useActiveWalletChain();
    const [dialog, setDialog] = useState<undefined | "no-funds" | "pay">();
    const { theme } = useTheme();
    const evmBalance = useWalletBalance({
      address: account?.address,
      chain: activeWalletChain,
      client: thirdwebClient,
    });

    const initialFocusRef = useRef<HTMLButtonElement>(null);
    const networksMismatch = useNetworkMismatchAdapter();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const trackEvent = useTrack();

    const chainId = activeWalletChain?.id;

    const eventRef = useRef<React.MouseEvent<HTMLButtonElement, MouseEvent>>();
    if (!wallet || !chainId) {
      return (
        <CustomConnectWallet
          borderRadius="md"
          colorScheme="primary"
          {...props}
        />
      );
    }
    const notEnoughBalance =
      (evmBalance.data?.value || 0n) === 0n &&
      !GAS_FREE_CHAINS.includes(chainId);
    return (
      <>
        <Popover
          initialFocusRef={initialFocusRef}
          isLazy
          isOpen={isOpen}
          onOpen={networksMismatch ? onOpen : undefined}
          onClose={onClose}
        >
          <PopoverTrigger>
            <Button
              isLoading={evmBalance.isLoading}
              {...props}
              type={networksMismatch || notEnoughBalance ? "button" : type}
              loadingText={loadingText}
              onClick={(e) => {
                e.stopPropagation();

                if (networksMismatch) {
                  eventRef.current = e;
                  return;
                }

                if (notEnoughBalance) {
                  trackEvent({
                    category: "no-funds",
                    action: "popover",
                    label: "evm",
                  });
                  setDialog("no-funds");
                  return;
                }

                if (onClick) {
                  return onClick(e);
                }
              }}
              ref={ref}
              isDisabled={isDisabled}
            >
              {children}
            </Button>
          </PopoverTrigger>
          <Card
            maxW={{ base: "xs", md: "sm" }}
            w="auto"
            as={PopoverContent}
            bg="backgroundCardHighlight"
            mx={6}
            boxShadow="0px 0px 2px 0px var(--popper-arrow-shadow-color)"
          >
            <PopoverArrow bg="backgroundCardHighlight" />
            <PopoverBody>
              {networksMismatch && (
                <MismatchNotice
                  initialFocusRef={initialFocusRef}
                  onClose={(hasSwitched) => {
                    onClose();
                    if (hasSwitched && onClick) {
                      // wait for the network switch to be finished - 100ms should be fine?
                      setTimeout(() => {
                        if (eventRef.current) {
                          onClick(eventRef.current);
                        }
                      }, 100);
                    }
                  }}
                />
              )}
            </PopoverBody>
          </Card>
        </Popover>

        {/* Not Enough Funds */}
        <Dialog
          open={!!dialog}
          onOpenChange={(v) => {
            if (!v) {
              setDialog(undefined);
            }
          }}
        >
          <DialogContent
            className={cn(
              "gap-0 p-0 z-[10001]",
              dialog === "no-funds" && "max-w-[480px]",
              dialog === "pay" && "max-w-[360px] border-none bg-transparent",
            )}
            dialogOverlayClassName="z-[10000]"
            dialogCloseClassName={"focus:ring-0"}
          >
            <DynamicHeight>
              {dialog === "no-funds" && (
                <NoFundsDialogContent
                  chain={activeWalletChain}
                  openPayModal={() => {
                    trackEvent({
                      category: "pay",
                      action: "buy",
                      label: "attempt",
                    });
                    setDialog("pay");
                  }}
                  onCloseModal={() => setDialog(undefined)}
                />
              )}

              {dialog === "pay" && (
                <PayEmbed
                  client={thirdwebClient}
                  theme={getSDKTheme(theme === "dark" ? "dark" : "light")}
                  className="!w-auto"
                  payOptions={{
                    onPurchaseSuccess(info) {
                      if (
                        info.type === "crypto" &&
                        info.status.status !== "NOT_FOUND"
                      ) {
                        trackEvent({
                          category: "pay",
                          action: "buy",
                          label: "success",
                          type: info.type,
                          chainId: info.status.quote.toToken.chainId,
                          tokenAddress: info.status.quote.toToken.tokenAddress,
                          amount: info.status.quote.toAmount,
                        });
                      }

                      if (
                        info.type === "fiat" &&
                        info.status.status !== "NOT_FOUND"
                      ) {
                        trackEvent({
                          category: "pay",
                          action: "buy",
                          label: "success",
                          type: info.type,
                          chainId: info.status.quote.toToken.chainId,
                          tokenAddress: info.status.quote.toToken.tokenAddress,
                          amount: info.status.quote.estimatedToTokenAmount,
                        });
                      }
                    },
                    prefillBuy: {
                      chain: activeWalletChain,
                    },
                  }}
                />
              )}
            </DynamicHeight>
          </DialogContent>
        </Dialog>
      </>
    );
  },
);

MismatchButton.displayName = "MismatchButton";

function NoFundsDialogContent(props: {
  chain: Chain;
  openPayModal: () => void;
  onCloseModal: () => void;
}) {
  const chainWithServiceInfoQuery = useQuery({
    queryKey: ["chain-with-services", props.chain.id],
    queryFn: async () => {
      const [chain, chainServices] = await Promise.all([
        fetch(`${THIRDWEB_API_HOST}/v1/chains/${props.chain.id}`).then((res) =>
          res.json(),
        ) as Promise<{ data: ChainMetadata }>,
        fetch(`${THIRDWEB_API_HOST}/v1/chains/${props.chain.id}/services`).then(
          (res) => res.json(),
        ) as Promise<{ data: ChainServices }>,
      ]);

      return {
        ...chain.data,
        services: chainServices.data.services,
      } satisfies ChainMetadataWithServices;
    },
    enabled: !!props.chain.id,
  });

  return (
    <div className="flex flex-col gap-0 p-0">
      <div className="flex flex-col gap-6 p-6 ">
        {/* Header */}
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold tracking-tight">
            Not Enough Funds
          </DialogTitle>

          <DialogDescription className="text-muted-foreground">
            You do not have enough funds to execute the transaction on this
            chain. Get more funds to continue
          </DialogDescription>
        </DialogHeader>

        {/* Get Funds content */}

        {!chainWithServiceInfoQuery.data ? (
          <div className="h-[300px] flex justify-center items-center">
            <Spinner className="size-10" />
          </div>
        ) : (
          <div>
            {props.chain.id === localhost.id ? (
              // localhost case
              <GetLocalHostTestnetFunds />
            ) : chainWithServiceInfoQuery.data.testnet ? (
              // faucet case
              <GetFundsFromFaucet chain={chainWithServiceInfoQuery.data} />
            ) : chainWithServiceInfoQuery.data.services.find(
                (x) => x.enabled && x.service === "pay",
              ) ? (
              // pay case
              <ButtonShadcn
                variant="primary"
                className="w-full"
                onClick={props.openPayModal}
              >
                Buy Funds
              </ButtonShadcn>
            ) : // no funds options available
            null}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border p-6 flex justify-between gap-4">
        <ButtonShadcn variant="outline" onClick={props.onCloseModal}>
          Close
        </ButtonShadcn>

        <ButtonShadcn variant="outline" asChild>
          <Link
            href="https://portal.thirdweb.com/glossary/gas"
            target="_blank"
            className="gap-2"
          >
            Learn about Gas <ExternalLinkIcon className="size-4" />
          </Link>
        </ButtonShadcn>
      </div>
    </div>
  );
}

function GetFundsFromFaucet(props: {
  chain: ChainMetadata;
}) {
  // TODO - improvement for later -> estimate gas required for transaction, and use that as the amount to give
  const amountToGive = "0.01";

  return (
    <div className="border border-border px-4 py-6 rounded-lg flex justify-center">
      <div className="flex flex-col items-center w-full">
        <div className="flex items-center">
          <GiftIcon bg="hsl(var(--background))" className="size-12" />
        </div>

        <div className="h-3" />

        <h2 className="text-lg tracking-tight font-semibold text-center px-4">
          Get Testnet Funds
        </h2>

        <div className="h-3" />

        <p className="text-sm text-muted-foreground text-center">
          A testnet faucet is an online service that provides free testnet
          currency to web3 app and blockchain developers. This allows them to
          experiment with and test smart contracts and decentralized
          applications (dApps) on EVM testnets without using real
          cryptocurrency.
        </p>

        <div className="h-6" />

        <FaucetButton chain={props.chain} amount={amountToGive} />
      </div>
    </div>
  );
}

const MismatchNotice: React.FC<{
  initialFocusRef: React.RefObject<HTMLButtonElement>;
  onClose: (hasSwitched: boolean) => void;
}> = ({ initialFocusRef, onClose }) => {
  const connectedChainId = useActiveWalletChain()?.id;
  const desiredChainId = useDashboardEVMChainId();
  const switchNetwork = useSwitchActiveWalletChain();
  const connectionStatus = useActiveWalletConnectionStatus();
  const activeWallet = useActiveWallet();
  const actuallyCanAttemptSwitch =
    activeWallet && activeWallet.id !== "global.safe";
  const walletConnectedNetworkInfo = useSupportedChain(connectedChainId || -1);
  const isMobile = useBreakpointValue({ base: true, md: false });

  const chain = useSupportedChain(desiredChainId || -1);
  const chainV5 = useV5DashboardChain(desiredChainId);

  const onSwitchWallet = useCallback(async () => {
    if (actuallyCanAttemptSwitch && desiredChainId && chainV5) {
      try {
        await switchNetwork(chainV5);
        onClose(true);
      } catch {
        //  failed to switch network
        onClose(false);
      }
    }
  }, [
    chainV5,
    actuallyCanAttemptSwitch,
    desiredChainId,
    onClose,
    switchNetwork,
  ]);

  const shortenedName = useMemo(() => {
    const limit = isMobile ? 10 : 19;

    if (!chain?.name) {
      return undefined;
    }
    return chain.name.length > limit
      ? `${chain.name.slice(0, limit)}...`
      : undefined;
  }, [chain?.name, isMobile]);

  return (
    <Flex direction="column" gap={4}>
      <Heading size="label.lg">
        <Flex gap={2} align="center">
          <Icon boxSize={6} as={AiOutlineWarning} />
          <span>Network Mismatch</span>
        </Flex>
      </Heading>

      <Text>
        Your wallet is connected to the{" "}
        <Box as="strong" textTransform="capitalize">
          {walletConnectedNetworkInfo?.name}
        </Box>{" "}
        network but this action requires you to connect to the{" "}
        <Box as="strong" textTransform="capitalize">
          {chain?.name}
        </Box>{" "}
        network.
      </Text>

      <Button
        ref={actuallyCanAttemptSwitch ? initialFocusRef : undefined}
        leftIcon={<Icon as={VscDebugDisconnect} />}
        size="sm"
        onClick={onSwitchWallet}
        isLoading={connectionStatus === "connecting"}
        isDisabled={!actuallyCanAttemptSwitch}
        colorScheme="orange"
        textTransform="capitalize"
        noOfLines={1}
      >
        Switch wallet {chain ? `to ${shortenedName || chain.name}` : ""}
      </Button>

      {!actuallyCanAttemptSwitch && (
        <Text size="body.sm" fontStyle="italic">
          Your connected wallet does not support programmatic switching.
          <br />
          Please manually switch the network in your wallet.
        </Text>
      )}
    </Flex>
  );
};

const GetLocalHostTestnetFunds: React.FC = () => {
  const address = useActiveAccount()?.address;
  const requestFunds = async () => {
    if (!address) {
      return toast.error("No active account detected");
    }
    const faucet = privateKeyToAccount({
      privateKey: LOCAL_NODE_PKEY,
      client: thirdwebClient,
    });
    const transaction = prepareTransaction({
      to: address,
      chain: localhost,
      client: thirdwebClient,
      value: toWei("10"),
    });
    const promise = sendTransaction({
      account: faucet,
      transaction,
    });
    toast.promise(promise, {
      error: "Failed to get funds from localhost",
      success: "Successfully got funds from localhost",
      loading: "Requesting funds",
    });
  };

  return (
    <ButtonShadcn variant="primary" onClick={requestFunds} className="w-full">
      Get Funds from Localhost
    </ButtonShadcn>
  );
};
