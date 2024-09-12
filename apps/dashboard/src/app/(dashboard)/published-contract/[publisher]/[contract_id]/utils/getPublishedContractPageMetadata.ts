import { format } from "date-fns/format";
import type { Metadata } from "next";
import { correctAndUniqueLicenses } from "../../../../../../lib/licenses";
import { PublishedContractOG } from "../../../../../../og-lib/url-utils";
import { getPublishedContractsWithPublisherMapping } from "./getPublishedContractsWithPublisherMapping";

export async function getPublishedContractPageMetadata(params: {
  publisher: string;
  contract_id: string;
  pageType: "view" | "deploy";
}): Promise<Metadata> {
  const { publisher, contract_id, pageType } = params;

  const publishedContracts = await getPublishedContractsWithPublisherMapping({
    publisher: publisher,
    contract_id: contract_id,
  });

  const publishedContract = publishedContracts[0];

  const publishedContractName =
    publishedContract?.displayName || publishedContract?.name;

  const ogImageURL = PublishedContractOG.toUrl({
    name: `${pageType === "deploy" ? "Deploy " : ""}${publishedContractName}`,
    description: publishedContract.description,
    version: publishedContract.version || "latest",
    publisher: publisher,
    license: correctAndUniqueLicenses(publishedContract.licenses),
    publishDate: format(
      new Date(
        Number.parseInt(publishedContract.publishTimestamp.toString() || "0") *
          1000,
      ),
      "MMM dd, yyyy",
    ),
    logo: publishedContract.logo,
    // extension: extensionNames, TODO, but not a blocker
    // publisherAvatar:  TODO, but not a blocker
  });

  return {
    title: `${pageType === "deploy" ? "Deploy " : ""}${publishedContractName} | Published Smart Contract`,
    description: `${publishedContract.description}${publishedContract.description ? ". " : ""}Deploy ${publishedContractName} in one click with thirdweb.`,
    openGraph: {
      images: [ogImageURL.toString()],
    },
  };
}
