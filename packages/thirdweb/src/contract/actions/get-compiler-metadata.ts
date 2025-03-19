import { eth_getTransactionByHash } from "../../rpc/actions/eth_getTransactionByHash.js";
import { getRpcClient } from "../../rpc/rpc.js";
import { download } from "../../storage/download.js";
import { hexToString } from "../../utils/encoding/hex.js";
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

  try {
    const res = await fetch(
      `https://contract.thirdweb-dev.com/creation/${contract.chain.id}/${contract.address}`,
    );
    const creationData = await res.json();

    if (creationData.status === "1" && creationData.result[0]?.txHash) {
      const rpcClient = getRpcClient({
        client: contract.client,
        chain: contract.chain,
      });
      const creationTx = await eth_getTransactionByHash(rpcClient, {
        hash: creationData.result[0]?.txHash,
      });

      const initCode = creationTx.input;
      const lengthHex = initCode.slice(-2);
      const dataLength = Number.parseInt(lengthHex, 16) * 2;
      const encodedIpfsHex = initCode.slice(-dataLength - 2, -2);
      const uri = hexToString(`0x${encodedIpfsHex}`);

      const res = await download({
        client: contract.client,
        uri,
      });
      const metadata = await res.json();

      return formatCompilerMetadata(metadata);
    }
  } catch (e) {
    console.debug(e);
  }

  const response = await fetch(
    `https://contract.thirdweb.com/metadata/${chain.id}/${address}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
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
