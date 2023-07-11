import { AbstractWallet } from "./abstract";
import { ethers } from "ethers";
import { ChainOrRpcUrl, getChainProvider } from "@thirdweb-dev/sdk";

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
            thirdwebApiKey: thirdwebApiKey,
          })
        : undefined,
    );
  }

  async getSigner(): Promise<ethers.Signer> {
    return this.#signer;
  }
}
