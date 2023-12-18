import {
  ethers,
  BigNumber,
  BigNumberish,
  providers,
  utils,
  BytesLike,
  constants,
} from "ethers";
import {
  EntryPoint,
  EntryPoint__factory,
  UserOperationStruct,
} from "@account-abstraction/contracts";

import { NotPromise, packUserOp } from "@account-abstraction/utils";
import {
  GasOverheads,
  PaymasterAPI,
  calcPreVerificationGas,
} from "@account-abstraction/sdk";
import { TransactionDetailsForUserOp } from "./transaction-details";
import { getUserOpHashV06 } from "./utils";
import { DUMMY_PAYMASTER_AND_DATA, SIG_SIZE } from "./paymaster";
import {
  CeloAlfajoresTestnet,
  CeloBaklavaTestnet,
  Celo,
} from "@thirdweb-dev/chains";
import { Transaction, getDynamicFeeData } from "@thirdweb-dev/sdk";
import { HttpRpcClient } from "./http-rpc-client";

export type BatchData = {
  targets: (string | undefined)[];
  data: BytesLike[];
  values: BigNumberish[];
};

export interface BaseApiParams {
  provider: providers.Provider;
  entryPointAddress: string;
  accountAddress?: string;
  overheads?: Partial<GasOverheads>;
  paymasterAPI?: PaymasterAPI;
}

export interface UserOpResult {
  transactionHash: string;
  success: boolean;
}

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
  overheads?: Partial<GasOverheads>;
  entryPointAddress: string;
  accountAddress?: string;
  paymasterAPI?: PaymasterAPI;

  /**
   * base constructor.
   * subclass SHOULD add parameters that define the owner (signer) of this wallet
   */
  protected constructor(params: BaseApiParams) {
    this.provider = params.provider;
    this.overheads = params.overheads;
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
   * should cover cost of putting calldata on-chain, and some overhead.
   * actual overhead depends on the expected bundle size
   */
  async getPreVerificationGas(
    userOp: Partial<UserOperationStruct>,
  ): Promise<number> {
    const p = await utils.resolveProperties(userOp);
    return calcPreVerificationGas(p, this.overheads);
  }

  /**
   * ABI-encode a user operation. used for calldata cost estimation
   */
  packUserOp(userOp: NotPromise<UserOperationStruct>): string {
    return packUserOp(userOp, false);
  }

  async encodeUserOpCallDataAndGasLimit(
    detailsForUserOp: TransactionDetailsForUserOp,
    batchData?: BatchData,
  ): Promise<{ callData: string; callGasLimit: BigNumber }> {
    const value = parseNumber(detailsForUserOp.value) ?? BigNumber.from(0);
    const callData = batchData
      ? detailsForUserOp.data
      : await this.prepareExecute(
          detailsForUserOp.target,
          value,
          detailsForUserOp.data,
        ).then((tx) => tx.encode());

    let callGasLimit: BigNumber;
    const isPhantom = await this.checkAccountPhantom();
    if (isPhantom) {
      // when the account is not deployed yet, we simulate the call to the target contract directly
      if (batchData) {
        const limits = await Promise.all(
          batchData.targets.map((_, i) =>
            this.provider.estimateGas({
              from: this.getAccountAddress(),
              to: batchData.targets[i],
              data: batchData.data[i],
              value: batchData.values[i],
            }),
          ),
        );
        callGasLimit = limits.reduce((a, b) => a.add(b), BigNumber.from(0));
      } else {
        callGasLimit = await this.provider.estimateGas({
          from: this.getAccountAddress(),
          to: detailsForUserOp.target,
          data: detailsForUserOp.data,
          value: detailsForUserOp.value,
        });
      }

      // add 20% overhead for entrypoint checks
      callGasLimit = callGasLimit.mul(120).div(100);
      // if the estimation is too low, we use a fixed value of 500k
      if (callGasLimit.lt(30000)) {
        callGasLimit = BigNumber.from(500000);
      }
    } else {
      callGasLimit =
        parseNumber(detailsForUserOp.gasLimit) ??
        (await this.provider.estimateGas({
          from: this.entryPointAddress,
          to: this.getAccountAddress(),
          data: callData,
          value: detailsForUserOp.value,
        }));
    }

    return {
      callData,
      callGasLimit,
    };
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

  async createUnsignedUserOpv2(
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
        maxPriorityFeePerGas = feeData.maxPriorityFeePerGas ?? undefined;
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
      callGasLimit: BigNumber.from(0),
      verificationGasLimit: BigNumber.from(0),
      preVerificationGas: BigNumber.from(0),
      paymasterAndData: "0x",
      signature:
        "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c",
    };

    // paymaster data for estimation
    if (this.paymasterAPI) {
      const paymasterAndData = await this.paymasterAPI.getPaymasterAndData(
        partialOp,
      );
      if (paymasterAndData && paymasterAndData !== "0x") {
        partialOp.paymasterAndData = paymasterAndData;
      }
    }

    // query bundler for gas limits
    let estimates;
    try {
      estimates = await httpRpcClient.estimateUserOpGas(partialOp);
    } catch (error: any) {
      console.error("estimation err", error);
      throw error;
    }

    partialOp.callGasLimit = BigNumber.from(estimates.callGasLimit);
    partialOp.verificationGasLimit = BigNumber.from(
      estimates.verificationGasLimit,
    );
    partialOp.preVerificationGas = BigNumber.from(estimates.preVerificationGas);

    /**
     * ex. response
     * preVerificationGas: '0xbf98',
     * verificationGas: '0x18dd5',
     * verificationGasLimit: '0x18dd5',
     * callGasLimit: '0x35b76'
     */

    // This is subotpimal, but PM needs to resign the userOp with the new gas limits - can be fixed with the new paymaster api
    if (this.paymasterAPI) {
      const paymasterAndData = await this.paymasterAPI.getPaymasterAndData(
        partialOp,
      );
      if (paymasterAndData && paymasterAndData !== "0x") {
        partialOp.paymasterAndData = paymasterAndData;
      }
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
}

function parseNumber(a: any): BigNumber | null {
  if (!a || a === "") {
    return null;
  }
  return BigNumber.from(a.toString());
}
