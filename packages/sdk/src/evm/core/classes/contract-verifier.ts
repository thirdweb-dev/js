import {
  checkVerificationStatus,
  verifyThirdwebPrebuiltImplementation,
} from "../../common";
import { SDKOptions } from "../../schema";
import { ContractType, NetworkInput } from "../types";
import { RPCConnectionHandler } from "./rpc-connection-handler";
import { ThirdwebStorage } from "@thirdweb-dev/storage";

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

  public async verifyThirdwebContract(
    contractNameOrType: string | ContractType,
    explorerAPI: string,
    explorerAPIKey: string,
  ) {
    const chainId = (await this.getProvider().getNetwork()).chainId;
    const guid = await verifyThirdwebPrebuiltImplementation(
      contractNameOrType,
      chainId,
      explorerAPI,
      explorerAPIKey,
      this.storage,
    );

    console.info("Checking verification status...");
    const verificationStatus = await checkVerificationStatus(
      explorerAPI,
      explorerAPIKey,
      guid,
    );
    console.info(verificationStatus);
  }

  public async verifyContract() {}
}
