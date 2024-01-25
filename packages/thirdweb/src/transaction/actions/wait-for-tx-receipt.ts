import type { ThirdwebContract } from "../../contract/index.js";
import { getRpcClient } from "../../rpc/index.js";
import { getTransactionReceipt } from "../../rpc/methods.js";
import type { Abi } from "abitype";

const POLL_LIMIT_MS = 1000 * 60 * 5; // 5 minutes
const POLL_WAIT_MS = 1000 * 5; // 5 seconds

export async function waitForReceipt<abi extends Abi>({
  transactionHash,
  contract,
}: {
  transactionHash: string;
  contract: ThirdwebContract<abi>;
}) {
  if (!transactionHash) {
    throw new Error(
      "Transaction has no txHash to wait for, did you execute it?",
    );
  }
  const start = Date.now();
  const rpcClient = getRpcClient(contract, { chainId: contract.chainId });
  while (Date.now() - start < POLL_LIMIT_MS) {
    // if we don't yet have a tx hash then we can't check for a receipt, so just try again

    const receipt = await getTransactionReceipt(rpcClient, transactionHash);
    if (receipt) {
      return receipt;
    }

    await new Promise((resolve) => setTimeout(resolve, POLL_WAIT_MS));
  }
  throw new Error("Timeout waiting for transaction receipt");
}
