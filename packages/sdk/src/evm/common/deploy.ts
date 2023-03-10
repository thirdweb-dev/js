import { getDefaultTrustedForwarders } from "../constants/addresses";
import {
  PackInitializer,
  NFTDropInitializer,
  NFTCollectionInitializer,
  SignatureDropInitializer,
  MultiwrapInitializer,
  EditionDropInitializer,
  EditionInitializer,
  TokenDropInitializer,
  TokenInitializer,
  VoteInitializer,
  SplitInitializer,
  MarketplaceInitializer,
  MarketplaceV3Initializer,
} from "../contracts";
import {
  PrebuiltContractType,
  DeploySchemaForPrebuiltContractType,
} from "../core";
import { BigNumber, Signer } from "ethers";
import { z } from "zod";

/**
 *
 * @param contractType
 * @param metadata
 * @param contractURI
 * @returns
 * @internal
 */
export async function getDeployArguments<
  TContractType extends PrebuiltContractType,
>(
  contractType: TContractType,
  metadata: z.input<DeploySchemaForPrebuiltContractType<TContractType>>,
  contractURI: string,
  signer: Signer,
): Promise<any[]> {
  const chainId = await signer.getChainId();
  const signerAddress = await signer.getAddress();
  let trustedForwarders =
    contractType === PackInitializer.contractType
      ? []
      : getDefaultTrustedForwarders(chainId);
  // override default forwarders if custom ones are passed in
  if (metadata.trusted_forwarders && metadata.trusted_forwarders.length > 0) {
    trustedForwarders = metadata.trusted_forwarders;
  }
  switch (contractType) {
    case NFTDropInitializer.contractType:
    case NFTCollectionInitializer.contractType:
      const erc721metadata = await NFTDropInitializer.schema.deploy.parseAsync(
        metadata,
      );
      return [
        signerAddress,
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
        signerAddress,
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
        signerAddress,
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
        signerAddress,
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
        signerAddress,
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
        signerAddress,
        contractURI,
        trustedForwarders,
        splitsMetadata.recipients.map((s) => s.address),
        splitsMetadata.recipients.map((s) => BigNumber.from(s.sharesBps)),
      ];
    case MarketplaceInitializer.contractType:
    case MarketplaceV3Initializer.contractType:
      const marketplaceMetadata =
        await MarketplaceInitializer.schema.deploy.parseAsync(metadata);
      return [
        signerAddress,
        contractURI,
        trustedForwarders,
        marketplaceMetadata.platform_fee_recipient,
        marketplaceMetadata.platform_fee_basis_points,
      ];
    case PackInitializer.contractType:
      const packsMetadata = await PackInitializer.schema.deploy.parseAsync(
        metadata,
      );
      return [
        signerAddress,
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
