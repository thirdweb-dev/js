import { decodeErrorResult, type Hex } from "viem";
import { resolveContractAbi } from "../contract/actions/resolve-abi.js";
import type { ThirdwebContract } from "../index.js";

/**
 * @internal
 */
export async function extractError(args: {
  error: unknown;
  contract?: ThirdwebContract;
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
        `Execution reverted: ${parsedError.errorName} - ${parsedError.args.join(
          ",",
        )}`,
      );
    }
  }
  return error;
}
