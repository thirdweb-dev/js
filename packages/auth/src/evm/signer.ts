import { SUPPORTED_CHAIN_ID, supportedChains } from "./evm";
import type { Ecosystem, GenericAuthWallet } from "@thirdweb-dev/wallets";
import { ethers } from "ethers";

const EIP1271_ABI = [
  "function isValidSignature(bytes32 _message, bytes _signature) public view returns (bytes4)",
];
const EIP1271_MAGICVALUE = "0x1626ba7e";

export const checkContractWalletSignature = async (
  message: string,
  signature: string,
  address: string,
  chainId: number,
): Promise<boolean> => {
  const rpcUrl =
    supportedChains[chainId as SUPPORTED_CHAIN_ID]?.rpcUrls.default.http[0];
  if (!rpcUrl) {
    return false;
  }

  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const walletContract = new ethers.Contract(address, EIP1271_ABI, provider);
  const hashMessage = ethers.utils.hashMessage(message);
  try {
    const res = await walletContract.isValidSignature(hashMessage, signature);
    return res === EIP1271_MAGICVALUE;
  } catch {
    return false;
  }
};

export class SignerWallet implements GenericAuthWallet {
  type: Ecosystem = "evm";
  #signer: ethers.Signer;

  constructor(signer: ethers.Signer) {
    this.#signer = signer;
  }

  public async getAddress(): Promise<string> {
    return this.#signer.getAddress();
  }

  public async getChainId(): Promise<number> {
    return this.#signer.getChainId();
  }

  public async signMessage(message: string): Promise<string> {
    return await this.#signer.signMessage(message);
  }

  public async verifySignature(
    message: string,
    signature: string,
    address: string,
    chainId?: number,
  ): Promise<boolean> {
    const messageHash = ethers.utils.hashMessage(message);
    const messageHashBytes = ethers.utils.arrayify(messageHash);
    const recoveredAddress = ethers.utils.recoverAddress(
      messageHashBytes,
      signature,
    );

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
}

export class PrivateKeyWallet extends SignerWallet {
  constructor(privateKey: string) {
    super(new ethers.Wallet(privateKey));
  }
}
