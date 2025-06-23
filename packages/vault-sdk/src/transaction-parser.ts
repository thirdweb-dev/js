// Update type definitions for our standardized types
import type {
  AccessList,
  Address,
  EthereumTypedTransaction,
  SignedAuthorization,
  TxEip1559,
  TxEip2930,
  TxEip4844,
  TxEip4844WithSidecar,
  TxEip7702,
  TxLegacy,
} from "./transaction-types.js";

// Custom error class for transaction parsing errors
class ParseTransactionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ParseTransactionError";
  }
}

/**
 * Type predicate assert function that helps TypeScript understand
 * that the condition guarantees a value is not null or undefined
 */
function assert<T>(
  condition: T | null | undefined,
  message: string,
  // The double negative here (!!) converts the value to a boolean
  // while preserving the type information
  predicate: (value: T) => boolean = (value) => !!value,
): asserts condition is T {
  if (!condition || !predicate(condition)) {
    throw new ParseTransactionError(message);
  }
}
// Type definitions for client-side data
type Hex = string;

// Define possible sidecar formats we might receive
type SingleSidecar = {
  blobs?: string[];
  commitments?: string[];
  proofs?: string[];
};

type MultipleSidecar = {
  blob: string;
  commitment: string;
  proof: string;
}[];

// Client-side transaction input format
type ClientSideSignTransactionOptions = {
  type?: string | undefined;
  accessList?:
    | Array<{
        address: string;
        storageKeys: string[];
      }>
    | readonly {
        address: string;
        storageKeys: readonly string[];
      }[]
    | undefined;
  chainId?: number | bigint | string | undefined;
  gasPrice?: bigint | string | undefined;
  maxFeePerGas?: bigint | string | undefined;
  maxPriorityFeePerGas?: bigint | string | undefined;
  data?: Hex | undefined;
  input?: Hex | undefined;
  to?: string | null | undefined;
  nonce?: number | bigint | string | undefined;
  value?: bigint | string | undefined;
  gas?: bigint | string | number | undefined;
  gasLimit?: bigint | string | number | undefined;
  authorizationList?: readonly {
    address: string;
    r: Hex | bigint;
    s: Hex | bigint;
    // always need either v or yParity. v is only for backwards compatibility
    v?: bigint | number | string;
    yParity?: number | bigint | string;
    nonce: number | bigint | string;
    chainId: number | bigint | string;
  }[];

  blobVersionedHashes?: string[] | undefined;
  maxFeePerBlobGas?: bigint | string | undefined;
  // Direct blob fields
  blobs?: string[] | undefined;
  commitments?: string[] | undefined;
  proofs?: string[] | undefined;
  // Sidecar options - could be in different formats
  sidecar?: SingleSidecar | undefined;
  sidecars?: MultipleSidecar | undefined;
};

/**
 * Parse client transaction data into standardized transaction format
 */
function parseTransaction(
  clientTx: ClientSideSignTransactionOptions,
): EthereumTypedTransaction {
  try {
    // Normalize and validate basics first
    const normalizedTx = {
      // Handle gas/gasLimit field, converting to hex
      gasLimit: normalizeGasLimit(clientTx),
      // Handle string/data field, prioritizing input
      input: normalizeInputData(clientTx),

      // Convert nonce to hex string
      nonce: normalizeNonce(clientTx),

      // Handle to address, null for contract creation
      to: normalizeTo(clientTx),

      // Convert value to hex string
      value: normalizeValue(clientTx),
    };

    // Determine transaction type
    let transaction: EthereumTypedTransaction;

    // First check if type is explicitly provided
    if (clientTx.type !== undefined) {
      const normalizedType = normalizeTypeField(clientTx.type);
      transaction = createTransactionFromType(
        normalizedType,
        clientTx,
        normalizedTx,
      );
    } else {
      // If no type, infer from available fields
      transaction = inferTransactionType(clientTx, normalizedTx);
    }

    // Final validation
    validateTransaction(transaction);

    return transaction;
  } catch (error) {
    // Ensure all errors are ParseTransactionError
    if (error instanceof ParseTransactionError) {
      throw error;
    }

    throw new ParseTransactionError(
      error instanceof Error ? error.message : String(error),
    );
  }
}

/**
 * Convert any numeric value to a standardized hex string
 */
function toHexString(value: number | bigint | string | undefined): string {
  if (value === undefined) {
    return "0x0";
  }

  let bigIntValue: bigint;

  // Convert to BigInt for consistent handling
  if (typeof value === "string") {
    // Check if it's already a hex string
    if (value.startsWith("0x")) {
      return value;
    }
    // Parse decimal string
    bigIntValue = BigInt(value);
  } else if (typeof value === "number") {
    bigIntValue = BigInt(value);
  } else {
    bigIntValue = value;
  }

  // Convert to lowercase hex string with 0x prefix
  return `0x${bigIntValue.toString(16)}`;
}

/**
 * Normalize the type field to standard hex format (0x00, 0x01, etc.)
 */
function normalizeTypeField(typeValue: string): string {
  // Handle hex format (0x0, 0x01, etc.)
  if (typeValue.startsWith("0x")) {
    const numericPart = typeValue.substring(2);
    return `0x${numericPart.padStart(2, "0")}`;
  }

  // Handle numeric format (0, 1, etc.)
  const numericValue = Number.parseInt(typeValue, 10);
  return `0x${numericValue.toString(16).padStart(2, "0")}`;
}

/**
 * Create transaction based on explicit type
 */
function createTransactionFromType(
  normalizedType: string,
  clientTx: ClientSideSignTransactionOptions,
  normalizedFields: {
    input: string;
    nonce: string;
    value: string;
    to: Address | null;
    gasLimit: string;
  },
): EthereumTypedTransaction {
  switch (normalizedType) {
    case "0x00":
      return createLegacyTransaction(clientTx, normalizedFields);
    case "0x01":
      return createEip2930Transaction(clientTx, normalizedFields);
    case "0x02":
      return createEip1559Transaction(clientTx, normalizedFields);
    case "0x03":
      return createEip4844Transaction(clientTx, normalizedFields);
    case "0x05":
      return createEip7702Transaction(clientTx, normalizedFields);
    default:
      throw new ParseTransactionError(
        `Unsupported transaction type: ${normalizedType}`,
      );
  }
}

/**
 * Infer transaction type based on available fields
 */
function inferTransactionType(
  clientTx: ClientSideSignTransactionOptions,
  normalizedFields: {
    input: string;
    nonce: string;
    value: string;
    to: Address | null;
    gasLimit: string;
  },
): EthereumTypedTransaction {
  // Check for EIP-4844 specific fields (blob-related)
  if (hasBlobFields(clientTx)) {
    return createEip4844Transaction(clientTx, normalizedFields);
  }

  // Check for EIP-7702 specific fields (authorization list)
  if (clientTx.authorizationList) {
    return createEip7702Transaction(clientTx, normalizedFields);
  }

  // Check for EIP-1559 specific fields (fee market)
  if (
    clientTx.maxFeePerGas !== undefined &&
    clientTx.maxPriorityFeePerGas !== undefined
  ) {
    return createEip1559Transaction(clientTx, normalizedFields);
  }

  // Check for EIP-2930 specific fields (access list + chain ID)
  if (clientTx.accessList !== undefined && clientTx.chainId !== undefined) {
    return createEip2930Transaction(clientTx, normalizedFields);
  }

  // Check for legacy transaction with chainId
  if (clientTx.chainId !== undefined) {
    return createLegacyTransaction(clientTx, normalizedFields);
  }

  // Default to legacy with no chainId
  return createLegacyTransaction(clientTx, normalizedFields);
}

/**
 * Check if transaction has blob-related fields (EIP-4844)
 */
function hasBlobFields(clientTx: ClientSideSignTransactionOptions): boolean {
  return (
    clientTx.blobVersionedHashes !== undefined ||
    clientTx.blobs !== undefined ||
    clientTx.sidecar !== undefined ||
    clientTx.sidecars !== undefined ||
    clientTx.maxFeePerBlobGas !== undefined
  );
}

/**
 * Normalize input/data field
 */
function normalizeInputData(
  clientTx: ClientSideSignTransactionOptions,
): string {
  const { data, input } = clientTx;

  // If both exist, verify they match
  if (data !== undefined && input !== undefined) {
    // Check if they're effectively the same (considering empty values)
    const isDataEmpty = data === "0x" || data === "";
    const isInputEmpty = input === "0x" || input === "";

    assert(
      data === input || (isDataEmpty && isInputEmpty),
      "Data and input fields do not match",
    );

    // Prefer input, but use whichever has content
    return input || data;
  }

  // If only one exists, use that
  if (input !== undefined) return input;
  if (data !== undefined) return data;

  // Default to empty hex
  return "0x";
}

/**
 * Normalize nonce to hex string
 */
function normalizeNonce(clientTx: ClientSideSignTransactionOptions): string {
  const { nonce } = clientTx;

  if (nonce === undefined) {
    return "0x0"; // Default nonce as hex
  }

  return toHexString(nonce);
}

/**
 * Normalize value to hex string
 */
function normalizeValue(clientTx: ClientSideSignTransactionOptions): string {
  const { value } = clientTx;

  if (value === undefined) {
    return "0x0"; // Default value as hex
  }

  return toHexString(value);
}

/**
 * Normalize to address
 */
function normalizeTo(
  clientTx: ClientSideSignTransactionOptions,
): Address | null {
  const { to } = clientTx;

  if (to === undefined || to === null) {
    return null; // Contract creation
  }

  return to as Address;
}

/**
 * Normalize gas limit to hex string
 */
function normalizeGasLimit(clientTx: ClientSideSignTransactionOptions): string {
  const { gas, gasLimit } = clientTx;

  // Prefer gasLimit, fall back to gas
  const rawGasLimit = gasLimit !== undefined ? gasLimit : gas;

  assert(rawGasLimit, "Gas limit not specified");

  return toHexString(rawGasLimit);
}

/**
 * Normalize chain ID to hex string
 */
function normalizeChainId(
  chainId: number | bigint | string | undefined,
): string | undefined {
  if (chainId === undefined) {
    return undefined;
  }

  return toHexString(chainId);
}

/**
 * Normalize gas price to hex string
 */
function normalizeGasPrice(value: bigint | string | undefined): string {
  assert(value, "Gas price value not specified");

  return toHexString(value);
}

/**
 * Normalize access list
 */
function normalizeAccessList(
  clientTx: ClientSideSignTransactionOptions,
): AccessList {
  const { accessList } = clientTx;

  // Always return an array, empty if not provided
  if (!accessList) {
    return [];
  }

  return accessList as AccessList;
}

/**
 * Normalizes the authorization list from client format to standardized format
 */
function normalizeAuthorizationList(
  clientAuthList?: readonly {
    address: string;
    r: string | bigint;
    s: string | bigint;
    v?: bigint | number | string;
    yParity?: number | bigint | string;
    nonce: number | bigint | string;
    chainId: number | bigint | string;
  }[],
): SignedAuthorization[] {
  if (!clientAuthList || clientAuthList.length === 0) {
    throw new ParseTransactionError(
      "Authorization list is required and cannot be empty",
    );
  }

  return Array.from(clientAuthList).map((auth, index) => {
    // Validate required fields
    assert(auth.address, `Authorization at index ${index} is missing address`);
    assert(auth.r, `Authorization at index ${index} is missing r value`);
    assert(auth.s, `Authorization at index ${index} is missing s value`);
    assert(auth.chainId, `Authorization at index ${index} is missing chainId`);

    // Get yParity either from yParity field or derived from v
    let yParity: number;

    if (auth.yParity !== undefined) {
      // Convert yParity to number (0 or 1)
      const rawYParity =
        typeof auth.yParity === "string"
          ? auth.yParity.startsWith("0x")
            ? Number.parseInt(auth.yParity, 16)
            : Number.parseInt(auth.yParity, 10)
          : Number(auth.yParity);

      // Validate yParity is 0 or 1
      if (rawYParity !== 0 && rawYParity !== 1) {
        throw new ParseTransactionError(
          `Authorization at index ${index} has invalid yParity: must be 0 or 1`,
        );
      }

      yParity = rawYParity;
    } else if (auth.v !== undefined) {
      // Derive yParity from v
      // Note: v is either 27/28 (for legacy) or chainId*2 + 35/36
      const v =
        typeof auth.v === "string"
          ? auth.v.startsWith("0x")
            ? BigInt(auth.v)
            : BigInt(auth.v)
          : BigInt(auth.v);

      // Extract yParity from v
      if (v === 27n || v === 28n) {
        // Legacy format
        yParity = v === 27n ? 0 : 1;
      } else {
        // EIP-155 format: v = chainId * 2 + 35 + yParity
        const chainId =
          typeof auth.chainId === "string"
            ? auth.chainId.startsWith("0x")
              ? BigInt(auth.chainId)
              : BigInt(auth.chainId)
            : BigInt(auth.chainId);

        const expectedBase = chainId * 2n + 35n;
        if (v === expectedBase) {
          yParity = 0;
        } else if (v === expectedBase + 1n) {
          yParity = 1;
        } else {
          throw new ParseTransactionError(
            `Authorization at index ${index} has invalid v value for the given chainId`,
          );
        }
      }
    } else {
      throw new ParseTransactionError(
        `Authorization at index ${index} is missing both yParity and v`,
      );
    }

    return {
      address: auth.address as Address,
      chainId: toHexString(auth.chainId),
      r: toHexString(auth.r),
      s: toHexString(auth.s),
      yParity,
    };
  });
}

/**
 * Extract and normalize blob data from various possible formats
 */
function extractBlobData(clientTx: ClientSideSignTransactionOptions): {
  blobs: string[];
  commitments: string[];
  proofs: string[];
} | null {
  // Direct fields on the transaction
  if (clientTx.blobs && clientTx.commitments && clientTx.proofs) {
    return {
      blobs: clientTx.blobs,
      commitments: clientTx.commitments,
      proofs: clientTx.proofs,
    };
  }

  // Single sidecar object
  if (clientTx.sidecar) {
    const { blobs, commitments, proofs } = clientTx.sidecar;
    if (blobs && commitments && proofs) {
      return { blobs, commitments, proofs };
    }
  }

  // Multiple sidecars array
  if (
    clientTx.sidecars &&
    Array.isArray(clientTx.sidecars) &&
    clientTx.sidecars.length > 0
  ) {
    const blobs: string[] = [];
    const commitments: string[] = [];
    const proofs: string[] = [];

    for (const sidecar of clientTx.sidecars) {
      if (sidecar.blob && sidecar.commitment && sidecar.proof) {
        blobs.push(sidecar.blob);
        commitments.push(sidecar.commitment);
        proofs.push(sidecar.proof);
      }
    }

    if (blobs.length > 0 && commitments.length > 0 && proofs.length > 0) {
      return { blobs, commitments, proofs };
    }
  }

  return null;
}

/**
 * Create a legacy transaction
 */
function createLegacyTransaction(
  clientTx: ClientSideSignTransactionOptions,
  normalizedFields: {
    input: string;
    nonce: string;
    value: string;
    to: Address | null;
    gasLimit: string;
  },
): TxLegacy {
  const { chainId, gasPrice } = clientTx;
  const { input, nonce, value, to, gasLimit } = normalizedFields;

  assert(gasPrice, "Gas price is required for legacy transactions");

  return {
    chainId: normalizeChainId(chainId),
    gasLimit, // Optional for legacy
    gasPrice: normalizeGasPrice(gasPrice),
    input,
    nonce,
    to,
    type: "0x00",
    value,
  };
}

/**
 * Create an EIP-2930 transaction
 */
function createEip2930Transaction(
  clientTx: ClientSideSignTransactionOptions,
  normalizedFields: {
    input: string;
    nonce: string;
    value: string;
    to: Address | null;
    gasLimit: string;
  },
): TxEip2930 {
  const { chainId, gasPrice } = clientTx;
  const { input, nonce, value, to, gasLimit } = normalizedFields;

  assert(chainId, "Chain ID is required for EIP-2930 transactions");
  assert(gasPrice, "Gas price is required for EIP-2930 transactions");

  return {
    accessList: normalizeAccessList(clientTx),
    chainId: normalizeChainId(chainId) as string, // Required for EIP-2930
    gasLimit,
    gasPrice: normalizeGasPrice(gasPrice),
    input,
    nonce,
    to,
    type: "0x01",
    value,
  };
}

/**
 * Create an EIP-1559 transaction
 */
function createEip1559Transaction(
  clientTx: ClientSideSignTransactionOptions,
  normalizedFields: {
    input: string;
    nonce: string;
    value: string;
    to: Address | null;
    gasLimit: string;
  },
): TxEip1559 {
  const { chainId, maxFeePerGas, maxPriorityFeePerGas } = clientTx;
  const { input, nonce, value, to, gasLimit } = normalizedFields;

  assert(chainId, "Chain ID is required for EIP-1559 transactions");
  assert(maxFeePerGas, "Max fee per gas is required for EIP-1559 transactions");
  assert(
    maxPriorityFeePerGas,
    "Max priority fee per gas is required for EIP-1559 transactions",
  );

  return {
    accessList: normalizeAccessList(clientTx),
    chainId: normalizeChainId(chainId) as string,
    gasLimit,
    input,
    maxFeePerGas: normalizeGasPrice(maxFeePerGas),
    maxPriorityFeePerGas: normalizeGasPrice(maxPriorityFeePerGas),
    nonce,
    to,
    type: "0x02", // Always provide access list, empty array if not specified
    value,
  };
}

/**
 * Create an EIP-4844 transaction
 */
function createEip4844Transaction(
  clientTx: ClientSideSignTransactionOptions,
  normalizedFields: {
    input: string;
    nonce: string;
    value: string;
    to: Address | null;
    gasLimit: string;
  },
): TxEip4844 | TxEip4844WithSidecar {
  const {
    chainId,
    maxFeePerGas,
    maxPriorityFeePerGas,
    blobVersionedHashes,
    maxFeePerBlobGas,
  } = clientTx;
  const { input, nonce, value, gasLimit } = normalizedFields;
  const { to } = normalizedFields;

  // Validate required fields
  assert(to !== null, "EIP-4844 transactions require a valid to address");
  assert(chainId, "Chain ID is required for EIP-4844 transactions");
  assert(maxFeePerGas, "Max fee per gas is required for EIP-4844 transactions");
  assert(
    maxPriorityFeePerGas,
    "Max priority fee per gas is required for EIP-4844 transactions",
  );
  assert(
    blobVersionedHashes,
    "Blob versioned hashes are required for EIP-4844 transactions",
  );
  assert(
    maxFeePerBlobGas,
    "Max fee per blob gas is required for EIP-4844 transactions",
  );

  // Base transaction without sidecar
  const baseTransaction: TxEip4844 = {
    accessList: normalizeAccessList(clientTx),
    blobVersionedHashes,
    chainId: normalizeChainId(chainId) as string,
    gasLimit,
    input,
    maxFeePerBlobGas: normalizeGasPrice(maxFeePerBlobGas),
    maxFeePerGas: normalizeGasPrice(maxFeePerGas),
    maxPriorityFeePerGas: normalizeGasPrice(maxPriorityFeePerGas),
    nonce,
    to: to as Address,
    type: "0x03",
    value,
  };

  // Check for blob data in any of the possible formats
  const blobData = extractBlobData(clientTx);

  // If we have blob data, include it flattened in the transaction
  if (blobData) {
    return {
      ...baseTransaction,
      ...blobData,
    } as TxEip4844WithSidecar;
  }

  return baseTransaction;
}

/**
 * Create an EIP-7702 transaction
 */
function createEip7702Transaction(
  clientTx: ClientSideSignTransactionOptions,
  normalizedFields: {
    input: string;
    nonce: string;
    value: string;
    to: Address | null;
    gasLimit: string;
  },
): TxEip7702 {
  const { chainId, maxFeePerGas, maxPriorityFeePerGas, authorizationList } =
    clientTx;
  const { input, nonce, value, gasLimit } = normalizedFields;
  const { to } = normalizedFields;

  // Validations
  assert(to !== null, "EIP-7702 transactions require a valid to address");
  assert(chainId, "Chain ID is required for EIP-7702 transactions");
  assert(maxFeePerGas, "Max fee per gas is required for EIP-7702 transactions");
  assert(
    maxPriorityFeePerGas,
    "Max priority fee per gas is required for EIP-7702 transactions",
  );
  assert(
    authorizationList,
    "Authorization list is required for EIP-7702 transactions",
  );

  return {
    accessList: normalizeAccessList(clientTx),
    authorizationList: normalizeAuthorizationList(authorizationList),
    chainId: normalizeChainId(chainId) as string,
    gasLimit,
    input,
    maxFeePerGas: normalizeGasPrice(maxFeePerGas),
    maxPriorityFeePerGas: normalizeGasPrice(maxPriorityFeePerGas),
    nonce,
    to: to as Address,
    type: "0x05",
    value,
  };
}

/**
 * Validate that a transaction has all required fields
 */
function validateTransaction(transaction: EthereumTypedTransaction): void {
  // Common validations for all transaction types
  assert(transaction.nonce, "Transaction nonce is required");
  assert(transaction.value, "Transaction value is required");
  assert(transaction.input, "Transaction input is required");

  // Type-specific validations
  switch (transaction.type) {
    case "0x00": // Legacy
      validateLegacyTransaction(transaction as TxLegacy);
      break;

    case "0x01": // EIP-2930
      validateEip2930Transaction(transaction as TxEip2930);
      break;

    case "0x02": // EIP-1559
      validateEip1559Transaction(transaction as TxEip1559);
      break;

    case "0x03": // EIP-4844
      // Determine if it has sidecar data
      if ("blobs" in transaction) {
        validateEip4844WithSidecarTransaction(
          transaction as TxEip4844WithSidecar,
        );
      } else {
        validateEip4844Transaction(transaction as TxEip4844);
      }
      break;

    case "0x05": // EIP-7702
      validateEip7702Transaction(transaction as TxEip7702);
      break;

    default:
      throw new ParseTransactionError(
        `Unknown transaction type: ${transaction}`,
      );
  }
}

/**
 * Validate legacy transaction
 */
function validateLegacyTransaction(tx: TxLegacy): void {
  assert(tx.gasPrice, "Legacy transaction requires gasPrice");
  assert(tx.gasLimit, "Legacy transaction requires gasLimit");
}

/**
 * Validate EIP-2930 transaction
 */
function validateEip2930Transaction(tx: TxEip2930): void {
  assert(tx.chainId, "EIP-2930 transaction requires chainId");
  assert(tx.gasPrice, "EIP-2930 transaction requires gasPrice");
  assert(tx.gasLimit, "EIP-2930 transaction requires gasLimit");
  assert(tx.accessList, "EIP-2930 transaction requires accessList");
}

/**
 * Validate EIP-1559 transaction
 */
function validateEip1559Transaction(tx: TxEip1559): void {
  assert(tx.chainId, "EIP-1559 transaction requires chainId");
  assert(tx.maxFeePerGas, "EIP-1559 transaction requires maxFeePerGas");
  assert(
    tx.maxPriorityFeePerGas,
    "EIP-1559 transaction requires maxPriorityFeePerGas",
  );
  assert(tx.gasLimit, "EIP-1559 transaction requires gasLimit");
  assert(tx.accessList, "EIP-1559 transaction requires accessList");
}

/**
 * Validate EIP-4844 transaction
 */
function validateEip4844Transaction(tx: TxEip4844): void {
  assert(tx.chainId, "EIP-4844 transaction requires chainId");
  assert(tx.maxFeePerGas, "EIP-4844 transaction requires maxFeePerGas");
  assert(
    tx.maxPriorityFeePerGas,
    "EIP-4844 transaction requires maxPriorityFeePerGas",
  );
  assert(tx.gasLimit, "EIP-4844 transaction requires gasLimit");
  assert(tx.accessList, "EIP-4844 transaction requires accessList");
  assert(
    tx.blobVersionedHashes,
    "EIP-4844 transaction requires blobVersionedHashes",
  );
  assert(tx.maxFeePerBlobGas, "EIP-4844 transaction requires maxFeePerBlobGas");
}

/**
 * Validate EIP-4844 transaction with sidecar
 */
function validateEip4844WithSidecarTransaction(tx: TxEip4844WithSidecar): void {
  // First validate base EIP-4844 fields
  validateEip4844Transaction(tx);

  // Then validate sidecar fields
  assert(
    tx.blobs && tx.blobs.length > 0,
    "EIP-4844 transaction with sidecar requires blobs",
  );
  assert(
    tx.commitments && tx.commitments.length > 0,
    "EIP-4844 transaction with sidecar requires commitments",
  );
  assert(
    tx.proofs && tx.proofs.length > 0,
    "EIP-4844 transaction with sidecar requires proofs",
  );

  // Check counts match
  assert(
    tx.blobs.length === tx.commitments.length &&
      tx.blobs.length === tx.proofs.length,
    "EIP-4844 transaction with sidecar requires matching counts of blobs, commitments, and proofs",
  );
}

/**
 * Validate EIP-7702 transaction
 */
function validateEip7702Transaction(tx: TxEip7702): void {
  assert(tx.chainId, "EIP-7702 transaction requires chainId");
  assert(tx.maxFeePerGas, "EIP-7702 transaction requires maxFeePerGas");
  assert(
    tx.maxPriorityFeePerGas,
    "EIP-7702 transaction requires maxPriorityFeePerGas",
  );
  assert(tx.gasLimit, "EIP-7702 transaction requires gasLimit");
  assert(tx.accessList, "EIP-7702 transaction requires accessList");
  assert(
    tx.authorizationList,
    "EIP-7702 transaction requires non-empty authorizationList",
    () => tx.authorizationList.length > 0,
  );
}

// Export the main parser and error type
export { parseTransaction, ParseTransactionError };
