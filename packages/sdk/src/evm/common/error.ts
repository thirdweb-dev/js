import { Feature } from "../constants/contract-features";
import { NATIVE_TOKENS, SUPPORTED_CHAIN_ID } from "../constants/index";
import { BigNumber, BigNumberish, ethers, providers } from "ethers";

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
 * Thrown when attempting to call a contract function that is not implemented
 * @internal
 */
export class ExtensionNotImplementedError extends Error {
  constructor(feature: Feature) {
    super(
      `This functionality is not available because the contract does not implement the '${feature.docLinks.contracts}' Extension. Learn how to unlock this functionality at https://portal.thirdweb.com/extensions `,
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
  #reason: string;

  constructor(
    reason: string,
    from: string,
    to: string,
    method: string,
    data: string,
    network: providers.Network,
    rpcUrl: string,
    functionInfo: FunctionInfo | undefined,
  ) {
    let errorMessage = `\n\n\n╔═══════════════════╗\n║ TRANSACTION ERROR ║\n╚═══════════════════╝\n\n`;
    errorMessage += `Reason: ${reason}`;
    errorMessage += `\n\n\n╔═════════════════════════╗\n║ TRANSACTION INFORMATION ║\n╚═════════════════════════╝\n`;
    errorMessage += withSpaces("from", from);
    errorMessage += withSpaces("to", to);
    errorMessage += withSpaces(`chain`, `${network.name} (${network.chainId})`);

    if (functionInfo) {
      errorMessage += withSpaces("function", functionInfo.signature);
      errorMessage += withSpaces(
        `arguments`,
        JSON.stringify(functionInfo.inputs, null, 2),
      );
      if (functionInfo.value.gt(0)) {
        errorMessage += withSpaces(
          "value",
          `${ethers.utils.formatEther(functionInfo.value)} ${
            NATIVE_TOKENS[network.chainId as SUPPORTED_CHAIN_ID]?.symbol
          }`,
        );
      }
    } else {
      errorMessage += withSpaces("function", method);
    }

    errorMessage += withSpaces(`data`, `${data}`);

    try {
      const url = new URL(rpcUrl);
      errorMessage += withSpaces(`rpc`, url.hostname);
    } catch (e2) {
      // ignore if can't parse URL
    }

    errorMessage += `\n\n\n╔═════════════════════╗\n║ DEBUGGING RESOURCES ║\n╚═════════════════════╝\n\n`;
    errorMessage += `Need helping debugging? Come tell us about your error in our Discord channel and we'll help you out:\nhttps://discord.gg/thirdweb`;
    errorMessage += `\n\n`;

    super(errorMessage);

    this.#reason = reason;
  }

  get reason(): string {
    return this.#reason;
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
  if (typeof error === "object") {
    // metamask errors comes as objects, apply parsing on data object
    raw = JSON.stringify(error);
  } else {
    // not sure what this is, just throw it back
    raw = error.toString();
  }

  let reason =
    parseMessageParts(/.*?"message[^a-zA-Z0-9]*([^"\\]*).*?/, raw) ||
    parseMessageParts(/.*?"reason[^a-zA-Z0-9]*([^"\\]*).*?/, raw);

  if (reason && reason.toLowerCase().includes("cannot estimate gas")) {
    // the error might be in the next reason block
    const nextReason = parseMessageParts(
      /.*?"reason[^a-zA-Z0-9]*([^"\\]*).*?/,
      raw.slice(raw.indexOf(reason) + reason.length),
    );
    if (nextReason) {
      reason = nextReason;
    }
  }

  const method = parseMessageParts(/.*?"method[^a-zA-Z0-9]*([^"\\]*).*?/, raw);
  const data = parseMessageParts(/.*?"data[^a-zA-Z0-9]*([^"\\]*).*?/, raw);
  const rpcUrl = parseMessageParts(/.*?"url[^a-zA-Z0-9]*([^"\\]*).*?/, raw);
  let from = parseMessageParts(/.*?"from[^a-zA-Z0-9]*([^"\\]*).*?/, raw);
  let to = parseMessageParts(/.*?"to[^a-zA-Z0-9]*([^"\\]*).*?/, raw);

  // fallback to contractAddress
  if (to === "") {
    to = contractAddress;
  }

  // fallback to signerAddress
  if (from === "") {
    from = signerAddress;
  }

  const functionInfo =
    data.length > 0 ? parseFunctionInfo(data, contractInterface) : undefined;

  return new TransactionError(
    reason,
    from,
    to,
    method,
    data,
    network,
    rpcUrl,
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
  if (!err) {
    return false;
  }
  return (
    (err && err.toString().includes(message)) ||
    (err && err.message && err.message.toString().includes(message)) ||
    (err && err.error && err.error.toString().includes(message))
  );
}
