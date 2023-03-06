import { useWeb3 } from "@3rdweb-sdk/react/hooks/useWeb3";
import {
  Center,
  Flex,
  FormControl,
  Icon,
  IconButton,
  Image,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Stack,
  Tooltip,
  useBreakpointValue,
  useClipboard,
  useDisclosure,
} from "@chakra-ui/react";
import { AiOutlineDisconnect } from "@react-icons/all-files/ai/AiOutlineDisconnect";
import { AiTwotoneBank } from "@react-icons/all-files/ai/AiTwotoneBank";
import { GiWavyChains } from "@react-icons/all-files/gi/GiWavyChains";
import {
  WalletNotSelectedError,
  useWallet,
} from "@solana/wallet-adapter-react";
import Solana from "@thirdweb-dev/chain-icons/dist/solana";
import {
  ChainId,
  useAddress,
  useBalance,
  useChainId,
  useConnect,
  useDisconnect,
  useMetamask,
  useNetwork,
  useSDK,
} from "@thirdweb-dev/react/evm";
import { useGnosis } from "@thirdweb-dev/react/evm/connectors/gnosis-safe";
import { useMagic } from "@thirdweb-dev/react/evm/connectors/magic";
import { ChakraNextImage } from "components/Image";
import { MismatchButton } from "components/buttons/MismatchButton";
import { ConfigureNetworkModal } from "components/configure-networks/ConfigureNetworkModal";
import { useEns } from "components/contract-components/hooks";
import { ChainIcon } from "components/icons/ChainIcon";
import { SupportedNetworkSelect } from "components/selects/SupportedNetworkSelect";
import { GNOSIS_TO_CHAIN_ID } from "constants/mappings";
import { CustomSDKContext } from "contexts/custom-sdk-context";
import { constants, utils } from "ethers";
import { useTrack } from "hooks/analytics/useTrack";
import {
  useConfiguredChain,
  useConfiguredChainsRecord,
} from "hooks/chains/configureChains";
import { useTxNotifications } from "hooks/useTxNotifications";
import { StaticImageData } from "next/image";
import posthog from "posthog-js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { FiCheck, FiChevronDown, FiCopy, FiUser } from "react-icons/fi";
import { IoMdSettings } from "react-icons/io";
import {
  Badge,
  Button,
  ButtonProps,
  Card,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  LinkButton,
  MenuGroup,
  MenuItem,
  Text,
} from "tw-components";
import { shortenIfAddress, shortenString } from "utils/usedapp-external";
import { Connector } from "wagmi-core";

const connectorIdToImageUrl: Record<string, StaticImageData> = {
  MetaMask: require("public/logos/metamask-fox.svg"),
  WalletConnect: require("public/logos/walletconnect-logo.svg"),
  "Coinbase Wallet": require("public/logos/coinbase-wallet-logo.svg"),
  Magic: require("public/logos/magic-logo.svg"),
  Gnosis: require("public/logos/gnosis-logo.svg"),
  Injected: require("public/logos/wallet.png"),
};

const registerConnector = (_connector: string) => {
  posthog.register({ connector: _connector });
  posthog.capture("wallet_connected", { connector: _connector });
};

export interface EcosystemButtonprops extends ButtonProps {
  ecosystem?: "evm" | "solana" | "either";
  shrinkMobile?: boolean;
}

export function useNetworkWithPatchedSwitching() {
  const [network, switchNetwork] = useNetwork();
  const actuallyCanAttemptSwitch = !!switchNetwork;
  const [{ data }] = useConnect();
  const connector = data?.connector;
  const { onError } = useTxNotifications("", "Failed to switch network");
  const configuredChains = useConfiguredChainsRecord();

  const patchedSwitchNetwork = useCallback(
    async (chainId: number) => {
      if (actuallyCanAttemptSwitch && chainId && configuredChains) {
        const res = await switchNetwork(chainId);
        if (res.error && res.error.name === "AddChainError") {
          if (connector && connector.getProvider()) {
            const chain = configuredChains[chainId];
            if (!chain) {
              throw new Error("Chain not configured");
            }
            try {
              await connector.getProvider().request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: `0x${chain.chainId.toString(16)}`,
                    chainName: chain.name,
                    nativeCurrency: chain.nativeCurrency,
                    rpcUrls: chain.rpc,
                    blockExplorerUrls: chain?.explorers?.map(
                      (explorer) => explorer.url,
                    ),
                  },
                ],
              });
              // added chain successfully, try switching again
              const newRes = await switchNetwork(chainId);
              if (newRes.error) {
                throw newRes.error;
              }
            } catch (err) {
              onError(err as Error);
            }
          } else {
            onError(res.error);
          }
        }
      }
    },
    [
      actuallyCanAttemptSwitch,
      switchNetwork,
      connector,
      configuredChains,
      onError,
    ],
  );

  return useMemo(
    () =>
      [
        network,
        actuallyCanAttemptSwitch ? patchedSwitchNetwork : undefined,
      ] as const,
    [network, patchedSwitchNetwork, actuallyCanAttemptSwitch],
  );
}

export const ConnectWallet: React.FC<EcosystemButtonprops> = ({
  ecosystem = "either",
  ...buttonProps
}) => {
  const trackEvent = useTrack();
  const solWallet = useWallet();
  const [showConfigureNetworkModal, setShowConfigureNetworkModal] =
    useState(false);

  const [connector, connect] = useConnect();
  const { getNetworkMetadata } = useWeb3();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const disconnect = useDisconnect();
  const disconnectFully = useDisconnect({ reconnectPrevious: false });
  const [network, switchNetwork] = useNetworkWithPatchedSwitching();
  const address = useAddress();
  const chainId = useChainId();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const { hasCopied, onCopy, setValue } = useClipboard(address || "");
  const {
    hasCopied: hasCopiedSol,
    onCopy: onCopySol,
    setValue: setValueSol,
  } = useClipboard(solWallet.publicKey?.toBase58() || "");

  useEffect(() => {
    if (address) {
      setValue(address);
    }
  }, [address, setValue]);

  useEffect(() => {
    if (solWallet.publicKey) {
      setValueSol(solWallet.publicKey?.toBase58());
    }
  }, [solWallet.publicKey, setValueSol]);

  useEffect(() => {
    if (solWallet.publicKey) {
      setValue(solWallet.publicKey?.toBase58());
    }
  }, [solWallet.publicKey, setValue]);

  function handleConnect(_connector: Connector<any, any>) {
    if (_connector.name.toLowerCase() === "magic") {
      onOpen();
    } else {
      try {
        posthog.capture("wallet_connected_attempt", { connector: _connector });
        connect(_connector);
        registerConnector(_connector.name);
      } catch (error) {
        posthog.capture("wallet_connected_fail", {
          connector: _connector,
          error,
        });
      }
    }
  }

  const balanceQuery = useBalance();

  const connectWithMetamask = useMetamask();

  const activeConnector = connector.data.connector;

  const gnosisConnector = connector.data.connectors.find(
    (c) => c.id === "gnosis",
  );
  const isGnosisConnectorConnected =
    activeConnector?.id === gnosisConnector?.id;

  const gnosisModalState = useDisclosure();

  const ensQuery = useEns(address);

  const sdk = useSDK();
  const chainInfo = useConfiguredChain(chainId || -1);
  const hasFaucet =
    chainInfo &&
    (chainInfo.chainId === ChainId.Localhost ||
      (chainInfo.faucets && chainInfo.faucets.length > 0));
  const requestFunds = async () => {
    if (sdk && hasFaucet) {
      if (chainInfo.chainId === ChainId.Localhost) {
        await sdk.wallet.requestFunds(10);
        await balanceQuery.refetch();
        trackEvent({
          category: "request-funds",
          action: "click",
          label: "from-sdk",
        });
      } else if (
        chainInfo &&
        chainInfo.faucets &&
        chainInfo.faucets.length > 0
      ) {
        trackEvent({
          category: "request-funds",
          action: "click",
          label: "from-faucet",
          faucet: chainInfo.faucets[0],
        });
        const faucet = chainInfo.faucets[0];
        window.open(faucet, "_blank");
      }
    }
  };

  // if solana is connected we hit this
  if (solWallet.publicKey && ecosystem !== "evm") {
    return (
      <Menu isLazy>
        <MenuButton
          as={Button}
          {...buttonProps}
          variant="outline"
          colorScheme="gray"
          rightIcon={<FiChevronDown />}
        >
          <Flex direction="row" gap={3} align="center">
            <Image alt="" boxSize={6} src={solWallet.wallet?.adapter.icon} />
            <Text size="label.sm">
              {shortenString(solWallet.publicKey.toBase58())}
            </Text>
          </Flex>
        </MenuButton>
        <MenuList borderRadius="lg" py={2}>
          <MenuItem
            closeOnSelect={false}
            icon={
              <Icon
                color={hasCopiedSol ? "green.500" : "inherit"}
                as={hasCopiedSol ? FiCheck : FiCopy}
              />
            }
            onClick={onCopySol}
          >
            Copy public key
          </MenuItem>
          <MenuItem
            icon={<AiOutlineDisconnect />}
            onClick={async () => {
              await solWallet.disconnect();
            }}
          >
            Disconnect
          </MenuItem>
        </MenuList>
      </Menu>
    );
  }
  // if EVM is connected we hit this
  if (address && chainId && ecosystem !== "solana") {
    const networkMetadata = getNetworkMetadata(chainId, false);
    return (
      <>
        {showConfigureNetworkModal && (
          <ConfigureNetworkModal
            onClose={() => setShowConfigureNetworkModal(false)}
          />
        )}
        <GnosisSafeModal
          isOpen={gnosisModalState.isOpen}
          onClose={gnosisModalState.onClose}
        />
        <Menu isLazy>
          <MenuButton
            as={Button}
            {...buttonProps}
            variant="outline"
            colorScheme="gray"
            rightIcon={<FiChevronDown />}
          >
            <Flex direction="row" gap={3} align="center">
              <ChainIcon
                size={24}
                ipfsSrc={networkMetadata.icon}
                sizes={networkMetadata.iconSizes}
              />
              <Flex gap={0.5} direction="column" textAlign="left">
                <Heading as="p" size="label.sm">
                  <Skeleton as="span" isLoaded={!balanceQuery.isLoading}>
                    {balanceQuery.data?.displayValue.slice(0, 6) || "0.000"}
                  </Skeleton>{" "}
                  {networkMetadata.symbol}
                </Heading>
                <Text size="label.sm" color="accent.600">
                  {shortenIfAddress(ensQuery.data?.ensName || address, true)}
                  {isMobile ? null : ` (${networkMetadata.chainName})`}
                </Text>
              </Flex>

              {activeConnector && (
                <Center boxSize={6}>
                  <ChakraNextImage
                    w="100%"
                    _dark={
                      isGnosisConnectorConnected
                        ? { filter: "invert(1)" }
                        : undefined
                    }
                    borderRadius="md"
                    src={
                      isGnosisConnectorConnected
                        ? connectorIdToImageUrl.Gnosis
                        : connectorIdToImageUrl[activeConnector.name]
                    }
                    placeholder="empty"
                    alt=""
                  />
                </Center>
              )}
            </Flex>
          </MenuButton>
          <MenuList borderRadius="lg" py={2}>
            <MenuGroup
              as="div"
              title={
                <Flex justifyContent="space-between" alignItems="center">
                  <Flex gap={2}>
                    Personal Wallet{" "}
                    {!isGnosisConnectorConnected && (
                      <Badge
                        colorScheme="green"
                        marginStart={1}
                        variant="subtle"
                        size="label.sm"
                      >
                        connected
                      </Badge>
                    )}
                  </Flex>
                  <MenuItem w="auto" p={0} m={0}>
                    <IconButton
                      as={LinkButton}
                      size="xs"
                      icon={<Icon as={FiUser} />}
                      href={`/${address}`}
                      aria-label="Visit profile"
                    />
                  </MenuItem>
                </Flex>
              }
            >
              {!isGnosisConnectorConnected && (
                <>
                  <MenuItem
                    closeOnSelect={false}
                    icon={
                      <Icon
                        color={hasCopied ? "green.500" : "inherit"}
                        as={hasCopied ? FiCheck : FiCopy}
                      />
                    }
                    onClick={onCopy}
                  >
                    Copy wallet address
                  </MenuItem>

                  <MenuItem
                    pointerEvents={"none"}
                    closeOnSelect={false}
                    icon={<GiWavyChains />}
                  >
                    <SupportedNetworkSelect
                      disabled={!switchNetwork}
                      fontWeight={500}
                      isDisabled={network.loading}
                      value={network.data.chain?.id || -1}
                      onChange={(e) => {
                        if (switchNetwork) {
                          switchNetwork(parseInt(e.target.value) as ChainId);
                        }
                      }}
                      cursor="pointer"
                      onClick={(e) => e.stopPropagation()}
                      pointerEvents={"all"}
                      variant="outline"
                      position="relative"
                      size="sm"
                    />
                  </MenuItem>

                  <MenuItem
                    icon={<Icon as={IoMdSettings} />}
                    onClick={() => {
                      trackEvent({
                        category: "configure-networks",
                        action: "click",
                        label: "dropdown",
                      });
                      setShowConfigureNetworkModal(true);
                    }}
                    py={3}
                  >
                    Configure Networks
                  </MenuItem>
                </>
              )}
              {hasFaucet ? (
                <MenuItem
                  icon={<AiTwotoneBank />}
                  onClick={requestFunds}
                  py={3}
                >
                  Request Testnet Funds
                </MenuItem>
              ) : null}
              <MenuItem icon={<AiOutlineDisconnect />} onClick={disconnect}>
                {isGnosisConnectorConnected
                  ? "Switch to personal wallet"
                  : "Disconnect"}
              </MenuItem>
            </MenuGroup>
            <MenuDivider borderColor="borderColor" mb={5} />

            <MenuGroup
              title={
                <>
                  Team Wallet{" "}
                  {isGnosisConnectorConnected && (
                    <Badge
                      colorScheme="green"
                      marginStart={1}
                      variant="subtle"
                      size="label.sm"
                    >
                      connected
                    </Badge>
                  )}
                </>
              }
            >
              {gnosisConnector && !isGnosisConnectorConnected && (
                <>
                  <MenuItem
                    icon={
                      <ChakraNextImage
                        _dark={{ filter: "invert(1)" }}
                        boxSize={3}
                        borderRadius="md"
                        src={connectorIdToImageUrl.Gnosis}
                        placeholder="empty"
                        alt=""
                      />
                    }
                    onClick={gnosisModalState.onOpen}
                  >
                    Connect Gnosis Safe
                  </MenuItem>
                </>
              )}
              {isGnosisConnectorConnected && (
                <>
                  <MenuItem
                    closeOnSelect={false}
                    icon={
                      <Icon
                        color={hasCopied ? "green.500" : "inherit"}
                        as={hasCopied ? FiCheck : FiCopy}
                      />
                    }
                    onClick={onCopy}
                  >
                    Copy wallet address
                  </MenuItem>
                  <MenuItem
                    icon={<AiOutlineDisconnect />}
                    onClick={disconnectFully}
                  >
                    Disconnect
                  </MenuItem>
                </>
              )}
            </MenuGroup>
          </MenuList>
        </Menu>
      </>
    );
  }

  return (
    <>
      {process.env.NEXT_PUBLIC_MAGIC_KEY ? (
        <MagicModal isOpen={isOpen} onClose={onClose} />
      ) : null}
      <Menu isLazy>
        <MenuButton
          isLoading={connector.loading}
          as={Button}
          colorScheme="blue"
          rightIcon={<FiChevronDown />}
          {...buttonProps}
        >
          Connect Wallet
        </MenuButton>

        <MenuList>
          {ecosystem !== "solana" && (
            <MenuItem
              py={3}
              icon={
                <ChakraNextImage
                  boxSize={4}
                  borderRadius="md"
                  src={connectorIdToImageUrl.MetaMask}
                  placeholder="empty"
                  alt=""
                />
              }
              onClick={() => {
                try {
                  posthog.capture("wallet_connected_attempt", {
                    connector: "metamask",
                  });
                  connectWithMetamask();
                  registerConnector("metamask");
                } catch (error) {
                  posthog.capture("wallet_connected_fail", {
                    connector: "metamask",
                    error,
                  });
                }
              }}
            >
              MetaMask
            </MenuItem>
          )}
          {ecosystem !== "evm" &&
            solWallet.wallets.map((sWallet) => {
              return (
                <MenuItem
                  key={sWallet.adapter.name}
                  py={3}
                  icon={
                    <Image
                      boxSize={4}
                      borderRadius="md"
                      src={sWallet.adapter.icon}
                      placeholder="empty"
                      alt=""
                    />
                  }
                  w="100%"
                  onClick={async () => {
                    solWallet.select(sWallet.adapter.name);
                    try {
                      await solWallet.connect();
                    } catch (e) {
                      if (e instanceof WalletNotSelectedError) {
                        // seems safe to ignore?
                      } else {
                        console.error(
                          "failed to connect to solana wallet",
                          e,
                          sWallet,
                        );
                      }
                    }
                  }}
                >
                  <Flex as="span" align="center" justify="space-between">
                    <span>{sWallet.adapter.name}</span>
                    <Icon as={Solana} />
                  </Flex>
                </MenuItem>
              );
            })}

          {ecosystem !== "solana" &&
            connector.data.connectors
              .filter((c) => c.id !== "gnosis" && c.name !== "MetaMask")
              .map((_connector) => {
                if (!_connector.ready) {
                  return null;
                }

                return (
                  <MenuItem
                    py={3}
                    key={_connector.name}
                    icon={
                      <ChakraNextImage
                        boxSize={4}
                        borderRadius="md"
                        src={
                          _connector.id === "gnosis"
                            ? connectorIdToImageUrl["Gnosis"]
                            : Object.keys(connectorIdToImageUrl).includes(
                                _connector.name,
                              )
                            ? connectorIdToImageUrl[_connector.name]
                            : connectorIdToImageUrl["Injected"]
                        }
                        placeholder="empty"
                        alt=""
                      />
                    }
                    onClick={() => handleConnect(_connector)}
                  >
                    {_connector.id === "magic"
                      ? "Email Wallet"
                      : _connector.name === "Injected"
                      ? "Mobile Wallet"
                      : _connector.name}
                  </MenuItem>
                );
              })}
          {ecosystem !== "solana" && gnosisConnector ? (
            <>
              <MenuDivider py={0} />
              <Tooltip
                bg="transparent"
                boxShadow="none"
                p={0}
                label={
                  <Card>
                    <Text>
                      You need to first connect a personal wallet to connect to
                      a Gnosis Safe.
                    </Text>
                  </Card>
                }
                // shouldWrapChildren
              >
                <MenuItem
                  py={3}
                  isDisabled
                  icon={
                    <ChakraNextImage
                      boxSize={4}
                      borderRadius="md"
                      src={connectorIdToImageUrl["Gnosis"]}
                      placeholder="empty"
                      alt=""
                    />
                  }
                >
                  Gnosis Safe
                </MenuItem>
              </Tooltip>
            </>
          ) : undefined}
        </MenuList>
      </Menu>
    </>
  );
};

interface ConnectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GnosisSafeModal: React.FC<ConnectorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const connectGnosis = useGnosis();

  const {
    register,
    handleSubmit,
    setError,
    watch,
    clearErrors,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<{ safeAddress: string; safeChainId: string }>({
    defaultValues: {
      safeAddress: "",
      safeChainId: (-1).toString(),
    },
    reValidateMode: "onChange",
  });
  const formData = watch();
  const safeChainId = parseInt(formData.safeChainId);

  useEffect(() => {
    if (!formData.safeAddress) {
      setError("safeAddress", {
        type: "required",
        message: "Safe address is required",
      });
    } else if (!utils.isAddress(formData.safeAddress)) {
      setError("safeAddress", {
        type: "pattern",
        message: "Not a valid address",
      });
    } else {
      clearErrors("safeAddress");
    }
  }, [clearErrors, formData.safeAddress, setError]);

  const { onError } = useTxNotifications(
    "Connected Gnosis Safe",
    "Failed to connect Gnosis Safe",
  );
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent pb={5} mx={{ base: 4, md: 0 }}>
        <ModalHeader>
          <Flex gap={2} align="center">
            <Heading size="subtitle.md">Gnosis Safe Connect </Heading>
            <Badge variant="outline" colorScheme="purple">
              beta
            </Badge>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody
          as="form"
          onSubmit={handleSubmit(async (d) => {
            try {
              const response = await connectGnosis({
                ...d,
                safeChainId: parseInt(d.safeChainId),
              });
              if (response?.error) {
                throw response.error;
              }
              onClose();
            } catch (err) {
              console.error("failed to connect", err);
              onError(err);
            }
          })}
        >
          <Stack spacing={5}>
            <FormControl isRequired isInvalid={!!errors.safeAddress} mr={4}>
              <FormLabel>Safe Address</FormLabel>
              <Input
                onPaste={(e) => {
                  try {
                    const text = e.clipboardData.getData("Text");
                    if (text.indexOf(":0x") > -1) {
                      // looks like we have a network key from gnosis safe in there

                      const [gnosisNetwork, gnosisSafeAddress] =
                        text.split(":");

                      // prevent the default (setting the data to the input) since we're about to handle it
                      if (
                        utils.isAddress(gnosisSafeAddress) &&
                        gnosisNetwork in GNOSIS_TO_CHAIN_ID
                      ) {
                        e.preventDefault();
                        // just re-set the form with the data we found
                        reset({
                          safeAddress: gnosisSafeAddress,
                          safeChainId:
                            GNOSIS_TO_CHAIN_ID[
                              gnosisNetwork as keyof typeof GNOSIS_TO_CHAIN_ID
                            ].toString(),
                        });
                      }
                    }
                  } catch (err) {
                    console.error("failed to get paste data", err);
                  }
                }}
                {...register("safeAddress")}
                placeholder={`net:${constants.AddressZero}`}
                autoFocus
              />
              <FormHelperText>
                You can find this address on your gnosis safe dashboard.
              </FormHelperText>
              <FormErrorMessage>
                {errors?.safeAddress?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={!!errors.safeChainId} mr={4}>
              <FormLabel>Safe Network</FormLabel>
              <SupportedNetworkSelect
                disabledChainIds={[
                  ChainId.Fantom,
                  ChainId.Mumbai,
                  ChainId.Optimism,
                  ChainId.OptimismGoerli,
                  ChainId.Arbitrum,
                  ChainId.ArbitrumGoerli,
                  ChainId.FantomTestnet,
                  ChainId.AvalancheFujiTestnet,
                ]}
                {...register("safeChainId")}
                value={safeChainId}
              />

              <FormHelperText>
                The network your gnosis safe is deployed on.
              </FormHelperText>
              <FormErrorMessage>
                {errors?.safeChainId?.message}
              </FormErrorMessage>
            </FormControl>
            <CustomSDKContext
              desiredChainId={parseInt(formData.safeChainId || "1")}
            >
              <MismatchButton
                isDisabled={!!Object.keys(errors).length}
                isLoading={isSubmitting}
                type="submit"
                borderRadius="md"
                colorScheme="blue"
              >
                Connect to Gnosis Safe
              </MismatchButton>
            </CustomSDKContext>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const MagicModal: React.FC<ConnectorModalProps> = ({ isOpen, onClose }) => {
  const connectMagic = useMagic();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<{ email: string }>();

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent pb={5} mx={{ base: 4, md: 0 }}>
        <ModalHeader>
          <Heading size="subtitle.md">Email Connect</Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody
          as="form"
          onSubmit={handleSubmit(async ({ email }) => {
            try {
              posthog.capture("wallet_connected_attempt", {
                connector: "magic",
              });
              await connectMagic({ email });
              registerConnector("magic");

              onClose();
            } catch (error) {
              console.error("failed to connect", error);
              setError("email", {
                message:
                  error instanceof Error
                    ? error.message
                    : "Something went wrong",
              });
              posthog.capture("wallet_connected_fail", {
                connector: "magic",
                error,
              });
            }
          })}
        >
          <Stack spacing={5}>
            <FormControl isRequired isInvalid={!!errors.email} mr={4}>
              <Input
                {...register("email")}
                placeholder="name@example.com"
                autoFocus
                type="email"
              />
              <FormErrorMessage>{errors?.email?.message}</FormErrorMessage>
            </FormControl>
            <Button
              isLoading={isSubmitting}
              type="submit"
              borderRadius="md"
              colorScheme="blue"
            >
              Sign In
            </Button>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
