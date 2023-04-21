import { ethers } from "ethers";
import {
  checkVerificationStatus,
  verify,
  verifyThirdwebPrebuiltImplementation,
} from "../../common";
import { SDKOptions } from "../../schema";
import { ConstructorParamMap } from "../../types/any-evm/deploy-data";
import { NetworkInput } from "../types";
import { RPCConnectionHandler } from "./rpc-connection-handler";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import invariant from "tiny-invariant";

/**
 * Handles verification of new contracts on any EVM
 * @public
 */
export class ContractVerifier extends RPCConnectionHandler {
  private storage: ThirdwebStorage;

  constructor(
    network: NetworkInput,
    options: SDKOptions,
    storage: ThirdwebStorage,
  ) {
    super(network, options);
    this.storage = storage;
  }

  public override updateSignerOrProvider(network: NetworkInput) {
    super.updateSignerOrProvider(network);
  }

  /**
   * Verifies a Thirdweb contract
   *
   * @example
   * ```javascript
   *
   * // Note: If verifying on a network different from the SDK instance's network,
   * //       update the verifier's chain/network as below:
   * //
   * //       sdk.verifier.updateSignerOrProvider(chainId);
   *
   * const explorerAPIUrl = "" // e.g. https://api.etherscan.io/api
   * const explorerAPIKey = "" // Generate API key on the explorer
   *
   * await sdk.verifier.verifyThirdwebContract(
   *   "DropERC721",
   *   explorerAPIUrl,
   *   explorerAPIKey,
   * );
   * ```
   * @param contractName
   * @param explorerAPIUrl
   * @param explorerAPIKey
   */
  public async verifyThirdwebContract(
    contractName: string,
    explorerAPIUrl: string,
    explorerAPIKey: string,
    constructorArgs?: ConstructorParamMap,
  ) {
    const chainId = (await this.getProvider().getNetwork()).chainId;
    const guid = await verifyThirdwebPrebuiltImplementation(
      contractName,
      chainId,
      explorerAPIUrl,
      explorerAPIKey,
      this.storage,
      constructorArgs,
    );

    console.info("Checking verification status...");
    const verificationStatus = await checkVerificationStatus(
      explorerAPIUrl,
      explorerAPIKey,
      guid,
    );
    console.info(verificationStatus);
  }

  /**
   * Verifies any contract
   *
   * @example
   * ```javascript
   *
   * // Note: If verifying on a network different from the SDK instance's network,
   * //       update the verifier's chain/network as below:
   * //
   * //       sdk.verifier.updateSignerOrProvider(chainId);
   *
   * const contractAddress = ""
   * const explorerAPIUrl = "" // e.g. https://api.etherscan.io/api
   * const explorerAPIKey = "" // Generate API key on the explorer
   *
   * await sdk.verifier.verifyContract(
   *   contractAddress,
   *   explorerAPIUrl,
   *   explorerAPIKey,
   * );
   * ```
   * @param contractAddress
   * @param explorerAPIUrl
   * @param explorerAPIKey
   */
  public async verifyContract(
    contractAddress: string,
    explorerAPIUrl: string,
    explorerAPIKey: string,
    constructorArgs?: ConstructorParamMap,
  ) {
    const chainId = (await this.getProvider().getNetwork()).chainId;

    let encodedArgs;
    if (constructorArgs) {
      const paramTypes = Object.values(constructorArgs).map((arg) => {
        invariant(arg.type, "Param type is required");
        return arg.type;
      });
      const paramValues = Object.values(constructorArgs).map((arg) => {
        return arg.value;
      });

      encodedArgs = ethers.utils.defaultAbiCoder.encode(
        paramTypes,
        paramValues,
      );
    }

    const guid = await verify(
      contractAddress,
      chainId,
      explorerAPIUrl,
      explorerAPIKey,
      this.storage,
      encodedArgs,
    );

    console.info("Checking verification status...");
    const verificationStatus = await checkVerificationStatus(
      explorerAPIUrl,
      explorerAPIKey,
      guid,
    );
    console.info(verificationStatus);
  }
}
