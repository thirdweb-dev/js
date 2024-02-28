import { ConnectParams, Connector } from "../../interfaces/connector";
import type {
  SafeConnectionArgs,
  SafeSupportedChains as _SafeSupportedChains,
} from "./types";
import {
  SafeService,
  SafeEthersSigner,
} from "@safe-global/safe-ethers-adapters";
import safeCoreSdk from "@safe-global/safe-core-sdk";
import safeEthersLib from "@safe-global/safe-ethers-lib";
import { EVMWallet } from "../../interfaces";
import { CHAIN_ID_TO_GNOSIS_SERVER_URL } from "./constants";
import { ethers, TypedDataDomain, type Signer, TypedDataField } from "ethers";

export type SafeSupportedChains = _SafeSupportedChains;

const CHAIN_ID_TO_SIGN_MESSAGE_LIB_ADDRESS: Record<
  SafeSupportedChains,
  string
> = {
  // mainnet
  1: "0xA65387F16B013cf2Af4605Ad8aA5ec25a2cbA3a2",
  // polygon
  137: "0xA65387F16B013cf2Af4605Ad8aA5ec25a2cbA3a2",
  // bsc
  56: "0xA65387F16B013cf2Af4605Ad8aA5ec25a2cbA3a2",
  // arbitrum
  42161: "0xA65387F16B013cf2Af4605Ad8aA5ec25a2cbA3a2",
  // aurora
  1313161554: "0xA65387F16B013cf2Af4605Ad8aA5ec25a2cbA3a2",
  // avalanche
  43114: "0x98FFBBF51bb33A056B08ddf711f289936AafF717",
  // optimism
  10: "0x98FFBBF51bb33A056B08ddf711f289936AafF717",
  // celo
  42220: "0x98FFBBF51bb33A056B08ddf711f289936AafF717",
  // gnosis chain - https://docs.safe.global/smart-account-supported-networks/v1.3.0#gnosis
  100: "0xA65387F16B013cf2Af4605Ad8aA5ec25a2cbA3a2",
  // Sepolia - https://docs.safe.global/smart-account-supported-networks/v1.3.0#sepolia
  11155111: "0x98FFBBF51bb33A056B08ddf711f289936AafF717",
  // base mainnet - https://docs.safe.global/smart-account-supported-networks/v1.3.0#base
  8453: "0x98FFBBF51bb33A056B08ddf711f289936AafF717",
  // Polygon zkEVM - https://docs.safe.global/smart-account-supported-networks/v1.3.0#polygon-zkevm
  1101: "0xA65387F16B013cf2Af4605Ad8aA5ec25a2cbA3a2",
  // ZkSync Mainnet - https://docs.safe.global/smart-account-supported-networks/v1.3.0#zksync-mainnet
  324: "0x357147caf9C0cCa67DfA0CF5369318d8193c8407",
};

const SIGN_MESSAGE_LIB_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "msgHash",
        type: "bytes32",
      },
    ],
    name: "SignMsg",
    type: "event",
  },
  {
    inputs: [{ internalType: "bytes", name: "message", type: "bytes" }],
    name: "getMessageHash",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes", name: "_data", type: "bytes" }],
    name: "signMessage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const __IS_SERVER__ = typeof window === "undefined";

export class SafeConnector extends Connector<SafeConnectionArgs> {
  static supportedChains = /* @__PURE__ */ (() =>
    Object.keys(CHAIN_ID_TO_GNOSIS_SERVER_URL))();

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
    const safeChainId = params.chain.chainId as SafeSupportedChains;

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
    const signMessageLibAddress =
      CHAIN_ID_TO_SIGN_MESSAGE_LIB_ADDRESS[safeChainId];

    if (!serverUrl || !signMessageLibAddress) {
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

    safeSigner.signMessage = async (message: string | ethers.utils.Bytes) => {
      // Encode the request to the signMessage function of the SafeMessageLib
      const contract = new ethers.BaseContract(
        signMessageLibAddress,
        SIGN_MESSAGE_LIB_ABI,
      );
      const data = contract.interface.encodeFunctionData("signMessage", [
        ethers.utils.hashMessage(message),
      ]);

      const to = signMessageLibAddress;
      const value = "0";
      const operation = 1; // 1 indicates a delegatecall
      const safeTxGas = 50000;
      const baseGas = 50000;
      const gasPrice = 0;
      const gasToken = ethers.constants.AddressZero;
      const refundReceiver = ethers.constants.AddressZero;

      // Create the safe transaction to approve the signature
      const safeTx = await safe.createTransaction({
        safeTransactionData: {
          to,
          value,
          operation,
          data,
          baseGas,
          safeTxGas,
          gasPrice,
          gasToken,
          refundReceiver,
        },
      });

      // Sign and propose the safe transaction
      const safeTxHash = await safe.getTransactionHash(safeTx);
      const safeSignature = await safe.signTransactionHash(safeTxHash);
      await service.proposeTx(
        safe.getAddress(),
        safeTxHash,
        safeTx,
        safeSignature,
      );

      // Poll while we wait for the safe transaction to reach minimum confirmations
      while (true) {
        try {
          const txDetails = await service.getSafeTxDetails(safeTxHash);
          if (txDetails.transactionHash) {
            await signer.provider?.waitForTransaction(
              txDetails.transactionHash,
            );
            break;
          }
        } catch (e) {}
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }

      // For on-chain signatures, safe expects just "0x" as the signature
      return "0x";
    };

    // Need to add this because ethers-aws-kms-signer doesn't support
    safeSigner._signTypedData = async function (
      domain: TypedDataDomain,
      types: Record<string, Array<TypedDataField>>,
      _value: Record<string, any>,
    ) {
      const valueHash = ethers.utils._TypedDataEncoder.hash(
        domain,
        types,
        _value,
      );

      const to = signMessageLibAddress;
      const value = "0";
      const operation = 1; // 1 indicates a delegatecall
      const safeTxGas = 50000;
      const baseGas = 50000;
      const gasPrice = 0;
      const gasToken = ethers.constants.AddressZero;
      const refundReceiver = ethers.constants.AddressZero;

      // Create the safe transaction to approve the signature
      const safeTx = await safe.createTransaction({
        safeTransactionData: {
          to,
          value,
          operation,
          data: valueHash,
          baseGas,
          safeTxGas,
          gasPrice,
          gasToken,
          refundReceiver,
        },
      });

      // Sign and propose the safe transaction
      const safeTxHash = await safe.getTransactionHash(safeTx);
      const safeSignature = await safe.signTypedData(safeTx);
      await service.proposeTx(
        safe.getAddress(),
        safeTxHash,
        safeTx,
        safeSignature,
      );

      // Poll while we wait for the safe transaction to reach minimum confirmations
      while (true) {
        try {
          const txDetails = await service.getSafeTxDetails(safeTxHash);
          if (txDetails.transactionHash) {
            await signer.provider?.waitForTransaction(
              txDetails.transactionHash,
            );
            break;
          }
        } catch (e) {}
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }

      // For on-chain signatures, safe expects just "0x" as the signature
      return "0x";
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
    } catch (e) {
      return false;
    }
  }

  protected onAccountsChanged(accounts: string[]) {
    if (accounts.length === 0) {
      this.emit("disconnect");
    } else {
      if (accounts[0]) {
        this.emit("change", { account: ethers.utils.getAddress(accounts[0]) });
      }
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
