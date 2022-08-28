import { BigNumber, BigNumberish, ethers, providers } from "ethers";
import { NATIVE_TOKENS, SUPPORTED_CHAIN_ID } from "../constants/index";

/**
 * Error that may get thrown if IPFS returns nothing for a given uri.
 * @internal
 */
export class NotFoundError extends Error {
  /** @internal */
  constructor(identifier?: string) {
    super(identifier ? `Object with id ${identifier} NOT FOUND` : "NOT_FOUND");
  }
}

/**
 * Error that may get thrown if an invalid address was passed
 * @internal
 */
export class InvalidAddressError extends Error {
  /** @internal */
  constructor(address?: string) {
    super(
      address ? `'${address}' is an invalid address` : "Invalid address passed",
    );
  }
}

/**
 * @internal
 */
export class MissingRoleError extends Error {
  /** @internal */
  /** @internal */
  constructor(address: string, role: string) {
    super(`MISSING ROLE: ${address} does not have the '${role}' role`);
  }
}

/**
 * @internal
 */
export class AssetNotFoundError extends Error {
  /** @internal */
  /** @internal */
  constructor(message = "The asset you're trying to use could not be found.") {
    super(`message: ${message}`);
  }
}

/**
 * @internal
 */
export class UploadError extends Error {
  /** @internal */
  constructor(message: string) {
    super(`UPLOAD_FAILED: ${message}`);
  }
}

/**
 * @internal
 */
export class FileNameMissingError extends Error {
  /** @internal */
  constructor() {
    super("File name is required when object is not a `File` type object.");
  }
}

/**
 * @internal
 */
export class DuplicateFileNameError extends Error {
  /** @internal */
  constructor(fileName: string) {
    super(
      `DUPLICATE_FILE_NAME_ERROR: File name ${fileName} was passed for more than one file.`,
    );
  }
}

/**
 * @internal
 */
export class NotEnoughTokensError extends Error {
  /** @internal */
  constructor(contractAddress: string, quantity: number, available: number) {
    super(
      `BALANCE ERROR: you do not have enough balance on contract ${contractAddress} to use ${quantity} tokens. You have ${available} tokens available.`,
    );
  }
}

/**
 * @internal
 */
export class MissingOwnerRoleError extends Error {
  /** @internal */
  constructor() {
    super(`LIST ERROR: you should be the owner of the token to list it.`);
  }
}

/**
 * @internal
 */
export class QuantityAboveLimitError extends Error {
  /** @internal */
  constructor(quantity: string) {
    super(`BUY ERROR: You cannot buy more than ${quantity} tokens`);
  }
}

/**
 * Thrown when data fails to fetch from storage.
 * @internal
 */
export class FetchError extends Error {
  public innerError?: Error;

  /** @internal */
  constructor(message: string, innerError?: Error) {
    super(`FETCH_FAILED: ${message}`);
    this.innerError = innerError;
  }
}

/**
 * Thrown when attempting to create a snapshot with duplicate leafs
 * @internal
 */
export class DuplicateLeafsError extends Error {
  constructor(message?: string) {
    super(`DUPLICATE_LEAFS${message ? ` : ${message}` : ""}`);
  }
}

/**
 * Thrown when attempting to update/cancel an auction that already started
 * @internal
 */
export class AuctionAlreadyStartedError extends Error {
  constructor(id?: string) {
    super(
      `Auction already started with existing bid${id ? `, id: ${id}` : ""}`,
    );
  }
}

/**
 * @internal
 */
export class FunctionDeprecatedError extends Error {
  /** @internal */
  constructor(message: string) {
    super(`FUNCTION DEPRECATED. ${message ? `Use ${message} instead` : ""}`);
  }
}

/**
 * Thrown when trying to retrieve a listing from a marketplace that doesn't exist
 * @internal
 */
export class ListingNotFoundError extends Error {
  constructor(marketplaceContractAddress: string, listingId?: string) {
    super(
      `Could not find listing.${
        marketplaceContractAddress
          ? ` marketplace address: ${marketplaceContractAddress}`
          : ""
      }${listingId ? ` listing id: ${listingId}` : ""}`,
    );
  }
}

/**
 * Thrown when trying to retrieve a listing of the wrong type
 * @internal
 */
export class WrongListingTypeError extends Error {
  constructor(
    marketplaceContractAddress: string,
    listingId?: string,
    actualType?: string,
    expectedType?: string,
  ) {
    super(
      `Incorrect listing type. Are you sure you're using the right method?.${
        marketplaceContractAddress
          ? ` marketplace address: ${marketplaceContractAddress}`
          : ""
      }${listingId ? ` listing id: ${listingId}` : ""}${
        expectedType ? ` expected type: ${expectedType}` : ""
      }${actualType ? ` actual type: ${actualType}` : ""}`,
    );
  }
}

/**
 * Thrown when attempting to transfer an asset that has restricted transferability
 * @internal
 */
export class RestrictedTransferError extends Error {
  constructor(assetAddress?: string) {
    super(
      `Failed to transfer asset, transfer is restricted.${
        assetAddress ? ` Address : ${assetAddress}` : ""
      }`,
    );
  }
}

/**
 * Thrown when attempting to execute an admin-role function.
 * @internal
 */
export class AdminRoleMissingError extends Error {
  constructor(
    address?: string,
    contractAddress?: string,
    message = "Failed to execute transaction",
  ) {
    super(
      `${message}, admin role is missing${
        address ? ` on address: ${address}` : ""
      }${contractAddress ? ` on contract: ${contractAddress}` : ""}`,
    );
  }
}

/**
 * Thrown when attempting to close an auction that has not ended
 * @internal
 */
export class AuctionHasNotEndedError extends Error {
  constructor(id?: string, endTime?: BigNumberish) {
    super(
      `Auction has not ended yet${id ? `, id: ${id}` : ""}${
        endTime ? `, end time: ${endTime.toString()}` : ""
      }`,
    );
  }
}

/**
 * @internal
 */
export type FunctionInfo = {
  signature: string;
  inputs: Record<string, any>;
  value: BigNumber;
};

/**
 * @public
 */
export class TransactionError extends Error {
  public reason: string;
  public from: string;
  public to: string;
  public data: string;
  public chain: providers.Network;
  public rpcUrl: string;
  public functionInfo: FunctionInfo | undefined;

  constructor(
    reason: string,
    from: string,
    to: string,
    data: string,
    network: providers.Network,
    rpcUrl: string,
    raw: string,
    functionInfo: FunctionInfo | undefined,
  ) {
    let builtErrorMsg = "Contract transaction failed\n\n";
    builtErrorMsg += `Message: ${reason}`;
    builtErrorMsg += "\n\n| Transaction info |\n";
    builtErrorMsg += withSpaces("from", from);
    builtErrorMsg += withSpaces("to", to);
    builtErrorMsg += withSpaces(
      `chain`,
      `${network.name} (${network.chainId})`,
    );

    if (functionInfo) {
      builtErrorMsg += "\n\n| Failed contract call info |\n";
      builtErrorMsg += withSpaces("function", functionInfo.signature);
      builtErrorMsg += withSpaces(
        `arguments`,
        JSON.stringify(functionInfo.inputs, null, 2),
      );
      if (functionInfo.value.gt(0)) {
        builtErrorMsg += withSpaces(
          "value",
          `${ethers.utils.formatEther(functionInfo.value)} ${
            NATIVE_TOKENS[network.chainId as SUPPORTED_CHAIN_ID]?.symbol
          }`,
        );
      }
    }

    try {
      const url = new URL(rpcUrl);
      builtErrorMsg += withSpaces(`RPC`, url.hostname);
    } catch (e2) {
      // ignore if can't parse URL
    }
    builtErrorMsg += "\n\n";
    builtErrorMsg +=
      "Need help with this error? Join our community: https://discord.gg/thirdweb";
    builtErrorMsg += "\n\n\n\n";
    builtErrorMsg += "| Raw error |";
    builtErrorMsg += "\n\n";
    builtErrorMsg += raw;
    super(builtErrorMsg);
    this.reason = reason;
    this.from = from;
    this.to = to;
    this.data = data;
    this.chain = network;
    this.rpcUrl = rpcUrl;
    this.functionInfo = functionInfo;
  }
}

/**
 * @internal
 * @param data
 * @param contractInterface
 */
function parseFunctionInfo(
  data: string,
  contractInterface: ethers.utils.Interface,
): FunctionInfo | undefined {
  try {
    const fnFragment = contractInterface.parseTransaction({
      data,
    });
    const results: Record<string, any> = {};
    const args = fnFragment.args;
    fnFragment.functionFragment.inputs.forEach((param, index) => {
      if (Array.isArray(args[index])) {
        const obj: Record<string, unknown> = {};
        const components = param.components;
        if (components) {
          const arr = args[index];
          for (let i = 0; i < components.length; i++) {
            const name = components[i].name;
            obj[name] = arr[i];
          }
          results[param.name] = obj;
        }
      } else {
        results[param.name] = args[index];
      }
    });
    return {
      signature: fnFragment.signature,
      inputs: results,
      value: fnFragment.value,
    };
  } catch (e) {
    return undefined;
  }
}

/**
 * @internal
 * @param error
 * @param network
 * @param signerAddress
 * @param contractAddress
 * @param contractInterface
 */
export async function convertToTWError(
  error: any,
  network: ethers.providers.Network,
  signerAddress: string,
  contractAddress: string,
  contractInterface: ethers.utils.Interface,
): Promise<TransactionError> {
  let raw: string;
  if (error.data) {
    // metamask errors comes as objects, apply parsing on data object
    // TODO test errors from other wallets
    raw = JSON.stringify(error.data);
  } else if (error instanceof Error) {
    // regular ethers.js error
    raw = error.message;
  } else {
    // not sure what this is, just throw it back
    raw = error.toString();
  }
  const reason =
    error.reason ||
    parseMessageParts(/.*?"message[^a-zA-Z0-9]*([^"\\]*).*?/, raw);
  const data = parseMessageParts(/.*?"data[^a-zA-Z0-9]*([^"\\]*).*?/, raw);
  const rpcUrl = parseMessageParts(/.*?"url[^a-zA-Z0-9]*([^"\\]*).*?/, raw);
  let from = parseMessageParts(/.*?"from[^a-zA-Z0-9]*([^"\\]*).*?/, raw);
  let to = parseMessageParts(/.*?"to[^a-zA-Z0-9]*([^"\\]*).*?/, raw);
  if (to === "") {
    // fallback to contractAddress
    to = contractAddress;
  }
  if (from === "") {
    // fallback to signerAddress
    from = signerAddress;
  }
  const functionInfo =
    data.length > 0 ? parseFunctionInfo(data, contractInterface) : undefined;
  return new TransactionError(
    reason,
    from,
    to,
    data,
    network,
    rpcUrl,
    raw,
    functionInfo,
  );
}

function withSpaces(label: string, content: string) {
  if (content === "") {
    return content;
  }
  const spaces = Array(10 - label.length)
    .fill(" ")
    .join("");
  return `\n${label}:${spaces}${content}`;
}

function parseMessageParts(regex: RegExp, raw: string): string {
  const msgMatches = raw.match(regex) || [];
  let extracted = "";
  if (msgMatches?.length > 0) {
    extracted += msgMatches[1];
  }
  return extracted;
}

/**
 * @internal
 * @param err
 * @param message
 */
export function includesErrorMessage(err: any, message: string): boolean {
  return (
    (err && err.toString().includes(message)) ||
    (err.message && err.message.toString().includes(message)) ||
    (err.error && err.error.toString().includes(message))
  );
}
