/* eslint-disable react/forbid-dom-props */
import { popularChains } from "../popularChains";
import {
  Icon,
  Image,
  Menu,
  MenuButton,
  MenuList,
  useClipboard,
  useColorMode,
  Flex,
  Spacer,
  Box,
} from "@chakra-ui/react";
import { AiOutlineDisconnect } from "@react-icons/all-files/ai/AiOutlineDisconnect";
import {
  WalletNotSelectedError,
  useWallet as useSolWallet,
} from "@solana/wallet-adapter-react";
import Solana from "@thirdweb-dev/chain-icons/dist/solana";
import { ConnectWallet, useConnectionStatus } from "@thirdweb-dev/react";
import { ChakraNextImage } from "components/Image";
import { CustomChainRenderer } from "components/selects/CustomChainRenderer";
import {
  useAddRecentlyUsedChainId,
  useRecentlyUsedChains,
} from "hooks/chains/recentlyUsedChains";
import { useSetIsNetworkConfigModalOpen } from "hooks/networkConfigModal";
import { ComponentProps, useEffect } from "react";
import { FiCheck, FiChevronDown, FiCopy } from "react-icons/fi";
import {
  Button,
  ButtonProps,
  MenuItem,
  Text,
  Heading,
  TrackedLink,
} from "tw-components";
import { shortenString } from "utils/usedapp-external";

export interface ConnectWalletProps extends ButtonProps {
  ecosystem?: "evm" | "solana" | "either";
  shrinkMobile?: boolean;
  upsellTestnet?: boolean;
  onChainSelect?: (chainId: number) => void;
  auth?: ComponentProps<typeof ConnectWallet>["auth"];
}

export const CustomConnectWallet: React.FC<ConnectWalletProps> = ({
  ecosystem = "either",
  auth,
  ...buttonProps
}) => {
  const { colorMode } = useColorMode();
  const recentChains = useRecentlyUsedChains();
  const addRecentlyUsedChainId = useAddRecentlyUsedChainId();
  const setIsNetworkConfigModalOpen = useSetIsNetworkConfigModalOpen();

  const solWallet = useSolWallet();
  const {
    hasCopied: hasCopiedSol,
    onCopy: onCopySol,
    setValue: setValueSol,
  } = useClipboard(solWallet.publicKey?.toBase58() || "");

  useEffect(() => {
    if (solWallet.publicKey) {
      setValueSol(solWallet.publicKey?.toBase58());
    }
  }, [solWallet.publicKey, setValueSol]);

  const connectionStatus = useConnectionStatus();

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

  if (ecosystem === "evm" || ecosystem === "either") {
    return (
      <ConnectWallet
        auth={auth}
        theme={colorMode}
        welcomeScreen={() => {
          return <ConnectWalletWelcomeScreen theme={colorMode} />;
        }}
        networkSelector={{
          popularChains,
          recentChains,
          onSwitch(chain) {
            addRecentlyUsedChainId(chain.chainId);
          },
          onCustomClick() {
            setIsNetworkConfigModalOpen(true);
          },
          renderChain: CustomChainRenderer,
        }}
      />
    );
  }

  return (
    <>
      <Menu isLazy>
        <MenuButton
          isLoading={
            connectionStatus === "connecting" || connectionStatus === "unknown"
          }
          as={Button}
          colorScheme="blue"
          rightIcon={<FiChevronDown />}
          {...buttonProps}
        >
          Connect Wallet
        </MenuButton>

        <MenuList>
          {solWallet.wallets.length === 0 ? (
            <MenuItem
              py={3}
              icon={
                <ChakraNextImage
                  boxSize={4}
                  borderRadius="md"
                  src={require("public/assets/dashboard/phantom.png")}
                  placeholder="empty"
                  alt=""
                />
              }
              w="100%"
              onClick={() => {
                window.open("https://phantom.app/", "_blank");
              }}
            >
              <Flex as="span" align="center" justify="space-between">
                <span>Phantom</span>
                <Icon as={Solana} />
              </Flex>
            </MenuItem>
          ) : (
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
            })
          )}
        </MenuList>
      </Menu>
    </>
  );
};

function ConnectWalletWelcomeScreen(props: { theme: "light" | "dark" }) {
  const fontColor = props.theme === "light" ? "black" : "white";
  return (
    <Flex
      h="full"
      backgroundImage={`url("/assets/connect-wallet/welcome-gradient-${props.theme}.png")`}
      backgroundSize="cover"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      flexDirection="column"
      p={6}
    >
      <Flex flexGrow={1} flexDirection="column" justifyContent="center">
        <Box>
          <Flex justifyContent={"center"}>
            <ChakraNextImage
              userSelect="none"
              draggable={false}
              width={200}
              height={150}
              alt=""
              src={require("public/assets/connect-wallet/tw-welcome-icon.svg")}
              mixBlendMode={props.theme === "dark" ? "soft-light" : "initial"}
            />
          </Flex>

          <Spacer h={10} />
          <Heading size="title.sm" color={fontColor} textAlign="center">
            Welcome to thirdweb
          </Heading>
          <Spacer h={4} />
          <Text
            color={fontColor}
            fontSize={16}
            opacity={0.8}
            fontWeight={500}
            textAlign="center"
          >
            Connect your wallet to get started
          </Text>
        </Box>
      </Flex>

      <TrackedLink
        textAlign="center"
        category="custom-connect-wallet"
        label="new-to-wallets"
        href="https://blog.thirdweb.com/web3-wallet/"
        isExternal
        fontWeight={500}
        fontSize={16}
        color={fontColor}
        opacity={0.7}
        _hover={{
          opacity: 1,
          textDecoration: "none",
        }}
      >
        New to Wallets?
      </TrackedLink>
    </Flex>
  );
}
