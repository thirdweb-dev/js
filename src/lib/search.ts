export type SearchMode = "all" | "mainnet" | "testnet";

export const getSearchQuery = ({
  query,
  walletAddress = "",
  searchMode = "all",
  page = 1,
  perPage = 10,
  getAllOwnedByWallet = false,
  filterByChains = [],
}: {
  query: string;
  walletAddress?: string;
  searchMode: SearchMode;
  page?: number;
  perPage?: number;
  getAllOwnedByWallet?: boolean;
  filterByChains?: number[];
}) => {
  const baseUrl = new URL(
    "https://search.thirdweb.com/collections/contracts/documents/search",
  );
  baseUrl.searchParams.set("q", query);
  baseUrl.searchParams.set(
    "query_by",
    "name,symbol,contract_address,deployer_address",
  );
  baseUrl.searchParams.set("query_by_weights", "3,3,2,1");
  baseUrl.searchParams.set("page", page.toString());
  baseUrl.searchParams.set("per_page", perPage.toString());
  baseUrl.searchParams.set("exhaustive_search", "true");
  baseUrl.searchParams.set(
    "sort_by",
    `testnet:asc${
      walletAddress ? `,_eval(deployer_address:${walletAddress}):desc` : ""
    }`,
  );

  if (searchMode === "mainnet") {
    baseUrl.searchParams.set("filter_by", "testnet:false");
  } else if (searchMode === "testnet") {
    baseUrl.searchParams.set("filter_by", "testnet:true");
  }
  if (getAllOwnedByWallet) {
    baseUrl.searchParams.set(
      "filter_by",
      `deployer_address:${walletAddress} && chain_id:[${filterByChains}]`,
    );
  }
  return baseUrl.toString();
};
