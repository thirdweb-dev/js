import type { TWFactory } from "@thirdweb-dev/contracts-js";
import TWFactoryAbi from "@thirdweb-dev/contracts-js/dist/abis/TWFactory.json";
import { ProxyDeployedEvent } from "@thirdweb-dev/contracts-js/dist/declarations/src/TWFactory";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import {
  BigNumber,
  Contract,
  constants,
  utils,
  type ContractInterface,
} from "ethers";
import EventEmitter from "eventemitter3";
import invariant from "tiny-invariant";
import { z } from "zod";
import { getDeployArguments } from "../../../common/deploy";
import { buildTransactionFunction } from "../../../common/transactions";
import { getApprovedImplementation } from "../../../constants/addresses/getApprovedImplementation";
import { getDefaultTrustedForwarders } from "../../../constants/addresses/getDefaultTrustedForwarders";
import {
  DeploySchemaForPrebuiltContractType,
  EditionDropInitializer,
  EditionInitializer,
  MarketplaceInitializer,
  MarketplaceV3Initializer,
  MultiwrapInitializer,
  NFTCollectionInitializer,
  NFTDropInitializer,
  PREBUILT_CONTRACTS_MAP,
  PackInitializer,
  PrebuiltContractType,
  SignatureDropInitializer,
  SplitInitializer,
  TokenDropInitializer,
  TokenInitializer,
  VoteInitializer,
  getContractName,
} from "../../../contracts";
import { SDKOptions } from "../../../schema/sdk-options";
import { Address } from "../../../schema/shared/Address";
import type { DeployOptions } from "../../../types/deploy/deploy-options";
import type { DeployEvents } from "../../../types/deploy/deploy-events";
import { NetworkInput } from "../../types";
import { ContractWrapper } from "./contract-wrapper";
import { Transaction } from "../transactions";

/**
 * @internal
 */
export class ContractFactory extends ContractWrapper<TWFactory> {
  storage: ThirdwebStorage;

  // Map from contract type to version to deploy specific versions by default
  private DEFAULT_VERSION_MAP: Record<PrebuiltContractType, number> = {
    [NFTDropInitializer.contractType]: 3,
    [NFTCollectionInitializer.contractType]: 1,
    [SignatureDropInitializer.contractType]: 4,
    [MultiwrapInitializer.contractType]: 1,
    [EditionDropInitializer.contractType]: 2,
    [EditionInitializer.contractType]: 1,
    [TokenDropInitializer.contractType]: 2,
    [TokenInitializer.contractType]: 1,
    [VoteInitializer.contractType]: 1,
    [SplitInitializer.contractType]: 1,
    [MarketplaceInitializer.contractType]: 2,
    [MarketplaceV3Initializer.contractType]: 3,
    [PackInitializer.contractType]: 2,
  };

  constructor(
    factoryAddr: string,
    network: NetworkInput,
    storage: ThirdwebStorage,
    options?: SDKOptions,
  ) {
    super(network, factoryAddr, TWFactoryAbi, options, storage);
    this.storage = storage;
  }

  deploy = /* @__PURE__ */ buildTransactionFunction(
    async <TContractType extends PrebuiltContractType>(
      contractType: TContractType,
      contractMetadata: z.input<
        DeploySchemaForPrebuiltContractType<TContractType>
      >,
      eventEmitter: EventEmitter<DeployEvents>,
      version?: number,
      options?: DeployOptions,
      onExecute?: () => void,
    ): Promise<Transaction<Address>> => {
      const contract = PREBUILT_CONTRACTS_MAP[contractType];
      const metadata = await contract.schema.deploy.parseAsync(
        contractMetadata,
      );

      // TODO: is there any special pre-processing we need to do before uploading?
      const contractURI = await this.storage.upload(metadata);

      const implementationAddress =
        (await this.getImplementation(contract, version)) || undefined;

      if (
        !implementationAddress ||
        implementationAddress === constants.AddressZero
      ) {
        throw new Error(`No implementation found for ${contractType}`);
      }

      const ABI = await contract.getAbi(
        implementationAddress,
        this.getProvider(),
        this.storage,
      );

      const signer = this.getSigner();
      invariant(signer, "A signer is required to deploy contracts");

      const args = await getDeployArguments(
        contractType,
        metadata,
        contractURI,
        signer,
        this.storage,
      );

      const encodedFunc = Contract.getInterface(ABI).encodeFunctionData(
        "initialize",
        args,
      );

      const blockNumber = await this.getProvider().getBlockNumber();
      const salt = options?.saltForProxyDeploy
        ? utils.id(options.saltForProxyDeploy)
        : utils.formatBytes32String(blockNumber.toString());

      return Transaction.fromContractWrapper({
        contractWrapper: this,
        method: "deployProxyByImplementation",
        args: [implementationAddress, encodedFunc, salt],
        parse: (receipt) => {
          if (onExecute) {
            onExecute();
          }

          const events = this.parseLogs<ProxyDeployedEvent>(
            "ProxyDeployed",
            receipt.logs,
          );
          if (events.length < 1) {
            throw new Error("No ProxyDeployed event found");
          }

          const contractAddress = events[0].args.proxy;
          eventEmitter.emit("contractDeployed", {
            status: "completed",
            contractAddress,
            transactionHash: receipt.transactionHash,
          });

          return contractAddress;
        },
      });
    },
  );

  // TODO once IContractFactory is implemented, this can be probably be moved to its own class
  deployProxyByImplementation = /* @__PURE__ */ buildTransactionFunction(
    async (
      implementationAddress: Address,
      implementationAbi: ContractInterface,
      initializerFunction: string,
      initializerArgs: any[],
      eventEmitter: EventEmitter<DeployEvents>,
      saltForProxyDeploy?: string,
      onExecute?: () => void,
    ): Promise<Transaction<Address>> => {
      const encodedFunc = Contract.getInterface(
        implementationAbi,
      ).encodeFunctionData(initializerFunction, initializerArgs);

      const blockNumber = await this.getProvider().getBlockNumber();
      const salt = saltForProxyDeploy
        ? utils.id(saltForProxyDeploy)
        : utils.formatBytes32String(blockNumber.toString());

      return Transaction.fromContractWrapper({
        contractWrapper: this,
        method: "deployProxyByImplementation",
        args: [implementationAddress, encodedFunc, salt],
        parse: (receipt) => {
          if (onExecute) {
            onExecute();
          }

          const events = this.parseLogs<ProxyDeployedEvent>(
            "ProxyDeployed",
            receipt.logs,
          );
          if (events.length < 1) {
            throw new Error("No ProxyDeployed event found");
          }

          const contractAddress = events[0].args.proxy;
          eventEmitter.emit("contractDeployed", {
            status: "completed",
            contractAddress,
            transactionHash: receipt.transactionHash,
          });

          return contractAddress;
        },
      });
    },
  );

  /**
   *
   * @param contractType - the contract type to deploy
   * @param metadata - the metadata for the contract
   * @param contractURI - the contract URI
   * @returns
   * @internal
   */
  public async getDeployArguments<TContractType extends PrebuiltContractType>(
    contractType: TContractType,
    metadata: z.input<DeploySchemaForPrebuiltContractType<TContractType>>,
    contractURI: string,
  ): Promise<any[]> {
    let trustedForwarders =
      contractType === PackInitializer.contractType
        ? []
        : await this.getDefaultTrustedForwarders();
    // override default forwarders if custom ones are passed in
    if (metadata.trusted_forwarders && metadata.trusted_forwarders.length > 0) {
      trustedForwarders = metadata.trusted_forwarders;
    }
    switch (contractType) {
      case NFTDropInitializer.contractType:
      case NFTCollectionInitializer.contractType:
        const erc721metadata =
          await NFTDropInitializer.schema.deploy.parseAsync(metadata);
        return [
          await this.getSignerAddress(),
          erc721metadata.name,
          erc721metadata.symbol,
          contractURI,
          trustedForwarders,
          erc721metadata.primary_sale_recipient,
          erc721metadata.fee_recipient,
          erc721metadata.seller_fee_basis_points,
          erc721metadata.platform_fee_basis_points,
          erc721metadata.platform_fee_recipient,
        ];
      case SignatureDropInitializer.contractType:
        const signatureDropmetadata =
          await SignatureDropInitializer.schema.deploy.parseAsync(metadata);
        return [
          await this.getSignerAddress(),
          signatureDropmetadata.name,
          signatureDropmetadata.symbol,
          contractURI,
          trustedForwarders,
          signatureDropmetadata.primary_sale_recipient,
          signatureDropmetadata.fee_recipient,
          signatureDropmetadata.seller_fee_basis_points,
          signatureDropmetadata.platform_fee_basis_points,
          signatureDropmetadata.platform_fee_recipient,
        ];
      case MultiwrapInitializer.contractType:
        const multiwrapMetadata =
          await MultiwrapInitializer.schema.deploy.parseAsync(metadata);
        return [
          await this.getSignerAddress(),
          multiwrapMetadata.name,
          multiwrapMetadata.symbol,
          contractURI,
          trustedForwarders,
          multiwrapMetadata.fee_recipient,
          multiwrapMetadata.seller_fee_basis_points,
        ];
      case EditionDropInitializer.contractType:
      case EditionInitializer.contractType:
        const erc1155metadata =
          await EditionDropInitializer.schema.deploy.parseAsync(metadata);
        return [
          await this.getSignerAddress(),
          erc1155metadata.name,
          erc1155metadata.symbol,
          contractURI,
          trustedForwarders,
          erc1155metadata.primary_sale_recipient,
          erc1155metadata.fee_recipient,
          erc1155metadata.seller_fee_basis_points,
          erc1155metadata.platform_fee_basis_points,
          erc1155metadata.platform_fee_recipient,
        ];
      case TokenDropInitializer.contractType:
      case TokenInitializer.contractType:
        const erc20metadata = await TokenInitializer.schema.deploy.parseAsync(
          metadata,
        );
        return [
          await this.getSignerAddress(),
          erc20metadata.name,
          erc20metadata.symbol,
          contractURI,
          trustedForwarders,
          erc20metadata.primary_sale_recipient,
          erc20metadata.platform_fee_recipient,
          erc20metadata.platform_fee_basis_points,
        ];
      case VoteInitializer.contractType:
        const voteMetadata = await VoteInitializer.schema.deploy.parseAsync(
          metadata,
        );
        return [
          voteMetadata.name,
          contractURI,
          trustedForwarders,
          voteMetadata.voting_token_address,
          voteMetadata.voting_delay_in_blocks,
          voteMetadata.voting_period_in_blocks,
          BigNumber.from(voteMetadata.proposal_token_threshold),
          voteMetadata.voting_quorum_fraction,
        ];
      case SplitInitializer.contractType:
        const splitsMetadata = await SplitInitializer.schema.deploy.parseAsync(
          metadata,
        );
        return [
          await this.getSignerAddress(),
          contractURI,
          trustedForwarders,
          splitsMetadata.recipients.map((s) => s.address),
          splitsMetadata.recipients.map((s) => BigNumber.from(s.sharesBps)),
        ];
      case MarketplaceInitializer.contractType:
        const marketplaceMetadata =
          await MarketplaceInitializer.schema.deploy.parseAsync(metadata);
        return [
          await this.getSignerAddress(),
          contractURI,
          trustedForwarders,
          marketplaceMetadata.platform_fee_recipient,
          marketplaceMetadata.platform_fee_basis_points,
        ];
      case MarketplaceV3Initializer.contractType:
        const marketplaceV3Metadata =
          await MarketplaceV3Initializer.schema.deploy.parseAsync(metadata);
        return [
          await this.getSignerAddress(),
          contractURI,
          trustedForwarders,
          marketplaceV3Metadata.platform_fee_recipient,
          marketplaceV3Metadata.platform_fee_basis_points,
        ];
      case PackInitializer.contractType:
        const packsMetadata = await PackInitializer.schema.deploy.parseAsync(
          metadata,
        );
        return [
          await this.getSignerAddress(),
          packsMetadata.name,
          packsMetadata.symbol,
          contractURI,
          trustedForwarders,
          packsMetadata.fee_recipient,
          packsMetadata.seller_fee_basis_points,
        ];
      default:
        return [];
    }
  }

  private async getDefaultTrustedForwarders(): Promise<string[]> {
    const chainId = await this.getChainID();
    return getDefaultTrustedForwarders(chainId);
  }

  private async getImplementation(
    contract: (typeof PREBUILT_CONTRACTS_MAP)[PrebuiltContractType],
    version?: number,
  ) {
    const encodedType = utils.formatBytes32String(contract.name);
    const chainId = await this.getChainID();
    const approvedImplementation = getApprovedImplementation(
      chainId,
      contract.contractType,
    );
    // return approved implementation if it exists and we're not overriding the version
    if (
      approvedImplementation &&
      approvedImplementation.length > 0 &&
      version === undefined
    ) {
      return approvedImplementation;
    }
    return this.read("getImplementation", [
      encodedType,
      version !== undefined
        ? version
        : this.DEFAULT_VERSION_MAP[contract.contractType],
    ]);
  }

  public async getLatestVersion(contractType: PrebuiltContractType) {
    const name = getContractName(contractType);
    if (!name) {
      throw new Error(`Invalid contract type ${contractType}`);
    }
    const encodedType = utils.formatBytes32String(name);
    return this.read("currentVersion", [encodedType]);
  }
}
