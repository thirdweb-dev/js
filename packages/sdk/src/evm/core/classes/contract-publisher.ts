import {
  extractConstructorParams,
  extractFunctions,
  fetchContractMetadataFromAddress,
  fetchExtendedReleaseMetadata,
  fetchPreDeployMetadata,
  fetchRawPredeployMetadata,
  fetchSourceFilesFromMetadata,
  isIncrementalVersion,
  resolveContractUriFromAddress,
} from "../../common";
import { resolveAddress } from "../../common/ens";
import { buildTransactionFunction } from "../../common/transactions";
import { getContractPublisherAddress } from "../../constants";
import {
  AbiFunction,
  AddressOrEns,
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
  SDKOptions,
} from "../../schema";
import { NetworkInput, TransactionResult } from "../types";
import { ContractWrapper } from "./contract-wrapper";
import { RPCConnectionHandler } from "./rpc-connection-handler";
import { Transaction } from "./transactions";
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
    network: NetworkInput,
    options: SDKOptions,
    storage: ThirdwebStorage,
  ) {
    super(network, options);
    this.storage = storage;
    this.publisher = new ContractWrapper<OnChainContractPublisher>(
      network,
      getContractPublisherAddress(),
      ContractPublisherAbi,
      options,
    );
  }

  public override updateSignerOrProvider(network: NetworkInput): void {
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
    publisherAddress: AddressOrEns,
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
  public async fetchCompilerMetadataFromAddress(address: AddressOrEns) {
    const resolvedAddress = await resolveAddress(address);
    return fetchContractMetadataFromAddress(
      resolvedAddress,
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
  public async resolveContractUriFromAddress(address: AddressOrEns) {
    const resolvedAddress = await resolveAddress(address);
    const contractUri = await resolveContractUriFromAddress(
      resolvedAddress,
      this.getProvider(),
    );
    invariant(contractUri, "Could not resolve contract URI from address");
    return contractUri;
  }

  /**
   * @internal
   * @param address
   */
  public async fetchContractSourcesFromAddress(
    address: AddressOrEns,
  ): Promise<ContractSource[]> {
    const resolvedAddress = await resolveAddress(address);
    const metadata = await this.fetchCompilerMetadataFromAddress(
      resolvedAddress,
    );
    return await fetchSourceFilesFromMetadata(metadata, this.storage);
  }

  /**
   * @internal
   * @param profileMetadata
   */
  updatePublisherProfile = buildTransactionFunction(
    async (profileMetadata: ProfileMetadataInput) => {
      const signer = this.getSigner();
      invariant(signer, "A signer is required");
      const publisher = await signer.getAddress();
      const profileUri = await this.storage.upload(profileMetadata);

      return Transaction.fromContractWrapper({
        contractWrapper: this.publisher,
        method: "setPublisherProfileUri",
        args: [publisher, profileUri],
      });
    },
  );

  /**
   * @internal
   * @param publisherAddress
   */
  public async getPublisherProfile(
    publisherAddress: AddressOrEns,
  ): Promise<ProfileMetadata> {
    const resolvedPublisherAddress = await resolveAddress(publisherAddress);
    const profileUri = await this.publisher.readContract.getPublisherProfileUri(
      resolvedPublisherAddress,
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
  public async getAll(
    publisherAddress: AddressOrEns,
  ): Promise<PublishedContract[]> {
    const resolvedPublisherAddress = await resolveAddress(publisherAddress);
    const data = await this.publisher.readContract.getAllPublishedContracts(
      resolvedPublisherAddress,
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
    publisherAddress: AddressOrEns,
    contractId: string,
  ): Promise<PublishedContract[]> {
    const resolvedPublisherAddress = await resolveAddress(publisherAddress);
    const contractStructs =
      await this.publisher.readContract.getPublishedContractVersions(
        resolvedPublisherAddress,
        contractId,
      );
    if (contractStructs.length === 0) {
      throw Error("Not found");
    }
    return contractStructs.map((d) => this.toPublishedContract(d));
  }

  public async getVersion(
    publisherAddress: AddressOrEns,
    contractId: string,
    version = "latest",
  ): Promise<PublishedContract | undefined> {
    const resolvedPublisherAddress = await resolveAddress(publisherAddress);
    if (version === "latest") {
      return this.getLatest(resolvedPublisherAddress, contractId);
    }
    const allVersions = await this.getAllVersions(
      resolvedPublisherAddress,
      contractId,
    );
    // get the metadata for each version
    const versionMetadata = await Promise.all(
      allVersions.map((contract) => this.fetchPublishedContractInfo(contract)),
    );
    // find the version that matches the version string
    const versionMatch = versionMetadata.find(
      (metadata) => metadata.publishedMetadata.version === version,
    );
    invariant(versionMatch, "Contract version not found");
    // match the version back to the contract based on the published timestamp
    return allVersions.find(
      (contract) => contract.timestamp === versionMatch.publishedTimestamp,
    );
  }

  public async getLatest(
    publisherAddress: AddressOrEns,
    contractId: string,
  ): Promise<PublishedContract | undefined> {
    const resolvedPublisherAddress = await resolveAddress(publisherAddress);
    const model = await this.publisher.readContract.getPublishedContract(
      resolvedPublisherAddress,
      contractId,
    );
    if (model && model.publishMetadataUri) {
      return this.toPublishedContract(model);
    }
    return undefined;
  }

  publish = buildTransactionFunction(
    async (
      predeployUri: string,
      extraMetadata: ExtraPublishMetadata,
    ): Promise<Transaction<TransactionResult<PublishedContract>>> => {
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

      return Transaction.fromContractWrapper({
        contractWrapper: this.publisher,
        method: "publishContract",
        args: [
          publisher,
          contractId,
          fullMetadataUri,
          predeployMetadata.metadataUri,
          bytecodeHash,
          constants.AddressZero,
        ],
        parse: (receipt) => {
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
        },
      });
    },
  );

  unpublish = buildTransactionFunction(
    async (
      publisher: AddressOrEns,
      contractId: string,
    ): Promise<Transaction<TransactionResult>> => {
      const resolvedPublisher = await resolveAddress(publisher);
      return Transaction.fromContractWrapper({
        contractWrapper: this.publisher,
        method: "unpublishContract",
        args: [resolvedPublisher, contractId],
      });
    },
  );

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
