import type { Abi } from "abitype";
import { type Hex, decodeErrorResult, stringify } from "viem";
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
}) {
  const { error, contract } = args;
  const result = await extractErrorResult({ error, contract });
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
          data: errorObj.data,
          abi,
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
