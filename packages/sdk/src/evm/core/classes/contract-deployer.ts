import {
  extractConstructorParamsFromAbi,
  extractFunctionParamsFromAbi,
  fetchExtendedReleaseMetadata,
  fetchPreDeployMetadata,
} from "../../common";
import { getDeployArguments } from "../../common/deploy";
import {
  ChainId,
  EventType,
  getContractAddressByChainId,
  getNativeTokenByChainId,
} from "../../constants";
import {
  EditionDropInitializer,
  EditionInitializer,
  getContractName,
  MarketplaceInitializer,
  MarketplaceV3Initializer,
  MultiwrapInitializer,
  NFTCollectionInitializer,
  NFTDropInitializer,
  PackInitializer,
  PREBUILT_CONTRACTS_MAP,
  SignatureDropInitializer,
  SplitInitializer,
  TokenDropInitializer,
  TokenInitializer,
  VoteInitializer,
} from "../../contracts";
import { SDKOptions } from "../../schema";
import {
  DeployEvent,
  DeployEvents,
  DeployMetadata,
  DeployOptions,
  MarketplaceContractDeployMetadata,
  MarketplaceV3ContractDeployMetadata,
  MultiwrapContractDeployMetadata,
  NFTContractDeployMetadata,
  SplitContractDeployMetadata,
  TokenContractDeployMetadata,
  VoteContractDeployMetadata,
} from "../../types";
import { ThirdwebSDK } from "../sdk";
import {
  ContractType,
  DeploySchemaForPrebuiltContractType,
  NetworkInput,
  PrebuiltContractType,
} from "../types";
import { ContractFactory } from "./factory";
import { ContractRegistry } from "./registry";
import { RPCConnectionHandler } from "./rpc-connection-handler";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import {
  BigNumber,
  BytesLike,
  Contract,
  ContractInterface,
  ethers,
} from "ethers";
import { EventEmitter } from "eventemitter3";
import invariant from "tiny-invariant";
import { z } from "zod";

const THIRDWEB_DEPLOYER = "0xdd99b75f095d0c4d5112aCe938e4e6ed962fb024";

/**
 * Handles deploying new contracts
 * @public
 */
export class ContractDeployer extends RPCConnectionHandler {
  /**
   * @internal
   * should never be accessed directly, use {@link ContractDeployer.getFactory} instead
   */
  private _factory: Promise<ContractFactory | undefined> | undefined;
  /**
   * @internal
   * should never be accessed directly, use {@link ContractDeployer.getRegistry} instead
   */
  private _registry: Promise<ContractRegistry | undefined> | undefined;
  private storage: ThirdwebStorage;
  private events: EventEmitter<DeployEvents>;
  private deployMetadataCache: Record<string, any> = {};
  private transactionListener = (event: any) => {
    if (event.status === "submitted") {
      this.events.emit("contractDeployed", {
        status: "submitted",
        transactionHash: event.transactionHash,
      });
    }
  };

  constructor(
    network: NetworkInput,
    options: SDKOptions,
    storage: ThirdwebStorage,
  ) {
    super(network, options);
    this.storage = storage;
    this.events = new EventEmitter();
    // Initialize factory and registry (we don't need to make these calls async)
    this.getFactory();
    this.getRegistry();
  }

  /**
   * Deploys an NFT Collection contract
   *
   * @remarks Deploys an NFT Collection contract and returns the address of the deployed contract
   *
   * @example
   * ```javascript
   * const contractAddress = await sdk.deployer.deployNFTCollection({
   *   name: "My Collection",
   *   primary_sale_recipient: "your-address",
   * });
   * ```
   * @param metadata - the contract metadata
   * @returns the address of the deployed contract
   */
  public async deployNFTCollection(
    metadata: NFTContractDeployMetadata,
  ): Promise<string> {
    return await this.deployBuiltInContract(
      NFTCollectionInitializer.contractType,
      metadata,
    );
  }

  /**
   * Deploys a new NFTDrop contract
   *
   * @remarks Deploys an NFT Drop contract and returns the address of the deployed contract
   *
   * @example
   * ```javascript
   * const contractAddress = await sdk.deployer.deployNFTDrop({
   *   name: "My Drop",
   *   primary_sale_recipient: "your-address",
   * });
   * ```
   * @param metadata - the contract metadata
   * @returns the address of the deployed contract
   */
  public async deployNFTDrop(
    metadata: NFTContractDeployMetadata,
  ): Promise<string> {
    return await this.deployBuiltInContract(
      NFTDropInitializer.contractType,
      metadata,
    );
  }

  /**
   * Deploys a new SignatureDrop contract
   *
   * @remarks Deploys a SignatureDrop contract and returns the address of the deployed contract
   *
   * @example
   * ```javascript
   * const contractAddress = await sdk.deployer.deploySignatureDrop({
   *   name: "My Signature Drop",
   *   primary_sale_recipient: "your-address",
   * });
   * ```
   * @param metadata - the contract metadata
   * @returns the address of the deployed contract
   */
  public async deploySignatureDrop(
    metadata: NFTContractDeployMetadata,
  ): Promise<string> {
    return await this.deployBuiltInContract(
      SignatureDropInitializer.contractType,
      metadata,
    );
  }

  /**
   * Deploys a new Multiwrap contract
   *
   * @remarks Deploys a Multiwrap contract and returns the address of the deployed contract
   *
   * @example
   * ```javascript
   * const contractAddress = await sdk.deployer.deployMultiwrap({
   *   name: "My Multiwrap",
   * });
   * ```
   * @param metadata - the contract metadata
   * @returns the address of the deployed contract
   * @beta
   */
  public async deployMultiwrap(
    metadata: MultiwrapContractDeployMetadata,
  ): Promise<string> {
    return await this.deployBuiltInContract(
      MultiwrapInitializer.contractType,
      metadata,
    );
  }

  /**
   * Deploys a new Edition contract
   *
   * @remarks Deploys an Edition contract and returns the address of the deployed contract
   *
   * @example
   * ```javascript
   * const contractAddress = await sdk.deployer.deployEdition({
   *   name: "My Edition",
   *   primary_sale_recipient: "your-address",
   * });
   * ```
   * @param metadata - the contract metadata
   * @returns the address of the deployed contract
   */
  public async deployEdition(
    metadata: NFTContractDeployMetadata,
  ): Promise<string> {
    return await this.deployBuiltInContract(
      EditionInitializer.contractType,
      metadata,
    );
  }

  /**
   * Deploys a new EditionDrop contract
   *
   * @remarks Deploys an Edition Drop contract and returns the address of the deployed contract
   *
   * @example
   * ```javascript
   * const contractAddress = await sdk.deployer.deployEditionDrop({
   *   name: "My Edition Drop",
   *   primary_sale_recipient: "your-address",
   * });
   * ```
   * @param metadata - the contract metadata
   * @returns the address of the deployed contract
   */
  public async deployEditionDrop(
    metadata: NFTContractDeployMetadata,
  ): Promise<string> {
    return await this.deployBuiltInContract(
      EditionDropInitializer.contractType,
      metadata,
    );
  }

  /**
   * Deploys a new Token contract
   *
   * @remarks Deploys a Token contract and returns the address of the deployed contract
   *
   * @example
   * ```javascript
   * const contractAddress = await sdk.deployer.deployToken({
   *   name: "My Token",
   *   primary_sale_recipient: "your-address",
   * });
   * ```
   * @param metadata - the contract metadata
   * @returns the address of the deployed contract
   */
  public async deployToken(
    metadata: TokenContractDeployMetadata,
  ): Promise<string> {
    return await this.deployBuiltInContract(
      TokenInitializer.contractType,
      metadata,
    );
  }

  /**
   * Deploys a new Token Drop contract
   *
   * @remarks Deploys a Token Drop contract and returns the address of the deployed contract
   *
   * @example
   * ```javascript
   * const contractAddress = await sdk.deployer.deployTokenDrop({
   *   name: "My Token Drop",
   *   primary_sale_recipient: "your-address",
   * });
   * ```
   * @param metadata - the contract metadata
   * @returns the address of the deployed contract
   */
  public async deployTokenDrop(
    metadata: TokenContractDeployMetadata,
  ): Promise<string> {
    return await this.deployBuiltInContract(
      TokenDropInitializer.contractType,
      metadata,
    );
  }

  /**
   * Deploys a new Marketplace contract
   *
   * @remarks Deploys a Marketplace contract and returns the address of the deployed contract
   *
   * @example
   * ```javascript
   * const contractAddress = await sdk.deployer.deployMarketplace({
   *   name: "My Marketplace",
   *   primary_sale_recipient: "your-address",
   * });
   * ```
   * @param metadata - the contract metadata
   * @returns the address of the deployed contract
   */
  public async deployMarketplace(
    metadata: MarketplaceContractDeployMetadata,
  ): Promise<string> {
    return await this.deployBuiltInContract(
      MarketplaceInitializer.contractType,
      metadata,
    );
  }

  /**
   * Deploys a new Marketplace-V3 contract
   *
   * @remarks Deploys a Marketplace-V3 contract and returns the address of the deployed contract
   *
   * @example
   * ```javascript
   * const contractAddress = await sdk.deployer.deployMarketplaceV3({
   *   name: "My Marketplace",
   *   primary_sale_recipient: "your-address",
   * });
   * ```
   * @param metadata - the contract metadata
   * @returns the address of the deployed contract
   */
  public async deployMarketplaceV3(
    metadata: MarketplaceV3ContractDeployMetadata,
  ): Promise<string> {
    return await this.deployBuiltInContract(
      MarketplaceV3Initializer.contractType,
      metadata,
    );
  }

  /**
   * Deploys a new Pack contract
   *
   * @remarks Deploys a Pack contract and returns the address of the deployed contract
   *
   * @example
   * ```javascript
   * const contractAddress = await sdk.deployer.deployPack({
   *   name: "My Pack",
   *   primary_sale_recipient: "your-address",
   * });
   * ```
   * @param metadata - the contract metadata
   * @returns the address of the deployed contract
   */
  public async deployPack(
    metadata: NFTContractDeployMetadata,
  ): Promise<string> {
    return await this.deployBuiltInContract(
      PackInitializer.contractType,
      metadata,
    );
  }

  /**
   * Deploys a new Split contract
   *
   * @remarks Deploys a Split contract and returns the address of the deployed contract
   *
   * @example
   * ```javascript
   * const contractAddress = await sdk.deployer.deploySplit({
   *   name: "My Split",
   *   primary_sale_recipient: "your-address",
   *   recipients: [
   *    {
   *      address: "your-address",
   *      sharesBps: 80 * 100, // 80%
   *    },
   *    {
   *      address: "another-address",
   *      sharesBps: 20 * 100, // 20%
   *    },
   *   ],
   * });
   * ```
   * @param metadata - the contract metadata
   * @returns the address of the deployed contract
   */
  public async deploySplit(
    metadata: SplitContractDeployMetadata,
  ): Promise<string> {
    return await this.deployBuiltInContract(
      SplitInitializer.contractType,
      metadata,
    );
  }

  /**
   * Deploys a new Vote contract
   *
   * @remarks Deploys an Vote contract and returns the address of the deployed contract
   *
   * @example
   * ```javascript
   * const contractAddress = await sdk.deployer.deployVote({
   *   name: "My Vote",
   *   primary_sale_recipient: "your-address",
   *   voting_token_address: "your-token-contract-address",
   * });
   * ```
   * @param metadata - the contract metadata
   * @returns the address of the deployed contract
   */
  public async deployVote(
    metadata: VoteContractDeployMetadata,
  ): Promise<string> {
    return await this.deployBuiltInContract(
      VoteInitializer.contractType,
      metadata,
    );
  }

  /**
   * Deploys a new contract
   *
   * @internal
   * @param contractType - the type of contract to deploy
   * @param contractMetadata - the metadata to deploy the contract with
   * @param version
   * @returns a promise of the address of the newly deployed contract
   */
  public async deployBuiltInContract<
    TContractType extends PrebuiltContractType,
  >(
    contractType: TContractType,
    contractMetadata: z.input<
      DeploySchemaForPrebuiltContractType<TContractType>
    >,
    version: string = "latest",
  ): Promise<string> {
    const signer = this.getSigner();
    invariant(signer, "A signer is required to deploy contracts");
    const parsedMetadata =
      PREBUILT_CONTRACTS_MAP[contractType].schema.deploy.parse(
        contractMetadata,
      );
    if (this.hasLocalFactory()) {
      // old behavior for unit tests, deploy from local factory
      // parse version into the first number of the version string (or undefined if unparseable)
      let parsedVersion: number | undefined = undefined;
      try {
        parsedVersion = parseInt(version);
        if (isNaN(parsedVersion)) {
          parsedVersion = undefined;
        }
      } catch (e) {
        parsedVersion = undefined;
      }
      const factory = await this.getFactory();
      if (!factory) {
        throw new Error("Factory not found");
      }
      factory.on(EventType.Transaction, this.transactionListener);
      const deployedAddress = await factory.deploy(
        contractType,
        parsedMetadata,
        this.events,
        parsedVersion,
      );
      factory.off(EventType.Transaction, this.transactionListener);
      return deployedAddress;
    }

    // For all other chains, fetch from published contracts
    // resolve contract name from type
    const contractName = getContractName(contractType);
    invariant(contractName, "Contract name not found");
    // first upload the contract metadata
    const contractURI = await this.storage.upload(parsedMetadata);
    // then get the deploy arguments
    const constructorParams = await getDeployArguments(
      contractType,
      parsedMetadata,
      contractURI,
      signer,
    );

    const activeChainId = (await this.getProvider().getNetwork()).chainId;
    // fetch the publish URI from the ContractPublisher contract
    const publishedContract = await this.fetchPublishedContractFromPolygon(
      THIRDWEB_DEPLOYER,
      contractName,
      version,
    );
    // fetch the deploy metadata from the publish URI
    const deployMeta = await this.fetchAndCacheDeployMetadata(
      publishedContract.metadataUri,
    );
    let implementationAddress =
      deployMeta.extendedMetadata?.factoryDeploymentData
        ?.implementationAddresses?.[activeChainId];

    if (implementationAddress) {
      // implementation exists on the current chain, continue with normal flow
      return this.deployContractFromUri(publishedContract.metadataUri, constructorParams);
    } else {
      // implementation does NOT exist on chain, deploy the implementation first, then deploy a proxy
      implementationAddress = await this.deployContractFromUri(
        publishedContract.metadataUri,
        this.getConstructorParamsForImplementation(contractType, activeChainId),
        {
          forceDirectDeploy: true,
        },
      );
      return this.deployProxy(
        implementationAddress,
        deployMeta.compilerMetadata.abi,
        "initialize",
        constructorParams,
      );
    }
  }

  /**
   * @internal
   * @param contractType
   */
  public async getLatestBuiltInContractVersion<
    TContractType extends PrebuiltContractType,
  >(contractType: TContractType) {
    const factory = await this.getFactory();
    if (!factory) {
      throw new Error("Factory not found");
    }
    return await factory.getLatestVersion(contractType);
  }

  /**
   * Deploy any published contract by its name
   * @param publisherAddress the address of the publisher
   * @param contractName the name of the contract to deploy
   * @param constructorParams the constructor params to pass to the contract
   */
  public async deployReleasedContract(
    publisherAddress: string,
    contractName: string,
    constructorParams: any[],
    version = "latest",
    options?: DeployOptions,
  ): Promise<string> {
    const publishedContract = await this.fetchPublishedContractFromPolygon(
      publisherAddress,
      contractName,
      version,
    );
    return await this.deployContractFromUri(
      publishedContract.metadataUri,
      constructorParams,
      options,
    );
  }

  /**
   * Deploy a proxy contract of a given implementation via the given factory
   * @param factoryAddress
   * @param implementationAddress
   * @param implementationAbi
   * @param initializerFunction
   * @param initializerArgs
   */
  public async deployViaFactory(
    factoryAddress: string,
    implementationAddress: string,
    implementationAbi: ContractInterface,
    initializerFunction: string,
    initializerArgs: any[],
  ): Promise<string> {
    const signer = this.getSigner();
    invariant(signer, "signer is required");
    // TODO only require factory interface here - IProxyFactory
    const proxyFactory = new ContractFactory(
      factoryAddress,
      this.getSignerOrProvider(),
      this.storage,
      this.options,
    );
    proxyFactory.on(EventType.Transaction, this.transactionListener);
    const deployedAddress = await proxyFactory.deployProxyByImplementation(
      implementationAddress,
      implementationAbi,
      initializerFunction,
      initializerArgs,
      this.events,
    );
    proxyFactory.off(EventType.Transaction, this.transactionListener);
    return deployedAddress;
  }

  /**
   * Deploy a proxy contract of a given implementation directly
   * @param implementationAddress
   * @param implementationAbi
   * @param initializerFunction
   * @param initializerArgs
   */
  public async deployProxy(
    implementationAddress: string,
    implementationAbi: ContractInterface,
    initializerFunction: string,
    initializerArgs: any[],
  ): Promise<string> {
    const encodedInitializer = Contract.getInterface(
      implementationAbi,
    ).encodeFunctionData(initializerFunction, initializerArgs);
    const { TWProxy__factory } = await import(
      "@thirdweb-dev/contracts-js/factories/TWProxy__factory"
    );
    return this.deployContractWithAbi(
      TWProxy__factory.abi,
      TWProxy__factory.bytecode,
      [implementationAddress, encodedInitializer],
    );
  }

  /**
   * @internal
   */
  public async getRegistry(): Promise<ContractRegistry | undefined> {
    // if we already have a registry just return it back
    if (this._registry) {
      return this._registry;
    }

    // otherwise get the registry address for the active chain and get a new one

    // have to do it like this otherwise we run it over and over and over
    // "this._registry" has to be assigned to the promise upfront.
    return (this._registry = this.getProvider()
      .getNetwork()
      .then(async ({ chainId }) => {
        const registryAddress = getContractAddressByChainId(
          chainId,
          "twRegistry",
        );
        if (!registryAddress) {
          return undefined;
        }
        return new ContractRegistry(
          registryAddress,
          this.getSignerOrProvider(),
          this.options,
        );
      }));
  }

  private async getFactory(): Promise<ContractFactory | undefined> {
    // if we already have a factory just return it back
    if (this._factory) {
      return this._factory;
    }

    // otherwise get the factory address for the active chain and get a new one

    // have to do it like this otherwise we run it over and over and over
    // "this._factory" has to be assigned to the promise upfront.
    return (this._factory = this.getProvider()
      .getNetwork()
      .then(async ({ chainId }) => {
        const factoryAddress = getContractAddressByChainId(
          chainId,
          "twFactory",
        );
        if (!factoryAddress) {
          return undefined;
        }
        const factory = new ContractFactory(
          factoryAddress,
          this.getSignerOrProvider(),
          this.storage,
          this.options,
        );
        return factory;
      }));
  }

  public override updateSignerOrProvider(network: NetworkInput) {
    super.updateSignerOrProvider(network);
    this.updateContractSignerOrProvider();
  }

  private updateContractSignerOrProvider() {
    // has to be promises now
    this._factory
      ?.then((factory) => {
        factory?.updateSignerOrProvider(this.getSignerOrProvider());
      })
      .catch(() => {
        // ignore
      });
    // has to be promises now
    this._registry
      ?.then((registry) => {
        registry?.updateSignerOrProvider(this.getSignerOrProvider());
      })
      .catch(() => {
        // ignore
      });
  }

  /**
   * @internal
   * @param publishMetadataUri
   * @param constructorParamValues
   * @param options
   */
  public async deployContractFromUri(
    publishMetadataUri: string,
    constructorParamValues: any[],
    options?: DeployOptions,
  ) {
    const signer = this.getSigner();
    invariant(signer, "A signer is required");
    const { compilerMetadata, extendedMetadata } =
      await this.fetchAndCacheDeployMetadata(publishMetadataUri);
    const forceDirectDeploy = options?.forceDirectDeploy || false;
    if (
      extendedMetadata &&
      extendedMetadata.factoryDeploymentData &&
      (extendedMetadata.isDeployableViaProxy ||
        extendedMetadata.isDeployableViaFactory) &&
      !forceDirectDeploy
    ) {
      const chainId = (await this.getProvider().getNetwork()).chainId;
      invariant(
        extendedMetadata.factoryDeploymentData.implementationAddresses,
        "implementationAddresses is required",
      );
      const implementationAddress =
        extendedMetadata.factoryDeploymentData.implementationAddresses[chainId];

      invariant(
        implementationAddress,
        `implementationAddress not found for chainId '${chainId}'`,
      );
      invariant(
        extendedMetadata.factoryDeploymentData
          .implementationInitializerFunction,
        `implementationInitializerFunction not set'`,
      );
      const initializerParamTypes = extractFunctionParamsFromAbi(
        compilerMetadata.abi,
        extendedMetadata.factoryDeploymentData
          .implementationInitializerFunction,
      ).map((p) => p.type);
      const paramValues = this.convertParamValues(
        initializerParamTypes,
        constructorParamValues,
      );

      if (extendedMetadata.isDeployableViaFactory) {
        // deploy via a factory (prioritise factory)
        invariant(
          extendedMetadata.factoryDeploymentData.factoryAddresses,
          "isDeployableViaFactory is true so factoryAddresses is required",
        );
        const factoryAddress =
          extendedMetadata.factoryDeploymentData.factoryAddresses[chainId];
        invariant(
          factoryAddress,
          `isDeployableViaFactory is true and factoryAddress not found for chainId '${chainId}'`,
        );
        return await this.deployViaFactory(
          factoryAddress,
          implementationAddress,
          compilerMetadata.abi,
          extendedMetadata.factoryDeploymentData
            .implementationInitializerFunction,
          paramValues,
        );
      } else if (extendedMetadata.isDeployableViaProxy) {
        // deploy a proxy directly
        return await this.deployProxy(
          implementationAddress,
          compilerMetadata.abi,
          extendedMetadata.factoryDeploymentData
            .implementationInitializerFunction,
          paramValues,
        );
      }
    }

    const bytecode = compilerMetadata.bytecode.startsWith("0x")
      ? compilerMetadata.bytecode
      : `0x${compilerMetadata.bytecode}`;
    if (!ethers.utils.isHexString(bytecode)) {
      throw new Error(`Contract bytecode is invalid.\n\n${bytecode}`);
    }
    const constructorParamTypes = extractConstructorParamsFromAbi(
      compilerMetadata.abi,
    ).map((p) => p.type);
    const paramValues = this.convertParamValues(
      constructorParamTypes,
      constructorParamValues,
    );
    return this.deployContractWithAbi(
      compilerMetadata.abi,
      bytecode,
      paramValues,
    );
  }

  /**
   * @internal
   * @param abi
   * @param bytecode
   * @param constructorParams
   */
  public async deployContractWithAbi(
    abi: ContractInterface,
    bytecode: BytesLike | { object: string },
    constructorParams: Array<any>,
  ): Promise<string> {
    const signer = this.getSigner();
    invariant(signer, "Signer is required to deploy contracts");
    const deployer = await new ethers.ContractFactory(abi, bytecode)
      .connect(signer)
      .deploy(...constructorParams);
    this.events.emit("contractDeployed", {
      status: "submitted",
      transactionHash: deployer.deployTransaction.hash,
    });
    const deployedContract = await deployer.deployed();
    this.events.emit("contractDeployed", {
      status: "completed",
      contractAddress: deployedContract.address,
      transactionHash: deployedContract.deployTransaction.hash,
    });
    return deployedContract.address;
  }

  /**
   * Listen to all deploy transactions from this deployer
   * @param listener the listener to add
   */
  public addDeployListener(listener: (event: DeployEvent) => void) {
    this.events.on("contractDeployed", listener);
  }

  /**
   * Remove a deploy listener
   * @param listener the listener to remove
   */
  public removeDeployListener(listener: (event: DeployEvent) => void) {
    this.events.off("contractDeployed", listener);
  }

  /**
   * Remove all deploy listeners
   */
  public removeAllDeployListeners() {
    this.events.removeAllListeners("contractDeployed");
  }

  // PRIVATE METHODS

  private async fetchAndCacheDeployMetadata(
    publishMetadataUri: string,
  ): Promise<DeployMetadata> {
    if (this.deployMetadataCache[publishMetadataUri]) {
      return this.deployMetadataCache[publishMetadataUri];
    }
    const compilerMetadata = await fetchPreDeployMetadata(
      publishMetadataUri,
      this.storage,
    );
    let extendedMetadata;
    try {
      extendedMetadata = await fetchExtendedReleaseMetadata(
        publishMetadataUri,
        this.storage,
      );
    } catch (e) {
      // not a factory deployment, ignore
    }
    const data = {
      compilerMetadata,
      extendedMetadata,
    };
    this.deployMetadataCache[publishMetadataUri] = data;
    return data;
  }

  private async fetchPublishedContractFromPolygon(
    publisherAddress: string,
    contractName: string,
    version: string,
  ) {
    const publishedContract = await new ThirdwebSDK("polygon")
      .getPublisher()
      .getVersion(publisherAddress, contractName, version);
    if (!publishedContract) {
      throw new Error(
        `No published contract found for '${contractName}' at version '${version}' by '${publisherAddress}'`,
      );
    }
    return publishedContract;
  }

  private getConstructorParamsForImplementation(
    contractType: ContractType,
    chainId: number,
  ) {
    switch (contractType) {
      case MarketplaceInitializer.contractType:
      case MultiwrapInitializer.contractType:
        const nativeTokenWrapperAddress = getNativeTokenByChainId(
          ChainId.Hardhat,
        ).wrapped.address;
        return [nativeTokenWrapperAddress];
      case PackInitializer.contractType:
        const addr = getNativeTokenByChainId(chainId).wrapped.address;
        return [addr, ethers.constants.AddressZero];
      default:
        return [];
    }
  }

  private hasLocalFactory() {
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    return process.env.factoryAddress !== undefined;
  }

  private convertParamValues(
    constructorParamTypes: string[],
    constructorParamValues: any[],
  ) {
    // check that both arrays are same length
    if (constructorParamTypes.length !== constructorParamValues.length) {
      throw Error(
        `Passed the wrong number of constructor arguments: ${constructorParamValues.length}, expected ${constructorParamTypes.length}`,
      );
    }
    return constructorParamTypes.map((p, index) => {
      if (p === "tuple" || p.endsWith("[]")) {
        if (typeof constructorParamValues[index] === "string") {
          return JSON.parse(constructorParamValues[index]);
        } else {
          return constructorParamValues[index];
        }
      }
      if (p === "bytes32") {
        invariant(
          ethers.utils.isHexString(constructorParamValues[index]),
          `Could not parse bytes32 value. Expected valid hex string but got "${constructorParamValues[index]}".`,
        );
        return ethers.utils.hexZeroPad(constructorParamValues[index], 32);
      }
      if (p.startsWith("bytes")) {
        invariant(
          ethers.utils.isHexString(constructorParamValues[index]),
          `Could not parse bytes value. Expected valid hex string but got "${constructorParamValues[index]}".`,
        );
        return constructorParamValues[index];
      }
      if (p.startsWith("uint") || p.startsWith("int")) {
        return BigNumber.from(constructorParamValues[index].toString());
      }
      return constructorParamValues[index];
    });
  }
}
