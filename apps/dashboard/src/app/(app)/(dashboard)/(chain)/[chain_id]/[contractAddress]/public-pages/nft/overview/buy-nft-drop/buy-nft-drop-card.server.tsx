import type { ThirdwebContract } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import {
  getActiveClaimCondition as ERC721_getActiveClaimCondition,
  getTotalClaimedSupply as ERC721_getTotalClaimedSupply,
  getTotalUnclaimedSupply as ERC721_getTotalUnclaimedSupply,
  isClaimToSupported as ERC721_isClaimToSupported,
} from "thirdweb/extensions/erc721";
import { getCurrencyMeta } from "../../../erc20/_utils/getCurrencyMeta";
import { BuyNFTDropCardClient } from "./buy-nft-drop-card.client";

type ClaimCondition = Awaited<
  ReturnType<typeof ERC721_getActiveClaimCondition>
>;

export async function BuyNFTDropCardServer(props: {
  serverContract: ThirdwebContract;
  chainMetadata: ChainMetadata;
  functionSelectors: string[];
  totalNFTCount: number;
  clientContract: ThirdwebContract;
  erc721ActiveClaimCondition: ClaimCondition;
  erc721ClaimConditionCurrencyMeta: {
    decimals: number;
    symbol: string;
  };
  erc721NextTokenIdToClaim: bigint;
  erc721TotalUnclaimedSupply: bigint;
}) {
  return (
    <BuyNFTDropCardClient
      chainMetadata={props.chainMetadata}
      claimCondition={{
        ...props.erc721ActiveClaimCondition,
        decimals: props.erc721ClaimConditionCurrencyMeta.decimals,
        symbol: props.erc721ClaimConditionCurrencyMeta.symbol,
      }}
      contract={props.clientContract}
      nextTokenIdToClaim={props.erc721NextTokenIdToClaim}
      totalNFTs={props.totalNFTCount}
      totalUnclaimedSupply={props.erc721TotalUnclaimedSupply}
    />
  );
}

export async function getNFTDropClaimParams(params: {
  serverContract: ThirdwebContract;
  chainMetadata: ChainMetadata;
  functionSelectors: string[];
  totalNFTCount: number;
}) {
  const isERC721ClaimToSupported = ERC721_isClaimToSupported(
    params.functionSelectors,
  );

  if (!isERC721ClaimToSupported) {
    return null;
  }

  const [
    erc721ActiveClaimCondition,
    erc721TotalUnclaimedSupply,
    erc721NextTokenIdToClaim,
  ] = await Promise.all([
    ERC721_getActiveClaimCondition({
      contract: params.serverContract,
    }).catch(() => undefined),
    ERC721_getTotalUnclaimedSupply({
      contract: params.serverContract,
    }).catch(() => 0n),
    ERC721_getTotalClaimedSupply({
      contract: params.serverContract,
    }).catch(() => 0n),
  ]);

  const hasUnclaimedSupply = erc721TotalUnclaimedSupply > 0n;

  if (!hasUnclaimedSupply || !erc721ActiveClaimCondition) {
    return null;
  }

  const erc721ClaimConditionCurrencyMeta = await getCurrencyMeta({
    chain: params.serverContract.chain,
    chainMetadata: params.chainMetadata,
    client: params.serverContract.client,
    currencyAddress: erc721ActiveClaimCondition.currency,
  }).catch(() => undefined);

  if (!erc721ClaimConditionCurrencyMeta) {
    return null;
  }

  return {
    erc721ActiveClaimCondition,
    erc721ClaimConditionCurrencyMeta,
    erc721NextTokenIdToClaim,
    erc721TotalUnclaimedSupply,
  };
}
