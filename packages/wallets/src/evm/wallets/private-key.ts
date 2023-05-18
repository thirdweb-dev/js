import { AbstractWallet } from "./abstract";
import { ethers } from "ethers";
import { ChainOrRpcUrl, getChainProvider } from "@thirdweb-dev/sdk";
import { DEFAULT_WALLET_API_KEY } from "../constants/keys";

export class PrivateKeyWallet extends AbstractWallet {
  #signer: ethers.Signer;
  constructor(
    privateKey: string,
    chain?: ChainOrRpcUrl,
    thirdwebApiKey?: string,
  ) {
    super();
    this.#signer = new ethers.Wallet(
      privateKey,
      chain
        ? getChainProvider(chain, {
            thirdwebApiKey: thirdwebApiKey || DEFAULT_WALLET_API_KEY,
          })
        : undefined,
    );
  }

  async getSigner(): Promise<ethers.Signer> {
    return this.#signer;
  }
}
