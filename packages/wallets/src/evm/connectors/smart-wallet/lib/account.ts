import {
  LOCAL_NODE_PKEY,
  SmartContract,
  ThirdwebSDK,
  Transaction,
} from "@thirdweb-dev/sdk";
import { BigNumberish, BigNumber, ethers, utils, BytesLike } from "ethers";
import { ProviderConfig } from "../types";
import { BaseAccountAPI } from "./base-api";
import { ACCOUNT_CORE_ABI } from "./constants";

export class AccountAPI extends BaseAccountAPI {
  sdk: ThirdwebSDK;
  params: ProviderConfig;
  accountContract?: SmartContract;
  factoryContract?: SmartContract;

  constructor(
    params: ProviderConfig,
    originalProvider: ethers.providers.Provider,
  ) {
    super({
      ...params,
      provider: originalProvider,
    });
    this.params = params;
    // Technically dont need the signer here, but we need to encode/estimate gas with it so a signer is required
    // We don't want to use the localSigner directly since it might be connected to another chain
    // so we just use the public hardhat pkey instead
    this.sdk = ThirdwebSDK.fromPrivateKey(LOCAL_NODE_PKEY, params.chain, {
      clientId: params.clientId,
      secretKey: params.secretKey,
      // @ts-expect-error expected chain type error
      supportedChains:
        typeof params.chain === "object" ? [params.chain] : undefined,
    });
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
          ACCOUNT_CORE_ABI,
        );
      }
    }
    return this.accountContract;
  }

  async getAccountInitCode(): Promise<string> {
    const factory = await this.getFactoryContract();
    console.log("Deploying smart wallet via factory");
    const localSigner = await this.params.localSigner.getAddress();
    const tx = await this.params.factoryInfo.createAccount(
      factory,
      localSigner,
    );
    try {
      console.log(
        "Cost to deploy smart wallet: ",
        (await tx.estimateGasCost()).ether,
        "ETH",
      );
    } catch (e) {
      console.error("Cost to deploy smart wallet: unknown", e);
    }
    return utils.hexConcat([factory.getAddress(), tx.encode()]);
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

  async prepareExecute(
    target: string,
    value: BigNumberish,
    data: string,
  ): Promise<Transaction<any>> {
    const accountContract = await this.getAccountContract();
    return this.params.accountInfo.execute(
      accountContract,
      target,
      value,
      data,
    );
  }

  async prepareExecuteBatch(
    targets: string[],
    values: BigNumberish[],
    datas: BytesLike[],
  ): Promise<Transaction<any>> {
    const accountContract = await this.getAccountContract();
    return accountContract.prepare("executeBatch", [targets, values, datas]);
  }

  async signUserOpHash(userOpHash: string): Promise<string> {
    return await this.params.localSigner.signMessage(
      utils.arrayify(userOpHash),
    );
  }

  async isAcountDeployed() {
    return !(await this.checkAccountPhantom());
  }

  async isAccountApproved() {
    if (!this.params.erc20PaymasterAddress || !this.params.erc20TokenAddress) {
      return true;
    }

    const swAddress = await this.getCounterFactualAddress();
    const erc20Token = await this.sdk.getContract(
      this.params.erc20TokenAddress,
    );

    const allowance = await erc20Token.call("allowance", [
      swAddress,
      this.params.erc20PaymasterAddress,
    ]);

    console.log("Allowance for paymaster", allowance.toNumber().toString());

    return allowance.toNumber().toString() !== "0";
  }

  async approveIfNeeded(): Promise<void> {
    if (await this.isAccountApproved()) {
      return;
    }

    console.log("Approving ERC20 token for paymaster...");

    const erc20Token = await this.sdk.getContract(
      this.params.erc20TokenAddress as string,
    );

    const amountToApprove = 2 ** 96 - 1;

    const tx = erc20Token.prepare("approve", [
      this.params.erc20PaymasterAddress,
      amountToApprove,
    ]);

    const receipt = await tx.execute();
    console.log("Approved ERC20 token for paymaster", receipt);
  }
}
