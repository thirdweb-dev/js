import { ConnectParams, TWConnector } from "../../interfaces/tw-connector";
import type { SafeConnectionArgs } from "./types";
import { ethers } from "ethers";
import type { Signer } from "ethers";
import {
  SafeService,
  SafeEthersSigner,
} from "@safe-global/safe-ethers-adapters";
import safeCoreSdk from "@safe-global/safe-core-sdk";
import safeEthersLib from "@safe-global/safe-ethers-lib";
import { EVMWallet } from "../../interfaces";

// excerpt from https://docs.gnosis-safe.io/backend/available-services
const CHAIN_ID_TO_GNOSIS_SERVER_URL = {
  // mainnet
  1: "https://safe-transaction-mainnet.safe.global",
  // avalanche
  43114: "https://safe-transaction-avalanche.safe.global",
  // polygon
  137: "https://safe-transaction-polygon.safe.global",
  // goerli
  5: "https://safe-transaction-goerli.safe.global",
  // bsc
  56: "https://safe-transaction-bsc.safe.global",
  // optimism
  10: "https://safe-transaction-optimism.safe.global",
} as const;

const __IS_SERVER__ = typeof window === "undefined";

export const SafeSupportedChainsSet = new Set(
  Object.keys(CHAIN_ID_TO_GNOSIS_SERVER_URL).map(Number),
);

export class SafeConnector extends TWConnector<SafeConnectionArgs> {
  static supportedChains = Object.keys(CHAIN_ID_TO_GNOSIS_SERVER_URL);
  public supportedChains = SafeConnector.supportedChains;
  readonly id = "safe-wallet";
  ready = !__IS_SERVER__;
  name = "Safe Wallet";
  // config
  public previousConnector?: EVMWallet;
  // private options: SafeOptions;
  private safeSigner?: Signer;
  personalWallet?: EVMWallet;

  constructor() {
    super();
    // this.options = options;

    if (!__IS_SERVER__) {
      this.ready = true;
    }
  }

  async connect(args: ConnectParams<SafeConnectionArgs>) {
    if (!(args.chain.chainId in CHAIN_ID_TO_GNOSIS_SERVER_URL)) {
      throw new Error("Chain not supported by Safe");
    }
    this.safeSigner = await this.createSafeSigner(args);

    return await this.getAddress();
  }

  private async createSafeSigner(params: SafeConnectionArgs) {
    this.personalWallet = params.personalWallet;
    const signer = await params.personalWallet.getSigner();
    const safeAddress = params.safeAddress;
    const safeChainId = params.chain
      .chainId as keyof typeof CHAIN_ID_TO_GNOSIS_SERVER_URL;
    if (!signer) {
      throw new Error(
        "cannot create Gnosis Safe signer without a personal signer",
      );
    }

    const signerChainId = await signer.getChainId();

    if (signerChainId !== safeChainId) {
      throw new Error("chainId of personal signer has to match safe chainId");
    }

    if (!safeAddress) {
      throw new Error("safeAddress is required");
    }
    if (!safeChainId) {
      throw new Error("safeChainId is required");
    }

    const serverUrl = CHAIN_ID_TO_GNOSIS_SERVER_URL[safeChainId];

    if (!serverUrl) {
      throw new Error("Chain not supported");
    }

    const ethAdapter = new safeEthersLib({
      ethers,
      signerOrProvider: signer,
    });

    const safe = await safeCoreSdk.create({
      ethAdapter: ethAdapter as any,
      safeAddress,
    });
    const service = new SafeService(serverUrl);
    const safeSigner = new SafeEthersSigner(
      safe as any,
      service,
      signer.provider,
    );

    // See this test for more details:
    // https://github.com/safe-global/safe-contracts/blob/9d188d3ef514fb7391466a6b5f010db4cc0f3c8b/test/handlers/CompatibilityFallbackHandler.spec.ts#L86-L94
    safeSigner.signMessage = async (message: string | ethers.utils.Bytes) => {
      const EIP712_SAFE_MESSAGE_TYPE = {
        SafeMessage: [{ type: "bytes", name: "message" }],
      };

      const encodedMessage = ethers.utils._TypedDataEncoder.hash(
        { verifyingContract: safeAddress, chainId: await this.getChainId() },
        EIP712_SAFE_MESSAGE_TYPE,
        { message: ethers.utils.hashMessage(message) },
      );

      const safeMessage = ethers.utils.arrayify(encodedMessage);
      const signature = await signer.signMessage(safeMessage);
      return signature.replace(/1b$/, "1f").replace(/1c$/, "20");
    };

    // set the personal signer as "previous connector" so that we can re-connect to it later when disconnecting
    this.previousConnector = params.personalWallet;

    return safeSigner;
  }

  async disconnect(): Promise<void> {
    this.safeSigner = undefined;
    this.previousConnector = undefined;
    return undefined;
  }

  async getAddress(): Promise<string> {
    const signer = await this.getSigner();
    return await signer.getAddress();
  }

  async getChainId(): Promise<number> {
    return (await this.getSigner()).getChainId();
  }

  async getProvider() {
    const provider = (await this.getSigner()).provider;
    if (!provider) {
      throw new Error("No provider available");
    }
    return provider;
  }

  async getSigner(): Promise<Signer> {
    if (!this.safeSigner) {
      throw new Error("not connected - please call connect() first");
    }
    return this.safeSigner;
  }

  async isConnected(): Promise<boolean> {
    try {
      const account = await this.getAddress();
      return !!account;
    } catch {
      return false;
    }
  }

  protected onAccountsChanged(accounts: string[]) {
    if (accounts.length === 0) {
      this.emit("disconnect");
    } else {
      this.emit("change", { account: ethers.utils.getAddress(accounts[0]) });
    }
  }

  protected onDisconnect() {
    this.emit("disconnect");
  }

  switchChain(): Promise<void> {
    throw new Error("Safe connector does not support switching chains");
  }

  updateChains(): void {}

  async setupListeners() {}
}
