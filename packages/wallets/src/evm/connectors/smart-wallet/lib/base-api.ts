import { ethers, BigNumber, BigNumberish, providers, utils } from "ethers";
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
import { getDynamicFeeData } from "@thirdweb-dev/sdk";

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

  async init(): Promise<this> {
    if ((await this.provider.getCode(this.entryPointAddress)) === "0x") {
      throw new Error(`entryPoint not deployed at ${this.entryPointAddress}`);
    }

    await this.getAccountAddress();
    return this;
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
   * @param target
   * @param value
   * @param data
   */
  abstract encodeExecute(
    target: string,
    value: BigNumberish,
    data: string,
  ): Promise<string>;

  /**
   * sign a userOp's hash (userOpHash).
   * @param userOpHash
   */
  abstract signUserOpHash(userOpHash: string): Promise<string>;

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
   * calculate the account address even before it is deployed
   */
  async getCounterFactualAddress(): Promise<string> {
    const initCode = this.getAccountInitCode();
    // use entryPoint to query account address (factory can provide a helper method to do the same, but
    // this method attempts to be generic
    try {
      await this.entryPointView.callStatic.getSenderAddress(initCode);
    } catch (e: any) {
      return e.errorArgs.sender;
    }
    throw new Error("must handle revert");
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
    batched: boolean,
  ): Promise<{ callData: string; callGasLimit: BigNumber }> {
    function parseNumber(a: any): BigNumber | null {
      if (!a || a === "") {
        return null;
      }
      return BigNumber.from(a.toString());
    }

    const value = parseNumber(detailsForUserOp.value) ?? BigNumber.from(0);
    const callData = batched
      ? detailsForUserOp.data
      : await this.encodeExecute(
          detailsForUserOp.target,
          value,
          detailsForUserOp.data,
        );

    let callGasLimit;
    const isPhantom = await this.checkAccountPhantom();
    if (isPhantom) {
      // when the account is not deployed yet, we simulate the call to the target contract directly
      callGasLimit = await this.provider.estimateGas({
        from: this.getAccountAddress(),
        to: detailsForUserOp.target,
        data: detailsForUserOp.data,
      });
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
   * @param userOp userOperation, (signature field ignored)
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

  /**
   * create a UserOperation, filling all details (except signature)
   * - if account is not yet created, add initCode to deploy it.
   * - if gas or nonce are missing, read them from the chain (note that we can't fill gaslimit before the account is created)
   * @param info
   */
  async createUnsignedUserOp(
    info: TransactionDetailsForUserOp,
    batched: boolean,
  ): Promise<UserOperationStruct> {
    const { callData, callGasLimit } =
      await this.encodeUserOpCallDataAndGasLimit(info, batched);
    const initCode = await this.getInitCode();

    const initGas = await this.estimateCreationGas(initCode);
    const verificationGasLimit = BigNumber.from(
      await this.getVerificationGasLimit(),
    ).add(initGas);

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

    const partialUserOp: any = {
      sender: this.getAccountAddress(),
      nonce: info.nonce ?? this.getNonce(),
      initCode,
      callData,
      callGasLimit,
      verificationGasLimit,
      maxFeePerGas,
      maxPriorityFeePerGas,
      paymasterAndData: "0x",
    };

    let paymasterAndData: string | undefined;
    let userOp = partialUserOp;
    if (this.paymasterAPI) {
      // fill (partial) preVerificationGas (all except the cost of the generated paymasterAndData)
      try {
        // userOp.preVerificationGas contains a promise that will resolve to an error.
        await ethers.utils.resolveProperties(userOp);
        // eslint-disable-next-line no-empty
      } catch (_) {}
      const pmOp: Partial<UserOperationStruct> = {
        sender: userOp.sender,
        nonce: userOp.nonce,
        initCode: userOp.initCode,
        callData: userOp.callData,
        callGasLimit: userOp.callGasLimit,
        verificationGasLimit: userOp.verificationGasLimit,
        maxFeePerGas: userOp.maxFeePerGas,
        maxPriorityFeePerGas: userOp.maxPriorityFeePerGas,
        // A dummy value here is required in order to calculate a correct preVerificationGas value.
        paymasterAndData: DUMMY_PAYMASTER_AND_DATA,
        signature: ethers.utils.hexlify(Buffer.alloc(SIG_SIZE, 1)),
      };
      userOp = await ethers.utils.resolveProperties(pmOp);
      const preVerificationGas = calcPreVerificationGas(userOp);
      userOp.preVerificationGas = preVerificationGas;
      paymasterAndData = await this.paymasterAPI.getPaymasterAndData(userOp);
      if (paymasterAndData === "0x") {
        paymasterAndData = undefined;
      }
    }

    if (paymasterAndData) {
      userOp.paymasterAndData = paymasterAndData;
      return {
        ...userOp,
        signature: "",
      };
    } else {
      const modifiedOp = {
        ...userOp,
        paymasterAndData: "0x",
      };
      modifiedOp.preVerificationGas =
        await this.getPreVerificationGas(modifiedOp);
      return {
        ...modifiedOp,
        signature: "",
      };
    }
  }

  /**
   * Sign the filled userOp.
   * @param userOp the UserOperation to sign (with signature field ignored)
   */
  async signUserOp(userOp: UserOperationStruct): Promise<UserOperationStruct> {
    const userOpHash = await this.getUserOpHash(userOp);
    const signature = this.signUserOpHash(userOpHash);
    return {
      ...userOp,
      signature,
    };
  }

  /**
   * helper method: create and sign a user operation.
   * @param info transaction details for the userOp
   */
  async createSignedUserOp(
    info: TransactionDetailsForUserOp,
    batched: boolean,
  ): Promise<UserOperationStruct> {
    return await this.signUserOp(
      await this.createUnsignedUserOp(info, batched),
    );
  }

  /**
   * get the transaction that has this userOpHash mined, or null if not found
   * @param userOpHash returned by sendUserOpToBundler (or by getUserOpHash..)
   * @param timeout stop waiting after this timeout
   * @param interval time to wait between polls.
   * @return the transactionHash this userOp was mined, or null if not found.
   */
  async getUserOpReceipt(
    userOpHash: string,
    timeout = 30000,
    interval = 5000,
  ): Promise<string | null> {
    const endtime = Date.now() + timeout;
    while (Date.now() < endtime) {
      const events = await this.entryPointView.queryFilter(
        this.entryPointView.filters.UserOperationEvent(userOpHash),
      );
      if (events.length > 0) {
        return events[0].transactionHash;
      }
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
    return null;
  }
}
