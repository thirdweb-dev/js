import { EVMWallet } from "../interfaces";
import type { Signer } from "ethers";
import { providers, Contract, utils, Bytes } from "ethers";
import EventEmitter from "eventemitter3";
import { Ecosystem, GenericAuthWallet } from "../../core/interfaces/auth";

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

  public abstract getSigner(): Promise<Signer>;

  /**
   * @returns the account address from connected wallet
   */
  public async getAddress(): Promise<string> {
    const signer = await this.getSigner();
    return signer.getAddress();
  }

  /**
   * @returns the chain id from connected wallet
   */
  public async getChainId(): Promise<number> {
    const signer = await this.getSigner();
    return signer.getChainId();
  }

  /**
   * @returns the signature of the message
   */
  public async signMessage(message: Bytes | string): Promise<string> {
    const signer = await this.getSigner();
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
    try {
      const messageHash = utils.hashMessage(message);
      const messageHashBytes = utils.arrayify(messageHash);
      const recoveredAddress = utils.recoverAddress(
        messageHashBytes,
        signature,
      );

      if (recoveredAddress === address) {
        return true;
      }
    } catch {
      // no-op
    }

    // Check if the address is a smart contract wallet
    if (chainId !== undefined) {
      console.log("Checking smart contract wallet...");
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
}
