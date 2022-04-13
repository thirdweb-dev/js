import { TTableType } from "../types";
import { generateEditionTableColumns } from "./edition";
import { generateEditionDropTableColumns } from "./editiondrop";
import { generateMarketplaceTableColumns } from "./marketplace";
import { generateNFTCollectionTableColumns } from "./nftcollection";
import { generateNFTDropTableColumns } from "./nftdrop";
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
      return generateNFTCollectionTableColumns() as Column<
        TTableType<TContract>
      >[];
    }
    if (contract instanceof Edition) {
      return generateEditionTableColumns() as Column<TTableType<TContract>>[];
    }
    if (contract instanceof NFTDrop) {
      return generateNFTDropTableColumns() as Column<TTableType<TContract>>[];
    }
    if (contract instanceof EditionDrop) {
      return generateEditionDropTableColumns() as Column<
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
