import { useThirdwebAuthConfig } from "../../contexts/thirdweb-auth";
import { useBalance } from "../../hooks/async/wallet";
import { LoginConfig, useAuth } from "../../hooks/auth";
import { useMetamask } from "../../hooks/connectors/useMetamask";
import { useAddress } from "../../hooks/useAddress";
import { useChainId } from "../../hooks/useChainId";
import { useConnect } from "../../hooks/useConnect";
import { useDisconnect } from "../../hooks/useDisconnect";
import { useNetwork } from "../../hooks/useNetwork";
import { Portal } from "../../lib/portal";
import { shortenIfAddress } from "../../utils/addresses";
import { useClipboard } from "../hooks/useCopyClipboard";
import { useIsMounted } from "../hooks/useIsMounted";
import { Box } from "../shared/Box";
import { Button } from "../shared/Button";
import { Icon } from "../shared/Icon";
import { chainLogos } from "../shared/Icon/icons/chain-logos";
import { Menu, MenuItem } from "../shared/Menu";
import { Spinner } from "../shared/Spinner";
import { ThemeProvider, ThemeProviderProps } from "../shared/ThemeProvider";
import { fontFamily } from "../theme";
import { SupportedNetworkSelect } from "./NetworkSelect";
import { ChainId, LoginOptions, SUPPORTED_CHAIN_ID } from "@thirdweb-dev/sdk";
import * as menu from "@zag-js/menu";
import { normalizeProps, useMachine } from "@zag-js/react";
import React, { useId, useMemo } from "react";
import {
  FiCheck,
  FiChevronDown,
  FiCopy,
  FiLock,
  FiShuffle,
  FiWifi,
  FiXCircle,
} from "react-icons/fi";
import { Connector } from "wagmi";

const SUPPORTED_CONNECTORS = [
  "injected",
  "walletConnect",
  "coinbasewallet",
] as const;

function getIconForConnector(connector: Connector) {
  if (connector.name.toLowerCase().includes("coinbase")) {
    return <Icon boxSize="1.5em" name="coinbaseWallet" />;
  }
  if (connector.name.toLocaleLowerCase().includes("metamask")) {
    return <Icon boxSize="1.5em" name="metamask" />;
  }
  const id = connector.id as typeof SUPPORTED_CONNECTORS[number];
  switch (id) {
    case "injected":
      return <Icon boxSize="1.5em" name="metamask" />;
    case "walletConnect":
      return <Icon boxSize="1.5em" name="walletConnect" />;
    case "coinbasewallet":
      return <Icon boxSize="1.5em" name="coinbaseWallet" />;
    default:
      throw new Error("unsupported connector");
  }
}

interface ConnectWalletProps extends ThemeProviderProps {
  auth?: {
    loginOptions?: LoginOptions;
    loginConfig?: LoginConfig;
    loginOptional?: boolean;
  };
}

let connecting = false;
let switchingNetwork = false;
let authing = false;
let switchingWallet = false;

const chainIdToCurrencyMap: Record<
  SUPPORTED_CHAIN_ID,
  keyof typeof chainLogos
> = {
  [ChainId.Mainnet]: "ethereum",
  [ChainId.Goerli]: "ethereum",
  [ChainId.Rinkeby]: "ethereum",

  [ChainId.Arbitrum]: "arbitrum",
  [ChainId.ArbitrumTestnet]: "arbitrum",

  [ChainId.Avalanche]: "avalanche",
  [ChainId.AvalancheFujiTestnet]: "avalanche",

  [ChainId.Fantom]: "fantom",
  [ChainId.FantomTestnet]: "fantom",

  [ChainId.Optimism]: "optimism",
  [ChainId.OptimismTestnet]: "optimism",

  [ChainId.Polygon]: "polygon",
  [ChainId.Mumbai]: "polygon",
};

/**
 * A component that allows the user to connect their wallet.
 *
 * The button has to be wrapped in a `ThirdwebProvider` in order to function.
 *
 * @example
 * ```javascript
 * import { ConnectWallet } from '@thirdweb-dev/react';
 *
 * const App = () => {
 *  return (
 *   <div>
 *     <ConnectWallet />
 *   </div>
 * )
 * }
 * ```
 *
 *
 * @beta
 */
export const ConnectWallet: React.FC<ConnectWalletProps> = ({
  auth,
  ...themeProps
}) => {
  const id = useId();
  const isMounted = useIsMounted();
  const address = useAddress();

  const mountedAddress = useMemo(() => {
    return isMounted ? address : null;
  }, [address, isMounted]);

  const [state, send] = useMachine(
    menu.machine({
      id,
      closeOnSelect: true,
      positioning: {
        sameWidth: true,
      },
    }),
  );

  const api = menu.connect(state, send, normalizeProps);

  const [
    {
      data: { connectors, connector },
    },
    connect,
  ] = useConnect();
  const disconnect = useDisconnect({ reconnectAfterGnosis: false });

  const supportedConnectors = connectors.filter((c) =>
    SUPPORTED_CONNECTORS.includes(c.id as typeof SUPPORTED_CONNECTORS[number]),
  );

  const [network, switchNetwork] = useNetwork();
  const chainId = useChainId();

  const connectWithMetamask = useMetamask();

  const balanceQuery = useBalance();

  const { onCopy, hasCopied } = useClipboard(mountedAddress || "");

  const authConfig = useThirdwebAuthConfig();
  const { user, isLoading, login, logout } = useAuth(auth?.loginConfig);

  const requiresSignIn = auth?.loginOptional
    ? false
    : !!authConfig?.authUrl && !!mountedAddress && !user?.address;

  return (
    <ThemeProvider {...themeProps}>
      <div
        style={{
          position: "relative",
        }}
      >
        <Button
          style={{ height: "50px", minWidth: "200px" }}
          onClick={async (e) => {
            if (requiresSignIn) {
              e.preventDefault();
              e.stopPropagation();
              authing = true;
              try {
                await login(auth?.loginOptions);
              } catch (err) {
                console.error("failed to log in", err);
              }
              authing = false;
            }
          }}
          {...(requiresSignIn ? {} : api.triggerProps)}
          leftElement={
            requiresSignIn ? (
              isLoading ? (
                <Spinner />
              ) : (
                <FiLock />
              )
            ) : mountedAddress && chainId && chainId in chainIdToCurrencyMap ? (
              <Icon
                boxSize="1.5em"
                name={chainIdToCurrencyMap[chainId as SUPPORTED_CHAIN_ID]}
              />
            ) : undefined
          }
          rightElement={
            requiresSignIn ? undefined : (
              <>
                {connector && getIconForConnector(connector)}
                <FiChevronDown
                  style={{
                    transition: "transform 150ms ease",
                    transform: `rotate(${api.isOpen ? "-180deg" : "0deg"})`,
                  }}
                />
              </>
            )
          }
        >
          {mountedAddress ? (
            requiresSignIn ? (
              <span style={{ whiteSpace: "nowrap" }}>Sign in</span>
            ) : (
              <span
                style={{
                  display: "flex",
                  flexDirection: "column",
                  fontWeight: 400,
                  alignItems: "flex-start",
                  fontSize: "0.8em",
                }}
              >
                <span style={{ whiteSpace: "nowrap", fontWeight: 500 }}>
                  {balanceQuery.isLoading ? (
                    "Loading..."
                  ) : (
                    <>
                      {balanceQuery.data?.displayValue.slice(0, 5)}{" "}
                      {balanceQuery.data?.symbol}
                    </>
                  )}
                </span>
                <span style={{ fontSize: "0.9em" }}>
                  {shortenIfAddress(mountedAddress)}
                </span>
              </span>
            )
          ) : (
            <span style={{ whiteSpace: "nowrap" }}>Connect Wallet</span>
          )}
        </Button>

        <Portal>
          <Box
            {...api.positionerProps}
            style={{
              zIndex: 9999,
              fontFamily,
            }}
          >
            <Menu {...api.contentProps}>
              {!api.isOpen ? null : mountedAddress ? (
                <>
                  {authConfig?.authUrl && !user?.address && !requiresSignIn ? (
                    <MenuItem
                      {...api.getItemProps({
                        id: "auth",
                        closeOnSelect: false,
                      })}
                      leftElement={isLoading ? <Spinner /> : <FiLock />}
                      onClick={async () => {
                        if (isLoading || authing || user?.address) {
                          return;
                        }
                        authing = true;
                        try {
                          await login(auth?.loginOptions);
                        } catch (err) {
                          console.error("failed to log in", err);
                        }
                        authing = false;
                      }}
                    >
                      Sign in
                    </MenuItem>
                  ) : null}
                  <MenuItem
                    {...api.getItemProps({ id: "copy", closeOnSelect: false })}
                    leftElement={
                      hasCopied ? (
                        <FiCheck width="1em" height="1em" color="#57ab5a" />
                      ) : (
                        <FiCopy width="1em" height="1em" />
                      )
                    }
                    onClick={() => {
                      onCopy();
                    }}
                  >
                    Copy address
                  </MenuItem>
                  <MenuItem
                    {...api.getItemProps({
                      id: "switch-network",
                      closeOnSelect: false,
                      disabled: !switchNetwork,
                    })}
                    isSelectable={false}
                    leftElement={
                      network.loading ? (
                        <Spinner />
                      ) : network.error ? (
                        <FiWifi color="#e5534b" width="1em" height="1em" />
                      ) : (
                        <FiWifi width="1em" height="1em" />
                      )
                    }
                  >
                    <SupportedNetworkSelect
                      value={chainId}
                      disabled={!switchNetwork}
                      onChange={async (e) => {
                        if (!switchingNetwork && switchNetwork) {
                          switchingNetwork = true;
                          const number = parseInt(e.target.value);
                          try {
                            await switchNetwork(number);
                          } catch (err) {
                            console.error("failed to switch network", err);
                          } finally {
                            switchingNetwork = false;
                          }
                        }
                      }}
                    />
                  </MenuItem>
                  {/* allow switching wallets for metamask */}
                  {connector &&
                  connector.name === "MetaMask" &&
                  connector.id === "injected" ? (
                    <MenuItem
                      {...api.getItemProps({
                        id: "switch-wallet",
                      })}
                      leftElement={<FiShuffle width="1em" height="1em" />}
                      onClick={async () => {
                        if (switchingWallet) {
                          return;
                        }
                        switchingWallet = true;
                        try {
                          await connector.getProvider().request({
                            method: "wallet_requestPermissions",
                            params: [{ eth_accounts: {} }],
                          });
                          api.close();
                        } catch (err) {
                          console.error("failed to switch wallets", err);
                        }
                        switchingWallet = false;
                      }}
                    >
                      Switch Account
                    </MenuItem>
                  ) : null}

                  <MenuItem
                    {...api.getItemProps({
                      id: "disconnect",
                    })}
                    leftElement={<FiXCircle width="1em" height="1em" />}
                    onClick={() => {
                      disconnect();
                      if (authConfig?.authUrl) {
                        logout();
                      }
                      api.close();
                    }}
                  >
                    Disconnect
                  </MenuItem>
                </>
              ) : (
                <>
                  <MenuItem
                    {...api.getItemProps({
                      id: "metamask",
                    })}
                    onClick={async () => {
                      if (!connecting) {
                        connecting = true;
                        await connectWithMetamask();
                        connecting = false;
                        api.close();
                      }
                    }}
                    leftElement={<Icon boxSize="1.5em" name="metamask" />}
                  >
                    MetaMask
                  </MenuItem>
                  {supportedConnectors
                    .filter((c) => c.name !== "MetaMask")
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((c) => {
                      if (!c.ready) {
                        return null;
                      }
                      return (
                        <MenuItem
                          key={c.id}
                          {...api.getItemProps({
                            id: c.id,
                          })}
                          onClick={async () => {
                            if (!connecting) {
                              connecting = true;
                              await connect(c);
                              connecting = false;
                              api.close();
                            }
                          }}
                          leftElement={getIconForConnector(c)}
                        >
                          {c.name}
                        </MenuItem>
                      );
                    })}
                </>
              )}
            </Menu>
          </Box>
        </Portal>
      </div>
    </ThemeProvider>
  );
};
