import { ethers, BigNumber, BigNumberish, providers } from "ethers";
import {
  EntryPoint,
  EntryPoint__factory,
  UserOperationStruct,
} from "@account-abstraction/contracts";

import { TransactionDetailsForUserOp } from "./transaction-details";
import { getUserOpHashV06 } from "./utils";
import {
  CeloAlfajoresTestnet,
  CeloBaklavaTestnet,
  Celo,
} from "@thirdweb-dev/chains";
import { Transaction, getDynamicFeeData } from "@thirdweb-dev/sdk";
import { HttpRpcClient } from "./http-rpc-client";
import type { BaseApiParams, BatchData, PaymasterAPI } from "../types";

const DUMMY_SIGNATURE =
  "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c";

/**
 * Base class for all Smart Wallet ERC-4337 Clients to implement.
 * Subclass should inherit 5 methods to support a specific wallet contract:
 *
 * - getAccountInitCode - return the value to put into the "initCode" field, if the account is not yet deployed. should create the account instance using a factory contract.
 * - getNonce - return current account's nonce value
 * - encodeExecute - encode the call from entryPoint through our account to the target contract.
 * - signUserOpHash - sign the hash of a UserOp.
 *
 * The user can use the following APIs:
 * - createUnsignedUserOp - given "target" and "calldata", fill userOp to perform that operation from the account.
 * - createSignedUserOp - helper to call the above createUnsignedUserOp, and then extract the userOpHash and sign it
 */
export abstract class BaseAccountAPI {
  private senderAddress!: string;
  private isPhantom = true;
  // entryPoint connected to "zero" address. allowed to make static calls (e.g. to getSenderAddress)
  private readonly entryPointView: EntryPoint;

  provider: providers.Provider;
  entryPointAddress: string;
  accountAddress?: string;
  paymasterAPI?: PaymasterAPI;

  /**
   * base constructor.
   * subclass SHOULD add parameters that define the owner (signer) of this wallet
   */
  protected constructor(params: BaseApiParams) {
    this.provider = params.provider;
    this.entryPointAddress = params.entryPointAddress;
    this.accountAddress = params.accountAddress;
    this.paymasterAPI = params.paymasterAPI;

    // factory "connect" define the contract address. the contract "connect" defines the "from" address.
    this.entryPointView = EntryPoint__factory.connect(
      params.entryPointAddress,
      params.provider,
    ).connect(ethers.constants.AddressZero);
  }

  /**
   * return the value to put into the "initCode" field, if the contract is not yet deployed.
   * this value holds the "factory" address, followed by this account's information
   */
  abstract getAccountInitCode(): Promise<string>;

  /**
   * return current account's nonce.
   */
  abstract getNonce(): Promise<BigNumber>;

  /**
   * encode the call from entryPoint through our account to the target contract.
   * @param target - the target contract address
   * @param value - the value to send to the target contract
   * @param data - the calldata to send to the target contract
   */
  abstract prepareExecute(
    target: string,
    value: BigNumberish,
    data: string,
  ): Promise<Transaction<any>>;

  /**
   * sign a userOp's hash (userOpHash).
   * @param userOpHash - the hash to sign
   */
  abstract signUserOpHash(userOpHash: string): Promise<string>;

  /**
   * calculate the account address even before it is deployed
   */
  abstract getCounterFactualAddress(): Promise<string>;

  /**
   * check if the contract is already deployed.
   */
  async checkAccountPhantom(): Promise<boolean> {
    if (!this.isPhantom) {
      // already deployed. no need to check anymore.
      return this.isPhantom;
    }
    const senderAddressCode = await this.provider.getCode(
      this.getAccountAddress(),
    );
    if (senderAddressCode.length > 2) {
      this.isPhantom = false;
    }
    return this.isPhantom;
  }

  /**
   * return initCode value to into the UserOp.
   * (either deployment code, or empty hex if contract already deployed)
   */
  async getInitCode(): Promise<string> {
    if (await this.checkAccountPhantom()) {
      return await this.getAccountInitCode();
    }
    return "0x";
  }

  /**
   * return maximum gas used for verification.
   * NOTE: createUnsignedUserOp will add to this value the cost of creation, if the contract is not yet created.
   */
  async getVerificationGasLimit(): Promise<BigNumberish> {
    return 100000;
  }

  /**
   * return userOpHash for signing.
   * This value matches entryPoint.getUserOpHash (calculated off-chain, to avoid a view call)
   * @param userOp - userOperation, (signature field ignored)
   */
  async getUserOpHash(userOp: UserOperationStruct): Promise<string> {
    const chainId = await this.provider.getNetwork().then((net) => net.chainId);
    return getUserOpHashV06(userOp, this.entryPointAddress, chainId);
  }

  /**
   * return the account's address.
   * this value is valid even before deploying the contract.
   */
  async getAccountAddress(): Promise<string> {
    if (!this.senderAddress) {
      if (this.accountAddress) {
        this.senderAddress = this.accountAddress;
      } else {
        this.senderAddress = await this.getCounterFactualAddress();
      }
    }
    return this.senderAddress;
  }

  async estimateCreationGas(initCode?: string): Promise<BigNumberish> {
    if (!initCode || initCode === "0x") {
      return 0;
    }
    const deployerAddress = initCode.substring(0, 42);
    const deployerCallData = "0x" + initCode.substring(42);
    return await this.provider.estimateGas({
      to: deployerAddress,
      data: deployerCallData,
    });
  }

  async createUnsignedUserOp(
    httpRpcClient: HttpRpcClient,
    info: TransactionDetailsForUserOp,
    batchData?: BatchData,
  ): Promise<UserOperationStruct> {
    // construct the userOp without gasLimit or preVerifictaionGas
    const initCode = await this.getInitCode();
    const value = parseNumber(info.value) ?? BigNumber.from(0);
    const callData = batchData
      ? info.data
      : await this.prepareExecute(info.target, value, info.data).then((tx) =>
          tx.encode(),
        );
    let { maxFeePerGas, maxPriorityFeePerGas } = info;
    if (!maxFeePerGas || !maxPriorityFeePerGas) {
      const feeData = await getDynamicFeeData(
        this.provider as providers.JsonRpcProvider,
      );
      if (!maxPriorityFeePerGas) {
        maxPriorityFeePerGas = feeData.maxPriorityFeePerGas ?? undefined;
      }
      if (!maxFeePerGas) {
        maxFeePerGas = feeData.maxFeePerGas ?? undefined;
        const network = await this.provider.getNetwork();
        const chainId = network.chainId;

        if (
          chainId === Celo.chainId ||
          chainId === CeloAlfajoresTestnet.chainId ||
          chainId === CeloBaklavaTestnet.chainId
        ) {
          maxPriorityFeePerGas = maxFeePerGas;
        }
      }
    }
    if (!maxFeePerGas || !maxPriorityFeePerGas) {
      throw new Error(
        "maxFeePerGas or maxPriorityFeePerGas could not be calculated, please pass them explicitely",
      );
    }
    const [sender, nonce] = await Promise.all([
      this.getAccountAddress(),
      info.nonce ? Promise.resolve(info.nonce) : this.getNonce(),
    ]);
    const partialOp: UserOperationStruct = {
      sender,
      nonce,
      initCode,
      callData,
      maxFeePerGas,
      maxPriorityFeePerGas,
      callGasLimit: BigNumber.from(1000000),
      verificationGasLimit: BigNumber.from(1000000),
      preVerificationGas: BigNumber.from(1000000),
      paymasterAndData: "0x",
      signature: DUMMY_SIGNATURE,
    };

    // paymaster data + maybe used for estimation as well
    if (this.paymasterAPI) {
      const paymasterResult = await this.paymasterAPI.getPaymasterAndData(
        partialOp,
      );
      const paymasterAndData = paymasterResult.paymasterAndData;
      if (paymasterAndData && paymasterAndData !== "0x") {
        partialOp.paymasterAndData = paymasterAndData;
      }
      // paymaster can have the gas limits in the response
      if (
        paymasterResult.callGasLimit &&
        paymasterResult.verificationGasLimit &&
        paymasterResult.preVerificationGas
      ) {
        partialOp.callGasLimit = BigNumber.from(paymasterResult.callGasLimit);
        partialOp.verificationGasLimit = BigNumber.from(
          paymasterResult.verificationGasLimit,
        );
        partialOp.preVerificationGas = BigNumber.from(
          paymasterResult.preVerificationGas,
        );
      } else {
        // otherwise fallback to bundler for gas limits
        let estimates;
        try {
          estimates = await httpRpcClient.estimateUserOpGas(partialOp);
        } catch (error: any) {
          throw this.unwrapBundlerError(error);
        }
        partialOp.callGasLimit = BigNumber.from(estimates.callGasLimit);
        partialOp.verificationGasLimit = BigNumber.from(
          estimates.verificationGasLimit,
        );
        partialOp.preVerificationGas = BigNumber.from(
          estimates.preVerificationGas,
        );
        // need paymaster to re-sign after estimates
        const paymasterResult2 = await this.paymasterAPI.getPaymasterAndData(
          partialOp,
        );
        if (
          paymasterResult2.paymasterAndData &&
          paymasterResult2.paymasterAndData !== "0x"
        ) {
          partialOp.paymasterAndData = paymasterResult2.paymasterAndData;
        }
      }
    } else {
      // query bundler for gas limits
      let estimates;
      try {
        estimates = await httpRpcClient.estimateUserOpGas(partialOp);
      } catch (error: any) {
        throw this.unwrapBundlerError(error);
      }

      partialOp.callGasLimit = BigNumber.from(estimates.callGasLimit);
      partialOp.verificationGasLimit = BigNumber.from(
        estimates.verificationGasLimit,
      );
      partialOp.preVerificationGas = BigNumber.from(
        estimates.preVerificationGas,
      );
    }

    return {
      ...partialOp,
      signature: "",
    };
  }

  /**
   * Sign the filled userOp.
   * @param userOp - the UserOperation to sign (with signature field ignored)
   */
  async signUserOp(userOp: UserOperationStruct): Promise<UserOperationStruct> {
    const userOpHash = await this.getUserOpHash(userOp);
    const signature = await this.signUserOpHash(userOpHash);
    return {
      ...userOp,
      signature,
    };
  }

  /**
   * get the transaction that has this userOpHash mined, or null if not found
   * @param userOpHash - returned by sendUserOpToBundler (or by getUserOpHash..)
   * @param timeout - stop waiting after this timeout
   * @param interval - time to wait between polls.
   * @returns The transactionHash this userOp was mined, or null if not found.
   */
  async getUserOpReceipt(
    userOpHash: string,
    timeout = 30000,
    interval = 2000,
  ): Promise<string | null> {
    const endtime = Date.now() + timeout;
    while (Date.now() < endtime) {
      const events = await this.entryPointView.queryFilter(
        this.entryPointView.filters.UserOperationEvent(userOpHash),
      );
      if (events[0]) {
        return events[0].transactionHash;
      }
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
    return null;
  }

  private unwrapBundlerError(error: any) {
    const message =
      error?.error?.message || error.error || error.message || error;
    return new Error(message);
  }
}

function parseNumber(a: any): BigNumber | null {
  if (!a || a === "") {
    return null;
  }
  return BigNumber.from(a.toString());
}
