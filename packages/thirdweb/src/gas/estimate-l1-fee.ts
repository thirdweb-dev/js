import { serializeTransaction } from "viem";
import { getContract } from "../contract/contract.js";
import { toSerializableTransaction } from "../transaction/actions/to-serializable-transaction.js";
import type { PreparedTransaction } from "../transaction/prepare-transaction.js";
import { readContract } from "../transaction/read-contract.js";

export type EstimateL1FeeOptions = {
  transaction: PreparedTransaction;
  gasPriceOracleAddress?: string;
};

const OPStackGasPriceOracleAddress =
  "0x420000000000000000000000000000000000000F";

/**
 * @internal
 */
export async function estimateL1Fee(options: EstimateL1FeeOptions) {
  const { transaction, gasPriceOracleAddress } = options;
  const oracleContract = getContract({
    client: transaction.client,
    address: gasPriceOracleAddress || OPStackGasPriceOracleAddress,
    chain: transaction.chain,
  });

  // purposefully remove gasPrice from the transaction

  const { gasPrice, ...serializableTx } = await toSerializableTransaction({
    transaction,
  });
  const serialized = serializeTransaction({
    ...serializableTx,
    type: "eip1559",
  });
  //serializeTransaction(transaction);
  return readContract({
    contract: oracleContract,
    method: "function getL1Fee(bytes memory _data) view returns (uint256)",
    params: [serialized],
  });
}
