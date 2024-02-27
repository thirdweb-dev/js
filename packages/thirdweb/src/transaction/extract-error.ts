import { decodeErrorResult, type Hex } from "viem";
import { resolveContractAbi } from "../contract/actions/resolve-abi.js";
import type { Abi } from "abitype";
import type { ThirdwebContract } from "../contract/contract.js";

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
      if (errorObj.data !== "0x") {
        const parsedError = decodeErrorResult({
          data: errorObj.data,
          abi: contract?.abi
            ? contract.abi
            : contract
              ? await resolveContractAbi(contract)
              : undefined,
        });
        return new TransactionError(
          `${parsedError.errorName} - ${parsedError.args}`,
          contract,
        );
      } else {
        return new TransactionError("Execution Reverted", contract);
      }
    }
  }
  return error;
}

// eslint-disable-next-line turbo/no-undeclared-env-vars, better-tree-shaking/no-top-level-side-effects
export const __DEV__ = process.env.NODE_ENV !== "production";

class TransactionError<abi extends Abi> extends Error {
  public contractAddress: string | undefined;
  public chainId: number | undefined;

  constructor(reason: string, contract?: ThirdwebContract<abi>) {
    super();
    this.name = "TransactionError";
    this.contractAddress = contract?.address;
    this.chainId = contract?.chain?.id;
    if (__DEV__ && contract) {
      // show more infor in dev
      this.message = [
        reason,
        "",
        `contract: ${this.contractAddress}`,
        `chainId: ${this.chainId}`,
      ].join("\n");
    } else {
      this.message = reason;
    }
  }
}
