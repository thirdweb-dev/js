import {
  getChainProvider,
  SmartContract,
  ThirdwebSDK,
} from "@thirdweb-dev/sdk";
import { BigNumberish, BigNumber, ethers } from "ethers";
import { arrayify, hexConcat } from "ethers/lib/utils";
import { AccountApiParams } from "../types";
import { BaseAccountAPI } from "./base-api";
import { MINIMAL_ACCOUNT_ABI } from "./constants";

export class AccountAPI extends BaseAccountAPI {
  sdk: ThirdwebSDK;
  params: AccountApiParams;
  accountContract?: SmartContract;
  factoryContract?: SmartContract;

  constructor(
    params: AccountApiParams,
    originalProvider: ethers.providers.Provider,
  ) {
    super({
      ...params,
      provider: originalProvider,
    });
    this.params = params;
    this.sdk = new ThirdwebSDK(params.localSigner, originalProvider);
  }

  async getChainId() {
    return await this.provider.getNetwork().then((n) => n.chainId);
  }

  async getAccountContract(): Promise<SmartContract> {
    if (!this.accountContract) {
      if (this.params.accountInfo?.abi) {
        this.accountContract = await this.sdk.getContract(
          await this.getAccountAddress(),
          this.params.accountInfo.abi,
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
    const localSigner = await this.params.localSigner.getAddress();
    const tx = await this.params.factoryInfo.createAccount(
      factory,
      localSigner,
    );
    try {
      console.log(
        "Cost to create account: ",
        (await tx.estimateGasCost()).ether,
        "ETH",
      );
    } catch (e) {
      console.log("Cost to create account: unknown");
    }
    return hexConcat([factory.getAddress(), tx.encode()]);
  }

  async getFactoryContract() {
    if (this.factoryContract) {
      return this.factoryContract;
    }
    if (this.params.factoryInfo?.abi) {
      this.factoryContract = await this.sdk.getContract(
        this.params.factoryAddress,
        this.params.factoryInfo.abi,
      );
    } else {
      this.factoryContract = await this.sdk.getContract(
        this.params.factoryAddress,
      );
    }
    return this.factoryContract;
  }

  async getCounterFactualAddress(): Promise<string> {
    if (this.params.accountAddress) {
      return this.params.accountAddress;
    }
    const factory = await this.getFactoryContract();
    const localSigner = await this.params.localSigner.getAddress();
    return this.params.factoryInfo.getAccountAddress(factory, localSigner);
  }

  async getNonce(): Promise<BigNumber> {
    if (await this.checkAccountPhantom()) {
      return BigNumber.from(0);
    }
    const accountContract = await this.getAccountContract();
    return this.params.accountInfo.getNonce(accountContract);
  }

  async encodeExecute(
    target: string,
    value: BigNumberish,
    data: string,
  ): Promise<string> {
    const accountContract = await this.getAccountContract();
    const tx = await this.params.accountInfo.execute(
      accountContract,
      target,
      value,
      data,
    );
    return tx.encode();
  }

  async signUserOpHash(userOpHash: string): Promise<string> {
    return await this.params.localSigner.signMessage(arrayify(userOpHash));
  }
}
