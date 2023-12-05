import type { WagmiConnector } from "../wagmi-connectors/WagmiConnector";
import type { utils } from "ethers";

/**
 * Error subclass implementing JSON RPC 2.0 errors and Ethereum RPC errors per EIP-1474.
 * @see https://eips.ethereum.org/EIPS/eip-1474
 */
export class RpcError<T = undefined> extends Error {
  readonly cause: unknown;
  readonly code: number;
  readonly data?: T;

  constructor(
    /** Human-readable string */
    message: string,
    options: {
      cause?: unknown;
      /** Number error code */
      code: number;
      /** Other useful information about error */
      data?: T;
    },
  ) {
    const { cause, code, data } = options;
    if (!Number.isInteger(code)) {
      throw new Error('"code" must be an integer.');
    }
    if (!message || typeof message !== "string") {
      throw new Error('"message" must be a nonempty string.');
    }

    super(`${message}. Cause: ${JSON.stringify(cause)}`);
    this.cause = cause;
    this.code = code;
    this.data = data;
  }
}

/**
 * @internal
 * Error subclass implementing Ethereum Provider errors per EIP-1193.
 * @see https://eips.ethereum.org/EIPS/eip-1193
 */
export class ProviderRpcError<T = undefined> extends RpcError<T> {
  /**
   * Create an Ethereum Provider JSON-RPC error.
   * `code` must be an integer in the `1000 <= 4999` range.
   */
  constructor(
    /** Human-readable string */
    message: string,
    options: {
      cause?: unknown;
      /**
       * Number error code
       * @see https://eips.ethereum.org/EIPS/eip-1193#error-standards
       */
      code: 4001 | 4100 | 4200 | 4900 | 4901 | 4902;
      /** Other useful information about error */
      data?: T;
    },
  ) {
    const { cause, code, data } = options;
    if (!(Number.isInteger(code) && code >= 1000 && code <= 4999)) {
      throw new Error(
        '"code" must be an integer such that: 1000 <= code <= 4999',
      );
    }

    super(message, { cause, code, data });
  }
}

/**
 * @internal
 */
export class AddChainError extends Error {
  name = "AddChainError";
  message = "Error adding chain";
}

/**
 * @internal
 */
export class ChainNotConfiguredError extends Error {
  name = "ChainNotConfigured";

  constructor({
    chainId,
    connectorId,
  }: {
    chainId: number;
    connectorId: string;
  }) {
    super(`Chain "${chainId}" not configured for connector "${connectorId}".`);
  }
}

export class ConnectorNotFoundError extends Error {
  name = "ConnectorNotFoundError";
  message = "Connector not found";
}

export class ResourceUnavailableError extends RpcError {
  name = "ResourceUnavailable";

  constructor(cause: unknown) {
    super("Resource unavailable", { cause, code: -32002 });
  }
}
/**
 * @internal
 */
export class SwitchChainError extends ProviderRpcError {
  name = "SwitchChainError";

  constructor(cause: unknown) {
    super("Error switching chain", { cause, code: 4902 });
  }
}
/**
 * @internal
 */
export class SwitchChainNotSupportedError extends Error {
  name = "SwitchChainNotSupportedError";

  constructor({ connector }: { connector: WagmiConnector }) {
    super(`"${connector.name}" does not support programmatic chain switching.`);
  }
}
/**
 * @internal
 */
export class UserRejectedRequestError extends ProviderRpcError {
  name = "UserRejectedRequestError";

  constructor(cause: unknown) {
    super("User rejected request", { cause, code: 4001 });
  }
}

/**
 * @internal
 */
// Ethers does not have an error type so we can use this for casting
// https://github.com/ethers-io/ethers.js/blob/main/packages/logger/src.ts/index.ts#L268
export type EthersError = Error & {
  reason: string;
  code: keyof typeof utils.Logger.errors;
};
