import {
  extractConstructorParams,
  extractFunctions,
  fetchContractMetadataFromAddress,
  fetchExtendedReleaseMetadata,
  fetchPreDeployMetadata,
  fetchRawPredeployMetadata,
  fetchSourceFilesFromMetadata,
  resolveContractUriFromAddress,
} from "../../common/feature-detection";
import { isIncrementalVersion } from "../../common/version-checker";
import {
  ChainId,
  getContractPublisherAddress,
  getRpcUrlForChainId,
} from "../../constants";
import {
  AbiFunction,
  ContractParam,
  ContractSource,
  ExtraPublishMetadata,
  FullPublishMetadata,
  FullPublishMetadataSchemaInput,
  PreDeployMetadataFetched,
  ProfileMetadata,
  ProfileMetadataInput,
  ProfileSchemaOutput,
  PublishedContract,
  PublishedContractFetched,
  PublishedContractSchema,
} from "../../schema/contracts/custom";
import { SDKOptions } from "../../schema/sdk-options";
import { NetworkOrSignerOrProvider, TransactionResult } from "../types";
import { ContractWrapper } from "./contract-wrapper";
import { RPCConnectionHandler } from "./rpc-connection-handler";
import type {
  ContractPublisher as OnChainContractPublisher,
  IContractPublisher,
} from "@thirdweb-dev/contracts-js";
import ContractPublisherAbi from "@thirdweb-dev/contracts-js/dist/abis/ContractPublisher.json";
import { ContractPublishedEvent } from "@thirdweb-dev/contracts-js/dist/declarations/src/ContractPublisher";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { constants, utils } from "ethers";
import invariant from "tiny-invariant";

/**
 * Handles publishing contracts (EXPERIMENTAL)
 * @internal
 */
export class ContractPublisher extends RPCConnectionHandler {
  private storage: ThirdwebStorage;
  private publisher: ContractWrapper<OnChainContractPublisher>;

  constructor(
    network: NetworkOrSignerOrProvider,
    options: SDKOptions,
    storage: ThirdwebStorage,
  ) {
    // TODO this should always be on Polygon
    super(network, options);
    this.storage = storage;
    this.publisher = new ContractWrapper<OnChainContractPublisher>(
      network,
      getContractPublisherAddress(),
      ContractPublisherAbi,
      options,
    );
  }

  // FIXME this needs to only assign the signer, not the provider
  public override updateSignerOrProvider(
    network: NetworkOrSignerOrProvider,
  ): void {
    super.updateSignerOrProvider(network);
    this.publisher.updateSignerOrProvider(network);
  }

  /**
   * @internal
   * @param metadataUri
   */
  public async extractConstructorParams(
    metadataUri: string,
  ): Promise<ContractParam[]> {
    return extractConstructorParams(metadataUri, this.storage);
  }

  /**
   * @internal
   * @param predeployMetadataUri
   */
  public async extractFunctions(
    predeployMetadataUri: string,
  ): Promise<AbiFunction[]> {
    return extractFunctions(predeployMetadataUri, this.storage);
  }

  /**
   * @internal
   * @param predeployUri
   */
  public async fetchCompilerMetadataFromPredeployURI(
    predeployUri: string,
  ): Promise<PreDeployMetadataFetched> {
    return fetchPreDeployMetadata(predeployUri, this.storage);
  }

  /**
   * @internal
   * @param prepublishUri
   * @param publisherAddress
   */
  public async fetchPrePublishMetadata(
    prepublishUri: string,
    publisherAddress: string,
  ): Promise<{
    preDeployMetadata: PreDeployMetadataFetched;
    latestPublishedContractMetadata?: PublishedContractFetched;
  }> {
    const preDeployMetadataFetched = await fetchPreDeployMetadata(
      prepublishUri,
      this.storage,
    );
    const latestPublishedContract = publisherAddress
      ? await this.getLatest(publisherAddress, preDeployMetadataFetched.name)
      : undefined;
    const latestPublishedContractMetadata = latestPublishedContract
      ? await this.fetchPublishedContractInfo(latestPublishedContract)
      : undefined;
    return {
      preDeployMetadata: preDeployMetadataFetched,
      latestPublishedContractMetadata,
    };
  }

  /**
   * @internal
   * @param address
   */
  public async fetchCompilerMetadataFromAddress(address: string) {
    return fetchContractMetadataFromAddress(
      address,
      this.getProvider(),
      this.storage,
    );
  }

  /**
   * @internal
   * Get the full information about a published contract
   * @param contract
   */
  public async fetchPublishedContractInfo(
    contract: PublishedContract,
  ): Promise<PublishedContractFetched> {
    return {
      name: contract.id,
      publishedTimestamp: contract.timestamp,
      publishedMetadata: await this.fetchFullPublishMetadata(
        contract.metadataUri,
      ),
    };
  }

  /**
   * @internal
   * @param publishedMetadataUri
   */
  public async fetchFullPublishMetadata(
    publishedMetadataUri: string,
  ): Promise<FullPublishMetadata> {
    return fetchExtendedReleaseMetadata(publishedMetadataUri, this.storage);
  }

  /**
   * @internal
   * // TODO expose a resolvePublishMetadata(contractAddress, chainId) that handles the dual chain case
   * // TODO will be easy to do with the multichain pattern of 3.0
   * @param compilerMetadataUri
   */
  public async resolvePublishMetadataFromCompilerMetadata(
    compilerMetadataUri: string,
  ): Promise<FullPublishMetadata[]> {
    const publishedMetadataUri =
      await this.publisher.readContract.getPublishedUriFromCompilerUri(
        compilerMetadataUri,
      );
    if (publishedMetadataUri.length === 0) {
      throw Error(
        `Could not resolve published metadata URI from ${compilerMetadataUri}`,
      );
    }
    return await Promise.all(
      publishedMetadataUri
        .filter((uri) => uri.length > 0)
        .map((uri) => this.fetchFullPublishMetadata(uri)),
    );
  }

  /**
   * @internal
   * TODO clean this up (see method above, too)
   */
  public async resolveReleasesFromAddress(address: string) {
    const contractUri = await resolveContractUriFromAddress(
      address,
      this.getProvider(),
    );
    invariant(contractUri, "Could not resolve contract URI from address");
    return await this.resolvePublishMetadataFromCompilerMetadata(contractUri);
  }

  /**
   * @internal
   * @param address
   */
  public async fetchContractSourcesFromAddress(
    address: string,
  ): Promise<ContractSource[]> {
    const metadata = await this.fetchCompilerMetadataFromAddress(address);
    return await fetchSourceFilesFromMetadata(metadata, this.storage);
  }

  /**
   * @internal
   * @param profileMetadata
   */
  public async updatePublisherProfile(
    profileMetadata: ProfileMetadataInput,
  ): Promise<TransactionResult> {
    const signer = this.getSigner();
    invariant(signer, "A signer is required");
    const publisher = await signer.getAddress();
    const profileUri = await this.storage.upload(profileMetadata);
    return {
      receipt: await this.publisher.sendTransaction("setPublisherProfileUri", [
        publisher,
        profileUri,
      ]),
    };
  }

  /**
   * @internal
   * @param publisherAddress
   */
  public async getPublisherProfile(
    publisherAddress: string,
  ): Promise<ProfileMetadata> {
    const profileUri = await this.publisher.readContract.getPublisherProfileUri(
      publisherAddress,
    );
    if (!profileUri || profileUri.length === 0) {
      return {};
    }
    return ProfileSchemaOutput.parse(
      await this.storage.downloadJSON(profileUri),
    );
  }

  /**
   * @internal
   * @param publisherAddress
   */
  public async getAll(publisherAddress: string): Promise<PublishedContract[]> {
    const data = await this.publisher.readContract.getAllPublishedContracts(
      publisherAddress,
    );
    // since we can fetch from multiple publisher contracts, just keep the latest one in the list
    const map = data.reduce((acc, curr) => {
      // replaces the previous contract with the latest one
      acc[curr.contractId] = curr;
      return acc;
    }, {} as Record<string, IContractPublisher.CustomContractInstanceStruct>);
    return Object.entries(map).map(([, struct]) =>
      this.toPublishedContract(
        struct as IContractPublisher.CustomContractInstanceStruct,
      ),
    );
  }

  /**
   * @internal
   * @param publisherAddress
   * @param contractId
   */
  public async getAllVersions(
    publisherAddress: string,
    contractId: string,
  ): Promise<PublishedContract[]> {
    const contractStructs =
      await this.publisher.readContract.getPublishedContractVersions(
        publisherAddress,
        contractId,
      );
    if (contractStructs.length === 0) {
      throw Error("Not found");
    }
    return contractStructs.map((d) => this.toPublishedContract(d));
  }

  public async getLatest(
    publisherAddress: string,
    contractId: string,
  ): Promise<PublishedContract | undefined> {
    const model = await this.publisher.readContract.getPublishedContract(
      publisherAddress,
      contractId,
    );
    if (model && model.publishMetadataUri) {
      return this.toPublishedContract(model);
    }
    return undefined;
  }

  public async publish(
    predeployUri: string,
    extraMetadata: ExtraPublishMetadata,
  ): Promise<TransactionResult<PublishedContract>> {
    const signer = this.getSigner();
    invariant(signer, "A signer is required");
    const publisher = await signer.getAddress();

    const predeployMetadata = await fetchRawPredeployMetadata(
      predeployUri,
      this.storage,
    );

    // ensure version is incremental
    const latestContract = await this.getLatest(
      publisher,
      predeployMetadata.name,
    );
    if (latestContract && latestContract.metadataUri) {
      const latestMetadata = await this.fetchPublishedContractInfo(
        latestContract,
      );
      const latestVersion = latestMetadata.publishedMetadata.version;
      if (!isIncrementalVersion(latestVersion, extraMetadata.version)) {
        throw Error(
          `Version ${extraMetadata.version} is not greater than ${latestVersion}`,
        );
      }
    }

    const fetchedBytecode = await (
      await this.storage.download(predeployMetadata.bytecodeUri)
    ).text();
    const bytecode = fetchedBytecode.startsWith("0x")
      ? fetchedBytecode
      : `0x${fetchedBytecode}`;

    const bytecodeHash = utils.solidityKeccak256(["bytes"], [bytecode]);
    const contractId = predeployMetadata.name;

    const fullMetadata = FullPublishMetadataSchemaInput.parse({
      ...extraMetadata,
      metadataUri: predeployMetadata.metadataUri,
      bytecodeUri: predeployMetadata.bytecodeUri,
      name: predeployMetadata.name,
      analytics: predeployMetadata.analytics,
      publisher,
    });
    const fullMetadataUri = await this.storage.upload(fullMetadata);
    const receipt = await this.publisher.sendTransaction("publishContract", [
      publisher,
      contractId,
      fullMetadataUri,
      predeployMetadata.metadataUri,
      bytecodeHash,
      constants.AddressZero,
    ]);
    const events = this.publisher.parseLogs<ContractPublishedEvent>(
      "ContractPublished",
      receipt.logs,
    );
    if (events.length < 1) {
      throw new Error("No ContractPublished event found");
    }
    const contract = events[0].args.publishedContract;
    return {
      receipt,
      data: async () => this.toPublishedContract(contract),
    };
  }

  public async unpublish(
    publisher: string,
    contractId: string,
  ): Promise<TransactionResult> {
    return {
      receipt: await this.publisher.sendTransaction("unpublishContract", [
        publisher,
        contractId,
      ]),
    };
  }

  private toPublishedContract(
    contractModel: IContractPublisher.CustomContractInstanceStruct,
  ): PublishedContract {
    return PublishedContractSchema.parse({
      id: contractModel.contractId,
      timestamp: contractModel.publishTimestamp,
      metadataUri: contractModel.publishMetadataUri,
    });
  }
}
