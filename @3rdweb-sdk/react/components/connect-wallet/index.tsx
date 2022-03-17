import { useWeb3 } from "@3rdweb-sdk/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  ButtonProps,
  Flex,
  Icon,
  Image,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Skeleton,
  Text,
  useClipboard,
} from "@chakra-ui/react";
import { useConnect, useDisconnect } from "@thirdweb-dev/react";
import { Button } from "components/buttons/Button";
import React from "react";
import { AiOutlineDisconnect } from "react-icons/ai";
import { FiCheck } from "react-icons/fi";
import { ImCopy } from "react-icons/im";
import { shortenIfAddress } from "utils/usedapp-external";

const connectorIdToImageUrl: Record<string, string> = {
  MetaMask: "https://thirdweb.com/logos/metamask-fox.svg",
  WalletConnect: "https://thirdweb.com/logos/walletconnect-logo.svg",
  "Coinbase Wallet": "https://thirdweb.com/logos/coinbase-wallet-logo.svg",
};
export const ConnectWallet: React.FC<ButtonProps> = (buttonProps) => {
  const [connector, connect] = useConnect();
  const { balance, address, chainId, getNetworkMetadata } = useWeb3();
  const disconnect = useDisconnect();

  const { hasCopied, onCopy } = useClipboard(address || "");

  if (address && chainId) {
    const SVG = getNetworkMetadata(chainId).icon;
    return (
      <Menu matchWidth isLazy>
        <MenuButton
          as={Button}
          {...buttonProps}
          variant="outline"
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
          </Flex>
        </MenuButton>
        <MenuList borderRadius="lg">
          <MenuItem
            closeOnSelect={false}
            icon={
              <Icon
                color={hasCopied ? "green.500" : undefined}
                as={hasCopied ? FiCheck : ImCopy}
              />
            }
            onClick={onCopy}
          >
            <Text size="label.md">Copy wallet address</Text>
          </MenuItem>
          <MenuDivider my={0} />
          <MenuItem icon={<AiOutlineDisconnect />} onClick={disconnect}>
            <Text size="label.md">Disconnect Wallet</Text>
          </MenuItem>
        </MenuList>
      </Menu>
    );
  }

  return (
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
        {connector.data.connectors.map((_connector) => {
          if (!_connector.ready) {
            return null;
          }

          return (
            <MenuItem
              key={_connector.name}
              icon={
                <Image
                  maxWidth={4}
                  src={connectorIdToImageUrl[_connector.name]}
                  alt=""
                />
              }
              onClick={() => connect(_connector)}
            >
              <Text size="label.md">{_connector.name}</Text>
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
};
