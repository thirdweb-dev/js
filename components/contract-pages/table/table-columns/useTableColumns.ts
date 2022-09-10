import { TTableType } from "../types";
import { generateMarketplaceTableColumns } from "./marketplace";
import { Marketplace, ValidContractInstance } from "@thirdweb-dev/sdk";
import { useMemo } from "react";
import { Column } from "react-table";

export function useTableColumns<TContract extends ValidContractInstance>(
  contract?: TContract,
) {
  return useMemo(() => {
    if (!contract) {
      return [];
    }
    if (contract instanceof Marketplace) {
      return generateMarketplaceTableColumns() as Column<
        TTableType<TContract>
      >[];
    }
    throw new Error(`contract table not implemented for contract: ${contract}`);
  }, [contract]);
}
