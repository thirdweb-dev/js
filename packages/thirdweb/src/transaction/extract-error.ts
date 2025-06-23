import type { Abi } from "abitype";
import { decodeErrorResult, type Hex, stringify } from "viem";
import { isInsufficientFundsError } from "../analytics/track/helpers.js";
import { trackInsufficientFundsError } from "../analytics/track/transaction.js";
import { resolveContractAbi } from "../contract/actions/resolve-abi.js";
import type { ThirdwebContract } from "../contract/contract.js";
import { isHex } from "../utils/encoding/hex.js";
import { IS_DEV } from "../utils/process.js";

/**
 * @internal
 */
export async function extractError<abi extends Abi>(args: {
  error: unknown;
  contract?: ThirdwebContract<abi>;
  fromAddress?: string;
}) {
  const { error, contract, fromAddress } = args;

  // Track insufficient funds errors during transaction preparation
  if (isInsufficientFundsError(error) && contract) {
    trackInsufficientFundsError({
      chainId: contract.chain?.id,
      client: contract.client,
      contractAddress: contract.address,
      error,
      walletAddress: fromAddress,
    });
  }

  const result = await extractErrorResult({ contract, error });
  if (result) {
    return new TransactionError(result, contract);
  }
  return error;
}

export async function extractErrorResult<abi extends Abi>(args: {
  error: unknown;
  contract?: ThirdwebContract<abi>;
}): Promise<string | undefined> {
  const { error, contract } = args;
  if (typeof error === "object") {
    // try to parse RPC error
    const errorObj = error as {
      message?: string;
      code?: number;
      data?: Hex;
    };
    if (errorObj.data) {
      if (errorObj.data !== "0x" && isHex(errorObj.data)) {
        let abi = contract?.abi;
        if (contract && !abi) {
          abi = await resolveContractAbi(contract).catch(() => undefined);
        }
        const parsedError = decodeErrorResult({
          abi,
          data: errorObj.data,
        });
        return `${parsedError.errorName}${parsedError.args ? ` - ${parsedError.args}` : ""}`;
      }
    }
  }
  return `Execution Reverted: ${stringify(error)}`;
}

class TransactionError<abi extends Abi> extends Error {
  public contractAddress: string | undefined;
  public chainId: number | undefined;

  constructor(reason: string, contract?: ThirdwebContract<abi>) {
    let message = reason;
    if (IS_DEV && contract) {
      // show more infor in dev
      message = [
        reason,
        "",
        `contract: ${contract.address}`,
        `chainId: ${contract.chain?.id}`,
      ].join("\n");
    }
    super(message);
    this.name = "TransactionError";
    this.contractAddress = contract?.address;
    this.chainId = contract?.chain?.id;
    this.message = message;
  }
}
