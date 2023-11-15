import { SUPPORTED_CHAIN_ID } from "../constants/chains/SUPPORTED_CHAIN_ID";
import { NATIVE_TOKENS } from "../constants/currency";
import { Feature } from "../constants/contract-features";
import { ContractSource } from "../schema/contracts/custom";
import { BigNumber, type BigNumberish, utils, type providers } from "ethers";

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
      `This functionality is not available because the contract does not implement the '${feature.name}' Extension. Learn how to unlock this functionality at https://portal.thirdweb.com/extensions `,
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

export type TransactionErrorInfo = {
  reason: string;
  from: string;
  to?: string;
  network: providers.Network;
  method?: string;
  data?: string;
  rpcUrl?: string;
  value?: BigNumber;
  hash?: string;
  contractName?: string;
  sources?: ContractSource[];
};

/**
 * @public
 */
export class TransactionError extends Error {
  #reason: string;
  #info: TransactionErrorInfo;
  #raw: any;

  constructor(info: TransactionErrorInfo, raw: any) {
    let errorMessage = `\n\n\n╔═══════════════════╗\n║ TRANSACTION ERROR ║\n╚═══════════════════╝\n\n`;
    errorMessage += `Reason: ${info.reason}`;
    errorMessage += `\n\n\n╔═════════════════════════╗\n║ TRANSACTION INFORMATION ║\n╚═════════════════════════╝\n`;
    errorMessage += withSpaces("from", info.from);
    if (info.to) {
      errorMessage += withSpaces(
        "to",
        info.contractName ? `${info.to} (${info.contractName})` : info.to,
      );
    }
    errorMessage += withSpaces(
      `chain`,
      `${info.network.name} (${info.network.chainId})`,
    );

    if (info.rpcUrl) {
      try {
        const url = new URL(info.rpcUrl);
        errorMessage += withSpaces(`rpc`, url.hostname);
      } catch (e2) {
        // ignore if can't parse URL
      }
    }

    if (info.hash) {
      errorMessage += withSpaces(`tx hash`, info.hash);
    }

    if (info.value && info.value.gt(0)) {
      errorMessage += withSpaces(
        "value",
        `${utils.formatEther(info.value)} ${
          NATIVE_TOKENS[info.network.chainId as SUPPORTED_CHAIN_ID]?.symbol ||
          ""
        }`,
      );
    }

    errorMessage += withSpaces(`data`, `${info.data}`);

    if (info.method) {
      errorMessage += withSpaces("method", info.method);
    }

    if (info.sources) {
      const revertFile = info.sources.find((file) =>
        file.source.includes(info.reason),
      );

      if (revertFile) {
        const lines = revertFile.source
          .split("\n")
          .map((line, index) => `${index + 1}  ${line}`);
        const revertLine = lines.findIndex((line) =>
          line.includes(info.reason),
        );
        lines[revertLine] += "   <-- REVERT";
        const errorLines = lines.slice(revertLine - 8, revertLine + 4);

        errorMessage += `\n\n\n╔══════════════════════╗\n║ SOLIDITY STACK TRACE ║\n╚══════════════════════╝\n\n`;
        errorMessage += `File: ${revertFile.filename.replace(
          "node_modules/",
          "",
        )}\n\n`;
        errorMessage += errorLines.join("\n");
      }
    }

    errorMessage += `\n\n\n╔═════════════════════╗\n║ DEBUGGING RESOURCES ║\n╚═════════════════════╝\n\n`;
    errorMessage += `Need helping debugging? Join our Discord: https://discord.gg/thirdweb`;
    errorMessage += `\n\n`;

    super(errorMessage);

    this.#reason = info.reason;
    this.#info = info;
    this.#raw = raw;
  }

  // Keep reason here for backwards compatibility
  get reason(): string {
    return this.#reason;
  }

  get raw(): any {
    return this.#raw;
  }

  get info(): TransactionErrorInfo {
    return this.#info;
  }
}

/**
 * @internal
 */
export function parseRevertReason(error: any): string {
  if (error.reason && !error.reason.includes("cannot estimate gas")) {
    return error.reason as string;
  }

  if (error.error) {
    return error.error as string;
  }

  // I think this code path should never be hit, but just in case

  let errorString: string = error;
  if (typeof error === "object") {
    // MetaMask errors come as objects so parse them first
    errorString = JSON.stringify(error);
  } else if (typeof error !== "string") {
    errorString = error.toString();
  }

  return (
    parseMessageParts(/.*?"message":"([^"\\]*).*?/, errorString) ||
    parseMessageParts(/.*?"reason":"([^"\\]*).*?/, errorString) ||
    error.message ||
    ""
  );
}

function withSpaces(label: string, content: string) {
  if (content === "") {
    return content;
  }

  const spaces = Array(10 - label.length)
    .fill(" ")
    .join("");

  if (content.includes("\n")) {
    content = "\n\n  " + content.split("\n").join(`\n  `);
  } else {
    content = `${spaces}${content}`;
  }

  return `\n${label}:${content}`;
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
 * @param err - The error to check
 * @param message - The message to check for
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
