import { useWeb3 } from "@3rdweb-sdk/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Center,
  Flex,
  FormControl,
  Icon,
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
  useClipboard,
  useDisclosure,
} from "@chakra-ui/react";
import {
  ChainId,
  useAddress,
  useBalance,
  useChainId,
  useConnect,
  useDisconnect,
  useGnosis,
  useMagic,
  useMetamask,
  useNetwork,
} from "@thirdweb-dev/react";
import { ChakraNextImage } from "components/Image";
import { MismatchButton } from "components/buttons/MismatchButton";
import { useEnsName } from "components/contract-components/hooks";
import { SupportedNetworkSelect } from "components/selects/SupportedNetworkSelect";
import { GNOSIS_TO_CHAIN_ID } from "constants/mappings";
import { CustomSDKContext } from "contexts/custom-sdk-context";
import { constants, utils } from "ethers";
import { useTxNotifications } from "hooks/useTxNotifications";
import { StaticImageData } from "next/image";
import posthog from "posthog-js";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineDisconnect } from "react-icons/ai";
import { FiCheck, FiCopy } from "react-icons/fi";
import { GiWavyChains } from "react-icons/gi";
import {
  Badge,
  Button,
  ButtonProps,
  Card,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  MenuGroup,
  MenuItem,
  Text,
} from "tw-components";
import { shortenIfAddress } from "utils/usedapp-external";
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

export const ConnectWallet: React.FC<ButtonProps> = (buttonProps) => {
  const [connector, connect] = useConnect();
  const { getNetworkMetadata } = useWeb3();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const disconnect = useDisconnect();
  const disconnectFully = useDisconnect({ reconnectAfterGnosis: false });
  const [network, switchNetwork] = useNetwork();
  const address = useAddress();
  const chainId = useChainId();

  const { hasCopied, onCopy } = useClipboard(address || "");
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

  const ensName = useEnsName(address);

  if (address && chainId) {
    const SVG = getNetworkMetadata(chainId).icon;
    return (
      <>
        <GnosisSafeModal
          isOpen={gnosisModalState.isOpen}
          onClose={gnosisModalState.onClose}
        />
        <Menu matchWidth isLazy>
          <MenuButton
            as={Button}
            {...buttonProps}
            variant="outline"
            colorScheme="gray"
            rightIcon={<ChevronDownIcon />}
          >
            <Flex direction="row" gap={3} align="center">
              <Icon boxSize={6} as={SVG} />
              <Flex gap={0.5} direction="column" textAlign="left">
                <Text size="label.sm">
                  <Skeleton as="span" isLoaded={!balanceQuery.isLoading}>
                    {balanceQuery.data?.displayValue.slice(0, 6) || "0.000"}
                  </Skeleton>{" "}
                  {getNetworkMetadata(chainId).symbol}
                </Text>
                <Text size="label.sm" color="gray.500">
                  {shortenIfAddress(ensName.data || address, true)} (
                  {getNetworkMetadata(chainId).chainName})
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
              title={
                <>
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
                </>
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
                </>
              )}
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
      <MagicModal isOpen={isOpen} onClose={onClose} />
      <Menu matchWidth isLazy>
        <MenuButton
          isLoading={connector.loading}
          as={Button}
          colorScheme="primary"
          rightIcon={<ChevronDownIcon />}
          {...buttonProps}
        >
          Connect Wallet
        </MenuButton>

        <MenuList>
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
          {connector.data.connectors
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
          {gnosisConnector ? (
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
                shouldWrapChildren
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
              if (response.error) {
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
                  ChainId.OptimismTestnet,
                  ChainId.Arbitrum,
                  ChainId.ArbitrumTestnet,
                  ChainId.FantomTestnet,
                  ChainId.AvalancheFujiTestnet,
                ]}
                {...register("safeChainId")}
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
                colorScheme="primary"
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
              colorScheme="primary"
            >
              Sign In
            </Button>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
