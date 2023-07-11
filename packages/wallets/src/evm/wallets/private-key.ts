import { AbstractWallet } from "./abstract";
import { ethers } from "ethers";
import { ChainOrRpcUrl, getChainProvider } from "@thirdweb-dev/sdk";

export class PrivateKeyWallet extends AbstractWallet {
  #signer: ethers.Signer;
  constructor(
    privateKey: string,
    chain?: ChainOrRpcUrl,
    apiKey?: string,
    /**
     * @deprecated Use `apiKey` instead
     */
    thirdwebApiKey?: string,
  ) {
    super();

    if (!apiKey && thirdwebApiKey) {
      apiKey = thirdwebApiKey;
    }

    this.#signer = new ethers.Wallet(
      privateKey,
      chain
        ? getChainProvider(chain, {
            apiKey: apiKey,
          })
        : undefined,
    );
  }

  async getSigner(): Promise<ethers.Signer> {
    return this.#signer;
  }
}
