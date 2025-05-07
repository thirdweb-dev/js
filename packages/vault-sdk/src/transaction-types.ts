// Basic types that will be used across transactions
type Address = string;
type ChainId = string; // Hex string for chain ID
type Bytes = string; // Hex string
type U256 = string; // Hex string for big numbers
type B256 = string; // 32-byte hash as hex string
type Bytes48 = string; // 48-byte value as hex string

// Common transaction destination type (address or contract creation)
type TxKind = Address | null; // null represents contract creation

// Access list for EIP-2930 and later
type AccessListEntry = {
  address: Address;
  storageKeys: string[]; // Array of hex strings representing storage keys
};
type AccessList = AccessListEntry[];

// Authorization for EIP-7702
type SignedAuthorization = {
  chainId: U256;
  address: Address;
  r: U256;
  s: U256;
  yParity: number; // 0 or 1
};

// Blob structures for EIP-4844
type Blob = string; // Raw data as string

type BlobTransactionSidecar = {
  blobs: Blob[];
  commitments: Bytes48[];
  proofs: Bytes48[];
};

// Legacy transaction (pre-EIP-2930)
type TxLegacy = {
  type: "0x00"; // Legacy
  chainId?: ChainId; // Optional for legacy transactions
  nonce: string; // Hex string
  gasPrice: string; // Hex string
  gasLimit: string; // Hex string
  to: TxKind;
  value: U256;
  input: Bytes;
};

// EIP-2930 transaction
type TxEip2930 = {
  type: "0x01"; // EIP-2930
  chainId: ChainId;
  nonce: string; // Hex string
  gasPrice: string; // Hex string
  gasLimit: string; // Hex string
  to: TxKind;
  value: U256;
  accessList: AccessList;
  input: Bytes;
};

// EIP-1559 transaction
type TxEip1559 = {
  type: "0x02"; // EIP-1559
  chainId: ChainId;
  nonce: string; // Hex string
  gasLimit: string; // Hex string
  maxFeePerGas: string; // Hex string
  maxPriorityFeePerGas: string; // Hex string
  to: TxKind;
  value: U256;
  accessList: AccessList;
  input: Bytes;
};

// EIP-7702 transaction
type TxEip7702 = {
  type: "0x05"; // EIP-7702
  chainId: ChainId;
  nonce: string; // Hex string
  gasLimit: string; // Hex string
  maxFeePerGas: string; // Hex string
  maxPriorityFeePerGas: string; // Hex string
  to: Address; // Note: different from others, only Address not TxKind
  value: U256;
  accessList: AccessList;
  authorizationList: SignedAuthorization[];
  input: Bytes;
};

// Basic EIP-4844 transaction
type TxEip4844 = {
  type: "0x03"; // EIP-4844
  chainId: ChainId;
  nonce: string; // Hex string
  gasLimit: string; // Hex string
  maxFeePerGas: string; // Hex string
  maxPriorityFeePerGas: string; // Hex string
  to: Address; // Note: only Address not TxKind
  value: U256;
  accessList: AccessList;
  blobVersionedHashes: B256[];
  maxFeePerBlobGas: string; // Hex string
  input: Bytes;
};

// EIP-4844 transaction with sidecar - flattened format
type TxEip4844WithSidecar = TxEip4844 & {
  // Flattened sidecar fields
  blobs: string[];
  commitments: Bytes48[];
  proofs: Bytes48[];
};

// Union type for all Ethereum transaction types
type EthereumTypedTransaction =
  | TxLegacy
  | TxEip2930
  | TxEip1559
  | TxEip4844
  | TxEip4844WithSidecar
  | TxEip7702;

export type {
  Address,
  ChainId,
  Bytes,
  U256,
  B256,
  Bytes48,
  TxKind,
  AccessListEntry,
  AccessList,
  SignedAuthorization,
  Blob,
  BlobTransactionSidecar,
  TxLegacy,
  TxEip2930,
  TxEip1559,
  TxEip7702,
  TxEip4844,
  TxEip4844WithSidecar,
  EthereumTypedTransaction,
};
