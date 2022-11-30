import type { MetaMaskConnector } from "../connectors/metamask";
import type { WalletConnectConnector } from "../connectors/wallet-connect";
import { isAndroid } from "../utils/isMobile";
import { AbstractWallet, WalletOptions } from "./base";
import { Ethereum } from "@wagmi/core";

function isMetaMask(ethereum: NonNullable<Ethereum>) {
  // Logic borrowed from wagmi's MetaMaskConnector
  // https://github.com/tmm/wagmi/blob/main/packages/core/src/connectors/metaMask.ts
  if (!Boolean(ethereum?.isMetaMask)) {
    return false;
  }

  // Brave tries to make itself look like MetaMask
  // Could also try RPC `web3_clientVersion` if following is unreliable
  if (ethereum.isBraveWallet && !ethereum._events && !ethereum._state) {
    return false;
  }

  if (ethereum.isTokenPocket) {
    return false;
  }

  if (ethereum.isTokenary) {
    return false;
  }

  return true;
}

export class MetaMask extends AbstractWallet {
  #connector?: MetaMaskConnector | WalletConnectConnector;

  static id = "metamask" as const;

  public get walletName() {
    return "MetaMask" as const;
  }

  constructor(options: WalletOptions) {
    super(MetaMask.id, options);
  }

  protected async getConnector(): Promise<
    MetaMaskConnector | WalletConnectConnector
  > {
    if (!this.#connector) {
      const isMetaMaskInjected =
        typeof window !== "undefined" &&
        typeof window.ethereum !== "undefined" &&
        isMetaMask(window.ethereum as Ethereum);

      const shouldUseWalletConnect = !isMetaMaskInjected;

      if (shouldUseWalletConnect) {
        // import the connector dynamically
        const { WalletConnectConnector } = await import(
          "../connectors/wallet-connect"
        );
        this.#connector = new WalletConnectConnector({
          chains: this.chains,
          options: {
            qrcode: false,
            qrcodeModalOptions: { mobileLinks: ["metamask"] },
          },
        });
      } else {
        // import the connector dynamically
        const { MetaMaskConnector } = await import("../connectors/metamask");
        this.#connector = new MetaMaskConnector({
          chains: this.chains,
          options: {
            shimDisconnect: true,
          },
        });
      }
    }
    return this.#connector;
  }

  public override async connect(
    chainId?: number,
  ): Promise<{ address: string; chainId: number } | undefined> {
    const connector = await this.getConnector();

    const getUri = async () => {
      const provider = await connector.getProvider();
      if (!provider || !("connector" in provider)) {
        return undefined;
      }
      const { uri } = provider.connector;

      return isAndroid()
        ? uri
        : `https://metamask.app.link/wc?uri=${encodeURIComponent(uri)}`;
    };

    const uri = await getUri();
    this.setupEventListeners(connector);
    try {
      if (uri) {
        window.open(uri, "_blank");
      } else {
        const res = await connector.connect({ chainId });
        return { address: res.account, chainId: res.chain.id };
      }
    } catch (err) {
      await this.disconnect();
      throw err;
    }
  }
}
