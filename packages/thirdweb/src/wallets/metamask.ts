import { getAddress, toHex, type Hash } from "viem";
import type { ThirdwebClient } from "../client/client.js";
import type { AbiFunction, Address } from "abitype";
import type { Transaction } from "../transaction/transaction.js";
import type { IWallet } from "./interfaces/wallet.js";
import type { Ethereum } from "./interfaces/ethereum.js";

export function metamaskWallet({ client }: { client: ThirdwebClient }) {
  return new MetamaskWallet(client);
}

type MetamaskWalletConnectOptions = {
  chainId?: number;
};

class MetamaskWallet implements IWallet<MetamaskWalletConnectOptions> {
  private provider?: Ethereum;
  private connectedChainId?: number;
  private connectdAddress?: Address | null;

  private async getAccount() {
    const provider = this.provider;
    if (!provider) {
      throw new Error("not connected");
    }
    const accounts = await provider.request({
      method: "eth_accounts",
    });

    // return checksum address
    return getAddress(accounts[0] as string);
  }

  private async getChainId() {
    const provider = this.provider;
    if (!provider) {
      throw new Error("not connected");
    }
    return provider.request({ method: "eth_chainId" }).then(normalizeChainId);
  }

  private setupListeners() {
    const provider = this.provider;
    if (provider && provider.on) {
      provider.on("accountsChanged", this.onAccountsChanged);
      provider.on("chainChanged", this.onChainChanged);
      provider.on("disconnect", this.onDisconnect);
    }
  }

  private onAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      //disconnected
      this.connectdAddress = null;
    } else {
      // connected as different address
      this.connectdAddress = getAddress(accounts[0] as string);
    }
  };

  private onChainChanged = (chainId: string | number | bigint) => {
    this.connectedChainId = normalizeChainId(chainId);
  };

  private onDisconnect = async (error: { code: number; message: string }) => {
    // We need this as MetaMask can emit the "disconnect" event upon switching chains.
    // If MetaMask emits a `code: 1013` error, wait for reconnection before disconnecting
    // https://github.com/MetaMask/providers/pull/120
    if (error.code === 1013) {
      const provider = this.provider;
      if (provider) {
        try {
          const isAuthorized = await this.getAccount();
          if (isAuthorized) {
            return;
          }
        } catch {
          // If we can't get the account anymore, continue with disconnect
        }
      }
    }
  };

  get address() {
    return this.connectdAddress || null;
  }

  get chainId() {
    return this.connectedChainId || null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(_client: ThirdwebClient) {
    // this.client = client;
  }

  public async connect(options?: MetamaskWalletConnectOptions) {
    if (hasInjectedProvider(globalThis.window)) {
      this.provider = globalThis.window.ethereum;
    } else {
      // TODO implement mobile fallback via wallet connect
      throw new Error("no injected provider detected");
    }

    this.setupListeners();

    // request account addresses from injected provider
    const accountAddresses = await this.provider.request({
      method: "eth_requestAccounts",
    });

    const chainId = await this.getChainId();

    // get the first account address
    this.connectdAddress = getAddress(accountAddresses[0] as string);
    this.connectedChainId = chainId;

    // if chainId is provided, switch to that chain
    if (options?.chainId && this.connectedChainId !== options.chainId) {
      await this.switchChain(options.chainId);
      this.connectedChainId = options.chainId;
    }
    return this;
  }

  async switchChain(chainId: number): Promise<void> {
    const provider = this.provider;
    if (!provider) {
      throw new Error("not connected");
    }

    const chainIdHex = toHex(chainId);

    try {
      // request provider to switch to given chainIdHex
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainIdHex }],
      });
    } catch (error) {
      throw new Error(
        `MetaMask Wallet: Failed to switch chain. ${(error as Error).message}`,
      );
    }
    // TODO handle add chain case
  }

  public async disconnect() {
    // perform cleanup
    const provider = this.provider;

    if (!provider?.removeListener) {
      return;
    }

    provider.removeListener("accountsChanged", this.onAccountsChanged);
    provider.removeListener("chainChanged", this.onChainChanged);
    provider.removeListener("disconnect", this.onDisconnect);
  }

  // sign functions

  // tx functions
  public async sendTransaction<abiFn extends AbiFunction>(
    tx: Transaction<abiFn>,
  ) {
    const provider = this.provider;
    if (!provider || !this.address) {
      throw new Error("not connected");
    }
    // switch chain if tx is on different chain
    if (tx.contract.chainId !== this.connectedChainId) {
      await this.switchChain(tx.contract.chainId);
    }

    const [encode, estimateGas] = await Promise.all([
      import("../transaction/actions/encode.js").then((m) => m.encode),
      import("../transaction/actions/estimate-gas.js").then(
        (m) => m.estimateGas,
      ),
    ]);

    const [encodedData, estimatedGas] = await Promise.all([
      encode(tx),
      estimateGas(tx, { from: this.address }),
    ]);

    const result = await provider.request({
      method: "eth_sendTransaction",
      params: [
        {
          gas: toHex(estimatedGas),
          from: this.address,
          to: tx.contract.address as Address,
          data: encodedData,
        },
      ],
    });

    return result as Hash;
  }
}

// helpers //

interface WindowWithEthereum extends Window {
  ethereum: Ethereum;
}

/**
 * @internal
 */
export function hasInjectedProvider(w: Window): w is WindowWithEthereum {
  return typeof w !== "undefined" && !!w && "ethereum" in w && !!w.ethereum;
}

/**
 * @internal
 */
function normalizeChainId(chainId: string | number | bigint) {
  if (typeof chainId === "string") {
    return Number.parseInt(
      chainId,
      chainId.trim().substring(0, 2) === "0x" ? 16 : 10,
    );
  }
  if (typeof chainId === "bigint") {
    return Number(chainId);
  }
  return chainId;
}
