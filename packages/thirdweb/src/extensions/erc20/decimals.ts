import { transaction } from "../../transaction/index.js";
import type { ThirdwebContract } from "../../contract/index.js";
import { read } from "../../transaction/actions/read.js";

export async function decimals(contract: ThirdwebContract) {
  return read(
    transaction(contract, {
      address: contract.address,
      chainId: contract.chainId,
      method: "function decimals() view returns (uint8)",
    }),
  );
}
