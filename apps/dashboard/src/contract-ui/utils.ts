import { useEVMContractInfo } from "@3rdweb-sdk/react";
import invariant from "tiny-invariant";

export function useTabHref(
  tab:
    | "nfts"
    | ""
    | "explorer"
    | "analytics"
    | "events"
    | "claim-conditions"
    | "permissions"
    | "embed"
    | "code"
    | "settings"
    | "sources"
    | "tokens"
    | "listings"
    | "direct-listings"
    | "english-auctions"
    | "app"
    | "accounts",
) {
  const contractInfo = useEVMContractInfo();
  invariant(contractInfo, "can not use useTabHref() without a contractInfo");
  return `/${contractInfo.chainSlug}/${contractInfo.contractAddress}/${tab}`;
}
