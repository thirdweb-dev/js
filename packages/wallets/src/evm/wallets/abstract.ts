import { EVMWallet } from "../interfaces";
import type { Signer } from "ethers";
import { providers, Contract, utils, Bytes, BigNumber } from "ethers";
import EventEmitter from "eventemitter3";
import { Ecosystem, GenericAuthWallet } from "../../core/interfaces/auth";
import {
  NATIVE_TOKEN_ADDRESS,
  Price,
  TransactionResult,
  fetchCurrencyValue,
  isNativeToken,
  normalizePriceValue,
} from "@thirdweb-dev/sdk";
import { createErc20 } from "../utils/currency";

// TODO improve this
function chainIdToThirdwebRpc(chainId: number, clientId?: string) {
  return `https://${chainId}.rpc.thirdweb.com${clientId ? `/${clientId}` : ""}${
    typeof globalThis !== "undefined" && "APP_BUNDLE_ID" in globalThis
      ? `?bundleId=${(globalThis as any).APP_BUNDLE_ID as string}`
      : ""
  }`;
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
  display_uri(uri: string): void;
  wc_session_request_sent(): void;
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
  //TODO:  A provider should be passed in instead of creating a new one here.
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
   * @returns The account address from connected wallet
   */
  public async getAddress(): Promise<string> {
    const signer = await this.getSigner();
    return signer.getAddress();
  }

  /**
   * @returns The native token balance of the connected wallet
   */
  public async getBalance(currencyAddress: string = NATIVE_TOKEN_ADDRESS) {
    const signer = await this.getSigner();
    const address = await this.getAddress();

    if (!signer.provider) {
      throw new Error("Please connect a provider");
    }

    let balance: BigNumber;
    if (isNativeToken(currencyAddress)) {
      balance = await signer.provider.getBalance(address);
    } else {
      const erc20 = createErc20(signer, currencyAddress);
      balance = await erc20.balanceOf(address);
    }

    // Note: assumes that the native currency decimals is 18, which isn't always correct
    return await fetchCurrencyValue(signer.provider, currencyAddress, balance);
  }

  /**
   * @returns The chain id from connected wallet
   */
  public async getChainId(): Promise<number> {
    const signer = await this.getSigner();
    return signer.getChainId();
  }

  public async transfer(
    to: string,
    amount: Price,
    currencyAddress: string = NATIVE_TOKEN_ADDRESS,
  ): Promise<TransactionResult> {
    const signer = await this.getSigner();
    const from = await this.getAddress();

    if (!signer.provider) {
      throw new Error("Please connect a provider");
    }

    const value = await normalizePriceValue(
      signer.provider,
      amount,
      currencyAddress,
    );

    if (isNativeToken(currencyAddress)) {
      const tx = await signer.sendTransaction({
        from,
        to,
        value,
      });
      return { receipt: await tx.wait() };
    } else {
      const erc20 = createErc20(signer, currencyAddress);
      const tx = await erc20.transfer(to, value);
      return { receipt: await tx.wait() };
    }
  }

  /**
   * @returns The signature of the message
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
