import { TransactionError } from "../../common";
import { CONTRACT_ADDRESSES, SUPPORTED_CHAIN_IDS } from "../../constants";
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
import { SDKOptions } from "../../schema/sdk-options";
import {
  DeploySchemaForPrebuiltContractType,
  NetworkOrSignerOrProvider,
  PrebuiltContractType,
} from "../types";
import { ContractWrapper } from "./contract-wrapper";
import type { TWFactory } from "@thirdweb-dev/contracts-js";
import TWFactoryAbi from "@thirdweb-dev/contracts-js/dist/abis/TWFactory.json";
import { ProxyDeployedEvent } from "@thirdweb-dev/contracts-js/dist/declarations/src/TWFactory";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import {
  BigNumber,
  constants,
  Contract,
  ContractInterface,
  ethers,
} from "ethers";
import { z } from "zod";

/**
 * @internal
 */
export class ContractFactory extends ContractWrapper<TWFactory> {
  private storage: ThirdwebStorage;

  constructor(
    factoryAddr: string,
    network: NetworkOrSignerOrProvider,
    storage: ThirdwebStorage,
    options?: SDKOptions,
  ) {
    super(network, factoryAddr, TWFactoryAbi, options);
    this.storage = storage;
  }

  public async deploy<TContractType extends PrebuiltContractType>(
    contractType: TContractType,
    contractMetadata: z.input<
      DeploySchemaForPrebuiltContractType<TContractType>
    >,
  ): Promise<string> {
    const contract = PREBUILT_CONTRACTS_MAP[contractType];
    const metadata = contract.schema.deploy.parse(contractMetadata);

    // TODO: is there any special pre-processing we need to do before uploading?
    const contractURI = await this.storage.upload(metadata);

    const ABI = await contract.getAbi();

    const encodedFunc = Contract.getInterface(ABI).encodeFunctionData(
      "initialize",
      await this.getDeployArguments(contractType, metadata, contractURI),
    );

    const encodedType = ethers.utils.formatBytes32String(contract.name);
    let receipt;
    try {
      receipt = await this.sendTransaction("deployProxy", [
        encodedType,
        encodedFunc,
      ]);
    } catch (e) {
      console.log(e);
      // if the error is caused by user cancelling the transaction, just re-throw it
      if (
        (e as TransactionError).message
          .toLowerCase()
          .includes("user rejected transaction") ||
        (e as TransactionError).reason
          .toLowerCase()
          .includes("user rejected transaction")
      ) {
        throw e;
      }

      // deploy might fail due to salt already used, fallback to deterministic deploy
      const blockNumber = await this.getProvider().getBlockNumber();
      receipt = await this.sendTransaction("deployProxyDeterministic", [
        encodedType,
        encodedFunc,
        ethers.utils.formatBytes32String(blockNumber.toString()),
      ]);
    }

    const events = this.parseLogs<ProxyDeployedEvent>(
      "ProxyDeployed",
      receipt.logs,
    );
    if (events.length < 1) {
      throw new Error("No ProxyDeployed event found");
    }

    return events[0].args.proxy;
  }

  // TODO once IContractFactory is implemented, this can be probably be moved to its own class
  public async deployProxyByImplementation(
    implementationAddress: string,
    implementationAbi: ContractInterface,
    initializerFunction: string,
    initializerArgs: any[],
  ): Promise<string> {
    const encodedFunc = Contract.getInterface(
      implementationAbi,
    ).encodeFunctionData(initializerFunction, initializerArgs);

    const blockNumber = await this.getProvider().getBlockNumber();
    const receipt = await this.sendTransaction("deployProxyByImplementation", [
      implementationAddress,
      encodedFunc,
      ethers.utils.formatBytes32String(blockNumber.toString()),
    ]);

    const events = this.parseLogs<ProxyDeployedEvent>(
      "ProxyDeployed",
      receipt.logs,
    );
    if (events.length < 1) {
      throw new Error("No ProxyDeployed event found");
    }

    return events[0].args.proxy;
  }

  private async getDeployArguments<TContractType extends PrebuiltContractType>(
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
        const erc721metadata = NFTDropInitializer.schema.deploy.parse(metadata);
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
          SignatureDropInitializer.schema.deploy.parse(metadata);
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
          MultiwrapInitializer.schema.deploy.parse(metadata);
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
          EditionDropInitializer.schema.deploy.parse(metadata);
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
        const erc20metadata = TokenInitializer.schema.deploy.parse(metadata);
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
        const voteMetadata = VoteInitializer.schema.deploy.parse(metadata);
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
        const splitsMetadata = SplitInitializer.schema.deploy.parse(metadata);
        return [
          await this.getSignerAddress(),
          contractURI,
          trustedForwarders,
          splitsMetadata.recipients.map((s) => s.address),
          splitsMetadata.recipients.map((s) => BigNumber.from(s.sharesBps)),
        ];
      case MarketplaceInitializer.contractType:
        const marketplaceMetadata =
          MarketplaceInitializer.schema.deploy.parse(metadata);
        return [
          await this.getSignerAddress(),
          contractURI,
          trustedForwarders,
          marketplaceMetadata.platform_fee_recipient,
          marketplaceMetadata.platform_fee_basis_points,
        ];
      case PackInitializer.contractType:
        const packsMetadata = PackInitializer.schema.deploy.parse(metadata);
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
    const chainEnum = SUPPORTED_CHAIN_IDS.find((c) => c === chainId);
    const biconomyForwarder = chainEnum
      ? CONTRACT_ADDRESSES[chainEnum].biconomyForwarder
      : constants.AddressZero;
    const openzeppelinForwarder = chainEnum
      ? CONTRACT_ADDRESSES[chainEnum].openzeppelinForwarder
      : constants.AddressZero;
    return biconomyForwarder !== constants.AddressZero
      ? [openzeppelinForwarder, biconomyForwarder]
      : [openzeppelinForwarder];
  }
}
