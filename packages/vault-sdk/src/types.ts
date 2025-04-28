import type {
  Address,
  TypedData,
  TypedDataDomain,
  TypedDataToPrimitiveTypes,
} from "abitype";
import type { EthereumTypedTransaction } from "./transaction-types.js";

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

// Encrypted types
export type EncryptedPayload = {
  ephemeralPublicKey: string;
  nonce: string;
  ciphertext: string;
};

// ========== Authentication Types ==========
type AdminKeyAuth = {
  adminKey: string;
};

type AccessTokenAuth = {
  accessToken: string;
};

type SessionTokenAuth = {
  sessionToken: string;
};

// Regular Auth union (excluding RotationCodeAuth)
export type Auth = AdminKeyAuth | AccessTokenAuth | SessionTokenAuth;

// Separate RotationCodeAuth (used only for rotation)
type RotationCodeAuth = {
  rotationCode: string;
};

// ========== Base Types ==========
// Represents Address, Bytes, U256, I256 as strings for broad compatibility
type Bytes = string; // e.g., "0x..."
// type HexString = string; // Generic hex string
type BigNumberString = string; // String representation of U256/I256

type UnencryptedError = {
  message: string;
  status: number;
  type: string;
  details?: string;
};

export type UnencryptedErrorResponse = {
  error: UnencryptedError;
};

type EncryptedError = {
  code: string;
  message: string;
  details?: string;
};

type GenericSuccessResponse<Data> = {
  success: true;
  data: Data;
  error: null;
};

type GenericErrorResponse = {
  success: false;
  data: null;
  error: EncryptedError | UnencryptedError;
};

export type VaultError = EncryptedError | UnencryptedError;

type GenericResponse<Data> =
  | GenericSuccessResponse<Data>
  | GenericErrorResponse;

// ========== Payload Type ==========
export type OmitNever<T> = {
  [K in keyof T as T[K] extends never ? never : K]: T[K];
};

export type GenericPayload<
  T extends {
    operation: string;
    auth?: Auth | RotationCodeAuth | never;
    options?: Record<string, unknown> | never;
    data: unknown;
  },
> = {
  input: OmitNever<{
    operation: T["operation"];
    options: T["options"];
    auth: T["auth"];
  }>;
  output: GenericResponse<T["data"]>;
};

// ========== Options Types ==========
type CreateServiceAccountOptions = {
  metadata: Record<string, string>;
};

type MetadataValue = string | number | boolean;

type CreateEoaOptions = {
  metadata: Record<string, MetadataValue>;
};

type GetEoasOptions = {
  page?: number;
  pageSize?: number;
};

type PingOptions = {
  message: string;
};

type SignTransactionOptions = {
  transaction: EthereumTypedTransaction;
  from: string;
};

export type SignAuthorizationOptions = {
  from: Address;
  authorization: Authorization; // Use the defined type
};

export type SignStructuredMessageOptions = {
  from: Address;
  structuredMessage: StructuredMessageInput; // Use the defined type
  chainId?: number; // Keep as number for ChainId
};

export type GetAccessTokensOptions = {
  page?: number;
  pageSize?: number;
};

type SignMessageOptions = {
  message: string;
  from: string;
  chainId?: number;
  format?: "text" | "hex";
};

type CheckedSignTypedDataOptions<
  Types extends TypedData,
  PrimaryType extends keyof Types | "EIP712Domain" = keyof Types,
> = {
  typedData: {
    domain: TypedDataDomain;
    types: Types;
    primaryType: PrimaryType;
    message: TypedDataToPrimitiveTypes<Types>[PrimaryType];
  };
  from: string;
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type SignedTypedDataOptions = CheckedSignTypedDataOptions<any, any>;

// ========== User Operation Types ==========

// Corresponds to Rust UserOperationV06Input
export type UserOperationV06Input = {
  sender: Address;
  nonce: BigNumberString; // U256
  initCode?: Bytes; // Optional due to #[serde(default)]
  callData: Bytes;
  callGasLimit: BigNumberString; // U256
  verificationGasLimit: BigNumberString; // U256
  preVerificationGas: BigNumberString; // U256
  maxFeePerGas: BigNumberString; // U256
  maxPriorityFeePerGas: BigNumberString; // U256
  paymasterAndData?: Bytes; // Optional due to #[serde(default)]
  signature?: Bytes; // Optional due to #[serde(default)]
  entrypoint?: Address; // Optional due to #[serde(default = ...)]
};

// Corresponds to Rust UserOperationV07Input
export type UserOperationV07Input = {
  sender: Address;
  nonce: BigNumberString; // U256
  factory?: Address; // Optional due to #[serde(default)]
  factoryData?: Bytes; // Optional due to #[serde(default)]
  callData: Bytes;
  callGasLimit: BigNumberString; // U256
  verificationGasLimit: BigNumberString; // U256
  preVerificationGas: BigNumberString; // U256
  maxFeePerGas: BigNumberString; // U256
  maxPriorityFeePerGas: BigNumberString; // U256
  paymaster?: Address; // Optional due to #[serde(default)]
  paymasterData?: Bytes; // Optional due to #[serde(default)] - Assuming default is empty bytes
  paymasterVerificationGasLimit?: BigNumberString; // U256 - Assuming default is 0
  paymasterPostOpGasLimit?: BigNumberString; // U256 - Assuming default is 0
  signature?: Bytes; // Optional due to #[serde(default)]
  entrypoint?: Address; // Optional due to #[serde(default = ...)]
};

// Corresponds to Rust StructuredMessageInput enum
export type StructuredMessageInput =
  | { useropV06: UserOperationV06Input }
  | { useropV07: UserOperationV07Input };

// ========== Policy Types ==========
type RegexRule = {
  pattern: string;
};

type NumberRuleOp = "greaterThan" | "lessThan" | "equalTo";

type NumberRule = {
  op: NumberRuleOp;
  value: number | BigNumberString;
};

type Rule = NumberRule | RegexRule;

type MetadataRule = {
  key: string;
  rule: Rule;
};

// ========== Policy Rule Structs ==========

// Corresponds to Rust UserOperationV06Rules
export type UserOperationV06Rules = {
  sender?: Rule;
  nonce?: Rule;
  initCode?: Rule;
  callData?: Rule;
  callGasLimit?: Rule;
  verificationGasLimit?: Rule;
  preVerificationGas?: Rule;
  maxFeePerGas?: Rule;
  maxPriorityFeePerGas?: Rule;
  paymasterAndData?: Rule;
  chainId?: Rule;
  entrypoint?: Rule; // Optional, but Rust has a default func
};

// Corresponds to Rust UserOperationV07Rules
export type UserOperationV07Rules = {
  sender?: Rule;
  nonce?: Rule;
  factory?: Rule;
  factoryData?: Rule;
  callData?: Rule;
  callGasLimit?: Rule;
  verificationGasLimit?: Rule;
  preVerificationGas?: Rule;
  maxFeePerGas?: Rule;
  maxPriorityFeePerGas?: Rule;
  paymaster?: Rule;
  paymasterVerificationGasLimit?: Rule;
  paymasterPostOpGasLimit?: Rule;
  paymasterData?: Rule;
  chainId?: Rule;
  entrypoint?: Rule; // Optional, but Rust has a default func
};

// Corresponds to Rust SignAuthorizationRules
export type SignAuthorizationRules = {
  chainId?: Rule;
  nonce?: Rule;
  address?: Rule;
};

export type PolicyComponent =
  | {
      type: "eoa:create";
      requiredMetadataPatterns?: MetadataRule[];
      allowedMetadataPatterns?: MetadataRule[];
    }
  | {
      type: "eoa:read";
      metadataPatterns?: MetadataRule[];
    }
  | {
      type: "eoa:signTransaction";
      allowlist?: Address[];
      metadataPatterns?: MetadataRule[];
      payloadPatterns: Record<string, Rule[]>;
    }
  | {
      type: "eoa:signMessage";
      allowlist?: Address[];
      metadataPatterns?: MetadataRule[];
      chainId?: number;
      messagePattern?: string;
    }
  | {
      type: "eoa:signTypedData";
      allowlist?: Address[];
      metadataPatterns?: MetadataRule[];
    }
  | {
      type: "eoa:signAuthorization";
      allowlist?: Address[];
      metadataPatterns?: MetadataRule[];
      payloadPatterns?: SignAuthorizationRules;
    }
  | {
      type: "eoa:signStructuredMessage";
      allowlist?: Address[];
      metadataPatterns?: MetadataRule[];
      // Define how UserOp rules are applied, e.g., separate for v6/v7
      structuredPatterns: {
        useropV06?: UserOperationV06Rules;
        useropV07?: UserOperationV07Rules;
      };
    }
  | {
      type: "accessToken:read";
      metadataPatterns?: MetadataRule[];
      revealSensitive: boolean;
    };

type OwnerType = string; // Define based on your eoa models

type CreateAccessTokenOptions = {
  policies: PolicyComponent[];
  expiresAt: string; // ISO date string
  metadata: Record<string, MetadataValue>;
};

type RevokeAccessTokenOptions = {
  id: string; // UUID
};

// ========== Authorization Types ==========

// Corresponds to Rust Authorization struct
export type Authorization = {
  chainId: BigNumberString; // U256
  address: Address;
  nonce: number; // u64
};

// Corresponds to Rust SignedAuthorization struct
// Merges Authorization fields due to #[serde(flatten)]
export type SignedAuthorization = Authorization & {
  yParity: number; // U8 (typically 0 or 1)
  r: BigNumberString; // U256
  s: BigNumberString; // U256
};

// ========== Response Data Types ==========
type PingData = {
  timestamp: number;
  pong: string;
};

type CreateServiceAccountData = {
  id: string; // UUID
  adminKey: string;
  rotationCode: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};

type GetServiceAccountData = {
  id: string; // UUID
  metadata: Record<string, string>;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};

type RotateServiceAccountData = {
  newAdminKey: string;
  newRotationCode: string;
};

type EoaData = {
  id: string; // UUID
  address: string;
  metadata: Record<string, MetadataValue>;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};

type GetEoasData = {
  items: EoaData[];
  page: number;
  pageSize: number;
  totalRecords: number;
};

type SignTransactionData = {
  signature: string;
};

type SignMessageData = {
  signature: string;
};

type SignTypedDataData = {
  signature: string;
};

type CreateAccessTokenData = {
  accessToken: string;
  id: string; // UUID
  issuerId: string; // UUID
  issuerType: OwnerType;
  policies: PolicyComponent[];
  expiresAt: string; // ISO date string
  metadata: Record<string, MetadataValue>;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  revokedAt?: string; // ISO date string
};

type RevokeAccessTokenData = {
  id: string; // UUID
  issuerId: string; // UUID
  issuerType: OwnerType;
  policies: PolicyComponent[];
  expiresAt: string; // ISO date string
  metadata: Record<string, MetadataValue>;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  revokedAt?: string; // ISO date string
};

// Update SignAuthorizationData to use the defined SignedAuthorization type
export type SignAuthorizationData = {
  signedAuthorization: SignedAuthorization; // Use the defined type
};

// Add SignStructuredMessageData (as defined previously)
export type SignStructuredMessageData = {
  signature: Bytes;
  message: string; // This likely represents the UserOp hash in Rust
};

// Add AccessTokenData (as defined previously, ensure OwnerType/MetadataValue are correct)
export type AccessTokenData = {
  id: string; // UUID
  issuerId: string; // UUID
  // Only present if revealSensitive is true for the policy being used to read. Always returned for admin.
  accessToken?: string | null;
  issuerType: OwnerType;
  policies: PolicyComponent[];
  expiresAt: string; // ISO date string
  metadata: Record<string, MetadataValue>;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  revokedAt?: string | null; // ISO date string or null
};

// Add GetAccessTokensData (as defined previously)
export type GetAccessTokensData = {
  items: AccessTokenData[];
  page: number;
  pageSize: number;
  totalRecords: number; // Rust uses u64, TS uses number
};

// ========== Operation Payloads ==========
export type PingPayload = GenericPayload<{
  operation: "ping";
  options: PingOptions;
  auth: never;
  data: PingData;
}>;

export type CreateServiceAccountPayload = GenericPayload<{
  operation: "serviceAccount:create";
  options: CreateServiceAccountOptions;
  auth: never;
  data: CreateServiceAccountData;
}>;

export type GetServiceAccountPayload = GenericPayload<{
  operation: "serviceAccount:get";
  options: never;
  auth: Auth;
  data: GetServiceAccountData;
}>;

export type RotateServiceAccountPayload = GenericPayload<{
  operation: "serviceAccount:rotate";
  options: never;
  auth: RotationCodeAuth; // Only accepts RotationCodeAuth
  data: RotateServiceAccountData;
}>;

export type CreateEoaPayload = GenericPayload<{
  operation: "eoa:create";
  auth: Auth;
  options: CreateEoaOptions;
  data: EoaData;
}>;

export type ListEoaPayload = GenericPayload<{
  operation: "eoa:list";
  auth: Auth;
  options: GetEoasOptions;
  data: GetEoasData;
}>;

export type SignTransactionPayload = GenericPayload<{
  operation: "eoa:signTransaction";
  auth: Auth;
  options: SignTransactionOptions;
  data: SignTransactionData;
}>;

export type SignAuthorizationPayload = GenericPayload<{
  operation: "eoa:signAuthorization";
  auth: Auth; // Assuming Auth is defined as before
  options: SignAuthorizationOptions;
  data: SignAuthorizationData;
}>;

// Add SignStructuredMessagePayload (using defined types)
export type SignStructuredMessagePayload = GenericPayload<{
  operation: "eoa:signStructuredMessage";
  auth: Auth; // Assuming Auth is defined as before
  options: SignStructuredMessageOptions;
  data: SignStructuredMessageData;
}>;

export type CheckedSignTypedDataPayload<
  Types extends TypedData,
  PrimaryType extends keyof Types | "EIP712Domain" = keyof Types,
> = GenericPayload<{
  operation: "eoa:signTypedData";
  auth: Auth;
  options: CheckedSignTypedDataOptions<Types, PrimaryType>;
  data: SignTypedDataData;
}>;

export type SignTypedDataPayload = GenericPayload<{
  operation: "eoa:signTypedData";
  auth: Auth;
  options: SignedTypedDataOptions;
  data: SignTypedDataData;
}>;

export type SignMessagePayload = GenericPayload<{
  operation: "eoa:signMessage";
  auth: Auth;
  options: SignMessageOptions;
  data: SignMessageData;
}>;

export type CreateAccessTokenPayload = GenericPayload<{
  operation: "accessToken:create";
  auth: Auth;
  options: CreateAccessTokenOptions;
  data: CreateAccessTokenData;
}>;

// Add ListAccessTokensPayload (using defined types)
export type ListAccessTokensPayload = GenericPayload<{
  operation: "accessToken:list";
  auth: Auth;
  data: GetAccessTokensData;
}>;

export type RevokeAccessTokenPayload = GenericPayload<{
  operation: "accessToken:revoke";
  auth: Auth;
  options: RevokeAccessTokenOptions;
  data: RevokeAccessTokenData;
}>;

// ========== Union of all payloads ==========
export type Payload =
  | PingPayload
  | CreateServiceAccountPayload
  | GetServiceAccountPayload
  | RotateServiceAccountPayload
  | CreateEoaPayload
  | ListEoaPayload
  | SignTransactionPayload
  | SignMessagePayload
  | SignTypedDataPayload
  | CreateAccessTokenPayload
  | RevokeAccessTokenPayload
  | SignAuthorizationPayload
  | SignStructuredMessagePayload
  | ListAccessTokensPayload;
