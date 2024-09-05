import type { Abi } from "abitype";
import { type Hex, decodeErrorResult } from "viem";
import { resolveContractAbi } from "../contract/actions/resolve-abi.js";
import type { ThirdwebContract } from "../contract/contract.js";
import { isHex } from "../utils/encoding/hex.js";
import { stringify } from "../utils/json.js";

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
      if (errorObj.data !== "0x" && isHex(errorObj.data)) {
        let abi = contract?.abi;
        if (contract && !abi) {
          abi = await resolveContractAbi(contract).catch(() => undefined);
        }
        // const abi = [
        //   "error AlreadyInitialized()",
        //   "error ArrayLengthsMismatch()",
        //   "error CallbackExecutionReverted()",
        //   "error CallbackFunctionAlreadyInstalled()",
        //   "error CallbackFunctionNotSupported()",
        //   "error CallbackFunctionRequired()",
        //   "error CallbackFunctionUnauthorizedCall()",
        //   "error FallbackFunctionAlreadyInstalled()",
        //   "error FallbackFunctionNotInstalled()",
        //   "error IndexOutOfBounds()",
        //   "error InsufficientBalance()",
        //   "error ModuleAlreadyInstalled()",
        //   "error ModuleInterfaceNotCompatible(bytes4 requiredInterfaceId)",
        //   "error ModuleNotInstalled()",
        //   "error ModuleOutOfSync()",
        //   "error NewOwnerIsZeroAddress()",
        //   "error NoHandoverRequest()",
        //   "error NotOwnerNorApproved()",
        //   "error Reentrancy()",
        //   "error SignatureMintUnauthorized()",
        //   "error TransferToNonERC1155ReceiverImplementer()",
        //   "error TransferToZeroAddress()",
        //   "error Unauthorized()",
        //   "error BeforeMintCallbackERC1155NotImplemented()",
        //   "error BeforeMintWithSignatureCallbackERC1155NotImplemented()",
        //   "error ClaimableIncorrectNativeTokenSent()",
        //   "error ClaimableIncorrectPriceOrCurrency()",
        //   "error ClaimableNotInAllowlist()",
        //   "error ClaimableOutOfSupply()",
        //   "error ClaimableOutOfTimeWindow()",
        //   "error ClaimableRequestInvalidToken()",
        //   "error ClaimableRequestMismatch()",
        //   "error ClaimableRequestOutOfTimeWindow()",
        //   "error ClaimableRequestUidReused()",
        //   "error ClaimableRequestUnauthorizedSignature()",
        //   "error ClaimableSignatureMintUnauthorized()",
        // ];
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
      return new TransactionError(
        `Execution Reverted: ${stringify(errorObj)}`,
        contract,
      );
    }
  }
  return error;
}

export const __DEV__ = process.env.NODE_ENV !== "production";

class TransactionError<abi extends Abi> extends Error {
  public contractAddress: string | undefined;
  public chainId: number | undefined;

  constructor(reason: string, contract?: ThirdwebContract<abi>) {
    let message = reason;
    if (__DEV__ && contract) {
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
