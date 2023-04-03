import {
  extractConstructorParamsFromAbi,
  extractFunctionParamsFromAbi,
  fetchExtendedReleaseMetadata,
  fetchPreDeployMetadata,
} from "../../common";
import { bytecode as WETHBytecode } from "../../common/WETH9";
import {
  computeDeploymentAddress,
  deployContractDeterministic,
  deployerAbi,
  deployerBytecode,
  getInitBytecodeWithSalt,
} from "../../common/any-evm-utils";
import {
  deployCreate2Factory,
  getCreate2FactoryDeploymentInfo,
  isEIP155Enforced,
} from "../../common/any-evm-utils";
import { getDeployArguments } from "../../common/deploy";
import { resolveAddress } from "../../common/ens";
import {
  buildDeployTransactionFunction,
  buildTransactionFunction,
} from "../../common/transactions";
import {
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
  PREBUILT_CONTRACTS_APPURI_MAP,
  PREBUILT_CONTRACTS_MAP,
  SignatureDropInitializer,
  SplitInitializer,
  TokenDropInitializer,
  TokenInitializer,
  VoteInitializer,
} from "../../contracts";
import {
  Address,
  AddressOrEns,
  PreDeployMetadataFetched,
  SDKOptions,
} from "../../schema";
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
  DeploySchemaForPrebuiltContractType,
  InfraContractType,
  NetworkInput,
  PrebuiltContractType,
} from "../types";
import { ContractFactory } from "./factory";
import { ContractRegistry } from "./registry";
import { RPCConnectionHandler } from "./rpc-connection-handler";
import { DeployTransaction, Transaction } from "./transactions";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import {
  BigNumber,
  BytesLike,
  Contract,
  ContractInterface,
  ethers,
  Signer,
} from "ethers";
import { EventEmitter } from "eventemitter3";
import invariant from "tiny-invariant";
import { z } from "zod";
import {
  DeploymentInfo,
  PrecomputedDeploymentData,
} from "../../types/any-evm/deploy-data";
import {
  CloneFactory,
  EOAForwarder,
  Forwarder,
  INFRA_CONTRACTS_MAP,
  NativeTokenWrapper,
} from "../../common/infra-data";

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
  private infraContractURICache: Record<string, string> = {};
  private infraContractsInfoCache: Record<
    number,
    Record<string, PrecomputedDeploymentData>
  > = {};
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
  deployNFTCollection = buildDeployTransactionFunction(
    async (metadata: NFTContractDeployMetadata): Promise<DeployTransaction> => {
      return await this.deployBuiltInContract.prepare(
        NFTCollectionInitializer.contractType,
        metadata,
      );
    },
  );

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
  deployNFTDrop = buildDeployTransactionFunction(
    async (metadata: NFTContractDeployMetadata): Promise<DeployTransaction> => {
      return await this.deployBuiltInContract.prepare(
        NFTDropInitializer.contractType,
        metadata,
      );
    },
  );

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
  deploySignatureDrop = buildDeployTransactionFunction(
    async (metadata: NFTContractDeployMetadata): Promise<DeployTransaction> => {
      return await this.deployBuiltInContract.prepare(
        SignatureDropInitializer.contractType,
        metadata,
      );
    },
  );

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
  deployMultiwrap = buildDeployTransactionFunction(
    async (
      metadata: MultiwrapContractDeployMetadata,
    ): Promise<DeployTransaction> => {
      return await this.deployBuiltInContract.prepare(
        MultiwrapInitializer.contractType,
        metadata,
      );
    },
  );

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
  deployEdition = buildDeployTransactionFunction(
    async (metadata: NFTContractDeployMetadata): Promise<DeployTransaction> => {
      return await this.deployBuiltInContract.prepare(
        EditionInitializer.contractType,
        metadata,
      );
    },
  );

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
  deployEditionDrop = buildDeployTransactionFunction(
    async (metadata: NFTContractDeployMetadata): Promise<DeployTransaction> => {
      return await this.deployBuiltInContract.prepare(
        EditionDropInitializer.contractType,
        metadata,
      );
    },
  );

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
  deployToken = buildDeployTransactionFunction(
    async (
      metadata: TokenContractDeployMetadata,
    ): Promise<DeployTransaction> => {
      return await this.deployBuiltInContract.prepare(
        TokenInitializer.contractType,
        metadata,
      );
    },
  );

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
  deployTokenDrop = buildDeployTransactionFunction(
    async (
      metadata: TokenContractDeployMetadata,
    ): Promise<DeployTransaction> => {
      return await this.deployBuiltInContract.prepare(
        TokenDropInitializer.contractType,
        metadata,
      );
    },
  );

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
  deployMarketplace = buildDeployTransactionFunction(
    async (
      metadata: MarketplaceContractDeployMetadata,
    ): Promise<DeployTransaction> => {
      return await this.deployBuiltInContract.prepare(
        MarketplaceInitializer.contractType,
        metadata,
      );
    },
  );

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
  deployMarketplaceV3 = buildDeployTransactionFunction(
    async (
      metadata: MarketplaceV3ContractDeployMetadata,
    ): Promise<DeployTransaction> => {
      return await this.deployBuiltInContract.prepare(
        MarketplaceV3Initializer.contractType,
        metadata,
      );
    },
  );

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
  deployPack = buildDeployTransactionFunction(
    async (metadata: NFTContractDeployMetadata): Promise<DeployTransaction> => {
      return await this.deployBuiltInContract.prepare(
        PackInitializer.contractType,
        metadata,
      );
    },
  );

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
  deploySplit = buildDeployTransactionFunction(
    async (
      metadata: SplitContractDeployMetadata,
    ): Promise<DeployTransaction> => {
      return await this.deployBuiltInContract.prepare(
        SplitInitializer.contractType,
        metadata,
      );
    },
  );

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
  deployVote = buildDeployTransactionFunction(
    async (
      metadata: VoteContractDeployMetadata,
    ): Promise<DeployTransaction> => {
      return await this.deployBuiltInContract.prepare(
        VoteInitializer.contractType,
        metadata,
      );
    },
  );

  /**
   * Deploys a new contract
   *
   * @internal
   * @param contractType - the type of contract to deploy
   * @param contractMetadata - the metadata to deploy the contract with
   * @param version
   * @returns a promise of the address of the newly deployed contract
   */
  deployBuiltInContract = buildDeployTransactionFunction(
    async <TContractType extends PrebuiltContractType>(
      contractType: TContractType,
      contractMetadata: z.input<
        DeploySchemaForPrebuiltContractType<TContractType>
      >,
      version: string = "latest",
    ): Promise<DeployTransaction> => {
      const signer = this.getSigner();
      invariant(signer, "A signer is required to deploy contracts");

      const parsedMetadata = {
        app_uri: PREBUILT_CONTRACTS_APPURI_MAP[contractType],
        ...(await PREBUILT_CONTRACTS_MAP[contractType].schema.deploy.parseAsync(
          contractMetadata,
        )),
      };

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
        return factory.deploy.prepare(
          contractType,
          parsedMetadata,
          this.events,
          parsedVersion,
          () => {
            factory.off(EventType.Transaction, this.transactionListener);
          },
        ) as unknown as DeployTransaction;
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

      // fetch the publish URI from the ContractPublisher contract
      const publishedContract = await this.fetchPublishedContractFromPolygon(
        THIRDWEB_DEPLOYER,
        contractName,
        version,
      );

      return this.deployContractFromUri.prepare(
        publishedContract.metadataUri,
        constructorParams,
      );
    },
  );

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
  deployReleasedContract = buildDeployTransactionFunction(
    async (
      publisherAddress: AddressOrEns,
      contractName: string,
      constructorParams: any[],
      version = "latest",
      options?: DeployOptions,
    ): Promise<DeployTransaction> => {
      const publishedContract = await this.fetchPublishedContractFromPolygon(
        publisherAddress,
        contractName,
        version,
      );
      return await this.deployContractFromUri.prepare(
        publishedContract.metadataUri,
        constructorParams,
        options,
      );
    },
  );

  /**
   * Deploy a proxy contract of a given implementation via the given factory
   * @param factoryAddress
   * @param implementationAddress
   * @param implementationAbi
   * @param initializerFunction
   * @param initializerArgs
   */
  deployViaFactory = buildTransactionFunction(
    async (
      factoryAddress: AddressOrEns,
      implementationAddress: AddressOrEns,
      implementationAbi: ContractInterface,
      initializerFunction: string,
      initializerArgs: any[],
    ): Promise<Transaction<Address>> => {
      const resolvedFactoryAddress = await resolveAddress(factoryAddress);
      const resolvedImplementationAddress = await resolveAddress(
        implementationAddress,
      );

      const signer = this.getSigner();
      invariant(signer, "signer is required");
      // TODO only require factory interface here - IProxyFactory
      const proxyFactory = new ContractFactory(
        resolvedFactoryAddress,
        this.getSignerOrProvider(),
        this.storage,
        this.options,
      );
      proxyFactory.on(EventType.Transaction, this.transactionListener);
      return await proxyFactory.deployProxyByImplementation.prepare(
        resolvedImplementationAddress,
        implementationAbi,
        initializerFunction,
        initializerArgs,
        this.events,
        () => {
          proxyFactory.off(EventType.Transaction, this.transactionListener);
        },
      );
    },
  );

  /**
   * Deploy a proxy contract of a given implementation directly
   * @param implementationAddress
   * @param implementationAbi
   * @param initializerFunction
   * @param initializerArgs
   */
  deployProxy = buildDeployTransactionFunction(
    async (
      implementationAddress: AddressOrEns,
      implementationAbi: ContractInterface,
      initializerFunction: string,
      initializerArgs: any[],
    ): Promise<DeployTransaction> => {
      const resolvedAddress = await resolveAddress(implementationAddress);
      const encodedInitializer = Contract.getInterface(
        implementationAbi,
      ).encodeFunctionData(initializerFunction, initializerArgs);
      const { TWProxy__factory } = await import(
        "@thirdweb-dev/contracts-js/factories/TWProxy__factory"
      );
      return this.deployContractWithAbi.prepare(
        TWProxy__factory.abi,
        TWProxy__factory.bytecode,
        [resolvedAddress, encodedInitializer],
      );
    },
  );

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
  deployContractFromUri = buildDeployTransactionFunction(
    async (
      publishMetadataUri: string,
      constructorParamValues: any[],
      options?: DeployOptions,
    ): Promise<DeployTransaction> => {
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

        let implementationAddress = extendedMetadata.factoryDeploymentData
          .implementationAddresses[chainId] as AddressOrEns;

        if (implementationAddress) {
          const resolvedImplementationAddress = await resolveAddress(
            implementationAddress,
          );

          invariant(
            resolvedImplementationAddress,
            `implementationAddress not found for chainId '${chainId}'`,
          );

          if (extendedMetadata.isDeployableViaFactory) {
            // deploy via a factory (prioritise factory)
            invariant(
              extendedMetadata.factoryDeploymentData.factoryAddresses,
              "isDeployableViaFactory is true so factoryAddresses is required",
            );
            const factoryAddress = extendedMetadata.factoryDeploymentData
              .factoryAddresses[chainId] as AddressOrEns;
            invariant(
              factoryAddress,
              `isDeployableViaFactory is true and factoryAddress not found for chainId '${chainId}'`,
            );
            const resolvedFactoryAddress = await resolveAddress(factoryAddress);
            return (await this.deployViaFactory.prepare(
              resolvedFactoryAddress,
              resolvedImplementationAddress,
              compilerMetadata.abi,
              extendedMetadata.factoryDeploymentData
                .implementationInitializerFunction,
              paramValues,
            )) as unknown as DeployTransaction;
          } else if (extendedMetadata.isDeployableViaProxy) {
            // deploy a proxy directly
            return await this.deployProxy.prepare(
              resolvedImplementationAddress,
              compilerMetadata.abi,
              extendedMetadata.factoryDeploymentData
                .implementationInitializerFunction,
              paramValues,
            );
          }
        } else {
          // any evm deployment flow -- with signer
          // 0. Cache Infra contracts data
          await this.computeAndCacheInfraContractsData();
          console.log("computed and cached infra");
          console.log(this.infraContractsInfoCache);

          // 1. Deploy CREATE2 factory (if not already exists)
          console.log("deploying create2 factory");
          const create2Factory = await deployCreate2Factory(
            this.getSigner() as Signer,
          );

          // 2. get deployment info for any evm
          console.log("getting deployment info");
          const deploymentInfo = await this.getDeploymentInfo(
            publishMetadataUri,
            chainId,
          );

          implementationAddress = deploymentInfo.predictedAddress;

          console.log("deploying infra");
          // 3. deploy infra
          await this.deployInfraWithSigner(
            deploymentInfo.infraContractsToDeploy,
          );

          console.log(
            "deploying implementation at address: ",
            deploymentInfo.predictedAddress,
          );
          // 4. deploy implementation contract
          await deployContractDeterministic(
            this.getSigner() as Signer,
            deploymentInfo.bytecode,
            deploymentInfo.encodedArgs,
            create2Factory,
            deploymentInfo.predictedAddress,
          );

          const resolvedImplementationAddress = await resolveAddress(
            implementationAddress,
          );

          console.log("deploying proxy");
          // 5. deploy proxy with TWStatelessFactory (Clone factory) and return address
          return (await this.deployViaFactory.prepare(
            this.infraContractsInfoCache[chainId][CloneFactory.contractType]
              .predictedAddress,
            resolvedImplementationAddress,
            compilerMetadata.abi,
            extendedMetadata.factoryDeploymentData
              .implementationInitializerFunction,
            paramValues,
          )) as unknown as DeployTransaction;
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
      return this.deployContractWithAbi.prepare(
        compilerMetadata.abi,
        bytecode,
        paramValues,
      );
    },
  );

  /**
   * @internal
   * @param abi
   * @param bytecode
   * @param constructorParams
   */
  deployContractWithAbi = buildDeployTransactionFunction(
    async (
      abi: ContractInterface,
      bytecode: BytesLike | { object: string },
      constructorParams: Array<any>,
    ): Promise<DeployTransaction> => {
      const signer = this.getSigner();
      const provider = this.getProvider();
      invariant(signer, "Signer is required to deploy contracts");
      const factory = new ethers.ContractFactory(abi, bytecode).connect(signer);

      return new DeployTransaction({
        args: constructorParams,
        provider,
        signer,
        factory,
        storage: this.storage,
        events: this.events,
      });
    },
  );

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

  async computeEOAForwarderAddress() {
    const chainId = (await this.getProvider().getNetwork()).chainId;
    return await this.computeAddressInfra(EOAForwarder.contractType, chainId);
  }

  async computeForwarderAddress() {
    const chainId = (await this.getProvider().getNetwork()).chainId;
    return await this.computeAddressInfra(Forwarder.contractType, chainId);
  }

  async computeCloneFactoryAddress() {
    const chainId = (await this.getProvider().getNetwork()).chainId;
    return await this.computeAddressInfra(CloneFactory.contractType, chainId);
  }

  async computeNativeTokenAddress() {
    const chainId = (await this.getProvider().getNetwork()).chainId;
    return this.computeAddressInfra(NativeTokenWrapper.contractType, chainId);
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
    publisherAddress: AddressOrEns,
    contractName: string,
    version: string,
  ) {
    const address = await resolveAddress(publisherAddress);
    const publishedContract = await new ThirdwebSDK("polygon")
      .getPublisher()
      .getVersion(address, contractName, version);
    if (!publishedContract) {
      throw new Error(
        `No published contract found for '${contractName}' at version '${version}' by '${address}'`,
      );
    }
    return publishedContract;
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

  private async computeAndCacheInfraContractsData() {
    const chainId = (await this.getProvider().getNetwork()).chainId;

    for (const value of Object.values(INFRA_CONTRACTS_MAP)) {
      this.computeAddressInfra(value.contractType, chainId);
    }
  }

  async computeAddressInfra(contractType: InfraContractType, chainId: number) {
    const contract = INFRA_CONTRACTS_MAP[contractType];
    if (
      !this.infraContractsInfoCache[chainId] ||
      !this.infraContractsInfoCache[chainId][contract.contractType]
    ) {
      if (contract.contractType === NativeTokenWrapper.contractType) {
        const address = await computeDeploymentAddress(
          WETHBytecode,
          [],
          await this.computeCreate2FactoryAddress(),
        );

        this.infraContractsInfoCache[chainId] = {
          ...this.infraContractsInfoCache[chainId],
          nativeTokenWrapper: {
            predictedAddress: address,
            bytecode: "",
            encodedArgs: "",
          },
        };
      } else {
        let uri = "";

        if (this.infraContractURICache[contract.contractType]) {
          uri = this.deployMetadataCache[contract.contractType];
        } else {
          // fetch the publish URI from the ContractPublisher contract
          const publishedContract = await new ThirdwebSDK("polygon")
            .getPublisher()
            .getVersion(THIRDWEB_DEPLOYER, contract.name);
          if (!publishedContract) {
            throw new Error(
              `No published contract found for ${contract.name} at version by '${THIRDWEB_DEPLOYER}'`,
            );
          }
          uri = publishedContract?.metadataUri;
        }

        const metadata = await this.fetchAndCacheDeployMetadata(uri);
        const encodedArgs = (
          await this.encodeConstructorParamsForImplementation(
            metadata.compilerMetadata,
            chainId,
          )
        ).encodedArgs;
        const address = await computeDeploymentAddress(
          metadata.compilerMetadata.bytecode,
          encodedArgs,
          await this.computeCreate2FactoryAddress(),
        );

        if (this.infraContractsInfoCache[chainId]) {
          this.infraContractsInfoCache[chainId][contract.contractType] = {
            predictedAddress: address,
            bytecode: metadata.compilerMetadata.bytecode,
            encodedArgs: encodedArgs,
          };
        } else {
          this.infraContractsInfoCache[chainId] = {
            [contract.contractType]: {
              predictedAddress: address,
              bytecode: metadata.compilerMetadata.bytecode,
              encodedArgs: encodedArgs,
            },
          };
        }
      }
    }

    return this.infraContractsInfoCache[chainId][contract.contractType]
      .predictedAddress;
  }

  private async computeCreate2FactoryAddress() {
    const chainId = (await this.getProvider().getNetwork()).chainId;

    if (
      !this.infraContractsInfoCache[chainId] ||
      !this.infraContractsInfoCache[chainId]["create2Factory"]
    ) {
      const enforceEip155 = await isEIP155Enforced(this.getProvider());

      const tempChainId = enforceEip155 ? chainId : 0;
      const deploymentInfo = getCreate2FactoryDeploymentInfo(tempChainId);

      this.infraContractsInfoCache[chainId] = {
        ...this.infraContractsInfoCache[chainId],
        create2Factory: {
          predictedAddress: deploymentInfo.deployment,
          bytecode: "",
          encodedArgs: [],
        },
      };
    }

    return this.infraContractsInfoCache[chainId]["create2Factory"]
      .predictedAddress;
  }

  /**
   * @internal
   *
   * Returns txn data for keyless deploys as well as signer deploys.
   * Also provides a list of infra contracts to deploy.
   *
   * @param metadataUri
   * @param activeChainId
   * @param storage
   */
  async getDeploymentInfo(
    metadataUri: string,
    activeChainId?: number,
  ): Promise<DeploymentInfo> {
    const compilerMetadata = await fetchPreDeployMetadata(
      metadataUri,
      this.storage,
    );
    const chainId = activeChainId
      ? activeChainId
      : (await this.getProvider().getNetwork()).chainId;

    // 1.  Get abi-encoded args and list of infra contracts required based on constructor params
    const { encodedArgs, infraContracts } =
      await this.encodeConstructorParamsForImplementation(
        compilerMetadata,
        chainId,
      );

    // 2. Compute the CREATE2 address
    const predictedAddress = await computeDeploymentAddress(
      compilerMetadata.bytecode,
      encodedArgs,
      await this.computeCreate2FactoryAddress(),
    );

    // 3. Add TWStatelessFactory and Forwarder to the list of infra contracts --
    // these must be deployed regardless of constructor params of implementation contract
    infraContracts.push(CloneFactory.contractType);

    return {
      bytecode: compilerMetadata.bytecode,
      encodedArgs: encodedArgs,
      predictedAddress: predictedAddress,
      infraContractsToDeploy: infraContracts,
    };
  }

  /**
   * @internal
   *
   * Determine constructor params required by an implementation contract.
   * Return abi-encoded params.
   */
  async encodeConstructorParamsForImplementation(
    compilerMetadata: PreDeployMetadataFetched,
    chainId: number,
  ) {
    const infraContracts: InfraContractType[] = [];
    const constructorParams = extractConstructorParamsFromAbi(
      compilerMetadata.abi,
    );

    const constructorParamTypes = constructorParams.map((p) => p.type);
    const constructorParamValues = await Promise.all(
      constructorParams.map(async (p) => {
        if (p.name && p.name.includes("nativeTokenWrapper")) {
          let nativeTokenWrapperAddress =
            getNativeTokenByChainId(chainId).wrapped.address;

          if (nativeTokenWrapperAddress === ethers.constants.AddressZero) {
            nativeTokenWrapperAddress = await this.computeNativeTokenAddress();
            infraContracts.push(NativeTokenWrapper.contractType);
          }

          return nativeTokenWrapperAddress;
        } else if (p.name && p.name.includes("trustedForwarder")) {
          if (
            compilerMetadata.analytics?.contract_name &&
            compilerMetadata.analytics.contract_name === "Pack"
          ) {
            infraContracts.push(EOAForwarder.contractType);
            const eoaForwarderAddress = await this.computeEOAForwarderAddress();
            return eoaForwarderAddress;
          }
          infraContracts.push(Forwarder.contractType);
          const forwarderAddress = await this.computeForwarderAddress();
          return forwarderAddress;
        } else {
          return "";
        }
      }),
    );

    const encodedArgs = ethers.utils.defaultAbiCoder.encode(
      constructorParamTypes,
      constructorParamValues,
    );
    return { encodedArgs, infraContracts };
  }

  /**
   * @internal
   *
   * Deploy Infra contracts with a signer.
   * The serialized txn data and addresses are precomputed for infra contracts.
   *
   * @param signer: Signer of infra deployment txns
   * @param contractTypes: List of infra contracts to deploy
   */
  async deployInfraWithSigner(contractTypes: InfraContractType[]) {
    const txns = [];
    const chainId = (await this.getProvider().getNetwork()).chainId;

    for (let contractType of contractTypes as InfraContractType[]) {
      const infraContract = this.infraContractsInfoCache[chainId][contractType];
      const code = await this.getProvider().getCode(
        infraContract.predictedAddress,
      );

      if (code === "0x") {
        // get init bytecode
        const initBytecodeWithSalt = getInitBytecodeWithSalt(
          infraContract.bytecode,
          infraContract.encodedArgs,
        );
        const create2Factory = await this.computeCreate2FactoryAddress();
        txns.push({
          predictedAddress: infraContract.predictedAddress,
          to: create2Factory,
          data: initBytecodeWithSalt,
        });
      }
    }

    // Call/deploy the throaway-deployer only if there are any contracts to deploy
    if (txns.length > 0) {
      // Using the deployer contract, send the deploy transactions to common factory with a signer
      const deployer = new ethers.ContractFactory(deployerAbi, deployerBytecode)
        .connect(this.getSigner() as Signer)
        .deploy(txns);
      await (await deployer).deployed();
    }
  }
}
