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
  useClipboard,
  useDisclosure,
} from "@chakra-ui/react";
import { AddressZero } from "@ethersproject/constants";
import {
  ChainId,
  useConnect,
  useDisconnect,
  useGnosis,
  useMagic,
  useNetwork,
} from "@thirdweb-dev/react";
import { ChakraNextImage } from "components/Image";
import { MismatchButton } from "components/buttons/MismatchButton";
import { SupportedNetworkSelect } from "components/selects/SupportedNetworkSelect";
import { GNOSIS_TO_CHAIN_ID } from "constants/mappings";
import { CustomSDKContext } from "contexts/custom-sdk-context";
import { isAddress } from "ethers/lib/utils";
import { useTxNotifications } from "hooks/useTxNotifications";
import { StaticImageData } from "next/image";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineDisconnect } from "react-icons/ai";
import { FiCheck, FiCopy } from "react-icons/fi";
import { GiWavyChains } from "react-icons/gi";
import {
  Badge,
  Button,
  ButtonProps,
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
};

export const ConnectWallet: React.FC<ButtonProps> = (buttonProps) => {
  const [connector, connect] = useConnect();
  const { balance, address, chainId, getNetworkMetadata } = useWeb3();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const disconnect = useDisconnect();
  const disconnectFully = useDisconnect({ reconnectAfterGnosis: false });
  const [network, switchNetwork] = useNetwork();

  const { hasCopied, onCopy } = useClipboard(address || "");

  function handleConnect(_connector: Connector<any, any>) {
    if (_connector.name.toLowerCase() === "magic") {
      onOpen();
    } else {
      connect(_connector);
    }
  }

  const activeConnector = connector.data.connector;

  const gnosisConnector = connector.data.connectors.find(
    (c) => c.id === "gnosis",
  );
  const isGnosisConnectorConnected =
    activeConnector?.id === gnosisConnector?.id;

  const gnosisModalState = useDisclosure();

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
                  <Skeleton as="span" isLoaded={!balance.isLoading}>
                    {balance.data?.formatted || "0.000"}
                  </Skeleton>{" "}
                  {getNetworkMetadata(chainId).symbol}
                </Text>
                <Text size="label.sm" color="gray.500">
                  {shortenIfAddress(address, true)} (
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
            <MenuDivider borderColor="borderColor" mb={3} />

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
          {connector.data.connectors
            .filter((c) => c.id !== "gnosis")
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
                      src={connectorIdToImageUrl[_connector.name]}
                      placeholder="empty"
                      alt=""
                    />
                  }
                  onClick={() => handleConnect(_connector)}
                >
                  {_connector.id === "magic"
                    ? "Email Wallet (Magic)"
                    : _connector.name}
                </MenuItem>
              );
            })}
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
    } else if (!isAddress(formData.safeAddress)) {
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
                        isAddress(gnosisSafeAddress) &&
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
                placeholder={`net:${AddressZero}`}
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
                disabledChainIds={[ChainId.Fantom, ChainId.Mumbai]}
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
              await connectMagic({ email });
              onClose();
            } catch (err) {
              console.error("failed to connect", err);
              setError("email", {
                message:
                  err instanceof Error ? err.message : "Something went wrong",
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
              Connect with Magic
            </Button>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
