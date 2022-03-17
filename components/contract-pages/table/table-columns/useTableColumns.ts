import { TTableType } from "../types";
import { generateBundleDropTableColumns } from "./bundledrop";
import { generateCollectionableColumns } from "./collection";
import { generateDropTableColumns } from "./drop";
import { generateMarketplaceTableColumns } from "./marketplace";
import { generateNFTableColumns } from "./nft";
import {
  Edition,
  EditionDrop,
  Marketplace,
  NFTCollection,
  NFTDrop,
  ValidContractInstance,
} from "@thirdweb-dev/sdk";
import { useMemo } from "react";
import { Column } from "react-table";

export function useTableColumns<TContract extends ValidContractInstance>(
  contract?: TContract,
) {
  return useMemo(() => {
    if (!contract) {
      return [];
    }
    if (contract instanceof NFTCollection) {
      return generateNFTableColumns() as Column<TTableType<TContract>>[];
    }
    if (contract instanceof Edition) {
      return generateCollectionableColumns() as Column<TTableType<TContract>>[];
    }
    if (contract instanceof NFTDrop) {
      return generateDropTableColumns() as Column<TTableType<TContract>>[];
    }
    if (contract instanceof EditionDrop) {
      return generateBundleDropTableColumns() as Column<
        TTableType<TContract>
      >[];
    }
    // if (contract instanceof MarketContract) {
    //   return generateMarketTableColumns() as Column<TTableType<TContract>>[];
    // }
    if (contract instanceof Marketplace) {
      return generateMarketplaceTableColumns() as Column<
        TTableType<TContract>
      >[];
    }
    // if (contract instanceof PackContract) {
    //   return generatePackColumns() as Column<TTableType<TContract>>[];
    // }
    throw new Error(`contract table not implemented for contract: ${contract}`);
  }, [contract]);
}
