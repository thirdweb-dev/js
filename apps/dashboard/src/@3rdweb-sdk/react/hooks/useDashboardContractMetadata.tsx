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
  return useQuery({
    queryKey: ["contract-metadata-header", contract.chain.id, contract.address],
    queryFn: async () => {
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

      /**
       * Handle the case where the contract.thirdweb.com endpoint returns a very long name
       * example url: https://contract.thirdweb.com/metadata/324/0x66E298335c5992d599132582De8eaAF75348e6e6
       * In that case, we split the solidity name on ":" and take the second part
       */
      if (compilerMetadata?.name.includes(":")) {
        const _name = compilerMetadata.name.split(":")[1];
        if (_name) {
          compilerMetadata.name = compilerMetadata.name.split(":")[1];
        }
      }

      const contractName =
        contractMetadata?.name || _name || compilerMetadata?.name || "";
      const contractSymbol = contractMetadata?.symbol || _symbol || "";

      return {
        name: contractName,
        symbol: contractSymbol,
        image: contractMetadata.image || "",
        contractType: compilerMetadata?.name || "",
      };
    },
  });
}
