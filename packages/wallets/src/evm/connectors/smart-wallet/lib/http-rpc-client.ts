import { providers, utils } from "ethers";
import { UserOperationStruct } from "@account-abstraction/contracts";
import { deepHexlify } from "@account-abstraction/utils";
import { isTwUrl } from "../../../utils/url";

const DEBUG = false;

export class HttpRpcClient {
  private readonly userOpJsonRpcProvider: providers.JsonRpcProvider;
  private authToken?: string | null;

  initializing: Promise<void>;
  bundlerUrl: string;
  entryPointAddress: string;
  chainId: number;

  constructor(
    bundlerUrl: string,
    entryPointAddress: string,
    chainId: number,
    clientId?: string,
    secretKey?: string,
  ) {
    this.bundlerUrl = bundlerUrl;
    this.entryPointAddress = entryPointAddress;
    this.chainId = chainId;
    this.authToken = null;
    const authTokenExists = typeof globalThis !== "undefined" && "AUTH_TOKEN" in globalThis;
    if (authTokenExists) {
      // @ts-ignore
      this.authToken = globalThis.AUTH_TOKEN;
    }

    const headers: Record<string, string> = {};

    if (isTwUrl(this.bundlerUrl)) {
      if (secretKey && clientId) {
        throw new Error(
          "Cannot use both secret key and client ID. Please use secretKey for server-side applications and clientId for client-side applications.",
        );
      }

      if (this.authToken) {
        headers["Authorization"] = `Bearer ${this.authToken}`;
      }

      if (secretKey) {
        headers["x-secret-key"] = secretKey;
      } else if (clientId) {
        headers["x-client-id"] = clientId;

        if (
          typeof globalThis !== "undefined" &&
          "APP_BUNDLE_ID" in globalThis
        ) {
          // @ts-ignore
          headers["x-bundle-id"] = globalThis.APP_BUNDLE_ID;
        }
      }
    }

    this.userOpJsonRpcProvider = new providers.JsonRpcProvider(
      {
        url: this.bundlerUrl,
        headers,
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
    const hexifiedUserOp = deepHexlify(await utils.resolveProperties(userOp1));
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
    const hexifiedUserOp = deepHexlify(await utils.resolveProperties(userOp1));
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
    const userOp = await utils.resolveProperties(userOp1);
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
