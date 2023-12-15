import { getDefaultTrustedForwarders } from "../constants/addresses/getDefaultTrustedForwarders";
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
import { BigNumber, Signer, providers } from "ethers";
import { z } from "zod";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { SUPPORTED_CHAIN_IDS } from "../constants/chains/SUPPORTED_CHAIN_IDS";
import { computeForwarderAddress } from "./any-evm-utils/computeForwarderAddress";
import type {
  PrebuiltContractType,
  DeploySchemaForPrebuiltContractType,
} from "../contracts";
import { overrideRecipientAddress } from "./override-recipient-address";

/**
 *
 * @param contractType - The contract type to get deploy arguments for
 * @param metadata - The metadata to get deploy arguments for
 * @param contractURI - The contract URI to get deploy arguments for
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
  storage: ThirdwebStorage,
): Promise<any[]> {
  const signerAddress = await signer.getAddress();
  const trustedForwarders: string[] = [];

  // add any custom forwarders passed in
  if (metadata.trusted_forwarders && metadata.trusted_forwarders.length > 0) {
    trustedForwarders.push(...metadata.trusted_forwarders);
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
        overrideRecipientAddress(
          signerAddress,
          erc721metadata.primary_sale_recipient,
        ),
        erc721metadata.fee_recipient,
        erc721metadata.seller_fee_basis_points,
        erc721metadata.platform_fee_basis_points,
        overrideRecipientAddress(
          signerAddress,
          erc721metadata.platform_fee_recipient,
        ),
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
        overrideRecipientAddress(
          signerAddress,
          signatureDropmetadata.primary_sale_recipient,
        ),
        signatureDropmetadata.fee_recipient,
        signatureDropmetadata.seller_fee_basis_points,
        signatureDropmetadata.platform_fee_basis_points,
        overrideRecipientAddress(
          signerAddress,
          signatureDropmetadata.platform_fee_recipient,
        ),
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
        overrideRecipientAddress(
          signerAddress,
          erc1155metadata.primary_sale_recipient,
        ),
        erc1155metadata.fee_recipient,
        erc1155metadata.seller_fee_basis_points,
        erc1155metadata.platform_fee_basis_points,
        overrideRecipientAddress(
          signerAddress,
          erc1155metadata.platform_fee_recipient,
        ),
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
        overrideRecipientAddress(
          signerAddress,
          erc20metadata.primary_sale_recipient,
        ),
        overrideRecipientAddress(
          signerAddress,
          erc20metadata.platform_fee_recipient,
        ),
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
        overrideRecipientAddress(
          signerAddress,
          marketplaceMetadata.platform_fee_recipient,
        ),
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

export async function getTrustedForwarders(
  provider: providers.Provider,
  storage: ThirdwebStorage,
  contractName?: string,
): Promise<string[]> {
  const chainId = (await provider.getNetwork()).chainId;
  const chainEnum = SUPPORTED_CHAIN_IDS.find((c) => c === chainId);
  const trustedForwarders: string[] =
    contractName && contractName === PackInitializer.name
      ? []
      : chainEnum
      ? getDefaultTrustedForwarders(chainId)
      : [await computeForwarderAddress(provider, storage)]; // TODO: make this default for all chains (standard + others)

  return trustedForwarders;
}
