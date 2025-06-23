import type { ThirdwebContract } from "../contract.js";
import { formatCompilerMetadata } from "./compiler-metadata.js";

/**
 * Down the compiled metadata from thirdweb contract api and format it
 * @param metadata The (json) data returned from https://contract.thirdweb.com/metadata/<chainId>/<contractAddress>
 *
 * @example
 * ```ts
 * import { getCompilerMetadata, getContract } from "thirdweb/contracts";
 *
 * const contract = getContract({
 *   address: "0x...",
 *   chain: ethereum,
 *   client: "",
 * });
 * const metadata = await getCompilerMetadata(contract);
 * ```
 * @returns The compiler metadata for the contract
 * @contract
 */
export async function getCompilerMetadata(contract: ThirdwebContract) {
  const { address, chain } = contract;
  const response = await fetch(
    `https://contract.thirdweb.com/metadata/${chain.id}/${address}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
    },
  );
  if (!response.ok) {
    const errorMsg = await response.json();
    throw new Error(
      errorMsg.message || errorMsg.error || "Failed to get compiler metadata",
    );
  }
  const data = await response.json();
  return formatCompilerMetadata(data);
}
