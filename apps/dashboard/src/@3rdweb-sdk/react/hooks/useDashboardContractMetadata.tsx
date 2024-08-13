import { useQuery } from "@tanstack/react-query";
import type { ThirdwebContract } from "thirdweb";
import { getCompilerMetadata } from "thirdweb/contract";
import { getContractMetadata, name, symbol } from "thirdweb/extensions/common";

/**
 * Fetch the contract metadata for Dashboard
 *
 * If the contract itself doesn't implement the metadata extension,
 * we try to fall back to:
 * 1. name(), symbol()
 * 2. our API endpoint
 */
export function useDashboardContractMetadata(contract: ThirdwebContract) {
  return useQuery(
    ["contract-metadata-header", contract.chain.id, contract.address],
    async () => {
      const [contractMetadata, _name, _symbol, compilerMetadata] =
        await Promise.all([
          getContractMetadata({ contract }).catch(() => ({
            image: "",
            name: "",
            symbol: "",
          })),
          name({ contract }).catch(() => ""),
          symbol({ contract }).catch(() => ""),
          getCompilerMetadata(contract).catch(() => undefined),
        ]);

      const contractName =
        contractMetadata?.name || _name || compilerMetadata?.name || "";
      const contractSymbol = contractMetadata?.symbol || _symbol || "";

      return {
        name: contractName,
        symbol: contractSymbol,
        image: contractMetadata.image || "",
      };
    },
  );
}
