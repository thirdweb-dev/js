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
  getDefaultGasOverrides,
  isNativeToken,
  normalizePriceValue,
} from "@thirdweb-dev/sdk";
import { createErc20 } from "../utils/currency";

// TODO improve this
export function chainIdToThirdwebRpc(chainId: number, clientId?: string) {
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
  "function isValidSignature(bytes32 _hash, bytes _signature) public view returns (bytes4)",
];
const EIP1271_MAGICVALUE = "0x1626ba7e";

export async function checkContractWalletSignature(
  message: string,
  signature: string,
  address: string,
  chainId: number,
): Promise<boolean> {
  // TODO: remove below `skipFetchSetup` logic when ethers.js v6 support arrives
  let _skipFetchSetup = false;
  if (
    typeof globalThis !== "undefined" &&
    "TW_SKIP_FETCH_SETUP" in globalThis &&
    typeof (globalThis as any).TW_SKIP_FETCH_SETUP === "boolean"
  ) {
    _skipFetchSetup = (globalThis as any).TW_SKIP_FETCH_SETUP as boolean;
  }

  //TODO: A provider should be passed in instead of creating a new one here.
  const provider = new providers.JsonRpcProvider({
    url: chainIdToThirdwebRpc(chainId),
    skipFetchSetup: _skipFetchSetup,
  });
  const walletContract = new Contract(address, EIP1271_ABI, provider);
  try {
    const res = await walletContract.isValidSignature(
      utils.hashMessage(message),
      signature,
    );
    return res === EIP1271_MAGICVALUE;
  } catch {
    return false;
  }
}
/**
 * The base class for any wallet in the Wallet SDK, including backend wallets. It contains the functionality common to all wallets.
 *
 * This wallet is not meant to be used directly, but instead be extended to [build your own wallet](https://portal.thirdweb.com/wallet-sdk/v2/build)
 *
 * @abstractWallet
 */
export abstract class AbstractWallet
  extends EventEmitter<WalletEvents>
  implements GenericAuthWallet, EVMWallet
{
  /**
   * @internal
   */
  public type: Ecosystem = "evm";

  /**
   * Returns an [ethers Signer](https://docs.ethers.org/v5/api/signer/) object of the connected wallet
   */
  public abstract getSigner(): Promise<Signer>;

  /**
   * Returns the account address of the connected wallet
   */
  public async getAddress(): Promise<string> {
    const signer = await this.getSigner();
    return signer.getAddress();
  }

  /**
   * Returns the balance of the connected wallet for the specified token address. If no token address is specified, it returns the balance of the native token
   *
   * @param tokenAddress - The contract address of the token
   */
  public async getBalance(tokenAddress: string = NATIVE_TOKEN_ADDRESS) {
    const signer = await this.getSigner();
    const address = await this.getAddress();

    if (!signer.provider) {
      throw new Error("Please connect a provider");
    }

    let balance: BigNumber;
    if (isNativeToken(tokenAddress)) {
      balance = await signer.provider.getBalance(address);
    } else {
      const erc20 = createErc20(signer, tokenAddress);
      balance = await erc20.balanceOf(address);
    }

    // Note: assumes that the native currency decimals is 18, which isn't always correct
    return await fetchCurrencyValue(signer.provider, tokenAddress, balance);
  }

  /**
   * Returns the chain id of the network that the wallet is connected to
   */
  public async getChainId(): Promise<number> {
    const signer = await this.getSigner();
    return signer.getChainId();
  }

  /**
   * Transfers some amount of tokens to the specified address
   * @param to - The address to transfer the amount to
   * @param amount - The amount to transfer
   * @param currencyAddress - The contract address of the token to transfer. If not specified, it defaults to the native token
   * @returns The transaction result
   */
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
      const gas = getDefaultGasOverrides(signer.provider);
      const tx = await signer.sendTransaction({
        from,
        to,
        value,
        ...gas,
      });
      return { receipt: await tx.wait() };
    } else {
      const erc20 = createErc20(signer, currencyAddress);
      const tx = await erc20.transfer(to, value);
      return { receipt: await tx.wait() };
    }
  }

  /**
   * Sign a message with the connected wallet and return the signature
   * @param message - The message to sign
   * @returns - The signature
   */
  public async signMessage(message: Bytes | string): Promise<string> {
    const signer = await this.getSigner();
    return await signer.signMessage(message);
  }

  /**
   * Verify the signature of a message. It returns `true` if the signature is valid, `false` otherwise
   * @param message - The message to verify
   * @param signature - The signature to verify
   * @param address - The address to verify the signature against
   * @param chainId - The chain id of the network to verify the signature against, If not specified, it defaults to 1 ( Ethereum mainnet )
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
