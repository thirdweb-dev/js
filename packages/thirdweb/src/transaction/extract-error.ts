import { decodeErrorResult, type Hex } from "viem";
import { resolveContractAbi } from "../contract/actions/resolve-abi.js";
import type { Abi } from "abitype";
import type { ThirdwebContract } from "../contract/index.js";

/**
 * @internal
 */
export async function extractError<abi extends Abi>(args: {
  error: unknown;
  contract?: ThirdwebContract<abi>;
}) {
  const { error, contract } = args;
  if (typeof error === "object") {
    // try to parse RPC error
    const errorObj = error as {
      message?: string;
      code?: number;
      data?: Hex;
    };
    if (errorObj.data) {
      const parsedError = decodeErrorResult({
        data: errorObj.data,
        abi: contract ? await resolveContractAbi(contract) : undefined,
      });
      return new Error(
        `Execution reverted: ${parsedError.errorName} - ${parsedError.args}`,
      );
    }
  }
  return error;
}
