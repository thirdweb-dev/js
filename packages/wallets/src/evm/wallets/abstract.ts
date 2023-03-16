import { Ecosystem, GenericAuthWallet } from "../../core";
import { EVMWallet } from "../interfaces";
import type { Signer } from "ethers";
import { providers, Contract, utils } from "ethers";
import EventEmitter from "eventemitter3";

// TODO improve this
function chainIdToThirdwebRpc(chainId: number) {
  return `https://${chainId}.rpc.thirdweb.com`;
}

export type WalletData = {
  address?: string;
  chainId?: number;
};

export interface WalletEvents {
  connect(data: WalletData): void;
  change(data: WalletData): void;
  message({ type, data }: { type: string; data?: unknown }): void;
  disconnect(): void;
  error(error: Error): void;
  open_wallet(uri?: string): void;
  request(): void;
}

const EIP1271_ABI = [
  "function isValidSignature(bytes32 _message, bytes _signature) public view returns (bytes4)",
];
const EIP1271_MAGICVALUE = "0x1626ba7e";

export async function checkContractWalletSignature(
  message: string,
  signature: string,
  address: string,
  chainId: number,
): Promise<boolean> {
  const provider = new providers.JsonRpcProvider(chainIdToThirdwebRpc(chainId));
  const walletContract = new Contract(address, EIP1271_ABI, provider);
  const _hashMessage = utils.hashMessage(message);
  try {
    const res = await walletContract.isValidSignature(_hashMessage, signature);
    return res === EIP1271_MAGICVALUE;
  } catch {
    return false;
  }
}

export abstract class AbstractWallet
  extends EventEmitter<WalletEvents>
  implements GenericAuthWallet, EVMWallet
{
  public type: Ecosystem = "evm";
  protected signerPromise?: Promise<Signer>;

  public abstract getSigner(): Promise<Signer>;

  /**
   * @returns the account address from connected wallet
   */
  public async getAddress(): Promise<string> {
    const signer = await this.getCachedSigner();
    return signer.getAddress();
  }

  /**
   * @returns the chain id from connected wallet
   */
  public async getChainId(): Promise<number> {
    const signer = await this.getCachedSigner();
    return signer.getChainId();
  }

  /**
   * @returns the signature of the message
   */
  public async signMessage(message: string): Promise<string> {
    const signer = await this.getCachedSigner();
    return await signer.signMessage(message);
  }

  /**
   * verify the signature of a message
   * @returns `true` if the signature is valid, `false` otherwise
   */
  public async verifySignature(
    message: string,
    signature: string,
    address: string,
    chainId?: number,
  ): Promise<boolean> {
    const messageHash = utils.hashMessage(message);
    const messageHashBytes = utils.arrayify(messageHash);
    const recoveredAddress = utils.recoverAddress(messageHashBytes, signature);

    if (recoveredAddress === address) {
      return true;
    }

    // Check if the address is a smart contract wallet
    if (chainId !== undefined) {
      try {
        const isValid = await checkContractWalletSignature(
          message,
          signature,
          address,
          chainId || 1,
        );
        return isValid;
      } catch {
        // no-op
      }
    }

    return false;
  }

  public async getCachedSigner(): Promise<Signer> {
    // if we already have a signer promise, return that
    if (this.signerPromise) {
      return this.signerPromise;
    }

    this.signerPromise = this.getSigner().catch(() => {
      this.signerPromise = undefined;
      throw new Error("Unable to get a signer!");
    });

    return this.signerPromise;
  }
}
