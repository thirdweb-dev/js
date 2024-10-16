import { notFound } from "next/navigation";
import { getContractPageParamsInfo } from "./_utils/getContractFromParams";
import { getContractPageMetadata } from "./_utils/getContractPageMetadata";
import { ContractOverviewPage } from "./overview/ContractOverviewPage";

export default async function Page(props: {
  params: {
    contractAddress: string;
    chain_id: string;
  };
}) {
  const info = await getContractPageParamsInfo(props.params);

  if (!info) {
    notFound();
  }

  const { contract, chainMetadata } = info;
  const contractPageMetadata = await getContractPageMetadata(contract);

  return (
    <ContractOverviewPage
      contract={contract}
      hasDirectListings={contractPageMetadata.isDirectListingSupported}
      hasEnglishAuctions={contractPageMetadata.isEnglishAuctionSupported}
      isErc1155={contractPageMetadata.supportedERCs.isERC1155}
      isErc20={contractPageMetadata.supportedERCs.isERC20}
      isErc721={contractPageMetadata.supportedERCs.isERC721}
      isPermissionsEnumerable={
        contractPageMetadata.isPermissionsEnumerableSupported
      }
      chainSlug={chainMetadata.slug}
      isAnalyticsSupported={contractPageMetadata.isAnalyticsSupported}
    />
  );
}
