import { JsonRpcProvider } from "@ethersproject/providers";
import { ethers } from "ethers";
import { resolveProperties } from "ethers/lib/utils";
import { UserOperationStruct } from "@account-abstraction/contracts";
import { deepHexlify } from "@account-abstraction/utils";

const DEBUG = false;

export class HttpRpcClient {
  private readonly userOpJsonRpcProvider: JsonRpcProvider;

  initializing: Promise<void>;
  bundlerUrl: string;
  entryPointAddress: string;
  chainId: number;

  constructor(
    bundlerUrl: string,
    entryPointAddress: string,
    chainId: number,
    apiKey: string,
  ) {
    this.bundlerUrl = bundlerUrl;
    this.entryPointAddress = entryPointAddress;
    this.chainId = chainId;
    this.userOpJsonRpcProvider = new ethers.providers.JsonRpcProvider(
      {
        url: this.bundlerUrl,
        headers: {
          "x-api-key": apiKey,
        },
      },
      {
        name: "Connected bundler network",
        chainId,
      },
    );
    this.initializing = this.validateChainId();
  }

  async validateChainId(): Promise<void> {
    // validate chainId is in sync with expected chainid
    const chain = await this.userOpJsonRpcProvider.send("eth_chainId", []);
    const bundlerChain = parseInt(chain);
    if (bundlerChain !== this.chainId) {
      throw new Error(
        `bundler ${this.bundlerUrl} is on chainId ${bundlerChain}, but provider is on chainId ${this.chainId}`,
      );
    }
  }

  /**
   * send a UserOperation to the bundler
   * @param userOp1
   * @return userOpHash the id of this operation, for getUserOperationTransaction
   */
  async sendUserOpToBundler(userOp1: UserOperationStruct): Promise<string> {
    await this.initializing;
    const hexifiedUserOp = deepHexlify(await resolveProperties(userOp1));
    const jsonRequestData: [UserOperationStruct, string] = [
      hexifiedUserOp,
      this.entryPointAddress,
    ];
    await this.printUserOperation("eth_sendUserOperation", jsonRequestData);
    return await this.userOpJsonRpcProvider.send("eth_sendUserOperation", [
      hexifiedUserOp,
      this.entryPointAddress,
    ]);
  }

  async estimateUserOpGas(
    userOp1: Partial<UserOperationStruct>,
  ): Promise<string> {
    await this.initializing;
    const hexifiedUserOp = deepHexlify(await resolveProperties(userOp1));
    const jsonRequestData: [UserOperationStruct, string] = [
      hexifiedUserOp,
      this.entryPointAddress,
    ];
    await this.printUserOperation(
      "eth_estimateUserOperationGas",
      jsonRequestData,
    );
    return await this.userOpJsonRpcProvider.send(
      "eth_estimateUserOperationGas",
      [hexifiedUserOp, this.entryPointAddress],
    );
  }

  private async printUserOperation(
    method: string,
    [userOp1, entryPointAddress]: [UserOperationStruct, string],
  ): Promise<void> {
    if (!DEBUG) {
      return;
    }
    const userOp = await resolveProperties(userOp1);
    console.debug(
      "sending",
      method,
      {
        ...userOp,
        // initCode: (userOp.initCode ?? '').length,
        // callData: (userOp.callData ?? '').length
      },
      entryPointAddress,
    );
  }
}
