import type { Abi } from "abitype";
import { type Hex, decodeErrorResult } from "viem";
import { resolveContractAbi } from "../contract/actions/resolve-abi.js";
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
        let abi = contract?.abi;
        if (contract && !abi) {
          abi = await resolveContractAbi(contract).catch(() => undefined);
        }
        const parsedError = decodeErrorResult({
          data: errorObj.data,
          abi,
        });
        return new TransactionError(
          `${parsedError.errorName}${
            parsedError.args ? ` - ${parsedError.args}` : ""
          }`,
          contract,
        );
      }
      return new TransactionError("Execution Reverted", contract);
    }
  }
  return error;
}

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
