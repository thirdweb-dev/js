import { getThirdwebClient } from "@/constants/thirdweb.server";
import { defineDashboardChain } from "lib/defineDashboardChain";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContract, toTokens } from "thirdweb";
import { getContractMetadata } from "thirdweb/extensions/common";
import { getCurrencyMetadata } from "thirdweb/extensions/erc20";
import {
  getActiveClaimCondition as getActiveClaimCondition721,
  getNFT as getNFT721,
} from "thirdweb/extensions/erc721";
import {
  getActiveClaimCondition as getActiveClaimCondition1155,
  getNFT as getNFT1155,
} from "thirdweb/extensions/erc1155";
import { DROP_PAGES } from "./data";
import { NftMint } from "./mint-ui";

export async function generateMetadata({
  params,
}: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = DROP_PAGES.find((p) => p.slug === slug);
  if (!project) {
    return notFound();
  }
  return project.metadata;
}

export default async function DropPage({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const project = DROP_PAGES.find((p) => p.slug === slug);

  if (!project) {
    return notFound();
  }
  // eslint-disable-next-line no-restricted-syntax
  const chain = defineDashboardChain(project.chainId, undefined);
  const client = getThirdwebClient();

  const contract = getContract({
    address: project.contractAddress,
    chain,
    client,
  });

  const [nft, claimCondition, contractMetadata] = await Promise.all([
    project.type === "erc1155"
      ? getNFT1155({ contract, tokenId: project.tokenId })
      : getNFT721({ contract, tokenId: 0n }),
    project.type === "erc1155"
      ? getActiveClaimCondition1155({
          contract,
          tokenId: project.tokenId,
        }).catch(() => undefined)
      : getActiveClaimCondition721({ contract }).catch(() => undefined),
    getContractMetadata({ contract }),
  ]);

  const thumbnail =
    project.thumbnail || nft.metadata.image || contractMetadata.image || "";

  const displayName = contractMetadata.name || nft.metadata.name || "";

  const description =
    typeof contractMetadata.description === "string" &&
    contractMetadata.description
      ? contractMetadata.description
      : nft.metadata.description || "";

  if (!claimCondition) {
    return (
      <NftMint
        contract={contract}
        displayName={displayName}
        thumbnail={thumbnail}
        description={description}
        {...project}
        noActiveClaimCondition
      />
    );
  }

  const currencyMetadata = claimCondition.currency
    ? await getCurrencyMetadata({
        contract: getContract({
          address: claimCondition.currency,
          chain,
          client,
        }),
      })
    : undefined;

  if (!currencyMetadata) {
    return notFound();
  }

  const pricePerToken = Number(
    toTokens(claimCondition.pricePerToken, currencyMetadata.decimals),
  );

  return (
    <NftMint
      contract={contract}
      displayName={displayName || ""}
      thumbnail={thumbnail}
      description={description || ""}
      currencySymbol={currencyMetadata.symbol}
      pricePerToken={pricePerToken}
      noActiveClaimCondition={false}
      quantityLimitPerWallet={claimCondition.quantityLimitPerWallet}
      {...project}
    />
  );
}
