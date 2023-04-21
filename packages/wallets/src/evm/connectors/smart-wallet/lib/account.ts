import { BaseApiParams } from "@account-abstraction/sdk/dist/src/BaseAccountAPI";
import { ChainOrRpcUrl, SmartContract, ThirdwebSDK } from "@thirdweb-dev/sdk";
import { Signer, BigNumberish, BigNumber, ContractInterface } from "ethers";
import { arrayify, hexConcat } from "ethers/lib/utils";
import { getEncodedAccountId } from "../utils";
import { BaseAccountAPI } from "./base-api";
import { MINIMAL_ACCOUNT_ABI } from "./constants";

export interface AccountApiParams extends Omit<BaseApiParams, "provider"> {
  chain: ChainOrRpcUrl;
  localSigner: Signer;
  accountId: string;
  factoryAddress: string;
  factoryAbi?: ContractInterface;
  accountAbi?: ContractInterface;
}

export class AccountAPI extends BaseAccountAPI {
  sdk: ThirdwebSDK;
  params: AccountApiParams;
  accountContract?: SmartContract;
  factoryContract?: SmartContract;

  constructor(params: AccountApiParams) {
    const sdk = ThirdwebSDK.fromSigner(params.localSigner, params.chain);
    super({
      ...params,
      provider: sdk.getProvider(),
    });
    this.params = params;
    this.sdk = sdk;
  }

  async getChainId() {
    return await this.provider.getNetwork().then((n) => n.chainId);
  }

  async _getAccountContract(): Promise<SmartContract> {
    if (!this.accountContract) {
      if (this.params.accountAbi) {
        this.accountContract = await this.sdk.getContract(
          await this.getAccountAddress(),
          this.params.accountAbi,
        );
      } else {
        this.accountContract = await this.sdk.getContract(
          await this.getAccountAddress(),
          MINIMAL_ACCOUNT_ABI,
        );
      }
    }
    return this.accountContract;
  }

  async getAccountInitCode(): Promise<string> {
    const factory = await this.getFactoryContract();
    console.log("AccountAPI - Creating account via factory");
    // TODO (sw): here the createAccount expects owner + salt as arguments, but could be different
    const localSigner = await this.params.localSigner.getAddress();

    const tx = factory.prepare("createAccount", [
      localSigner,
      getEncodedAccountId(this.params.accountId),
    ]);
    try {
      console.log("Cost to create account: ", await tx.estimateGasCost());
    } catch (e) {
      console.log("Cost to create account: unknown");
    }

    return hexConcat([factory.getAddress(), tx.encode()]);
  }

  async getFactoryContract() {
    if (this.factoryContract) {
      return this.factoryContract;
    }
    if (this.params.factoryAbi) {
      this.factoryContract = await this.sdk.getContract(
        this.params.factoryAddress,
        this.params.factoryAbi,
      );
    } else {
      this.factoryContract = await this.sdk.getContract(
        this.params.factoryAddress,
      );
    }
    return this.factoryContract;
  }

  async getCounterFactualAddress(): Promise<string> {
    const factory = await this.getFactoryContract();
    return factory.call("getAddress", [
      getEncodedAccountId(this.params.accountId),
    ]);
  }

  async getNonce(): Promise<BigNumber> {
    if (await this.checkAccountPhantom()) {
      return BigNumber.from(0);
    }
    const accountContract = await this._getAccountContract();
    const nonce = await accountContract.call("nonce");
    return nonce;
  }

  async encodeExecute(
    target: string,
    value: BigNumberish,
    data: string,
  ): Promise<string> {
    const accountContract = await this._getAccountContract();
    // TODO (sw) here execute target + value + data as arguments, but could be different depending on the ABI
    return accountContract.prepare("execute", [target, value, data]).encode();
  }

  async signUserOpHash(userOpHash: string): Promise<string> {
    return await this.params.localSigner.signMessage(arrayify(userOpHash));
  }
}
