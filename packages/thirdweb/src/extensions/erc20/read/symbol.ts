import { transaction } from "../../../transaction/index.js";
import type { ThirdwebContract } from "../../../contract/index.js";
import { read } from "../../../transaction/actions/read.js";

export async function symbol(contract: ThirdwebContract) {
  // TODO consider caching this
  return read(
    transaction(contract, {
      address: contract.address,
      chainId: contract.chainId,
      method: "function symbol() view returns (string)",
    }),
  );
}
