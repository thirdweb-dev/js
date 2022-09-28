import {
  extractConstructorParamsFromAbi,
  extractFunctionParamsFromAbi,
  fetchExtendedReleaseMetadata,
  fetchPreDeployMetadata,
} from "../../common/index";
import { getContractAddressByChainId } from "../../constants/addresses";
import {
  EditionDropInitializer,
  EditionInitializer,
  MarketplaceInitializer,
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
import { FactoryDeploymentSchema } from "../../schema/contracts/custom";
import { SDKOptions } from "../../schema/sdk-options";
import {
  MarketplaceContractDeployMetadata,
  MultiwrapContractDeployMetadata,
  NFTContractDeployMetadata,
  SplitContractDeployMetadata,
  TokenContractDeployMetadata,
  VoteContractDeployMetadata,
} from "../../types/deploy/deploy-metadata";
import { ThirdwebSDK } from "../sdk";
import {
  DeploySchemaForPrebuiltContractType,
  NetworkOrSignerOrProvider,
  PrebuiltContractType,
} from "../types";
import { ContractFactory } from "./factory";
import { ContractRegistry } from "./registry";
import { RPCConnectionHandler } from "./rpc-connection-handler";
import { TWProxy__factory } from "@thirdweb-dev/contracts-js";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import {
  BigNumber,
  BytesLike,
  Contract,
  ContractInterface,
  ethers,
} from "ethers";
import invariant from "tiny-invariant";
import { z } from "zod";

/**
 * Handles deploying new contracts
 * @public
 */
export class ContractDeployer extends RPCConnectionHandler {
  /**
   * @internal
   * should never be accessed directly, use {@link ContractDeployer.getFactory} instead
   */
  private _factory: Promise<ContractFactory> | undefined;
  /**
   * @internal
   * should never be accessed directly, use {@link ContractDeployer.getRegistry} instead
   */
  private _registry: Promise<ContractRegistry> | undefined;
  private storage: ThirdwebStorage;

  constructor(
    network: NetworkOrSignerOrProvider,
    options: SDKOptions,
    storage: ThirdwebStorage,
  ) {
    super(network, options);
    this.storage = storage;
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
   * @returns a promise of the address of the newly deployed contract
   */
  public async deployBuiltInContract<
    TContractType extends PrebuiltContractType,
  >(
    contractType: TContractType,
    contractMetadata: z.input<
      DeploySchemaForPrebuiltContractType<TContractType>
    >,
  ): Promise<string> {
    const parsed =
      PREBUILT_CONTRACTS_MAP[contractType].schema.deploy.parse(
        contractMetadata,
      );
    const factory = await this.getFactory();
    return await factory.deploy(contractType, parsed);
  }

  /**
   * Deploy any released contract by its name
   * @param releaserAddress the address of the releaser
   * @param contractName the name of the contract to deploy
   * @param constructorParams the constructor params to pass to the contract
   */
  public async deployReleasedContract(
    releaserAddress: string,
    contractName: string,
    constructorParams: any[],
  ): Promise<string> {
    const release = await new ThirdwebSDK("polygon")
      .getPublisher()
      .getLatest(releaserAddress, contractName);
    if (!release) {
      throw new Error(
        `No release found for '${contractName}' by ${releaserAddress}`,
      );
    }
    return await this.deployContractFromUri(
      release.metadataUri,
      constructorParams,
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
      {},
    );
    return await proxyFactory.deployProxyByImplementation(
      implementationAddress,
      implementationAbi,
      initializerFunction,
      initializerArgs,
    );
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
    return this.deployContractWithAbi(
      TWProxy__factory.abi,
      TWProxy__factory.bytecode,
      [implementationAddress, encodedInitializer],
    );
  }

  /**
   * @internal
   */
  public async getRegistry(): Promise<ContractRegistry> {
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
        return new ContractRegistry(
          registryAddress,
          this.getSignerOrProvider(),
          this.options,
        );
      }));
  }

  private async getFactory(): Promise<ContractFactory> {
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
        return new ContractFactory(
          factoryAddress,
          this.getSignerOrProvider(),
          this.storage,
          this.options,
        );
      }));
  }

  public override updateSignerOrProvider(network: NetworkOrSignerOrProvider) {
    super.updateSignerOrProvider(network);
    this.updateContractSignerOrProvider();
  }

  private updateContractSignerOrProvider() {
    // has to be promises now
    this._factory
      ?.then((factory) => {
        factory.updateSignerOrProvider(this.getSignerOrProvider());
      })
      .catch(() => {
        // ignore
      });
    // has to be promises now
    this._registry
      ?.then((registry) => {
        registry.updateSignerOrProvider(this.getSignerOrProvider());
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
    options?: {
      forceDirectDeploy?: boolean;
    },
  ) {
    const signer = this.getSigner();
    invariant(signer, "A signer is required");
    const compilerMetadata = await fetchPreDeployMetadata(
      publishMetadataUri,
      this.storage,
    );
    let isDeployableViaFactory;
    let isDeployableViaProxy;
    let factoryDeploymentData;
    try {
      const extendedMetadata = await fetchExtendedReleaseMetadata(
        publishMetadataUri,
        this.storage,
      );
      isDeployableViaFactory = extendedMetadata.isDeployableViaFactory;
      isDeployableViaProxy = extendedMetadata.isDeployableViaProxy;
      factoryDeploymentData = FactoryDeploymentSchema.parse(
        extendedMetadata.factoryDeploymentData,
      );
    } catch (e) {
      // not a factory deployment, ignore
    }
    const forceDirectDeploy = options?.forceDirectDeploy || false;
    if (
      factoryDeploymentData &&
      (isDeployableViaProxy || isDeployableViaFactory) &&
      !forceDirectDeploy
    ) {
      const chainId = (await this.getProvider().getNetwork()).chainId;
      invariant(
        factoryDeploymentData.implementationAddresses,
        "implementationAddresses is required",
      );
      const implementationAddress =
        factoryDeploymentData.implementationAddresses[chainId];

      invariant(
        implementationAddress,
        `implementationAddress not found for chainId '${chainId}'`,
      );
      invariant(
        factoryDeploymentData.implementationInitializerFunction,
        `implementationInitializerFunction not set'`,
      );
      const initializerParamTypes = extractFunctionParamsFromAbi(
        compilerMetadata.abi,
        factoryDeploymentData.implementationInitializerFunction,
      ).map((p) => p.type);
      const paramValues = this.convertParamValues(
        initializerParamTypes,
        constructorParamValues,
      );

      if (isDeployableViaProxy) {
        // deploy a proxy directly
        return await this.deployProxy(
          implementationAddress,
          compilerMetadata.abi,
          factoryDeploymentData.implementationInitializerFunction,
          paramValues,
        );
      } else if (isDeployableViaFactory) {
        // deploy via a factory
        invariant(
          factoryDeploymentData.factoryAddresses,
          "isDeployableViaFactory is true so factoryAddresses is required",
        );
        const factoryAddress = factoryDeploymentData.factoryAddresses[chainId];
        invariant(
          factoryAddress,
          `isDeployableViaFactory is true and factoryAddress not found for chainId '${chainId}'`,
        );
        return await this.deployViaFactory(
          factoryAddress,
          implementationAddress,
          compilerMetadata.abi,
          factoryDeploymentData.implementationInitializerFunction,
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

  private convertParamValues(
    constructorParamTypes: string[],
    constructorParamValues: any[],
  ) {
    // check that both arrays are same length
    if (constructorParamTypes.length !== constructorParamValues.length) {
      throw Error("Passed the wrong number of constructor arguments");
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
        return ethers.utils.toUtf8Bytes(constructorParamValues[index]);
      }
      if (p.startsWith("uint") || p.startsWith("int")) {
        return BigNumber.from(constructorParamValues[index].toString());
      }
      return constructorParamValues[index];
    });
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
    const deployedContract = await deployer.deployed();
    // TODO parse transaction receipt
    return deployedContract.address;
  }
}
