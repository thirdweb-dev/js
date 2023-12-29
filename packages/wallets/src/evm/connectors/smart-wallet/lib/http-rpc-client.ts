import { providers, utils } from "ethers";
import { UserOperationStruct } from "@account-abstraction/contracts";
import { isTwUrl } from "../../../utils/url";
import pkg from "../../../../../package.json";
import { hexlifyUserOp } from "./utils";

export const DEBUG = true;
function isBrowser() {
  return typeof window !== "undefined";
}

export class HttpRpcClient {
  private readonly userOpJsonRpcProvider: providers.JsonRpcProvider;

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

    const headers: Record<string, string> = {};

    if (isTwUrl(this.bundlerUrl)) {
      const bundleId =
        typeof globalThis !== "undefined" && "APP_BUNDLE_ID" in globalThis
          ? ((globalThis as any).APP_BUNDLE_ID as string)
          : undefined;

      if (secretKey) {
        headers["x-secret-key"] = secretKey;
      } else if (clientId) {
        headers["x-client-id"] = clientId;

        if (bundleId) {
          headers["x-bundle-id"] = bundleId;
        }
      }

      // Dashboard token
      if (
        typeof globalThis !== "undefined" &&
        "TW_AUTH_TOKEN" in globalThis &&
        typeof (globalThis as any).TW_AUTH_TOKEN === "string"
      ) {
        headers["authorization"] = `Bearer ${
          (globalThis as any).TW_AUTH_TOKEN as string
        }`;
      }

      // CLI token
      if (
        typeof globalThis !== "undefined" &&
        "TW_CLI_AUTH_TOKEN" in globalThis &&
        typeof (globalThis as any).TW_CLI_AUTH_TOKEN === "string"
      ) {
        headers["authorization"] = `Bearer ${
          (globalThis as any).TW_CLI_AUTH_TOKEN as string
        }`;
        headers["x-authorize-wallet"] = "true";
      }

      headers["x-sdk-version"] = pkg.version;
      headers["x-sdk-name"] = pkg.name;
      headers["x-sdk-platform"] = bundleId
        ? "react-native"
        : isBrowser()
        ? (window as any).bridge !== undefined
          ? "webGL"
          : "browser"
        : "node";
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
   * @param userOp1 - the UserOperation to send
   * @returns userOpHash the id of this operation, for getUserOperationTransaction
   */
  async sendUserOpToBundler(userOp1: UserOperationStruct): Promise<string> {
    await this.initializing;
    const hexifiedUserOp = await hexlifyUserOp(userOp1);
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

  async estimateUserOpGas(userOp1: Partial<UserOperationStruct>): Promise<{
    preVerificationGas: string;
    verificationGas: string;
    verificationGasLimit: string;
    callGasLimit: string;
  }> {
    await this.initializing;
    const hexifiedUserOp = await hexlifyUserOp(userOp1);
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
